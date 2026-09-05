"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ApiError } from "@/lib/api";
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

function makeQueryClient() {
  return new QueryClient({
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
      <SelectedUserContext.Provider value={value}>
        {children}
      </SelectedUserContext.Provider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
