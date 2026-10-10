/* Sentences: the patterns page and the four activities
   (Pick the translation, Build it, Fill the gap, Reply). */
(function () {
  const A = App;
  const S = Sentences;
  const { esc } = A;
  const BY_ID = S.BY_ID;

  let run = null; // the sentence session being played

  function decoyCount() {
    const n = Store.state.settings.decoys;
    return n === 0 || n === 4 ? n : 2;
  }

  // ---------------------------------------------------------------- drawing sentences

  // Pinyin sentence with each word in its role colour. hide = index to show as a gap.
  function sentenceHtml(tokens, py, end, hide) {
    const parts = [];
    tokens.forEach((t, i) => {
      if (t === ",") { if (parts.length) parts[parts.length - 1] += `<span class="comma">,</span>`; return; }
      parts.push(i === hide
        ? `<span class="blank" id="blank">____</span>`
        : `<span class="r-${S.role(t)}">${esc(py[i])}</span>`);
    });
    return parts.join(" ") + (end && end !== "." ? `<span class="end">${end}</span>` : "");
  }

  function saysLine(tokens) {
    return tokens.map(t => t === "," ? "," : BY_ID[t].say).join(" ").replace(/ ,/g, ",");
  }

  function tileHtml(t, k) {
    return `<button class="stile r-${t.role} ${t.used ? "used" : ""}" data-act="stile" data-k="${k}" ${t.used ? "disabled" : ""}>
      <span class="sp">${esc(t.py)}</span><span class="ss">${esc(t.say)}</span></button>`;
  }

  // ---------------------------------------------------------------- the Sentences page

  function exampleFor(it) {
    if (S.status(it).open) {
      const inst = S.instance(it);
      return it.kind === "reply"
        ? sentenceHtml(inst.prompt, inst.promptPy, "") + ` <span class="arrow">→</span> ` + sentenceHtml(inst.tokens, inst.py, "")
        : sentenceHtml(inst.tokens, inst.py, inst.end);
    }
    return "";
  }

  function lockText(st) {
    const words = st.missing.slice(0, 3).map(id => Pinyin.plain(BY_ID[id].py));
    const gaps = st.slotGaps.map(list => "one of " + list.slice(0, 3).map(id => Pinyin.plain(BY_ID[id].py)).join(" / "));
    return "Learn " + words.concat(gaps).join(", ") + (st.missing.length > 3 ? "…" : "");
  }

  function decoySwitch() {
    const n = decoyCount();
    return `
      <div class="style-switch">
        <p class="style-label">Tiles to choose from</p>
        <div class="segmented three" role="radiogroup" aria-label="Decoy tiles">
          ${[[0, "Exact"], [2, "+2 decoys"], [4, "+4 decoys"]].map(([v, l]) =>
            `<button role="radio" aria-checked="${n === v}" class="${n === v ? "on" : ""}" data-act="sdecoys" data-n="${v}">${l}</button>`).join("")}
        </div>
      </div>`;
  }

  // The landing page: the five sections.
  function page() {
    return {
      title: "Sentences", back: "/essentials",
      body: `
        <p class="muted intro-line">Sentences unlock as you learn the words in them.</p>
        ${(() => {
          const all = S.summary();
          return `<section class="card allcard">
            <div class="ess-head"><div>
              <h2>All sentences</h2>
              <p class="muted">A random mix from every section below, Surreal included</p>
            </div></div>
            ${A.stageBar(all.stages)}
            <span class="sec-meta">${all.unlocked} of ${all.total} unlocked${all.due ? ` · <b>${all.due} due</b>` : ""}</span>
            ${all.unlocked
              ? `<button class="btn primary wide" data-act="ssection" data-sec="all">Practise all<small>10 at random</small></button>`
              : `<button class="btn primary wide" data-act="start" data-kind="new">Learn new words to unlock</button>`}
          </section>`;
        })()}
        <nav class="sections">
          ${S.SECTIONS.map(sec => {
            const sum = S.summary(sec.id);
            return `<button class="secard ${sec.surreal ? "surreal" : ""}" data-act="go" data-to="/essentials/sentences/${sec.id}">
              <span class="sec-name">${esc(sec.name)}</span>
              <span class="sec-sub">${esc(sec.sub)}</span>
              ${A.stageBar(sum.stages)}
              <span class="sec-meta">${sum.unlocked} of ${sum.total} unlocked${sum.due ? ` · <b>${sum.due} due</b>` : ""}</span>
            </button>`;
          }).join("")}
        </nav>
        ${decoySwitch()}
        <div class="roles" aria-label="Tile colours">
          ${Object.entries(S.ROLES).map(([k, label]) => `<span class="rchip r-${k}">${label}</span>`).join("")}
        </div>`
    };
  }

  // One section: Practise, then what's in it.
  function section(id) {
    const sec = S.SECTIONS.find(x => x.id === id);
    if (!sec) return null;
    const sum = S.summary(id);
    const items = S.sectionItems(id);
    // Patterns, grouped under their headings; then replies.
    const patterns = items.filter(it => it.kind === "pattern");
    const replies = items.filter(it => it.kind === "reply");
    const groups = [...new Set(patterns.map(it => it.group))];
    const patRow = it => {
      const st = S.status(it);
      return `<button class="pat ${st.open ? "" : "locked"}" data-act="spattern" data-id="${it.id}" data-sec="${id}" ${st.open ? "" : "disabled"}>
        <span class="pat-name">${esc(it.name)}</span>
        ${st.open ? A.pill(S.stage(it.id)) : `<span class="lock">Locked</span>`}
        <span class="pat-eg">${st.open ? exampleFor(it) : esc(lockText(st))}</span>
      </button>`;
    };
    const replyRow = it => {
      const st = S.status(it);
      const inst = S.instance(it);
      return `<li class="srow ${st.open ? "" : "locked"}">
        <span class="srow-main">
          <span class="srow-py">${sentenceHtml(inst.prompt, inst.promptPy, inst.promptEnd)} <span class="arrow">→</span> ${sentenceHtml(inst.tokens, inst.py, "")}</span>
          <span class="srow-en">${st.open ? `${esc(inst.promptEn)} → ${esc(S.replyEnglish(inst, inst.tokens))}` : esc(lockText(st))}</span>
        </span>
        ${st.open ? A.pill(S.stage(it.id)) : `<span class="lock">Locked</span>`}
      </li>`;
    };
    const list = groups.map(g => `
        <h3 class="section-label small">${esc(g)}</h3>
        <div class="patlist">${patterns.filter(it => it.group === g).map(patRow).join("")}</div>`).join("")
      + (replies.length ? `<h3 class="section-label small">Replies</h3><ul class="bank">${replies.map(replyRow).join("")}</ul>` : "");
    return {
      title: sec.name, back: "/essentials/sentences",
      body: `
        <section class="card">
          <div class="ess-head">
            <div><h2>${sum.unlocked} of ${sum.total} unlocked</h2>
            <p class="muted">${sec.surreal ? "Silly on purpose." : esc(sec.sub) + "."} Tap a pattern to practise just that one.</p></div>
          </div>
          ${A.stageBar(sum.stages)}
          ${sum.unlocked
            ? `<button class="btn primary wide" data-act="ssection" data-sec="${id}">Practise<small>${sum.due ? A.plural(sum.due, "sentence") + " due · " : ""}8 from this section</small></button>`
            : `<button class="btn primary wide" data-act="start" data-kind="new">Learn new words to unlock</button>`}
        </section>
        ${decoySwitch()}
        ${list}`
    };
  }

  // ---------------------------------------------------------------- running a session

  // sectionId: practise a whole section. patternId: practise one Surreal pattern.
  function start(sectionId, patternId) {
    // sectionId "all" mixes every section.
    const all = sectionId === "all";
    const sec = all ? { name: "All sentences" } : S.SECTIONS.find(x => x.id === sectionId);
    const onlyIds = patternId ? [patternId] : all ? S.ITEMS.map(it => it.id) : S.sectionItems(sectionId).map(it => it.id);
    const ids = patternId ? S.buildSession(onlyIds, 6, 6) : S.buildSession(onlyIds, all ? 10 : 8, 3);
    if (!ids) return;
    const title = patternId ? S.ITEM_BY_ID[patternId].name : sec.name;
    run = { ids, i: 0, base: ids.length, sectionId, patternId, title, results: [], retried: new Set(), startStage: {} };
    ids.forEach(id => { if (!(id in run.startStage)) run.startStage[id] = S.stage(id); });
    Store.requestPersist();
    setUp();
    A.go("/sentence");
  }

  // Prepare the current item: choose the activity and make the sentence.
  function setUp() {
    const it = S.ITEM_BY_ID[run.ids[run.i]];
    let act = S.pickActivity(it);
    const isNew = S.stage(it.id) === "new";
    // Re-roll if this exact sentence has already come up in the session.
    run.seen = run.seen || new Set();
    let inst = S.instance(it, isNew);
    for (let k = 0; k < 6 && run.seen.has(inst.tokens.join(" ")); k++) inst = S.instance(it, isNew);
    run.seen.add(inst.tokens.join(" "));
    const cur = { it, act, inst, input: [], slips: 0, slipWords: new Set(), done: false, isNew };
    if (act === "gap") {
      cur.gap = S.gap(inst);
      if (!cur.gap) cur.act = act = "build";
    }
    if (act === "translate") cur.opts = S.translations(inst);
    if (act === "build" || act === "reply") {
      const words = inst.tokens.map((t, i) => ({ t, i })).filter(x => x.t !== ",");
      const tiles = words.map(x => ({ id: x.t, py: inst.py[x.i], say: BY_ID[x.t].say, role: S.role(x.t), used: false }));
      S.decoys(inst, decoyCount()).forEach(id => tiles.push({ id, py: Pinyin.plain(BY_ID[id].py), say: BY_ID[id].say, role: S.role(id), used: false }));
      cur.tiles = Session.shuffle(tiles);
    }
    run.cur = cur;
  }

  function view() {
    if (!run) return null;
    const c = run.cur, inst = c.inst, it = c.it;
    const total = run.ids.length;
    const tip = it.kind === "pattern" ? it.def.tip : "";
    let body = "";

    if (c.act === "translate") {
      body = `
        <p class="ask">${c.isNew ? (it.kind === "pattern" ? `New pattern · ${esc(it.name)}` : "New sentence · what does it mean?") : "What does this mean?"}</p>
        <div class="sentcard">
          <div class="sline">${sentenceHtml(inst.tokens, inst.py, inst.end)}</div>
          <div class="ssay">${esc(saysLine(inst.tokens))}</div>
          ${c.isNew && tip ? `<p class="note">${esc(tip)}</p>` : ""}
        </div>
        <div class="options">${c.opts.map((en, n) => `<button class="opt" data-act="spick" data-n="${n}"><kbd>${n + 1}</kbd>${esc(en)}</button>`).join("")}</div>`;
    } else if (c.act === "gap") {
      body = `
        <p class="ask">Fill the gap</p>
        <div class="sentcard">
          <div class="sline">${sentenceHtml(inst.tokens, gapPy(inst, c.gap.index), inst.end, c.gap.index)}</div>
          <div class="sen">${esc(inst.en)}</div>
        </div>
        <div class="tilebank four">${c.gap.options.map((id, n) => `<button class="stile r-${S.role(id)}" data-act="sgap" data-id="${id}">
          <span class="sp">${esc(Pinyin.plain(id === c.gap.answer ? inst.py[c.gap.index] : BY_ID[id].py))}</span><span class="ss">${esc(BY_ID[id].say)}</span></button>`).join("")}</div>`;
    } else {
      const head = c.act === "reply"
        ? `<p class="ask">Someone says…</p>
           <div class="sentcard">
             <div class="sline">${sentenceHtml(inst.prompt, inst.promptPy, inst.promptEnd)}</div>
             <div class="ssay">${esc(saysLine(inst.prompt))}</div>
             <div class="sen">${esc(inst.promptEn)}</div>
           </div>
           <p class="ask small">Build a reply</p>`
        : `<p class="ask">${c.isNew ? `New pattern · ${esc(it.name)}` : "Build this in pinyin"}</p>
           <div class="sentcard"><div class="big-en">${esc(inst.en)}</div>${c.isNew && tip ? `<p class="note">${esc(tip)}</p>` : ""}</div>`;
      body = `
        ${head}
        <div class="answer" id="answer">${placedHtml(c)}</div>
        <div class="tilebank" id="tilebank">${c.tiles.map(tileHtml).join("")}</div>`;
    }

    return {
      bar: "session", cls: "play splay",
      body: `
        <header class="sessionbar">
          <button class="iconbtn" data-act="squit" aria-label="End session">${A.ICON.close}</button>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${run.i}"><span style="width:${Math.round(run.i / total * 100)}%"></span></div>
          <span class="count">${run.i + 1}/${total}</span>
        </header>
        ${body}
        <div class="feedback" id="feedback" hidden></div>`
    };
  }

  // Before the gap, show bù / yī unchanged: their spoken form (bú, yí) would hint at the missing tone.
  function gapPy(inst, index) {
    const py = inst.py.slice();
    const before = index - 1;
    if (before >= 0 && (inst.tokens[before] === "build:bu" || inst.tokens[before] === "num:yi")) {
      py[before] = Pinyin.plain(BY_ID[inst.tokens[before]].py);
    }
    return py;
  }

  function placedHtml(c) {
    if (!c.input.length) return `<span class="answer-hint">Tap the tiles in order</span>`;
    return c.placed.map(p => `<span class="placed r-${p.role}">${esc(p.py)}</span>`).join("");
  }

  // Does the input so far match the start of any accepted answer? Is it complete?
  function check(seqs, input) {
    let ok = false, complete = false;
    seqs.forEach(seq => {
      if (input.length <= seq.length && input.every((id, k) => seq[k].has(id))) {
        ok = true;
        if (input.length === seq.length) complete = true;
      }
    });
    return { ok, complete };
  }

  // ---------------------------------------------------------------- answering

  function tapTile(el) {
    const c = run.cur;
    if (c.done) return;
    const t = c.tiles[+el.dataset.k];
    if (!t || t.used) return;
    const input = c.input.concat(t.id);
    const res = check(c.inst.seqs, input);
    if (res.ok) {
      t.used = true;
      c.input = input;
      c.placed = (c.placed || []).concat({ py: t.py, role: t.role });
      el.classList.add("used");
      el.disabled = true;
      document.getElementById("answer").innerHTML = placedHtml(c);
      if (res.complete) finishItem(c.slips === 0);
    } else {
      c.slips++;
      // Picking the wrong word of the right kind (kāfēi for chá) means that word needs review.
      const pos = c.input.length;
      c.inst.seqs.forEach(seq => {
        if (pos < seq.length && c.input.every((id, k) => seq[k].has(id))) {
          seq[pos].forEach(exp => {
            if (S.role(exp) === t.role && !exp.startsWith("x:") && !c.slipWords.has(exp) && Memory.isIntro(exp)) {
              c.slipWords.add(exp);
              Memory.answer(exp, "c", false);
            }
          });
        }
      });
      el.classList.remove("wrong"); void el.offsetWidth; el.classList.add("wrong");
      setTimeout(() => el.classList.remove("wrong"), 420);
    }
  }

  function pickTranslation(el) {
    const c = run.cur;
    if (c.done) return;
    const chosen = c.opts[+el.dataset.n];
    const correct = chosen === c.inst.en;
    document.querySelectorAll(".opt").forEach((b, n) => {
      b.disabled = true;
      if (c.opts[n] === c.inst.en) b.classList.add("right");
    });
    if (!correct) el.classList.add("wrong");
    finishItem(correct);
  }

  function pickGap(el) {
    const c = run.cur;
    if (c.done) return;
    const id = el.dataset.id;
    const correct = c.gap.okHere.has(id);
    document.querySelectorAll(".stile").forEach(b => {
      b.disabled = true;
      if (c.gap.okHere.has(b.dataset.id)) b.classList.add("right");
    });
    if (!correct) {
      el.classList.add("wrong");
      if (Memory.isIntro(c.gap.answer)) Memory.answer(c.gap.answer, "c", false);
    }
    const blank = document.getElementById("blank");
    if (blank) { blank.textContent = c.inst.py[c.gap.index]; blank.className = "r-" + S.role(c.gap.answer) + " filled"; }
    finishItem(correct);
  }

  function finishItem(correct) {
    const c = run.cur;
    c.done = true;
    S.answer(c.it.id, correct);
    if (correct && c.act !== "translate") S.creditWords(c.inst.tokens);
    // Only first attempts count towards the score; retries at the end are extra practice.
    if (run.i < run.base) {
      run.results.push({
        id: c.it.id, correct, act: c.act, end: c.inst.end,
        tokens: c.act === "reply" ? c.input : c.inst.tokens,
        en: c.act === "reply" ? S.replyEnglish(c.inst, c.input) : c.inst.en,
        prompt: c.act === "reply" ? c.inst.prompt : null,
        promptEn: c.act === "reply" ? c.inst.promptEn : null,
        promptEnd: c.act === "reply" ? c.inst.promptEnd : null
      });
    }
    // Missed items come back once at the end, with a fresh sentence.
    if (!correct && !run.retried.has(c.it.id)) { run.retried.add(c.it.id); run.ids.push(c.it.id); }

    const fb = document.getElementById("feedback");
    fb.hidden = false;
    const inst = c.inst;
    let sentence, english;
    if (c.act === "reply") {
      const py = S.spoken(c.input);
      sentence = sentenceHtml(c.input, py, "");
      english = S.replyEnglish(inst, c.input);
    } else {
      sentence = sentenceHtml(inst.tokens, inst.py, inst.end);
      english = inst.en;
    }
    const tip = c.it.kind === "pattern" && !correct ? `<span class="fb-note">${esc(c.it.def.tip)}</span>` : "";
    const head = correct ? (c.slips === 0 ? "Right." : "Done.") : (c.act === "build" || c.act === "reply" ? `Done, with ${A.plural(c.slips, "slip")}.` : "Not quite.");
    fb.className = "feedback " + (correct ? "ok" : "bad");
    fb.innerHTML = `<span><b>${head}</b> <span class="fb-sent">${sentence}</span><span class="fb-en">${esc(english)}</span>${tip}</span>
      <button class="btn ${correct ? "small" : "primary"}" data-act="snext">${correct ? "Next" : "Continue"}</button>`;
    if (correct) A.vibrate(15);
    fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function next() {
    if (!run) return;
    run.i++;
    if (run.i >= run.ids.length) return finish();
    setUp();
    A.render();
  }

  function finish() {
    const right = run.results.filter(r => r.correct).length;
    const back = run.sectionId === "all" ? "/essentials/sentences" : "/essentials/sentences/" + run.sectionId;
    const again = run.patternId
      ? `data-act="spattern" data-id="${run.patternId}" data-sec="${run.sectionId}"`
      : `data-act="ssection" data-sec="${run.sectionId}"`;
    const secName = run.sectionId === "all" ? "Sentences" : S.SECTIONS.find(x => x.id === run.sectionId).name;
    A.result = {
      eyebrow: run.title, back,
      right, total: run.results.length,
      label: "Sentences in this session",
      rows: run.results.map(r => `<li class="srow">
          <span class="srow-main">
            <span class="srow-py">${r.prompt ? sentenceHtml(r.prompt, S.spoken(r.prompt), r.promptEnd) + ` <span class="arrow">→</span> ` : ""}${sentenceHtml(r.tokens, S.spoken(r.tokens), r.act === "reply" ? "" : r.end)}</span>
            <span class="srow-en">${r.prompt ? esc(r.promptEn) + " → " : ""}${esc(r.en)}</span>
          </span>
          <span class="mark ${r.correct ? "ok" : "bad"}" aria-label="${r.correct ? "right" : "missed"}">${r.correct ? "✓" : "✗"}</span>
        </li>`).join(""),
      buttons: `
        <button class="btn primary wide" ${again}>Practise again</button>
        <button class="btn wide" data-act="go-replace" data-to="${back}">Back to ${esc(secName)}</button>`
    };
    run = null;
    Store.saveNow();
    A.replace("/done");
  }

  // Shared with Vocab's Fill the gap question.
  window.SentenceView = { sentenceHtml, gapPy, saysLine };

  // ---------------------------------------------------------------- wiring

  A.route("/essentials/sentences", page);
  A.route("/essentials/sentences/*", section);
  A.route("/sentence", view);
  A.on("ssection", el => start(el.dataset.sec));
  A.on("spattern", el => start(el.dataset.sec || S.ITEM_BY_ID[el.dataset.id].section, el.dataset.id));
  A.on("sdecoys", el => { Store.state.settings.decoys = +el.dataset.n; Store.save(); A.render(); });
  A.on("stile", tapTile);
  A.on("spick", pickTranslation);
  A.on("sgap", pickGap);
  A.on("snext", next);
  A.on("squit", () => {
    if (run && run.results.length) finish();
    else { const sec = run && run.sectionId !== "all" ? run.sectionId : ""; run = null; A.back(sec ? "/essentials/sentences/" + sec : "/essentials/sentences"); }
  });

  A.onKey((e, r) => {
    if (r !== "/sentence" || !run) return;
    const c = run.cur;
    if (c.done && e.key === "Enter") { e.preventDefault(); next(); return; }
    if (c.done || !/^[1-9]$/.test(e.key)) return;
    const btns = document.querySelectorAll(c.act === "translate" ? ".opt" : ".stile:not(.used)");
    const b = btns[+e.key - 1];
    if (b) b.click();
  });
}());
