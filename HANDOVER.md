# Handover

## Estado atual

- Fonte oficial do projeto: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy)
- Repositório remoto: [https://github.com/patrickgcanas/npsmzm](https://github.com/patrickgcanas/npsmzm)
- Produção: [https://mzm-client-experience.vercel.app](https://mzm-client-experience.vercel.app)
- GitHub Pages: desativado
- Último commit validado no `main`: `945b980 Fix copy encoding across survey app`

## O que está rodando

- App `Next.js` com App Router
- Banco `Supabase Postgres`
- ORM `Prisma`
- Deploy em `Vercel`

Fluxos validados em produção:
- `GET /` responde `200`
- `GET /dashboard` responde `200`
- `POST /api/invites` responde `200`
- A mensagem do convite foi validada em UTF-8 real via Node e retorna texto correto com acentos

## Fonte da verdade

Use `site-deploy` como base principal.

Existe outra pasta local:
- [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\next-app](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\next-app)

Essa pasta foi usada durante a migração e nos deploys via CLI, mas não é a referência oficial neste momento. Ela ainda está com alterações locais não commitadas. Se outro agente for trabalhar, o melhor caminho é:
- trabalhar a partir de `site-deploy`
- usar `next-app` só se precisar reaproveitar configuração local da Vercel/Node e antes sincronizar conscientemente

## Arquivos-chave

- App Router: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\app](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\app)
- Componentes: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\components](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\components)
- Lógica de survey e texto do convite: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\lib\survey.js](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\lib\survey.js)
- Analytics/dashboard: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\lib\analytics.js](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\lib\analytics.js)
- Prisma schema: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\prisma\schema.prisma](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\prisma\schema.prisma)
- Migration inicial: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\prisma\migrations\20260316_init\migration.sql](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\prisma\migrations\20260316_init\migration.sql)
- Configuração da Vercel: [C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\vercel.json](C:\Users\PatrickGareCanãs\OneDrive - MZM Wealth Planning\20. COMERCIAL\10. NPS\site-deploy\vercel.json)

## Variáveis esperadas na Vercel

Não há segredos versionados no repositório. Para produção, a Vercel precisa destas envs:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `APP_URL`

Regras importantes:
- `DATABASE_URL` deve usar o pooler da Supabase
- `DIRECT_URL` deve usar a conexão direta do Postgres
- `APP_URL` deve apontar para a URL final da Vercel

## Estado de infraestrutura

- O repo `patrickgcanas/npsmzm` já substituiu a base estática antiga
- O GitHub Pages foi desligado porque este app depende de servidor e banco
- A Vercel foi validada pelo usuário como conectada ao repositório e com variáveis preenchidas

## Como retomar sem dor

1. Abrir `site-deploy`
2. Rodar `git status`
3. Confirmar `main` atualizado com `origin/main`
4. Fazer mudanças nesse diretório
5. Commitar e dar `push`
6. Conferir o deploy automático na Vercel

## Próximos passos de produto mais naturais

- Adicionar autenticação no dashboard
- Criar gestão administrativa de convites enviados
- Automatizar disparo de e-mail/WhatsApp
- Integrar com CRM ou planilha operacional do escritório

## Observações úteis

- Durante a implantação houve problemas com preset errado na Vercel (`Other` em vez de `Next.js`) e com conexão direta IPv6 da Supabase. Isso já foi resolvido operacionalmente usando `vercel.json` e `DATABASE_URL` no pooler.
- Também houve correção de encoding em textos da interface e da mensagem do convite. O commit `945b980` é a referência para esse ajuste.
