import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { resolveBackendUrl } from "@/lib/api/backend-url";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { clearSessionCookies, refreshAccessToken } from "@/lib/auth/server-refresh";

/**
 * Proxy catch-all: encaminha tudo em `/api/*` (exceto `/api/auth/*`, que tem
 * Route Handlers próprios e tem prioridade de roteamento por serem mais
 * específicos) para o backend Spring Boot, injetando
 * `Authorization: Bearer <accessToken>` a partir do cookie httpOnly.
 *
 * Substitui o antigo `rewrites()` de `next.config.ts` — aquele apenas
 * encaminhava a URL sem poder inspecionar/injetar cabeçalhos por requisição.
 *
 * Em um 401 do backend, tenta UMA renovação silenciosa (reusando
 * `refreshAccessToken`, compartilhado com `api/auth/refresh/route.ts`) e
 * repete a chamada original uma vez. Se ainda assim vier 401, limpa os
 * cookies de sessão e repassa o 401 ao cliente (o `apiFetch`/`AuthContext`
 * do lado do cliente trata isso redirecionando para /login).
 */

// Cabeçalhos que não devem ser repassados como vieram (hop-by-hop ou
// específicos do transporte HTTP local).
const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "cookie",
  "content-length",
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

// Respostas com esses status não podem ter corpo (spec do Fetch): passar
// qualquer body para o construtor de Response/NextResponse, mesmo vazio,
// lança TypeError ("Response with null body status cannot have body").
const NULL_BODY_STATUSES = new Set([101, 103, 204, 205, 304]);

function buildForwardHeaders(request: NextRequest, accessToken?: string) {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  headers.set("Accept", "application/json");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else {
    headers.delete("Authorization");
  }
  return headers;
}

function buildResponseHeaders(source: Headers) {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  return headers;
}

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const cookieStore = await cookies();

  const targetUrl = `${resolveBackendUrl()}/api/${path.join("/")}${request.nextUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  const forward = (accessToken?: string) =>
    fetch(targetUrl, {
      method: request.method,
      headers: buildForwardHeaders(request, accessToken),
      body,
      cache: "no-store",
    });

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  let backendResponse = await forward(accessToken);

  if (backendResponse.status === 401) {
    const newAccessToken = await refreshAccessToken(cookieStore);
    if (newAccessToken) {
      backendResponse = await forward(newAccessToken);
    }
    if (backendResponse.status === 401) {
      clearSessionCookies(cookieStore);
    }
  }

  const responseBody = NULL_BODY_STATUSES.has(backendResponse.status)
    ? null
    : await backendResponse.arrayBuffer();
  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: buildResponseHeaders(backendResponse.headers),
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
