# MZM Client Experience | Next.js

Aplicativo Next.js com App Router, rotas de servidor e banco relacional para a pesquisa de satisfação da MZM Wealth.

## Stack alvo

- `Next.js` para frontend e rotas de servidor
- `Vercel` para hospedagem do app
- `Supabase Postgres` para persistência
- `Prisma` para acesso ao banco e modelagem

## O que esta base já entrega

- `Next.js` com navegação entre visão geral, envio, modelo da pesquisa e dashboard.
- `Prisma + Postgres` preparado para Supabase.
- Geração de link dinâmico por token único para cada cliente.
- Página pública de resposta em `/survey/[token]`.
- Dashboard lendo dados do banco, com filtros e métricas de CSAT/NPS.

## Estrutura principal

- `app/`: páginas, layout e APIs.
- `components/`: formulário de envio, pesquisa e dashboard.
- `lib/`: perguntas, advisors, utilitários de analytics e acesso ao Prisma.
- `prisma/schema.prisma`: estrutura do banco.
- `prisma/seed.js`: base inicial com alguns dados demo.

## Como rodar

1. Instale o Node.js 18 ou superior.
2. Entre em `next-app`.
3. Copie `.env.example` para `.env`.
4. Instale as dependências:

```bash
npm install
```

Se o `node` ainda não aparecer no terminal após a instalação local, use os atalhos incluídos no projeto:

```bash
.\npm-local.cmd install
.\npm-local.cmd run dev
.\vercel-local.cmd login
.\supabase-local.cmd --version
.\run-dev-local.cmd
```

5. Configure o arquivo `.env` com as credenciais do Supabase.

6. Gere o client do Prisma e rode a primeira migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

7. Opcionalmente carregue dados demo:

```bash
npm run prisma:seed
```

8. Suba o app:

```bash
npm run dev
```

## Variáveis de ambiente

```env
DATABASE_URL="postgres://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
APP_URL="http://localhost:3000"
```

`DATABASE_URL`:
- use a connection string do pooler do Supabase para runtime do app
- mantenha `?pgbouncer=true`

`DIRECT_URL`:
- use a conexão direta do banco para migrations do Prisma

## Como publicar na Vercel

1. Suba a pasta `next-app` para um repositório Git.
2. Importe esse repositório na Vercel.
3. Em `Environment Variables`, cadastre:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `APP_URL` com a URL final do projeto, se quiser forçar um domínio específico
4. Faça o deploy.
5. Rode `npm run prisma:deploy` em um ambiente com Node para aplicar as migrations no Supabase.

## Observações importantes

- Esta nova versão não pode ser publicada no GitHub Pages, porque depende de servidor e banco.
- A API já gera o link da pesquisa usando a origem real da requisição, o que ajuda em preview deployments e domínio final na Vercel.
- O site estático antigo continua na raiz do projeto e em `site-deploy/` apenas como referência e fallback.
