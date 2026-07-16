/* de nuit — site v2
   極簡 JS：reveal on scroll／行動選單／Journal 主題篩選
   Hero Plan A 的微放大與文字淡入全部走 CSS（style.css :root 變數可調） */

(function () {
  /* Reveal on scroll */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* 行動版選單 */
  const burger = document.getElementById('navBurger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-menu a').forEach((a) =>
      a.addEventListener('click', () => document.body.classList.remove('menu-open'))
    );
  }

  /* The Journal 主題篩選（頁面上有 .journal-tabs 才啟動） */
  const tabs = document.querySelectorAll('.journal-tabs button');
  if (tabs.length) {
    tabs.forEach((btn) => btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.journal-cat').forEach((sec) => {
        sec.style.display = (cat === 'all' || sec.dataset.cat === cat) ? '' : 'none';
      });
    }));
  }
})();
