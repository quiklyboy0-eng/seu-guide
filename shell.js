window.SEUShell = {
  init: function (page) {
    if (!window.SEUAuth || !SEUAuth.requireAuth()) return;

    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-page") === page);
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
