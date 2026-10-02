(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const sticky = document.querySelector('.mobile-sticky-actions');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    if (sticky) sticky.classList.toggle('is-hidden', window.scrollY < 80);
  }
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.classList.toggle('is-open', open);
    header.classList.toggle('menu-active', open);
    document.body.classList.toggle('menu-open', open);
    mobileMenu.inert = !open;
    if (open) mobileMenu.querySelector('a')?.focus();
    else toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  const tiles = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (tiles.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Galería de trabajos');
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Cerrar galería">×</button><button class="lightbox-prev" aria-label="Imagen anterior">‹</button><img alt=""><button class="lightbox-next" aria-label="Imagen siguiente">›</button><span class="lightbox-caption"></span>';
    document.body.append(lightbox);
    let current = 0;
    let opener;
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    function show(index) {
      current = (index + tiles.length) % tiles.length;
      const source = tiles[current].querySelector('img');
      img.src = source.src;
      img.alt = source.alt;
      caption.textContent = tiles[current].querySelector('span')?.textContent.replace('↗', '').trim() || '';
    }
    function open(index, button) {
      opener = button;
      show(index);
      lightbox.classList.add('is-open');
      document.body.classList.add('lightbox-open');
      lightbox.querySelector('.lightbox-close').focus();
    }
    function close() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      opener?.focus();
    }
    tiles.forEach((tile, index) => tile.addEventListener('click', () => open(index, tile)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
    window.addEventListener('keydown', event => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }
})();
