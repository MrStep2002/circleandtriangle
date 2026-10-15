/* Vocab: the mode menu, Choose groups, By category and one-at-a-time question sessions. */
(function () {
  const A = App;
  const { py, esc } = A;
  const G = () => Banks.groups();
  const groupById = id => G().find(g => g.id === id);
  const W = () => Memory.WORDS;
  const BY_ID = Memory.BY_ID;
  // The current bank's copy first: a borrowed word carries this topic's group and note.
  const wordOf = id => W().find(w => w.id === id) || BY_ID[id];

  let session = null; // the session being played

  // "steps" = one question at a time, "match" = Quick Match boards of 10 pairs.
  function style() { return Store.state.settings.style === "match" ? "match" : "steps"; }

  function groupWords(id) { return W().filter(w => w.group === id); }

  // Rows for the results screen: each word with its stage before and after.
  function wordRows(list) {
    return list.map(x => {
      const w = wordOf(x.id);
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
      ${moreNew ? `<button class="btn primary wide" data-act="start" data-kind="new">Aprender mais ${Math.min(Session.BATCH, moreNew)} palavras</button>` : ""}
      ${due ? `<button class="btn wide" data-act="start" data-kind="review">Revisar ${A.plural(due, "palavra")}</button>` : ""}
      <button class="btn wide" data-act="go-replace" data-to="/${Banks.current}/vocab">Voltar ao vocabulário</button>`;
  }

  // ------------------------------------------------------------------ menus

  function vocab() {
    const due = Memory.dueWords();
    const nextBatch = Memory.newWords().slice(0, Session.BATCH);
    const soon = Memory.nextDue();
    const reviewSub = due.length ? A.plural(due.length, "palavra") + " para revisar agora"
      : (soon < Infinity ? "Nada para revisar · próxima " + A.timeUntil(soon) : "Aprenda algumas palavras primeiro");
    const s = style();
    return {
      title: "Vocabulário", back: `/${Banks.current}`,
      body: `
        <nav class="modes">
          <button class="mode feature" data-act="start" data-kind="new" ${nextBatch.length ? "" : "disabled"}>
            <span class="mode-name">Palavras novas</span>
            <span class="mode-sub">${nextBatch.length ? "Aprenda e teste as próximas " + nextBatch.length + ":" : "Você já viu todas as palavras"}</span>
            ${nextBatch.length ? `<span class="preview">${nextBatch.map(w => `<span class="pw">${py(w.py)}</span>`).join("<i>·</i>")}</span>` : ""}
          </button>
          <div class="style-switch" role="radiogroup" aria-label="Como praticar">
            <p class="style-label">Praticar as outras…</p>
            <div class="segmented">
              <button role="radio" aria-checked="${s === "steps"}" class="${s === "steps" ? "on" : ""}" data-act="style" data-style="steps">Uma de cada vez</button>
              <button role="radio" aria-checked="${s === "match"}" class="${s === "match" ? "on" : ""}" data-act="style" data-style="match">Combinar rápido</button>
            </div>
            <p class="hint">${s === "match" ? "Combine 10 pinyin com os significados, rodada após rodada." : "Perguntas uma por uma, testando os dois sentidos."}</p>
          </div>
          <button class="mode" data-act="start" data-kind="review" ${due.length ? "" : "disabled"}>
            <span class="mode-name">Revisão ${due.length ? `<span class="badge">${due.length}</span>` : ""}</span>
            <span class="mode-sub">${reviewSub}</span>
          </button>
          <button class="mode" data-act="start" data-kind="random">
            <span class="mode-name">Aleatório</span>
            <span class="mode-sub">${s === "match" ? "Rodadas de 10 pares de todas as palavras" : "10 palavras de todas as que você conhece"}</span>
          </button>
          <button class="mode" data-act="go" data-to="/${Banks.current}/vocab/groups">
            <span class="mode-name">Escolher grupos</span>
            <span class="mode-sub">Marque os grupos que quer praticar juntos</span>
          </button>
          <button class="mode" data-act="go" data-to="/${Banks.current}/vocab/category">
            <span class="mode-name">Por categoria</span>
            <span class="mode-sub">Treine um grupo: números, verbos, comida…</span>
          </button>
        </nav>`
    };
  }

  // Plain groups first, then the sentence-building sub-groups under their own heading.
  function groupRows(render) {
    let html = G().filter(g => !g.parent).map(render).join("");
    const parents = [...new Set(G().filter(g => g.parent).map(g => g.parent))];
    parents.forEach(p => {
      html += `<h3 class="section-label small">${p}</h3>`;
      html += G().filter(g => g.parent === p).map(render).join("");
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
      title: "Escolher grupos", back: `/${Banks.current}/vocab`, cls: "has-dock",
      body: `
        <p class="muted intro-line">Marque os grupos que quiser. Você vai receber até 12 palavras deles.</p>
        <div class="quickpick"><button class="chip" data-act="pick-all">Marcar todos</button><button class="chip" data-act="pick-none">Limpar</button></div>
        <form id="groups-form" class="checks">
          ${groupRows(g => {
            const s = groupStats(g);
            return `<label class="check">
              <input type="checkbox" id="g-${g.id}" name="g" value="${g.id}" ${saved.includes(g.id) ? "checked" : ""}>
              <span class="check-name">${g.name}</span>
              <span class="check-meta">${s.met}/${s.ws.length} vistas</span>
            </label>`;
          })}
        </form>
        <div class="dock"><button class="btn primary wide" id="groups-go" data-act="start-groups" disabled>Escolha pelo menos um grupo</button></div>`,
      after() {
        const form = document.getElementById("groups-form");
        const goBtn = document.getElementById("groups-go");
        const update = () => {
          const ids = [...form.querySelectorAll("input:checked")].map(i => i.value);
          const n = W().filter(w => ids.includes(w.group)).length;
          goBtn.disabled = !ids.length;
          goBtn.textContent = !ids.length ? "Escolha pelo menos um grupo"
            : style() === "match" ? `Combinar rápido: ${n} palavras de ${A.plural(ids.length, "grupo")}`
            : `Praticar ${Math.min(12, n)} palavras de ${A.plural(ids.length, "grupo")}`;
        };
        form.addEventListener("change", update);
        update();
      }
    };
  }

  function category() {
    return {
      title: "Por categoria", back: `/${Banks.current}/vocab`,
      body: `
        <p class="muted intro-line">Toque num grupo para treinar.</p>
        <nav class="cats">
          ${groupRows(g => {
            const s = groupStats(g);
            return `<button class="cat" data-act="start-cat" data-group="${g.id}">
              <span class="cat-name">${g.name}</span>
              <span class="cat-meta">${s.c.known} dominadas · ${s.met}/${s.ws.length} vistas</span>
              ${A.stageBar(s.c)}
            </button>`;
          })}
        </nav>`
    };
  }

  // ------------------------------------------------------------------ one-at-a-time sessions

  function startSession(def) {
    if (!def) return;
    // Endless: when the steps run out, another batch of the same kind is added (see next()).
    session = { def, i: 0, right: 0, total: 0, startStage: {}, answered: false, touched: [] };
    def.steps.forEach(s => { if (!(s.id in session.startStage)) session.startStage[s.id] = Memory.stage(s.id); });
    Store.requestPersist();
    A.go("/play");
  }

  function playView() {
    if (!session) return null;
    const step = session.def.steps[session.i];
    const w = wordOf(step.id);
    const g = groupById(w.group);
    session.answered = false;

    let body = "";
    if (step.type === "intro") {
      body = `
        <p class="ask">Palavra nova</p>
        <div class="wordcard intro">
          <div class="big-py">${py(w.py)}</div>
          <div class="say">soa como “${esc(w.say)}”</div>
          <div class="en">${esc(w.en)}</div>
          <div class="grp">${g ? g.name : ""}</div>
          ${A.noteHtml(w)}
        </div>
        <div class="actions"><button class="btn primary wide" data-act="next" autofocus>Entendi</button></div>`;
    } else if (step.type === "meaning") {
      const opts = Session.choices(w, "meaning");
      body = `
        <p class="ask">O que significa?</p>
        <div class="wordcard">
          <div class="big-py">${py(w.py)}</div>
          <div class="say">soa como “${esc(w.say)}”</div>
        </div>
        <div class="options">${opts.map((o, n) => `<button class="opt" data-act="choose" data-id="${o.id}"><kbd>${n + 1}</kbd>${esc(o.en)}</button>`).join("")}</div>
        <div class="feedback" id="feedback" hidden></div>`;
    } else if (step.type === "recall") {
      const opts = Session.choices(w, "recall");
      body = `
        <p class="ask">Qual é o pinyin de…</p>
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
        <p class="ask">Complete a lacuna</p>
        <div class="sentcard">
          <div class="sline">${V.sentenceHtml(inst.tokens, V.gapPy(inst, gap.index), inst.end, gap.index)}</div>
          <div class="sen">${esc(inst.en)}</div>
        </div>
        <div class="tilebank four">${gap.options.map(tile).join("")}</div>
        <div class="feedback" id="feedback" hidden></div>`;
    } else if (step.type === "flash") {
      body = `
        <p class="ask">Você sabe esta?</p>
        <div class="wordcard">
          <div class="big-py">${py(w.py)}</div>
          <div class="say">soa como “${esc(w.say)}”</div>
          <div class="en" id="flash-en" hidden>${esc(w.en)}</div>
        </div>
        <div class="actions" id="flash-show"><button class="btn primary wide" data-act="flash-show">Mostrar significado</button></div>
        <div class="actions row2" id="flash-mark" hidden>
          <button class="btn" data-act="flash-mark" data-ok="0">Não sabia</button>
          <button class="btn primary" data-act="flash-mark" data-ok="1">Sabia</button>
        </div>`;
    }

    return {
      bar: "session", cls: "play",
      body: `
        ${A.scoreBar("quit", session.right, session.total)}
        ${body}`
    };
  }

  function recordAnswer(step, correct) {
    const skill = step.type === "recall" || step.type === "gap" ? "c" : "m";
    Memory.answer(step.id, skill, correct);
    if (!(step.id in session.startStage)) session.startStage[step.id] = "new";
    if (!session.touched.includes(step.id)) session.touched.push(step.id);
    // Second goes at a missed word don't count towards the score.
    if (!step.retry) {
      session.total++;
      if (correct) session.right++;
      A.updateScore(session.right, session.total);
      // A missed word comes back a few questions later.
      if (!correct) session.def.steps.splice(Math.min(session.i + 4, session.def.steps.length), 0,
        { type: step.type === "flash" ? "meaning" : step.type, id: step.id, retry: true });
    }
  }

  function choose(btn) {
    if (session.answered) return;
    session.answered = true;
    const step = session.def.steps[session.i];
    const w = wordOf(step.id);
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
      fb.innerHTML = `<span><b>Certo.</b> ${py(w.py)} · ${esc(w.en)}</span><button class="btn small" data-act="next">Próxima</button>`;
      A.vibrate(15);
      session.autoTimer = setTimeout(next, 900);
    } else {
      fb.className = "feedback bad";
      fb.innerHTML = `<span><b>Quase.</b> ${py(w.py)} <span class="say">“${esc(w.say)}”</span> significa <b>${esc(w.en)}</b>${w.note ? `<span class="fb-note">${esc(w.note)}</span>` : ""}</span>
        <button class="btn primary" data-act="next">Continuar</button>`;
      fb.querySelector("button").focus();
    }
  }

  function next() {
    if (!session) return;
    clearTimeout(session.autoTimer);
    const step = session.def.steps[session.i];
    if (step.type === "intro") Memory.introduce(step.id);
    session.i++;
    // Out of questions: add another batch of the same kind, so play continues until you stop.
    if (session.i >= session.def.steps.length) {
      const more = Session.more(session.def);
      if (!more.length) return finish();
      more.forEach(st => { if (!(st.id in session.startStage)) session.startStage[st.id] = Memory.stage(st.id); });
      session.def.steps.push(...more);
    }
    A.render();
  }

  function finish() {
    const ids = session.touched.slice(-40);
    A.result = {
      eyebrow: session.def.title, back: `/${Banks.current}/vocab`,
      right: session.right, total: session.total,
      label: session.touched.length > 40 ? "Suas últimas 40 palavras" : "Palavras desta sessão",
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
      Match.start(kind, groupIds, title || (kind === "review" ? "Revisão" : "Palavras aleatórias"));
      return;
    }
    const def = kind === "new" ? Session.newWords()
      : kind === "review" ? Session.review()
      : kind === "groups" ? Session.groups(groupIds, title)
      : Session.random();
    startSession(def);
  }

  // ------------------------------------------------------------------ wiring

  A.route("/:bank/vocab", vocab);
  A.route("/:bank/vocab/groups", chooseGroups);
  A.route("/:bank/vocab/category", category);
  A.route("/play", playView);

  A.on("smart", el => {
    if (el.dataset.bank) Banks.set(el.dataset.bank);
    const def = Session.smart();
    if (def) startSession(def); else A.go(`/${Banks.current}/vocab`);
  });
  A.on("start", el => launch(el.dataset.kind));
  A.on("start-cat", el => { const g = groupById(el.dataset.group); launch("groups", [g.id], g.name); });
  A.on("start-groups", () => {
    const ids = [...document.querySelectorAll("#groups-form input:checked")].map(i => i.value);
    Store.state.settings.lastGroups = ids;
    Store.save();
    launch("groups", ids, ids.length === 1 ? groupById(ids[0]).name : "Grupos escolhidos");
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
    if (session && session.total) finish();
    else { session = null; A.back(`/${Banks.current}/vocab`); }
  });

  // Number keys 1-4 pick an answer; Enter continues. Handy on a laptop.
  A.onKey((e, r) => {
    if (r !== "/play" || !session) return;
    const opts = document.querySelectorAll(".opt, .opt-gap");
    if (/^[1-4]$/.test(e.key) && opts[+e.key - 1] && !session.answered) choose(opts[+e.key - 1]);
    else if (e.key === "Enter" && session.answered) { e.preventDefault(); next(); }
  });

  window.Vocab = { launch, wordRows, nextButtons, style };
}());
