/* The sentence engine: which patterns are unlocked, making sentences from them,
   wrong-answer choices, decoy tiles, and remembering how well you know each pattern.
   The patterns themselves are in data/sentences.js. */
(function () {
  const D = window.SENTENCES;
  const BY_ID = Object.assign({}, Banks.BY_ID);
  D.EXTRA.forEach(x => { BY_ID[x.id] = x; });
  const BU = "build:bu", MEI = "build:mei", MA = "build:ma";

  const ALIKE = {};
  Banks.alikeSets.forEach(set => set.forEach(a => set.forEach(b => {
    if (a !== b) (ALIKE[a] = ALIKE[a] || new Set()).add(b);
  })));

  const rand = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = Session.shuffle;

  function role(id) {
    const w = BY_ID[id];
    if (!w) return "glue";
    return w.role || D.ROLE_OVERRIDES[id] || D.ROLE_BY_GROUP[w.group] || "glue";
  }

  function known(id) { return id.startsWith("x:") || Memory.isIntro(id); }

  // ---------------------------------------------------------------- English helpers

  function helpers(g) {
    const P = id => D.PEOPLE[id];
    const T = id => D.THINGS[id];
    const pick = v => Array.isArray(v) ? v[g] : v;
    const isPerson = id => !!D.PEOPLE[id];
    const E = {
      cap: s => s.charAt(0).toUpperCase() + s.slice(1),
      s: id => isPerson(id) ? pick(P(id).s) : "the " + T(id).en,
      S: id => E.cap(E.s(id)),
      third: id => isPerson(id) ? !!P(id).third : !T(id).pl,
      pl: id => !isPerson(id) && !!T(id).pl,
      be: id => isPerson(id) ? P(id).be : (T(id).pl ? "are" : "is"),
      Be: id => E.cap(E.be(id)),
      Do: id => E.third(id) ? "Does" : "Do",
      dont: id => E.third(id) ? "doesn't" : "don't",
      v: (id, base, third) => E.third(id) ? third : base,
      thing: id => T(id).en,
      verb: id => D.VERBS[id],
      adj: id => D.ADJ[id],
      digit: id => String(D.NUMBERS[id][0]),
      numWord: id => D.NUMBERS[id][1],
      count: (o, n) => D.NUMBERS[n][0] === 1 ? T(o).one : T(o).many,
      time: id => D.TIMES[id],
      poss: id => pick(P(id).poss),
      // "I'm", "You're", "He's", "We're", "The tea is"
      beSubj(id) {
        if (!isPerson(id)) return E.S(id) + " " + E.be(id);
        return E.cap(pick(P(id).s)) + { am: "'m", are: "'re", is: "'s" }[P(id).be];
      },
      isVery: id => E.beSubj(id) + " very",
      // "I'm not", "You aren't", "He isn't", "The tea isn't"
      beNot: id => id === "build:wo" ? "I'm not" : E.S(id) + " " + E.be(id) + "n't"
    };
    return E;
  }

  // ---------------------------------------------------------------- pinyin as spoken

  function firstTone(py) { return Pinyin.toneOf(py.split(/[ |]/)[0]); }

  // bù becomes bú before a 4th tone; yī before gè/kuài (or bǎi, qiān, wàn) becomes yí (before a 4th tone) or yì.
  function spoken(tokens) {
    const words = tokens.map((t, i) => ({ t, i })).filter(x => x.t !== ",");
    const out = tokens.map(t => t === "," ? "," : Pinyin.plain(BY_ID[t].py));
    words.forEach((x, k) => {
      const nxt = words[k + 1];
      if (!nxt) return;
      const nt = firstTone(BY_ID[nxt.t].py);
      if (x.t === BU && nt === 4) out[x.i] = "bú";
      // ...but not as the last digit of a longer number: shíyī kuài and sìbǎi líng yī kuài keep yī
      // (after bǎi/qiān it still changes: sānqiān yìbǎi).
      const prev = words[k - 1];
      const inNumber = prev && role(prev.t) === "number" && ![...(D.MEASURES || []), ...(D.YI_BEFORE || [])].includes(prev.t);
      if (x.t === "num:yi" && !inNumber && [...(D.MEASURES || []), ...(D.YI_BEFORE || [])].includes(nxt.t)) out[x.i] = nt === 4 ? "yí" : "yì";
    });
    return out;
  }

  // ---------------------------------------------------------------- items: patterns and replies

  // Each bank has its own sections. Essentials: the four sensible ones, then Surreal Sentences.
  // Topics: their own sections from data/topics/*.js.
  function itemsFor(bankId, sections, patterns) {
    return [
      ...sections.flatMap(sec => sec.items.map(x =>
        x.q ? { id: x.id, kind: "reply", bank: bankId, section: sec.id, name: x.qen, def: x }
        : x.make ? { id: x.id, kind: "pattern", bank: bankId, section: sec.id, group: x.group || sec.name, name: x.name, def: x }
        : { id: x.id, kind: "fixed", bank: bankId, section: sec.id, name: x.en, def: x })),
      ...(patterns || []).map(p => ({ id: p.id, kind: "pattern", bank: bankId, section: "surreal", group: p.group, name: p.name, def: p }))
    ];
  }
  const SECTIONS_BY_BANK = {
    essentials: [
      ...D.SECTIONS.map(sec => ({ id: sec.id, name: sec.name, sub: sec.sub })),
      { id: "surreal", name: "Surreal Sentences", sub: "Nonsense on purpose: drinking rice, tired tea, saying hello to a fish. The grammar's right; the meaning isn't.", surreal: true }
    ]
  };
  const ITEMS_BY_BANK = { essentials: itemsFor("essentials", D.SECTIONS, D.PATTERNS) };
  Object.values(window.TOPIC_DATA || {}).forEach(t => {
    SECTIONS_BY_BANK[t.id] = t.SECTIONS.map(sec => ({ id: sec.id, name: sec.name, sub: sec.sub }));
    ITEMS_BY_BANK[t.id] = itemsFor(t.id, t.SECTIONS, null);
  });
  const ALL_ITEMS = Object.values(ITEMS_BY_BANK).flat();
  // The current bank's sentence items.
  const items = () => ITEMS_BY_BANK[Banks.current] || [];
  const sections = () => SECTIONS_BY_BANK[Banks.current] || [];
  const ITEM_BY_ID = Object.fromEntries(ALL_ITEMS.map(it => [it.id, it]));
  const sectionItems = id => items().filter(it => it.section === id);
  const endOf = en => /[?!]$/.test(en) ? en.slice(-1) : ".";
  const QUESTION_WORDS = D.QUESTION_WORDS; // shénme, nǎr, duōshao, plus any a topic adds

  function listFor(name) { return D.LISTS[name] || []; }

  function canNeg(p) { return (p.flags || []).includes("neg") && known((p.needsNeg || [BU])[0]); }
  function canQ(p) { return (p.flags || []).includes("q") && known(MA); }

  function canBeValid(p) {
    for (let k = 0; k < 80; k++) {
      const f = { g: 0 };
      Object.entries(p.slots).forEach(([key, list]) => { f[key] = rand(list.filter(known)); });
      if (p.valid(f)) return true;
    }
    return false;
  }

  // Is this item unlocked? If not, which words are missing?
  function status(it) {
    if (it.kind === "pattern") {
      const p = it.def;
      const missing = p.core.filter(id => !known(id));
      const slotGaps = Object.values(p.slots).filter(list => !list.some(known));
      let open = !missing.length && !slotGaps.length;
      // Surreal patterns only open once your words can make an absurd version.
      if (open && it.section === "surreal" && p.valid && !canBeValid(p)) { open = false; slotGaps.push(Object.values(p.slots)[Object.keys(p.slots).length - 1]); }
      return { open, missing, slotGaps };
    }
    if (it.kind === "fixed") {
      const missing = [...new Set(it.def.t.filter(t => t !== "," && !known(t)))];
      return { open: !missing.length, missing, slotGaps: [] };
    }
    const x = it.def;
    const ids = [...x.q, ...x.a[0].t.filter(t => typeof t === "string" && t !== ",")];
    const missing = [...new Set(ids.filter(id => !known(id)))];
    const slotGaps = x.a[0].t.filter(t => typeof t === "object" && !listFor(t.any).some(known)).map(t => listFor(t.any));
    return { open: !missing.length && !slotGaps.length, missing, slotGaps };
  }

  // ---------------------------------------------------------------- memory per item

  function rec(id) { return Store.state.patterns[id] || null; }
  function stage(id) {
    const r = rec(id);
    if (!r || !r.intro) return "new";
    if (r.b >= 4) return "known";
    if (r.b >= 2) return "familiar";
    return "learning";
  }
  function isDue(id) { const r = rec(id); return !!(r && r.intro && r.due <= Date.now()); }
  function answer(id, correct) {
    const s = Store.state.patterns;
    if (!s[id]) s[id] = { intro: Date.now(), b: 0, due: 0, r: 0, w: 0 };
    Memory.bump(s[id], correct);
    Memory.countToday();
    Store.save();
  }

  // Counts for the whole of Sentences, or for one section.
  function summary(sectionId) {
    const list = sectionId ? sectionItems(sectionId) : items();
    const open = list.filter(it => status(it).open);
    const stages = { new: 0, learning: 0, familiar: 0, known: 0 };
    list.forEach(it => stages[stage(it.id)]++);
    return { total: list.length, unlocked: open.length, due: open.filter(it => isDue(it.id)).length, stages };
  }

  // ---------------------------------------------------------------- making sentences

  // Turn token lists into the accepted answers: one list of Sets per accepted order.
  function sequences(lists, alts) {
    return lists.map(list => list.filter(t => t !== ",").map(id => new Set([id, ...((alts || {})[id] || [])])));
  }

  function makeFrom(p, f) {
    const out = p.make(f, helpers(f.g));
    const tokens = out.t.filter(Boolean);
    const also = (out.also || []).map(a => a.filter(Boolean));
    return { tokens, also, end: out.end, en: out.en };
  }

  // Variety: words used in the last few sentences are skipped when there's another choice,
  // so slots don't keep landing on wǒ and chá.
  const recent = [];
  function pickFresh(list) {
    const fresh = list.filter(id => !recent.includes(id));
    return rand(fresh.length && Math.random() < .85 ? fresh : list);
  }
  function remember(tokens) {
    tokens.forEach(t => { if (t !== ",") recent.push(t); });
    while (recent.length > 24) recent.shift();
  }

  // plain: no "not" or question, used the first time you meet a pattern.
  // force: slot values to keep (used to build a sentence around one word).
  function patternInstance(it, fixed, plain, force) {
    const p = it.def;
    const f = fixed ? { ...fixed } : { g: Math.random() < .5 ? 0 : 1 };
    if (!fixed) {
      const fill = () => Object.entries(p.slots).forEach(([k, list]) => { if (!(force && k in force)) f[k] = pickFresh(list.filter(known)); });
      if (force) Object.assign(f, force);
      fill();
      for (let k = 0; k < 300 && p.valid && !p.valid(f); k++) fill();
      f.neg = !plain && canNeg(p) && Math.random() < .3;
      const subj = f.S || f.X;
      // "Do I want coffee?" sounds odd, so questions never have wǒ as the subject.
      f.q = !plain && !f.neg && canQ(p) && Math.random() < .35 && (p.qMe || subj !== "build:wo") && !(p.noQ || []).includes(subj);
    }
    const m = makeFrom(p, f);
    if (!fixed) remember(m.tokens);
    return {
      item: it, f, tokens: m.tokens, end: m.end, en: m.en,
      seqs: sequences([m.tokens, ...m.also], p.alts),
      py: spoken(m.tokens)
    };
  }

  function replyInstance(it) {
    const x = it.def;
    // Pick a concrete version of the first reply to deal tiles from.
    const pickAny = list => rand(listFor(list).filter(known));
    const intended = x.a[0].t.map(t => typeof t === "object" ? pickAny(t.any) : t);
    const seqs = x.a.map(ans => ans.t.filter(t => t !== ",").map(t =>
      typeof t === "object" ? new Set(listFor(t.any).filter(known)) : new Set([t])));
    return {
      item: it, tokens: intended, py: spoken(intended), end: ".", seqs,
      prompt: x.q, promptPy: spoken(x.q), promptEn: x.qen,
      promptEnd: /[?!]$/.test(x.qen) ? x.qen.slice(-1) : ""
    };
  }

  function fixedInstance(it) {
    const d = it.def;
    return {
      item: it, tokens: d.t, end: endOf(d.en), en: d.en,
      seqs: sequences([d.t, ...(d.also || [])], d.alts),
      py: spoken(d.t)
    };
  }

  function instance(it, plain) {
    if (it.kind === "pattern") return patternInstance(it, null, plain);
    if (it.kind === "fixed") return fixedInstance(it);
    return replyInstance(it);
  }

  // English for the reply that was actually built.
  function replyEnglish(inst, input) {
    const x = inst.item.def;
    for (let i = 0; i < x.a.length; i++) {
      const seq = inst.seqs[i];
      if (seq.length === input.length && seq.every((set, k) => set.has(input[k]))) {
        const ans = x.a[i];
        const slotIdx = ans.t.filter(t => t !== ",").findIndex(t => typeof t === "object");
        if (slotIdx < 0) return ans.en;
        const id = input[slotIdx];
        const word = D.THINGS[id] ? D.THINGS[id].en : D.NUMBERS[id] ? String(D.NUMBERS[id][0]) : BY_ID[id].en;
        const en = ans.enPl && D.THINGS[id] && D.THINGS[id].pl ? ans.enPl : ans.en;
        return en.replace("{x}", word);
      }
    }
    return x.a[0].en;
  }

  // Wrong English choices for Pick the translation: same pattern, one thing changed.
  function translations(inst, n) {
    n = n || 3;
    if (inst.item.kind === "fixed") return fixedTranslations(inst, n);
    const p = inst.item.def, f = inst.f;
    const seen = new Set([inst.en]);
    const res = [];
    const tries = [];
    if (canNeg(p)) tries.push({ ...f, neg: !f.neg, q: false });
    if (canQ(p)) tries.push({ ...f, q: !f.q, neg: false });
    Object.entries(p.slots).forEach(([k, list]) => {
      const others = shuffle(list.filter(id => id !== f[k]));
      const pref = others.filter(known).concat(others.filter(id => !known(id)));
      pref.slice(0, 3).forEach(id => tries.push({ ...f, [k]: id }));
    });
    shuffle(tries).forEach(t => {
      if (res.length >= n || (p.valid && !p.valid(t))) return;
      const en = makeFrom(p, t).en;
      if (!seen.has(en)) { seen.add(en); res.push(en); }
    });
    // Not enough variety (tiny pattern): borrow sentences from other open patterns.
    let guard = 0;
    while (res.length < n && guard++ < 30) {
      const others = items().filter(it => it.kind === "pattern" && it.id !== p.id && status(it).open);
      const same = others.filter(it => it.section === inst.item.section);
      const other = rand(same.length ? same : others);
      if (!other) break;
      const en = patternInstance(other).en;
      if (!seen.has(en)) { seen.add(en); res.push(en); }
    }
    return shuffle([inst.en, ...res]);
  }

  // Wrong choices for a hand-written sentence: other sentences, preferring ones that share words.
  function fixedTranslations(inst, n) {
    const mine = new Set(inst.tokens);
    const shared = it => it.def.t.filter(t => mine.has(t)).length;
    const pool = items().filter(it => it.kind === "fixed" && it.id !== inst.item.id && it.def.en !== inst.en);
    const ranked = Session.shuffle(pool).sort((a, b) =>
      (status(b).open - status(a).open) * 10 + (shared(b) - shared(a)) + (b.section === inst.item.section) - (a.section === inst.item.section));
    const res = [];
    ranked.forEach(it => { if (res.length < n && !res.includes(it.def.en)) res.push(it.def.en); });
    return shuffle([inst.en, ...res]);
  }

  // ---------------------------------------------------------------- tiles

  const CONTENT_ROLES = ["verb", "thing", "describe", "person", "time", "number"];

  function acceptedIds(inst) {
    const s = new Set();
    inst.seqs.forEach(seq => seq.forEach(set => set.forEach(id => s.add(id))));
    return s;
  }

  function alikeAny(id, ids) { return ids.some(t => ALIKE[t] && ALIKE[t].has(id)); }

  // Extra wrong tiles for Build it / Reply. Same kinds of word as the sentence, never
  // a word that would also be correct, plus bù/méi as a deliberate grammar trap.
  function decoys(inst, n) {
    if (!n) return [];
    const accepted = acceptedIds(inst);
    const words = inst.tokens.filter(t => t !== ",");
    const roles = new Set(words.map(role));
    const out = [];
    const add = id => { if (out.length < n && !accepted.has(id) && !out.includes(id)) out.push(id); };
    if (words.includes(BU) && known(MEI)) add(MEI);
    if (words.includes(MEI) && known(BU)) add(BU);
    // A question word already makes it a question, so ma is a trap.
    if (words.some(w => QUESTION_WORDS.includes(w)) && known(MA)) add(MA);
    const pool = Banks.ALL.filter(w => known(w.id) && !accepted.has(w.id) && !alikeAny(w.id, words));
    shuffle(pool.filter(w => roles.has(role(w.id)) && role(w.id) !== "greet")).forEach(w => add(w.id));
    shuffle(pool.filter(w => role(w.id) !== "greet")).forEach(w => add(w.id));
    return out;
  }

  // Fill the gap: which word to blank out, and the choices for it.
  function gap(inst, forceIndex) {
    const idx = inst.tokens.map((t, i) => i).filter(i => inst.tokens[i] !== "," && CONTENT_ROLES.includes(role(inst.tokens[i])));
    if (!idx.length && forceIndex === undefined) return null;
    const i = forceIndex !== undefined ? forceIndex : rand(idx);
    const answer = inst.tokens[i];
    // Accepted at that spot (e.g. xiǎng for yào) can't be a wrong choice.
    const wordPos = inst.tokens.slice(0, i).filter(t => t !== ",").length;
    const okHere = new Set();
    inst.seqs.forEach(seq => { if (seq[wordPos]) seq[wordPos].forEach(id => okHere.add(id)); });
    const r = role(answer);
    const pool = Banks.ALL.filter(w => known(w.id) && !okHere.has(w.id) && !alikeAny(w.id, [answer]));
    const same = shuffle(pool.filter(w => role(w.id) === r)).map(w => w.id);
    const other = shuffle(pool.filter(w => role(w.id) !== r && role(w.id) !== "greet")).map(w => w.id);
    const wrong = same.concat(other).slice(0, 3);
    return { index: i, answer, okHere, options: shuffle([answer, ...wrong]) };
  }

  // A sensible sentence containing this word, with the word blanked out (for Vocab's Fill the gap).
  // Returns null if no unlocked sensible pattern can use the word.
  function gapFor(wordId) {
    const pats = shuffle(items().filter(it => it.kind === "pattern" && it.section !== "surreal" && status(it).open));
    for (const it of pats) {
      const p = it.def;
      let force = null;
      if (!p.core.includes(wordId)) {
        const slot = Object.keys(p.slots).find(k => p.slots[k].includes(wordId));
        if (!slot) continue;
        force = { [slot]: wordId };
      }
      const inst = patternInstance(it, null, true, force);
      const index = inst.tokens.indexOf(wordId);
      if (index < 0) continue;
      const g = gap(inst, index);
      if (g.options.length < 2) continue;
      return { inst, gap: g };
    }
    return null;
  }

  function canGap(wordId) {
    return items().some(it => it.kind === "pattern" && it.section !== "surreal" && status(it).open &&
      (it.def.core.includes(wordId) || Object.values(it.def.slots).some(list => list.includes(wordId))));
  }

  // ---------------------------------------------------------------- sessions

  function pickActivity(it) {
    if (it.kind === "reply") return "reply";
    const r = rec(it.id);
    if (!r || !r.intro) return "build"; // new patterns open with Build it, with the tip shown
    // Build it is the main activity; Pick the translation now and then for variety.
    return Math.random() < .8 ? "build" : "translate";
  }

  // A practice session: due items first, at most maxNew brand-new ones, then a mix.
  function buildSession(onlyIds, size, maxNew) {
    size = size || 8;
    maxNew = maxNew === undefined ? 2 : maxNew;
    const pool = items().filter(it => status(it).open && (!onlyIds || onlyIds.includes(it.id)));
    if (!pool.length) return null;
    const due = shuffle(pool.filter(it => isDue(it.id)));
    const fresh = pool.filter(it => !(rec(it.id) && rec(it.id).intro));
    const rest = pool.filter(it => !due.includes(it) && !fresh.includes(it));
    let chosen = due.slice(0, size);
    chosen = chosen.concat(fresh.slice(0, Math.max(0, Math.min(maxNew, size - chosen.length))));
    let guard = 0;
    while (chosen.length < size && guard++ < 100) {
      // Hand-written sentences don't repeat in a session; patterns can (they make a new sentence each time).
      const src = (rest.length ? rest : pool).filter(it => it.kind === "pattern" || !chosen.includes(it));
      if (!src.length) break;
      const pickIt = rand(src);
      // Avoid the same item twice in a row.
      if (chosen.length && chosen[chosen.length - 1] === pickIt && pool.length > 1) continue;
      chosen.push(pickIt);
    }
    return shuffle(chosen).map(it => it.id);
  }

  // After a clean sentence, words in it that are due for review count as reviewed.
  function creditWords(tokens) {
    tokens.forEach(id => {
      if (id === "," || id.startsWith("x:")) return;
      if (Memory.dueSkill(id) === "c") Memory.answer(id, "c", true);
    });
  }

  // ---------------------------------------------------------------- literal meanings and rules

  function lit(id) {
    if (D.LITERAL[id]) return D.LITERAL[id];
    const w = BY_ID[id];
    if (D.NUMBERS[id]) return String(D.NUMBERS[id][0]);
    return w ? w.en.split(" (")[0].split(" / ")[0] : "";
  }

  // The grammar rules this sentence uses. Rules about the words in `focus` come first.
  function explain(tokens, focus) {
    focus = focus || [];
    const t = tokens.filter(x => x !== ",");
    const hits = D.RULES.filter(r => r.words.some(w => t.includes(w)) && (!r.when || r.when(t)));
    hits.sort((a, b) => (b.words.some(w => focus.includes(w)) - a.words.some(w => focus.includes(w))));
    const out = hits.slice(0, 3);
    if (out.length < 2) out.push(D.RULES.find(r => r.id === "order"));
    return out;
  }

  window.Sentences = {
    get ITEMS() { return items(); }, get SECTIONS() { return sections(); },
    ITEM_BY_ID, BY_ID, ROLES: D.ROLES, sectionItems,
    role, known, status, stage, isDue, answer, summary,
    instance, replyEnglish, translations, decoys, gap, gapFor, canGap, pickActivity, buildSession, creditWords, spoken, lit, explain
  };
}());
