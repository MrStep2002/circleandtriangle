/* Word banks: Essentials plus one bank per topic.

   Every screen works on the "current" bank, which is set from the address
   (#/essentials/vocab, #/eating-out/vocab…). Progress for all words lives in one store,
   so a word learned in Essentials counts everywhere. */
(function () {
  const E = window.ESSENTIALS;
  const list = [
    { id: "essentials", name: "Essentials", sub: "the base for every topic", words: E.WORDS, groups: E.GROUPS, alike: E.ALIKE || [] }
  ];
  Object.values(window.TOPIC_DATA || {}).forEach(t => list.push({
    id: t.id, name: t.name, sub: t.sub, words: t.WORDS, groups: t.GROUPS, alike: t.ALIKE || [], topic: true
  }));

  const byId = Object.fromEntries(list.map(b => [b.id, b]));
  // A topic can borrow a word from another bank: { borrow: "eo:ji", group: "li-ask" }.
  // It's taught in both, under its own group in each, and progress is shared (same id).
  list.forEach(b => b.words.forEach(w => { if (!w.borrow) w.bank = b.id; }));
  const ALL = list.flatMap(b => b.words.filter(w => !w.borrow));
  const BY_ID = Object.fromEntries(ALL.map(w => [w.id, w]));
  list.forEach(b => {
    b.words = b.words.map(w => w.borrow ? Object.assign({}, BY_ID[w.borrow], { group: w.group, borrowed: true }, w.note ? { note: w.note } : {}) : w);
  });
  let current = "essentials";

  // A topic opens once every Essentials word has been met.
  function unlocked(id) {
    if (id === "essentials") return true;
    return E.WORDS.every(w => window.Memory && Memory.isIntro(w.id));
  }

  window.Banks = {
    list, ALL, BY_ID,
    alikeSets: list.flatMap(b => b.alike),
    get: id => byId[id],
    set(id) { if (byId[id]) current = id; },
    get current() { return current; },
    bank: () => byId[current],
    words: () => byId[current].words,
    groups: () => byId[current].groups,
    unlocked
  };
}());
