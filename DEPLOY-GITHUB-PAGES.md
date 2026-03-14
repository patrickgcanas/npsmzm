# Publicação no GitHub Pages

## O que subir

Para publicar o site, envie apenas estes arquivos:

- `index.html`
- `styles.css`
- `app.js`
- `Logo MZM.png`
- `.nojekyll`

## Recomendação

Não publique junto os arquivos internos de apresentação e briefing do escritório.

## Fluxo sugerido

1. Crie um repositório novo no GitHub, por exemplo `mzm-wealth-nps`.
2. Envie apenas os arquivos do site para a raiz do repositório.
3. No GitHub, vá em `Settings` > `Pages`.
4. Em `Source`, escolha `Deploy from a branch`.
5. Selecione a branch principal e a pasta `/(root)`.
6. Salve e aguarde a publicação.

## Observação

Este site é 100% estático. As respostas ficam salvas apenas no navegador do usuário via `localStorage`. Para operação real com clientes, o ideal é conectar a um backend.
