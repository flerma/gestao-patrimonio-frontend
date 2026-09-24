import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE, USER_COOKIE } from "@/lib/auth/cookies";
import { refreshAccessToken } from "@/lib/auth/server-refresh";

/**
 * Hidratação de UI: não existe `/api/auth/me` no backend. Em vez de decodificar
 * o JWT (payload não-assinado, só serviria para exibição) optamos pela
 * abordagem mais simples e robusta sugerida na spec: `login/route.ts` também
 * grava um cookie legível (não httpOnly) `gpi_user` com
 * `{id, nome, email, role}` a partir da resposta do login. Aqui só verificamos que a
 * sessão ainda existe (cookie de access token presente) e devolvemos o cache.
 * Nunca é usado para decisões de autorização — o backend revalida o JWT em
 * toda chamada real via o proxy catch-all.
 *
 * O access token dura só 1h; o refresh token dura 7 dias. Se a aba fica
 * aberta por mais de 1h, o cookie de access token já expirou (o navegador
 * nem chega a enviá-lo) mesmo com a sessão continuando válida via refresh
 * token. Antes desta rota simplesmente devolvia 401 nesse caso — e como o
 * `AuthProvider` só chama `/me` uma vez, ao montar, o nome do usuário
 * sumia e só voltava num F5 *seguinte* a alguma outra chamada (via o proxy
 * catch-all) ter renovado o access token em silêncio nos bastidores. Agora
 * tenta a mesma renovação silenciosa aqui, igual ao proxy catch-all, antes
 * de considerar a sessão encerrada.
 */
export async function GET() {
  const cookieStore = await cookies();
  let hasAccessToken = cookieStore.has(ACCESS_TOKEN_COOKIE);

  if (!hasAccessToken) {
    const novoAccessToken = await refreshAccessToken(cookieStore);
    hasAccessToken = Boolean(novoAccessToken);
  }

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
