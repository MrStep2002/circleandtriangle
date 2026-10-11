/* The results screen shown at the end of any session.

   A session fills in App.result and then goes to #/done:
     { eyebrow, right, total, label, rows, buttons, back } */
(function () {
  const A = App;

  function done() {
    const r = A.result;
    if (!r) return null;
    const pct = r.total ? Math.round((r.right / r.total) * 100) : 0;
    return {
      title: "Session complete", back: r.back,
      body: `
        <section class="card result">
          <p class="eyebrow">${A.esc(r.eyebrow)}</p>
          <div class="bigpct">${pct}%</div>
          <p class="muted">${r.right} of ${r.total} right first time</p>
          <div class="meter"><span style="width:${pct}%"></span></div>
        </section>
        ${r.rows ? `<h3 class="section-label small">${r.label}</h3><ul class="bank">${r.rows}</ul>` : ""}
        <div class="actions stack">${r.buttons}</div>`
    };
  }

  A.route("/done", done);
}());
