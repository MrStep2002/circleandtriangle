/* Home screen, the Essentials hub and the (coming soon) topic pages. */
(function () {
  const A = App;
  const WORDS = Memory.WORDS;

  const TOPICS = [
    { id: "eating-out",     name: "Eating out",     sub: "Ordering, tastes, paying the bill" },
    { id: "shopping",       name: "Shopping",       sub: "Prices, sizes, bargaining" },
    { id: "getting-around", name: "Getting around", sub: "Taxis, metro, directions" },
    { id: "home-family",    name: "Home & family",  sub: "People, rooms, daily routine" },
    { id: "work-study",     name: "Work & study",   sub: "Classroom and office words" },
    { id: "weather-time",   name: "Weather & time", sub: "Days, seasons, telling the time" }
  ];

  function home() {
    const c = Memory.counts();
    const due = Memory.dueWords().length;
    const fresh = Memory.newWords().length;
    const streak = Memory.streak();
    const todayCount = Store.state.days[Memory.today()] || 0;
    const met = WORDS.length - c.new;
    const next = due ? A.plural(due, "word") + " to review" : (fresh ? "Next: " + Session.BATCH + " new words" : "All words met. Keep reviewing.");
    return {
      body: `
        <section class="hello">
          <p class="eyebrow">${streak ? A.plural(streak, "day") + " in a row" : "Start a streak today"}${todayCount ? " · " + A.plural(todayCount, "answer") + " today" : ""}</p>
        </section>

        <section class="card essentials">
          <div class="ess-head">
            <div>
              <h2>Essentials</h2>
              <p class="muted">${WORDS.length} words · the base for every topic</p>
            </div>
            <div class="bignum"><b>${c.known}</b><span>known</span></div>
          </div>
          ${A.stageBar(c)}
          ${A.stageLegend(c)}
          <div class="row2">
            <button class="btn primary" data-act="smart">Continue<small>${next}</small></button>
            <button class="btn" data-act="go" data-to="/essentials">Open</button>
          </div>
          ${met === 0 ? `<p class="hint">New here? Tap Continue to learn your first ${Session.BATCH} words.</p>` : ""}
        </section>

        <h3 class="section-label">Topics <span>build on Essentials</span></h3>
        <section class="topics">
          ${TOPICS.map(t => `
            <button class="topic" data-act="go" data-to="/topic/${t.id}">
              <span class="topic-name">${t.name}</span>
              <span class="topic-sub">${t.sub}</span>
              <span class="soon">Coming soon</span>
            </button>`).join("")}
        </section>

        <p class="tones-legend" aria-label="Tone colours">
          <span class="t1">ā</span><span class="t2">á</span><span class="t3">ǎ</span><span class="t4">à</span><span class="t5">a</span>
          <span class="muted">tone colours</span>
        </p>`
    };
  }

  function essentials() {
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
      title: "Essentials", back: "/",
      body: `
        <section class="card">
          <div class="ess-head">
            <div><h2>${c.known} of ${WORDS.length} known</h2><p class="muted">${WORDS.length - c.new} met so far</p></div>
          </div>
          ${A.stageBar(c)}
          ${A.stageLegend(c)}
          <button class="btn primary wide" data-act="smart">Continue<small>${parts.length ? parts.join(" · ") : "Nothing due right now"}</small></button>
        </section>

        <nav class="tiles">
          <button class="tile" data-act="go" data-to="/essentials/vocab">
            <span class="tile-name">Vocab</span>
            <span class="tile-sub">Learn new words and test the ones you know</span>
            ${A.ICON.chevron}
          </button>
          <button class="tile" data-act="go" data-to="/essentials/sentences">
            <span class="tile-name">Sentences</span>
            <span class="tile-sub">Build sentences from your Essentials words · ${sentSub}</span>
            ${A.ICON.chevron}
          </button>
          <button class="tile off" disabled>
            <span class="tile-name">Games</span>
            <span class="tile-sub">Races and challenges against the clock</span>
            <span class="soon">Coming next</span>
          </button>
        </nav>

        <button class="rowlink" data-act="go" data-to="/essentials/words">
          <span><b>Word Bank</b><span class="muted">All ${WORDS.length} words and how well you know each one</span></span>${A.ICON.chevron}
        </button>`
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
  A.route("/essentials", essentials);
  A.route("/topic/*", topic);
}());
