"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/components/providers";
import { authApi, ApiError } from "@/lib/api";
import type { RegistrarRequest } from "@/lib/api";
import type { RedefinirSenhaRequest } from "@/lib/api/auth";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

/**
 * Mutation de login. A chamada de rede (`POST /api/auth/login`) e a
 * atualização do estado de `AuthContext` acontecem juntas dentro de
 * `useAuth().login` (ver `src/components/providers.tsx`), evitando duas
 * requisições separadas — este hook só empresta o `isPending`/`onError` do
 * TanStack Query ao formulário.
 */
export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ usuario, senha }: { usuario: string; senha: string }) =>
      login(usuario, senha),
    onError: (error) =>
      toast.error(errorMessage(error, "Usuário ou senha inválidos.")),
  });
}

/** Mutation de login com Google — recebe o ID token entregue pelo botão do Google. */
export function useLoginGoogle() {
  const { loginGoogle } = useAuth();
  return useMutation({
    mutationFn: (idToken: string) => loginGoogle(idToken),
    onError: (error) =>
      toast.error(errorMessage(error, "Não foi possível entrar com o Google.")),
  });
}

export function useRegistrar() {
  return useMutation({
    mutationFn: (body: RegistrarRequest) => authApi.registrar(body),
    onError: (error) =>
      toast.error(errorMessage(error, "Não foi possível concluir o cadastro.")),
  });
}

/**
 * Envia (ou reenvia) o código de redefinição de senha. Com `silencioso`, não
 * mostra toast de erro (a tela exibe a mensagem no próprio formulário).
 */
export function useSolicitarCodigoSenha({ silencioso = false }: { silencioso?: boolean } = {}) {
  return useMutation({
    mutationFn: (email: string) => authApi.esqueciSenha(email),
    onError: (error) => {
      if (!silencioso) toast.error(errorMessage(error, "Não foi possível enviar o código."));
    },
  });
}

/** Confere o código e grava a nova senha (erros tratados pela tela). */
export function useRedefinirSenha() {
  return useMutation({
    mutationFn: (body: RedefinirSenhaRequest) => authApi.redefinirSenha(body),
  });
}
