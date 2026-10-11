/* The app's core: navigation, shared helpers and the one click handler.

   The app is a single page. The part of the address after # says which screen to show
   (#/essentials/vocab and so on), so the phone's back gesture works as expected.

   Each area of the app lives in its own file in js/screens/ and plugs in here with:
     App.route("/some/path", viewFunction)   a screen
     App.on("action-name", handler)          what a button with data-act="action-name" does
     App.onKey(handler)                      keyboard shortcuts
   A view function returns { title, back, body, cls, bar, after }. */
(function () {
  const { html: py, esc } = Pinyin;
  const VERSION = "0.13.0";

  const ICON = {
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const STAGE_LABEL = { new: "New", learning: "Learning", familiar: "Familiar", known: "Known" };

  const root = document.getElementById("app");
  const routes = [];
  const actions = {};
  const keyHandlers = [];
  let installEvent = null;

  // ------------------------------------------------------------------ shared helpers

  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }

  function wordLine(w) { return `<span class="py">${py(w.py)}</span>`; }

  function stageBar(c) {
    const seg = k => c[k] ? `<span class="seg ${k}" style="flex:${c[k]}"></span>` : "";
    return `<div class="stagebar" role="img" aria-label="${c.known} known, ${c.familiar} familiar, ${c.learning} learning, ${c.new} new">
      ${seg("known")}${seg("familiar")}${seg("learning")}${seg("new")}</div>`;
  }

  function stageLegend(c) {
    return `<div class="legend">${["known", "familiar", "learning", "new"].map(k =>
      `<span><i class="dot ${k}"></i>${c[k]} ${STAGE_LABEL[k].toLowerCase()}</span>`).join("")}</div>`;
  }

  function pill(stage) { return `<span class="pill ${stage}">${STAGE_LABEL[stage]}</span>`; }

  function timeUntil(t) {
    const ms = t - Date.now();
    if (ms <= 0) return "now";
    const min = Math.round(ms / 60000);
    if (min < 60) return "in " + plural(min, "minute");
    const h = Math.round(min / 60);
    if (h < 24) return "in " + plural(h, "hour");
    return "in " + plural(Math.round(h / 24), "day");
  }

  function noteHtml(w) { return w.note ? `<p class="note">${esc(w.note)}</p>` : ""; }

  function vibrate(ms) { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

  // The bar at the top of an endless session: stop button and a live score.
  function scoreBar(quitAct, right, total) {
    return `<header class="sessionbar">
      <button class="iconbtn" data-act="${quitAct}" aria-label="Stop and see results">${ICON.close}</button>
      <div class="scoremeter" aria-hidden="true"><span id="score-fill" style="width:${total ? Math.round(right / total * 100) : 0}%"></span></div>
      <span class="score" id="score-text">${scoreText(right, total)}</span>
    </header>`;
  }
  function scoreText(right, total) {
    return total ? `<b>${Math.round(right / total * 100)}%</b><small>${right}/${total}</small>` : `<b>–</b><small>0/0</small>`;
  }
  // Update the score without redrawing the screen.
  function updateScore(right, total) {
    const fill = document.getElementById("score-fill");
    const text = document.getElementById("score-text");
    if (fill) fill.style.width = (total ? Math.round(right / total * 100) : 0) + "%";
    if (text) text.innerHTML = scoreText(right, total);
  }

  // ------------------------------------------------------------------ navigation

  const navStack = [];

  function currentRoute() { return (location.hash || "#/").slice(1) || "/"; }
  function go(route) { location.hash = route; }
  function replace(route) { location.replace("#" + route); }

  function back(parent) {
    if (navStack.length > 1) history.back();
    else replace(parent);
  }

  window.addEventListener("hashchange", () => {
    const r = currentRoute();
    if (navStack.length > 1 && navStack[navStack.length - 2] === r) navStack.pop();
    else navStack.push(r);
    render();
  });

  function shell(view) {
    const top = view.bar === "session" ? "" : `
      <header class="topbar">
        ${view.back ? `<button class="iconbtn" data-act="back" data-to="${view.back}" aria-label="Back">${ICON.back}</button>` : `<span class="brand">My Mandarin</span>`}
        ${view.back ? `<h1 class="toptitle">${view.title}</h1>` : ""}
        ${view.back ? `<span class="iconbtn ghost" aria-hidden="true"></span>` : `<button class="iconbtn" data-act="go" data-to="/settings" aria-label="Settings">${ICON.gear}</button>`}
      </header>`;
    root.innerHTML = top + `<main class="screen ${view.cls || ""}">${view.body}</main>`;
    document.title = view.back ? view.title + " · My Mandarin" : "My Mandarin";
    if (view.after) view.after();
    window.scrollTo(0, 0);
  }

  // A route is a path pattern. ":bank" matches a word bank (essentials, eating-out…) and
  // switches the app to it; a trailing "*" matches the rest of the address.
  //   App.route("/:bank/vocab", view)   →  view() runs with that bank selected
  //   App.route("/topic/*", view)       →  view(rest)
  function route(path, view) {
    const names = [];
    const rx = new RegExp("^" + path
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/:bank/g, () => { names.push("bank"); return "([a-z0-9-]+)"; })
      .replace(/\*$/, () => { names.push("rest"); return "(.*)"; }) + "$");
    routes.push({ rx, names, view });
  }

  function render() {
    const r = currentRoute();
    let view = null;
    for (const rt of routes) {
      const m = r.match(rt.rx);
      if (!m) continue;
      const args = {};
      rt.names.forEach((n, i) => { args[n] = m[i + 1]; });
      if (args.bank) {
        if (!Banks.get(args.bank)) continue;
        Banks.set(args.bank);
      }
      view = rt.view(args.rest, args.bank);
      if (view) break;
    }
    if (!view) { replace("/"); return; }
    shell(view);
  }

  // ------------------------------------------------------------------ actions

  function on(name, fn) { actions[name] = fn; }
  function onKey(fn) { keyHandlers.push(fn); }

  root.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.act];
    if (fn) fn(el, e);
  });

  document.addEventListener("keydown", e => { keyHandlers.forEach(fn => fn(e, currentRoute())); });

  on("go", el => go(el.dataset.to));
  on("go-replace", el => replace(el.dataset.to));
  on("back", el => back(el.dataset.to));

  // ------------------------------------------------------------------ settings & install

  function applySettings() {
    document.documentElement.classList.toggle("no-tones", !Store.state.settings.toneColours);
    document.documentElement.style.setProperty("--scale", Store.state.settings.textScale || 1);
  }

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    installEvent = e;
    if (currentRoute() === "/settings") render();
  });

  function start() {
    Store.init().then(() => {
      applySettings();
      navStack.push(currentRoute());
      render();
    });
  }

  window.App = {
    VERSION, ICON, STAGE_LABEL,
    py, esc, plural, wordLine, stageBar, stageLegend, pill, timeUntil, noteHtml, vibrate, scoreBar, updateScore,
    route, on, onKey, go, back, replace, render, currentRoute, applySettings, start,
    get installEvent() { return installEvent; },
    set installEvent(v) { installEvent = v; },
    result: null   // the summary shown on the results screen
  };
}());
