import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE, USER_COOKIE } from "@/lib/auth/cookies";

/**
 * Hidratação de UI: não existe `/api/auth/me` no backend. Em vez de decodificar
 * o JWT (payload não-assinado, só serviria para exibição) optamos pela
 * abordagem mais simples e robusta sugerida na spec: `login/route.ts` também
 * grava um cookie legível (não httpOnly) `gpi_user` com
 * `{id, nome, email, role}` a partir da resposta do login. Aqui só verificamos que a
 * sessão ainda existe (cookie de access token presente) e devolvemos o cache.
 * Nunca é usado para decisões de autorização — o backend revalida o JWT em
 * toda chamada real via o proxy catch-all.
 */
export async function GET() {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has(ACCESS_TOKEN_COOKIE);
  const userCookie = cookieStore.get(USER_COOKIE)?.value;

  if (!hasAccessToken || !userCookie) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  try {
    const usuario = JSON.parse(userCookie);
    return NextResponse.json({ usuario }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }
}
