/* Quick Match: boards of 10 pinyin beside 10 shuffled meanings, round after round. */
(function () {
  const A = App;
  const { py, esc } = A;
  const BY_ID = Memory.BY_ID;
  const BOARD = 10;
  let match = null;

  function start(kind, groupIds, title) {
    match = { kind, groupIds, title, round: 0, used: new Set(), startStage: {}, pairs: 0, firstTry: 0, words: [] };
    Store.requestPersist();
    if (!newBoard()) { match = null; return; }
    A.go("/match");
  }

  // Deal the next board, preferring words not yet seen in this session.
  function newBoard() {
    const pool = Session.matchPool(match.kind, match.groupIds);
    const fresh = pool.filter(w => !match.used.has(w.id));
    let words = Session.matchSet(fresh, BOARD);
    if (words.length < BOARD) {
      // Run out of unseen words: top up from the rest of the pool.
      const ids = new Set(words.map(w => w.id));
      words = Session.matchSet(words.concat(pool.filter(w => !ids.has(w.id))), BOARD);
    }
    if (words.length < 3) return false;
    words.forEach(w => {
      match.used.add(w.id);
      if (!(w.id in match.startStage)) { match.startStage[w.id] = Memory.stage(w.id); match.words.push(w.id); }
    });
    match.round++;
    match.board = {
      left: Session.shuffle(words.map(w => w.id)),
      right: Session.shuffle(words.map(w => w.id)),
      done: new Set(), missed: new Set(), sel: null, started: Date.now(), mistakes: 0
    };
    return true;
  }

  function view() {
    if (!match) return null;
    const b = match.board;
    const n = b.left.length;
    const complete = b.done.size === n;
    const cell = (side, id) => {
      const w = BY_ID[id];
      const done = b.done.has(id);
      const inner = side === "L"
        ? `<span class="py">${py(w.py)}</span><span class="say">${esc(w.say)}</span>`
        : `<span class="en">${esc(w.en)}</span>`;
      return `<button class="mcell ${side === "L" ? "left" : "right"} ${done ? "done" : ""}"
        data-act="mtap" data-side="${side}" data-id="${id}" ${done ? "disabled" : ""}>${inner}</button>`;
    };
    const secs = Math.round(((complete ? b.finished : Date.now()) - b.started) / 1000);
    return {
      bar: "session", cls: "play matchplay" + (complete ? " has-dock" : ""),
      body: `
        <header class="sessionbar">
          <button class="iconbtn" data-act="mquit" aria-label="End Quick Match">${A.ICON.close}</button>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${b.done.size}"><span style="width:${Math.round(b.done.size / n * 100)}%"></span></div>
          <span class="count">${b.done.size}/${n}</span>
        </header>
        <p class="ask">Round ${match.round} · tap a pinyin, then its meaning</p>
        <div class="board">
          <div class="col">${b.left.map(id => cell("L", id)).join("")}</div>
          <div class="col">${b.right.map(id => cell("R", id)).join("")}</div>
        </div>
        ${complete ? `
          <div class="dock round-done">
            <div class="round-card">
              <p><b>Round ${match.round} done</b> · ${A.plural(n - b.missed.size, "pair")} first time · ${A.plural(b.mistakes, "slip")} · ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</p>
              <div class="row2 even">
                <button class="btn" data-act="mfinish">Finish</button>
                <button class="btn primary" data-act="mnext">Next ${BOARD}</button>
              </div>
            </div>
          </div>` : ""}`
    };
  }

  function tap(el) {
    const b = match.board;
    const side = el.dataset.side, id = el.dataset.id;
    if (b.done.has(id)) return;
    if (!b.sel || b.sel.side === side) {
      // First pick, or changing your mind on the same side.
      b.sel = (b.sel && b.sel.id === id && b.sel.side === side) ? null : { side, id };
      document.querySelectorAll(".mcell.sel").forEach(c => c.classList.remove("sel"));
      if (b.sel) el.classList.add("sel");
      return;
    }
    // Second pick on the other side: check the pair.
    const leftId = side === "L" ? id : b.sel.id;
    const rightId = side === "R" ? id : b.sel.id;
    b.sel = null;
    document.querySelectorAll(".mcell.sel").forEach(c => c.classList.remove("sel"));
    if (leftId === rightId) {
      b.done.add(leftId);
      match.pairs++;
      if (!b.missed.has(leftId)) { match.firstTry++; Memory.answer(leftId, "m", true); }
      document.querySelectorAll(`.mcell[data-id="${CSS.escape(leftId)}"]`).forEach(c => { c.classList.add("done", "pop"); c.disabled = true; });
      A.vibrate(10);
      const bar = document.querySelector(".progress span");
      if (bar) bar.style.width = Math.round(b.done.size / b.left.length * 100) + "%";
      const count = document.querySelector(".count");
      if (count) count.textContent = b.done.size + "/" + b.left.length;
      if (b.done.size === b.left.length) { b.finished = Date.now(); setTimeout(A.render, 350); }
    } else {
      b.mistakes++;
      // The pinyin you tried to match is the word you didn't know. Counted once per round.
      if (!b.missed.has(leftId)) { b.missed.add(leftId); Memory.answer(leftId, "m", false); }
      const pair = [document.querySelector(`.mcell.left[data-id="${CSS.escape(leftId)}"]`), document.querySelector(`.mcell.right[data-id="${CSS.escape(rightId)}"]`)];
      pair.forEach(c => { if (c) { c.classList.remove("wrong"); void c.offsetWidth; c.classList.add("wrong"); } });
      setTimeout(() => pair.forEach(c => c && c.classList.remove("wrong")), 450);
    }
  }

  function finish() {
    A.result = {
      eyebrow: "Quick Match · " + match.title, back: "/essentials/vocab",
      right: match.firstTry, total: match.pairs,
      label: "Words in this session",
      rows: Vocab.wordRows(match.words.map(id => ({ id, from: match.startStage[id], to: Memory.stage(id) }))),
      buttons: Vocab.nextButtons()
    };
    match = null;
    Store.saveNow();
    A.replace("/done");
  }

  A.route("/match", view);
  A.on("mtap", tap);
  A.on("mnext", () => { if (newBoard()) A.render(); else finish(); });
  A.on("mfinish", finish);
  A.on("mquit", () => {
    if (match && match.pairs) finish();
    else { match = null; A.back("/essentials/vocab"); }
  });

  window.Match = { start };
}());
