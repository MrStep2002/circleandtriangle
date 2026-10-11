/* Games: Mini-List, Speed round, True or false, Survival, Odd one out, Type it, Type the sentence, Numbers.

   Each game has a picker (tick the groups, number ranges or sentence sections to use)
   and a play screen. Games are practice for fun: they count towards today's streak,
   but don't move words between stages. Best scores are kept in Store.state.games. */
(function () {
  const A = App;
  const { py, esc } = A;
  const W = () => Banks.words();
  const shuffle = Session.shuffle;
  const rand = l => l[Math.floor(Math.random() * l.length)];
  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const D = window.SENTENCES;

  const GAMES = [
    { id: "minilist", name: "Mini-List",         sub: "Study 3–10 words, then match them", pick: "groups" },
    { id: "speed",    name: "Speed round",       sub: "60 seconds. Tap the meaning",       pick: "groups" },
    { id: "blitz",    name: "True or false",     sub: "Yes or no, fast. Three lives",      pick: "groups" },
    { id: "survival", name: "Survival",          sub: "Three lives, less time every go",   pick: "groups" },
    { id: "odd",      name: "Odd one out",       sub: "Spot the word that doesn't belong", pick: "groups" },
    { id: "type",     name: "Type it",           sub: "See the pinyin, type the English",  pick: "groups" },
    { id: "typesent", name: "Type the sentence", sub: "Translate a whole sentence",        pick: "sections" },
    { id: "numbers",  name: "Numbers",           sub: "Read the pinyin, key in the number", pick: "ranges" },
    // "Say it": shown on the Vocab and Sentences pages rather than in the games grid.
    { id: "recallword", name: "Say it: words",     sub: "See the English, say it, then check", pick: "groups", hidden: true, home: "vocab" },
    { id: "recallsent", name: "Say it: sentences", sub: "See the English, say it, then check", pick: "sections", hidden: true, home: "sentences" }
  ];
  const RECALL = ["recallword", "recallsent"];
  const homeOf = (g, bank) => GAME[g] && GAME[g].home ? `/${bank}/${GAME[g].home}` : `/${bank}`;
  const GAME = Object.fromEntries(GAMES.map(g => [g.id, g]));
  const SPEED_SECONDS = 60;
  const LIVES = ["blitz", "survival"];                 // three lives, a clock on every question
  const SCORED = ["speed", "blitz", "survival"];       // a score and a best, rather than a %
  const NO_RETRY = ["speed", "blitz", "survival", "odd"];
  // Time per question gets shorter as the score goes up.
  const limitFor = (game, right) => game === "blitz" ? Math.max(1800, 4000 - right * 90) : Math.max(2500, 8000 - right * 250);

  // ---------------------------------------------------------------- saved picks and scores

  const key = g => Banks.current + ":" + g;
  function games() { return Store.state.games || (Store.state.games = {}); }
  function savedPicks(g) { return (Store.state.settings.gamePicks || {})[key(g)]; }
  function savePicks(g, ids) {
    Store.state.settings.gamePicks = Object.assign({}, Store.state.settings.gamePicks, { [key(g)]: ids });
    Store.save();
  }
  function bestLine(g) {
    const r = games()[key(g)];
    if (!r) return "";
    return SCORED.includes(g) ? `Best ${r.best}` : `Last time ${r.last}%`;
  }

  // ---------------------------------------------------------------- matching typed answers

  const SYN = { okay: "ok", maths: "math", favorite: "favourite", color: "colour", colors: "colours", gray: "grey", kuai: "yuan", rmb: "yuan", mom: "mum" };
  const NUMW = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
  const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

  function words(s) {
    const raw = s.toLowerCase().replace(/[’‘]/g, "'").replace(/(\d),(\d)/g, "$1$2")
      .replace(/['.]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
    const out = [];
    raw.split(" ").filter(Boolean).forEach(w => {
      w = SYN[w] || w;
      w = w.replace(/^(\d+)(st|nd|rd|th)$/, "$1");
      if (w in NUMW) w = String(NUMW[w]);
      if (w in TENS) w = String(TENS[w]);
      // "thirty seven" → "37"
      const prev = out[out.length - 1];
      if (/^[1-9]$/.test(w) && prev && /^[2-9]0$/.test(prev)) { out[out.length - 1] = String(+prev + +w); return; }
      out.push(w);
    });
    return out;
  }
  const norm = s => words(s).join(" ");

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const typoOk = (a, b) => a === b || (a.length >= 4 && lev(a, b) <= (a.length >= 8 ? 2 : 1));

  // "to be late" → "late", "a cup" → "cup"
  const strip = n => { let p; do { p = n; n = n.replace(/^(to|a|an|the|be) (?=\S)/, ""); } while (n !== p); return n; };

  // All the English answers a word accepts: "be at / in" → "be at", "in"; "to sit" → "sit" too.
  function answers(en) {
    const out = new Set();
    en.split(/\s*\/\s*/).forEach(part => {
      const plain = part.replace(/\([^)]*\)/g, " ");
      const joined = part.replace(/(\w)\((\w+)\)/g, "$1$2").replace(/[()]/g, " ");
      const inside = (part.match(/\(([^)]*)\)/) || [])[1];
      const before = inside ? inside + " " + plain : "";   // "rice (cooked)" → "cooked rice"
      [plain, joined, before].forEach(p => {
        const n = norm(p);
        if (!n) return;
        out.add(n);
        out.add(strip(n));
      });
    });
    out.delete("");
    return [...out];
  }

  // Words that make poor typing questions: grammar markers and counting words.
  const NO_TYPE = new Set(["build:ma", "build:ne", "build:de", "build:ge", "li:hao", "eo:wei"]);
  function typeable(w) {
    if (NO_TYPE.has(w.id)) return false;
    if ((D.MEASURES || []).includes(w.id) && w.id !== "money:kuai") return false;
    if (/marker|measure word|counter/.test(w.en)) return false;
    return answers(w.en).length > 0;
  }

  function checkWord(input, w) {
    const n = strip(norm(input));
    const list = answers(w.en);
    if (list.includes(n) || list.includes(norm(input))) return { ok: true };
    if (list.some(a => typoOk(a, n))) return { ok: true, typo: true };
    return { ok: false };
  }

  // Sentences: contractions expanded, little words ignored, one slip allowed in longer ones.
  const FILLER = new Set(["a", "an", "the", "please", "very", "really", "so", "just", "of"]);
  // Contractions typed without the apostrophe.
  const BARE = { im: "i am", its: "it is", youre: "you are", theyre: "they are", hes: "he is", shes: "she is", dont: "do not", doesnt: "does not",
    isnt: "is not", arent: "are not", cant: "can not", wont: "will not", didnt: "did not", whats: "what is", wheres: "where is", thats: "that is", theres: "there is", ive: "i have" };
  function sentWords(s) {
    const x = s.toLowerCase().replace(/[’‘]/g, "'")
      .replace(/\bi'm\b/g, "i am").replace(/\b(you|we|they)'re\b/g, "$1 are")
      .replace(/\b(he|she|it|that|what|where|there|who|how)'s\b/g, "$1 is")
      .replace(/\bcan'?t\b|\bcannot\b/g, "can not").replace(/\bwon'?t\b/g, "will not").replace(/\b(\w+)n't\b/g, "$1 not")
      .replace(/\b(i|you|we|they|he|she)'d\b/g, "$1 would").replace(/\b(i|you|we|they|he|she)'ll\b/g, "$1 will")
      .replace(/\b(i|you|we|they)'ve\b/g, "$1 have").replace(/\blet's\b/g, "let us");
    return words(x).flatMap(w => (BARE[w] || w).split(" ")).filter(w => !FILLER.has(w));
  }
  // "He's improved" could be he is or he has.
  // tā can be he or she, so either is fine.
  const PAIRS = [["is", "has"], ["he", "she"], ["his", "her"], ["him", "her"]];
  const same = (x, y) => typoOk(x, y) || PAIRS.some(([p, q]) => (x === p && y === q) || (x === q && y === p));
  function wordDist(a, b) {
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (same(b[j - 1], a[i - 1]) ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function checkSentence(input, en) {
    const a = sentWords(input), b = sentWords(en);
    if (!a.length) return { ok: false };
    const d = wordDist(a, b);
    if (d === 0) return { ok: true };
    // Same words in a slightly different order ("hand in your homework" / "hand your homework in"),
    // as long as it starts the same way, so a question can't pass as a statement.
    if (a.length >= 4 && a[0] === b[0] && a.slice().sort().join(" ") === b.slice().sort().join(" ")) return { ok: true, typo: true };
    if (d <= (b.length >= 6 ? 1 : 0)) return { ok: true, typo: true };
    return { ok: false };
  }

  // ---------------------------------------------------------------- numbers in pinyin

  const DIGIT_PY = ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"];
  const PLACES = [[10000, "wàn"], [1000, "qiān"], [100, "bǎi"], [10, "shí"], [1, ""]];
  function numberPy(n) {
    if (n === 0) return ["líng"];
    const out = [];
    let started = false, gap = false;
    PLACES.forEach(([p, name]) => {
      const d = Math.floor(n / p) % 10;
      if (!d) { if (started) gap = true; return; }
      if (gap) { out.push("líng"); gap = false; }
      let dw = DIGIT_PY[d];
      if (p === 10 && d === 1 && !started) dw = "";          // 10–19: shí, shíyī…
      else if (d === 2 && (p === 1000 || p === 10000)) dw = "liǎng";
      if (dw) out.push(dw);
      if (name) out.push(name);
      started = true;
    });
    // yī changes tone before bǎi / qiān (yì) and wàn (yí)
    return out.map((s, i) => s === "yī" && out[i + 1] === "wàn" ? "yí" : s === "yī" && (out[i + 1] === "bǎi" || out[i + 1] === "qiān") ? "yì" : s);
  }
  const RANGES = [
    { id: "r10",  name: "0 to 10",           eg: 7,     gen: () => randInt(0, 10) },
    { id: "r99",  name: "11 to 99",          eg: 58,    gen: () => randInt(11, 99) },
    { id: "r999", name: "100 to 999",        eg: 305,   gen: () => Math.random() < .4 ? randInt(1, 9) * 100 + randInt(0, 9) * 10 : randInt(100, 999) },
    { id: "r9k",  name: "1,000 to 9,999",    eg: 2500,  gen: () => Math.random() < .5 ? randInt(10, 99) * 100 : randInt(1000, 9999) },
    { id: "rwan", name: "10,000 to 99,999 (wàn)", eg: 35000, gen: () => Math.random() < .5 ? randInt(10, 99) * 1000 : randInt(10000, 99999) }
  ];
  const RANGE = Object.fromEntries(RANGES.map(r => [r.id, r]));
  const fmt = n => n.toLocaleString("en-GB");

  // ---------------------------------------------------------------- the picker

  function groupWordsFor(game, gid) {
    return W().filter(w => w.group === gid && (game !== "type" || typeable(w)));
  }
  function sentenceItems(secId) {
    return Sentences.sectionItems(secId).filter(it => it.kind !== "reply");
  }
  function options(game) {
    const g = GAME[game];
    if (g.pick === "ranges") return RANGES.map(r => ({ id: r.id, name: r.name, meta: Pinyin.plain(numberPy(r.eg).join(" ")) }));
    if (g.pick === "sections") return Sentences.SECTIONS.map(s => {
      const list = sentenceItems(s.id);
      const open = list.filter(it => Sentences.status(it).open).length;
      return { id: s.id, name: s.name, meta: `${open}/${list.length} unlocked`, n: open };
    });
    return Banks.groups().map(gr => {
      const ws = groupWordsFor(game, gr.id);
      const met = ws.filter(w => Memory.isIntro(w.id)).length;
      return { id: gr.id, name: gr.name, meta: game === "minilist" ? A.plural(ws.length, "word") : `${met}/${ws.length} met`, n: game === "minilist" ? ws.length : met, parent: gr.parent };
    }).filter(o => !(game === "type" && o.meta.endsWith("/0 met")));
  }

  function poolFor(game, ids) {
    const g = GAME[game];
    if (g.pick === "ranges") return ids.filter(id => RANGE[id]);
    if (g.pick === "sections") return ids.flatMap(sentenceItems).filter(it => Sentences.status(it).open);
    if (game === "minilist") return W().filter(w => ids.includes(w.group));
    if (game === "recallsent") return ids.flatMap(sentenceItems).filter(it => Sentences.status(it).open);   // new words welcome: you study them first
    return W().filter(w => ids.includes(w.group) && Memory.isIntro(w.id) && (game !== "type" || typeable(w)));
  }

  // Odd one out: three words from one group and one from another.
  // Groups that are a mixed bag (ordering phrases, question words…) don't make a fair "three".
  const MIXED = new Set(["eo-order", "li-ask", "ws-time", "ws-care"]);
  const metIn = gid => W().filter(w => w.group === gid && Memory.isIntro(w.id));
  const oddMains = ids => Banks.groups().filter(g => ids.includes(g.id) && !g.parent && !MIXED.has(g.id) && metIn(g.id).length >= 3);
  function oddRound(ids, avoid) {
    let mains = oddMains(ids);
    if (mains.length > 1 && avoid) mains = mains.filter(g => g.id !== avoid);
    const main = rand(mains);
    const others = Banks.groups().filter(g => g.id !== main.id && metIn(g.id).length);
    const picked = others.filter(g => ids.includes(g.id));
    const from = rand(picked.length ? picked : others);
    const three = shuffle(metIn(main.id)).slice(0, 3);
    const odd = rand(metIn(from.id).filter(w => !three.some(t => t.en === w.en)));
    return { main, from, w: odd, words: shuffle([...three, odd]) };
  }

  function startLabel(game, ids) {
    const pool = poolFor(game, ids);
    if (!ids.length) return [false, "Tick at least one"];
    if (game === "minilist") return pool.length >= 3 ? [true, `Start · study ${Math.min(miniSize(), pool.length)} words`] : [false, "Tick groups with at least 3 words"];
    if (LIVES.includes(game)) return pool.length >= 4 ? [true, `Start · ${pool.length} words, 3 lives`] : [false, "Meet at least 4 words in these groups"];
    if (game === "odd") {
      const n = oddMains(ids).length;
      const otherWords = W().filter(w => Memory.isIntro(w.id)).length;
      return n && otherWords > 3 ? [true, `Start · ${A.plural(n, "group")} to make sets from`] : [false, "Tick a group with at least 3 words met"];
    }
    if (game === "speed") return pool.length >= 4 ? [true, `Start · ${pool.length} words, ${SPEED_SECONDS} seconds`] : [false, "Meet at least 4 words in these groups"];
    if (game === "type") return pool.length ? [true, `Start · ${A.plural(pool.length, "word")}`] : [false, "No words met in these groups yet"];
    if (game === "recallword") return pool.length ? [true, `Start · ${A.plural(pool.length, "word")}`] : [false, "No words met in these groups yet"];
    if (game === "recallsent") return pool.length ? [true, `Start · ${A.plural(pool.length, "sentence pattern")}`] : [false, "No sentences unlocked here yet"];
    if (game === "typesent") return pool.length ? [true, `Start · ${A.plural(pool.length, "sentence pattern")}`] : [false, "No sentences unlocked here yet"];
    return [true, "Start"];
  }

  const INTRO = {
    recallword: "You see the English. Say the Chinese in your head (or out loud), then tap to check the pinyin and mark yourself. Counts towards your progress.",
    recallsent: "You see an English sentence. Say it in Chinese, then tap to check the pinyin and mark yourself. Counts towards your progress.",
    minilist: "Pick where the words come from and how many. Study them, then match them up. New words are fine: you see them first.",
    speed: "As many as you can in 60 seconds. Uses words you've met.",
    blitz: "A word and a meaning flash up: is it right? Swipe right for yes, left for no. Three wrong (or too slow) and it's over.",
    survival: "Tap the meaning before the clock runs out. Every right answer gives you a little less time. Three lives.",
    odd: "Four words: three belong together, one doesn't. Tick the groups to make the sets from.",
    type: "Type the English for each word. Small typos are fine. Words that don't translate neatly, like counting words, are left out.",
    numbers: "A number in pinyin: type it in digits.",
    typesent: "Type the sentence in English. Contractions, little words and one slip are allowed."
  };

  function picker(rest) {
    const game = GAME[rest];
    if (!game) return null;
    const opts = options(game.id);
    let saved = savedPicks(game.id);
    // Surreal Sentences start unticked: they're an extra, not part of the standard mix.
    if (!saved) saved = game.pick === "ranges" ? ["r10", "r99"] : opts.filter(o => o.n && o.id !== "surreal").map(o => o.id);
    const row = o => `<label class="check">
        <input type="checkbox" name="g" value="${o.id}" ${saved.includes(o.id) ? "checked" : ""}>
        <span class="check-name">${esc(o.name)}</span>
        <span class="check-meta">${esc(o.meta)}</span>
      </label>`;
    let rows = opts.filter(o => !o.parent).map(row).join("");
    [...new Set(opts.filter(o => o.parent).map(o => o.parent))].forEach(p => {
      rows += `<h3 class="section-label small">${esc(p)}</h3>` + opts.filter(o => o.parent === p).map(row).join("");
    });
    return {
      title: game.name, back: homeOf(game.id, Banks.current), cls: "has-dock",
      body: `
        <p class="muted intro-line">${INTRO[game.id]}</p>
        <div class="quickpick"><button class="chip" data-act="gpick-all">Select all</button><button class="chip" data-act="gpick-none">Clear</button></div>
        ${game.id === "minilist" ? `<div class="sizepick"><span class="check-name">How many words?</span>
          <div class="sizechips" role="radiogroup">${[3, 4, 5, 6, 7, 8, 9, 10].map(n => `<button class="chip ${n === miniSize() ? "on" : ""}" role="radio" aria-checked="${n === miniSize()}" data-act="gsize" data-n="${n}">${n}</button>`).join("")}</div></div>
          <h3 class="section-label small">Words from</h3>` : ""}
        <form id="game-form" class="checks">${rows}</form>
        <div class="dock"><button class="btn primary wide" id="game-go" data-act="gstart" data-game="${game.id}" disabled>Start</button></div>`,
      after() {
        const form = document.getElementById("game-form");
        const go = document.getElementById("game-go");
        const update = () => {
          const ids = [...form.querySelectorAll("input:checked")].map(i => i.value);
          const [ok, label] = startLabel(game.id, ids);
          go.disabled = !ok;
          go.textContent = label;
        };
        form.addEventListener("change", update);
        update();
      }
    };
  }

  function pickAll(on) {
    document.querySelectorAll("#game-form input").forEach(i => { i.checked = on; });
    document.getElementById("game-form").dispatchEvent(new Event("change"));
  }

  // ---------------------------------------------------------------- running a game

  let run = null;

  // ---------------------------------------------------------------- Daily 5 minutes
  // A mix of the games, using words you've met in every topic, weaker words more often.
  // Rounds of a few questions each, cycling until five minutes are up.
  const DAILY_SECONDS = 5 * 60;
  const DAILY_ROUNDS = [["speed", 6], ["blitz", 6], ["type", 4], ["odd", 3], ["numbers", 3], ["speed", 5], ["type", 4]];
  const ROUND_NAME = { speed: "Pick the meaning", blitz: "True or false", type: "Type it", odd: "Odd one out", numbers: "Numbers" };
  const metAll = () => Banks.ALL.filter(w => Memory.isIntro(w.id));
  const dailyReady = () => metAll().length >= 8;

  // Weaker words come up more: pick from the weakest half most of the time.
  function dailyWord(filter) {
    const pool = metAll().filter(filter || (() => true));
    if (!pool.length) return null;
    const sorted = pool.slice().sort((a, b) => Memory.strength(a.id) - Memory.strength(b.id));
    const weak = sorted.slice(0, Math.max(4, Math.ceil(sorted.length / 2)));
    let w;
    for (let k = 0; k < 6; k++) { w = rand(Math.random() < .7 ? weak : sorted); if (!run.cur || !run.cur.w || run.cur.w.id !== w.id) break; }
    Banks.set(w.bank);   // answer choices come from the word's own topic
    return w;
  }
  function dailyRanges() {
    const r = ["r10", "r99"];
    if (Memory.isIntro("li:bai100")) r.push("r999");
    if (Memory.isIntro("li:qian")) r.push("r9k");
    if (Memory.isIntro("li:wan")) r.push("rwan");
    return r;
  }
  function dailyOddBank() {
    const banks = Banks.list.filter(b => Banks.unlocked(b.id)).filter(b => { Banks.set(b.id); return oddMains(b.groups.map(g => g.id)).length; });
    return banks.length ? rand(banks) : null;
  }

  function startDaily() {
    run = { daily: true, game: null, bank: "daily", ids: [], pool: [], right: 0, total: 0, missed: [], queue: [], cur: null,
      answered: false, lives: 3, order: [], endAt: Date.now() + DAILY_SECONDS * 1000, round: -1, left: 0 };
    nextItem();
    A.go("/daily");
  }

  // The next daily question: carry on with this round, or move to the next game in the cycle.
  function nextDaily() {
    for (let tries = 0; tries < DAILY_ROUNDS.length * 2; tries++) {
      if (run.left <= 0) {
        run.round = (run.round + 1) % DAILY_ROUNDS.length;
        [run.game, run.left] = DAILY_ROUNDS[run.round];
        run.newRound = true;
      }
      const g = run.game;
      if (g === "speed" || g === "blitz") {
        const w = dailyWord();
        if (g === "speed") run.cur = { w, opts: Session.choices(w, "meaning") };
        else {
          const truth = Math.random() < .5;
          const wrong = Session.choices(w, "meaning").filter(o => o.id !== w.id && o.en !== w.en)[0];
          run.cur = { w, truth: truth || !wrong, shown: truth || !wrong ? w : wrong };
        }
      } else if (g === "type") {
        const w = dailyWord(typeable);
        if (!w) { run.left = 0; continue; }
        run.cur = { w };
      } else if (g === "odd") {
        const b = dailyOddBank();
        if (!b) { run.left = 0; continue; }
        Banks.set(b.id);
        run.cur = oddRound(b.groups.map(x => x.id), run.cur && run.cur.main && run.cur.main.id);
      } else {
        const ranges = dailyRanges();
        let n;
        do { n = RANGE[rand(ranges)].gen(); } while (run.cur && n === run.cur.n);
        run.cur = { n, py: numberPy(n) };
      }
      run.left--;
      return;
    }
  }

  function dailyBar() {
    const left = Math.max(0, run.endAt - Date.now());
    const pct = run.total ? Math.round(run.right / run.total * 100) : 0;
    return `<header class="sessionbar">
      <button class="iconbtn" data-act="gquit" aria-label="Stop">${A.ICON.close}</button>
      <div class="scoremeter timer daily" aria-hidden="true"><span id="daily-fill" style="width:${left / (DAILY_SECONDS * 10)}%"></span></div>
      <span class="score" id="score-text">${run.total ? `<b>${pct}%</b><small>${run.right}/${run.total}</small>` : `<b>${clockText(left)}</b><small>to go</small>`}</span>
    </header>`;
  }
  const clockText = ms => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

  let dailyTimer = null;
  function startDailyTimer() {
    clearInterval(dailyTimer);
    dailyTimer = setInterval(() => {
      if (!run || !run.daily || A.currentRoute() !== "/daily") { clearInterval(dailyTimer); return; }
      const left = Math.max(0, run.endAt - Date.now());
      const fill = document.getElementById("daily-fill");
      if (fill) fill.style.width = (left / (DAILY_SECONDS * 10)) + "%";
      const t = document.getElementById("daily-time");
      if (t) t.textContent = left ? clockText(left) + " left" : "Last one!";
    }, 500);
  }

  // After an answer: next question, or the end once time is up.
  function advance() {
    if (run.daily && Date.now() >= run.endAt) { finish(); return; }
    nextItem();
    A.render();
  }

  function dailyView() {
    if (!run || !run.daily) return null;
    return playView(true);
  }

  // ---------------------------------------------------------------- Mini-List

  const miniSize = () => Store.state.settings.miniSize || 6;
  let mini = null;

  function setSize(el) {
    Store.state.settings.miniSize = +el.dataset.n;
    Store.save();
    document.querySelectorAll(".sizechips .chip").forEach(c => { const on = c === el; c.classList.toggle("on", on); c.setAttribute("aria-checked", on); });
    document.getElementById("game-form").dispatchEvent(new Event("change"));
  }

  // A fresh set of words that can share a board (no look-alikes together).
  function dealMini(ids, bank, previous) {
    let pool = poolFor("minilist", ids);
    // Avoid the words you've just had, as long as there are enough others.
    if (previous) {
      const others = pool.filter(w => !previous.includes(w.id));
      if (others.length >= miniSize()) pool = others;
    }
    const unmet = shuffle(pool.filter(w => !Memory.isIntro(w.id)));
    const met = shuffle(pool.filter(w => Memory.isIntro(w.id)));
    // A mix: some new words if there are any, the rest from ones you've met.
    const mixed = shuffle(unmet.slice(0, Math.ceil(miniSize() / 2)).concat(met)).concat(unmet.slice(Math.ceil(miniSize() / 2)));
    mini = { bank, ids, words: Session.matchSet(mixed, miniSize()).map(w => w.id) };
  }

  function miniView() {
    if (!mini || mini.bank !== Banks.current) return null;
    const BY = Memory.BY_ID;
    return {
      title: "Mini-List", back: `/${Banks.current}/game/minilist`, cls: "has-dock",
      body: `
        <p class="muted intro-line">Take your time with these ${mini.words.length}. When you're ready, match them up.</p>
        <ul class="bank minilist">${mini.words.map(id => {
          const w = W().find(x => x.id === id) || BY[id];
          return `<li>
            <span class="bank-py">${A.wordLine(w)}<span class="say">${esc(w.say)}</span></span>
            <span class="bank-en">${esc(w.en)}${w.note ? `<small>${esc(w.note)}</small>` : ""}</span>
          </li>`;
        }).join("")}</ul>
        <div class="dock"><div class="row2">
          <button class="btn primary" data-act="gmini-go">I'm ready: match them</button>
          <button class="btn" data-act="gmini-new">New words</button>
        </div></div>`
    };
  }

  function miniMatch() {
    if (!mini) return;
    const bank = mini.bank;
    Match.start("list", null, "Mini-List · " + Banks.bank().name, {
      ids: mini.words, back: `/${bank}/mini`,
      buttons: `<button class="btn primary wide" data-act="gmini-new">New Mini-List</button>
        <button class="btn wide" data-act="go-replace" data-to="/${bank}/mini">Study these again</button>
        <button class="btn wide" data-act="go-replace" data-to="/${bank}">Back to ${esc(Banks.bank().name)}</button>`
    });
  }

  function start(gameId) {
    const ids = [...document.querySelectorAll("#game-form input:checked")].map(i => i.value);
    savePicks(gameId, ids);
    if (gameId === "minilist") {
      dealMini(ids, Banks.current);
      A.go(`/${Banks.current}/mini`);
      return;
    }
    initRun(gameId, ids, Banks.current);
    A.go(`/${Banks.current}/game-play`);
  }

  function initRun(game, ids, bank) {
    const pool = poolFor(game, ids);
    run = { game, bank, ids, pool, right: 0, total: 0, missed: [], queue: [], cur: null, answered: false, lives: 3, order: shuffle(pool.slice()) };
    if (game === "speed") run.endAt = Date.now() + SPEED_SECONDS * 1000;
    nextItem();
  }

  // Next word from a shuffled deck, never the same one twice in a row.
  function deal() {
    if (!run.order.length) run.order = shuffle(run.pool.slice());
    let w = run.order.pop();
    if (run.cur && run.cur.w && w.id === run.cur.w.id && run.order.length) { run.order.unshift(w); w = run.order.pop(); }
    return w;
  }

  // The next question. Missed ones come back three questions later.
  function nextItem() {
    run.answered = false;
    run.result = null;
    if (run.daily) { nextDaily(); return; }
    const due = run.queue.findIndex(q => q.at <= run.total);
    if (due >= 0 && !NO_RETRY.includes(run.game)) { run.cur = Object.assign(run.queue.splice(due, 1)[0].item, { retry: true }); return; }
    run.qStart = Date.now();
    run.qLimit = limitFor(run.game, run.right);
    if (run.game === "speed" || run.game === "survival") {
      const w = deal();
      run.cur = { w, opts: Session.choices(w, "meaning") };
    } else if (run.game === "blitz") {
      const w = deal();
      const truth = Math.random() < .5;
      const wrong = Session.choices(w, "meaning").filter(o => o.id !== w.id && o.en !== w.en)[0];
      run.cur = { w, truth: truth || !wrong, shown: truth || !wrong ? w : wrong };
    } else if (run.game === "odd") {
      run.cur = oddRound(run.ids, run.cur && run.cur.main && run.cur.main.id);
    } else if (run.game === "type" || run.game === "recallword") {
      run.cur = { w: deal() };
    } else if (run.game === "numbers") {
      let n;
      do { n = RANGE[rand(run.pool)].gen(); } while (run.cur && n === run.cur.n);
      run.cur = { n, py: numberPy(n) };
    } else {
      let it;
      do { it = rand(run.pool); } while (run.pool.length > 1 && run.cur && run.cur.it && it === run.cur.it);
      run.cur = { it, inst: Sentences.instance(it) };
    }
  }

  function record(ok) {
    Memory.countToday();
    Store.save();
    if (run.cur.retry) return;
    run.total++;
    if (ok) run.right++;
    if (run.daily) {
      const el = document.getElementById("score-text");
      if (el) el.innerHTML = `<b>${Math.round(run.right / run.total * 100)}%</b><small>${run.right}/${run.total}</small>`;
    }
    else {
      run.missed.push(run.cur);
      if (!NO_RETRY.includes(run.game) && !run.daily) run.queue.push({ at: run.total + 3, item: Object.assign({}, run.cur, { retry: false }) });
    }
  }

  // ---------------------------------------------------------------- play screens

  function speedBar() {
    const left = Math.max(0, run.endAt - Date.now());
    return `<header class="sessionbar">
      <button class="iconbtn" data-act="gquit" aria-label="Stop">${A.ICON.close}</button>
      <div class="scoremeter timer" aria-hidden="true"><span id="time-fill" style="width:${left / (SPEED_SECONDS * 10)}%"></span></div>
      <span class="score"><b id="speed-score">${run.right}</b><small id="time-left">${Math.ceil(left / 1000)}s</small></span>
    </header>`;
  }

  const hearts = () => [0, 1, 2].map(i => `<i class="heart ${i < run.lives ? "" : "lost"}">♥</i>`).join("");
  function livesBar() {
    return `<header class="sessionbar">
      <button class="iconbtn" data-act="gquit" aria-label="Stop">${A.ICON.close}</button>
      <div class="scoremeter timer clock" aria-hidden="true"><span id="time-fill" style="width:100%"></span></div>
      <span class="score"><b id="speed-score">${run.right}</b><small class="hearts" id="hearts">${hearts()}</small></span>
    </header>`;
  }

  function playView(isDaily) {
    if (!run || (run.daily ? !isDaily : run.bank !== Banks.current)) return null;
    const c = run.cur;
    let body = "";
    if (run.game === "speed") {
      body = `
        ${speedBar()}
        <div class="wordcard"><div class="big-py">${py(c.w.py)}</div><div class="say">sounds like “${esc(c.w.say)}”</div></div>
        <div class="options">${c.opts.map((o, n) => `<button class="opt" data-act="gspeed" data-id="${o.id}"><kbd>${n + 1}</kbd>${esc(o.en)}</button>`).join("")}</div>`;
    } else if (run.game === "survival") {
      body = `
        ${livesBar()}
        <div class="wordcard"><div class="big-py">${py(c.w.py)}</div><div class="say">sounds like “${esc(c.w.say)}”</div></div>
        <div class="options">${c.opts.map((o, n) => `<button class="opt" data-act="gspeed" data-id="${o.id}"><kbd>${n + 1}</kbd>${esc(o.en)}</button>`).join("")}</div>`;
    } else if (run.game === "blitz") {
      body = `
        ${livesBar()}
        <p class="ask">Does it mean this?</p>
        <div class="wordcard blitzcard" id="blitz">
          <div class="big-py">${py(c.w.py)}</div>
          <div class="say">sounds like “${esc(c.w.say)}”</div>
          <div class="blitz-en">${esc(c.shown.en)}</div>
          <div class="blitz-real" id="blitz-real" hidden></div>
        </div>
        <div class="blitz-btns">
          <button class="btn bno" data-act="gblitz" data-v="0" aria-label="No">✗<span>No</span></button>
          <button class="btn byes" data-act="gblitz" data-v="1" aria-label="Yes">✓<span>Yes</span></button>
        </div>
        <p class="swipe-hint">Swipe right for yes, left for no</p>`;
    } else if (RECALL.includes(run.game)) {
      const V = window.SentenceView;
      const isWord = run.game === "recallword";
      const en = isWord ? c.w.en : c.inst.en;
      const answer = isWord
        ? `<div class="big-py">${py(c.w.py)}</div><div class="say">sounds like “${esc(c.w.say)}”</div>${A.noteHtml(c.w)}`
        : `<div class="sline">${V.sentenceHtml(c.inst.tokens, c.inst.py, c.inst.end)}</div><div class="ssay">${esc(V.saysLine(c.inst.tokens))}</div>${V.interlinear(c.inst.tokens, c.inst.py)}`;
      body = `
        ${A.scoreBar("gquit", run.right, run.total)}
        <p class="ask">Say it in Chinese</p>
        <div class="wordcard recallcard">
          <div class="${isWord ? "big-en" : "recall-en"}">${esc(en)}</div>
          <div class="reveal" id="reveal" hidden>${answer}</div>
        </div>
        <div class="actions" id="show-row"><button class="btn primary wide" data-act="greveal">Show the pinyin</button></div>
        <div class="row2 even" id="mark-row" hidden>
          <button class="btn" data-act="gmark" data-ok="0">Not quite</button>
          <button class="btn primary" data-act="gmark" data-ok="1">Got it</button>
        </div>`;
    } else if (run.game === "odd") {
      body = `
        ${A.scoreBar("gquit", run.right, run.total)}
        <p class="ask">Which one doesn't belong?</p>
        <div class="oddgrid">${c.words.map((w, n) => `<button class="opt opt-py oddopt" data-act="godd" data-id="${w.id}"><kbd>${n + 1}</kbd>
          <span class="py">${py(w.py)}</span><span class="say">${esc(w.say)}</span><span class="odd-en" hidden>${esc(w.en)}</span></button>`).join("")}</div>
        <div class="feedback gfb" id="feedback" hidden></div>`;
    } else {
      let prompt = "", ask = "", mode = "text", ph = "Type in English";
      if (run.game === "type") {
        ask = "What does it mean?";
        prompt = `<div class="wordcard"><div class="big-py">${py(c.w.py)}</div><div class="say">sounds like “${esc(c.w.say)}”</div></div>`;
      } else if (run.game === "numbers") {
        ask = "Type the number";
        mode = "numeric"; ph = "Number";
        prompt = `<div class="wordcard"><div class="num-py">${Pinyin.html(c.py.join(" "))}</div></div>`;
      } else {
        ask = "Type it in English";
        const V = window.SentenceView;
        prompt = `<div class="sentcard"><div class="sline">${V.sentenceHtml(c.inst.tokens, c.inst.py, c.inst.end)}</div>
          <div class="ssay">${esc(V.saysLine(c.inst.tokens))}</div></div>`;
      }
      body = `
        ${A.scoreBar("gquit", run.right, run.total)}
        <p class="ask">${ask}</p>
        ${prompt}
        <form class="typeform" id="type-form" autocomplete="off">
          <input class="typein" id="type-in" ${mode === "numeric" ? 'inputmode="numeric" pattern="[0-9 ,]*"' : 'inputmode="text"'}
            autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="${ph}" aria-label="${ph}">
          <button class="btn primary" id="type-go" type="submit">Check</button>
        </form>
        <div class="feedback" id="feedback" hidden></div>`;
    }
    if (run.daily) {
      const label = `<p class="daily-round"><span>${ROUND_NAME[run.game]}</span><span id="daily-time">${clockText(Math.max(0, run.endAt - Date.now()))} left</span></p>`;
      body = body.replace(/<header class="sessionbar">[\s\S]*?<\/header>/, dailyBar() + label);
    }
    return {
      bar: "session", cls: "play game-" + run.game + (run.daily ? " daily-play" : ""), body,
      after() {
        if (run.daily) {
          startDailyTimer();
          if (run.game === "blitz") swipe();
          if (run.game === "speed" || run.game === "blitz" || run.game === "odd") return;
        } else if (run.game === "speed" || LIVES.includes(run.game)) { startTimer(); if (run.game === "blitz") swipe(); return; }
        if (run.game === "odd" || RECALL.includes(run.game)) return;
        const input = document.getElementById("type-in");
        document.getElementById("type-form").addEventListener("submit", e => {
          e.preventDefault();
          if (run.answered) { next(); return; }
          if (!input.value.trim()) { input.focus(); return; }
          check(input.value);
        });
        input.focus();
      }
    };
  }

  // ---------------------------------------------------------------- speed round

  let timer = null;
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!run || run.daily || !(run.game === "speed" || LIVES.includes(run.game)) || !A.currentRoute().endsWith("/game-play")) { clearInterval(timer); return; }
      const fill = document.getElementById("time-fill");
      if (run.game === "speed") {
        const left = Math.max(0, run.endAt - Date.now());
        const t = document.getElementById("time-left");
        if (fill) fill.style.width = (left / (SPEED_SECONDS * 10)) + "%";
        if (t) t.textContent = Math.ceil(left / 1000) + "s";
        if (!left) { clearInterval(timer); finish(); }
        return;
      }
      if (run.answered) return;
      const left = Math.max(0, run.qLimit - (Date.now() - run.qStart));
      if (fill) { fill.style.width = (left / run.qLimit * 100) + "%"; fill.classList.toggle("low", left < 1200); }
      if (!left) tooSlow();
    }, 100);
  }

  // Lives games: lose a life, and stop when they're all gone.
  function afterLife(ok) {
    if (!ok && !run.daily) {
      run.lives--;
      const h = document.getElementById("hearts");
      if (h) h.innerHTML = hearts();
      A.vibrate(80);
    }
    const s = document.getElementById("speed-score");
    if (s) s.textContent = run.right;
    setTimeout(() => {
      if (!run || !(A.currentRoute().endsWith("/game-play") || A.currentRoute() === "/daily")) return;
      if (run.lives <= 0 && !run.daily) { finish(); return; }
      advance();
    }, ok ? 260 : 1100);
  }

  function tooSlow() {
    run.answered = true;
    record(false);
    if (run.game === "survival") {
      document.querySelectorAll(".opt").forEach(b => { b.disabled = true; if (b.dataset.id === run.cur.w.id) b.classList.add("right"); });
    } else {
      const card = document.getElementById("blitz");
      if (card) card.classList.add("bad");
      showReal("Too slow!");
    }
    afterLife(false);
  }

  // ---------------------------------------------------------------- true or false

  function showReal(head) {
    const r = document.getElementById("blitz-real");
    if (!r) return;
    r.hidden = false;
    r.innerHTML = `<b>${esc(head)}</b> ${run.cur.truth ? "It does mean that." : `It means <b>${esc(run.cur.w.en)}</b>.`}`;
  }

  function blitzAnswer(yes) {
    if (!run || run.answered) return;
    run.answered = true;
    const ok = yes === run.cur.truth;
    record(ok);
    const card = document.getElementById("blitz");
    if (card) {
      card.classList.add(ok ? "ok" : "bad");
      card.style.transform = ok ? `translateX(${yes ? 130 : -130}%) rotate(${yes ? 12 : -12}deg)` : "";
    }
    document.querySelectorAll(".blitz-btns .btn").forEach(b => { b.disabled = true; });
    if (!ok) showReal("No!");
    afterLife(ok);
  }

  // Swipe the card left or right.
  function swipe() {
    const card = document.getElementById("blitz");
    if (!card) return;
    let x0 = null, dx = 0;
    card.addEventListener("pointerdown", e => { if (run.answered) return; x0 = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); card.style.transition = "none"; });
    card.addEventListener("pointermove", e => {
      if (x0 === null) return;
      dx = e.clientX - x0;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
      card.classList.toggle("lean-yes", dx > 40);
      card.classList.toggle("lean-no", dx < -40);
    });
    const end = () => {
      if (x0 === null) return;
      x0 = null;
      card.style.transition = "";
      card.classList.remove("lean-yes", "lean-no");
      if (dx > 70) blitzAnswer(true);
      else if (dx < -70) blitzAnswer(false);
      else card.style.transform = "";
    };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  // ---------------------------------------------------------------- say it (recall)

  function reveal() {
    if (!run || run.revealed || !RECALL.includes(run.game)) return;
    run.revealed = true;
    document.getElementById("reveal").hidden = false;
    document.getElementById("show-row").hidden = true;
    document.getElementById("mark-row").hidden = false;
  }
  function markRecall(ok) {
    if (!run || !run.revealed || run.answered) return;
    run.answered = true;
    // Your own verdict counts as a real answer: recall for words, the pattern for sentences.
    if (!run.cur.retry) {
      if (run.game === "recallword") Memory.answer(run.cur.w.id, "c", ok);
      else Sentences.answer(run.cur.it.id, ok);
    }
    record(ok);
    run.revealed = false;
    advance();
  }

  // ---------------------------------------------------------------- odd one out

  function oddPick(btn) {
    if (!run || run.answered) return;
    run.answered = true;
    const c = run.cur, ok = btn.dataset.id === c.w.id;
    record(ok);
    A.updateScore(run.right, run.total);
    document.querySelectorAll(".oddopt").forEach(b => {
      b.disabled = true;
      b.querySelector(".odd-en").hidden = false;
      if (b.dataset.id === c.w.id) b.classList.add("right");
    });
    if (!ok) { btn.classList.add("wrong"); A.vibrate(60); }
    const fb = document.getElementById("feedback");
    fb.hidden = false;
    fb.className = "feedback gfb " + (ok ? "ok" : "bad");
    fb.innerHTML = `<div class="gfb-text"><b>${ok ? "Right!" : "Not quite."}</b> Three are <b>${esc(c.main.name)}</b>. <b>${esc(Pinyin.plain(c.w.py))}</b> (${esc(c.w.en)}) is from ${esc(c.from.name)}.</div>
      <div class="gfb-btns"><button class="btn primary" type="button" data-act="gnext">Next</button></div>`;
  }

  function speedPick(btn) {
    if (!run || run.answered || (run.game === "speed" && !run.daily && Date.now() > run.endAt)) return;
    run.answered = true;
    const ok = btn.dataset.id === run.cur.w.id;
    document.querySelectorAll(".opt").forEach(b => {
      b.disabled = true;
      if (b.dataset.id === run.cur.w.id) b.classList.add("right");
    });
    if (!ok) btn.classList.add("wrong");
    record(ok);
    if (run.game === "survival" || run.daily) { afterLife(ok); return; }
    if (!ok) A.vibrate(60);
    const s = document.getElementById("speed-score");
    if (s) s.textContent = run.right;
    setTimeout(() => {
      if (!run || !A.currentRoute().endsWith("/game-play")) return;
      if (Date.now() >= run.endAt) { finish(); return; }
      nextItem();
      A.render();
    }, ok ? 220 : 900);
  }

  // ---------------------------------------------------------------- typing games

  function check(value) {
    const c = run.cur;
    let res, answer, extra = "";
    if (run.game === "type") {
      res = checkWord(value, c.w);
      answer = `<b>${esc(c.w.en)}</b>`;
      extra = A.noteHtml(c.w);
    } else if (run.game === "numbers") {
      const typed = value.replace(/[^0-9]/g, "");
      res = { ok: typed !== "" && +typed === c.n };
      answer = `<b>${fmt(c.n)}</b>`;
    } else {
      res = checkSentence(value, c.inst.en);
      answer = `<b>${esc(c.inst.en)}</b>`;
      extra = window.SentenceView.interlinear(c.inst.tokens, c.inst.py);
    }
    run.answered = true;
    run.result = res;
    record(res.ok);
    A.updateScore(run.right, run.total);
    const input = document.getElementById("type-in");
    input.readOnly = true;
    input.classList.add(res.ok ? "ok" : "bad");
    document.getElementById("type-go").textContent = "Next";
    const fb = document.getElementById("feedback");
    fb.hidden = false;
    fb.className = "feedback gfb " + (res.ok ? "ok" : "bad");
    const head = res.ok ? (res.typo ? "Right! Close enough:" : "Right!") : "Not quite.";
    fb.innerHTML = `<div class="gfb-text"><b>${head}</b> ${res.ok && !res.typo && run.game === "numbers" ? "" : answer}</div>
      ${extra}
      <div class="gfb-btns">
        ${!res.ok && !c.retry && run.game !== "numbers" ? `<button class="btn" type="button" data-act="gmine">I was right</button>` : ""}
        <button class="btn primary" type="button" data-act="gnext">Next</button>
      </div>`;
    if (!res.ok) A.vibrate(60);
  }

  // A typed answer that was right but not in the list (a synonym, say) can be counted.
  function overrule(btn) {
    if (!run.result || run.result.ok) return;
    run.result.ok = true;
    run.right++;
    run.missed.pop();
    run.queue.pop();
    A.updateScore(run.right, run.total);
    btn.remove();
    const head = document.querySelector("#feedback .gfb-text b");
    if (head) head.textContent = "Counted as right.";
    document.getElementById("feedback").className = "feedback gfb ok";
  }

  function next() { advance(); }

  // ---------------------------------------------------------------- the end

  // The words (or numbers, or sentences) you missed, once each.
  function missedRows() {
    const seen = new Set();
    return run.missed.filter(m => {
      const k = m.w ? m.w.id : m.n !== undefined ? "n" + m.n : m.inst.en;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).map(m => {
      if (m.w) return `<li><span class="bank-py">${A.wordLine(m.w)}<span class="say">${esc(m.w.say)}</span></span><span class="bank-en">${esc(m.w.en)}</span><span></span></li>`;
      if (m.n !== undefined) return `<li><span class="bank-py"><span class="py">${Pinyin.html(m.py.join(" "))}</span></span><span class="bank-en">${fmt(m.n)}</span><span></span></li>`;
      return `<li class="wide"><span class="bank-py"><span class="py">${esc(m.inst.py.filter(p => p !== ",").join(" "))}</span></span><span class="bank-en">${esc(m.inst.en)}</span><span></span></li>`;
    }).join("");
  }

  function finishDaily() {
    const pct = run.total ? Math.round(run.right / run.total * 100) : 0;
    const rec = games()["all:daily"] || { plays: 0, days: {} };
    rec.plays++;
    rec.last = pct;
    rec.days = rec.days || {};
    rec.days[Memory.today()] = Math.max(rec.days[Memory.today()] || 0, pct);
    games()["all:daily"] = rec;
    Store.save();
    const finished = Date.now() >= run.endAt;
    A.result = {
      eyebrow: "Daily practice",
      right: run.right, total: run.total,
      line: `${run.right} of ${run.total} right${finished ? " in 5 minutes" : ""}${finished ? " · done for today!" : ""}`,
      label: "To look at again", rows: missedRows(),
      back: "/",
      buttons: `<button class="btn primary wide" data-act="go-replace" data-to="/">Home</button>
        <button class="btn wide" data-act="gdaily">Another 5 minutes</button>`
    };
    run = null;
    Banks.set("essentials");
    A.replace("/done");
  }

  // The big button on the home screen.
  function dailyButton() {
    const rec = games()["all:daily"];
    const today = rec && rec.days && rec.days[Memory.today()];
    if (!dailyReady()) return `<button class="dailybtn off" disabled><span class="daily-name">Daily practice</span><span class="daily-sub">Meet a few words first, then 5 minutes a day of games</span></button>`;
    return `<button class="dailybtn ${today !== undefined ? "done" : ""}" data-act="gdaily">
      <span class="daily-name">${today !== undefined ? "Daily practice ✓" : "Daily practice"}</span>
      <span class="daily-sub">${today !== undefined ? `Done today · ${today}%. Tap for another 5 minutes` : `5 minutes of games with ${A.plural(metAll().length, "word")} you know`}</span>
    </button>`;
  }

  function finish() {
    clearInterval(timer);
    clearInterval(dailyTimer);
    if (!run) return;
    if (run.daily) return finishDaily();
    const g = GAME[run.game];
    const rec = games()[key(run.game)] || { best: 0, plays: 0 };
    const pct = run.total ? Math.round(run.right / run.total * 100) : 0;
    let newBest = false;
    rec.plays++;
    if (SCORED.includes(run.game)) { newBest = run.right > rec.best; rec.best = Math.max(rec.best, run.right); }
    else rec.last = pct;
    games()[key(run.game)] = rec;
    Store.save();

    const rows = missedRows();

    A.result = {
      eyebrow: `${g.name} · ${Banks.bank().name}`,
      right: run.right, total: run.total,
      big: SCORED.includes(run.game) ? String(run.right) : null,
      line: run.game === "speed"
        ? `${A.plural(run.right, "right answer")} in ${SPEED_SECONDS} seconds · ${run.total - run.right} wrong${newBest && run.right ? " · New best!" : ` · Best ${rec.best}`}`
        : LIVES.includes(run.game)
        ? `${run.lives <= 0 ? "Out of lives" : "Stopped"} · ${A.plural(run.right, "right answer")}${newBest && run.right ? " · New best!" : ` · Best ${rec.best}`}`
        : null,
      label: "To look at again", rows,
      back: homeOf(run.game, run.bank),
      buttons: `<button class="btn primary wide" data-act="gagain">Play again</button>
        <button class="btn wide" data-act="go-replace" data-to="${homeOf(run.game, run.bank)}">Back to ${GAME[run.game].home ? (GAME[run.game].home === "vocab" ? "Vocab" : "Sentences") : esc(Banks.bank().name)}</button>`
    };
    const again = { game: run.game, ids: run.ids, bank: run.bank };
    run = null;
    lastRun = again;
    A.replace("/done");
  }
  let lastRun = null;

  function again() {
    if (!lastRun) return;
    Banks.set(lastRun.bank);
    initRun(lastRun.game, lastRun.ids, lastRun.bank);
    A.replace(`/${lastRun.bank}/game-play`);
  }

  // ---------------------------------------------------------------- the grid on each hub

  function gridHtml() {
    return `<h3 class="section-label small games-label">Games</h3>
      <nav class="gamegrid">${GAMES.filter(g => !g.hidden).map(g => {
        const b = bestLine(g.id);
        return `<button class="game game-${g.id}" data-act="go" data-to="/${Banks.current}/game/${g.id}">
          <span class="game-name">${g.name}</span>
          <span class="game-sub">${g.sub}</span>
          ${b ? `<span class="game-best">${b}</span>` : ""}
        </button>`;
      }).join("")}</nav>`;
  }

  A.route("/:bank/game/*", picker);
  A.route("/:bank/game-play", () => playView(false));
  A.route("/daily", dailyView);
  A.on("gdaily", () => { if (dailyReady()) startDaily(); });
  A.route("/:bank/mini", miniView);
  A.on("gsize", setSize);
  A.on("gmini-go", miniMatch);
  // New words: deal again. Already on the list page, the address doesn't change, so redraw it directly.
  A.on("gmini-new", () => {
    if (!mini) return;
    Banks.set(mini.bank);
    dealMini(mini.ids, mini.bank, mini.words);
    const to = `/${mini.bank}/mini`;
    if (A.currentRoute() === to) A.render(); else A.replace(to);
  });
  A.on("gpick-all", () => pickAll(true));
  A.on("gpick-none", () => pickAll(false));
  A.on("gstart", el => start(el.dataset.game));
  A.on("gspeed", speedPick);
  A.on("gblitz", el => blitzAnswer(el.dataset.v === "1"));
  A.on("godd", oddPick);
  A.on("greveal", reveal);
  A.on("gmark", el => markRecall(el.dataset.ok === "1"));
  A.on("gnext", () => next());
  A.on("gmine", overrule);
  A.on("gquit", () => {
    if (run && run.total) finish();
    else { clearInterval(timer); clearInterval(dailyTimer); const b = run && !run.daily ? homeOf(run.game, run.bank) : "/"; run = null; A.replace(b); }
  });
  A.on("gagain", again);
  A.onKey((e, route) => {
    if (!(route.endsWith("/game-play") || route === "/daily") || !run) return;
    if (run.game === "blitz") {
      if (e.key === "ArrowRight" || e.key === "y") blitzAnswer(true);
      if (e.key === "ArrowLeft" || e.key === "n") blitzAnswer(false);
      return;
    }
    if (RECALL.includes(run.game)) {
      if (!run.revealed && (e.key === " " || e.key === "Enter")) { e.preventDefault(); reveal(); }
      else if (run.revealed && (e.key === "ArrowRight" || e.key === "2")) markRecall(true);
      else if (run.revealed && (e.key === "ArrowLeft" || e.key === "1")) markRecall(false);
      return;
    }
    const n = parseInt(e.key, 10);
    if (run.game === "odd") {
      if (n >= 1 && n <= 4 && !run.answered) { const b = document.querySelectorAll(".oddopt")[n - 1]; if (b) oddPick(b); }
      else if (e.key === "Enter" && run.answered) next();
      return;
    }
    if (run.game !== "speed" && run.game !== "survival") return;
    if (n >= 1 && n <= 4) { const b = document.querySelectorAll(".opt")[n - 1]; if (b) speedPick(b); }
  });

  window.Games = { dailyButton, gridHtml, numberPy, checkWord, checkSentence, typeable, answers, GAMES };
}());
