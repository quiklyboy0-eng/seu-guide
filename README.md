# SEU Guide

Authorized Speed Enforcement Unit guide (multi-page site + Discord login).

## Live site

https://quiklyboy0-eng.github.io/seu-guide/

## Security model

This site keeps public client-side code free of real secrets.

- Discord OAuth client secret stays in the Cloudflare Worker environment.
- GitHub API token stays in the Cloudflare Worker environment.
- Browser code only knows the public Discord client ID and endpoint URLs.
- The editor does not require entering a browser PAT.

## Discord auth setup

1. Create a Discord application at https://discord.com/developers/applications
2. Add the redirect URI:
   `https://quiklyboy0-eng.github.io/seu-guide/callback.html`
3. Set the public client ID in `config.js`
4. Deploy the worker in `auth-worker/`
5. Set these Cloudflare Worker secrets:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `GITHUB_TOKEN`
   - `PUBLISH_SECRET`
   - `REQUIRED_ROLE_ID` (optional fallback)
6. Set these Cloudflare Worker environment variables:
   - `GITHUB_REPO` (default: `quiklyboy0-eng/seu-guide`)
   - `GITHUB_CONTENT_PATH` (default: `content.json`)
   - `GITHUB_BRANCH` (default: `main`)
7. Put the Worker URL in `config.js` as `authApiUrl`
8. Put the Worker publish URL in `config.js` as `publishApiUrl`

If the worker is not configured, the login and publish flows will fail gracefully instead of exposing secrets.

## Pages

- Home, Ranks, Equipment, Vehicles, Use of Force
- Quota & LOA, Retirement, 10-Codes, Response Codes, Command
- Content editor for the JSON-backed guide

## Required manual configuration

The repository owner must configure the following values outside the GitHub repo itself:

- Cloudflare Worker secrets for Discord and GitHub
- Worker URL for `authApiUrl`
- Worker publish URL for `publishApiUrl`

Do not commit real tokens or client secrets into this repository.
