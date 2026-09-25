window.SEUShell = {
  init: function (page) {
    if (!window.SEUAuth || !SEUAuth.requireAuth()) return;

    document.querySelectorAll(".nav-link").forEach(function (a) {
      var dp = a.getAttribute("data-page");
      if (dp) a.classList.toggle("active", dp === page);
    });

    var session = SEUAuth.getSession();
    var box = document.getElementById("user-box");
    if (box && session) {
      box.innerHTML =
        '<div class="user-meta"><strong>' +
        (session.globalName || session.username || "Member") +
        "</strong><span>@" +
        (session.username || "") +
        "</span></div>";
    }

    // Editor link for allowed roles
    var nav = document.querySelector(".nav");
    if (nav && SEUAuth.canEdit() && !document.getElementById("edit-link")) {
      var link = document.createElement("a");
      link.href = "edit.html";
      link.className = "nav-link";
      link.id = "edit-link";
      link.textContent = "Edit guide";
      if (page === "edit") link.classList.add("active");
      nav.appendChild(link);
    }

    var logout = document.getElementById("logout");
    if (logout) logout.addEventListener("click", function () { SEUAuth.logout(); });

    var toggle = document.getElementById("menu-toggle");
    var sidebar = document.querySelector(".sidebar");
    if (toggle && sidebar) {
      toggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
      });
    }
  },
};
