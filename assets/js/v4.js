/* de nuit — site v4「從夜出發」（品牌規範 v1.5）
   一道光＝捲動進度／淡入／目錄／首頁長廊縮放
   v1.5 起不做捲動時鐘、天色、依台北時間的即時提示（週五、六有午餐，品牌不講時段） */
(() => {
  const home = document.body.classList.contains('home');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 淡入 */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* 目錄 */
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    document.querySelectorAll('.menu-btn').forEach(x => x.setAttribute('aria-expanded', open));
  };
  document.querySelectorAll('[data-menu]').forEach(b => b.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open'))));
  document.querySelectorAll('.overlay nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* 一道光（進度）＋長廊 */
  const progress = document.querySelector('.progress');
  const passage = document.querySelector('.passage');
  const pimg = passage && passage.querySelector('img');
  const ptext = passage && passage.querySelector('.ctext');

  function onScroll() {
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (home) document.body.classList.toggle('scrolled', y > vh * 0.6);
    if (passage && !reduce) {
      const r = passage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, passage.offsetHeight - vh)));
      pimg.style.transform = `scale(${1 + p * 0.4})`;
      pimg.style.filter = `brightness(${0.4 + p * 0.35})`;
      ptext.style.opacity = Math.max(0, Math.min(1, (p - 0.3) * 3));
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
