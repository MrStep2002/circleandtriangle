(function () {
  const TOPICS = window.MANDARIN_TOPICS;
  const BLOCKS = window.MANDARIN_BLOCKS || [];
  const ALL_WORDS = window.MANDARIN_WORDS;
  const $ = id => document.getElementById(id);

  // "Mix everything" respects your unlocked topics (My Progress page), with a
  // light sprinkling of locked-topic words for preview exposure.
  const MIX_WORDS = window.MandarinUnlocks.buildPracticePool(ALL_WORDS);

  const MODES = [
    { id: "mix", name: "Mix everything", emoji: "🎲", sub: `Your unlocked words, one at a time` },
    { id: "weak", name: "Words to revisit", emoji: "🌱", sub: "Words you have missed in the shared games" },
    ...BLOCKS.map(block => ({ id: block.id, name: block.name, emoji: block.emoji, sub: block.words.length + " words, mixed from everywhere" })),
    ...TOPICS.map(topic => ({ id: topic.id, name: topic.name, emoji: topic.emoji, sub: topic.sub }))
  ];

  function poolForMode(mode) {
    const block = BLOCKS.find(b => b.id === mode.id);
    if (block) return block.words;
    return TOPICS.find(topic => topic.id === mode.id).words;
  }

  let currentMode = null;
  let pool = [];
  let mainBag = null;   // shuffled bag over the main pool — see rotation.js
  let weakBag = null;   // shuffled bag over weak words, used sometimes during "mix"
  let weakBagCount = 0; // size weakBag was built with, so we know when to rebuild it
  let word = null;
  let dirty = false;
  let answered = false;
  let streak = 0;
  let bestStreaks = {};

  try { bestStreaks = JSON.parse(localStorage.getItem("pinyinProduceBest") || "{}"); }
  catch (e) { bestStreaks = {}; }

  function saveBest() {
    try { localStorage.setItem("pinyinProduceBest", JSON.stringify(bestStreaks)); }
    catch (e) { /* Best score lasts for this visit when storage is unavailable. */ }
  }

  function stripPinyin(value) {
    return value.toLowerCase()
      .replace(/u:/g, "v")
      .replace(/ü/g, "v")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[1-5]/g, "")
      .replace(/[’‘']/g, "")
      .replace(/[^a-zv]/g, "");
  }

  function isCorrect(guess, answer) {
    return stripPinyin(guess) === stripPinyin(answer);
  }

  function show(screenId) {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
    $(screenId).classList.add("active");
    window.scrollTo({ top: 0 });
  }

  function renderMenu() {
    const list = $("topic-list");
    list.innerHTML = "";
    MODES.forEach(mode => {
      const button = document.createElement("button");
      button.className = "topic-btn";
      const weakCount = MandarinProgress.weakWords(ALL_WORDS, 1000).length;
      const sub = mode.id === "weak"
        ? (weakCount ? `${weakCount} word${weakCount === 1 ? "" : "s"} waiting for another go` : "No difficult words recorded yet — starts as a mixed run")
        : mode.sub;
      button.innerHTML =
        `<span class="topic-emoji">${mode.emoji}</span>` +
        `<span><span class="topic-name">${mode.name}</span><br><span class="topic-sub">${sub}</span></span>` +
        (bestStreaks[mode.id] ? `<span class="topic-best">🔥 best: ${bestStreaks[mode.id]}</span>` : "");
      button.addEventListener("click", () => startMode(mode));
      list.appendChild(button);
    });
  }

  function startMode(mode) {
    currentMode = mode;
    if (mode.id === "mix") pool = MIX_WORDS;
    else if (mode.id === "weak") pool = MandarinProgress.weakWords(ALL_WORDS, 30);
    else pool = poolForMode(mode);
    if (!pool.length) pool = MIX_WORDS;

    // Shuffled bags deal every word once before any repeat, so a small pool
    // doesn't feel like it keeps handing you the same couple of words.
    mainBag = window.MandarinRotation.createBag(pool);
    const weak = MandarinProgress.weakWords(ALL_WORDS, 30);
    weakBag = weak.length ? window.MandarinRotation.createBag(weak) : null;
    weakBagCount = weak.length;

    streak = 0;
    updateStreakBar();
    nextWord();
    show("screen-play");
  }

  function chooseWord() {
    // In "mix" mode, sometimes pull from weak words instead of the main bag —
    // refreshed each call so newly-recorded mistakes can show up right away.
    if (currentMode.id === "mix") {
      const weak = MandarinProgress.weakWords(ALL_WORDS, 30);
      if (weak.length) {
        if (!weakBag || weakBagCount !== weak.length) {
          weakBag = window.MandarinRotation.createBag(weak);
          weakBagCount = weak.length;
        }
        if (Math.random() < 0.45) return weakBag.next();
      }
    }
    return mainBag.next();
  }

  function nextWord() {
    word = chooseWord();
    dirty = false;
    answered = false;

    $("word-english").textContent = word.english;
    $("word-pinyin").textContent = "";
    $("word-phon").textContent = "";
    $("word-card").classList.remove("correct", "wrong");

    const input = $("answer-input");
    input.value = "";
    input.disabled = false;
    const feedback = $("feedback");
    feedback.className = "feedback neutral";
    feedback.textContent = "Type the pinyin — tone marks are optional";
    $("btn-next").hidden = true;
    $("btn-reveal").hidden = false;
    input.focus();
  }

  function finish(correct) {
    answered = true;
    $("answer-input").disabled = true;
    $("btn-reveal").hidden = true;
    $("btn-next").hidden = false;
    $("word-pinyin").textContent = word.pinyin;
    $("word-phon").textContent = word.hanzi ? `${word.hanzi}  ·  “${word.pronunciation}”` : `“${word.pronunciation}”`;

    if (correct && !dirty) {
      streak++;
      MandarinProgress.record(word, true);
      if (!bestStreaks[currentMode.id] || streak > bestStreaks[currentMode.id]) {
        bestStreaks[currentMode.id] = streak;
        saveBest();
      }
    } else {
      if (!dirty) MandarinProgress.record(word, false);
      streak = 0;
    }
    updateStreakBar(!correct || dirty);
    $("btn-next").focus();
  }

  function checkAnswer() {
    if (answered) return;
    const input = $("answer-input");
    if (!input.value.trim()) { input.focus(); return; }
    const feedback = $("feedback");

    if (isCorrect(input.value, word.pinyin)) {
      $("word-card").classList.remove("wrong");
      $("word-card").classList.add("correct");
      feedback.className = "feedback good";
      feedback.innerHTML = `✓ <strong>${word.pinyin}</strong><span class="fb-sub">${streakMessage(streak + (dirty ? 0 : 1))}</span>`;
      finish(true);
    } else {
      if (!dirty) MandarinProgress.record(word, false);
      dirty = true;
      streak = 0;
      updateStreakBar(true);
      $("word-card").classList.remove("wrong");
      void $("word-card").offsetWidth;
      $("word-card").classList.add("wrong");
      feedback.className = "feedback bad";
      feedback.textContent = "Not quite — try once more, or show the answer.";
      input.select();
      input.focus();
    }
  }

  function revealAnswer() {
    if (answered) return;
    const feedback = $("feedback");
    feedback.className = "feedback bad";
    feedback.innerHTML = `<strong>${word.pinyin}</strong><span class="fb-sub">No problem — this word will appear more often in review.</span>`;
    finish(false);
  }

  function streakMessage(value) {
    if (dirty) return "Got it after another try — keep going.";
    if (value >= 10) return `🔥 ${value} first-time answers in a row!`;
    if (value >= 3) return `🔥 ${value} in a row.`;
    return "First time — nice.";
  }

  function updateStreakBar(broken) {
    const now = $("streak-now");
    now.textContent = `🔥 ${streak}`;
    now.classList.remove("bump", "broken");
    void now.offsetWidth;
    now.classList.add(broken ? "broken" : "bump");
    setTimeout(() => now.classList.remove("bump", "broken"), 450);
    $("streak-best").textContent = `Best: ${bestStreaks[currentMode ? currentMode.id : ""] || 0}`;
  }

  $("btn-check").addEventListener("click", checkAnswer);
  $("answer-input").addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (answered) nextWord(); else checkAnswer();
  });
  $("btn-next").addEventListener("click", nextWord);
  $("btn-reveal").addEventListener("click", revealAnswer);
  $("btn-quit").addEventListener("click", () => { renderMenu(); show("screen-menu"); });

  renderMenu();
}());
