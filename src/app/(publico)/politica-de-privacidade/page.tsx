import type { Metadata } from "next";
import Link from "next/link";

import { DocumentoLegal, EmailContato, Lista, Secao } from "@/components/legal/documento-legal";
import { NOME_SISTEMA, RESPONSAVEL_SISTEMA, ROTA_TERMOS_USO } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como o ${NOME_SISTEMA} coleta, usa, armazena e protege os dados pessoais dos seus usuários.`,
};

export default function PoliticaPrivacidadePage() {
  return (
    <DocumentoLegal
      titulo="Política de Privacidade"
      introducao={
        <p>
          Esta Política de Privacidade explica como o <strong>{NOME_SISTEMA}</strong>, sistema
          de gestão de patrimônio imobiliário (imóveis, inquilinos, contratos de locação e
          aluguéis) disponível na web e em aplicativo móvel, coleta, usa, armazena, compartilha
          e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais
          (Lei nº 13.709/2018 — LGPD). Ao usar o sistema, você declara que leu e compreendeu
          esta política.
        </p>
      }
    >
      <Secao numero={1} titulo="Quem é o responsável pelos dados">
        <p>
          O responsável (controlador) pelos dados pessoais dos usuários cadastrados é{" "}
          <strong>{RESPONSAVEL_SISTEMA}</strong>. Dúvidas, solicitações e o contato com o
          encarregado pelo tratamento de dados pessoais podem ser feitos pelo e-mail{" "}
          <EmailContato />.
        </p>
      </Secao>

      <Secao numero={2} titulo="Dados que coletamos">
        <p>
          <strong>a) Dados da sua conta:</strong>
        </p>
        <Lista>
          <li>nome, e-mail e telefone informados no cadastro;</li>
          <li>senha, armazenada somente de forma criptografada (hash) — nunca em texto legível;</li>
          <li>perfil de acesso (usuário ou administrador) e datas de criação e atualização da conta.</li>
        </Lista>
        <p>
          <strong>b) Dados recebidos do Google</strong>, quando você escolhe &quot;Entrar com
          Google&quot;: nome, endereço de e-mail, confirmação de que o e-mail é verificado e o
          identificador da sua conta Google. Não temos acesso à sua senha do Google nem a
          outros dados da sua conta (como Gmail, contatos, agenda ou arquivos).
        </p>
        <p>
          <strong>c) Dados que você cadastra no sistema</strong> para gerir o seu patrimônio:
        </p>
        <Lista>
          <li>imóveis: nome, tipo, endereço, valores e data de aquisição e situação;</li>
          <li>
            inquilinos: nome, CPF ou CNPJ, e-mail, telefone, data de nascimento, endereço e
            observações;
          </li>
          <li>
            contratos de locação: partes, vigência, valores, dia de vencimento, índice de
            reajuste e garantia;
          </li>
          <li>aluguéis: competências, vencimentos, valores previstos e pagos, datas e formas de pagamento.</li>
        </Lista>
        <p>
          <strong>d) Dados técnicos:</strong> cookies de sessão estritamente necessários para
          manter você conectado (seção 7); no aplicativo móvel, o identificador do aparelho para
          notificações (token de push) e a plataforma (Android/iOS); e registros técnicos de
          acesso ao servidor (como data, hora e endereço IP), usados para segurança e correção
          de falhas.
        </p>
      </Secao>

      <Secao numero={3} titulo="Para que usamos os dados e com qual base legal">
        <Lista>
          <li>
            <strong>Criar e manter sua conta, autenticar seu acesso e prestar o serviço</strong>{" "}
            (execução de contrato — art. 7º, V, da LGPD);
          </li>
          <li>
            <strong>Exibir painéis, relatórios, cálculos de aluguéis e alertas</strong> (como
            aluguéis em atraso e contratos a vencer), inclusive por notificação no celular, se
            você permitir (execução de contrato);
          </li>
          <li>
            <strong>Garantir a segurança</strong>, prevenir fraudes e acessos indevidos e corrigir
            falhas (legítimo interesse — art. 7º, IX);
          </li>
          <li>
            <strong>Cumprir obrigações legais ou regulatórias</strong> e atender a ordens de
            autoridades competentes (art. 7º, II).
          </li>
        </Lista>
        <p>
          Não vendemos dados pessoais, não os usamos para publicidade e não criamos perfis para
          fins de marketing.
        </p>
      </Secao>

      <Secao numero={4} titulo="Dados de inquilinos e de outras pessoas cadastradas por você">
        <p>
          Os dados de inquilinos e de outras pessoas que você cadastra no sistema são tratados
          <strong> em seu nome e sob suas instruções</strong>. Em relação a esses dados, você é o
          controlador e o {NOME_SISTEMA} atua como operador: apenas armazena e processa as
          informações para oferecer as funcionalidades do sistema. Cabe a você ter uma base legal
          para esse tratamento (por exemplo, a execução do contrato de locação), informar os
          titulares quando necessário e atender às solicitações deles. Os dados que você cadastra
          ficam visíveis apenas para a sua conta.
        </p>
      </Secao>

      <Secao numero={5} titulo="Com quem compartilhamos">
        <p>
          Compartilhamos dados somente com fornecedores necessários ao funcionamento do sistema,
          que os tratam conforme nossas instruções e com medidas de segurança adequadas:
        </p>
        <Lista>
          <li>provedores de hospedagem e infraestrutura em nuvem, onde o sistema e o banco de dados são executados;</li>
          <li>Google, para a autenticação com conta Google, quando você escolhe essa opção;</li>
          <li>
            Expo (Expo Push Service), para entregar notificações ao aplicativo móvel — recebe o
            token do aparelho e o texto da notificação;
          </li>
          <li>
            serviços públicos de consulta de CEP e municípios (ViaCEP e IBGE), que recebem apenas
            o CEP ou a UF consultada, sem qualquer dado que identifique você.
          </li>
        </Lista>
        <p>
          Também poderemos compartilhar dados quando exigido por lei, ordem judicial ou
          requisição de autoridade competente.
        </p>
      </Secao>

      <Secao numero={6} titulo="Uso de dados obtidos do Google">
        <p>
          O uso e a transferência, para qualquer outro aplicativo, de informações recebidas das
          APIs do Google seguem a{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Política de Dados do Usuário dos Serviços de API do Google
          </a>
          , incluindo os requisitos de Uso Limitado. Os dados recebidos do Google (nome, e-mail e
          identificador da conta) são usados exclusivamente para identificar você, criar ou
          acessar a sua conta no {NOME_SISTEMA}. Eles não são vendidos, não são usados para
          publicidade e não são compartilhados com terceiros, exceto quando necessário para
          prestar o serviço, cumprir a lei ou proteger a segurança do sistema.
        </p>
      </Secao>

      <Secao numero={7} titulo="Cookies e armazenamento local">
        <p>
          Na versão web, usamos apenas cookies <strong>estritamente necessários</strong>: os
          tokens de sessão (protegidos contra leitura por scripts da página) e um cookie com seu
          nome e e-mail para exibir na interface. No aplicativo, os tokens de sessão ficam no
          armazenamento seguro do aparelho. Não usamos cookies de publicidade nem de análise de
          terceiros. Ao usar o botão &quot;Entrar com Google&quot;, o próprio Google pode usar
          cookies conforme a política de privacidade dele.
        </p>
      </Secao>

      <Secao numero={8} titulo="Armazenamento, segurança e transferência internacional">
        <p>
          Adotamos medidas técnicas e administrativas para proteger os dados, como comunicação
          criptografada (HTTPS), senhas armazenadas com hash, sessões com tokens de validade
          limitada e separação dos dados de cada conta. Nenhum sistema é totalmente imune a
          incidentes; caso ocorra um incidente de segurança que possa gerar risco ou dano
          relevante, comunicaremos os titulares afetados e a Autoridade Nacional de Proteção de
          Dados (ANPD), nos termos da lei.
        </p>
        <p>
          Alguns fornecedores (como provedores de nuvem, Google e Expo) podem armazenar ou
          processar dados em servidores fora do Brasil. Nesses casos, a transferência ocorre para
          a execução do serviço contratado por você e com garantias compatíveis com a LGPD.
        </p>
      </Secao>

      <Secao numero={9} titulo="Por quanto tempo guardamos os dados">
        <p>
          Os dados da conta e os dados cadastrados por você são mantidos enquanto a sua conta
          estiver ativa. Quando você solicitar a exclusão da conta, os dados serão eliminados ou
          anonimizados, exceto aqueles que precisarmos guardar para cumprir obrigações legais ou
          exercer direitos em processos, pelo prazo exigido. As sessões de acesso expiram
          automaticamente (a sessão de longa duração vale por até 7 dias sem uso).
        </p>
      </Secao>

      <Secao numero={10} titulo="Seus direitos">
        <p>Nos termos do art. 18 da LGPD, você pode, a qualquer momento, solicitar:</p>
        <Lista>
          <li>confirmação da existência de tratamento e acesso aos seus dados;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
          <li>portabilidade dos dados a outro fornecedor;</li>
          <li>eliminação dos dados e exclusão da sua conta;</li>
          <li>informação sobre com quem seus dados foram compartilhados;</li>
          <li>revisão de decisões tomadas unicamente com base em tratamento automatizado.</li>
        </Lista>
        <p>
          Para exercer seus direitos, envie um e-mail para <EmailContato />. Poderemos solicitar
          informações para confirmar a sua identidade antes de atender ao pedido. Você também
          pode revogar o acesso do {NOME_SISTEMA} à sua conta Google a qualquer momento em{" "}
          <a
            href="https://myaccount.google.com/connections"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            myaccount.google.com/connections
          </a>
          , e apresentar reclamação à ANPD.
        </p>
      </Secao>

      <Secao numero={11} titulo="Menores de idade">
        <p>
          O sistema é destinado a maiores de 18 anos. Não coletamos intencionalmente dados de
          crianças ou adolescentes como usuários do sistema.
        </p>
      </Secao>

      <Secao numero={12} titulo="Alterações desta política">
        <p>
          Esta política pode ser atualizada para refletir mudanças no sistema ou na legislação. A
          data da última atualização aparece no início da página e, em caso de mudanças
          relevantes, avisaremos pelo sistema ou por e-mail. O uso do sistema também está sujeito
          aos{" "}
          <Link href={ROTA_TERMOS_USO} className="font-medium text-primary underline-offset-4 hover:underline">
            Termos de Uso
          </Link>
          .
        </p>
      </Secao>

      <Secao numero={13} titulo="Contato">
        <p>
          Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus
          dados pessoais, entre em contato pelo e-mail <EmailContato />.
        </p>
      </Secao>
    </DocumentoLegal>
  );
}
