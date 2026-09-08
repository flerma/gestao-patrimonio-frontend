# Gestão de Patrimônio Imobiliário — Frontend

Frontend MVP para o backend [`gestao-patrimonio-imobiliario`](../gestao-patrimonio-imobiliario)
(API REST Spring Boot). Dashboard do patrimônio + telas de cadastro e busca de
imóveis, inquilinos, contratos e usuários.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Componentes | shadcn/ui (Radix UI) |
| Formulários | React Hook Form + Zod |
| Dados / cache | TanStack Query (React Query) |
| Gráficos | Recharts |
| Ícones | Lucide React |

## Como rodar

1. Suba a API `gestao-patrimonio-imobiliario` (por padrão em `http://localhost:8080`).
2. Instale as dependências e inicie o dev server:

   ```bash
   npm install
   npm run dev      # website
   npm run android  # emulador Android
   npm run ios      # simulador iOS (precisa de macOS)
   ```

3. Acesse `http://localhost:3000`.

### Configuração da API (`.env.local`)

```dotenv
# Proxy do Next.js (lado servidor) — recomendado, evita CORS.
API_PROXY_TARGET=http://localhost:8080

# Vazio => usa o proxy acima. Preencha para chamar a API direto do navegador
# (exige CORS liberado no backend para http://localhost:3000).
NEXT_PUBLIC_API_BASE_URL=
```

Com o proxy, o frontend chama `/api/*` na própria origem e o Next.js encaminha
para `API_PROXY_TARGET` (ver `next.config.ts`).

## Integração REST

Todos os endpoints do backend são consumidos (`src/lib/api/`):

| Recurso | Endpoints |
| --- | --- |
| Usuários | `GET/POST /api/usuarios`, `GET/PUT/DELETE /api/usuarios/{id}` |
| Imóveis | `GET/POST /api/imoveis`, `GET/PUT/DELETE /api/imoveis/{id}` |
| Inquilinos | `GET/POST /api/inquilinos`, `GET/PUT/DELETE /api/inquilinos/{id}` |
| Contratos | `GET/POST /api/contratos`, `GET/PUT/DELETE /api/contratos/{id}` |

## Funcionalidades

- **Dashboard** (`/`): totais de patrimônio, aluguéis (mensal/anual), resultado
  (% do aluguel anual sobre o patrimônio) e aluguéis recebidos acumulados;
  gráfico de evolução dos recebimentos nos últimos 12 meses; lista de imóveis;
  painel de alertas (contratos vencendo/vencidos, reajustes previstos, imóveis
  ociosos, inconsistências). Filtro por proprietário no menu lateral.
- **Cadastro e busca** de imóveis, inquilinos, contratos e usuários, com edição
  e exclusão (`/{recurso}`, `/{recurso}/novo`, `/{recurso}/{id}`).
- **Menu lateral** fixo no desktop (recolhível) e em modo *sanduíche* (Sheet)
  em smartphones/tablets. Layout totalmente responsivo.

## Estrutura

```
src/
├── app/                 # rotas (App Router)
├── components/
│   ├── ui/              # primitivos shadcn/ui
│   ├── layout/          # AppShell, sidebar, seletor de proprietário
│   ├── dashboard/       # cards de KPI, gráfico, alertas
│   └── forms/           # formulários RHF + Zod
├── hooks/               # hooks TanStack Query por recurso
└── lib/
    ├── api/             # cliente REST + módulos por recurso
    ├── types.ts         # tipos espelhando os DTOs da API
    ├── dashboard.ts     # agregações do dashboard
    ├── labels.ts        # rótulos/variações de badge dos enums
    └── format.ts        # formatação de moeda, data e percentual
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (webpack) |
| `npm run dev:turbopack` | Idem, com Turbopack |
| `npm run build` | Build de produção (webpack) |
| `npm run build:turbopack` | Idem, com Turbopack |
| `npm start` | Sobe o build de produção |
| `npm run lint` | ESLint |

> **Por que webpack?** No Windows o worker do Turbopack que processa
> `globals.css` (PostCSS/Tailwind) falha de forma intermitente ao iniciar
> (`exit code 0xc0000142`, `FATAL: An unexpected Turbopack error occurred`).
> Os scripts padrão usam webpack, que roda o PostCSS no processo e é estável.
> Para tentar o Turbopack: pare o dev server, `rm -rf .next` e use
> `npm run dev:turbopack`.
