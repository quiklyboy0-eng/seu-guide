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

    var hr = document.getElementById("nav-highrank");
    if (hr) {
      if (SEUAuth.canAccessHighRank()) {
        hr.style.display = "";
      } else {
        hr.remove();
      }
    } else if (SEUAuth.canAccessHighRank()) {
      var nav = document.querySelector(".nav");
      if (nav && !document.getElementById("nav-highrank")) {
        var link = document.createElement("a");
        link.href = "highrank.html";
        link.className = "nav-link";
        link.id = "nav-highrank";
        link.setAttribute("data-page", "highrank");
        link.textContent = "High Rank Guide";
        if (page === "highrank") link.classList.add("active");
        nav.appendChild(link);
      }
    }

    var nav2 = document.querySelector(".nav");
    if (nav2 && SEUAuth.canEdit() && !document.getElementById("edit-link")) {
      var elink = document.createElement("a");
      elink.href = "edit.html";
      elink.className = "nav-link";
      elink.id = "edit-link";
      elink.textContent = "Edit guide";
      if (page === "edit") elink.classList.add("active");
      nav2.appendChild(elink);
    }

    var params = new URLSearchParams(location.search);
    var flash = params.get("flash");
    if (flash) {
      var bar = document.createElement("div");
      bar.className = "flash-bar";
      bar.textContent = flash;
      var main = document.querySelector(".content") || document.querySelector(".main");
      if (main) main.insertBefore(bar, main.firstChild);
      try {
        history.replaceState({}, "", location.pathname);
      } catch (e) {}
      setTimeout(function () {
        bar.classList.add("fade");
        setTimeout(function () { bar.remove(); }, 400);
      }, 3200);
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
