function initCurrencySelector() {
  document.querySelectorAll("select.currency_selector").forEach(select => {
    select.addEventListener("change", () => {
      API.guest.post(
        "cart/set_currency",
        { currency: select.value },
        () => {
          location.reload();
        },
        (error) => {
          FOSSBilling.message(error, "error");
        }
      );
    });
  });
}

document.addEventListener("DOMContentLoaded", initCurrencySelector);
