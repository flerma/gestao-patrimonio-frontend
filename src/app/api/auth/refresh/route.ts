import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { refreshAccessToken } from "@/lib/auth/server-refresh";

/**
 * Endpoint chamado explicitamente pelo cliente para renovar a sessão (ex.:
 * ao hidratar a app ou antes de uma ação sensível). A mesma lógica é reusada
 * internamente pelo proxy catch-all (`src/app/api/[...path]/route.ts`) para
 * um refresh silencioso quando uma chamada de API retorna 401.
 */
export async function POST() {
  const cookieStore = await cookies();
  const accessToken = await refreshAccessToken(cookieStore);

  if (!accessToken) {
    return NextResponse.json(
      { message: "Usuário ou senha inválidos" },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
