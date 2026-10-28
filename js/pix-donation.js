(() => {
  const pixCode = "00020101021126580014br.gov.bcb.pix0136f17d9423-7a94-4df1-9f4c-54ac06ce61ed5204000053039865802BR5918PAGAMENTOS SEGUROS6009SAO PAULO62280524PZD14D0AC4295418954C36156304BAED";

  const dialog = document.createElement("dialog");
  dialog.className = "pix-donation-dialog";
  dialog.setAttribute("aria-labelledby", "pix-donation-title");
  dialog.innerHTML = `
    <div class="pix-donation-content">
      <div class="pix-donation-heading">
        <h2 id="pix-donation-title">Doe via Pix</h2>
        <button class="pix-donation-close" type="button" aria-label="Fechar">&times;</button>
      </div>
      <p class="pix-donation-description">Escaneie o QR Code com o aplicativo do seu banco ou copie o código Pix abaixo.</p>
      <img class="pix-donation-qr" src="images/qr-pix.png" alt="QR Code Pix para doar à campanha da Heloisa">
      <p class="donation-minimum-note" role="note">Doação mínima permitida pela plataforma: <strong>R$ 5,00</strong>.</p>
      <label class="pix-donation-label" for="pix-donation-code">Código Pix copia e cola</label>
      <div class="pix-donation-code-row">
        <code class="pix-donation-code" id="pix-donation-code"></code>
        <button class="pix-donation-copy" type="button">Copiar</button>
      </div>
      <p class="pix-donation-status" aria-live="polite"></p>
    </div>
  `;

  dialog.querySelector(".pix-donation-code").textContent = pixCode;
  document.body.append(dialog);

  const closeButton = dialog.querySelector(".pix-donation-close");
  const copyButton = dialog.querySelector(".pix-donation-copy");
  const status = dialog.querySelector(".pix-donation-status");

  const closeDialog = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };

  document.addEventListener("click", (event) => {
    const donateButton = event.target.closest?.("button.btn-donate");
    if (donateButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      status.textContent = "";
      copyButton.textContent = "Copiar";
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      return;
    }

    if (event.target === dialog) closeDialog();
  }, true);

  closeButton.addEventListener("click", closeDialog);

  copyButton.addEventListener("click", async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pixCode);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = pixCode;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Não foi possível copiar o código.");
      }
      copyButton.textContent = "Copiado!";
      status.textContent = "Código Pix copiado.";
    } catch {
      status.textContent = "Não foi possível copiar. Selecione o código e copie manualmente.";
    }
  });
})();
