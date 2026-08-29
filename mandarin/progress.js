/* Small, browser-only progress store shared by the vocabulary games. */
(function () {
  const STORAGE_KEY = "mandarinWordProgressV1";

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (e) { return {}; }
  }

  function save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { /* Practice still works when storage is unavailable. */ }
  }

  function keyFor(word) {
    return typeof word === "string" ? word : word.pinyin;
  }

  function record(word, correct) {
    const key = keyFor(word);
    if (!key) return;
    const data = load();
    const item = data[key] || { correct: 0, wrong: 0, lastSeen: 0 };
    item[correct ? "correct" : "wrong"]++;
    item.lastSeen = Date.now();
    data[key] = item;
    save(data);
  }

  function score(word) {
    const item = load()[keyFor(word)];
    if (!item) return 0;
    return item.wrong * 3 - item.correct;
  }

  function weakWords(words, limit) {
    return words
      .map(word => ({ word, score: score(word) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit || 20)
      .map(item => item.word);
  }

  window.MandarinProgress = { record, score, weakWords, load };
}());
