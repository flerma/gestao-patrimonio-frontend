import type { NextConfig } from "next";

// `API_PROXY_TARGET` agora é lido pelo Route Handler catch-all
// (`src/app/api/[...path]/route.ts`) e pelos Route Handlers de auth
// (`src/app/api/auth/*`), via `src/lib/api/backend-url.ts`. O antigo
// `rewrites()` foi removido porque não permitia injetar o header
// `Authorization` por requisição (necessário para o novo fluxo JWT).
const nextConfig: NextConfig = {};

export default nextConfig;
