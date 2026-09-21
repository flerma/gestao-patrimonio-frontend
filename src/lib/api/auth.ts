import { apiFetch } from "./client";
import type { RoleUsuario } from "@/lib/types";

/**
 * Usuário autenticado, conforme devolvido pelos Route Handlers de auth
 * (`src/app/api/auth/*`) — nunca inclui `senha`.
 */
export interface AuthUsuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  provedorAutenticacao?: string;
  idUsuarioProvedor?: string | null;
  status?: string;
  role: RoleUsuario;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface RegistrarRequest {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
}

const BASE = "/api/auth";

/**
 * Wrappers finos em torno dos Route Handlers de auth (não do backend
 * diretamente — os Route Handlers é que possuem a lógica de cookies).
 */
export const authApi = {
  login: (body: LoginRequest) =>
    apiFetch<{ usuario: AuthUsuario }>(`${BASE}/login`, {
      method: "POST",
      body,
    }),
  registrar: (body: RegistrarRequest) =>
    apiFetch<AuthUsuario>(`${BASE}/registrar`, { method: "POST", body }),
  logout: () => apiFetch<void>(`${BASE}/logout`, { method: "POST" }),
  me: () => apiFetch<{ usuario: AuthUsuario }>(`${BASE}/me`),
};
