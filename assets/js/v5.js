/* de nuit — site v5：一道光（捲動進度）／淡入／目錄／頁首捲動後加底 */
(() => {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const overlay = document.querySelector('.overlay');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    overlay.setAttribute('aria-hidden', !open);
    document.querySelectorAll('.menu-btn').forEach(x => x.setAttribute('aria-expanded', open));
  };
  document.querySelectorAll('[data-menu]').forEach(b => b.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open'))));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const progress = document.querySelector('.progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    document.body.classList.toggle('scrolled', scrollY > innerHeight * 0.5 || !document.body.classList.contains('home') && scrollY > 10);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
