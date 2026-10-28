(() => {
  const optionButtons = [...document.querySelectorAll("button.relative.rounded-xl.border-2")]
    .map((button) => {
      const label = button.querySelector("span")?.textContent.trim() ?? "";
      const match = label.match(/^R\$\s*([\d.]+,\d{2})$/);
      if (!match) return null;

      const amount = Number(match[1].replace(/\./g, "").replace(",", "."));
      button.classList.add("donation-amount-option");
      button.dataset.amount = String(amount);
      return { button, amount, popular: button.textContent.includes("opção mais escolhida") };
    })
    .filter(Boolean);

  const amountFields = [...document.querySelectorAll("input#valor-livre")];
  const donateButtons = [...document.querySelectorAll("button.btn-donate")]
    .filter((button) => button.textContent.includes("com PIX"));

  if (!optionButtons.length || !donateButtons.length) return;

  const formatAmount = (amount) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);

  let selectedPreset = optionButtons.find(({ button }) => button.querySelector(".lucide-check"))?.amount ?? 30;

  const selectPreset = (amount) => {
    for (const { button, amount: optionAmount, popular } of optionButtons) {
      const selected = amount === optionAmount;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.remove(
        "border-primary",
        "bg-accent",
        "text-accent-foreground",
        "border-border",
        "bg-card",
        "text-foreground",
        "border-primary/70",
        "bg-accent/30",
      );

      if (selected) {
        button.classList.add("border-primary", "bg-accent", "text-accent-foreground");
      } else {
        button.classList.add("border-border", "bg-card", "text-foreground");
        if (popular) {
          button.classList.add("border-primary/70", "bg-accent/30");
        }
      }

      button.querySelector(".lucide-check")?.remove();
      button.querySelector(".donation-amount-check")?.remove();
      if (selected) {
        const check = document.createElement("span");
        check.className = "donation-amount-check";
        check.setAttribute("aria-hidden", "true");
        check.textContent = "✓";
        button.append(check);
      }
    }
  };

  const updateDonateButtons = (amount) => {
    for (const button of donateButtons) {
      button.replaceChildren(
        document.createTextNode("Doar "),
        ...(amount > 0 ? [document.createTextNode(formatAmount(amount))] : []),
        document.createTextNode(" com PIX"),
      );
      button.disabled = amount <= 0;
    }
  };

  document.addEventListener("click", (event) => {
    const clickedOption = event.target.closest?.("button.donation-amount-option");
    if (!clickedOption) return;

    selectedPreset = Number(clickedOption.dataset.amount);
    for (const field of amountFields) field.value = "";
    selectPreset(selectedPreset);
    updateDonateButtons(selectedPreset);
  }, true);

  for (const field of amountFields) {
    field.addEventListener("input", () => {
      const digits = field.value.replace(/\D/g, "");
      for (const otherField of amountFields) {
        if (otherField !== field) otherField.value = digits;
      }

      if (digits) {
        selectPreset(null);
        updateDonateButtons(Number(digits));
      } else {
        selectPreset(selectedPreset);
        updateDonateButtons(selectedPreset);
      }
    });
  }

  selectPreset(selectedPreset);
  updateDonateButtons(selectedPreset);
})();
