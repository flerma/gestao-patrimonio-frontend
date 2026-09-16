import { NextResponse } from "next/server";

import { resolveBackendUrl } from "@/lib/api/backend-url";

/**
 * Passthrough puro para `POST /api/auth/registrar` no backend. Cadastro não
 * loga o usuário (sem cookies aqui) — o produto redireciona para /login após
 * o sucesso.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${resolveBackendUrl()}/api/auth/registrar`, {
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

  return NextResponse.json(parsed, { status: backendResponse.status });
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
