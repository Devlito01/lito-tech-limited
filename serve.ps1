$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

$contentTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".xml" = "application/xml; charset=utf-8"
  ".txt" = "text/plain; charset=utf-8"
  ".ico" = "image/x-icon"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".svg" = "image/svg+xml"
  ".pdf" = "application/pdf"
}

Write-Output "Serving $root at http://localhost:$port/"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()

    try {
      $requestPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($requestPath)) { $requestPath = "index.html" }

      $localPath = Join-Path $root $requestPath
      if ((Test-Path -LiteralPath $localPath) -and (Get-Item -LiteralPath $localPath).PSIsContainer) {
        $localPath = Join-Path $localPath "index.html"
      }

      if (-not (Test-Path -LiteralPath $localPath)) {
        $context.Response.StatusCode = 404
        $localPath = Join-Path $root "404.html"
      } else {
        $context.Response.StatusCode = 200
      }

      $extension = [IO.Path]::GetExtension($localPath).ToLowerInvariant()
      $context.Response.ContentType = if ($contentTypes[$extension]) { $contentTypes[$extension] } else { "application/octet-stream" }
      $body = [IO.File]::ReadAllBytes($localPath)
      $context.Response.ContentLength64 = $body.Length
      $context.Response.OutputStream.Write($body, 0, $body.Length)
    }
    finally {
      $context.Response.Close()
    }
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}