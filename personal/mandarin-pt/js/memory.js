/* How the app decides what you know.

   Each word has two skills:
     m = meaning (see pinyin -> pick English)
     c = recall  (see English -> pick pinyin)
   Each skill sits in a box 0-5. Right answer: up one box. Wrong: back to box 1.
   The box sets when it's next due for review. */
(function () {
  const MIN = 60 * 1000, DAY = 24 * 60 * MIN;
  const GAP = [0, 10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 21 * DAY];
  const MAX_BOX = GAP.length - 1;

  // The words of the bank you're in (Essentials or a topic). Records cover every word.
  const W = () => Banks.words();
  const BY_ID = Banks.BY_ID;

  function rec(id) { return Store.state.words[id] || null; }

  function ensure(id) {
    const s = Store.state.words;
    if (!s[id]) s[id] = { intro: 0, m: { b: 0, due: 0, r: 0, w: 0 }, c: { b: 0, due: 0, r: 0, w: 0 } };
    return s[id];
  }

  function isIntro(id) { const r = rec(id); return !!(r && r.intro); }

  function introduce(id) {
    const r = ensure(id);
    if (!r.intro) { r.intro = Date.now(); Store.save(); }
  }

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function stage(id) {
    const r = rec(id);
    if (!r || !r.intro) return "new";
    const low = Math.min(r.m.b, r.c.b);
    if (low >= 4) return "known";
    if (low >= 2) return "familiar";
    return "learning";
  }

  // Record an answer. Returns the stage before and after.
  function answer(id, skill, correct) {
    const r = ensure(id);
    if (!r.intro) r.intro = Date.now();
    const before = stage(id);
    bump(r[skill], correct);
    countToday();
    Store.save();
    return { before, after: stage(id) };
  }

  // Move one skill record ({ b, due, r, w }) up or down a box. Also used for sentence patterns.
  function bump(s, correct) {
    const now = Date.now();
    if (correct) {
      s.r++;
      // Practising something that isn't due yet still counts, but only moves it up
      // while it's in the early boxes. Stops one long session from marking it "known".
      if (s.due <= now || s.b < 2) s.b = Math.min(MAX_BOX, s.b + 1);
      s.due = now + GAP[s.b];
    } else {
      s.w++;
      s.b = 1;
      s.due = now + GAP[1];
    }
  }

  function countToday() {
    const t = today();
    Store.state.days[t] = (Store.state.days[t] || 0) + 1;
  }

  // Which skill of this word is due now (the weaker one if both), or null.
  function dueSkill(id, now) {
    const r = rec(id);
    if (!r || !r.intro) return null;
    now = now || Date.now();
    const m = r.m.due <= now, c = r.c.due <= now;
    if (m && c) return r.m.b <= r.c.b ? "m" : "c";
    if (m) return "m";
    if (c) return "c";
    return null;
  }

  function dueWords(now) {
    now = now || Date.now();
    return W().filter(w => dueSkill(w.id, now))
      .sort((a, b) => strength(a.id) - strength(b.id));
  }

  function nextDue() {
    let soonest = Infinity;
    W().forEach(w => {
      const r = rec(w.id);
      if (r && r.intro) soonest = Math.min(soonest, r.m.due, r.c.due);
    });
    return soonest;
  }

  // Lower = weaker. Used to choose which words need the most practice.
  function strength(id) {
    const r = rec(id);
    if (!r || !r.intro) return -1;
    return r.m.b + r.c.b - (r.m.w + r.c.w) * 0.1;
  }

  function weakerSkill(id) {
    const r = rec(id);
    if (!r) return "m";
    return r.m.b <= r.c.b ? "m" : "c";
  }

  function newWords() { return W().filter(w => !isIntro(w.id)); }

  function counts(words) {
    const out = { new: 0, learning: 0, familiar: 0, known: 0 };
    (words || W()).forEach(w => out[stage(w.id)]++);
    return out;
  }

  // Number of days in a row with at least one answer, ending today or yesterday.
  function streak() {
    const days = Store.state.days;
    let n = 0;
    const d = new Date();
    const key = x => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
    if (!days[key(d)]) d.setDate(d.getDate() - 1);
    while (days[key(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  window.Memory = {
    get WORDS() { return W(); }, BY_ID, rec, isIntro, introduce, stage, answer, dueSkill, dueWords,
    nextDue, strength, weakerSkill, newWords, counts, streak, today, bump, countToday
  };
}());
