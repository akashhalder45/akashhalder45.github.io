(() => {
  const dialog = document.getElementById('certificate-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = document.getElementById('certificate-title');
  const image = document.getElementById('certificate-image');
  const status = document.getElementById('certificate-status');
  const verify = document.getElementById('certificate-verify');
  let trigger;
  let request = 0;
  document.querySelectorAll('[data-certificate-preview]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      trigger = link;
      dialog.classList.toggle('testdome-preview', link.dataset.certificatePreview.includes('testdome-'));
      const label = link.cloneNode(true);
      label.querySelectorAll('[aria-hidden]').forEach(node => node.remove());
      title.textContent = label.textContent.trim();
      verify.href = link.href;
      image.hidden = true;
      image.removeAttribute('src');
      image.alt = title.textContent + ' credential preview';
      status.hidden = false;
      status.textContent = 'Loading certificate preview?';
      const current = ++request;
      dialog.showModal();
      document.documentElement.classList.add('certificate-open');
      const preview = new Image();
      preview.onload = () => {
        if (current !== request || !dialog.open) return;
        image.src = preview.src;
        image.hidden = false;
        status.hidden = true;
      };
      preview.onerror = () => {
        if (current !== request || !dialog.open) return;
        status.textContent = 'A preview is not available for this certificate. Use the verification link below to view it on the issuer?s website.';
      };
      preview.src = link.dataset.certificatePreview;
    });
  });
  document.getElementById('certificate-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    ++request;
    document.documentElement.classList.remove('certificate-open');
    image.removeAttribute('src');
    image.hidden = true;
    if (trigger) trigger.focus();
  });
})();
