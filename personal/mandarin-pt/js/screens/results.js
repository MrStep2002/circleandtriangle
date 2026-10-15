/* The results screen shown at the end of any session.

   A session fills in App.result and then goes to #/done:
     { eyebrow, right, total, label, rows, buttons, back }, plus optional big and line
     to replace the percentage and the "x of y" line (the Speed round shows its score). */
(function () {
  const A = App;

  function done() {
    const r = A.result;
    if (!r) return null;
    const pct = r.total ? Math.round((r.right / r.total) * 100) : 0;
    return {
      title: "Sessão concluída", back: r.back,
      body: `
        <section class="card result">
          <p class="eyebrow">${A.esc(r.eyebrow)}</p>
          <div class="bigpct">${r.big != null ? A.esc(r.big) : pct + "%"}</div>
          <p class="muted">${r.line != null ? A.esc(r.line) : `${r.right} de ${r.total} certas de primeira`}</p>
          <div class="meter"><span style="width:${pct}%"></span></div>
        </section>
        ${r.rows ? `<h3 class="section-label small">${r.label}</h3><ul class="bank">${r.rows}</ul>` : ""}
        <div class="actions stack">${r.buttons}</div>`
    };
  }

  A.route("/done", done);
}());
