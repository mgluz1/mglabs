// Regra: se o JS não rodar, a página fica CERTA, só sem movimento.
// Nenhum efeito aqui é dono de conteúdo.
(function () {
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temIO = 'IntersectionObserver' in window;

  // ---------- NAV: sombra depois de rolar ----------
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- ENTRADA ESCALONADA POR SCROLL ----------
  // O atributo é aplicado aqui, não no HTML: com JS desligado nada fica invisível.
  if (!semMovimento && temIO) {
    var alvos = document.querySelectorAll('.etapa, .dif, .obra, .sobre-moldura, .sobre-texto');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var irmaos = Array.prototype.filter.call(e.target.parentElement.children, function (n) {
          return n.hasAttribute('data-surge');
        });
        var i = Math.min(irmaos.indexOf(e.target), 6); // teto: fila longa não pode virar espera
        e.target.style.transitionDelay = (i * 60) + 'ms';
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(alvos, function (el) {
      el.setAttribute('data-surge', '');
      obs.observe(el);
    });
  }

  // ---------- BRILHO QUE SEGUE O CURSOR ----------
  // Coordenadas via variável CSS dentro de requestAnimationFrame, pra não travar o scroll.
  if (!semMovimento && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.obra-shot, .servico'), function (el) {
      el.classList.add('brilho');
      var pend = null;
      el.addEventListener('mousemove', function (ev) {
        if (pend) return;
        pend = requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
          el.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
          pend = null;
        });
      });
    });
  }

  // ---------- HERO FORA DA TELA: PAUSA AS ANIMAÇÕES ----------
  // A janela do hero anima em loop infinito; rolando pra baixo, ninguém vê.
  var hero = document.querySelector('.hero-site7');
  if (hero && temIO) {
    new IntersectionObserver(function (es) {
      hero.classList.toggle('fora-da-tela', !es[0].isIntersecting);
    }).observe(hero);
  }

  // ---------- PRA QUEM É: DESTAQUE QUE PERCORRE OS PERFIS ----------
  // Troca de item a cada --pq-tempo; o mouse fixa o destaque; fora da tela, para.
  var pq = document.querySelector('.pq-lista');
  if (pq && !semMovimento && temIO) {
    var itens = pq.querySelectorAll('.pq-item');
    var tempo = parseFloat(getComputedStyle(pq).getPropertyValue('--pq-tempo')) * 1000 || 2800;
    var atual = 0, relogio = null, visivel = false, mouse = false;
    var ativar = function (n) {
      itens[atual].classList.remove('ativo');
      void itens[n].offsetWidth;            // reinicia a barra mesmo se for o mesmo item
      itens[n].classList.add('ativo');
      atual = n;
    };
    var rodar = function () {
      clearInterval(relogio); relogio = null;
      if (!visivel || mouse) return;
      relogio = setInterval(function () { ativar((atual + 1) % itens.length); }, tempo);
    };
    pq.classList.add('pq-viva');
    ativar(0);
    Array.prototype.forEach.call(itens, function (el, n) {
      el.addEventListener('mouseenter', function () { mouse = true; pq.classList.add('pausada'); ativar(n); rodar(); });
    });
    pq.addEventListener('mouseleave', function () { mouse = false; pq.classList.remove('pausada'); ativar(atual); rodar(); });
    new IntersectionObserver(function (es) {
      visivel = es[0].isIntersecting;
      if (visivel && !mouse) ativar(atual);
      rodar();
    }, { threshold: 0.3 }).observe(pq);
  }

  // ---------- BARRA DE PROGRESSO DE LEITURA ----------
  // Só em página longa; numa curta a barra fica quase cheia e não informa nada.
  if (!semMovimento && document.body.scrollHeight > window.innerHeight * 3) {
    var barra = document.createElement('div');
    barra.className = 'progresso';
    document.body.appendChild(barra);
    // Altura medida só quando muda (imagem carregou, janela redimensionou), nunca
    // dentro do scroll: ler scrollHeight a cada quadro força o navegador a recalcular o layout.
    var max = 0, tick = null;
    var medir = function () { max = document.documentElement.scrollHeight - window.innerHeight; };
    medir();
    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(document.body);
    window.addEventListener('resize', medir, { passive: true });
    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = requestAnimationFrame(function () {
        barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
        tick = null;
      });
    }, { passive: true });
  }
})();
