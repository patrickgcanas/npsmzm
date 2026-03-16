@echo off
set "NODE_DIR=C:\Users\PATRIC~1\tools\node-v24.14.0-win-x64-fixed\node-v24.14.0-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
"%~dp0node_modules\.bin\supabase.cmd" %*
