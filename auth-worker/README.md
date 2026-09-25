# SEU Auth Worker (Cloudflare)

1. Install Wrangler:
   `npm i -g wrangler`
2. Log in:
   `wrangler login`
3. In `auth-worker/`, set the required secrets:
   `wrangler secret put DISCORD_CLIENT_ID`
   `wrangler secret put DISCORD_CLIENT_SECRET`
   `wrangler secret put GITHUB_TOKEN`
   `wrangler secret put PUBLISH_SECRET`
4. Optional fallback role secret:
   `wrangler secret put REQUIRED_ROLE_ID`
5. Deploy:
   `wrangler deploy`
6. Copy the worker URL into the site `config.js`:
   - `authApiUrl` → `https://seu-auth.xxx.workers.dev`
   - `publishApiUrl` → `https://seu-auth.xxx.workers.dev`
7. Keep the public client config free of secrets.

The worker validates Discord guild membership and role checks on the server before any publish occurs.
