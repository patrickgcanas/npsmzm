# MZM Wealth | Pesquisa de Satisfação

MVP estático em HTML, CSS e JavaScript para apoiar a operação da pesquisa de satisfação da MZM Wealth.

## O que este projeto já faz

- Gera links personalizados para envio da pesquisa.
- Exibe uma mensagem de convite pronta para copiar ou abrir por e-mail.
- Coleta respostas com NPS, bloco CSAT alternando pilares e comentários abertos.
- Mostra dashboard com KPIs de CSAT e NPS, filtros, evolução mensal e exportação.

## Como usar

1. Abra o arquivo `index.html` no navegador.
2. Vá para a aba `Enviar` e gere o link da pesquisa para um cliente.
3. Compartilhe o link ou use o preview para testar o fluxo.
4. Envie respostas pela aba `Responder`.
5. Analise os dados na aba `Dashboard`.

## Observação importante

Neste MVP, as respostas ficam salvas no `localStorage` do navegador usado no teste. Para uso real com clientes externos, o próximo passo é conectar esse frontend a um backend ou base centralizada, como Supabase, Firebase, Airtable, Google Sheets ou CRM próprio.
