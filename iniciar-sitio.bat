@echo off
title Portal Unico del Padron de Beneficiarios - H. Ayuntamiento de Balancan
set "PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"
echo Iniciando el servidor local del Portal del Padron...
npm.cmd run dev -- --open
pause
