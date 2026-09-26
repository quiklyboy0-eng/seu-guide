window.SEUAuth = (function () {
  const STORAGE = "seu_session_v3";
  const cfg = () => window.SEU_CONFIG || {};

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE) || "null");
    } catch {
      return null;
    }
  }

  function setSession(data) {
    sessionStorage.setItem(STORAGE, JSON.stringify(data));
  }

  function clearSession() {
    sessionStorage.removeItem(STORAGE);
  }

  function isLoggedIn() {
    const s = getSession();
    return !!(s && s.userId && s.ok);
  }

  function hasAnyRole(roleIds) {
    const s = getSession();
    if (!s || !s.roles || !roleIds || !roleIds.length) return false;
    const set = new Set(s.roles.map(String));
    return roleIds.some(function (id) { return set.has(String(id)); });
  }

  function canEdit() {
    return hasAnyRole(cfg().editorRoleIds || []);
  }

  function canAccessHighRank() {
    return hasAnyRole(cfg().highRankRoleIds || []);
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      location.replace("index.html");
      return false;
    }
    return true;
  }

  function startLogin() {
    const c = cfg();
    const err = document.getElementById("auth-error");
    if (!c.clientId) {
      if (err) {
        err.hidden = false;
        err.textContent = "Discord Client ID is missing in config.js";
      }
      return;
    }
    const params = new URLSearchParams({
      client_id: c.clientId,
      response_type: "code",
      redirect_uri: c.redirectUri,
      scope: "identify guilds.members.read",
      prompt: "consent",
    });
    location.href = "https://discord.com/api/oauth2/authorize?" + params.toString();
  }

  function roleAllowed(roles, allowed) {
    if (!allowed || !allowed.length) return true;
    const set = new Set((roles || []).map(String));
    return allowed.some(function (id) { return set.has(String(id)); });
  }

  async function exchangeCodeBrowser(code) {
    const c = cfg();
    const body = new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: c.redirectUri,
    });
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      const msg = tokenData.error_description || tokenData.error || "Token exchange failed";
      return { ok: false, error: msg };
    }

    const headers = { Authorization: "Bearer " + tokenData.access_token };

    const userRes = await fetch("https://discord.com/api/users/@me", { headers });
    const user = await userRes.json();
    if (!userRes.ok || !user.id) {
      return { ok: false, error: "Could not load Discord user" };
    }

    const memberRes = await fetch(
      "https://discord.com/api/users/@me/guilds/" + c.guildId + "/member",
      { headers }
    );
    const member = await memberRes.json();
    if (!memberRes.ok) {
      return {
        ok: false,
        error: "You must be in the SEU Discord server (and allow guilds.members.read).",
      };
    }

    const roles = (member.roles || []).map(String);
    const required = c.requiredRoleIds || (c.requiredRoleId ? [c.requiredRoleId] : []);
    if (!roleAllowed(roles, required)) {
      return { ok: false, error: "You do not have the required rank role." };
    }

    setSession({
      ok: true,
      userId: user.id,
      username: user.username,
      globalName: user.global_name || user.username,
      avatar: user.avatar || null,
      roles: roles,
    });
    return { ok: true };
  }

  async function handleCallback(code) {
    const c = cfg();
    if (c.authApiUrl) {
      const res = await fetch(c.authApiUrl.replace(/\/$/, "") + "/auth/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          redirectUri: c.redirectUri,
          guildId: c.guildId,
          requiredRoleIds: c.requiredRoleIds || [c.requiredRoleId],
        }),
      });
      const data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || "Access denied" };
      }
      setSession({
        ok: true,
        userId: data.userId,
        username: data.username,
        globalName: data.globalName || data.username,
        avatar: data.avatar || null,
        roles: data.roles || [],
      });
      return { ok: true };
    }
    return exchangeCodeBrowser(code);
  }

  function logout() {
    clearSession();
    location.replace("index.html");
  }

  return {
    isLoggedIn: isLoggedIn,
    requireAuth: requireAuth,
    startLogin: startLogin,
    handleCallback: handleCallback,
    getSession: getSession,
    canEdit: canEdit,
    canAccessHighRank: canAccessHighRank,
    hasAnyRole: hasAnyRole,
    logout: logout,
  };
})();
