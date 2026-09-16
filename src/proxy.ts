import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies";

/**
 * Guarda de sessão "otimista": só checa a PRESENÇA dos cookies de sessão,
 * evitando o flash do shell do dashboard para um visitante deslogado. A
 * validade real do token é sempre revalidada pelo backend em cada chamada de
 * API de verdade (via o proxy catch-all `src/app/api/[...path]/route.ts`).
 *
 * Nota: a partir do Next.js 16 o arquivo `middleware.ts` foi renomeado para
 * `proxy.ts` (mesmo comportamento, nome do arquivo/função trocado — ver
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).
 * `middleware.ts` ainda funcionaria (deprecated), mas seguimos a convenção
 * atual.
 */

const AUTH_PATHS = ["/login", "/cadastro"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession =
    request.cookies.has(ACCESS_TOKEN_COOKIE) ||
    request.cookies.has(REFRESH_TOKEN_COOKIE);

  const isAuthPath = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!hasSession && !isAuthPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a tudo, exceto /api/*, internos do Next e arquivos estáticos.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
