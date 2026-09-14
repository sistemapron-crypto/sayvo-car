# AGENTS.md

Purpose
---
This file gives concise, actionable instructions for AI coding agents working on this repository so they can be immediately productive.

Quick start
---
- Run locally: open [index.html](index.html) in a browser or serve the folder (examples below).

```bash
python -m http.server 8000
# or (if Node.js installed)
npx http-server -c-1 .
```

Firebase setup
---
- This project is a static site that uses Firebase client SDKs (loaded from CDN). Configure Firebase by filling the `firebaseConfig` object found in [script.js](script.js), [admin.html](admin.html) and [seed-firebase.html](seed-firebase.html).
- Follow the Firebase creation and security steps in [regras.md](regras.md). Do NOT commit credentials to the repo.

Key files
---
- [index.html](index.html) — storefront / public UI
- [admin.html](admin.html) — admin interface (requires auth)
- [seed-firebase.html](seed-firebase.html) — uploads sample products/categories/coupons to Firestore
- [script.js](script.js) — main application logic and Firestore interactions
- [style.css](style.css) — site styles
- [assets/](assets/) — static assets (images, icons)

Agent guidance
---
- There is no build system or package.json; this is a static CDN-backed site. Prefer edits that work in-browser and test by serving files.
- When working with Firestore or auth, warn about destructive operations. Running the seed uploader is intended "once"; confirm with the user before invoking.
- Avoid committing secrets. If credentials are needed for testing, ask the user to provide them privately and instruct how to add them locally.
- Link to existing docs rather than duplicating them. See [regras.md](regras.md) for Firebase console steps and rules.

Changelog
---
- Created AGENTS.md: concise agent instructions and quick-start notes.
