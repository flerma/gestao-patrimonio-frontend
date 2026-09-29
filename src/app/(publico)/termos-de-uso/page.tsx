import type { Metadata } from "next";
import Link from "next/link";

import { DocumentoLegal, EmailContato, Lista, Secao } from "@/components/legal/documento-legal";
import { NOME_SISTEMA, RESPONSAVEL_SISTEMA, ROTA_POLITICA_PRIVACIDADE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Regras e condições para uso do ${NOME_SISTEMA}, sistema de gestão de patrimônio imobiliário.`,
};

const classeLink = "font-medium text-primary underline-offset-4 hover:underline";

export default function TermosUsoPage() {
  return (
    <DocumentoLegal
      titulo="Termos de Uso"
      introducao={
        <p>
          Estes Termos de Uso regulam o acesso e o uso do <strong>{NOME_SISTEMA}</strong>,
          oferecido por {RESPONSAVEL_SISTEMA}, na versão web e no aplicativo móvel. Leia com
          atenção: ao criar uma conta, entrar com sua conta Google ou usar o sistema, você
          concorda com estes termos e com a{" "}
          <Link href={ROTA_POLITICA_PRIVACIDADE} className={classeLink}>
            Política de Privacidade
          </Link>
          . Se não concordar, não utilize o sistema.
        </p>
      }
    >
      <Secao numero={1} titulo="O serviço">
        <p>
          O {NOME_SISTEMA} é uma ferramenta para organizar e acompanhar um patrimônio
          imobiliário. Entre outras funcionalidades, permite cadastrar imóveis, inquilinos e
          contratos de locação, gerar e controlar as parcelas de aluguel, registrar pagamentos e
          acompanhar indicadores e alertas (como aluguéis em atraso e contratos próximos do
          vencimento). As funcionalidades podem ser alteradas, ampliadas ou descontinuadas ao
          longo do tempo.
        </p>
      </Secao>

      <Secao numero={2} titulo="Cadastro e conta">
        <Lista>
          <li>Para usar o sistema é preciso ter 18 anos ou mais e plena capacidade civil.</li>
          <li>
            Você pode criar uma conta com e-mail e senha ou entrar com a sua conta Google. As
            informações fornecidas devem ser verdadeiras, completas e atualizadas.
          </li>
          <li>
            Você é responsável por manter a confidencialidade da sua senha e do acesso aos seus
            dispositivos, e por todas as atividades realizadas na sua conta. Avise-nos
            imediatamente pelo e-mail <EmailContato /> em caso de uso não autorizado.
          </li>
          <li>A conta é pessoal e intransferível.</li>
        </Lista>
      </Secao>

      <Secao numero={3} titulo="Suas responsabilidades">
        <p>Ao usar o sistema, você se compromete a:</p>
        <Lista>
          <li>usá-lo apenas para fins lícitos, relacionados à gestão dos seus imóveis ou dos imóveis que administra legitimamente;</li>
          <li>
            cadastrar dados de inquilinos e de outras pessoas somente quando tiver base legal para
            isso, cumprindo a LGPD — em relação a esses dados, você é o controlador e responde
            pelo seu tratamento;
          </li>
          <li>manter a exatidão das informações cadastradas, como valores, datas e condições dos contratos;</li>
          <li>guardar cópias próprias dos documentos originais (contratos assinados, recibos e comprovantes).</li>
        </Lista>
      </Secao>

      <Secao numero={4} titulo="Condutas proibidas">
        <p>É proibido:</p>
        <Lista>
          <li>inserir dados falsos, de terceiros sem autorização ou obtidos de forma ilícita;</li>
          <li>tentar acessar contas, dados ou áreas do sistema sem permissão;</li>
          <li>
            realizar engenharia reversa, testes de invasão não autorizados, coleta automatizada de
            dados ou qualquer ação que prejudique a segurança, a estabilidade ou o desempenho do
            sistema;
          </li>
          <li>enviar códigos maliciosos ou usar o sistema para spam, fraude ou qualquer atividade ilegal;</li>
          <li>revender, sublicenciar ou disponibilizar o sistema a terceiros sem autorização.</li>
        </Lista>
      </Secao>

      <Secao numero={5} titulo="Natureza das informações">
        <p>
          O sistema é uma ferramenta de apoio à organização. Cálculos e indicadores exibidos —
          como datas de vencimento, valores de parcelas, reajustes, atrasos, rentabilidade e
          totais — são gerados a partir dos dados informados por você e podem conter
          imprecisões. Eles <strong>não substituem</strong> a análise do contrato de locação nem
          a orientação de profissionais habilitados (advogado, contador ou corretor), e não
          constituem aconselhamento jurídico, contábil, fiscal ou financeiro. Confira as
          informações antes de tomar decisões ou cobrar valores.
        </p>
      </Secao>

      <Secao numero={6} titulo="Disponibilidade do serviço">
        <p>
          Empregamos esforços razoáveis para manter o sistema disponível e seguro, mas ele é
          oferecido &quot;no estado em que se encontra&quot; e pode passar por interrupções,
          manutenções, falhas de terceiros (como provedores de internet, nuvem ou do Google) ou
          indisponibilidades temporárias. Não garantimos funcionamento ininterrupto ou livre de
          erros.
        </p>
      </Secao>

      <Secao numero={7} titulo="Propriedade intelectual">
        <p>
          O software, a marca, o layout e os demais elementos do {NOME_SISTEMA} pertencem ao
          responsável pelo sistema e são protegidos pela legislação de propriedade intelectual.
          Estes termos concedem a você apenas uma licença pessoal, limitada, não exclusiva e
          revogável para usar o sistema. Os dados que você cadastra continuam sendo seus.
        </p>
      </Secao>

      <Secao numero={8} titulo="Privacidade e proteção de dados">
        <p>
          O tratamento de dados pessoais é descrito na{" "}
          <Link href={ROTA_POLITICA_PRIVACIDADE} className={classeLink}>
            Política de Privacidade
          </Link>
          , que faz parte destes termos.
        </p>
      </Secao>

      <Secao numero={9} titulo="Limitação de responsabilidade">
        <p>
          Na máxima extensão permitida pela lei, o responsável pelo sistema não responde por:
          decisões tomadas com base nas informações exibidas; dados incorretos ou incompletos
          inseridos pelo usuário; perdas decorrentes de uso indevido da conta por falta de
          cuidado com a senha; inadimplência de inquilinos ou conflitos entre locador e
          locatário; e danos indiretos ou lucros cessantes. Nada nestes termos afasta direitos
          garantidos ao consumidor pelo Código de Defesa do Consumidor.
        </p>
      </Secao>

      <Secao numero={10} titulo="Suspensão e encerramento da conta">
        <p>
          Você pode deixar de usar o sistema e solicitar a exclusão da sua conta a qualquer
          momento pelo e-mail <EmailContato />. Podemos suspender ou encerrar contas que violem
          estes termos ou a lei, ou mediante ordem de autoridade competente, com aviso sempre que
          possível. Após o encerramento, os dados serão tratados conforme a Política de
          Privacidade.
        </p>
      </Secao>

      <Secao numero={11} titulo="Preço">
        <p>
          Eventuais planos pagos, preços e condições comerciais serão informados de forma clara
          antes da contratação, e nenhuma cobrança será feita sem a sua concordância prévia.
        </p>
      </Secao>

      <Secao numero={12} titulo="Alterações destes termos">
        <p>
          Estes termos podem ser atualizados. A data da última atualização aparece no início da
          página e, em caso de mudanças relevantes, avisaremos pelo sistema ou por e-mail. Se
          continuar usando o sistema depois da atualização, você concorda com a nova versão.
        </p>
      </Secao>

      <Secao numero={13} titulo="Legislação e foro">
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o
          foro do domicílio do usuário para resolver eventuais controvérsias, conforme a
          legislação de defesa do consumidor.
        </p>
      </Secao>

      <Secao numero={14} titulo="Contato">
        <p>
          Dúvidas sobre estes Termos de Uso podem ser enviadas para <EmailContato />.
        </p>
      </Secao>
    </DocumentoLegal>
  );
}
