# Redact Firebase credentials from .env.example in git history
if (Test-Path .env.example) {
  $c = Get-Content .env.example -Raw
  $c = $c -replace 'AIzaSy[A-Za-z0-9_-]+', ''
  $c = $c -replace '915777617327', ''
  $c = $c -replace '676cb3bb3abb6f4934c35a', ''
  Set-Content .env.example $c -NoNewline
}
