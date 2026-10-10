/* The memory store: one saved record holding all progress and settings.

   Saved in the browser's database (IndexedDB), with a second copy in localStorage
   in case one of them is cleared. Backup/Restore moves it in and out of a file. */
(function () {
  const DB_NAME = "my-mandarin";
  const DB_STORE = "kv";
  const KEY = "state";
  const LS_KEY = "myMandarinStateV1";

  function blankState() {
    return {
      version: 1,
      created: Date.now(),
      words: {},            // id -> { intro, m: {b, due, r, w}, c: {b, due, r, w} }
      patterns: {},         // sentence pattern id -> { intro, b, due, r, w }
      days: {},             // "2026-10-10" -> number of answers that day
      settings: { toneColours: true },
      lastBackup: null
    };
  }

  let db = null;
  let state = blankState();
  let saveTimer = null;

  function openDb() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }

  function idbGet() {
    return new Promise((resolve) => {
      if (!db) return resolve(null);
      try {
        const req = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).get(KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }

  function idbPut(value) {
    return new Promise((resolve) => {
      if (!db) return resolve(false);
      try {
        const tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).put(value, KEY);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  }

  function lsGet() {
    try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }
  function lsPut(value) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  function normalise(s) {
    const base = blankState();
    if (!s || typeof s !== "object" || typeof s.words !== "object") return base;
    return {
      ...base, ...s,
      settings: { ...base.settings, ...(s.settings || {}) },
      days: s.days || {},
      words: s.words || {},
      patterns: s.patterns || {}
    };
  }

  // Count of answers is a cheap "how much progress is in here" measure, used to pick
  // the fuller copy if IndexedDB and localStorage ever disagree.
  function weight(s) {
    if (!s || !s.days) return -1;
    return Object.values(s.days).reduce((a, b) => a + b, 0);
  }

  async function init() {
    db = await openDb();
    const fromDb = await idbGet();
    const fromLs = lsGet();
    const best = weight(fromDb) >= weight(fromLs) ? fromDb : fromLs;
    state = normalise(best);
    return state;
  }

  function saveNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    const copy = JSON.parse(JSON.stringify(state));
    lsPut(copy);
    return idbPut(copy);
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 250);
  }

  // Ask the browser not to clear our data when space is low.
  async function requestPersist() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        if (await navigator.storage.persisted()) return true;
        return await navigator.storage.persist();
      }
    } catch (e) { /* not supported */ }
    return false;
  }

  async function isPersisted() {
    try { if (navigator.storage && navigator.storage.persisted) return await navigator.storage.persisted(); }
    catch (e) {}
    return false;
  }

  function exportText() {
    state.lastBackup = Date.now();
    saveNow();
    return JSON.stringify({ app: "my-mandarin", exported: new Date().toISOString(), state }, null, 1);
  }

  function importText(text) {
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { throw new Error("That file isn't a My Mandarin backup."); }
    const s = parsed && parsed.app === "my-mandarin" ? parsed.state : null;
    if (!s || typeof s.words !== "object") throw new Error("That file isn't a My Mandarin backup.");
    state = normalise(s);
    return saveNow();
  }

  function reset() {
    const keepSettings = state.settings;
    state = blankState();
    state.settings = keepSettings;
    return saveNow();
  }

  // Save straight away if the app is being closed or hidden.
  document.addEventListener("visibilitychange", () => { if (document.hidden && saveTimer) saveNow(); });
  window.addEventListener("pagehide", () => { if (saveTimer) saveNow(); });

  window.Store = {
    init, save, saveNow, requestPersist, isPersisted, exportText, importText, reset,
    get state() { return state; }
  };
}());
