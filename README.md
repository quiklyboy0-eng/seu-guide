# SEU Guide — California Highway Patrol

Private Speed Enforcement Unit guide site.

## Access

Only members with the authorized rank role can enter. Use the Discord role ID as the access key:

```
1525668434074144890
```

## Deploy (GitHub Pages)

1. Create a new **public** repository on GitHub (e.g. `seu-guide`).
2. Upload these files to the repo root (`index.html`, `styles.css`, `app.js`, `.nojekyll`).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**.
5. Branch: `main` (or `master`), folder: `/ (root)`.
6. Save. After a minute, your site will be at:

```
https://YOUR_USERNAME.github.io/seu-guide/
```

## Local preview

Open `index.html` in a browser, or run a simple server:

```bash
npx serve .
```
