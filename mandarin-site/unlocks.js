/* Shared topic-unlock system.
   You mark topics as "unlocked" on the My Progress page. Vocab games then draw
   mostly from unlocked topics, with a small amount of locked material mixed in
   as light preview exposure — so nothing is fully off-limits, but you aren't
   dropped into a topic you haven't started yet.

   Storage: localStorage key "mandarinUnlockedTopics" -> array of topic ids.
   New topics are unlocked by default until you've locked at least one topic,
   so a first-time visitor isn't stuck with everything hidden. */
(function () {
  const STORAGE_KEY = "mandarinUnlockedTopics";

  // Order matters: this is also the suggested learning order shown on the
  // My Progress page. Falls back to MANDARIN_TOPICS order if a topic here
  // isn't found there (harmless — it's just a display hint).
  const DEFAULT_ORDER = [
    "greetings", "basics", "numbers", "people", "nouns",
    "food", "verbs", "adjectives", "time", "places",
    "home", "directions", "weather", "food2", "school"
  ];

  function allTopicIds() {
    if (window.MANDARIN_TOPICS) return window.MANDARIN_TOPICS.map(t => t.id);
    return DEFAULT_ORDER;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return null; // never set — "everything unlocked" state
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : null;
    } catch (e) { return null; }
  }

  function save(ids) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); }
    catch (e) { /* progress won't persist, but games still work this session */ }
  }

  // Returns the set of unlocked topic ids. If unlocks have never been touched,
  // everything counts as unlocked (so existing users see no change until they
  // visit My Progress and start curating).
  function unlockedTopics() {
    const stored = load();
    if (stored === null) return allTopicIds();
    return stored;
  }

  function isUnlocked(topicId) {
    return unlockedTopics().includes(topicId);
  }

  function setUnlocked(topicId, unlocked) {
    const current = new Set(unlockedTopics());
    if (unlocked) current.add(topicId);
    else current.delete(topicId);
    save(Array.from(current));
  }

  function setAllUnlocked() {
    save(allTopicIds());
  }

  // Split a flat word list (like MANDARIN_WORDS) into { unlocked, locked }
  // based on each word's `.topic` field.
  function splitWords(words) {
    const unlocked = new Set(unlockedTopics());
    const inSet = [], outSet = [];
    words.forEach(w => (unlocked.has(w.topic) ? inSet : outSet).push(w));
    return { unlocked: inSet, locked: outSet };
  }

  // Build a practice pool from a flat word list: mostly unlocked words, with
  // a light sprinkling of locked ones for preview exposure. previewRate is
  // the target fraction of the returned pool that may come from locked topics
  // (default 15%). Returns a new array — safe to shuffle/consume freely.
  function buildPracticePool(words, previewRate) {
    const rate = typeof previewRate === "number" ? previewRate : 0.15;
    const { unlocked, locked } = splitWords(words);
    if (unlocked.length === 0) return words.slice(); // nothing unlocked yet — don't strand the learner
    if (locked.length === 0) return unlocked.slice();

    const previewCount = Math.max(0, Math.round(unlocked.length * rate / (1 - rate)));
    const shuffledLocked = locked.slice().sort(() => Math.random() - 0.5);
    return unlocked.concat(shuffledLocked.slice(0, previewCount));
  }

  window.MandarinUnlocks = {
    DEFAULT_ORDER,
    allTopicIds,
    unlockedTopics,
    isUnlocked,
    setUnlocked,
    setAllUnlocked,
    splitWords,
    buildPracticePool
  };
}());
