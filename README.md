# SEU Guide

Authorized Speed Enforcement Unit guide (multi-page site + Discord login).

## Live site

https://quiklyboy0-eng.github.io/seu-guide/

## Discord auth setup (required)

GitHub Pages is static — role checks need a small backend.

1. Create an app at https://discord.com/developers/applications  
2. OAuth2 → Redirects → add:
   `https://quiklyboy0-eng.github.io/seu-guide/callback.html`
3. Copy **Client ID** into `config.js` → `clientId`
4. Set `guildId` to your Discord server ID
5. `requiredRoleId` is already `1525668434074144890`
6. Deploy the auth worker (see `auth-worker/`) and set `authApiUrl` in `config.js`

Without Client ID + auth API, the Discord button will show a setup message.

## Pages

- Home, Ranks, Equipment, Vehicles, Use of Force
- Quota & LOA, Retirement, 10-Codes, Response Codes, Command
