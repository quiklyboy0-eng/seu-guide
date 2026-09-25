/**
 * Cloudflare Worker — Discord OAuth + role validation + secure GitHub publishing
 *
 * Required Worker secrets:
 *   DISCORD_CLIENT_ID
 *   DISCORD_CLIENT_SECRET
 *   GITHUB_TOKEN
 *   PUBLISH_SECRET
 * Required Worker variables:
 *   EDITOR_ROLE_ID (or EDITOR_ROLE_IDS as comma-separated list)
 * Optional:
 *   REQUIRED_ROLE_ID
 *
 * Optional environment variables:
 *   GITHUB_REPO (default: quiklyboy0-eng/seu-guide)
 *   GITHUB_CONTENT_PATH (default: content.json)
 *   GITHUB_BRANCH (default: main)
 */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://quiklyboy0-eng.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (url.pathname === "/auth/discord" || url.pathname === "/") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed" }, 405, cors);
      }
      return await handleDiscordAuth(request, env, cors);
    }

    if (url.pathname === "/publish") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed" }, 405, cors);
      }
      return await handlePublish(request, env, cors);
    }

    return json({ ok: false, error: "Not found" }, 404, cors);
  },
};

async function handleDiscordAuth(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400, cors);
  }

  const { code, redirectUri, guildId, requiredRoleIds } = body || {};
  if (!code || !redirectUri || !guildId || !Array.isArray(requiredRoleIds)) {
    return json({ ok: false, error: "Missing code, redirectUri, guildId, or requiredRoleIds" }, 400, cors);
  }

  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
    return json({ ok: false, error: "Worker is missing Discord credentials" }, 500, cors);
  }

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

  const tokenData = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok || !tokenData.access_token) {
    return json({ ok: false, error: tokenData.error_description || tokenData.error || "Discord token exchange failed" }, 401, cors);
  }

  const discordHeaders = { Authorization: "Bearer " + tokenData.access_token };
  const userRes = await fetch("https://discord.com/api/users/@me", { headers: discordHeaders });
  const user = await userRes.json().catch(() => ({}));
  if (!userRes.ok || !user.id) {
    return json({ ok: false, error: "Could not fetch Discord user" }, 401, cors);
  }

  const memberRes = await fetch("https://discord.com/api/users/@me/guilds/" + guildId + "/member", { headers: discordHeaders });
  const member = await memberRes.json().catch(() => ({}));
  if (!memberRes.ok) {
    return json({ ok: false, error: "You must be a member of the SEU Discord guild" }, 403, cors);
  }

  const roles = Array.isArray(member.roles) ? member.roles.map(String) : [];
  const allowedRoles = requiredRoleIds.concat(env.REQUIRED_ROLE_ID ? [env.REQUIRED_ROLE_ID] : []).filter(Boolean).map(String);
  if (allowedRoles.length && !roles.some((role) => allowedRoles.includes(role))) {
    return json({ ok: false, error: "You do not have the required SEU role." }, 403, cors);
  }

  return json({ ok: true, userId: user.id, username: user.username, globalName: user.global_name || user.username, avatar: user.avatar || null, roles }, 200, cors);
}

async function handlePublish(request, env, cors) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) {
    return json({ ok: false, error: "Missing Authorization token" }, 401, cors);
  }

  const expectedToken = env.PUBLISH_SECRET;
  if (!expectedToken) {
    return json({ ok: false, error: "Server is missing PUBLISH_SECRET" }, 500, cors);
  }

  if (token !== expectedToken) {
    return json({ ok: false, error: "Unauthorized" }, 401, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON payload" }, 400, cors);
  }

  const content = body && body.content;
  if (!content || typeof content !== "object") {
    return json({ ok: false, error: "Missing content object" }, 400, cors);
  }

  if (!env.GITHUB_TOKEN) {
    return json({ ok: false, error: "Server is missing GitHub publishing credentials" }, 500, cors);
  }

  const repo = env.GITHUB_REPO || "quiklyboy0-eng/seu-guide";
  const path = env.GITHUB_CONTENT_PATH || "content.json";
  const api = "https://api.github.com/repos/" + repo + "/contents/" + path;
  const headers = { Authorization: "Bearer " + env.GITHUB_TOKEN, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };

  const getRes = await fetch(api, { headers });
  const meta = await getRes.json().catch(() => ({}));
  if (!getRes.ok || !meta.sha) {
    return json({ ok: false, error: "Could not read GitHub file metadata" }, 502, cors);
  }

  const putRes = await fetch(api, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Update guide content via secure worker publish",
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      branch: env.GITHUB_BRANCH || "main",
      sha: meta.sha,
    }),
  });

  const data = await putRes.json().catch(() => ({}));
  if (!putRes.ok) {
    return json({ ok: false, error: data.message || "GitHub update failed" }, 502, cors);
  }

  return json({ ok: true, sha: data.commit && data.commit.sha, message: "Published successfully" }, 200, cors);
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors } });
}
