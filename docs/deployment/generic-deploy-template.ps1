$ErrorActionPreference = "Stop"

$projectRoot = Get-Location
$deployRoot = Join-Path $projectRoot "deploy"
$siteRoot = Join-Path $deployRoot "site"

$filesToCopy = @(
  "index.html",
  "about.html",
  "contact.html",
  "services.html",
  "projects.html",
  "blog.html",
  "styles.css",
  "script.js",
  "robots.txt",
  "sitemap.xml",
  "favicon.ico"
)

$foldersToCopy = @(
  "assets",
  "content",
  "images"
)

if (Test-Path -LiteralPath $siteRoot) {
  Remove-Item -LiteralPath $siteRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $siteRoot | Out-Null

foreach ($file in $filesToCopy) {
  $sourcePath = Join-Path $projectRoot $file
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $siteRoot
  }
}

foreach ($folder in $foldersToCopy) {
  $sourcePath = Join-Path $projectRoot $folder
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $siteRoot -Recurse
  }
}

Write-Host "Generic deploy folder ready:"
Write-Host $siteRoot
