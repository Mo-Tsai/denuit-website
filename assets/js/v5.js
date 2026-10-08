/* de nuit — site v5：一道光（捲動進度）／淡入／目錄／頁首捲動後加底／聲音／開場 Enter（v6.4）／GA4 事件（v6.4） */
(() => {
  const root = document.documentElement;
  const lang = (root.lang || '').startsWith('zh') ? 'zh' : 'en';
  /* GA4：產生器沒填 GA4_ID 就沒有 gtag，這裡什麼都不送。參數只有語言、有無聲音、連結種類，不收個資 */
  const track = (name, params) => { try { if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ lang }, params)); } catch (e) {} };
  /* 開場 Enter：首頁開場還停著（.intro）的時候，後面的東西先不能用 Tab 進去；
     其他頁（或開場已經過了）就記一筆「這個分頁進過站」，回首頁不再擋 */
  const gated = root.classList.contains('intro');
  const behind = () => document.querySelectorAll('header.top, .overlay, footer, main > :not(.hero)');
  if (gated) behind().forEach(el => el.setAttribute('inert', ''));
  else { try { sessionStorage.setItem('dn-entered', '1'); } catch (e) {} }

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
    const btns = [...document.querySelectorAll('[data-sound]')];
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
    if (want && !gated) play();                 // 換頁後接著播；瀏覽器擋下就維持關閉；開場停著時等 Enter
    /* Enter＝開聲音進站（配樂 2.5 秒淡入）；「不開聲音進入」＝進站不播。聲音開關跟著這個選擇 */
    document.addEventListener('dn:enter', e => {
      if (e.detail.sound === 'on') { render(true); play(); save('on'); }
      else { if (!bgm.paused) stop(); else render(false); save('off'); }
    });
  }
  document.addEventListener('dn:enter', e => {
    behind().forEach(el => el.removeAttribute('inert'));
    const h1 = document.querySelector('.hero h1'); if (h1) h1.focus({ preventScroll: true });   // 焦點留在頁面開頭，不掉到 body
    track('enter_site', { sound: e.detail.sound === 'on' ? 'on' : 'off' });
  });
  /* 訂位點擊：頁首「訂位」、各段「線上訂位」、目錄裡的訂位，以及任何 inline 連結（訂位頁裡的 iframe 是別人的網域，點不到） */
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href');
    if (/(^|\/)reservation\.html([?#]|$)/.test(h)) track('reservation_click', { link_type: 'reservation_page' });
    else if (/inline\.app/.test(h)) track('reservation_click', { link_type: 'inline' });
  }, true);

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
