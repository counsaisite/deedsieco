#!/bin/sh
# Redact Firebase credentials from .env.example in git history
if [ -f .env.example ]; then
  sed -i.bak 's/AIzaSy[A-Za-z0-9_-]*//g' .env.example
  sed -i.bak 's/915777617327//g' .env.example
  sed -i.bak 's/676cb3bb3abb6f4934c35a//g' .env.example
  rm -f .env.example.bak 2>/dev/null || true
fi
