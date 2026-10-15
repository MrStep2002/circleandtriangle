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
      title: "Banco de palavras", back: `/${Banks.current}`,
      body: `
        <div class="filters" role="tablist">
          ${filters.map(f => `<button class="chip ${bankFilter === f ? "on" : ""}" data-act="bank-filter" data-f="${f}" role="tab" aria-selected="${bankFilter === f}">
            ${f === "all" ? "Todas " + W().length : { new: "Novas", learning: "Aprendendo", familiar: "Familiares", known: "Dominadas" }[f] + " " + c[f]}</button>`).join("")}
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
        }).join("") || `<p class="empty">Nenhuma palavra aqui ainda.</p>`}`
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
    if (standalone) install = `<p>Você já está usando o app instalado.</p>`;
    else if (wechat) install = `<p>O WeChat não instala apps. Toque em <b>···</b> no canto superior direito, escolha <b>Abrir no navegador</b> e instale pelo Safari ou Chrome.</p>`;
    else if (A.installEvent) install = `<button class="btn primary wide" data-act="install">Instalar app</button>`;
    else if (ios) install = `<ol class="plain-list numbered"><li>Abra esta página no <b>Safari</b>.</li><li>Toque no botão <b>Compartilhar</b>.</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li></ol>`;
    else install = `<p>No Chrome, abra o menu <b>⋮</b> e escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</p>`;

    return {
      title: "Configurações", back: "/",
      body: `
        <section class="card setting">
          <label class="switch-row" for="tone-toggle">
            <span><b>Cores dos tons</b><span class="muted">Cada sílaba com a cor do seu tom</span></span>
            <input type="checkbox" id="tone-toggle" ${s.settings.toneColours ? "checked" : ""}>
          </label>
          <p class="tones-legend left"><span class="t1">ā 1º</span><span class="t2">á 2º</span><span class="t3">ǎ 3º</span><span class="t4">à 4º</span><span class="t5">a neutro</span></p>
        </section>

        <section class="card setting">
          <span><b>Tamanho do texto</b><span class="muted"> · para o app inteiro</span></span>
          <div class="textsize" role="radiogroup" aria-label="Tamanho do texto">
            ${[["0.9", "Pequeno"], ["1", "Normal"], ["1.15", "Grande"], ["1.3", "Maior"]].map(([v, name]) => {
              const on = String(s.settings.textScale || 1) === v;
              return `<button class="chip ${on ? "on" : ""}" role="radio" aria-checked="${on}" aria-label="${name}" data-act="textsize" data-scale="${v}">A</button>`;
            }).join("")}
          </div>
        </section>

        <section class="card setting">
          <h2>Seu progresso</h2>
          <p class="muted">O progresso fica salvo neste aparelho. Salve um backup de vez em quando: assim você não perde nada se o app for apagado e pode passar o progresso para outro celular.</p>
          <p class="small-print">Último backup: <b>${s.lastBackup ? new Date(s.lastBackup).toLocaleDateString("pt-BR") : "nunca"}</b> · <span id="persist-status">Verificando o armazenamento…</span></p>
          <div class="row2">
            <button class="btn" data-act="backup">Salvar backup</button>
            <label class="btn" for="restore-file">Restaurar</label>
          </div>
          <input type="file" id="restore-file" accept="application/json,.json" hidden>
          <p class="notice" id="backup-msg" hidden></p>
        </section>

        <section class="card setting">
          <h2>Instalar no celular</h2>
          ${install}
        </section>

        <section class="card setting danger-zone">
          <h2>Começar de novo</h2>
          <p class="muted">Apaga todo o progresso neste aparelho. As configurações continuam.</p>
          <button class="btn danger" data-act="reset-ask" id="reset-ask">Apagar todo o progresso</button>
          <div class="confirm" id="reset-confirm" hidden>
            <p><b>Apagar tudo?</b> Não dá para desfazer, a não ser que você tenha um backup.</p>
            <div class="row2"><button class="btn" data-act="reset-cancel">Manter</button><button class="btn danger" data-act="reset-do">Apagar progresso</button></div>
          </div>
        </section>

        <p class="small-print center">Meu Mandarim ${A.VERSION}</p>`,
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
            msg.textContent = "Progresso restaurado.";
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
          if (el) el.textContent = p ? "Armazenamento protegido" : "Armazenamento ainda não protegido";
        });
      }
    };
  }

  async function doBackup() {
    const text = Store.exportText();
    const name = "meu-mandarim-backup-" + Memory.today() + ".json";
    const msg = document.getElementById("backup-msg");
    try {
      const file = new File([text], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Backup do Meu Mandarim" });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
      if (msg) { msg.textContent = "Backup salvo como " + name + "."; msg.className = "notice ok"; msg.hidden = false; }
    } catch (err) {
      if (msg && err.name !== "AbortError") { msg.textContent = "Não foi possível salvar o arquivo aqui. Tente pelo app instalado ou outro navegador."; msg.className = "notice bad"; msg.hidden = false; }
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
