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
  /* 聲音：按了才播（瀏覽器不准自動出聲）；2.5 秒淡入；切到別的 App 暫停；記住客人的選擇 */
  const bgm = document.getElementById('bgm');
  if (bgm) {
    const root = document.documentElement, btns = [...document.querySelectorAll('[data-sound]')];
    const render = on => { root.classList.toggle('sound-on', on); btns.forEach(b => b.setAttribute('aria-pressed', on)); };
    let timer = null;
    const fade = (to, ms, done) => {          // iOS 不給調音量，那邊會直接以原音量播／停
      clearInterval(timer); const from = bgm.volume, t0 = performance.now();
      timer = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); bgm.volume = from + (to - from) * k; if (k === 1) { clearInterval(timer); done && done(); } }, 40);
    };
    const save = v => { try { localStorage.setItem('dn-sound', v); } catch (e) {} };
    const play = () => { bgm.volume = 0; return bgm.play().then(() => { render(true); fade(.55, 2500); }).catch(() => render(false)); };
    const stop = () => { render(false); fade(0, 900, () => bgm.pause()); };
    btns.forEach(b => b.addEventListener('click', () => { if (root.classList.contains('sound-on')) { stop(); save('off'); } else { play(); save('on'); } }));
    document.addEventListener('visibilitychange', () => { if (!root.classList.contains('sound-on')) return; document.hidden ? bgm.pause() : bgm.play().catch(() => {}); });
    let want = false; try { want = localStorage.getItem('dn-sound') === 'on'; } catch (e) {}
    if (want) play();                           // 換頁後接著播；瀏覽器擋下就維持關閉
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
