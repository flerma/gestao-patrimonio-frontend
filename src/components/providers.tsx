"use client";

import * as React from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

import { ApiError, authApi, type AuthUsuario } from "@/lib/api";
import { Toaster } from "@/components/ui/sonner";

const SELECTED_USER_KEY = "gpi:selected-usuario";

interface SelectedUserContextValue {
  usuarioId: string | null;
  setUsuarioId: (id: string | null) => void;
}

const SelectedUserContext = React.createContext<SelectedUserContextValue>({
  usuarioId: null,
  setUsuarioId: () => {},
});

export function useSelectedUser() {
  return React.useContext(SelectedUserContext);
}

// ---------- Autenticação ----------
// Contexto de autenticação (login/cadastro JWT). Não confundir com
// `SelectedUserContext` acima, que é o filtro de "proprietário" do
// dashboard — um conceito completamente diferente que continua existindo.

interface AuthContextValue {
  usuario: AuthUsuario | null;
  carregando: boolean;
  refetch: () => Promise<void>;
  login: (usuario: string, senha: string) => Promise<AuthUsuario>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue>({
  usuario: null,
  carregando: true,
  refetch: async () => {},
  login: async () => {
    throw new Error("AuthProvider ausente");
  },
  logout: async () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = React.useState<AuthUsuario | null>(null);
  const [carregando, setCarregando] = React.useState(true);

  const refetch = React.useCallback(async () => {
    try {
      const { usuario: current } = await authApi.me();
      setUsuario(current);
    } catch {
      // 401 (ou backend fora do ar): trata como deslogado. O redirecionamento
      // forçado de rotas protegidas fica a cargo de `src/proxy.ts`.
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const login = React.useCallback(async (usuarioLogin: string, senha: string) => {
    const { usuario: logado } = await authApi.login({
      usuario: usuarioLogin,
      senha,
    });
    setUsuario(logado);
    return logado;
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignora falhas do backend — o objetivo é sempre encerrar a sessão local.
    }
    setUsuario(null);
    router.push("/login");
  }, [router]);

  const value = React.useMemo(
    () => ({ usuario, carregando, refetch, login, logout }),
    [usuario, carregando, refetch, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function handleGlobalQueryError(error: unknown) {
  if (
    error instanceof ApiError &&
    error.status === 401 &&
    typeof window !== "undefined"
  ) {
    const { pathname } = window.location;
    if (pathname !== "/login" && pathname !== "/cadastro") {
      window.location.href = "/login";
    }
  }
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleGlobalQueryError }),
    mutationCache: new MutationCache({ onError: handleGlobalQueryError }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [usuarioId, setUsuarioIdState] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Restaura o proprietário selecionado após a hidratação.
    try {
      const stored = window.localStorage.getItem(SELECTED_USER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setUsuarioIdState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setUsuarioId = React.useCallback((id: string | null) => {
    setUsuarioIdState(id);
    try {
      if (id) window.localStorage.setItem(SELECTED_USER_KEY, id);
      else window.localStorage.removeItem(SELECTED_USER_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(
    () => ({ usuarioId, setUsuarioId }),
    [usuarioId, setUsuarioId],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SelectedUserContext.Provider value={value}>
          {children}
        </SelectedUserContext.Provider>
      </AuthProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
