/**
 * URL base da API.
 * - Vazio (padrão): usa caminho relativo `/api/...`, atendido pelo proxy do
 *   Next.js (ver `next.config.ts` / variável `API_PROXY_TARGET`). Evita CORS.
 * - Definido (ex.: http://localhost:8080): chama a API diretamente. Nesse caso
 *   a API precisa liberar CORS para a origem do frontend.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const base =
    API_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost");
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, query, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (cause) {
    throw new Error(
      "Falha de conexão com a API. Verifique se o backend está no ar.",
      { cause },
    );
  }

  const text = await response.text();
  const parsed = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const record =
      parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : null;
    const message =
      (record &&
        (record.message
          ? String(record.message)
          : record.detail
            ? String(record.detail)
            : record.error
              ? String(record.error)
              : null)) ||
      `Erro ${response.status} ao chamar ${path}`;
    throw new ApiError(response.status, message, parsed);
  }

  return parsed as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
