param(
  [string]$Destination = "C:\Users\Rimkamagic\Desktop\My_project"
)

$ErrorActionPreference = "Stop"

$Source = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$DestinationFullPath = [System.IO.Path]::GetFullPath($Destination)

if (-not (Test-Path -LiteralPath $DestinationFullPath)) {
  New-Item -ItemType Directory -Force -Path $DestinationFullPath | Out-Null
}

$robocopyArgs = @(
  $Source,
  $DestinationFullPath,
  "/E",
  "/XD",
  "node_modules",
  ".next",
  ".git",
  ".agents",
  ".codex",
  ".npm-cache",
  "outputs",
  "work",
  "/XF",
  ".env.local",
  "tsconfig.tsbuildinfo"
)

Write-Host "Copying MediMap AI project..."
Write-Host "From: $Source"
Write-Host "To:   $DestinationFullPath"

& robocopy @robocopyArgs
$exitCode = $LASTEXITCODE

if ($exitCode -le 7) {
  Write-Host ""
  Write-Host "Copy completed. Existing .env.local in the destination was preserved."
  Write-Host "Next:"
  Write-Host "  cd `"$DestinationFullPath`""
  Write-Host "  npm install"
  Write-Host "  npm run dev"
  exit 0
}

throw "Robocopy failed with exit code $exitCode"
