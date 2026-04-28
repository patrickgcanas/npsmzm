// Cole esse código no console do navegador (F12) estando logado no sistema.
// Reseta a base sem exportar — use apenas para testes.

fetch('/api/admin/reset', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log('Reset feito:', d))
