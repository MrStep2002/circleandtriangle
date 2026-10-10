/* Vocab: the mode menu, Choose groups, By category and one-at-a-time question sessions. */
(function () {
  const A = App;
  const { py, esc } = A;
  const GROUPS = window.ESSENTIALS.GROUPS;
  const GROUP_BY_ID = Object.fromEntries(GROUPS.map(g => [g.id, g]));
  const WORDS = Memory.WORDS;
  const BY_ID = Memory.BY_ID;

  let session = null; // the session being played

  // "steps" = one question at a time, "match" = Quick Match boards of 10 pairs.
  function style() { return Store.state.settings.style === "match" ? "match" : "steps"; }

  function groupWords(id) { return WORDS.filter(w => w.group === id); }

  // Rows for the results screen: each word with its stage before and after.
  function wordRows(list) {
    return list.map(x => {
      const w = BY_ID[x.id];
      return `<li>
        <span class="bank-py">${A.wordLine(w)}<span class="say">${esc(w.say)}</span></span>
        <span class="bank-en">${esc(w.en)}</span>
        <span class="change">${x.from !== x.to ? `<span class="muted">${A.STAGE_LABEL[x.from]} →</span> ` : ""}${A.pill(x.to)}</span>
      </li>`;
    }).join("");
  }

  // Buttons offered after any vocab session.
  function nextButtons() {
    const moreNew = Memory.newWords().length;
    const due = Memory.dueWords().length;
    return `
      ${moreNew ? `<button class="btn primary wide" data-act="start" data-kind="new">Learn ${Math.min(Session.BATCH, moreNew)} more words</button>` : ""}
      ${due ? `<button class="btn wide" data-act="start" data-kind="review">Review ${A.plural(due, "due word")}</button>` : ""}
      <button class="btn wide" data-act="go-replace" data-to="/essentials/vocab">Back to Vocab</button>`;
  }

  // ------------------------------------------------------------------ menus

  function vocab() {
    const due = Memory.dueWords();
    const nextBatch = Memory.newWords().slice(0, Session.BATCH);
    const soon = Memory.nextDue();
    const reviewSub = due.length ? A.plural(due.length, "word") + " due now"
      : (soon < Infinity ? "Nothing due · next " + A.timeUntil(soon) : "Learn some words first");
    const s = style();
    return {
      title: "Vocab", back: "/essentials",
      body: `
        <nav class="modes">
          <button class="mode feature" data-act="start" data-kind="new" ${nextBatch.length ? "" : "disabled"}>
            <span class="mode-name">New Words</span>
            <span class="mode-sub">${nextBatch.length ? "Learn and test the next " + nextBatch.length + ":" : "You've met every Essentials word"}</span>
            ${nextBatch.length ? `<span class="preview">${nextBatch.map(w => `<span class="pw">${py(w.py)}</span>`).join("<i>·</i>")}</span>` : ""}
          </button>
          <div class="style-switch" role="radiogroup" aria-label="How to practise">
            <p class="style-label">Practise the rest…</p>
            <div class="segmented">
              <button role="radio" aria-checked="${s === "steps"}" class="${s === "steps" ? "on" : ""}" data-act="style" data-style="steps">One at a time</button>
              <button role="radio" aria-checked="${s === "match"}" class="${s === "match" ? "on" : ""}" data-act="style" data-style="match">Quick Match</button>
            </div>
            <p class="hint">${s === "match" ? "Match 10 pinyin to their meanings, round after round." : "Questions one by one, testing both directions."}</p>
          </div>
          <button class="mode" data-act="start" data-kind="review" ${due.length ? "" : "disabled"}>
            <span class="mode-name">Review ${due.length ? `<span class="badge">${due.length}</span>` : ""}</span>
            <span class="mode-sub">${reviewSub}</span>
          </button>
          <button class="mode" data-act="start" data-kind="random">
            <span class="mode-name">Random</span>
            <span class="mode-sub">${s === "match" ? "Rounds of 10 pairs from anywhere in Essentials" : "10 words from anywhere in Essentials"}</span>
          </button>
          <button class="mode" data-act="go" data-to="/essentials/vocab/groups">
            <span class="mode-name">Choose groups</span>
            <span class="mode-sub">Tick the groups you want to practise together</span>
          </button>
          <button class="mode" data-act="go" data-to="/essentials/vocab/category">
            <span class="mode-name">By category</span>
            <span class="mode-sub">Drill one group: numbers, verbs, food…</span>
          </button>
        </nav>`
    };
  }

  // Plain groups first, then the sentence-building sub-groups under their own heading.
  function groupRows(render) {
    let html = GROUPS.filter(g => !g.parent).map(render).join("");
    const parents = [...new Set(GROUPS.filter(g => g.parent).map(g => g.parent))];
    parents.forEach(p => {
      html += `<h3 class="section-label small">${p}</h3>`;
      html += GROUPS.filter(g => g.parent === p).map(render).join("");
    });
    return html;
  }

  function groupStats(g) {
    const ws = groupWords(g.id);
    const c = Memory.counts(ws);
    return { ws, c, met: ws.length - c.new };
  }

  function chooseGroups() {
    const saved = Store.state.settings.lastGroups || [];
    return {
      title: "Choose groups", back: "/essentials/vocab", cls: "has-dock",
      body: `
        <p class="muted intro-line">Tick any groups. You'll get up to 12 words from them.</p>
        <div class="quickpick"><button class="chip" data-act="pick-all">Select all</button><button class="chip" data-act="pick-none">Clear</button></div>
        <form id="groups-form" class="checks">
          ${groupRows(g => {
            const s = groupStats(g);
            return `<label class="check">
              <input type="checkbox" id="g-${g.id}" name="g" value="${g.id}" ${saved.includes(g.id) ? "checked" : ""}>
              <span class="check-name">${g.name}</span>
              <span class="check-meta">${s.met}/${s.ws.length} met</span>
            </label>`;
          })}
        </form>
        <div class="dock"><button class="btn primary wide" id="groups-go" data-act="start-groups" disabled>Pick at least one group</button></div>`,
      after() {
        const form = document.getElementById("groups-form");
        const goBtn = document.getElementById("groups-go");
        const update = () => {
          const ids = [...form.querySelectorAll("input:checked")].map(i => i.value);
          const n = WORDS.filter(w => ids.includes(w.group)).length;
          goBtn.disabled = !ids.length;
          goBtn.textContent = !ids.length ? "Pick at least one group"
            : style() === "match" ? `Quick Match: ${n} words from ${A.plural(ids.length, "group")}`
            : `Practise ${Math.min(12, n)} words from ${A.plural(ids.length, "group")}`;
        };
        form.addEventListener("change", update);
        update();
      }
    };
  }

  function category() {
    return {
      title: "By category", back: "/essentials/vocab",
      body: `
        <p class="muted intro-line">Tap a group to drill it.</p>
        <nav class="cats">
          ${groupRows(g => {
            const s = groupStats(g);
            return `<button class="cat" data-act="start-cat" data-group="${g.id}">
              <span class="cat-name">${g.name}</span>
              <span class="cat-meta">${s.c.known} known · ${s.met}/${s.ws.length} met</span>
              ${A.stageBar(s.c)}
            </button>`;
          })}
        </nav>`
    };
  }

  // ------------------------------------------------------------------ one-at-a-time sessions

  function startSession(def) {
    if (!def) return;
    session = { def, i: 0, firstTry: {}, retried: new Set(), startStage: {}, answered: false };
    def.steps.forEach(s => { if (!(s.id in session.startStage)) session.startStage[s.id] = Memory.stage(s.id); });
    Store.requestPersist();
    A.go("/play");
  }

  function playView() {
    if (!session) return null;
    const step = session.def.steps[session.i];
    const w = BY_ID[step.id];
    const total = session.def.steps.length;
    const pct = Math.round((session.i / total) * 100);
    const g = GROUP_BY_ID[w.group];
    session.answered = false;

    let body = "";
    if (step.type === "intro") {
      body = `
        <p class="ask">New word</p>
        <div class="wordcard intro">
          <div class="big-py">${py(w.py)}</div>
          <div class="say">sounds like “${esc(w.say)}”</div>
          <div class="en">${esc(w.en)}</div>
          <div class="grp">${g ? g.name : ""}</div>
          ${A.noteHtml(w)}
        </div>
        <div class="actions"><button class="btn primary wide" data-act="next" autofocus>Got it</button></div>`;
    } else if (step.type === "meaning") {
      const opts = Session.choices(w, "meaning");
      body = `
        <p class="ask">What does this mean?</p>
        <div class="wordcard">
          <div class="big-py">${py(w.py)}</div>
          <div class="say">sounds like “${esc(w.say)}”</div>
        </div>
        <div class="options">${opts.map((o, n) => `<button class="opt" data-act="choose" data-id="${o.id}"><kbd>${n + 1}</kbd>${esc(o.en)}</button>`).join("")}</div>
        <div class="feedback" id="feedback" hidden></div>`;
    } else if (step.type === "recall") {
      const opts = Session.choices(w, "recall");
      body = `
        <p class="ask">Which is the pinyin for…</p>
        <div class="wordcard">
          <div class="big-en">${esc(w.en)}</div>
        </div>
        <div class="options">${opts.map((o, n) => `<button class="opt opt-py" data-act="choose" data-id="${o.id}"><kbd>${n + 1}</kbd><span class="py">${py(o.py)}</span><span class="say">${esc(o.say)}</span></button>`).join("")}</div>
        <div class="feedback" id="feedback" hidden></div>`;
    } else if (step.type === "gap") {
      if (!step.g) step.g = Sentences.gapFor(w.id);
      if (!step.g) { step.type = "recall"; return playView(); }
      const { inst, gap } = step.g;
      const V = window.SentenceView;
      const tile = id => {
        const word = Sentences.BY_ID[id];
        const shown = id === gap.answer ? inst.py[gap.index] : Pinyin.plain(word.py);
        return `<button class="stile opt-gap r-${Sentences.role(id)}" data-act="choose" data-id="${id}"><span class="sp">${esc(shown)}</span><span class="ss">${esc(word.say)}</span></button>`;
      };
      body = `
        <p class="ask">Fill the gap</p>
        <div class="sentcard">
          <div class="sline">${V.sentenceHtml(inst.tokens, V.gapPy(inst, gap.index), inst.end, gap.index)}</div>
          <div class="sen">${esc(inst.en)}</div>
        </div>
        <div class="tilebank four">${gap.options.map(tile).join("")}</div>
        <div class="feedback" id="feedback" hidden></div>`;
    } else if (step.type === "flash") {
      body = `
        <p class="ask">Do you know this one?</p>
        <div class="wordcard">
          <div class="big-py">${py(w.py)}</div>
          <div class="say">sounds like “${esc(w.say)}”</div>
          <div class="en" id="flash-en" hidden>${esc(w.en)}</div>
        </div>
        <div class="actions" id="flash-show"><button class="btn primary wide" data-act="flash-show">Show meaning</button></div>
        <div class="actions row2" id="flash-mark" hidden>
          <button class="btn" data-act="flash-mark" data-ok="0">Didn't know</button>
          <button class="btn primary" data-act="flash-mark" data-ok="1">Knew it</button>
        </div>`;
    }

    return {
      bar: "session", cls: "play",
      body: `
        <header class="sessionbar">
          <button class="iconbtn" data-act="quit" aria-label="End session">${A.ICON.close}</button>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${session.i}"><span style="width:${pct}%"></span></div>
          <span class="count">${session.i + 1}/${total}</span>
        </header>
        ${body}`
    };
  }

  function recordAnswer(step, correct) {
    const skill = step.type === "recall" || step.type === "gap" ? "c" : "m";
    Memory.answer(step.id, skill, correct);
    const key = step.id + ":" + step.type;
    if (!(key in session.firstTry)) session.firstTry[key] = correct;
    // Wrong answers come back once at the end of the session.
    if (!correct && !session.retried.has(key)) {
      session.retried.add(key);
      session.def.steps.push({ type: step.type === "flash" ? "meaning" : step.type, id: step.id });
    }
  }

  function choose(btn) {
    if (session.answered) return;
    session.answered = true;
    const step = session.def.steps[session.i];
    const w = BY_ID[step.id];
    const correct = btn.dataset.id === w.id;
    document.querySelectorAll(".opt, .opt-gap").forEach(b => {
      b.disabled = true;
      if (b.dataset.id === w.id) b.classList.add("right");
    });
    if (!correct) btn.classList.add("wrong");
    if (step.type === "gap") {
      const blank = document.getElementById("blank");
      if (blank) { blank.textContent = step.g.inst.py[step.g.gap.index]; blank.className = "r-" + Sentences.role(w.id) + " filled"; }
    }
    recordAnswer(step, correct);
    const fb = document.getElementById("feedback");
    fb.hidden = false;
    if (correct) {
      fb.className = "feedback ok";
      fb.innerHTML = `<span><b>Right.</b> ${py(w.py)} · ${esc(w.en)}</span><button class="btn small" data-act="next">Next</button>`;
      A.vibrate(15);
      session.autoTimer = setTimeout(next, 900);
    } else {
      fb.className = "feedback bad";
      fb.innerHTML = `<span><b>Not quite.</b> ${py(w.py)} <span class="say">“${esc(w.say)}”</span> means <b>${esc(w.en)}</b>${w.note ? `<span class="fb-note">${esc(w.note)}</span>` : ""}</span>
        <button class="btn primary" data-act="next">Continue</button>`;
      fb.querySelector("button").focus();
    }
  }

  function next() {
    if (!session) return;
    clearTimeout(session.autoTimer);
    const step = session.def.steps[session.i];
    if (step.type === "intro") Memory.introduce(step.id);
    session.i++;
    if (session.i >= session.def.steps.length) return finish();
    A.render();
  }

  function finish() {
    const ids = [...new Set(session.def.steps.filter(s => s.type !== "intro").map(s => s.id))];
    const tries = Object.values(session.firstTry);
    A.result = {
      eyebrow: session.def.title, back: "/essentials/vocab",
      right: tries.filter(Boolean).length, total: tries.length,
      label: "Words in this session",
      rows: wordRows(ids.map(id => ({ id, from: session.startStage[id], to: Memory.stage(id) }))),
      buttons: nextButtons()
    };
    session = null;
    Store.saveNow();
    A.replace("/done");
  }

  // Start any Vocab mode in the chosen style. New Words always teaches one at a time.
  function launch(kind, groupIds, title) {
    if (style() === "match" && kind !== "new") {
      Match.start(kind, groupIds, title || (kind === "review" ? "Review" : "Random words"));
      return;
    }
    const def = kind === "new" ? Session.newWords()
      : kind === "review" ? Session.review()
      : kind === "groups" ? Session.groups(groupIds, title)
      : Session.random();
    startSession(def);
  }

  // ------------------------------------------------------------------ wiring

  A.route("/essentials/vocab", vocab);
  A.route("/essentials/vocab/groups", chooseGroups);
  A.route("/essentials/vocab/category", category);
  A.route("/play", playView);

  A.on("smart", () => {
    const def = Session.smart();
    if (def) startSession(def); else A.go("/essentials/vocab");
  });
  A.on("start", el => launch(el.dataset.kind));
  A.on("start-cat", el => { const g = GROUP_BY_ID[el.dataset.group]; launch("groups", [g.id], g.name); });
  A.on("start-groups", () => {
    const ids = [...document.querySelectorAll("#groups-form input:checked")].map(i => i.value);
    Store.state.settings.lastGroups = ids;
    Store.save();
    launch("groups", ids, ids.length === 1 ? GROUP_BY_ID[ids[0]].name : "Chosen groups");
  });
  A.on("style", el => { Store.state.settings.style = el.dataset.style; Store.save(); A.render(); });
  const pick = all => {
    document.querySelectorAll("#groups-form input").forEach(i => { i.checked = all; });
    document.getElementById("groups-form").dispatchEvent(new Event("change"));
  };
  A.on("pick-all", () => pick(true));
  A.on("pick-none", () => pick(false));
  A.on("choose", choose);
  A.on("next", next);
  A.on("flash-show", () => {
    document.getElementById("flash-en").hidden = false;
    document.getElementById("flash-show").hidden = true;
    document.getElementById("flash-mark").hidden = false;
  });
  A.on("flash-mark", el => {
    if (!session || session.answered) return;
    session.answered = true;
    recordAnswer(session.def.steps[session.i], el.dataset.ok === "1");
    next();
  });
  A.on("quit", () => {
    if (session && Object.keys(session.firstTry).length) finish();
    else { session = null; A.back("/essentials/vocab"); }
  });

  // Number keys 1-4 pick an answer; Enter continues. Handy on a laptop.
  A.onKey((e, r) => {
    if (r !== "/play" || !session) return;
    const opts = document.querySelectorAll(".opt, .opt-gap");
    if (/^[1-4]$/.test(e.key) && opts[+e.key - 1] && !session.answered) choose(opts[+e.key - 1]);
    else if (e.key === "Enter" && session.answered) { e.preventDefault(); next(); }
  });

  window.Vocab = { launch, wordRows, nextButtons, style, GROUP_BY_ID };
}());
