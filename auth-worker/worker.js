/**
 * Cloudflare Worker — Discord OAuth + role check for SEU Guide
 *
 * Secrets (wrangler secret put ...):
 *   DISCORD_CLIENT_ID
 *   DISCORD_CLIENT_SECRET
 *
 * Deploy: npx wrangler deploy
 * Then set authApiUrl in config.js to this worker URL.
 */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://quiklyboy0-eng.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }
    const url = new URL(request.url);
    if (url.pathname !== "/auth/discord" && url.pathname !== "/") {
      return json({ error: "Not found" }, 404, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, cors);
    }
    const { code, redirectUri, guildId, requiredRoleId } = body || {};
    if (!code || !redirectUri || !guildId || !requiredRoleId) {
      return json({ ok: false, error: "Missing code, redirectUri, guildId, or requiredRoleId" }, 400, cors);
    }
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
      return json({ ok: false, error: "Server missing Discord credentials" }, 500, cors);
    }

    // Exchange code
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return json({ ok: false, error: "Discord token exchange failed" }, 401, cors);
    }

    const headers = { Authorization: "Bearer " + tokenData.access_token };

    const userRes = await fetch("https://discord.com/api/users/@me", { headers });
    const user = await userRes.json();
    if (!userRes.ok || !user.id) {
      return json({ ok: false, error: "Could not fetch Discord user" }, 401, cors);
    }

    const memberRes = await fetch(
      "https://discord.com/api/users/@me/guilds/" + guildId + "/member",
      { headers }
    );
    const member = await memberRes.json();
    if (!memberRes.ok) {
      return json({
        ok: false,
        error: "You must be in the SEU Discord server. (guilds.members.read)",
      }, 403, cors);
    }

    const roles = member.roles || [];
    if (!roles.includes(requiredRoleId)) {
      return json({ ok: false, error: "You do not have the required rank role." }, 403, cors);
    }

    return json({
      ok: true,
      userId: user.id,
      username: user.username,
      globalName: user.global_name || user.username,
      avatar: user.avatar,
    }, 200, cors);
  },
};

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
