import { mountCastle } from './castle.js?v=mvst4nik';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The castle: fixed and scroll-built on the home page, still on a chapter page.
document.querySelectorAll('canvas.castle').forEach((c) => {
  const part = c.dataset.part;
  mountCastle(c, part === undefined ? { mode: 'scroll' } : { mode: 'still', part: Number(part) });
});

// One reveal, once.
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => (reduce ? el.classList.add('is-in') : io.observe(el)));

// Sound board: one effect at a time, the button says what it is doing.
let playing = null;
document.querySelectorAll('[data-sound]').forEach((btn) => {
  const audio = new Audio(btn.dataset.sound);
  audio.preload = 'none';
  const label = btn.querySelector('[data-state]');
  const set = (on) => { btn.setAttribute('aria-pressed', String(on)); if (label) label.textContent = on ? 'Playing' : 'Play'; };
  audio.addEventListener('ended', () => set(false));
  audio.addEventListener('pause', () => set(false));
  btn.addEventListener('click', () => {
    if (playing && playing !== audio) { playing.pause(); playing.currentTime = 0; }
    if (!audio.paused) { audio.pause(); audio.currentTime = 0; return; }
    playing = audio;
    audio.currentTime = 0;
    audio.play().then(() => set(true)).catch(() => set(false));
  });
});

// A loop that can pause: runs only on screen, holds on hover and focus, has its own button.
document.querySelectorAll('[data-loop]').forEach((el) => {
  const btn = el.querySelector('[data-loop-toggle]') || document.getElementById(el.dataset.toggle);
  const s = { seen: false, hover: false, focus: false, held: reduce };
  const sync = () => {
    const run = s.seen && !s.hover && !s.focus && !s.held;
    el.classList.toggle('is-running', run);
    el.querySelectorAll('video').forEach((v) => (run ? v.play().catch(() => {}) : v.pause()));
    if (btn) btn.textContent = s.held ? 'Play' : 'Pause';
  };
  btn?.addEventListener('click', () => { s.held = !s.held; sync(); });
  [['pointerenter', 'hover', true], ['pointerleave', 'hover', false], ['focusin', 'focus', true], ['focusout', 'focus', false]]
    .forEach(([t, k, v]) => el.addEventListener(t, (ev) => { if (k === 'focus' && ev.target === btn) return; s[k] = v; sync(); }));
  new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(el);
});

// The research scene: Claude's home view, the question typed and sent, the matching events lit in Amplitude, the answer, then the chart.
document.querySelectorAll('[data-demo]').forEach((demo) => {
  if (reduce) return; // the finished scene is the markup's default
  const replay = demo.parentElement.querySelector('[data-demo-replay]');
  const field = demo.querySelector('[data-type]');
  const input = field.closest('.claude__input');
  const placeholder = field.textContent;
  const full = field.dataset.full;
  const send = input.querySelector('.claude__send');
  const recent = demo.querySelector('[data-recent]');
  const steps = [...demo.querySelectorAll('.demo__chat [data-step]')];
  const chart = demo.querySelector('.demo__chart');
  const rows = [...demo.querySelectorAll('tr[data-match]')];
  let timers = [];
  // the Day 30 figure climbs as the line is drawn towards it
  const counter = demo.querySelector('[data-count]');
  const target = Number(counter.dataset.count);
  let raf = 0;
  const countUp = () => {
    const t0 = performance.now() + 300;
    const tick = (now) => {
      const k = Math.min(1, Math.max(0, (now - t0) / 2200));
      counter.textContent = (target * (1 - Math.pow(1 - k, 2))).toFixed(1);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const reset = () => {
    timers.forEach(clearTimeout); timers = [];
    cancelAnimationFrame(raf);
    counter.textContent = '0.0';
    demo.classList.add('is-armed', 'is-home');
    demo.querySelectorAll('.is-on:not(.claude__seg *)').forEach((el) => el.classList.remove('is-on'));
    rows.forEach((r) => r.classList.remove('is-match'));
    field.textContent = placeholder;
    field.classList.remove('has-text');
    input.classList.remove('has-text');
    if (replay) replay.hidden = true;
  };
  const play = () => {
    reset();
    // the question is typed into the composer on Claude's home view, then sent
    let t = 900;
    [...full].forEach((ch, i) => at(t + i * 55, () => {
      field.textContent = full.slice(0, i + 1);
      field.classList.add('has-text');
      input.classList.add('has-text');
    }));
    t += full.length * 55 + 500;
    at(t, () => send.classList.add('is-pressed'));
    at(t + 160, () => {
      send.classList.remove('is-pressed');
      demo.classList.remove('is-home');
      recent?.classList.add('is-on');
      steps[0].classList.add('is-on');
    });
    t += 1100;
    steps.slice(1).forEach((step) => {
      at(t, () => {
        step.classList.add('is-on');
        if (step.hasAttribute('data-highlight')) rows.forEach((r) => r.classList.add('is-match'));
        if (step.classList.contains('msg--claude')) { chart.classList.add('is-on'); countUp(); }
      });
      t += step.classList.contains('msg--claude') ? 0 : 1100;
    });
    at(t + 2000, () => { if (replay) replay.hidden = false; });
  };
  reset();
  replay?.addEventListener('click', play);
  const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.disconnect(); play(); } }, { threshold: 0.45 });
  seen.observe(demo);
});

// LegacyKeeper colourways: each swatch shows direction D in that colour; the last shows the screen that was kept.
document.querySelectorAll('.lk-pick').forEach((pick) => {
  const swatches = [...pick.querySelectorAll('[data-way]')];
  const screens = [...pick.querySelectorAll('.lk-phone img')];
  const caption = pick.querySelector('.lk-phone figcaption');
  const choose = (n) => {
    swatches.forEach((s, i) => { s.setAttribute('aria-checked', String(i === n)); s.tabIndex = i === n ? 0 : -1; });
    screens.forEach((img, i) => img.classList.toggle('is-on', i === n));
    caption.textContent = swatches[n].dataset.caption;
  };
  swatches.forEach((s, i) => {
    s.addEventListener('click', () => choose(i));
    s.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const n = (i + step + swatches.length) % swatches.length;
      choose(n); swatches[n].focus();
    });
  });
  screens.forEach((img) => { img.loading = 'eager'; }); // the swap should never wait on a download
  choose(0);
});

// The app icon is drawn step by step once it is on screen: circle, guides, hexagon, flat fill, metal, the finished icon.
// "Draw it again" stays in place and is disabled while a drawing plays.
document.querySelectorAll('[data-assemble]').forEach((el) => {
  if (reduce) return; // the finished icon is the markup's default
  const replay = el.querySelector('[data-assemble-replay]');
  const steps = [['s1', 150], ['s2', 1650], ['s3', 2850], ['s4', 4350], ['s5', 5350], ['s6', 7300]];
  const done = 8700;
  let timers = [];
  const busy = (on) => { if (!replay) return; replay.disabled = on; replay.setAttribute('aria-disabled', String(on)); };
  const play = () => {
    timers.forEach(clearTimeout);
    el.classList.remove(...steps.map(([c]) => c));
    el.classList.add('is-armed');
    busy(true);
    void el.offsetWidth; // start every step from the bare canvas
    timers = steps.map(([c, t]) => setTimeout(() => el.classList.add(c), t));
    timers.push(setTimeout(() => busy(false), done));
  };
  el.classList.add('is-armed');
  busy(true);
  replay?.addEventListener('click', play);
  const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.disconnect(); play(); } }, { threshold: 0.5 });
  seen.observe(el);
});

// Boost: the button lands, the sweep light crosses it, its states follow, Claude's code types out, then becomes the document.
// "Play again" stays in place and is disabled while the sequence plays.
document.querySelectorAll('[data-boost]').forEach((el) => {
  if (reduce) return; // the finished state is the markup's default
  const replay = el.parentElement.querySelector('[data-boost-replay]');
  const steps = [['b1', 200], ['is-swept', 1500], ['b2', 2300], ['b3', 3500], ['b4', 7300]];
  const done = 9200;
  let timers = [];
  const busy = (on) => { if (replay) { replay.disabled = on; replay.setAttribute('aria-disabled', String(on)); } };
  const play = () => {
    timers.forEach(clearTimeout);
    el.classList.remove(...steps.map(([c]) => c));
    el.classList.add('is-armed');
    busy(true);
    void el.offsetWidth; // start from the empty stage
    timers = steps.map(([c, t]) => setTimeout(() => el.classList.add(c), t));
    timers.push(setTimeout(() => busy(false), done));
  };
  el.classList.add('is-armed');
  busy(true);
  replay?.addEventListener('click', play);
  const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.disconnect(); play(); } }, { threshold: 0.4 });
  seen.observe(el);
});

// Just Shapes moments: plays the list in order once it is on screen, one moment every few seconds.
// It pauses on hover and focus, the button pauses and resumes it, and clicking a moment shows that one.
document.querySelectorAll('[data-moments]').forEach((el) => {
  const items = [...el.querySelectorAll('[data-moment]')];
  const bases = Object.fromEntries([...el.querySelectorAll('[data-base]')].map((b) => [b.dataset.base, b]));
  const layers = Object.fromEntries([...el.querySelectorAll('[data-layer]')].map((l) => [l.dataset.layer, l]));
  const dim = el.querySelector('.mom__dim');
  const tap = el.querySelector('.mom__tap');
  const live = el.querySelector('[data-moment-live]');
  const toggle = el.parentElement.querySelector('[data-moments-toggle]');
  const neutral = 'win3'; // the level before anything happens: every booster still available
  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const at = (ms, fn) => timers.push(setTimeout(fn, reduce ? 0 : ms));
  const showBase = (k) => Object.entries(bases).forEach(([n, b]) => b.classList.toggle('is-on', n === k));
  const hideLayers = () => { Object.values(layers).forEach((l) => l.classList.remove('is-on')); dim.classList.remove('is-on'); };
  const mark = (item) => {
    items.forEach((i) => { const on = i === item; i.classList.toggle('is-on', on); i.setAttribute('aria-pressed', String(on)); });
    live.textContent = `${item.querySelector('.mom__kind').textContent}: ${item.querySelector('.mom__words').textContent}`;
  };
  // one moment; returns how long it takes
  const show = (item) => {
    clear();
    const k = item.dataset.moment;
    mark(item);
    hideLayers();
    if (item.dataset.tap) {
      showBase(neutral);
      tap.style.setProperty('--tap-x', `${item.dataset.tap}%`);
      at(350, () => { tap.classList.remove('is-on'); void tap.offsetWidth; tap.classList.add('is-on'); });
      at(650, () => showBase(k));
      at(800, () => layers[k].classList.add('is-on'));
      return 3200;
    }
    showBase(k);
    at(200, () => dim.classList.add('is-on'));
    at(380, () => layers[k].classList.add('is-on'));
    return 3600;
  };
  // the autoplay walks the list; it can be paused between moments
  const s = { n: -1, playing: false, hold: false, held: false, next: null };
  const label = () => { if (toggle) toggle.textContent = s.playing ? (s.held ? 'Play' : 'Pause') : 'Play again'; };
  const step = () => {
    s.next = null;
    if (s.hold || s.held) return;
    s.n += 1;
    if (s.n >= items.length) { s.playing = false; label(); return; }
    const ms = show(items[s.n]);
    s.next = setTimeout(step, ms);
  };
  const start = () => { s.n = -1; s.playing = true; s.held = false; label(); step(); };
  const resume = () => { if (s.playing && !s.next && !s.hold && !s.held) s.next = setTimeout(step, 800); };
  const pause = () => { clearTimeout(s.next); s.next = null; };
  toggle?.addEventListener('click', () => {
    if (!s.playing) return start();
    s.held = !s.held;
    if (s.held) pause(); else resume();
    label();
  });
  items.forEach((item, i) => item.addEventListener('click', () => { pause(); s.playing = false; label(); show(item); s.n = i; }));
  [['pointerenter', true], ['pointerleave', false], ['focusin', true], ['focusout', false]].forEach(([t, v]) => el.addEventListener(t, () => {
    s.hold = v;
    if (v) pause(); else resume();
  }));
  if (reduce) { if (toggle) toggle.hidden = true; return; } // no autoplay: the list still switches moments
  label();
  const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.disconnect(); start(); } }, { threshold: 0.5 });
  seen.observe(el);
});

// The Freecash logo plays its own Lottie file; lottie-web loads only on pages that have one.
const lotties = document.querySelectorAll('[data-lottie]');
if (lotties.length) {
  const s = document.createElement('script');
  s.src = new URL('./vendor/lottie_light.min.js', import.meta.url).href;
  s.onload = () => lotties.forEach((el) => {
    const anim = window.lottie.loadAnimation({ container: el, renderer: 'svg', loop: !reduce, autoplay: false, path: el.dataset.lottie });
    if (reduce) { anim.addEventListener('DOMLoaded', () => anim.goToAndStop(anim.totalFrames - 1, true)); return; }
    new IntersectionObserver(([e]) => (e.isIntersecting ? anim.play() : anim.pause())).observe(el);
  });
  document.head.append(s);
}

// The cashback onboarding: the screens land piece by piece, together, then their cards fold away and fan out again, on a loop.
document.querySelectorAll('[data-onboarding]').forEach((el) => {
  if (reduce) return; // the finished screens are the markup's default
  const screens = [...el.querySelectorAll('.ob')];
  const fans = screens.filter((sc) => sc.querySelector('.ob__piece--center, .ob__piece--fan'));
  const btn = document.getElementById(el.dataset.toggle);
  // the earned figure counts up from zero over two seconds once its plate has slid into place
  const show = (c, v) => { c.textContent = `${c.dataset.prefix}${Math.round(v).toLocaleString('en-US')}${c.dataset.suffix}`; };
  const countUp = (sc) => sc.querySelectorAll('[data-count]').forEach((c) => {
    show(c, 0);
    const at = parseFloat(c.parentElement.style.getPropertyValue('--delay')) || 0;
    after(at + 800, () => {
      const t0 = performance.now(), to = +c.dataset.count;
      const step = (now) => { const k = Math.min(1, (now - t0) / 2000); show(c, to * (1 - (1 - k) ** 4)); if (k < 1 && c.isConnected && el.classList.contains('is-running')) requestAnimationFrame(step); else if (k < 1) show(c, to); };
      requestAnimationFrame(step);
    });
  });
  const span = (sc) => Math.max(...[...sc.querySelectorAll('.ob__piece')].map((p) => parseFloat(p.style.getPropertyValue('--delay')) || 0)) + 900;
  const s = { seen: false, held: false, started: false };
  let timers = [];
  const after = (ms, fn) => timers.push(setTimeout(fn, ms));
  const cycle = () => {
    fans.forEach((f) => f.classList.add('is-fold'));
    after(1100, () => { fans.forEach((f) => { f.classList.remove('is-fold'); countUp(f); }); after(Math.max(...fans.map(span)) + 2200, cycle); });
  };
  const start = () => {
    if (s.started) { screens.forEach((sc) => sc.classList.add('is-on')); after(2200, cycle); return; }
    s.started = true;
    // every screen starts together
    after(150, () => screens.forEach((sc) => { sc.classList.add('is-on'); countUp(sc); }));
    after(150 + Math.max(...screens.map(span)) + 1600, cycle);
  };
  const sync = () => {
    const run = s.seen && !s.held;
    timers.forEach(clearTimeout);
    timers = [];
    fans.forEach((f) => f.classList.remove('is-fold'));
    el.querySelectorAll('[data-count]').forEach((c) => show(c, +c.dataset.count));
    el.classList.toggle('is-running', run);
    if (btn) btn.textContent = s.held ? 'Play' : 'Pause';
    if (run) start();
  };
  el.classList.add('is-armed');
  btn?.addEventListener('click', () => { s.held = !s.held; sync(); });
  new IntersectionObserver(([e]) => { const on = e.intersectionRatio >= 0.4; if (on !== s.seen) { s.seen = on; sync(); } }, { threshold: [0, 0.4] }).observe(el);
});
