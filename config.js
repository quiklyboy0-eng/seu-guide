// Discord OAuth configuration
// WARNING: clientSecret in the browser is NOT secure on a public site.
window.SEU_CONFIG = {
  clientId: "1552851671862874112",
  clientSecret: "PAKS4OcMu7S9XR0LlsQNt6mswp_-JkkR",
  guildId: "1525668434065752116",
  // Must have ONE of these roles to open the guide
  requiredRoleIds: ["1525668434074144890"],
  // Must have ONE of these roles to edit the guide
  editorRoleIds: [
    "1532108760024354947",
    "1525669484084334714",
    "1525668434120020134"
  ],
  redirectUri: "https://quiklyboy0-eng.github.io/seu-guide/callback.html",
  authApiUrl: "",
  // Optional: GitHub PAT with contents:write on seu-guide repo so Save publishes for everyone
  // Create at https://github.com/settings/tokens (fine-grained, only this repo)
  githubToken: "",
  githubRepo: "quiklyboy0-eng/seu-guide",
  githubPath: "content.json",
};
