window.SEUContent = (function () {
  const LS_KEY = "seu_content_override_v1";
  const TOKEN_KEY = "seu_github_token";
  let cached = null;

  async function load() {
    if (cached) return cached;
    let base = {};
    try {
      const res = await fetch("content.json?t=" + Date.now());
      if (res.ok) base = await res.json();
    } catch (e) {}
    try {
      const override = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (override) {
        cached = deepMerge(base, override);
        return cached;
      }
    } catch (e) {}
    cached = base;
    return cached;
  }

  function deepMerge(a, b) {
    if (Array.isArray(b)) return b.slice();
    if (b && typeof b === "object") {
      const out = Object.assign({}, a);
      Object.keys(b).forEach(function (k) {
        out[k] = deepMerge(a && a[k], b[k]);
      });
      return out;
    }
    return b !== undefined ? b : a;
  }

  function getToken() {
    const c = window.SEU_CONFIG || {};
    return sessionStorage.getItem(TOKEN_KEY) || c.githubToken || "";
  }

  function setToken(token) {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }

  function saveLocal(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    cached = null;
  }

  function clearLocal() {
    localStorage.removeItem(LS_KEY);
    cached = null;
  }

  async function saveGitHub(data) {
    const c = window.SEU_CONFIG || {};
    const token = getToken();
    if (!token || !c.githubRepo) {
      return { ok: false, error: "No GitHub token — paste it on the Edit page, then Save again." };
    }
    const path = c.githubPath || "content.json";
    const api = "https://api.github.com/repos/" + c.githubRepo + "/contents/" + path;
    let sha;
    try {
      const getRes = await fetch(api, {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github+json",
        },
      });
      if (getRes.ok) {
        const meta = await getRes.json();
        sha = meta.sha;
      }
    } catch (e) {}

    const body = {
      message: "Update guide content via web editor",
      content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
      branch: "main",
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(api, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!putRes.ok) {
      const err = await putRes.json().catch(function () { return {}; });
      return { ok: false, error: err.message || "GitHub save failed (" + putRes.status + ")" };
    }
    clearLocal();
    cached = data;
    return { ok: true };
  }

  return {
    load: load,
    saveLocal: saveLocal,
    saveGitHub: saveGitHub,
    clearLocal: clearLocal,
    getToken: getToken,
    setToken: setToken,
  };
})();
