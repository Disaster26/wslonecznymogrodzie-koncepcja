// naglowek, menu, galeria, lightbox, mapa, formularz podgladu
(function () {
  var top = document.getElementById('top');
  function przewin() { top.classList.toggle('pelny', window.scrollY > 40 || menu.classList.contains('otw')); }
  var menu = document.getElementById('menu');
  var burger = document.querySelector('.burger');
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('otw');
    burger.setAttribute('aria-expanded', o);
    burger.textContent = o ? 'Zamknij' : 'Menu';
    przewin();
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('otw'); burger.setAttribute('aria-expanded', false); burger.textContent = 'Menu'; przewin(); }
  });
  window.addEventListener('scroll', przewin, { passive: true });
  przewin();

  // galeria: [plik, szer, wys, opis]
  var zd = [
    ['lato-dom', 1360, 907, 'Domek latem od strony ogrodu'],
    ['lato-sciezka', 1500, 844, 'Alejka przez ogród do domu'],
    ['lato-kwiaty', 1500, 844, 'Kwiaty w ogrodzie'],
    ['lato-rabaty', 1500, 844, 'Rabaty i trawnik'],
    ['lato-oczko', 1500, 844, 'Ogród przed domem'],
    ['lato-zywoplot', 1500, 844, 'Żywopłoty i rabaty'],
    ['lato-trawnik', 1500, 844, 'Dom i trawnik'],
    ['salon-kominek', 1500, 844, 'Salon z kominkiem'],
    ['jadalnia', 1486, 836, 'Jadalnia'],
    ['kuchnia', 1500, 844, 'Kuchnia'],
    ['sypialnia', 1500, 844, 'Sypialnia'],
    ['pokoj', 1500, 844, 'Pokój na poddaszu'],
    ['lazienka-wanna', 667, 1000, 'Łazienka z dużą wanną'],
    ['lazienka', 667, 1000, 'Łazienka'],
    ['balkon', 1360, 907, 'Balkon z widokiem na ogród'],
    ['zima-dom', 1266, 844, 'Domek zimą'],
    ['zima-front', 1274, 844, 'Wejście zimą'],
    ['zima-balkon', 1266, 844, 'Ośnieżony balkon'],
    ['zima-staw', 1266, 844, 'Oczko wodne zimą'],
    ['zima-swierki', 1266, 844, 'Świerki w śniegu'],
    ['zima-noc', 1600, 1200, 'Domek nocą']
  ];
  var tasma = document.getElementById('tasma');
  zd.forEach(function (z, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.dataset.i = i; b.setAttribute('aria-label', 'Powiększ: ' + z[3]);
    var w = 800, h = Math.round(z[2] * 800 / z[1]);
    if (z[1] < 800) { w = z[1]; h = z[2]; }
    b.innerHTML = '<img src="img/' + z[0] + '-800.webp" srcset="img/' + z[0] + '-800.webp ' + Math.min(800, z[1]) + 'w' + (z[1] > 800 ? ', img/' + z[0] + '.webp ' + Math.min(1600, z[1]) + 'w' : '') + '" sizes="(max-width:760px) ' + Math.round(250 * z[1] / z[2]) + 'px, ' + Math.round(440 * z[1] / z[2]) + 'px" width="' + w + '" height="' + h + '" loading="lazy" alt="' + z[3] + '" draggable="false">';
    tasma.appendChild(b);
  });

  // przeciaganie mysza
  var ciag = false, sx = 0, sl = 0, ruch = 0;
  tasma.addEventListener('mousedown', function (e) { ciag = true; ruch = 0; sx = e.pageX; sl = tasma.scrollLeft; tasma.classList.add('ciagnie'); });
  window.addEventListener('mousemove', function (e) { if (!ciag) return; var d = e.pageX - sx; ruch = Math.max(ruch, Math.abs(d)); tasma.scrollLeft = sl - d; });
  window.addEventListener('mouseup', function () { if (!ciag) return; ciag = false; tasma.classList.remove('ciagnie'); });
  document.querySelectorAll('.strzalki button').forEach(function (b) {
    b.addEventListener('click', function () { tasma.scrollBy({ left: +b.dataset.k * tasma.clientWidth * 0.7, behavior: 'smooth' }); });
  });

  // lightbox
  var lb = document.getElementById('lb'), li = lb.querySelector('img'), nr = lb.querySelector('.nr'), akt = 0;
  function pokaz(i) {
    akt = (i + zd.length) % zd.length;
    li.src = 'img/' + zd[akt][0] + '.webp'; li.alt = zd[akt][3];
    nr.textContent = zd[akt][3] + ' - ' + (akt + 1) + ' / ' + zd.length;
  }
  tasma.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || ruch > 6) return;
    pokaz(+b.dataset.i); lb.classList.add('otw'); document.body.style.overflow = 'hidden'; lb.querySelector('.zam').focus();
  });
  function zamknij() { lb.classList.remove('otw'); document.body.style.overflow = ''; }
  lb.querySelector('.zam').addEventListener('click', zamknij);
  lb.querySelector('.pop').addEventListener('click', function () { pokaz(akt - 1); });
  lb.querySelector('.nas').addEventListener('click', function () { pokaz(akt + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) zamknij(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('otw')) return;
    if (e.key === 'Escape') zamknij(); if (e.key === 'ArrowLeft') pokaz(akt - 1); if (e.key === 'ArrowRight') pokaz(akt + 1);
  });
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) pokaz(akt + (d < 0 ? 1 : -1)); });

  // mapa dopiero przy przewinieciu
  var mapa = document.getElementById('mapa');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        mapa.innerHTML = '<iframe src="' + mapa.dataset.src + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa dojazdu: ul. Śnieżna 26, Michałowice"></iframe>';
        io.disconnect();
      }
    }, { rootMargin: '300px' });
    io.observe(mapa);
  }

  // formularz w podgladzie nic nie wysyla
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('info').textContent = 'To podgląd strony - w wersji docelowej zapytanie trafi od razu na Państwa skrzynkę e-mail.';
  });
})();
