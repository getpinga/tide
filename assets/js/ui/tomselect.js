import TomSelect from 'tom-select';

globalThis.TomSelect = TomSelect;

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

function initLocaleSelector() {
  const localeSelectorEl = document.querySelector(".js-locale-selector");
  if (localeSelectorEl === null) {
    return;
  }

  const renderLocale = (data, escape) => `<div>${data.customProperties || ""}${escape(data.text)}</div>`;

  const localeSelector = new TomSelect(localeSelectorEl, {
    controlInput: false,
    items: [getCookie("fb_locale")],
    render: {
      item: renderLocale,
      option: renderLocale,
    },
  });

  localeSelector.on("change", (value) => {
    setCookie("fb_locale", value, 365);
    window.location.reload();
  });
}

document.addEventListener("DOMContentLoaded", initLocaleSelector);
