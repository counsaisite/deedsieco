const fs = require('fs');
if (fs.existsSync('.env.example')) {
  let c = fs.readFileSync('.env.example', 'utf8');
  c = c.replace(/AIzaSy[A-Za-z0-9_-]+/g, '').replace(/915777617327/g, '').replace(/676cb3bb3abb6f4934c35a/g, '');
  fs.writeFileSync('.env.example', c);
}
