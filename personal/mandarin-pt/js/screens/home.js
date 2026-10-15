/* Tela inicial e o painel do Essencial (versão em português, só vocabulário). */
(function () {
  const A = App;
  const W = () => Memory.WORDS;

  function home() {
    Banks.set("essentials");
    const c = Memory.counts();
    const due = Memory.dueWords().length;
    const fresh = Memory.newWords().length;
    const streak = Memory.streak();
    const todayCount = Store.state.days[Memory.today()] || 0;
    const met = W().length - c.new;
    const next = due ? A.plural(due, "palavra") + " para revisar"
      : (fresh ? "Próximo: " + Session.BATCH + " palavras novas" : "Você já viu todas. Continue revisando.");
    return {
      body: `
        <section class="hello">
          <p class="eyebrow">${streak ? A.plural(streak, "dia") + " seguidos" : "Comece uma sequência hoje"}${todayCount ? " · " + A.plural(todayCount, "resposta") + " hoje" : ""}</p>
        </section>

        <section class="card essentials">
          <div class="ess-head">
            <div>
              <h2>Essencial</h2>
              <p class="muted">${W().length} palavras · a base do chinês do dia a dia</p>
            </div>
            <div class="bignum"><b>${c.known}</b><span>dominadas</span></div>
          </div>
          ${A.stageBar(c)}
          ${A.stageLegend(c)}
          <button class="btn primary wide" data-act="smart" data-bank="essentials">Continuar<small>${next}</small></button>
          ${met === 0 ? `<p class="hint">Primeira vez? Toque em Continuar para aprender suas primeiras ${Session.BATCH} palavras.</p>` : ""}
        </section>

        <nav class="tiles">
          <button class="tile" data-act="go" data-to="/essentials/vocab">
            <span class="tile-name">Praticar vocabulário</span>
            <span class="tile-sub">Palavras novas, revisão, grupos e Combinar rápido</span>
            ${A.ICON.chevron}
          </button>
        </nav>

        <button class="rowlink" data-act="go" data-to="/essentials/words">
          <span><b>Banco de palavras</b><span class="muted">Todas as ${W().length} palavras e o quanto você sabe cada uma</span></span>${A.ICON.chevron}
        </button>

        <p class="tones-legend" aria-label="Cores dos tons">
          <span class="t1">ā</span><span class="t2">á</span><span class="t3">ǎ</span><span class="t4">à</span><span class="t5">a</span>
          <span class="muted">cores dos tons</span>
        </p>`
    };
  }

  // Só existe o Essencial nesta versão: o "painel" volta para a tela inicial.
  function hub() { A.replace("/"); return { body: "" }; }

  A.route("/", home);
  A.route("/:bank", hub);
}());
