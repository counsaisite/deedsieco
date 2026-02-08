# Deploy Firestore Rules & Indexes

## Setup (one-time)

1. **Install dependencies** – Run `npm install`.
2. **Log in** – Run `npm run deploy:firestore` will prompt you if not logged in, or run:
   ```bash
   node node_modules/firebase-tools/lib/bin/firebase.js login
   ```
   This opens a browser for authentication.
3. **Project** – The project is set to `deedsie` in `.firebaserc`. If you use a different project:
   ```bash
   node node_modules/firebase-tools/lib/bin/firebase.js use <project-id>
   ```

## Deploy

```bash
# Deploy rules and indexes
npm run deploy:firestore
```

Or directly:

```bash
npx firebase deploy --only firestore
```

**Firebase authorized domains:** Add your production domains in Firebase Console → Authentication → Settings → Authorized domains:
- `deedsie.com`
- `www.deedsie.com`
- Your Netlify URL (e.g. `deedsie.netlify.app`)
