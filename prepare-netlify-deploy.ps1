$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$deployRoot = Join-Path $workspaceRoot "deploy"
$siteRoot = Join-Path $deployRoot "netlify-site"

$filesToCopy = @(
  "404.html",
  "_redirects",
  "about.html",
  "index.html",
  "insights.html",
  "live-chat.js",
  "netlify.toml",
  "owner-inbox.html",
  "owner-inbox.js",
  "post.html",
  "project-detail.html",
  "projects.html",
  "robots.txt",
  "script.js",
  "service-detail.html",
  "services.html",
  "sitemap.xml",
  "start-project.html",
  "styles.css",
  "thank-you.html"
)

$foldersToCopy = @(
  "assets",
  "content",
  "thank-you"
)

if (Test-Path -LiteralPath $siteRoot) {
  Remove-Item -LiteralPath $siteRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $siteRoot | Out-Null

foreach ($file in $filesToCopy) {
  $sourcePath = Join-Path $workspaceRoot $file
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $siteRoot
  }
}

foreach ($folder in $foldersToCopy) {
  $sourcePath = Join-Path $workspaceRoot $folder
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $siteRoot -Recurse
  }
}

Write-Host "Netlify deploy folder ready:"
Write-Host $siteRoot
