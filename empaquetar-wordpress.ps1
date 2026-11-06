$ErrorActionPreference = "Stop"
$env:PATH = "$env:LOCALAPPDATA\Programs\nodejs;$env:PATH"

Write-Host "1. Compilando aplicación React + Tailwind CSS para producción..."
npm.cmd run build

$pluginDest = "c:\Proyectos\Padron\wordpress-plugin\padron-balancan-wp\dist"
if (Test-Path $pluginDest) { Remove-Item -Recurse -Force $pluginDest }
Copy-Item -Path "c:\Proyectos\Padron\dist" -Destination $pluginDest -Recurse -Force

$outFolder = "c:\Proyectos\Padron\entregable-wordpress"
New-Item -ItemType Directory -Force -Path $outFolder | Out-Null
$zipPath = "$outFolder\padron-balancan-wp.zip"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

Write-Host "2. Generando paquete instalable de WordPress (padron-balancan-wp.zip)..."
Compress-Archive -Path "c:\Proyectos\Padron\wordpress-plugin\padron-balancan-wp" -DestinationPath $zipPath -Force

Write-Host "Paquete listo en: $zipPath"
