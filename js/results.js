window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('[data-w]').forEach(el => {
        el.style.width = el.dataset.w;
      });
    }, 300);
  });

  // Live countdown to next update
  let secs = 58;
  setInterval(() => {
    secs = secs <= 1 ? 60 : secs - 1;
    const txt = document.querySelector('.statusbar-text');
    if (txt) txt.textContent = `System Online · Results Live · Next update in ${secs}s · 84% precincts reporting`;
  }, 1000);