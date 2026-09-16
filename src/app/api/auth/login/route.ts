import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { resolveBackendUrl } from "@/lib/api/backend-url";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_COOKIE,
  displayCookieOptions,
  secureCookieOptions,
} from "@/lib/auth/cookies";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  usuario: { id: string; nome: string; email: string; [key: string]: unknown };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${resolveBackendUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Falha de conexão com a API. Verifique se o backend está no ar." },
      { status: 502 },
    );
  }

  const text = await backendResponse.text();
  const parsed = text ? safeJsonParse(text) : null;

  if (!backendResponse.ok) {
    return NextResponse.json(parsed ?? { message: "Erro ao autenticar." }, {
      status: backendResponse.status,
    });
  }

  const data = parsed as LoginResponse;
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    ...secureCookieOptions,
    maxAge: data.expiresIn ?? ACCESS_TOKEN_MAX_AGE,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    ...secureCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  cookieStore.set(
    USER_COOKIE,
    JSON.stringify({
      id: data.usuario.id,
      nome: data.usuario.nome,
      email: data.usuario.email,
    }),
    { ...displayCookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE },
  );

  // Nunca repassa os tokens ao corpo recebido pelo navegador.
  return NextResponse.json({ usuario: data.usuario }, { status: 200 });
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
