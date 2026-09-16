/**
 * Nomes e opções dos cookies de sessão usados pelos Route Handlers de auth
 * (`src/app/api/auth/*`) e pelo proxy catch-all (`src/app/api/[...path]`).
 */

export const ACCESS_TOKEN_COOKIE = "gpi_access_token";
export const REFRESH_TOKEN_COOKIE = "gpi_refresh_token";
/** Cache não-sensível (não httpOnly) de `{id,nome,email}` para hidratar a UI. */
export const USER_COOKIE = "gpi_user";

export const ACCESS_TOKEN_MAX_AGE = 3600; // 1 hora — mesmo valor do `expiresIn` do backend.
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias.

const isProduction = process.env.NODE_ENV === "production";

export const secureCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
};

/** Cookie de exibição: legível no cliente, então sem `httpOnly`. */
export const displayCookieOptions = {
  httpOnly: false,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
};
