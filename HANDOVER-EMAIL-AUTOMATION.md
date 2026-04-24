# Handover — Automação de Envio de E-mails
**Projeto:** MZM Wealth — Pesquisa de Satisfação
**Data:** 2026-04-24
**Para:** Dev responsável pela integração de e-mail

---

## Contexto rápido

Plataforma interna de pesquisa de satisfação de clientes da MZM Wealth. Deploy na Vercel, banco PostgreSQL no Supabase, stack Next.js 14 App Router + Prisma ORM.

Hoje o envio de e-mail é **100% manual**: o sistema gera links `mailto:` que abrem rascunhos no Outlook. O objetivo desta tarefa é substituir isso por envio automático e programático via API, usando o domínio `mzmwealth.com`.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 App Router |
| ORM | Prisma 5 + Supabase PostgreSQL |
| Deploy | Vercel (auto-deploy via push para `main`) |
| Auth | HMAC-SHA256 stateless (cookie `mzm-auth` HTTP-only) |
| Email atual | `mailto:` links abrindo Outlook manualmente |
| Email futuro | **Resend** — recomendado para Vercel/Next.js, suporte nativo a domínios customizados |

---

## Fluxo atual (que deve ser substituído)

```
Import Excel/CSV → cria SurveyInvite no banco (sem sentAt)
→ BulkEmailPanel lista convites pendentes (clientEmail != null, response == null)
→ usuário clica "Abrir e-mail" → abre mailto: no Outlook
→ usuário envia manualmente no Outlook
→ sentAt nunca é gravado (campo existe mas não é setado)
```

### Arquivo central do fluxo atual
- [`components/bulk-email-panel.js`](components/bulk-email-panel.js) — painel de envio em lote (gera `mailto:`)
- [`lib/survey.js`](lib/survey.js) — `buildInviteMessage()` e `INVITE_SUBJECT` (template do e-mail)
- [`app/api/invites/route.js`](app/api/invites/route.js) — cria `SurveyInvite` individual
- [`app/api/invites/import/route.js`](app/api/invites/import/route.js) — cria `SurveyInvite` em lote via Excel/CSV

---

## Schema do banco (relevante)

```prisma
model SurveyInvite {
  id               String          @id @default(cuid())
  token            String          @unique
  clientName       String
  clientEmail      String?         // e-mail do cliente — pode ser null
  clientCode       String?
  advisor          String
  relationshipNote String?
  createdAt        DateTime        @default(now())
  viewedAt         DateTime?       // preenchido quando o cliente abre o link
  startedAt        DateTime?       // preenchido quando começa a responder
  deletedAt        DateTime?       // soft delete
  response         SurveyResponse?
  // sentAt NÃO EXISTE ainda no schema — precisa ser adicionado
}
```

> **Atenção:** o campo `sentAt` está referenciado no handover anterior mas **não foi adicionado ao schema Prisma**. É necessário criá-lo.

---

## O que precisa ser feito

### 1. Setup do Resend + DNS

**Instalar:**
```bash
npm install resend
```

**Criar conta no Resend:** https://resend.com
- Adicionar o domínio `mzmwealth.com`
- Resend vai gerar os registros DNS necessários (SPF, DKIM, DMARC)
- Esses registros precisam ser adicionados no painel DNS do domínio (provavelmente Registro.br ou provedor de hospedagem)

**Registros DNS típicos que o Resend vai solicitar:**
| Tipo | Nome | Valor |
|------|------|-------|
| TXT | `@` ou `mzmwealth.com` | `v=spf1 include:resend.com ~all` |
| TXT | `resend._domainkey` | chave DKIM gerada pelo Resend |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@mzmwealth.com` |

**Variável de ambiente a adicionar na Vercel:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

**Remetente a usar:**
```
ariane@mzmwealth.com
```
(ou `noreply@mzmwealth.com` — confirmar com o Patrick qual endereço faz sentido)

---

### 2. Atualizar schema Prisma

Adicionar `sentAt` ao modelo `SurveyInvite`:

```prisma
// prisma/schema.prisma
model SurveyInvite {
  // ... campos existentes ...
  sentAt    DateTime?   // novo campo
}
```

Rodar migration no Supabase SQL Editor (porque o ambiente usa `DIRECT_URL` para migrations):
```sql
ALTER TABLE "SurveyInvite" ADD COLUMN "sentAt" TIMESTAMP;
```

E rodar `prisma generate` após atualizar o schema.

---

### 3. Criar endpoint de envio

Criar `app/api/invites/[token]/send/route.js`:

```js
// Lógica esperada:
// 1. Buscar SurveyInvite pelo token
// 2. Validar: tem clientEmail? já foi respondido? já foi enviado?
// 3. Montar o e-mail usando buildInviteMessage() de lib/survey.js
// 4. Enviar via Resend
// 5. Atualizar sentAt no banco
// 6. Retornar { ok: true }
```

O template do e-mail já existe em [`lib/survey.js:117`](lib/survey.js#L117):
```js
export function buildInviteMessage({ clientName, inviteUrl }) {
  return `Olá, ${clientName}.\n\nSou a Ariane...`
}
export const INVITE_SUBJECT = "Pesquisa de satisfação | MZM Wealth";
```

A URL do convite segue o padrão:
```
https://[NEXT_PUBLIC_APP_URL]/survey/[token]
```

`getAppUrl()` está em [`lib/data.js:77`](lib/data.js#L77) e resolve a URL correta em produção.

---

### 4. Criar endpoint de envio em lote

Criar `app/api/invites/send-bulk/route.js`:

```js
// Lógica esperada:
// 1. Buscar todos os SurveyInvite sem resposta, sem deletedAt, com clientEmail
// 2. Para cada um: enviar via Resend e atualizar sentAt
// 3. Retornar { sent: N, skipped: N, errors: [...] }
// Rate limiting: Resend free tier = 100 e-mails/dia, 2 e-mails/segundo
// Adicionar delay entre envios se necessário
```

---

### 5. Atualizar o BulkEmailPanel

Arquivo: [`components/bulk-email-panel.js`](components/bulk-email-panel.js)

Adicionar botão **"Enviar todos"** que chama `POST /api/invites/send-bulk`.

O botão individual "Abrir e-mail" pode continuar existindo como fallback, mas a ação principal deve ser o envio automático.

Exibir feedback de progresso e resultado (`enviados: N, erros: N`).

---

### 6. Atualizar exibição de status

Arquivo: [`components/status-client.js`](components/status-client.js)

A coluna de status dos convites deve considerar `sentAt` para diferenciar:
- **Pendente** — criado, não enviado
- **Enviado** — `sentAt` preenchido, sem resposta
- **Respondido** — tem `SurveyResponse`

`getAllInvites()` em [`lib/data.js:46`](lib/data.js#L46) precisa incluir `sentAt` no retorno.

---

## Variáveis de ambiente (estado atual na Vercel)

| Variável | Status |
|----------|--------|
| `DATABASE_URL` | ✅ configurada (pooled PgBouncer) |
| `DIRECT_URL` | ✅ configurada (migrations) |
| `ADMIN_EMAIL` | ✅ configurada |
| `ADMIN_PASSWORD` | ✅ configurada |
| `SESSION_SECRET` | ✅ configurada |
| `NEXT_PUBLIC_APP_URL` | ✅ configurada |
| `RESEND_API_KEY` | ❌ **falta adicionar** |

---

## Proteção de rotas

O `middleware.js` protege tudo exceto rotas públicas. As novas rotas de envio (`/api/invites/*/send`, `/api/invites/send-bulk`) devem ser **protegidas** (já estarão por padrão, pois o middleware bloqueia qualquer `/api/` não listada como pública).

Rotas públicas atuais (não alterar):
```
/survey/*
/login
/api/auth/*
/api/responses/*
/api/invites/*/track
```

---

## Deploy

Push para `main` → Vercel deploya automaticamente. Não há CI/CD adicional.

Para rodar migration após alterar o schema:
1. Atualizar `prisma/schema.prisma`
2. Rodar o SQL manualmente no Supabase SQL Editor (não usar `prisma migrate dev` em produção diretamente)
3. Rodar `npx prisma generate` localmente e commitar o client gerado, ou deixar o `postinstall` do Vercel fazer isso

---

## Pendências relacionadas (não escopo desta tarefa)

- [ ] Gráficos de evolução mensal (CSAT + NPS) no dashboard
- [ ] Sistema de snapshot de indicadores antes do reset
- [ ] Visão global do escritório (CSAT + NPS agregado)

---

## Contato / acesso

- **Patrick Canas** — product owner, acesso total à Vercel e Supabase
- Repositório: privado, acesso via GitHub do Patrick
- Painel Vercel: Patrick concede acesso via e-mail
- Painel Supabase: Patrick concede acesso via e-mail
