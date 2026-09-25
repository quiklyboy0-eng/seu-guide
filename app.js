(function () {
  const ACCESS_KEY = "1525668434074144890";
  const STORAGE = "seu_guide_auth";

  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const form = document.getElementById("gate-form");
  const input = document.getElementById("access-key");
  const error = document.getElementById("gate-error");
  const logout = document.getElementById("logout");
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const pageTitle = document.getElementById("page-title");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  const CODES = [
    ["10-0", "Lost Eyes"],
    ["10-1", "Frequency Change"],
    ["10-2", "Negative"],
    ["10-3", "Stop Transmitting"],
    ["10-4", "Affirmative"],
    ["10-6", "Busy"],
    ["10-7", "Out Of Service"],
    ["10-8", "In Service"],
    ["10-9", "Repeat"],
    ["10-10", "Fight in Progress"],
    ["10-11", "Traffic Stop"],
    ["10-12", "Standby"],
    ["10-13", "Shots Fired"],
    ["10-14", "Convoy"],
    ["10-15", "Subject in Custody, Enroute to station or county jail"],
    ["10-17", "Suspicious Person"],
    ["10-19", "Ride Along"],
    ["10-20", "Location"],
    ["10-22", "Disregard"],
    ["10-23", "On Scene"],
    ["10-26", "ETA (Estimated Arrival Time)"],
    ["10-29", "Warrant Check"],
    ["10-30", "Wanted Person"],
    ["10-31", "Armed Suspect"],
    ["10-32", "Request Backup (Code 1-2-3)"],
    ["10-35", "Not Wanted / No Warrants"],
    ["10-38", "Suspicious Vehicle"],
    ["11-44", "Person Deceased"],
    ["10-50", "Vehicle Accident"],
    ["10-51", "Request Towing Service"],
    ["10-52", "Request EMS"],
    ["10-53", "Request Fire Department"],
    ["10-54", "Hit and Run"],
    ["10-62", "Kidnapping"],
    ["10-63", "Radio Check"],
    ["10-65", "Armed Robbery"],
    ["10-66", "Reckless Driver"],
    ["10-67", "Fire"],
    ["10-70", "Foot Pursuit"],
    ["10-71", "Request Supervisor at Scene"],
    ["10-73", "Advise Status"],
    ["10-80", "Vehicle Pursuit"],
    ["10-90", "Bank Alarm"],
    ["10-91", "Unnecessary use of Radio"],
    ["10-97", "Enroute"],
    ["10-98", "Body / DB discovered"],
    ["10-99", "Officer In Distress / Officer down"],
  ];

  function unlock() {
    gate.hidden = true;
    app.hidden = false;
    sessionStorage.setItem(STORAGE, "1");
  }

  function lock() {
    sessionStorage.removeItem(STORAGE);
    app.hidden = true;
    gate.hidden = false;
    input.value = "";
    error.hidden = true;
    input.focus();
  }

  function showSection(id) {
    sections.forEach((s) => {
      s.hidden = s.id !== id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
    const active = document.querySelector('.nav-link[href="#' + id + '"]');
    if (active) pageTitle.textContent = active.textContent;
    if (sidebar) sidebar.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Populate 10-codes
  const grid = document.getElementById("codes-grid");
  if (grid) {
    CODES.forEach(([code, meaning]) => {
      const el = document.createElement("div");
      el.className = "code-item";
      el.innerHTML = "<strong>" + code + "</strong><span>" + meaning + "</span>";
      grid.appendChild(el);
    });
  }

  // Gate
  if (sessionStorage.getItem(STORAGE) === "1") {
    unlock();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (input.value || "").trim();
    if (val === ACCESS_KEY) {
      error.hidden = true;
      unlock();
      showSection("intro");
    } else {
      error.hidden = false;
      input.select();
    }
  });

  logout.addEventListener("click", lock);

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      showSection(id);
      history.replaceState(null, "", "#" + id);
    });
  });

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Deep link
  const hash = (location.hash || "#intro").slice(1);
  if (sessionStorage.getItem(STORAGE) === "1") {
    showSection(document.getElementById(hash) ? hash : "intro");
  }
})();
