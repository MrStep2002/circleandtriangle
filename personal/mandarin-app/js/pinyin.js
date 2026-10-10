/* Pinyin helpers: plain text and tone-coloured HTML. */
(function () {
  const MARKS = {
    "ā":1,"á":2,"ǎ":3,"à":4, "ē":1,"é":2,"ě":3,"è":4, "ī":1,"í":2,"ǐ":3,"ì":4,
    "ō":1,"ó":2,"ǒ":3,"ò":4, "ū":1,"ú":2,"ǔ":3,"ù":4, "ǖ":1,"ǘ":2,"ǚ":3,"ǜ":4
  };

  function toneOf(syllable) {
    for (const ch of syllable.normalize("NFC")) if (MARKS[ch]) return MARKS[ch];
    return 5; // neutral tone
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  // "péng|you" -> "péngyou"
  function plain(py) { return py.replace(/\|/g, ""); }

  // Returns HTML with each syllable wrapped in a tone class (t1..t5).
  function html(py) {
    return py.split(" ").map(word =>
      word.split("|").map(syl => `<span class="t${toneOf(syl)}">${esc(syl)}</span>`).join("")
    ).join(" ");
  }

  window.Pinyin = { toneOf, plain, html, esc };
}());
