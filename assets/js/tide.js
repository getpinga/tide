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

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) +
    "; expires=" + expires + "; path=/";
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1] || null;
}

function initLanguageSelector() {
  document.querySelectorAll("a.language_selector").forEach(link => {

    link.addEventListener("click", (e) => {
      e.preventDefault();

      const lang =
        link.dataset.lang ||
        link.getAttribute("value") ||
        new URL(link.href, location.origin).searchParams.get("lang");

      if (!lang) return;

      setCookie("BBLANG", lang, 7);
      location.reload();
    });

    const current = getCookie("BBLANG");

    if (current) {
      if (
        link.dataset.lang === current ||
        link.getAttribute("value") === current
      ) {
        link.classList.add("active");
      }
    }

  });
}

document.addEventListener("DOMContentLoaded", initLanguageSelector);