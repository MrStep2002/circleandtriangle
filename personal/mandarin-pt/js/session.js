/* Builds practice sessions: a queue of steps for the player to work through.

   Step types:
     intro    teach a new word (card with pinyin, sounds-like, English)
     meaning  pinyin shown -> pick the English        (skill m)
     recall   English shown -> pick the pinyin        (skill c)
     flash    pinyin shown -> reveal -> "knew it?"   (skill m, self-marked)
     gap      a sentence with the word missing -> pick it (skill c) */
(function () {
  const W = () => Memory.WORDS; // the current bank's words
  const BATCH = 4;

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // A question step for a word that's already been introduced, picking the skill
  // that needs it most, with some variety once the word is settling in.
  function practiceStep(w, preferSkill) {
    const skill = preferSkill || Memory.weakerSkill(w.id);
    const r0 = Memory.rec(w.id);
    if (skill === "c") {
      // Once a word is settling in, sometimes test it inside a sensible sentence instead.
      if (r0 && r0.c.b >= 2 && window.Sentences && Sentences.canGap(w.id) && Math.random() < .35) return { type: "gap", id: w.id };
      return { type: "recall", id: w.id };
    }
    const r = Memory.rec(w.id);
    if (r && r.m.b >= 3 && Math.random() < 0.35) return { type: "flash", id: w.id };
    return { type: "meaning", id: w.id };
  }

  // ---- Session builders ----

  function newWords() {
    const batch = Memory.newWords().slice(0, BATCH);
    if (!batch.length) return null;
    const steps = [];
    batch.forEach(w => steps.push({ type: "intro", id: w.id }));
    shuffle(batch).forEach(w => steps.push({ type: "meaning", id: w.id }));
    shuffle(batch).forEach(w => steps.push({ type: "recall", id: w.id }));
    // Mix in a few older words so new ones are tested alongside them.
    const batchIds = new Set(batch.map(w => w.id));
    const older = W().filter(w => Memory.isIntro(w.id) && !batchIds.has(w.id));
    const due = Memory.dueWords().filter(w => !batchIds.has(w.id));
    const extra = (due.length ? due : older.sort((a, b) => Memory.strength(a.id) - Memory.strength(b.id))).slice(0, 4);
    shuffle(extra).forEach(w => steps.push(practiceStep(w, Memory.dueSkill(w.id))));
    return { kind: "new", title: "Palavras novas", steps };
  }

  function review(limit) {
    const due = Memory.dueWords().slice(0, limit || 12);
    if (!due.length) return null;
    return { kind: "review", title: "Revisão", steps: shuffle(due).map(w => practiceStep(w, Memory.dueSkill(w.id))) };
  }

  // Practice from a pool of words (Random, Choose groups, By category).
  function fromPool(pool, title, size) {
    size = size || 10;
    // Words you've met fill the session; at most one batch of unmet words is
    // introduced, so you're never taught more than 4 new words at once.
    const met = shuffle(pool.filter(w => Memory.isIntro(w.id)));
    const unmet = pool.filter(w => !Memory.isIntro(w.id)).slice(0, BATCH);
    const picked = shuffle(met.slice(0, Math.max(size - unmet.length, 0)).concat(unmet));
    if (!picked.length) return null;
    const steps = [];
    picked.forEach(w => {
      if (!Memory.isIntro(w.id)) {
        steps.push({ type: "intro", id: w.id });
        steps.push({ type: "meaning", id: w.id });
      } else {
        steps.push(practiceStep(w));
      }
    });
    return { kind: "pool", title, steps };
  }

  function random() { return Object.assign(fromPool(W(), "Palavras aleatórias", 10), { kind: "random" }); }

  function groups(groupIds, title) {
    const set = new Set(groupIds);
    const def = fromPool(W().filter(w => set.has(w.group)), title || "Grupos escolhidos", 12);
    return def && Object.assign(def, { kind: "groups", groupIds });
  }

  // The next batch for an endless session of the same kind. Falls back to random practice
  // when there's nothing new to learn or nothing due.
  function more(def) {
    let next = null;
    if (def.kind === "new") next = newWords();
    else if (def.kind === "review") next = review();
    else if (def.kind === "groups") next = groups(def.groupIds, def.title);
    else if (def.kind === "smart") next = smart();
    if (!next || !next.steps.length) next = random();
    return next ? next.steps : [];
  }

  // "Continue": due reviews first, then new words if there's room.
  function smart() {
    const due = Memory.dueWords().slice(0, 8);
    const steps = shuffle(due).map(w => practiceStep(w, Memory.dueSkill(w.id)));
    if (due.length < 6) {
      const n = newWords();
      if (n) steps.push(...n.steps);
    }
    if (!steps.length) return null;
    return { kind: "smart", title: "Prática de hoje", steps };
  }

  // ---- Answer choices ----

  // Words that must never appear as wrong answers for this word (same pinyin
  // or same English would make two answers correct).
  // Overlapping meanings (yào / xiǎng, bú kèqi / méi guānxi…) also count as a clash.
  const ALIKE = {};
  Banks.alikeSets.forEach(set => set.forEach(a => set.forEach(b => {
    if (a !== b) (ALIKE[a] = ALIKE[a] || new Set()).add(b);
  })));
  function alike(a, b) { return !!(ALIKE[a.id] && ALIKE[a.id].has(b.id)); }

  function clash(a, b) {
    return a.id === b.id || Pinyin.plain(a.py) === Pinyin.plain(b.py) || a.en === b.en || alike(a, b);
  }

  // ---- Quick Match ----
  // Picks up to n words that can safely share one board: no two with the same
  // pinyin, the same English or overlapping meanings. Earlier words in `ordered` win.
  function matchSet(ordered, n) {
    const out = [];
    for (const w of ordered) {
      if (out.length >= n) break;
      if (!out.some(o => clash(o, w))) out.push(w);
    }
    return out;
  }

  // Where Quick Match boards come from, for each Vocab mode. Each returns the
  // words in priority order; the board takes the first 10 that fit together.
  function matchPool(kind, groupIds) {
    const metFirst = list => {
      const met = list.filter(w => Memory.isIntro(w.id));
      const unmet = list.filter(w => !Memory.isIntro(w.id));
      return shuffle(met).concat(unmet);
    };
    if (kind === "review") {
      const due = Memory.dueWords();
      const dueIds = new Set(due.map(w => w.id));
      const rest = W().filter(w => Memory.isIntro(w.id) && !dueIds.has(w.id))
        .sort((a, b) => Memory.strength(a.id) - Memory.strength(b.id));
      return due.concat(rest);
    }
    if (kind === "groups") {
      const set = new Set(groupIds);
      return metFirst(W().filter(w => set.has(w.group)));
    }
    return metFirst(W()); // random
  }

  function firstLetter(w) { return Pinyin.plain(w.py).normalize("NFD")[0]; }

  function choices(word, type) {
    const others = W().filter(w => !clash(w, word));
    const r = Memory.rec(word.id);
    const harder = type === "recall" && r && r.c.b >= 2;
    let preferred;
    if (harder) {
      // Look-alikes: same starting letter, or same group.
      preferred = others.filter(w => firstLetter(w) === firstLetter(word) || w.group === word.group);
    } else {
      preferred = others.filter(w => w.group === word.group);
    }
    const picks = [];
    const seen = new Set();
    const add = w => {
      const key = type === "recall" ? Pinyin.plain(w.py) : w.en;
      if (picks.length < 3 && !seen.has(key) && !picks.some(p => clash(p, w))) { seen.add(key); picks.push(w); }
    };
    shuffle(preferred).forEach(add);
    shuffle(others).forEach(add);
    return shuffle([word, ...picks]);
  }

  window.Session = { newWords, review, random, groups, smart, more, choices, shuffle, matchSet, matchPool, BATCH };
}());
