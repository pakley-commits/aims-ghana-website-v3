param(
  [string]$BaseUrl = "https://aims-ghana-website-leuma.wasmer.app/"
)

if (-not $BaseUrl.EndsWith("/")) {
  $BaseUrl = "$BaseUrl/"
}

hugo --gc --minify --buildDrafts --buildExpired --buildFuture --forceSyncStatic --baseURL $BaseUrl
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

rg "localhost:1313|http://localhost" public
if ($LASTEXITCODE -eq 0) {
  Write-Error "The generated public folder still contains localhost URLs."
  exit 1
}

if ($LASTEXITCODE -eq 1) {
  exit 0
}

exit $LASTEXITCODE
