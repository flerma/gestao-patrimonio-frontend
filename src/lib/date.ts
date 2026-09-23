/**
 * Máscara de data no formato brasileiro (dd/MM/yyyy), independente do
 * locale/idioma do dispositivo — usada no lugar de `<input type="date">`,
 * cujo formato de exibição segue o locale do navegador (em celulares com
 * locale en-US, por exemplo, aparece MM/dd/yyyy).
 */
export function maskDateBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/** Converte "dd/MM/yyyy" para "yyyy-MM-dd" (ISO), ou undefined se incompleta/inválida. */
export function parseDateBRToIso(masked: string): string | undefined {
  const match = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;

  const [, ddStr, mmStr, yyyyStr] = match;
  const dia = Number(ddStr);
  const mes = Number(mmStr);
  const ano = Number(yyyyStr);

  const data = new Date(ano, mes - 1, dia);
  const valida =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  return valida ? `${yyyyStr}-${mmStr}-${ddStr}` : undefined;
}

/** Converte "yyyy-MM-dd" (ISO) para "dd/MM/yyyy". */
export function formatIsoToDateBR(iso: string | undefined | null): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}
