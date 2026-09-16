/**
 * URL base do backend Spring Boot, resolvida no servidor (Route Handlers).
 *
 * Usa a mesma variável de ambiente que antes alimentava o `rewrites()` do
 * `next.config.ts` (`API_PROXY_TARGET`). Agora quem encaminha as requisições
 * para o backend é o catch-all `src/app/api/[...path]/route.ts` (e os demais
 * Route Handlers em `src/app/api/auth/*`), não mais o Next.js.
 */
export function resolveBackendUrl(): string {
  const target = process.env.API_PROXY_TARGET?.replace(/\/$/, "");
  return target || "http://localhost:8080";
}
