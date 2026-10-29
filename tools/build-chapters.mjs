// Builds chapters/*.html from the content below. Run: node tools/build-chapters.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dims = JSON.parse(readFileSync(join(root, 'tools/dims.json'), 'utf8'));
const logo = readFileSync(join(root, 'assets/logo-path.txt'), 'utf8').trim();

const chapters = [
  {
    slug: 'research', title: 'AI-driven user research & ideation', adds: 'The foundations and the plan',
    lead: 'Plain questions to Amplitude through Claude, then layouts built on the answers.',
    work: 'Freecash at Almedia, LegacyKeeper', with: 'Claude, Amplitude, Voicepanel, Figma',
    blocks: [
      { type: 'text', h: 'The constraint', p: [
        'Freecash, Almedia’s rewards app, serves 60 million users, and Amplitude holds the story of how they move. But a funnel only opens up if you know every event name and how the taxonomy is built.',
        'For a designer that meant waiting for an analyst, or guessing.',
      ] },
      { type: 'statement', text: 'So I connected Claude to Amplitude, and the taxonomy stopped being the gate.' },
      { type: 'demo' },
      { type: 'rows', h: 'The loop', items: [
        ['Ask', 'A plain question about one flow.'],
        ['Query', 'Claude finds the events and builds the funnel.'],
        ['Verify', 'I check the same funnel in Amplitude.'],
        ['Use', 'The numbers feed ideas and proposals.'],
      ] },
      { type: 'text', h: 'From answers to layouts', p: [
        'For My Offers, Voicepanel answers and Customer Support notes went to Claude for analysis.',
        'With AI agents, we brainstormed new layouts against the problems it found.',
      ] },
      { type: 'rail', label: 'Five versions of My Offers', note: 'Five versions reached Figma, real enough to put in front of users.', items: [1, 2, 3, 4, 5].map((v) => ({ src: `my-offers-v${v}.jpg`, cap: `V${v}`, alt: `My Offers, version ${v}` })), notes: { items: [
        ['confirmed', 'Confirmed by community', 'V3 as the base direction', 'Both Reddit and Discord independently landed on V3. Build from here.'],
        ['confirmed', 'Confirmed by community', 'Progress bars + %, but applied selectively', 'Most praised addition across both channels.'],
        ['confirmed', 'Confirmed by community', 'Ability to hide / dismiss offers', 'Users are stuck with irrelevant or completed offers blocking the list.'],
        ['signal', 'Strong signal', 'Surface the next locked bonus reward', 'Currently completely invisible: users are flying blind.'],
        ['signal', 'Strong signal', 'Play Rewards before Burning Rewards', 'Play rewards are the most frequent activity; they should lead.'],
      ] } },
      { type: 'legacykeeper' },
    ],
  },
  {
    slug: 'ux-ui', title: 'AI-driven UX/UI design', adds: 'The walls',
    lead: 'One AI-built design system across an extension, apps and websites.',
    work: 'Atolls, Just Shapes', with: 'Figma, Claude',
    blocks: [
      { type: 'text', h: 'One system, many surfaces', p: [
        'coupons.com lived on search traffic alone, so one Google ranking change could wipe out acquisition. We answered with a browser extension and a mobile app.',
        'The design system behind them was built with AI, so we designed complex products fast across the extension, the apps and customers’ websites.',
      ] },
      { type: 'figure', src: 'coupons-extension.webp', alt: 'The coupons.com browser extension open beside a merchant’s page, offering cashback', cap: 'The coupons.com extension, on a merchant’s page.' },
      { type: 'rail', label: 'The coupons.com mobile app', note: 'The same system, on the phone.', items: [4, 5, 6, 7].map((i) => ({ src: `coupons-app-${i}.jpg`, alt: 'A screen from the coupons.com mobile app' })) },
      { type: 'text', h: 'Designed in Figma, built by Claude', p: [
        'On Just Shapes, I designed the screens and the component library in Figma. Claude did the technical implementation of everything, reading exact numbers from the file through a bridge plugin.',
        'I moderated: I judged the taste and the atmosphere, and made manual tweaks when they were needed.',
      ] },
      { type: 'components' },
      { type: 'screens', items: [['splash', 'Splash'], ['tutorial', 'Tutorial'], ['home', 'Home map'], ['select', 'Selecting shapes']] },
    ],
  },
  {
    slug: 'design-ops', title: 'AI in design operations', adds: 'The towers',
    lead: 'Tokens, specs and docs kept in step by AI.',
    work: 'Boost design system at Almedia', with: 'Claude Code, Figma',
    blocks: [
      { type: 'text', h: 'Boost', p: [
        'A startup lives on a fast release cycle, and quality is the first thing to slip. Ready-to-use components keep designers and front-end developers fast and consistent.',
        'With Boost we built a fully AI-driven design system: Claude turns each component’s tokens into code, and the code into documentation.',
        'We built a Claude skill for that last step, so every page it writes follows our documentation standards.',
      ] },
      { type: 'boost' },
    ],
  },
  {
    slug: 'storytelling', title: 'Storytelling with AI (and how it helps in QA)', adds: 'The gate',
    lead: 'Stories from the record, words that make a game fun, and bots that test it.',
    work: 'Just Shapes', with: 'Claude',
    blocks: [
      { type: 'text', h: 'The making-of, from the record', p: [
        'When Just Shapes shipped, Claude drafted an article brief from 76 commits, eight docs, two QA reports and our chats.',
      ] },
      { type: 'text', h: 'Words that make it fun', p: [
        'Together with Claude, I shaped every line the game says: boosters cheer, results talk about moves, and a loss means the shapes won this round.',
        'Claude’s review also caught victory copy on the out-of-moves screen, and a “Withdraw” button that became “Quit”.',
      ] },
      { type: 'moments' },
      { type: 'text', h: 'Bots as playtesters', p: [
        'On Just Shapes, three AI testers played every level: a QA pass, an expert bot and a casual one.',
        'Their first verdict: “Playable and pleasant; not yet fair.” A perfect player won level 20 only 3% of the time, so I retuned the curve against their numbers.',
      ] },
      { type: 'pair', items: [
        { src: 'shapes-winrates.jpg', alt: 'Win rates by level for the expert and casual bots after tuning', cap: 'Win rates after tuning' },
        { src: 'shapes-playtest.jpg', alt: 'The Just Shapes playtest report of 4 September, open in an editor', cap: 'The playtest report' },
      ] },
    ],
  },
  {
    slug: 'sound', title: 'Sound design', adds: 'The keep and its bell',
    lead: 'Two soundtracks and a set of effects for a calm puzzle game.',
    work: 'Just Shapes', with: 'Claude, ElevenLabs',
    blocks: [
      { type: 'statement', text: '“Soft, chill, kinda meditative music, with some notes of technology or space.”', by: 'An “amazing” first prompt I gave to Claude, and felt myself as a composer!' },
      { type: 'text', h: 'From a sentence to a soundtrack', p: [
        'Claude wrote the prompts for every track and effect; I generated them and judged each by ear.',
        'Claude then wired them in, with haptics.',
      ] },
      { type: 'sound' },
    ],
  },
  {
    slug: 'motion', title: 'AI in motion design', adds: 'The roofs, banners and lights',
    lead: 'Choreography tuned in plain-language rounds and checked frame by frame.',
    work: 'Almedia, Just Shapes', with: 'Claude Code, Lottie, Rive, SwiftUI',
    blocks: [
      { type: 'almedia' },
      { type: 'jshead', h: 'Just Shapes', p: 'Designing and shipping a calm puzzle game that trains your attention span.',
        video: 'shapes-level', label: 'Just Shapes, level 5 played through: shapes joined into paths and loops, the Mix, +1 Move and Erase boosters with their messages, then three stars' },
      { type: 'rows', h: 'Details that took a conversation', items: [
        ['The light stays put', 'Shapes spin; their highlight stays still.'],
        ['Circles float', 'A spinning circle looks still, so circles drift.'],
        ['A glowing edge', 'Three rounds until it moved “slowly but constantly”.'],
        ['Checked on video', 'Judged on screen recordings, not screenshots.'],
      ] },
    ],
  },
];

const sounds = [
  ['connect', 'Connect', 'Shapes join'],
  ['loop-closed', 'Loop closed', 'A kind clears'],
  ['clear-pairs', 'Clear', 'A path clears'],
  ['invalid', 'Invalid move', 'No match'],
  ['board-pops-in', 'Board pops in', 'New board'],
  ['booster-mix', 'Mix booster', 'Shuffle'],
  ['stars', 'Stars', 'Grading'],
  ['victory', 'Victory', 'Level won'],
  ['out-of-moves', 'Out of moves', 'Round lost'],
  ['toggle', 'Toggle', 'Settings'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = (src, alt, sizes, cls = '', lazy = true) => {
  const [w, h] = dims[`img/${src}`] || dims[`video/${src}`];
  return `<img${cls ? ` class="${cls}"` : ''} src="../assets/img/${src}" width="${w}" height="${h}" alt="${esc(alt)}" sizes="${sizes}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
};

function block(b, i) {
  const id = `b${i}`;
  switch (b.type) {
    case 'text':
      return `<section class="ch-text" aria-labelledby="${id}"><div class="container ch-split">
  <h2 id="${id}">${b.h}</h2>
  <div class="ch-prose">${b.p.map((p) => `<p>${p}</p>`).join('\n    ')}</div>
</div></section>`;
    case 'statement':
      return `<section class="ch-statement"><div class="container">
  <blockquote><p class="display-s">${b.text}</p>${b.by ? `<footer>${b.by}</footer>` : ''}</blockquote>
</div></section>`;
    case 'rows':
      return `<section class="ch-rows" aria-labelledby="${id}"><div class="container ch-split">
  <h2 id="${id}">${b.h}</h2>
  <dl class="rows">${b.items.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
</div></section>`;
    case 'figure':
      return `<section class="ch-figure"><div class="container">
  <figure class="shot${b.size ? ` shot--${b.size}` : ''}" data-kind="product">${img(b.src, b.alt, b.size ? '(min-width: 60rem) 40rem, 100vw' : '(min-width: 90rem) 1312px, 100vw')}<figcaption>${b.cap}</figcaption></figure>
</div></section>`;
    case 'rail':
      return `<section class="ch-rail"><div class="container"><p class="ch-rail__note">${b.note}</p></div>
  <ul class="rail${b.cls ? ` ${b.cls}` : ''}" tabindex="0" aria-label="${esc(b.label)}">${b.items.map((it) => `<li><figure class="rail__shot" data-kind="product">${img(it.src, it.alt, '20rem', '', true)}${it.cap ? `<figcaption>${it.cap}</figcaption>` : ''}</figure></li>`).join('')}</ul>
  ${b.notes ? block({ type: 'notes-inner', ...b.notes }, i) : ''}
  ${b.stats ? `<div class="container ch-rail__stats"><dl class="stats stats--${b.stats.length}">${b.stats.map(([n, l]) => `<div><dt>${l}</dt><dd class="fig">${n}</dd></div>`).join('')}</dl></div>` : ''}
</section>`;
    case 'figures':
      return `<section class="ch-figures"><div class="container"><dl class="stats stats--${b.items.length}">${b.items.map(([n, l]) => `<div><dt>${l}</dt><dd class="fig">${n}</dd></div>`).join('')}</dl></div></section>`;
    case 'split':
      return `<section class="ch-pair" aria-labelledby="${id}"><div class="container ch-pair__grid">
  <figure class="shot shot--tall" data-kind="product">${img(b.src, b.alt, '(min-width: 60rem) 30vw, 100vw')}<figcaption>${b.cap}</figcaption></figure>
  <div class="ch-pair__text"><h2 id="${id}">${b.h}</h2>${b.p.map((p) => `<p>${p}</p>`).join('')}</div>
</div></section>`;
    case 'video':
      return `<section class="ch-figure"><div class="container">
  <figure class="shot shot--video" data-loop>
    <video src="../assets/video/${b.src}" poster="../assets/video/${b.poster}" width="1600" height="686" muted loop playsinline preload="metadata" aria-label="${esc(b.cap)}"></video>
    <figcaption><span>${b.cap}</span><button class="btn btn--secondary btn--small" type="button" data-loop-toggle>Pause</button></figcaption>
  </figure>
</div></section>`;
    case 'demo': {
      // Amplitude on the left, Claude on the right; site.js plays it once when it scrolls into view
      const events = [
        ['acct_crt_v2', '312K', true], ['usr_ses_strt_v2', '2.41M', true], ['ofr_wall_imp_v3', '1.87M'], ['rwd_clm_tap', '968K'],
        ['onb_stp4b_cmpl', '274K'], ['pn_optin_v5_ios', '121K'], ['cshout_req_init', '88K'], ['lvl_up_evt_old', '41K'],
      ];
      // a small eight-ray spark in clay, the way Claude marks its replies
      const spark = `<svg class="claude__spark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => { const r = Math.PI * deg / 180, l = i % 2 ? 7.5 : 10.5; return `<line x1="12" y1="12" x2="${(12 + Math.sin(r) * l).toFixed(1)}" y2="${(12 - Math.cos(r) * l).toFixed(1)}"/>`; }).join('')}</svg>`;
      // line icons and the composer, after Claude's desktop app
      const icon = (d) => `<svg class="claude__icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="${d}"/></svg>`;
      const composer = (placeholder, attrs) => `<div class="claude__input" aria-hidden="true">
            <span class="claude__field" ${attrs}>${placeholder}</span>
            <div class="claude__bar">
              <span class="claude__plus">${icon('M8 3.5v9M3.5 8h9')}</span>
              <span class="claude__seg"><span>Chat</span><span class="is-on">Cowork</span></span>
              <span class="claude__model">Opus 5.5 <i>Medium</i></span>
              <span class="claude__mic">${icon('M8 2.5a2 2 0 0 1 2 2V8a2 2 0 0 1-4 0V4.5a2 2 0 0 1 2-2ZM4.5 7.5a3.5 3.5 0 0 0 7 0M8 11v2.5')}</span>
              <span class="claude__send">${icon('M8 13V3M3.5 7.5 8 3l4.5 4.5')}</span>
            </div>
          </div>`;
      const days = [[0, 100], [1, 42], [7, 26], [14, 21], [30, 18.2]];
      const pt = ([d, r]) => `${(16 + d / 30 * 608).toFixed(1)},${(10 + (100 - r) * 1.6).toFixed(1)}`;
      // how far along the line each point sits, so its dot appears as the line reaches it
      const xy = days.map((d) => pt(d).split(',').map(Number));
      const legs = xy.slice(1).map(([x, y], i) => Math.hypot(x - xy[i][0], y - xy[i][1]));
      const total = legs.reduce((a, b) => a + b, 0);
      const reach = xy.map((_, i) => legs.slice(0, i).reduce((a, b) => a + b, 0) / total);
      return `<section class="ch-demo" aria-labelledby="${id}"><div class="container">
  <h2 id="${id}" class="visually-hidden">Asking Amplitude through Claude</h2>
  <div class="demo" data-demo>
    <div class="demo__panel demo__amp">
      <h3 class="demo__app">Amplitude</h3>
      <p class="demo__search">Search 412 events</p>
      <table class="demo__events">
        <thead><tr><th scope="col">Event</th><th scope="col">Last 30 days</th></tr></thead>
        <tbody>${events.map(([e, n, m]) => `<tr${m ? ' class="is-match" data-match' : ''}><td><code>${e}</code></td><td>${n}</td></tr>`).join('')}</tbody>
      </table>
      <figure class="demo__chart" data-step="chart">
        <svg viewBox="0 0 640 200" role="img" aria-label="Retention curve with sample data: Day 1 42%, Day 7 26%, Day 14 21%, Day 30 18.2%">
          ${[25, 50, 75].map((r) => `<line class="demo__grid" x1="16" x2="624" y1="${(10 + (100 - r) * 1.6).toFixed(1)}" y2="${(10 + (100 - r) * 1.6).toFixed(1)}"/>`).join('')}
          <line class="demo__axis" x1="16" y1="170" x2="624" y2="170"/>
          ${days.filter(([d]) => d !== 1).map(([d]) => `<text class="demo__tick" x="${(16 + d / 30 * 608).toFixed(1)}" y="194" text-anchor="${d === 0 ? 'start' : d === 30 ? 'end' : 'middle'}">Day ${d}</text>`).join('')}
          <polygon class="demo__area" points="16,170 ${days.map(pt).join(' ')} 624,170"/>
          <polyline class="demo__curve" pathLength="1" points="${days.map(pt).join(' ')}"/>
          ${days.map((d, i) => `<circle class="demo__dot" r="3.5" cx="${pt(d).split(',')[0]}" cy="${pt(d).split(',')[1]}" style="--at: ${reach[i].toFixed(3)}"/>`).join('')}
        </svg>
        <figcaption><span>Retention, September sign-ups</span><b>Day 30: <span data-count="18.2">18.2</span>%</b></figcaption>
      </figure>
    </div>
    <div class="demo__panel demo__claude">
      <div class="claude__side" aria-hidden="true">
        <ul class="claude__menu">
          <li data-new>${icon('M8 3v10M3 8h10')}New chat</li>
          <li>${icon('M7 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11ZM11 11l3 3')}Search</li>
          <li>${icon('M2.5 4.5h4l1.5 1.5h5.5v7h-11z')}Projects</li>
          <li>${icon('M3 3h6v6H3zM7 7h6v6H7z')}Artifacts</li>
        </ul>
        <p class="claude__group">Recents</p>
        <ul class="claude__recents">
          <li class="is-current" data-recent>RR Day 30</li>
          <li>Onboarding drop-off</li>
          <li>Offer wall funnel</li>
        </ul>
        <p class="claude__user"><span class="claude__avatar">V</span>Vadym</p>
      </div>
      <div class="claude__main">
        <div class="claude__home" aria-hidden="true">
          <p class="claude__hello">${spark}Afternoon, Vadym</p>
          ${composer('How can I help you today?', 'data-type data-full="What’s our RR Day 30?"')}
        </div>
        <div class="claude__thread">
          <ol class="demo__chat">
            <li class="msg msg--you" data-step="ask">What’s our RR Day 30?</li>
            <li class="msg msg--tool" data-step="tool"><span class="tool__icon" aria-hidden="true"></span>Read the Amplitude event taxonomy</li>
            <li class="msg msg--tool" data-step="tool" data-highlight><span class="tool__icon" aria-hidden="true"></span><span>Matched <code>acct_crt_v2</code> and <code>usr_ses_strt_v2</code></span></li>
            <li class="msg msg--tool" data-step="tool"><span class="tool__icon" aria-hidden="true"></span>Built the retention chart</li>
            <li class="msg msg--claude" data-step="answer">${spark}<div><p>Day 30 retention is <b>18.2%</b> for September sign-ups.</p><p>The chart is open in Amplitude to check.</p></div></li>
          </ol>
          ${composer('Reply to Claude…', '')}
        </div>
      </div>
    </div>
  </div>
  <div class="demo__foot"><p>Sample data, not Freecash’s numbers.</p><button class="btn btn--secondary btn--small" type="button" data-demo-replay hidden>Play again</button></div>
</div></section>`;
    }
    case 'notes-inner':
      return `<div class="container ch-notes">
  <ul class="notes" tabindex="0" aria-label="Suggestions from the My Offers board">${b.items.map(([kind, tag, title, body], n) => `<li class="note note--${kind}" data-reveal style="--i: ${n}; --tilt: ${[-2.2, 1.4, -0.8, 2, -1.6][n % 5]}deg"><div class="note__paper"><span class="note__tag">${tag}</span><p class="note__title">${title}</p>${body ? `<p class="note__body">${body}</p>` : ''}</div></li>`).join('')}</ul>
  ${b.cap ? `<p class="ch-notes__cap">${b.cap}</p>` : ''}
</div>`;
    case 'legacykeeper': {
      // seven directions for one home screen, then direction D in every colourway, ending on the one that was kept
      const directions = [['a', 'A', 'Countdown ring'], ['b', 'B', 'Ledger'], ['c', 'C', 'Readiness'], ['d', 'D', 'Calm button'], ['e', 'E', 'Hero and sheet'], ['f', 'F', 'Bento'], ['g', 'G', 'Week of colour']];
      const ways = [['d', 'sage', 'Sage'], ['d1-clay', 'clay', 'Clay'], ['d1-rose', 'rose', 'Dusty rose'], ['d1-twilight', 'twilight', 'Twilight'], ['d1-ocean', 'ocean', 'Ocean'], ['d1-golden', 'golden', 'Golden hour'], ['d1-aurora', 'aurora', 'Aurora'], ['baseline', 'twilight', 'The one we kept', 'Kept: Twilight, with the Ledger’s people']];
      return `<section class="ch-lk" aria-labelledby="${id}">
  <div class="container ch-split">
    <h2 id="${id}">Breadth before depth</h2>
    <div class="ch-prose"><p>On LegacyKeeper, a new product, the home screen started as seven directions side by side.</p><p>Seeing the range first makes the choice a decision instead of a default.</p></div>
  </div>
  <ul class="rail lk-rail" tabindex="0" aria-label="Seven directions for the LegacyKeeper home screen">${directions.map(([f, l, n]) => `<li><figure class="rail__shot lk-shot" data-kind="product">${img(`lk-${f}.jpg`, `LegacyKeeper home screen, direction ${l}: ${n}`, '15rem')}<figcaption><b>${l}</b> ${n}</figcaption></figure></li>`).join('')}</ul>
  <div class="container lk-pick">
    <div class="lk-pick__text">
      <p class="lead">Direction D, the calm button, then went through six colourways.</p>
      <div class="lk-swatches" role="radiogroup" aria-label="Colourway">${ways.map(([f, tok, name], n) => `<button class="lk-swatch${n === ways.length - 1 ? ' lk-swatch--kept' : ''}" type="button" role="radio" aria-checked="${n === 0}" data-way="${n}" data-caption="${ways[n][3] || `Direction D in ${name}`}" style="--a: var(--lk-${tok}-a); --b: var(--lk-${tok}-b)"><span class="lk-swatch__dot" aria-hidden="true"></span>${name}</button>`).join('')}</div>
    </div>
    <figure class="lk-phone" data-kind="product"><div class="lk-phone__screen">${ways.map(([f, tok, name], n) => img(`lk-${f}.jpg`, n === ways.length - 1 ? 'LegacyKeeper home screen as kept: the Twilight button with the Ledger’s contact list' : `LegacyKeeper home screen, the calm button in ${name}`, '24rem', n === 0 ? 'is-on' : '')).join('')}</div><figcaption aria-live="polite">Direction D in Sage</figcaption></figure>
  </div>
</section>`;
    }
    case 'components': {
      // the Just Shapes library, each variant exported from Figma and set at its own size
      const comp = JSON.parse(readFileSync(join(root, 'tools/js-components.json'), 'utf8'));
      const pic = (k, alt) => `<img src="../assets/img/js/${k}.png" width="${comp[k].w}" height="${comp[k].h}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
      const states = [['active', 'Active'], ['activated', 'Selected'], ['inactive', 'Inactive'], ['small', 'Small']];
      const buttons = [['default', 'Default'], ['tap', 'Pressed'], ['disabled', 'Disabled']];
      const kinds = [['false-true', 'Text'], ['true-false', 'Icon'], ['true-true', 'Icon and text']];
      const icons = ['gear', 'mix', '1', 'erase', 'close', 'back', 'check'];
      return `<section class="ch-comps" aria-labelledby="${id}"><div class="container">
  <h2 id="${id}" class="visually-hidden">The Just Shapes component library</h2>
  <div class="comps">
    <div class="comps__tile comps__tile--shapes">
      <h3 class="comps__title">Shapes</h3>
      <table class="comps__shapes"><tbody>${states.map(([st, label]) => `<tr><th scope="row">${label}</th>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<td>${pic(`js-shape-shape${n}-${st}`, `Shape ${n}, ${label.toLowerCase()}`)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </div>
    <figure class="comps__tile comps__tile--icon" data-assemble>
      <figcaption class="comps__title">App icon</figcaption>
      <div class="appicon">
        <svg class="appicon__fills" viewBox="0 0 820 820" aria-hidden="true">
          <circle class="fill fill--disc" cx="410" cy="410" r="410"/>
          <path class="fill fill--shape" d="M434.0,183.9 L593.8,276.1 Q617.8,290.0 617.8,317.7 L617.8,502.3 Q617.8,530.0 593.8,543.9 L434.0,636.1 Q410.0,650.0 386.0,636.1 L226.2,543.9 Q202.2,530.0 202.2,502.3 L202.2,317.7 Q202.2,290.0 226.2,276.1 L386.0,183.9 Q410.0,170.0 434.0,183.9 Z"/>
        </svg>
        ${img('js/icon-disc.png', '', '20rem', 'appicon__disc')}
        ${img('js/icon-shape.png', 'The Just Shapes app icon: a white hexagon on a black disc', '20rem', 'appicon__shape')}
        <svg class="appicon__sheen" viewBox="0 0 820 820" aria-hidden="true">
          <defs>
            <clipPath id="icon-hex"><path d="M434.0,183.9 L593.8,276.1 Q617.8,290.0 617.8,317.7 L617.8,502.3 Q617.8,530.0 593.8,543.9 L434.0,636.1 Q410.0,650.0 386.0,636.1 L226.2,543.9 Q202.2,530.0 202.2,502.3 L202.2,317.7 Q202.2,290.0 226.2,276.1 L386.0,183.9 Q410.0,170.0 434.0,183.9 Z"/></clipPath>
            <linearGradient id="icon-shine" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="var(--color-ink)" stop-opacity="0"/><stop offset="0.5" stop-color="var(--color-ink)" stop-opacity="0.75"/><stop offset="1" stop-color="var(--color-ink)" stop-opacity="0"/></linearGradient>
          </defs>
          <g clip-path="url(#icon-hex)"><rect class="sheen" x="-260" y="-200" width="240" height="1220" fill="url(#icon-shine)"/></g>
        </svg>
        <svg class="appicon__sketch" viewBox="0 0 820 820" aria-hidden="true">
          <circle class="sk sk--circle" pathLength="1" cx="410" cy="410" r="406" transform="rotate(-90 410 410)"/>
          <line class="sk sk--guide" pathLength="1" x1="410" y1="14" x2="410" y2="806"/>
          <line class="sk sk--guide" pathLength="1" x1="14" y1="410" x2="806" y2="410"/>
          <circle class="sk sk--guide" pathLength="1" cx="410" cy="410" r="240" transform="rotate(-90 410 410)"/>
          <path class="sk sk--shape" pathLength="1" d="M434.0,183.9 L593.8,276.1 Q617.8,290.0 617.8,317.7 L617.8,502.3 Q617.8,530.0 593.8,543.9 L434.0,636.1 Q410.0,650.0 386.0,636.1 L226.2,543.9 Q202.2,530.0 202.2,502.3 L202.2,317.7 Q202.2,290.0 226.2,276.1 L386.0,183.9 Q410.0,170.0 434.0,183.9 Z"/>
        </svg>
      </div>
      <button class="btn btn--secondary btn--small appicon__replay" type="button" data-assemble-replay>Draw it again</button>
    </figure>
  </div>
</div></section>`;
    }
    case 'screens':
      return `<section class="ch-screens"><div class="container">
  <ul class="screens">${b.items.map(([f, cap]) => `<li><figure class="screens__shot" data-kind="product">${img(`js/js-screen-${f}.jpg`, `Just Shapes, ${cap.toLowerCase()} screen`, '(min-width: 60rem) 22vw, 45vw')}<figcaption>${cap}</figcaption></figure></li>`).join('')}</ul>
</div></section>`;
    case 'boost': {
      // Boost's primary button: it lands, its states follow, Claude writes the code, and the code becomes the document
      const ph = '<svg class="bt__icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M2.5 2.5 13.5 13.5"/></svg>';
      const button = (state, label = 'Play & Earn', extra = '') => `<span class="bt bt--${state}"${extra}>${ph}<span>${label}</span>${ph}</span>`;
      const states = [['default', 'Default'], ['hover', 'Hover'], ['pressed', 'Pressed'], ['disabled', 'Disabled']];
      const code = [
        ['c', '/* Boost · Button / Primary / Green */'],
        ['s', '.button-primary {'],
        ['d', '  background: <v>var(--core-freecash-green-500)</v>;'],
        ['d', '  box-shadow: <n>0 4px 0 0</n> <v>var(--core-freecash-green-700)</v>;'],
        ['d', '  color: <v>var(--core-grey-blue-900)</v>;'],
        ['d', '  border-radius: <n>8px</n>;'],
        ['d', '  transition: background <n>200ms</n> <n>cubic-bezier(0.25, 0.46, 0.45, 0.94)</n>;'],
        ['s', '}'],
        ['s', '.button-primary:hover {'],
        ['d', '  background: <v>var(--core-freecash-green-600)</v>;'],
        ['s', '}'],
        ['s', '.button-primary:active {'],
        ['d', '  transform: translateY(<n>4px</n>);'],
        ['d', '  box-shadow: none;'],
        ['d', '  transition-duration: <n>90ms</n>;'],
        ['s', '}'],
        ['s', '.button-primary:disabled {'],
        ['d', '  background: <v>var(--core-grey-blue-400)</v>;'],
        ['d', '  color: <v>var(--core-grey-blue-200)</v>;'],
        ['s', '}'],
      ];
      const hl = (t) => esc(t).replace(/&lt;v&gt;(.*?)&lt;\/v&gt;/g, '<span class="tk-v">$1</span>').replace(/&lt;n&gt;(.*?)&lt;\/n&gt;/g, '<span class="tk-n">$1</span>');
      const rows = [
        ['default', 'Default', 'freecash-green.500', 'freecash-green.700', '0 4px 0 0', 'grey-blue.900'],
        ['hover', 'Hover', 'freecash-green.600', 'freecash-green.700', '0 4px 0 0', 'grey-blue.900'],
        ['pressed', 'Pressed', 'freecash-green.500', null, 'none', 'grey-blue.900'],
        ['disabled', 'Disabled', 'grey-blue.400', null, 'none', 'grey-blue.200'],
      ];
      const sw = (t) => `<span class="doc__sw" style="--c: var(--boost-${t.replace('freecash-', '').replace('.', '-')})"></span>`;
      return `<section class="ch-boost" aria-labelledby="${id}"><div class="container">
  <h2 id="${id}" class="visually-hidden">Boost’s primary button, from component to documentation</h2>
  <div class="boost" data-boost>
    <div class="boost__stage">
      <p class="boost__label">Button / Primary / Green</p>
      <div class="boost__hero">${button('live', 'Play & Earn', ' role="img" aria-label="Boost primary button: Play &amp; Earn"')}</div>
      <ul class="boost__states">${states.map(([s, l], n) => `<li style="--i: ${n}">${img(`boost/button-${s}.png`, `${l} state`, '188px', 'boost__shot')}<span class="boost__state">${l}</span></li>`).join('')}</ul>
    </div>
    <div class="boost__out">
      <pre class="boost__code" aria-hidden="true"><code>${code.map(([k, t], n) => `<span class="cl cl--${k}" style="--i: ${n}">${hl(t)}</span>`).join('')}</code></pre>
      <article class="doc" aria-label="The documentation page Claude produced">
        <header class="doc__head"><p class="doc__title">Button / Primary</p><p class="doc__lede">Gamified depth: the button sits on a 4px shadow and presses into it.</p></header>
        <table class="doc__table">
          <thead><tr><th scope="col">State</th><th scope="col">Background</th><th scope="col">Shadow</th><th scope="col">Content</th></tr></thead>
          <tbody>${rows.map(([s, l, bg, sh, shv, ct], n) => `<tr style="--i: ${n}"><th scope="row"><span class="doc__state">${button(s, 'Play & Earn', ' aria-hidden="true"')}<span>${l}</span></span></th><td>${sw(bg)}${bg}</td><td>${sh ? `${sw(sh)}${sh}<small>${shv}</small>` : '<small>none</small>'}</td><td>${sw(ct)}${ct}</td></tr>`).join('')}</tbody>
        </table>
        <dl class="doc__motion" style="--i: 4"><div><dt>Hover</dt><dd>180–220ms, cubic-bezier(0.25, 0.46, 0.45, 0.94)</dd></div><div><dt>Pressed</dt><dd>80–100ms, ease-out</dd></div></dl>
      </article>
    </div>
  </div>
  <div class="boost__foot"><button class="btn btn--secondary btn--small" type="button" data-boost-replay>Play again</button></div>
</div></section>`;
    }
    case 'moments': {
      // the level, its boosters and its result modals, each layer exported from Figma and placed where it sits in the 390 frame
      const mom = JSON.parse(readFileSync(join(root, 'tools/js-moments.json'), 'utf8'));
      const list = [
        ['mix', 'Mix booster', 'Woooosh-pooosh! We mixed it all!', 21.8],
        ['move', '+1 Move booster', 'Freeedoooom! You have one extra move now!', 50],
        ['erase', 'Erase booster', 'Tap on the annoying shape to make it disappear!', 78],
        ['lost', 'Out of moves', 'You did everything you could, but this time the shapes won!'],
        ['win1', 'One star: Good!', 'You managed and can continue your journey!'],
        ['win2', 'Two stars: Great job!', 'Spend fewer moves next time, and all 3 stars will be yours!'],
        ['win3', 'Three stars: Splendid!', 'Your attention is truly enviable!'],
      ];
      const pct = (v, of) => `${(v / of * 100).toFixed(2)}%`;
      const base = (k, on) => `<img class="mom__base${on ? ' is-on' : ''}" data-base="${k}" src="../assets/img/js/moments/base-${k}.jpg" width="600" height="1295" alt="" decoding="async">`;
      const layer = ([k], on) => { const m = mom[k]; return `<img class="mom__layer mom__layer--${m.dim ? 'modal' : 'toast'}${on ? ' is-on' : ''}" data-layer="${k}" src="../assets/img/js/moments/layer-${k}.png" alt="" decoding="async" style="left: ${pct(m.x, 390)}; top: ${pct(m.y, 844 * 1295 / 1299)}; width: ${pct(m.w, 390)}">`; };
      return `<section class="ch-moments" aria-labelledby="${id}"><div class="container">
  <h2 id="${id}" class="visually-hidden">The game’s words, in the moments they appear</h2>
  <div class="mom" data-moments>
    <figure class="mom__phone" data-kind="product">
      <div class="mom__screen">
        ${list.map(([k]) => base(k, k === 'win3')).join('')}
        <span class="mom__dim is-on" aria-hidden="true"></span>
        ${list.map((it) => layer(it, it[0] === 'win3')).join('')}
        <span class="mom__tap" aria-hidden="true"></span>
      </div>
      <figcaption class="visually-hidden" aria-live="polite" data-moment-live>Three stars: Splendid! Your attention is truly enviable!</figcaption>
    </figure>
    <ol class="mom__list">${list.map(([k, kind, words, x]) => `<li><button class="mom__item${k === 'win3' ? ' is-on' : ''}" type="button" data-moment="${k}"${x ? ` data-tap="${x}"` : ''} aria-pressed="${k === 'win3'}"><span class="mom__kind">${kind}</span><span class="mom__words">“${words}”</span></button></li>`).join('')}</ol>
  </div>
  <div class="mom__foot"><button class="btn btn--secondary btn--small" type="button" data-moments-toggle>Pause</button></div>
</div></section>`;
    }
    case 'pair':
      return `<section class="ch-figure ch-figure--follow"><div class="container"><div class="shots-pair">${b.items.map((it) => `<figure class="shot" data-kind="product">${img(it.src, it.alt, '(min-width: 60rem) 34rem, 100vw')}<figcaption>${it.cap}</figcaption></figure>`).join('')}</div></div></section>`;
    case 'jshead':
      // the Just Shapes app icon heads the block, the way the Freecash logo heads Almedia's; under it, a level recorded
      // in the simulator, phone screen only, sized like the Freecash screens
      return `<section class="ch-almedia" aria-labelledby="${id}"><div class="container">
  <div class="alm__head">
    <div class="ch-prose">
      <div class="js-mark">${img('js/icon-disc.png', '', '7.5rem')}${img('js/icon-shape.png', 'The Just Shapes app icon: a white hexagon on a black disc', '7.5rem')}</div>
      <h2 id="${id}">${b.h}</h2>
      <p>${b.p}</p>
    </div>
  </div>
  <figure class="playthrough" data-kind="product" data-loop>
    <video src="../assets/video/${b.video}.mp4" poster="../assets/video/${b.video}-poster.jpg" width="540" height="1174" muted loop playsinline preload="none" aria-label="${esc(b.label)}"></video>
    <div class="playthrough__ctl"><button class="btn btn--secondary btn--small" type="button" data-loop-toggle>Pause</button></div>
  </figure>
</div></section>`;
    case 'almedia': {
      // Freecash: the logo as its Lottie, the chest onboarding as a video, and the cashback onboarding built from its Figma layers
      const ob = JSON.parse(readFileSync(join(root, 'tools/almedia-onboarding.json'), 'utf8'));
      const pct = (v, of) => `${(v / of * 100).toFixed(2)}%`;
      // pieces with a role follow their own order: the centre card, then side cards sliding out from behind it, then the box;
      // fan cards open left to right: the first card lands, then each card slides out from behind its left-hand neighbour; sparkles come last
      const rankOf = (m, p) => m.pieces.filter((q) => q.role === p.role).indexOf(p);
      const fansOf = (m) => m.pieces.filter((q) => q.role === 'fan');
      const when = (m, p) => {
        const r = rankOf(m, p);
        if (p.role !== 'spark') return { center: 0, left: 450 + r * 220, right: 450 + r * 220, box: 1150, fan: r * 240 }[p.role];
        return Math.max(0, ...m.pieces.filter((q) => q.role !== 'spark').map((q) => when(m, q))) + 300 + r * 90;
      };
      const choreo = (m, p, i) => {
        if (!p.role) return `--delay: ${i * 170}ms; `;
        const rank = rankOf(m, p);
        let v = `--delay: ${when(m, p)}ms; `;
        const c = m.pieces.find((q) => q.role === 'center');
        if (c) v += `--dx: ${(((c.x + c.w / 2) - (p.x + p.w / 2)) / p.w * 100).toFixed(1)}%; `;
        if (p.role === 'fan') {
          const a = fansOf(m)[rank - 1] || p;
          v += `--fx: ${(((a.x + a.w / 2) - (p.x + p.w / 2)) / p.w * 100).toFixed(1)}%; --fy: ${(((a.y + a.h / 2) - (p.y + p.h / 2)) / p.h * 100).toFixed(1)}%; --fr: ${a.rot - p.rot}deg; --fold: ${(fansOf(m).length - 1 - rank) * 150}ms; --z: ${fansOf(m).length - rank}; `;
        }
        if (p.role === 'spark') v += `--tw: ${(1.7 + rank * 0.45).toFixed(2)}s; `;
        return v;
      };
      // the outer side cards sit behind the inner ones, and both sit behind the centre card
      const pieceClass = (m, p) => {
        const outer = (p.role === 'left' || p.role === 'right') && m.pieces.filter((q) => q.role === p.role).indexOf(p) > 0;
        const pivot = p.role === 'fan' && fansOf(m)[0] === p;
        // sparkles: the four-point star turns, single dots pulse, the scattered dot field only flickers
        const glint = p.role === 'spark' ? (p.w > 50 ? ' ob__piece--field' : p.w > 8 ? ' ob__piece--star' : ' ob__piece--dot') : '';
        return `ob__piece${p.role ? ` ob__piece--${p.role}` : ''}${outer ? ' ob__piece--outer' : ''}${pivot ? ' ob__piece--pivot' : ''}${glint}`;
      };
      const screen = (k, alt) => { const m = ob[k]; return `<div class="ob" data-ob="${k}">
        <img class="ob__base" src="../assets/img/almedia/${k}-base.jpg" width="${m.w * 2}" height="${m.h * 2}" alt="${esc(alt)}" loading="lazy" decoding="async">
        ${m.pieces.map((p, i) => {
          const at = `${choreo(m, p, i)}left: ${pct(p.x, m.w)}; top: ${pct(p.y, m.h)}; width: ${pct(p.w, m.w)}`;
          if (!p.count) return `<img class="${pieceClass(m, p)}" src="../assets/img/almedia/${k}-p${i}.png" alt="" loading="lazy" decoding="async" style="${at}">`;
          // a plate with a live figure: the plate image without its number, the number as text that counts up
          const c = p.count;
          return `<div class="${pieceClass(m, p)} ob__plate" style="${at}"><img src="../assets/img/almedia/${p.plate}" alt="" loading="lazy" decoding="async"><span class="ob__count" style="left: ${c.x}%; top: ${c.y}%" data-count="${c.value}" data-prefix="${c.prefix}" data-suffix="${c.suffix}">${c.prefix}${c.value.toLocaleString('en-US')}${c.suffix}</span></div>`;
        }).join('')}
      </div>`; };
      return `<section class="ch-almedia" aria-labelledby="${id}"><div class="container">
  <div class="alm__head">
    <div class="ch-prose">
      <div class="alm__logo" data-lottie="../assets/img/almedia/freecash-logo.json" role="img" aria-label="Freecash"></div>
      <h2 id="${id}">Freecash at Almedia</h2>
      <p>Freecash moves people from playing to earning, so its motion has to feel like a reward. Claude Code turned my motion briefs into Lottie and Rive files the app could ship.</p>
    </div>
  </div>
  <div class="alm__grid">
    <figure class="alm__chest" data-kind="product" data-loop data-toggle="alm-toggle">
      <div class="alm__frame"><video src="../assets/video/freecash-chest.mp4" poster="../assets/video/freecash-chest-poster.jpg" width="540" height="920" muted loop playsinline preload="none" aria-label="Freecash onboarding: the treasure chest opens and coins float out"></video></div>
    </figure>
    <figure class="alm__screens" data-kind="product" data-onboarding data-toggle="alm-toggle">
      <div class="alm__four">
        ${screen('s4', 'Your cashback. Tracked and paid, automatically.')}
        ${screen('s2', 'Real brand. Real money back.')}
      </div>
    </figure>
    <div class="alm__ctl"><button class="btn btn--secondary btn--small" type="button" id="alm-toggle">Pause</button></div>
  </div>
</div></section>`;
    }
    case 'sound':
      return `<section class="ch-sound" aria-labelledby="${id}"><div class="container">
  <div class="ch-sound__head"><h2 id="${id}">The sounds, as shipped</h2><p class="lead">Ten effects from the game.</p></div>
  <ul class="board">${sounds.map(([f, t, d]) => `<li><button class="board__key" type="button" data-sound="../assets/sound/${f}.m4a" aria-pressed="false" aria-label="${t}: ${d}"><span class="board__name">${t}</span><span class="board__desc">${d}</span><svg class="board__play" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z"/></svg></button></li>`).join('')}</ul>
  <figure class="track"><figcaption>Soundtrack 01, the music under every level</figcaption><audio controls preload="none" src="../assets/sound/soundtrack-01.m4a"></audio></figure>
</div></section>`;
    default:
      throw new Error(`unknown block ${b.type}`);
  }
}

function page(c, i) {
  const next = chapters[(i + 1) % chapters.length];
  const nextLabel = i === chapters.length - 1 ? 'Back to the first chapter' : `Chapter ${i + 2}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}: Vadym Grin</title>
<meta name="description" content="${esc(c.lead)}">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@100,400;100,500;125,300${c.slug === 'research' ? '&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500' : ''}${c.slug === 'design-ops' ? '&family=Poppins:wght@600' : ''}${c.slug === 'motion' ? '&family=Poppins:wght@700' : ''}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css?v=${V}">
<script>document.documentElement.classList.add('js');</script>
</head>
<body class="is-chapter">
<a class="skip" href="#main">Skip to content</a>
<header class="mast">
  <div class="container">
    <a class="mark" href="../" aria-label="Vadym Grin, home">
      <svg viewBox="0 0 52 28" width="78" height="42" aria-hidden="true"><path fill="currentColor" d="${logo}"/></svg>
    </a>
  </div>
</header>

<main id="main">
  <section class="ch-hero" aria-labelledby="title">
    <div class="container ch-hero__grid">
      <div class="ch-hero__text">
        <h1 id="title" class="settle">${c.title}</h1>
        <p class="lead settle">${c.lead}</p>
        <dl class="band__meta">
          <div><dt>Chapter</dt><dd>${i + 1} of ${chapters.length}</dd></div>
          <div><dt>Work</dt><dd>${c.work}</dd></div>
          <div><dt>With</dt><dd>${c.with}</dd></div>
        </dl>
      </div>
      <figure class="ch-hero__castle">
        <canvas class="castle castle--still" data-part="${i}" aria-hidden="true"></canvas>
      </figure>
    </div>
  </section>

${c.blocks.map(block).join('\n\n')}

  <nav class="ch-next" aria-label="Chapters">
    <div class="container ch-next__grid">
      <a class="ch-next__link" href="${next.slug}.html"><span class="ch-next__label">${nextLabel}</span><span class="ch-next__title">${next.title}</span></a>
      <a class="btn btn--secondary" href="../#chapters">All chapters</a>
    </div>
  </nav>
</main>


<script type="module" src="../assets/site.js?v=${V}"></script>
</body>
</html>
`;
}

// Every build stamps a fresh version on the stylesheets and scripts, so no browser keeps an old copy.
const V = Date.now().toString(36);
const stampVersions = (file) => {
  const path = join(root, file);
  writeFileSync(path, readFileSync(path, 'utf8').replace(/\b(styles\.css|tokens\.css|base\.css|site\.js|castle\.js)(\?v=[a-z0-9]+)?/g, `$1?v=${V}`));
};
['index.html', 'styles.css', 'assets/site.js'].forEach(stampVersions);

mkdirSync(join(root, 'chapters'), { recursive: true });
chapters.forEach((c, i) => writeFileSync(join(root, 'chapters', `${c.slug}.html`), page(c, i)));
console.log(`built ${chapters.length} chapter pages`);
