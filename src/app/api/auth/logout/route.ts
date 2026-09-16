import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { resolveBackendUrl } from "@/lib/api/backend-url";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { clearSessionCookies } from "@/lib/auth/server-refresh";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    try {
      await fetch(`${resolveBackendUrl()}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch {
      // Ignora falhas do backend — o objetivo é sempre limpar a sessão local.
    }
  }

  clearSessionCookies(cookieStore);

  return new NextResponse(null, { status: 204 });
}
