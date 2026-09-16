"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/components/providers";
import { authApi, ApiError } from "@/lib/api";
import type { RegistrarRequest } from "@/lib/api";

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

export function useRegistrar() {
  return useMutation({
    mutationFn: (body: RegistrarRequest) => authApi.registrar(body),
    onError: (error) =>
      toast.error(errorMessage(error, "Não foi possível concluir o cadastro.")),
  });
}
