import type { cookies } from "next/headers";

import { resolveBackendUrl } from "@/lib/api/backend-url";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  USER_COOKIE,
  secureCookieOptions,
} from "@/lib/auth/cookies";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

interface RefreshResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  usuario: unknown;
}

/**
 * Troca o refresh token (lido do cookie) por um novo access token junto ao
 * backend, atualizando o cookie `gpi_access_token` em caso de sucesso.
 *
 * Usado tanto por `src/app/api/auth/refresh/route.ts` (chamado
 * explicitamente pelo cliente) quanto pelo proxy catch-all
 * `src/app/api/[...path]/route.ts` (refresh silencioso de um 401).
 *
 * Em caso de falha (sem refresh token, ou refresh token inválido/expirado),
 * limpa os três cookies de sessão e retorna `null`.
 */
export async function refreshAccessToken(
  cookieStore: CookieStore,
): Promise<string | null> {
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    clearSessionCookies(cookieStore);
    return null;
  }

  let response: Response;
  try {
    response = await fetch(`${resolveBackendUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    // Backend indisponível: não derruba a sessão, apenas falha esta tentativa.
    return null;
  }

  if (!response.ok) {
    clearSessionCookies(cookieStore);
    return null;
  }

  const data = (await response.json()) as RefreshResponse;

  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    ...secureCookieOptions,
    maxAge: data.expiresIn ?? ACCESS_TOKEN_MAX_AGE,
  });

  return data.accessToken;
}

export function clearSessionCookies(cookieStore: CookieStore) {
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
}
