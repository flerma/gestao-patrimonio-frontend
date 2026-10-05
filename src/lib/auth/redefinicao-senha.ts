/**
 * Passa o e-mail da tela "Esqueceu a sua senha?" para a tela de redefinição
 * sem colocá-lo na URL (dado pessoal). sessionStorage: some ao fechar a aba.
 */
const CHAVE = "gpi:redefinir-senha-email";

export function guardarEmailRedefinicao(email: string) {
  try {
    sessionStorage.setItem(CHAVE, email);
  } catch {
    // Navegação privada/armazenamento bloqueado: a tela de redefinição pede o e-mail de novo.
  }
}

export function lerEmailRedefinicao(): string | null {
  try {
    return sessionStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function limparEmailRedefinicao() {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    // ignora
  }
}
