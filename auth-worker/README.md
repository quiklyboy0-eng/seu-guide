# SEU Auth Worker (Cloudflare)

1. Install: `npm i -g wrangler` && `wrangler login`
2. `cd auth-worker`
3. `wrangler secret put DISCORD_CLIENT_ID`
4. `wrangler secret put DISCORD_CLIENT_SECRET`
5. `wrangler deploy`
6. Copy the worker URL into site `config.js` → `authApiUrl` (e.g. `https://seu-auth.xxx.workers.dev`)
