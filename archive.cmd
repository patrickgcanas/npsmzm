@echo off
echo.
echo === MZM Wealth - Arquivo de Ciclo ===
echo.
echo 1. Baixando variaveis de ambiente da Vercel...
call vercel-local.cmd env pull .env.local --yes 2>nul
if errorlevel 1 (
  echo AVISO: Nao foi possivel baixar variaveis da Vercel.
  echo Certifique-se de estar logado com: vercel-local.cmd login
  pause
  exit /b 1
)

echo.
echo 2. Exportando dados e resetando base...
call npm-local.cmd run archive

echo.
pause
