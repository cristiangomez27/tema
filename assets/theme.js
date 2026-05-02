(() => {
  const $all = (s, root = document) => Array.from(root.querySelectorAll(s));

  document.addEventListener('click', (event) => {
    const menu = event.target.closest('[data-menu-toggle]');
    if (menu) document.body.classList.toggle('menu-open');

    const thumb = event.target.closest('[data-thumb]');
    if (thumb) {
      const main = document.querySelector('[data-main-product-image]');
      if (main) main.src = thumb.dataset.thumb;
    }
  });

  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('.product-card__form');
    if (!form || !window.fetch) return;
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const oldText = button ? button.textContent : '';
    try {
      const response = await fetch('/cart/add.js', { method: 'POST', body: new FormData(form) });
      if (!response.ok) throw new Error('No se pudo agregar');
      if (button) {
        button.classList.add('is-added');
        button.textContent = 'Agregado ✓';
        setTimeout(() => { button.classList.remove('is-added'); button.textContent = oldText; }, 1200);
      }
      const cart = await fetch('/cart.js').then(r => r.json());
      $all('[data-cart-count]').forEach(el => el.textContent = cart.item_count || 0);
    } catch (error) {
      form.submit();
    }
  });
})();
