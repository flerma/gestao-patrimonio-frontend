import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Critérios de senha — os mesmos validados pelo backend (regex de CadastroRequest/RedefinirSenhaRequest). */
export const CRITERIOS_SENHA = [
  { label: "Pelo menos 8 caracteres", testar: (senha: string) => senha.length >= 8 },
  { label: "Uma letra maiúscula", testar: (senha: string) => /[A-Z]/.test(senha) },
  { label: "Uma letra minúscula", testar: (senha: string) => /[a-z]/.test(senha) },
  { label: "Um número", testar: (senha: string) => /[0-9]/.test(senha) },
  { label: "Um caractere especial", testar: (senha: string) => /[^A-Za-z0-9]/.test(senha) },
];

export function senhaAtendeCriterios(senha: string) {
  return CRITERIOS_SENHA.every((c) => c.testar(senha));
}

export function avaliarCriterios(senha: string, confirmarSenha: string) {
  return [
    ...CRITERIOS_SENHA.map((c) => ({ label: c.label, atendido: c.testar(senha) })),
    {
      label: "As senhas coincidem",
      atendido: senha.length > 0 && senha === confirmarSenha,
    },
  ];
}

/** Lista dos critérios, cada um verde quando cumprido e vermelho quando não. */
export function PasswordChecklist({
  senha,
  confirmarSenha,
}: {
  senha: string;
  confirmarSenha: string;
}) {
  const criterios = avaliarCriterios(senha, confirmarSenha);
  return (
    <ul className="space-y-1 text-sm">
      {criterios.map((criterio) => (
        <li
          key={criterio.label}
          className={cn(
            "flex items-center gap-1.5",
            criterio.atendido ? "text-emerald-600" : "text-destructive",
          )}
        >
          {criterio.atendido ? (
            <Check className="size-3.5 shrink-0" />
          ) : (
            <X className="size-3.5 shrink-0" />
          )}
          {criterio.label}
        </li>
      ))}
    </ul>
  );
}
