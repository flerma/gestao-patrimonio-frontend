import { concluirLoginNoBackend } from "@/lib/auth/backend-login";

/** Login com Google: repassa o ID token do Google ao backend e grava a sessão. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return concluirLoginNoBackend("/api/auth/google", body);
}
