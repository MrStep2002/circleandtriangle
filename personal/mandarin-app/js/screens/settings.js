/* Settings (tone colours, backup, install, reset) and the Word Bank. */
(function () {
  const A = App;
  const { esc } = A;
  const G = () => Banks.groups();
  const W = () => Memory.WORDS;

  // ------------------------------------------------------------------ Word Bank

  let bankFilter = "all";

  function wordBank() {
    const c = Memory.counts();
    const filters = ["all", "new", "learning", "familiar", "known"];
    return {
      title: "Word Bank", back: `/${Banks.current}`,
      body: `
        <div class="filters" role="tablist">
          ${filters.map(f => `<button class="chip ${bankFilter === f ? "on" : ""}" data-act="bank-filter" data-f="${f}" role="tab" aria-selected="${bankFilter === f}">
            ${f === "all" ? "All " + W().length : A.STAGE_LABEL[f] + " " + c[f]}</button>`).join("")}
        </div>
        ${G().map(g => {
          const ws = W().filter(w => w.group === g.id && (bankFilter === "all" || Memory.stage(w.id) === bankFilter));
          if (!ws.length) return "";
          return `<h3 class="section-label small">${g.parent ? g.parent + " · " : ""}${g.name}</h3>
            <ul class="bank">
              ${ws.map(w => `<li>
                <span class="bank-py">${A.wordLine(w)}<span class="say">${esc(w.say)}</span></span>
                <span class="bank-en">${esc(w.en)}</span>
                ${A.pill(Memory.stage(w.id))}
              </li>`).join("")}
            </ul>`;
        }).join("") || `<p class="empty">No words here yet.</p>`}`
    };
  }

  // ------------------------------------------------------------------ Settings

  function settings() {
    const s = Store.state;
    const ua = navigator.userAgent;
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    const wechat = /MicroMessenger/i.test(ua);
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let install;
    if (standalone) install = `<p>You're using the installed app.</p>`;
    else if (wechat) install = `<p>WeChat can't install apps. Tap <b>···</b> at the top right and choose <b>Open in browser</b>, then install from Safari or Chrome.</p>`;
    else if (A.installEvent) install = `<button class="btn primary wide" data-act="install">Install app</button>`;
    else if (ios) install = `<ol class="plain-list numbered"><li>Open this page in <b>Safari</b>.</li><li>Tap the <b>Share</b> button.</li><li>Choose <b>Add to Home Screen</b>.</li></ol>`;
    else install = `<p>In Chrome, open the <b>⋮</b> menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>`;

    return {
      title: "Settings", back: "/",
      body: `
        <section class="card setting">
          <label class="switch-row" for="tone-toggle">
            <span><b>Tone colours</b><span class="muted">Colour each syllable by its tone</span></span>
            <input type="checkbox" id="tone-toggle" ${s.settings.toneColours ? "checked" : ""}>
          </label>
          <p class="tones-legend left"><span class="t1">ā 1st</span><span class="t2">á 2nd</span><span class="t3">ǎ 3rd</span><span class="t4">à 4th</span><span class="t5">a neutral</span></p>
        </section>

        <section class="card setting">
          <span><b>Text size</b><span class="muted"> · for the whole app</span></span>
          <div class="textsize" role="radiogroup" aria-label="Text size">
            ${[["0.9", "Small"], ["1", "Standard"], ["1.15", "Large"], ["1.3", "Largest"]].map(([v, name]) => {
              const on = String(s.settings.textScale || 1) === v;
              return `<button class="chip ${on ? "on" : ""}" role="radio" aria-checked="${on}" aria-label="${name}" data-act="textsize" data-scale="${v}">A</button>`;
            }).join("")}
          </div>
        </section>

        <section class="card setting">
          <h2>Your progress</h2>
          <p class="muted">Progress is saved on this device. Save a backup file now and then: it's how you keep progress safe if the app is deleted, and how you move it to another phone.</p>
          <p class="small-print">Last backup: <b>${s.lastBackup ? new Date(s.lastBackup).toLocaleDateString() : "never"}</b> · <span id="persist-status">Checking storage…</span></p>
          <div class="row2">
            <button class="btn" data-act="backup">Save backup</button>
            <label class="btn" for="restore-file">Restore</label>
          </div>
          <input type="file" id="restore-file" accept="application/json,.json" hidden>
          <p class="notice" id="backup-msg" hidden></p>
        </section>

        <section class="card setting">
          <h2>Install on your phone</h2>
          ${install}
        </section>

        <section class="card setting danger-zone">
          <h2>Start again</h2>
          <p class="muted">Clears all progress on this device. Settings stay.</p>
          <button class="btn danger" data-act="reset-ask" id="reset-ask">Clear all progress</button>
          <div class="confirm" id="reset-confirm" hidden>
            <p><b>Clear everything?</b> This can't be undone unless you have a backup.</p>
            <div class="row2"><button class="btn" data-act="reset-cancel">Keep it</button><button class="btn danger" data-act="reset-do">Clear progress</button></div>
          </div>
        </section>

        <p class="small-print center">My Mandarin ${A.VERSION}</p>`,
      after() {
        document.getElementById("tone-toggle").addEventListener("change", e => {
          Store.state.settings.toneColours = e.target.checked;
          A.applySettings();
          Store.save();
        });
        document.getElementById("restore-file").addEventListener("change", async e => {
          const f = e.target.files[0];
          if (!f) return;
          const msg = document.getElementById("backup-msg");
          try {
            await Store.importText(await f.text());
            A.applySettings();
            msg.textContent = "Progress restored.";
            msg.className = "notice ok";
          } catch (err) {
            msg.textContent = err.message;
            msg.className = "notice bad";
          }
          msg.hidden = false;
          e.target.value = "";
        });
        Store.isPersisted().then(p => {
          const el = document.getElementById("persist-status");
          if (el) el.textContent = p ? "Storage protected" : "Storage not yet protected";
        });
      }
    };
  }

  async function doBackup() {
    const text = Store.exportText();
    const name = "my-mandarin-backup-" + Memory.today() + ".json";
    const msg = document.getElementById("backup-msg");
    try {
      const file = new File([text], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "My Mandarin backup" });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
      if (msg) { msg.textContent = "Backup saved as " + name + "."; msg.className = "notice ok"; msg.hidden = false; }
    } catch (err) {
      if (msg && err.name !== "AbortError") { msg.textContent = "Couldn't save the file here. Try again from the installed app or another browser."; msg.className = "notice bad"; msg.hidden = false; }
    }
  }

  A.route("/:bank/words", wordBank);
  // Text size: applies at once and is remembered.
  A.on("textsize", el => {
    Store.state.settings.textScale = +el.dataset.scale;
    Store.save();
    A.applySettings();
    A.render();
  });
  A.route("/settings", settings);
  A.on("bank-filter", el => { bankFilter = el.dataset.f; A.render(); });
  A.on("backup", doBackup);
  A.on("install", () => {
    const ev = A.installEvent;
    if (!ev) return;
    ev.prompt();
    ev.userChoice.finally(() => { A.installEvent = null; A.render(); });
  });
  A.on("reset-ask", el => { document.getElementById("reset-confirm").hidden = false; el.hidden = true; });
  A.on("reset-cancel", () => { document.getElementById("reset-confirm").hidden = true; document.getElementById("reset-ask").hidden = false; });
  A.on("reset-do", () => { Store.reset().then(() => A.go("/")); });
}());
