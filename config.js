// Discord OAuth configuration
// WARNING: clientSecret in the browser is visible in page source.
window.SEU_CONFIG = {
  clientId: "1552851671862874112",
  clientSecret: "PAKS4OcMu7S9XR0LlsQNt6mswp_-JkkR",
  guildId: "1525668434065752116",
  // Must have ONE of these roles to open the main guide
  requiredRoleIds: ["1525668434074144890"],
  // Must have this role to open the High Rank Guide
  highRankRoleIds: ["1525668434107568233"],
  // Must have ONE of these roles to edit the guide
  editorRoleIds: [
    "1532108760024354947",
    "1525669484084334714",
    "1525668434120020134"
  ],
  // Primary admin Discord user IDs — full access + can manage bypass list
  adminUserIds: [
    "1167146975385358394"
  ],
  redirectUri: "https://quiklyboy0-eng.github.io/seu-guide/callback.html",
  authApiUrl: "",
  githubToken: "",
  githubRepo: "quiklyboy0-eng/seu-guide",
  githubPath: "content.json",
};
