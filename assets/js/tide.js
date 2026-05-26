document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem('theme');
  const logo = document.getElementById('company-logo');

  if (theme === 'dark') {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    if (logo) logo.src = logo.dataset.logoDark || logo.dataset.logoLight;
  } else {
    document.documentElement.setAttribute("data-bs-theme", "light");
    if (logo) logo.src = logo.dataset.logoLight || logo.dataset.logoDark;
  }

  const THEME_KEY = "theme";

  function applyTheme(theme) {
    const t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", t);

    document.querySelectorAll(".hide-theme-dark").forEach(el => {
      el.style.display = (t === "dark") ? "none" : "";
    });
    document.querySelectorAll(".hide-theme-light").forEach(el => {
      el.style.display = (t === "light") ? "none" : "";
    });

    const logo = document.getElementById("company-logo");
    if (logo) {
      logo.src = (t === "dark")
        ? (logo.dataset.logoDark || logo.dataset.logoLight)
        : (logo.dataset.logoLight || logo.dataset.logoDark);
    }
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  document.querySelectorAll(".js-theme-toggler").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const theme = new URL(el.href, window.location.origin).searchParams.get("theme");
      if (!theme) return;

      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof API !== "undefined" && document.querySelector("form[data-fb-api]")) {
    API._apiForm();
  }
  if (typeof API !== "undefined" && document.querySelector("a[data-fb-api]")) {
    API._apiLink();
  }
});
