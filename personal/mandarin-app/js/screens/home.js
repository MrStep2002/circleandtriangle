/* Home screen, the Essentials hub and the (coming soon) topic pages. */
(function () {
  const A = App;
  const W = () => Memory.WORDS;

  const TOPICS = [
    { id: "eating-out",     name: "Eating out",     sub: "Ordering, tastes, paying the bill" },
    { id: "lists",          name: "Lists",          sub: "Colours, days, months, numbers, time, the zodiac, countries" },
    { id: "work-study",     name: "Work & study",   sub: "Classroom commands, praise, homework, parents" },
    { id: "shopping",       name: "Shopping",       sub: "Prices, sizes, bargaining" },
    { id: "getting-around", name: "Getting around", sub: "Taxis, metro, directions" },
    { id: "home-family",    name: "Home & family",  sub: "People, rooms, daily routine" },
    { id: "weather",        name: "Weather",        sub: "Forecasts, hot and cold, what to wear" }
  ];

  function home() {
    Banks.set("essentials"); // the home card shows Essentials
    const c = Memory.counts();
    const due = Memory.dueWords().length;
    const fresh = Memory.newWords().length;
    const streak = Memory.streak();
    const todayCount = Store.state.days[Memory.today()] || 0;
    const met = W().length - c.new;
    const next = due ? A.plural(due, "word") + " to review" : (fresh ? "Next: " + Session.BATCH + " new words" : "All words met. Keep reviewing.");
    return {
      body: `
        <section class="hello">
          <p class="eyebrow">${streak ? A.plural(streak, "day") + " in a row" : "Start a streak today"}${todayCount ? " · " + A.plural(todayCount, "answer") + " today" : ""}</p>
        </section>

        ${window.Games ? Games.dailyButton() : ""}

        <section class="card essentials">
          <div class="ess-head">
            <div>
              <h2>Essentials</h2>
              <p class="muted">${W().length} words · the base for every topic</p>
            </div>
            <div class="bignum"><b>${c.known}</b><span>known</span></div>
          </div>
          ${A.stageBar(c)}
          ${A.stageLegend(c)}
          <div class="row2">
            <button class="btn primary" data-act="smart" data-bank="essentials">Continue<small>${next}</small></button>
            <button class="btn" data-act="go" data-to="/essentials">Open</button>
          </div>
          ${met === 0 ? `<p class="hint">New here? Tap Continue to learn your first ${Session.BATCH} words.</p>` : ""}
        </section>

        <h3 class="section-label">Topics <span>build on Essentials</span></h3>
        <section class="topics">
          ${TOPICS.map(t => {
            const bank = Banks.get(t.id);
            if (!bank) return `
            <button class="topic" data-act="go" data-to="/topic/${t.id}">
              <span class="topic-name">${t.name}</span>
              <span class="topic-sub">${t.sub}</span>
              <span class="soon">Coming soon</span>
            </button>`;
            const open = Banks.unlocked(t.id);
            const tc = Memory.counts(bank.words);
            return `
            <button class="topic live ${open ? "" : "locked"}" data-act="go" data-to="/${t.id}">
              <span class="topic-name">${t.name}</span>
              <span class="topic-sub">${t.sub}</span>
              ${open ? A.stageBar(tc) + `<span class="topic-meta">${tc.known} of ${bank.words.length} known · ${bank.words.length - tc.new} met</span>`
                     : `<span class="soon">Unlocks after Essentials</span>`}
            </button>`;
          }).join("")}
        </section>

        <p class="tones-legend" aria-label="Tone colours">
          <span class="t1">ā</span><span class="t2">á</span><span class="t3">ǎ</span><span class="t4">à</span><span class="t5">a</span>
          <span class="muted">tone colours</span>
        </p>`
    };
  }

  // The hub for Essentials or a topic: Continue, Vocab, Sentences, Games, Word Bank.
  function hub(rest, bankId) {
    const bank = Banks.bank();
    if (!Banks.unlocked(bank.id)) return locked(bank);
    const c = Memory.counts();
    const due = Memory.dueWords().length;
    const fresh = Memory.newWords().length;
    const parts = [];
    if (due) parts.push(A.plural(due, "review"));
    if (fresh && due < 6) parts.push(Session.BATCH + " new words");
    const s = Sentences.summary();
    const sentSub = s.unlocked
      ? `${s.unlocked} of ${s.total} unlocked${s.due ? " · " + s.due + " due" : ""}`
      : "Unlocks as you learn words";
    return {
      title: bank.name, back: "/",
      body: `
        <section class="card">
          <div class="ess-head">
            <div><h2>${c.known} of ${W().length} known</h2><p class="muted">${W().length - c.new} met so far</p></div>
          </div>
          ${A.stageBar(c)}
          ${A.stageLegend(c)}
          <button class="btn primary wide" data-act="smart" data-bank="${bank.id}">Continue<small>${parts.length ? parts.join(" · ") : "Nothing due right now"}</small></button>
        </section>

        <nav class="tiles">
          <button class="tile" data-act="go" data-to="/${Banks.current}/vocab">
            <span class="tile-name">Vocab</span>
            <span class="tile-sub">Learn new words and test the ones you know</span>
            ${A.ICON.chevron}
          </button>
          <button class="tile" data-act="go" data-to="/${Banks.current}/sentences">
            <span class="tile-name">Sentences</span>
            <span class="tile-sub">${bank.topic ? "Mix these words with your Essentials" : "Build sentences from your Essentials words"} · ${sentSub}</span>
            ${A.ICON.chevron}
          </button>
        </nav>
        ${window.Games ? Games.gridHtml() : ""}

        <button class="rowlink" data-act="go" data-to="/${Banks.current}/words">
          <span><b>Word Bank</b><span class="muted">All ${W().length} words and how well you know each one</span></span>${A.ICON.chevron}
        </button>`
    };
  }

  function locked(bank) {
    const left = window.ESSENTIALS.WORDS.filter(w => !Memory.isIntro(w.id)).length;
    return {
      title: bank.name, back: "/",
      body: `
        <section class="card soon-card">
          <h2>${bank.name}</h2>
          <p class="muted">${bank.sub}</p>
          <p>Topics build on Essentials. This one opens once you've met every Essentials word. ${A.plural(left, "word")} to go.</p>
          <button class="btn primary wide" data-act="smart" data-bank="essentials">Continue Essentials</button>
        </section>`
    };
  }

  function topic(id) {
    const t = TOPICS.find(x => x.id === id);
    return {
      title: t ? t.name : "Topic", back: "/",
      body: `
        <section class="card soon-card">
          <h2>${t ? t.name : "Topic"}</h2>
          <p class="muted">${t ? t.sub : ""}</p>
          <p>This topic will have the same three parts as Essentials, using its own words alongside the Essentials bank:</p>
          <ul class="plain-list"><li><b>Vocab</b> learn and test the topic's words</li><li><b>Sentences</b> build them into sentences</li><li><b>Games</b> races and challenges</li></ul>
          <p class="muted">Coming soon.</p>
        </section>`
    };
  }

  A.route("/", home);
  A.route("/:bank", hub);
  A.route("/topic/*", topic);
}());
