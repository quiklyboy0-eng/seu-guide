window.SEUAuth = (function () {
  const STORAGE = "seu_session_v2";
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
        err.textContent =
          "Discord login is not configured yet. Add your Discord Application Client ID in config.js (see README).";
      }
      return;
    }
    if (!c.redirectUri) {
      if (err) {
        err.hidden = false;
        err.textContent = "Missing redirect URI in config.js";
      }
      return;
    }
    const params = new URLSearchParams({
      client_id: c.clientId,
      response_type: "code",
      redirect_uri: c.redirectUri,
      scope: "identify guilds.members.read",
      prompt: "none",
    });
    location.href = "https://discord.com/api/oauth2/authorize?" + params.toString();
  }

  async function handleCallback(code) {
    const c = cfg();
    if (!c.authApiUrl) {
      return {
        ok: false,
        error:
          "Auth API not configured. Set authApiUrl in config.js to a backend that exchanges the Discord code and checks the role.",
      };
    }
    const res = await fetch(c.authApiUrl.replace(/\/$/, "") + "/auth/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        redirectUri: c.redirectUri,
        guildId: c.guildId,
        requiredRoleId: c.requiredRoleId,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || "Access denied" };
    }
    setSession({
      ok: true,
      userId: data.userId,
      username: data.username,
      globalName: data.globalName || data.username,
      avatar: data.avatar || null,
    });
    return { ok: true };
  }

  function logout() {
    clearSession();
    location.replace("index.html");
  }

  return {
    isLoggedIn,
    requireAuth,
    startLogin,
    handleCallback,
    getSession,
    logout,
  };
})();
