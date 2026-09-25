// Discord OAuth configuration
// Create an application at https://discord.com/developers/applications
// OAuth2 → Redirects: add https://quiklyboy0-eng.github.io/seu-guide/callback.html
window.SEU_CONFIG = {
  // REQUIRED for Discord login — paste from Discord Developer Portal
  clientId: "",
  // Guild (server) ID where the rank role lives
  guildId: "",
  // Role ID that is allowed to access the guide
  requiredRoleId: "1525668434074144890",
  // Redirect after Discord login (must match Discord app settings exactly)
  redirectUri: "https://quiklyboy0-eng.github.io/seu-guide/callback.html",
  // Optional: Cloudflare Worker / backend URL that exchanges code + checks role
  // Example: "https://seu-auth.yourname.workers.dev"
  authApiUrl: "",
};
