import type { BadgeProps } from "@/components/ui/badge";
import type {
  IndiceReajuste,
  ProvedorAutenticacao,
  StatusContrato,
  StatusImovel,
  StatusInquilino,
  StatusUsuario,
  TipoContrato,
  TipoGarantia,
  TipoImovel,
  TipoPessoa,
} from "@/lib/types";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

export const tipoImovelLabels: Record<TipoImovel, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  SALA_COMERCIAL: "Sala comercial",
  LOJA: "Loja",
  GALPAO: "Galpão",
  TERRENO: "Terreno",
  SITIO: "Sítio",
  FAZENDA: "Fazenda",
  KITNET: "Kitnet",
  GARAGEM: "Garagem",
  OUTRO: "Outro",
};

export const statusImovelLabels: Record<StatusImovel, string> = {
  ALUGADO: "Alugado",
  DISPONIVEL: "Disponível",
  OCUPADO_PELO_PROPRIETARIO: "Uso próprio",
};

export const statusImovelVariant: Record<StatusImovel, BadgeVariant> = {
  ALUGADO: "success",
  DISPONIVEL: "warning",
  OCUPADO_PELO_PROPRIETARIO: "secondary",
};

export const tipoPessoaLabels: Record<TipoPessoa, string> = {
  FISICA: "Pessoa física",
  JURIDICA: "Pessoa jurídica",
};

export const statusInquilinoLabels: Record<StatusInquilino, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export const statusInquilinoVariant: Record<StatusInquilino, BadgeVariant> = {
  ATIVO: "success",
  INATIVO: "secondary",
};

export const tipoContratoLabels: Record<TipoContrato, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  TEMPORADA: "Temporada",
  ARRENDAMENTO_RURAL: "Arrendamento rural",
};

export const statusContratoLabels: Record<StatusContrato, string> = {
  RASCUNHO: "Rascunho",
  ATIVO: "Ativo",
  ENCERRADO: "Encerrado",
  RESCINDIDO: "Rescindido",
};

export const statusContratoVariant: Record<StatusContrato, BadgeVariant> = {
  RASCUNHO: "secondary",
  ATIVO: "success",
  ENCERRADO: "outline",
  RESCINDIDO: "danger",
};

export const indiceReajusteLabels: Record<IndiceReajuste, string> = {
  IPCA: "IPCA",
  IGP_M: "IGP-M",
  INPC: "INPC",
  FIXO: "Percentual fixo",
  SEM_REAJUSTE: "Sem reajuste",
};

export const tipoGarantiaLabels: Record<TipoGarantia, string> = {
  SEM_GARANTIA: "Sem garantia",
  CAUCAO: "Caução",
  FIADOR: "Fiador",
  SEGURO_FIANCA: "Seguro-fiança",
  TITULO_CAPITALIZACAO: "Título de capitalização",
  OUTRA: "Outra",
};

export const provedorAutenticacaoLabels: Record<ProvedorAutenticacao, string> = {
  LOCAL: "Local",
  GOOGLE: "Google",
  FACEBOOK: "Facebook",
};

export const statusUsuarioLabels: Record<StatusUsuario, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export const statusUsuarioVariant: Record<StatusUsuario, BadgeVariant> = {
  ATIVO: "success",
  INATIVO: "secondary",
};
