/* Essentials sentences.

   The Sentences page has five sections: four sensible ones (SECTIONS, at the bottom of this
   file) and "Surreal Sentences", made from the PATTERNS below.

   PATTERNS are sentence shapes with slots. The app fills the slots with words you've
   learned, so one pattern makes dozens of sentences (some of them silly, which is fine:
   the grammar is the point).

   Each pattern has:
     id      permanent ID (progress is stored against it)
     group   heading it's listed under
     name    short name
     tip     one-line grammar tip, shown the first time and after a mistake
     core    words that must be learned before the pattern unlocks
     slots   which words can fill each slot (lists of word IDs, or a named list below)
     flags   which variations are allowed: "neg" (not) and "q" (question)
     valid   optional: f => true/false, to rule out combinations (e.g. "I'm my friend")
     qMe     optional: allow questions with wǒ as the subject ("Can I come?")
     alts    words that are also accepted in place of another, e.g. xiǎng for yào
     make(f, E)  builds one sentence. f holds the chosen slot words and flags;
                 E has helpers for the English (subject, verb forms, "don't"…).
                 Returns { t: [word IDs, "," for a comma], end: "." "?" or "!", en: "English" }

   PATTERNS make up the "Surreal Sentences" section. SECTIONS (further down) are the four
   sensible sections: hand-written sentences and replies.
*/
window.SENTENCES = (function () {

  // ---------------------------------------------------------------- tile colours
  const ROLES = {
    person:   "who",
    verb:     "does",
    thing:    "what",
    describe: "describes",
    time:     "when",
    number:   "number",
    glue:     "little words",
    greet:    "phrases"
  };
  const ROLE_BY_GROUP = {
    greetings: "greet", people: "person", changing: "glue", pointing: "glue", info: "glue",
    more: "glue", numbers: "number", verbs: "verb", adjectives: "describe", food: "thing", money: "thing"
  };
  const ROLE_OVERRIDES = {
    "build:shi": "verb", "build:hen": "describe", "build:tai": "describe", "build:women": "person",
    "build:keyi": "verb", "money:pengyou": "thing", "money:kuai": "number",
    "money:jintian": "time", "money:mingtian": "time"
  };

  // Words used in sentences that aren't in the vocab bank. Not tracked as vocab.
  const EXTRA = [
    { id: "x:le", py: "le", say: "luh", en: "(adds emphasis)", role: "glue" }
  ];

  // ---------------------------------------------------------------- English for slot words
  const PEOPLE = {
    "build:wo":    { s: "I",   o: "me",  be: "am",  poss: "my" },
    "build:ni":    { s: "you", o: "you", be: "are", poss: "your" },
    "build:ta":    { s: ["he", "she"], o: ["him", "her"], be: "is", poss: ["his", "her"], third: true },
    "build:women": { s: "we",  o: "us",  be: "are", poss: "our" }
  };
  // pl: takes "are". one/many: for counting (only countable things have them).
  const THINGS = {
    "food:shui":     { en: "water" },
    "food:cha":      { en: "tea",        one: "tea",      many: "teas" },
    "food:kafei":    { en: "coffee",     one: "coffee",   many: "coffees" },
    "food:pijiu":    { en: "beer",       one: "beer",     many: "beers" },
    "food:mifan":    { en: "rice" },
    "food:miantiao": { en: "noodles",    pl: true },
    "food:jiaozi":   { en: "dumplings",  pl: true, one: "dumpling", many: "dumplings" },
    "food:jirou":    { en: "chicken" },
    "food:yu":       { en: "fish",       one: "fish",     many: "fish" },
    "food:shucai":   { en: "vegetables", pl: true },
    "money:qian":    { en: "money" },
    "money:pengyou": { en: "friends",    pl: true, one: "friend", many: "friends" }
  };
  const VERBS = {
    "verb:chi": { base: "eat",     s: "eats",     ing: "eating" },
    "verb:he":  { base: "drink",   s: "drinks",   ing: "drinking" },
    "verb:mai": { base: "buy",     s: "buys",     ing: "buying" },
    "verb:kan": { base: "look at", s: "looks at", ing: "looking at" }
  };
  const ADJ = {
    "adj:hao": "good", "adj:da": "big", "adj:xiao": "small", "adj:re": "hot", "adj:leng": "cold",
    "adj:kuai": "fast", "adj:man": "slow", "adj:gui": "expensive", "adj:lei": "tired"
  };
  const NUMBERS = {
    "num:yi": [1, "one"], "num:er": [2, "two"], "num:san": [3, "three"], "num:si": [4, "four"],
    "num:wu": [5, "five"], "num:liu": [6, "six"], "num:qi": [7, "seven"], "num:ba": [8, "eight"],
    "num:jiu": [9, "nine"], "num:shi": [10, "ten"]
  };
  const TIMES = { "money:jintian": "today", "money:mingtian": "tomorrow" };

  // Named slot lists.
  const L = {
    person: Object.keys(PEOPLE),
    notMe: ["build:ni", "build:ta", "build:women"],
    thing: Object.keys(THINGS),
    food: ["food:shui", "food:cha", "food:kafei", "food:pijiu", "food:mifan", "food:miantiao", "food:jiaozi", "food:jirou", "food:yu", "food:shucai"],
    drink: ["food:shui", "food:cha", "food:kafei", "food:pijiu"],
    eat: ["food:mifan", "food:miantiao", "food:jiaozi", "food:jirou", "food:yu", "food:shucai"],
    countable: Object.keys(THINGS).filter(k => THINGS[k].one),
    verb: Object.keys(VERBS),
    adj: Object.keys(ADJ),
    // Before gè or kuài, 2 is liǎng, not èr, so èr is left out of counting slots.
    count: Object.keys(NUMBERS).filter(k => k !== "num:er"),
    time: Object.keys(TIMES),
    dem: ["build:zhe", "build:na"],
    feel: ["adj:hao", "adj:lei", "adj:re", "adj:leng"]
  };

  const BU = "build:bu", MA = "build:ma", HEN = "build:hen";

  // ---------------------------------------------------------------- what makes a sentence surreal
  // Surreal Sentences only keeps combinations that make no sense: drinking rice, tired tea,
  // the dumplings wanting a friend. Each pattern's valid() rejects the sensible ones.
  const isThing = id => !!THINGS[id];
  const isPerson = id => !!PEOPLE[id] || id === "money:pengyou";
  const CAN = {
    "verb:chi": id => L.eat.includes(id),
    "verb:he": id => L.drink.includes(id),
    "verb:mai": id => L.food.includes(id),
    "verb:kan": () => true
  };
  const sensibleVO = (v, o) => CAN[v](o);
  const ADJ_OK = {
    person: ["adj:hao", "adj:lei", "adj:re", "adj:leng", "adj:da", "adj:xiao", "adj:kuai", "adj:man"],
    money: ["adj:hao", "adj:da", "adj:xiao"],
    food: ["adj:hao", "adj:re", "adj:leng", "adj:gui", "adj:da", "adj:xiao"]
  };
  const sensibleAdj = (x, d) => (isPerson(x) ? ADJ_OK.person : x === "money:qian" ? ADJ_OK.money : ADJ_OK.food).includes(d);
  // A thing doing something people do: "the tea wants…", "the fish is coming tomorrow".
  const thingDoes = f => isThing(f.S) && f.S !== "money:pengyou" && f.S !== f.O;
  const strangeVO = f => thingDoes(f) || !sensibleVO(f.V, f.O);
  const actors = [...Object.keys(PEOPLE), ...Object.keys(THINGS)];
  const objects = Object.keys(THINGS).filter(k => k !== "money:pengyou");
  const bare = id => THINGS[id] ? THINGS[id].en : PEOPLE[id].s;   // "rice", for "I'm rice."

  // ---------------------------------------------------------------- patterns
  const PATTERNS = [
    // ----- Wanting
    {
      id: "want-thing", group: "Wanting", name: "The tea wants…",
      tip: "yào + thing: wǒ yào chá = I want tea. Here the tea gets to want things too.",
      core: ["verb:yao"], slots: { S: actors, O: L.thing }, flags: ["neg", "q"], valid: thingDoes,
      make(f, E) {
        return {
          t: [f.S, f.neg && BU, "verb:yao", f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} want ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want ${E.thing(f.O)}.`
            : `${E.S(f.S)} ${E.v(f.S, "want", "wants")} ${E.thing(f.O)}.`
        };
      }
    },
    {
      id: "want-to", group: "Wanting", name: "I want to…",
      tip: "yào + action: wǒ yào hē chá = I want to drink tea.",
      core: ["verb:yao"], slots: { S: actors, V: L.verb, O: L.thing }, valid: strangeVO, flags: ["neg", "q"],
      alts: { "verb:yao": ["verb:xiang"] },
      make(f, E) {
        const v = E.verb(f.V).base;
        return {
          t: [f.S, f.neg && BU, "verb:yao", f.V, f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} want to ${v} ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want to ${v} ${E.thing(f.O)}.`
            : `${E.S(f.S)} ${E.v(f.S, "want", "wants")} to ${v} ${E.thing(f.O)}.`
        };
      }
    },
    {
      id: "would-like", group: "Wanting", name: "I'd like to…",
      tip: "xiǎng is softer than yào and goes before an action: wǒ xiǎng qù = I'd like to go.",
      core: ["verb:xiang"], slots: { S: actors, V: L.verb, O: L.thing }, valid: strangeVO, flags: ["neg", "q"],
      alts: { "verb:xiang": ["verb:yao"] },
      make(f, E) {
        const v = E.verb(f.V).base;
        return {
          t: [f.S, f.neg && BU, "verb:xiang", f.V, f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `Would ${E.s(f.S)} like to ${v} ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want to ${v} ${E.thing(f.O)}.`
            : `${E.S(f.S)} would like to ${v} ${E.thing(f.O)}.`
        };
      }
    },

    // ----- Liking
    {
      id: "like-thing", group: "Liking", name: "The fish likes…",
      tip: "xǐhuan + thing: wǒ xǐhuan chá = I like tea.",
      core: ["verb:xihuan"], slots: { S: actors, O: L.thing }, flags: ["neg", "q"], valid: thingDoes,
      make(f, E) {
        return {
          t: [f.S, f.neg && BU, "verb:xihuan", f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} like ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} like ${E.thing(f.O)}.`
            : `${E.S(f.S)} ${E.v(f.S, "like", "likes")} ${E.thing(f.O)}.`
        };
      }
    },
    {
      id: "like-doing", group: "Liking", name: "I like doing…",
      tip: "xǐhuan + action: wǒ xǐhuan hē chá = I like drinking tea.",
      core: ["verb:xihuan"], slots: { S: actors, V: L.verb, O: L.thing }, valid: strangeVO, flags: ["neg", "q"],
      make(f, E) {
        const v = E.verb(f.V).ing;
        return {
          t: [f.S, f.neg && BU, "verb:xihuan", f.V, f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} like ${v} ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} like ${v} ${E.thing(f.O)}.`
            : `${E.S(f.S)} ${E.v(f.S, "like", "likes")} ${v} ${E.thing(f.O)}.`
        };
      }
    },
    {
      id: "also", group: "Liking", name: "…too",
      tip: "yě (also) goes before the verb: wǒ yě hē chá = I drink tea too.",
      core: ["build:ye"], slots: { S: actors, V: L.verb, O: L.thing }, valid: strangeVO, flags: ["neg"],
      make(f, E) {
        const vb = E.verb(f.V);
        return {
          t: [f.S, "build:ye", f.neg && BU, f.V, f.O],
          end: ".",
          en: f.neg ? `${E.S(f.S)} ${E.dont(f.S)} ${vb.base} ${E.thing(f.O)} either.`
            : `${E.S(f.S)} ${E.third(f.S) ? vb.s : vb.base} ${E.thing(f.O)} too.`
        };
      }
    },

    // ----- Describing
    {
      id: "describe", group: "Describing", name: "It's very…",
      tip: "Use hěn before a describing word, with no word for 'is': chá hěn rè = the tea is hot.",
      core: ["build:hen"], slots: { X: [...L.person, ...L.thing], D: L.adj }, flags: ["neg", "q"],
      noQ: ["build:wo"], valid: f => !sensibleAdj(f.X, f.D),
      make(f, E) {
        if (f.q && f.X === "build:ni" && f.D === "adj:hao") return { t: [f.X, f.D, MA], end: "?", en: "How are you?" };
        if (f.q) return { t: [f.X, f.D, MA], end: "?", en: `${E.Be(f.X)} ${E.s(f.X)} ${E.adj(f.D)}?` };
        if (f.neg) return { t: [f.X, BU, f.D], end: ".", en: `${E.beNot(f.X)} ${E.adj(f.D)}.` };
        return { t: [f.X, HEN, f.D], end: ".", en: `${E.isVery(f.X)} ${E.adj(f.D)}.` };
      }
    },
    {
      id: "too", group: "Describing", name: "It's too…!",
      tip: "tài … le = too …: tài guì le! = too expensive!",
      core: ["build:tai"], slots: { X: [...L.person, ...L.thing], D: L.adj }, valid: f => !sensibleAdj(f.X, f.D),
      make(f, E) {
        return { t: [f.X, "build:tai", f.D, "x:le"], end: "!", en: `${E.beSubj(f.X)} too ${E.adj(f.D)}!` };
      }
    },

    // ----- Having
    {
      id: "have", group: "Having", name: "I have…",
      tip: "Not having uses méi, never bù: wǒ méi yǒu = I don't have.",
      core: ["verb:you"], slots: { S: actors, O: L.thing }, flags: ["neg", "q"], valid: thingDoes,
      make(f, E) {
        return {
          t: [f.S, f.neg && "build:mei", "verb:you", f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} have ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} have ${E.thing(f.O)}.`
            : `${E.S(f.S)} ${E.v(f.S, "have", "has")} ${E.thing(f.O)}.`
        };
      },
      needsNeg: ["build:mei"]
    },

    // ----- Prices and counting
    {
      id: "price-ask", group: "Prices & counting", name: "How much is…?",
      tip: "Put duōshao qián after the thing: chá duōshao qián? No ma: duōshao already makes it a question.",
      core: ["build:duoshao", "money:qian"], slots: { O: [...L.person, "money:pengyou", "money:qian"] },
      make(f, E) {
        if (PEOPLE[f.O]) return { t: [f.O, "build:duoshao", "money:qian"], end: "?", en: `How much ${E.be(f.O)} ${E.s(f.O)}?` };
        return { t: [f.O, "build:duoshao", "money:qian"], end: "?", en: `How much ${E.pl(f.O) ? "are" : "is"} the ${E.thing(f.O)}?` };
      }
    },
    {
      id: "price", group: "Prices & counting", name: "… yuan",
      tip: "Number + kuài (+ qián): sān kuài qián = 3 yuan.",
      core: ["money:kuai", "money:qian"], slots: { X: [...L.person, "money:pengyou"], N: L.count },
      make(f, E) {
        return { t: [f.X, f.N, "money:kuai", "money:qian"], end: ".", en: `${E.beSubj(f.X)} ${E.digit(f.N)} yuan.` };
      }
    },
    {
      id: "count", group: "Prices & counting", name: "I want three…",
      tip: "Number + gè + thing: sān gè jiǎozi = three dumplings.",
      core: ["build:ge", "verb:yao"], slots: { S: actors, N: L.count, O: L.countable }, valid: thingDoes,
      make(f, E) {
        return {
          t: [f.S, "verb:yao", f.N, "build:ge", f.O], end: ".",
          en: `${E.S(f.S)} ${E.v(f.S, "want", "wants")} ${E.numWord(f.N)} ${E.count(f.O, f.N)}.`
        };
      }
    },

    // ----- Where
    {
      id: "where-go", group: "Where", name: "Where's the tea going?",
      tip: "nǐ qù nǎr? = you go where? No ma: nǎr already makes it a question.",
      core: ["verb:qu", "build:nar"], slots: { S: objects },
      make(f, E) { return { t: [f.S, "verb:qu", "build:nar"], end: "?", en: `Where ${E.be(f.S)} ${E.s(f.S)} going?` }; }
    },

    // ----- Plans
    {
      id: "sur-go", group: "Plans", name: "The beer's going tomorrow",
      tip: "Time words go before the verb: wǒ míngtiān qù = I tomorrow go.",
      core: ["verb:qu"], slots: { S: objects, T: L.time }, flags: ["neg", "q"],
      make(f, E) {
        return {
          t: [f.S, f.T, f.neg && BU, "verb:qu", f.q && MA],
          // The time word can also go first: míngtiān wǒ qù.
          also: [[f.T, f.S, f.neg && BU, "verb:qu", f.q && MA]],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going ${E.time(f.T)}?`
            : f.neg ? `${E.beNot(f.S)} going ${E.time(f.T)}.`
            : `${E.beSubj(f.S)} going ${E.time(f.T)}.`
        };
      }
    },
    {
      id: "sur-come", group: "Plans", name: "The fish is coming today",
      tip: "Time words go before the verb: tā jīntiān lái = he today comes.",
      core: ["verb:lai"], slots: { S: objects, T: L.time }, flags: ["neg", "q"],
      make(f, E) {
        return {
          t: [f.S, f.T, f.neg && BU, "verb:lai", f.q && MA],
          also: [[f.T, f.S, f.neg && BU, "verb:lai", f.q && MA]],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} coming ${E.time(f.T)}?`
            : f.neg ? `${E.beNot(f.S)} coming ${E.time(f.T)}.`
            : `${E.beSubj(f.S)} coming ${E.time(f.T)}.`
        };
      }
    },

    // ----- This and that
    {
      id: "is-a", group: "This and that", name: "I am rice",
      tip: "shì links two things: wǒ shì lǎoshī = I am a teacher. Or, here, wǒ shì mǐfàn = I am rice.",
      core: ["build:shi"], slots: { X: [...L.person, ...objects], Y: [...objects, "money:pengyou"] }, flags: ["neg", "q"],
      noQ: ["build:wo"],
      valid: f => f.X !== f.Y && !(PEOPLE[f.X] && f.Y === "money:pengyou"),
      make(f, E) {
        const y = bare(f.Y);
        return {
          t: [f.X, f.neg && BU, "build:shi", f.Y, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Be(f.X)} ${E.s(f.X)} ${y}?` : f.neg ? `${E.beNot(f.X)} ${y}.` : `${E.beSubj(f.X)} ${y}.`
        };
      }
    },
    {
      id: "greet-thing", group: "This and that", name: "Hello, tea!",
      tip: "Say hello (or sorry, or thank you) to anything you like: chá, nǐ hǎo! = tea, hello!",
      core: ["greet:nihao"], slots: { G: ["greet:nihao", "greet:xiexie", "greet:duibuqi", "greet:zaijian", "greet:zao"], O: objects },
      make(f, E) {
        const g = { "greet:nihao": "Hello", "greet:xiexie": "Thank you", "greet:duibuqi": "Sorry", "greet:zaijian": "Goodbye", "greet:zao": "Morning" }[f.G];
        return { t: [f.O, ",", f.G], also: [[f.G, ",", f.O]], end: "!", en: `${g}, ${bare(f.O)}!` };
      }
    },
    {
      id: "mine", group: "This and that", name: "This is the tea's…",
      tip: "de shows whose it is: wǒ de chá = my tea.",
      core: ["build:shi", "build:de"], slots: { D: L.dem, S: objects, O: L.thing }, flags: ["neg", "q"],
      valid: f => f.S !== f.O,
      make(f, E) {
        E = Object.assign({}, E, { poss: id => "the " + THINGS[id].en + (THINGS[id].pl ? "'" : "'s") });
        const near = f.D === "build:zhe", pl = E.pl(f.O);
        const dem = pl ? (near ? "these" : "those") : (near ? "this" : "that");
        const be = pl ? "are" : "is";
        return {
          t: [f.D, f.neg && BU, "build:shi", f.S, "build:de", f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.cap(be)} ${dem} ${E.poss(f.S)} ${E.thing(f.O)}?`
            : f.neg ? `${E.cap(dem)} ${be}n't ${E.poss(f.S)} ${E.thing(f.O)}.`
            : `${E.cap(dem)} ${be} ${E.poss(f.S)} ${E.thing(f.O)}.`
        };
      }
    },

    // ----- Knowing and asking
    {
      id: "know", group: "Knowing & asking", name: "The rice doesn't know",
      tip: "bù zhīdào = don't know. Add ma to ask: nǐ zhīdào ma?",
      core: ["verb:zhidao"], slots: { S: objects }, flags: ["neg", "q"],
      make(f, E) {
        return {
          t: [f.S, f.neg && BU, "verb:zhidao", f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} know?`
            : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} know.`
            : `${E.S(f.S)} ${E.v(f.S, "know", "knows")}.`
        };
      }
    },
    {
      id: "can", group: "Knowing & asking", name: "Can I…?",
      tip: "kěyǐ = can / may. wǒ kěyǐ … ma? asks permission.",
      core: ["build:keyi"], slots: { S: actors, V: L.verb, O: L.thing }, valid: strangeVO, flags: ["neg", "q"],
      make(f, E) {
        const v = E.verb(f.V).base;
        return {
          t: [f.S, f.neg && BU, "build:keyi", f.V, f.O, f.q && MA],
          end: f.q ? "?" : ".",
          en: f.q ? `Can ${E.s(f.S)} ${v} ${E.thing(f.O)}?`
            : f.neg ? `${E.S(f.S)} can't ${v} ${E.thing(f.O)}.`
            : `${E.S(f.S)} can ${v} ${E.thing(f.O)}.`
        };
      }
    },
    {
      id: "and-you", group: "Knowing & asking", name: "…and you?",
      tip: "ne turns it back to the other person: wǒ hěn hǎo, nǐ ne? = I'm well, and you?",
      core: ["build:ne", "build:hen"], slots: { S: objects, D: L.feel }, valid: f => !sensibleAdj(f.S, f.D),
      make(f, E) {
        const d = f.D === "adj:hao" ? "well" : E.adj(f.D);
        return { t: [f.S, HEN, f.D, ",", "build:ni", "build:ne"], end: "?", en: `${E.isVery(f.S)} ${d}. What about you?` };
      }
    }
  ];

  // ---------------------------------------------------------------- sensible sections
  // The four sensible sections use the same kind of patterns as Surreal Sentences, but their
  // slots only take words that make sense together (drinks with hē, food with chī…), so every
  // sentence is one you might really say. Each section also has replies (always 2+ words).
  //
  // A reply is { id, q: [word IDs], qen: "English", a: [{ t: [...], en: "..." }, …] }.
  // { any: "drink" } accepts any word from that list; {x} in the English is replaced by it.

  const S_ = {
    drink: L.drink, eat: L.eat, food: L.food,
    temp: ["adj:re", "adj:leng"],
    feel: ["adj:hao", "adj:lei"],
    orderable: ["food:jiaozi", "food:kafei", "food:pijiu"],
    shopAdj: ["adj:gui", "adj:da", "adj:xiao"],
    people: L.person,
    count: L.count,
    time: L.time,
    dem: L.dem
  };
  const pickG = (v, g) => Array.isArray(v) ? v[g] : v;
  // "me", "him/her", or "the tea": a person or thing as the object of a verb.
  const objEn = (id, E, g) => PEOPLE[id] ? pickG(PEOPLE[id].o, g) : "the " + E.thing(id);
  // "I'm" stays capitalised; "You're" → "you're" mid-sentence.
  const lc = s => /^I['\s]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
  const NUM = id => NUMBERS[id][0];
  // The verb that goes with a food or drink.
  const verbFor = id => S_.drink.includes(id) ? "verb:he" : "verb:chi";
  const verbEn = id => S_.drink.includes(id) ? "drink" : "eat";

  const SECTIONS = [
    // ===================================================== Meeting people
    {
      id: "meet", name: "Meeting people", sub: "How are you, friends, not knowing",
      items: [
        {
          id: "meet-feel", group: "How are you?", name: "I'm very well / tired",
          tip: "hěn + describing word, no word for 'am': wǒ hěn lèi = I'm (very) tired.",
          core: ["build:hen"], slots: { S: S_.people, D: S_.feel }, flags: ["neg", "q"],
          make(f, E) {
            const d = f.D === "adj:hao" ? "well" : "tired";
            if (f.q && f.S === "build:ni" && f.D === "adj:hao") return { t: [f.S, f.D, MA], end: "?", en: "How are you?" };
            if (f.q) return { t: [f.S, f.D, MA], end: "?", en: `${E.Be(f.S)} ${E.s(f.S)} ${d}?` };
            if (f.neg) return { t: [f.S, BU, f.D], end: ".", en: `${E.beNot(f.S)} ${d}.` };
            return { t: [f.S, HEN, f.D], end: ".", en: `${E.isVery(f.S)} ${d}.` };
          }
        },
        {
          id: "meet-andyou", group: "How are you?", name: "…and you?",
          tip: "ne turns it back to the other person: wǒ hěn hǎo, nǐ ne? = I'm well, and you?",
          core: ["build:ne", "build:hen"], slots: { S: ["build:wo", "build:women"], D: S_.feel },
          make(f, E) {
            const d = f.D === "adj:hao" ? "well" : "tired";
            return { t: [f.S, HEN, f.D, ",", "build:ni", "build:ne"], end: "?", en: `${E.isVery(f.S)} ${d}. And you?` };
          }
        },
        {
          id: "meet-thanks", group: "How are you?", name: "Very well, thanks",
          tip: "Add xièxie after a comma to say thanks.",
          core: ["build:hen", "greet:xiexie"], slots: { S: ["build:wo", "build:women"], D: ["adj:hao"] },
          make(f, E) {
            const d = f.D === "adj:hao" ? "well" : "tired";
            return { t: [f.S, HEN, f.D, ",", "greet:xiexie"], end: ".", en: `${E.isVery(f.S)} ${d}, thank you.` };
          }
        },
        {
          id: "meet-too", group: "How are you?", name: "Me too",
          tip: "yě (also) goes straight after who: wǒ yě hěn lèi = I'm very tired too.",
          core: ["build:ye", "build:hen"], slots: { S: S_.people, D: S_.feel },
          make(f, E) {
            const d = f.D === "adj:hao" ? "well" : "tired";
            return { t: [f.S, "build:ye", HEN, f.D], end: ".", en: `${E.isVery(f.S)} ${d} too.` };
          }
        },
        {
          id: "meet-friend", group: "Friends", name: "He's my friend",
          tip: "de shows whose: wǒ de péngyou = my friend.",
          core: ["build:shi", "build:de", "money:pengyou"], slots: { S: S_.people, P: S_.people }, flags: ["neg", "q"],
          // Not "I'm my friend" or "I'm our friend".
          valid: f => f.S !== f.P && !(["build:wo", "build:women"].includes(f.S) && ["build:wo", "build:women"].includes(f.P)),
          make(f, E) {
            const fr = f.S === "build:women" ? "friends" : "friend";
            return {
              t: [f.S, f.neg && BU, "build:shi", f.P, "build:de", "money:pengyou", f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} ${E.poss(f.P)} ${fr}?`
                : f.neg ? `${E.beNot(f.S)} ${E.poss(f.P)} ${fr}.`
                : `${E.beSubj(f.S)} ${E.poss(f.P)} ${fr}.`
            };
          }
        },
        {
          id: "meet-know", group: "Not knowing", name: "I don't know",
          tip: "bù zhīdào = don't know. Add ma to ask: nǐ zhīdào ma?",
          core: ["verb:zhidao"], slots: { S: S_.people }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, f.neg && BU, "verb:zhidao", f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} know?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} know.` : `${E.S(f.S)} ${E.v(f.S, "know", "knows")}.`
            };
          }
        },
        {
          id: "meet-sorry", group: "Not knowing", name: "Sorry, I don't know",
          tip: "duìbuqǐ (sorry) comes first, then a comma.",
          core: ["greet:duibuqi", "verb:zhidao"], slots: { S: ["build:wo", "build:women"] },
          make(f, E) { return { t: ["greet:duibuqi", ",", f.S, BU, "verb:zhidao"], end: ".", en: `Sorry, ${E.s(f.S)} ${E.dont(f.S)} know.` }; }
        },
        { id: "mr-howareyou", q: ["build:ni", "adj:hao", "build:ma"], qen: "How are you?",
          a: [{ t: ["build:wo", "build:hen", "adj:hao", ",", "greet:xiexie"], en: "I'm very well, thank you." },
              { t: ["build:wo", "build:hen", "adj:hao", ",", "build:ni", "build:ne"], en: "I'm very well. And you?" }] },
        { id: "mr-tired", q: ["build:ni", "adj:lei", "build:ma"], qen: "Are you tired?",
          a: [{ t: ["build:wo", "build:hen", "adj:lei"], en: "I'm very tired." }, { t: ["build:wo", "build:bu", "adj:lei"], en: "I'm not tired." }] },
        { id: "mr-know", q: ["build:ni", "verb:zhidao", "build:ma"], qen: "Do you know?",
          a: [{ t: ["build:wo", "build:bu", "verb:zhidao"], en: "I don't know." }, { t: ["build:wo", "verb:zhidao"], en: "I know." },
              { t: ["build:bu", "verb:zhidao"], en: "Don't know." }] }
      ]
    },

    // ===================================================== Eating & drinking
    {
      id: "eat", name: "Eating & drinking", sub: "Ordering, likes and dislikes",
      items: [
        {
          id: "eat-want", group: "Ordering", name: "I want to eat / drink…",
          tip: "yào + hē (drink) or chī (eat) + the food: wǒ yào hē chá.",
          core: ["verb:yao"], slots: { S: S_.people, O: S_.food }, flags: ["neg", "q"],
          alts: { "verb:yao": ["verb:xiang"] },
          make(f, E) {
            const V = verbFor(f.O), v = verbEn(f.O);
            return {
              t: [f.S, f.neg && BU, "verb:yao", V, f.O, f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} want to ${v} ${E.thing(f.O)}?`
                : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want to ${v} ${E.thing(f.O)}.`
                : `${E.S(f.S)} ${E.v(f.S, "want", "wants")} to ${v} ${E.thing(f.O)}.`
            };
          }
        },
        {
          id: "eat-wouldlike", group: "Ordering", name: "I'd like to eat / drink…",
          tip: "xiǎng is softer than yào: wǒ xiǎng chī jiǎozi = I'd like to eat dumplings.",
          core: ["verb:xiang"], slots: { S: S_.people, O: S_.food }, flags: ["q"],
          alts: { "verb:xiang": ["verb:yao"] },
          make(f, E) {
            const V = verbFor(f.O), v = verbEn(f.O);
            return {
              t: [f.S, "verb:xiang", V, f.O, f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `Would ${E.s(f.S)} like to ${v} ${E.thing(f.O)}?` : `${E.S(f.S)} would like to ${v} ${E.thing(f.O)}.`
            };
          }
        },
        {
          id: "eat-count", group: "Ordering", name: "Three dumplings",
          tip: "Number + gè + thing: sān gè jiǎozi.",
          core: ["verb:yao", "build:ge"], slots: { S: S_.people, N: S_.count, O: S_.orderable },
          make(f, E) {
            return { t: [f.S, "verb:yao", f.N, "build:ge", f.O], end: ".", en: `${E.S(f.S)} ${E.v(f.S, "want", "wants")} ${E.numWord(f.N)} ${E.count(f.O, f.N)}.` };
          }
        },
        {
          id: "eat-please", group: "Ordering", name: "Please have some…",
          tip: "qǐng + verb is a polite offer: qǐng hē chá = please have some tea.",
          core: ["greet:qing"], slots: { O: S_.food },
          make(f, E) { return { t: ["greet:qing", verbFor(f.O), f.O], end: ".", en: `Please have some ${E.thing(f.O)}.` }; }
        },
        {
          id: "eat-like", group: "Likes", name: "I like eating / drinking…",
          tip: "xǐhuan + chī/hē + food: wǒ xǐhuan chī yú = I like eating fish.",
          core: ["verb:xihuan"], slots: { S: S_.people, O: S_.food }, flags: ["neg", "q"],
          make(f, E) {
            const V = verbFor(f.O), v = verbEn(f.O) + "ing";
            return {
              t: [f.S, f.neg && BU, "verb:xihuan", V, f.O, f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} like ${v} ${E.thing(f.O)}?`
                : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} like ${v} ${E.thing(f.O)}.`
                : `${E.S(f.S)} ${E.v(f.S, "like", "likes")} ${v} ${E.thing(f.O)}.`
            };
          }
        },
        {
          id: "eat-dont", group: "Likes", name: "I don't eat / drink…",
          tip: "bù before the verb: wǒ bù hē píjiǔ = I don't drink beer.",
          core: ["build:bu"], slots: { S: S_.people, O: S_.food },
          make(f, E) { return { t: [f.S, BU, verbFor(f.O), f.O], end: ".", en: `${E.S(f.S)} ${E.dont(f.S)} ${verbEn(f.O)} ${E.thing(f.O)}.` }; }
        },
        {
          id: "eat-too", group: "Likes", name: "I like it too",
          tip: "yě goes before the verb: wǒ yě xǐhuan chá = I like tea too.",
          core: ["build:ye", "verb:xihuan"], slots: { S: S_.people, O: S_.food },
          make(f, E) { return { t: [f.S, "build:ye", "verb:xihuan", f.O], end: ".", en: `${E.S(f.S)} ${E.v(f.S, "like", "likes")} ${E.thing(f.O)} too.` }; }
        },
        {
          id: "eat-hot", group: "Describing food", name: "It's very hot / cold",
          tip: "No word for 'is' before a describing word: chá hěn rè = the tea is (very) hot.",
          core: ["build:hen"], slots: { O: S_.food, A: S_.temp }, flags: ["neg", "q"],
          make(f, E) {
            if (f.q) return { t: [f.O, f.A, MA], end: "?", en: `${E.Be(f.O)} the ${E.thing(f.O)} ${E.adj(f.A)}?` };
            if (f.neg) return { t: [f.O, BU, f.A], end: ".", en: `${E.beNot(f.O)} ${E.adj(f.A)}.` };
            return { t: [f.O, HEN, f.A], end: ".", en: `${E.isVery(f.O)} ${E.adj(f.A)}.` };
          }
        },
        {
          id: "eat-toohot", group: "Describing food", name: "Too hot!",
          tip: "tài … le = too …: kāfēi tài rè le! = the coffee's too hot!",
          core: ["build:tai"], slots: { O: S_.food, A: S_.temp },
          make(f, E) { return { t: [f.O, "build:tai", f.A, "x:le"], end: "!", en: `${E.beSubj(f.O)} too ${E.adj(f.A)}!` }; }
        },
        {
          id: "eat-have", group: "Describing food", name: "Do you have noodles?",
          tip: "Not having uses méi: wǒmen méi yǒu yú = we don't have fish.",
          core: ["verb:you"], slots: { S: S_.people, O: S_.food }, flags: ["neg", "q"], needsNeg: ["build:mei"],
          make(f, E) {
            return {
              t: [f.S, f.neg && "build:mei", "verb:you", f.O, f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} have ${E.thing(f.O)}?`
                : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} have ${E.thing(f.O)}.`
                : `${E.S(f.S)} ${E.v(f.S, "have", "has")} ${E.thing(f.O)}.`
            };
          }
        },
        {
          id: "eat-hotfood", group: "Hot or cold", name: "We'd like hot dumplings",
          tip: "Describing word + de + food: rè de jiǎozi = hot dumplings. It's the same de as in wǒ de (my).",
          core: ["build:de", "verb:xiang"], slots: { S: S_.people, A: S_.temp, O: S_.food }, flags: ["q"],
          // Cold works for drinks; hot for anything but beer.
          valid: f => f.A === "adj:leng" ? S_.drink.includes(f.O) : f.O !== "food:pijiu",
          alts: { "verb:xiang": ["verb:yao"] },
          make(f, E) {
            const a = f.A === "adj:re" ? "hot" : "cold", v = verbEn(f.O);
            return {
              t: [f.S, "verb:xiang", verbFor(f.O), f.A, "build:de", f.O, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `Would ${E.s(f.S)} like to ${v} ${a} ${E.thing(f.O)}?` : `${E.S(f.S)} would like to ${v} ${a} ${E.thing(f.O)}.`
            };
          }
        },
        {
          id: "eat-whatlike", group: "Ordering", name: "What would you like to eat?",
          tip: "shénme (what) goes where the answer would go, at the end: nǐ xiǎng chī shénme? = you'd like to eat what?",
          core: ["build:shenme", "verb:xiang"], slots: { S: ["build:ni", "build:ta"], V: ["verb:chi", "verb:he"] },
          alts: { "verb:xiang": ["verb:yao"] },
          make(f, E) {
            const v = f.V === "verb:he" ? "drink" : "eat";
            return { t: [f.S, "verb:xiang", f.V, "build:shenme"], end: "?", en: `What would ${E.s(f.S)} like to ${v}?` };
          }
        },
        {
          id: "eat-alot", group: "Likes and dislikes", name: "He drinks a lot of coffee",
          tip: "hěn duō = a lot of, straight before the thing: hěn duō kāfēi = a lot of coffee.",
          core: ["adj:duo", "build:hen"], slots: { S: S_.people, O: S_.food },
          make(f, E) {
            const v = verbEn(f.O);
            return { t: [f.S, verbFor(f.O), HEN, "adj:duo", f.O], end: ".", en: `${E.S(f.S)} ${E.v(f.S, v, v + "s")} a lot of ${E.thing(f.O)}.` };
          }
        },
        { id: "er-drink", q: ["build:ni", "verb:yao", "verb:he", "build:shenme"], qen: "What do you want to drink?",
          a: [{ t: ["build:wo", "verb:yao", "verb:he", { any: "drink" }], en: "I want to drink {x}." },
              { t: ["build:wo", "verb:xiang", "verb:he", { any: "drink" }], en: "I'd like to drink {x}." }] },
        { id: "er-eat", q: ["build:ni", "verb:xiang", "verb:chi", "build:shenme"], qen: "What would you like to eat?",
          a: [{ t: ["build:wo", "verb:xiang", "verb:chi", { any: "eat" }], en: "I'd like to eat {x}." },
              { t: ["build:wo", "verb:yao", "verb:chi", { any: "eat" }], en: "I want to eat {x}." }] },
        { id: "er-likecoffee", q: ["build:ni", "verb:xihuan", "food:kafei", "build:ma"], qen: "Do you like coffee?",
          a: [{ t: ["build:wo", "verb:xihuan"], en: "I like it." }, { t: ["build:wo", "build:bu", "verb:xihuan"], en: "I don't like it." },
              { t: ["build:bu", "verb:xihuan"], en: "No, I don't like it." }] }
      ]
    },

    // ===================================================== Shopping & money
    {
      id: "shop", name: "Shopping & money", sub: "Prices, buying, too expensive",
      items: [
        {
          id: "shop-thisone", group: "Prices", name: "How much is this one?",
          tip: "zhè gè = this one, nà gè = that one. No ma: duōshao already asks.",
          core: ["build:ge", "build:duoshao", "money:qian"], slots: { D: S_.dem },
          make(f, E) { return { t: [f.D, "build:ge", "build:duoshao", "money:qian"], end: "?", en: `How much is ${f.D === "build:zhe" ? "this" : "that"} one?` }; }
        },
        {
          id: "shop-howmuch", group: "Prices", name: "How much is the tea?",
          tip: "Put duōshao qián after the thing. No ma: duōshao already asks.",
          core: ["build:duoshao", "money:qian"], slots: { O: S_.food },
          make(f, E) { return { t: [f.O, "build:duoshao", "money:qian"], end: "?", en: `How much ${E.pl(f.O) ? "are" : "is"} the ${E.thing(f.O)}?` }; }
        },
        {
          id: "shop-yuan", group: "Prices", name: "… yuan",
          tip: "Number + kuài + qián: bā kuài qián = 8 yuan.",
          core: ["money:kuai", "money:qian"], slots: { N: S_.count },
          make(f, E) { return { t: [f.N, "money:kuai", "money:qian"], end: ".", en: `${E.digit(f.N)} yuan.` }; }
        },
        {
          id: "shop-ok", group: "Prices", name: "… yuan, is that okay?",
          tip: "kěyǐ ma? = is that okay? / may I?",
          core: ["money:kuai", "build:keyi"], slots: { N: S_.count },
          make(f, E) { return { t: [f.N, "money:kuai", ",", "build:keyi", MA], end: "?", en: `${E.digit(f.N)} yuan, is that okay?` }; }
        },
        {
          id: "shop-tooexp", group: "Too expensive", name: "This one's too expensive!",
          tip: "tài … le = too …: zhè gè tài guì le!",
          core: ["build:ge", "build:tai"], slots: { D: S_.dem, A: S_.shopAdj },
          make(f, E) { return { t: [f.D, "build:ge", "build:tai", f.A, "x:le"], end: "!", en: `${f.D === "build:zhe" ? "This" : "That"} one is too ${E.adj(f.A)}!` }; }
        },
        {
          id: "shop-very", group: "Too expensive", name: "That one's very big",
          tip: "hěn + describing word: nà gè hěn dà = that one is (very) big.",
          core: ["build:ge", "build:hen"], slots: { D: S_.dem, A: S_.shopAdj }, flags: ["neg", "q"],
          make(f, E) {
            const one = f.D === "build:zhe" ? "this one" : "that one";
            if (f.q) return { t: [f.D, "build:ge", f.A, MA], end: "?", en: `Is ${one} ${E.adj(f.A)}?` };
            if (f.neg) return { t: [f.D, "build:ge", BU, f.A], end: ".", en: `${E.cap(one)} isn't ${E.adj(f.A)}.` };
            return { t: [f.D, "build:ge", HEN, f.A], end: ".", en: `${E.cap(one)} is very ${E.adj(f.A)}.` };
          }
        },
        {
          id: "shop-buy", group: "Buying", name: "I want to buy…",
          tip: "yào mǎi = want to buy: wǒ yào mǎi kāfēi.",
          core: ["verb:yao", "verb:mai"], slots: { S: S_.people, O: S_.food }, flags: ["neg", "q"],
          alts: { "verb:yao": ["verb:xiang"] },
          make(f, E) {
            return {
              t: [f.S, f.neg && BU, "verb:yao", "verb:mai", f.O, f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} want to buy ${E.thing(f.O)}?`
                : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want to buy ${E.thing(f.O)}.`
                : `${E.S(f.S)} ${E.v(f.S, "want", "wants")} to buy ${E.thing(f.O)}.`
            };
          }
        },
        {
          id: "shop-buythis", group: "Buying", name: "I'll buy this one",
          tip: "zhè gè works like a noun: wǒ mǎi zhè gè = I'll buy this one.",
          core: ["verb:mai", "build:ge"], slots: { S: S_.people, D: S_.dem }, flags: ["neg"],
          make(f, E) {
            const one = f.D === "build:zhe" ? "this one" : "that one";
            return {
              t: [f.S, f.neg && BU, "verb:mai", f.D, "build:ge"], end: ".",
              en: f.neg ? `${E.beNot(f.S)} buying ${one}.` : `${E.beSubj(f.S)} buying ${one}.`
            };
          }
        },
        {
          id: "shop-buyn", group: "Buying", name: "I'll buy three",
          tip: "Number + gè on its own = that many: wǒ mǎi sān gè = I'll buy three.",
          core: ["verb:mai", "build:ge"], slots: { S: S_.people, N: S_.count },
          make(f, E) { return { t: [f.S, "verb:mai", f.N, "build:ge"], end: ".", en: `${E.beSubj(f.S)} buying ${E.numWord(f.N)}.` }; }
        },
        {
          id: "shop-money", group: "Buying", name: "I don't have money",
          tip: "Not having uses méi, never bù: wǒ méi yǒu qián.",
          core: ["verb:you", "money:qian"], slots: { S: S_.people }, flags: ["neg", "q"], needsNeg: ["build:mei"],
          make(f, E) {
            return {
              t: [f.S, f.neg && "build:mei", "verb:you", "money:qian", f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} have money?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} have any money.` : `${E.S(f.S)} ${E.v(f.S, "have", "has")} money.`
            };
          }
        },
        {
          id: "shop-bigone", group: "Choosing", name: "I'd like the big one",
          tip: "Describing word + de = 'the … one': dà de = the big one. yǒu xiǎo de ma? = is there a small one?",
          core: ["build:de"], slots: { S: ["build:wo", "build:women"], A: ["adj:da", "adj:xiao"], H: ["verb:yao", "verb:you"] },
          make(f, E) {
            const a = f.A === "adj:da" ? "big" : "small";
            if (f.H === "verb:you") return { t: ["verb:you", f.A, "build:de", MA], end: "?", en: `Do you have a ${a} one?` };
            return { t: [f.S, "verb:yao", f.A, "build:de"], end: ".", en: `${E.S(f.S)}'d like the ${a} one.` };
          },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "shop-teens", group: "Prices", name: "12 yuan, 20 yuan",
          tip: "Numbers above 10 are built from 1–10: shí'èr = 10-2 = 12, èrshí = 2-10 = 20. Here 2 is èr.",
          core: ["num:shi", "money:kuai"], slots: { T: ["x:0", "num:er", "num:san", "num:wu", "num:ba"], U: ["x:0", "num:yi", "num:er", "num:san", "num:wu", "num:liu", "num:jiu"] },
          valid: f => f.T !== "x:0" || f.U !== "x:0" || Math.random() < .3,
          make(f) {
            const t = f.T === "x:0" ? 1 : NUM(f.T), u = f.U === "x:0" ? 0 : NUM(f.U);
            const num = [f.T !== "x:0" && f.T, "num:shi", f.U !== "x:0" && f.U];
            return { t: [...num, "money:kuai", "money:qian"], also: [[...num, "money:kuai"]], end: ".", en: `${t * 10 + u} yuan.` };
          }
        },
        { id: "sr-price", q: ["build:duoshao", "money:qian"], qen: "How much is it?",
          a: [{ t: [{ any: "count" }, "money:kuai", "money:qian"], en: "{x} yuan." }] },
        { id: "sr-money", q: ["build:ni", "verb:you", "money:qian", "build:ma"], qen: "Do you have money?",
          a: [{ t: ["build:wo", "verb:you", "money:qian"], en: "I have money." }, { t: ["build:wo", "build:mei", "verb:you", "money:qian"], en: "I don't have any money." },
              { t: ["build:mei", "verb:you"], en: "No, I don't." }] },
        { id: "sr-buy", q: ["build:ni", "verb:yao", "verb:mai", "build:shenme"], qen: "What do you want to buy?",
          a: [{ t: ["build:wo", "verb:yao", "verb:mai", { any: "food" }], en: "I want to buy {x}." },
              { t: ["build:wo", "verb:xiang", "verb:mai", { any: "food" }], en: "I'd like to buy {x}." }] }
      ]
    },

    // ===================================================== Plans & places
    {
      id: "plans", name: "Plans & places", sub: "Where, today and tomorrow",
      items: [
        {
          id: "plans-where", group: "Where", name: "Where are you?",
          tip: "nǐ zài nǎr? = you are where? No ma: nǎr already asks.",
          core: ["verb:zai", "build:nar"], slots: { S: S_.people },
          make(f, E) { return { t: [f.S, "verb:zai", "build:nar"], end: "?", en: `Where ${E.be(f.S)} ${E.s(f.S)}?` }; }
        },
        {
          id: "plans-wherego", group: "Where", name: "Where are you going?",
          tip: "nǐ qù nǎr? = you go where? No ma: nǎr already asks.",
          core: ["verb:qu", "build:nar"], slots: { S: S_.people },
          make(f, E) { return { t: [f.S, "verb:qu", "build:nar"], end: "?", en: `Where ${E.be(f.S)} ${E.s(f.S)} going?` }; }
        },
        {
          id: "plans-go", group: "Today and tomorrow", name: "Going tomorrow",
          tip: "Time words go before the verb: wǒ míngtiān qù = I tomorrow go.",
          core: ["verb:qu"], slots: { S: S_.people, T: S_.time }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, f.T, f.neg && BU, "verb:qu", f.q && MA],
              also: [[f.T, f.S, f.neg && BU, "verb:qu", f.q && MA]],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going ${E.time(f.T)}?` : f.neg ? `${E.beNot(f.S)} going ${E.time(f.T)}.` : `${E.beSubj(f.S)} going ${E.time(f.T)}.`
            };
          }
        },
        {
          id: "plans-come", group: "Today and tomorrow", name: "Coming today",
          tip: "Time words go before the verb: tā jīntiān lái = he's coming today.",
          core: ["verb:lai"], slots: { S: S_.people, T: S_.time }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, f.T, f.neg && BU, "verb:lai", f.q && MA],
              also: [[f.T, f.S, f.neg && BU, "verb:lai", f.q && MA]],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} coming ${E.time(f.T)}?` : f.neg ? `${E.beNot(f.S)} coming ${E.time(f.T)}.` : `${E.beSubj(f.S)} coming ${E.time(f.T)}.`
            };
          }
        },
        {
          id: "plans-todo", group: "Today and tomorrow", name: "Going out to eat dumplings",
          tip: "qù + a verb means really going somewhere to do it: wǒmen qù chī jiǎozi = we're going (out) to eat dumplings. For a plan with no travelling, use yào.",
          core: ["verb:qu"], slots: { S: S_.people, T: S_.time, O: S_.food },
          make(f, E) {
            return {
              t: [f.S, f.T, "verb:qu", verbFor(f.O), f.O],
              also: [[f.T, f.S, "verb:qu", verbFor(f.O), f.O]],
              end: ".", en: `${E.beSubj(f.S)} going out to ${verbEn(f.O)} ${E.thing(f.O)} ${E.time(f.T)}.`
            };
          }
        },
        {
          id: "plans-will", group: "Today and tomorrow", name: "I'm going to eat vegetables today",
          tip: "For a plan ('going to'), use yào before the verb: wǒ jīntiān yào chī shūcài. No travelling involved.",
          core: ["verb:yao"], slots: { S: S_.people, T: S_.time, O: S_.food }, flags: ["q"],
          make(f, E) {
            const v = verbEn(f.O);
            return {
              t: [f.S, f.T, "verb:yao", verbFor(f.O), f.O, f.q && MA],
              also: [[f.T, f.S, "verb:yao", verbFor(f.O), f.O, f.q && MA]],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going to ${v} ${E.thing(f.O)} ${E.time(f.T)}?` : `${E.beSubj(f.S)} going to ${v} ${E.thing(f.O)} ${E.time(f.T)}.`
            };
          }
        },
        {
          id: "plans-weather", group: "Today and tomorrow", name: "It's hot today",
          tip: "No word for 'it': jīntiān hěn rè = today (is) very hot.",
          core: ["build:hen"], slots: { T: S_.time, A: S_.temp }, flags: ["neg", "q"],
          make(f, E) {
            const today = f.T === "money:jintian";
            const a = E.adj(f.A), w = E.time(f.T);
            if (f.q) return { t: [f.T, f.A, MA], end: "?", en: today ? `Is it ${a} today?` : `Will it be ${a} tomorrow?` };
            if (f.neg) return { t: [f.T, BU, f.A], end: ".", en: today ? `It isn't ${a} today.` : `It won't be ${a} tomorrow.` };
            return { t: [f.T, HEN, f.A], end: ".", en: today ? `It's very ${a} today.` : `It'll be very ${a} tomorrow.` };
          }
        },
        {
          id: "plans-tired", group: "Today and tomorrow", name: "I'm tired today",
          tip: "Time word after who (or first): wǒ jīntiān hěn lèi.",
          core: ["build:hen", "adj:lei", "money:jintian"], slots: { S: S_.people },
          make(f, E) {
            return { t: [f.S, "money:jintian", HEN, "adj:lei"], also: [["money:jintian", f.S, HEN, "adj:lei"]], end: ".", en: `${E.isVery(f.S)} tired today.` };
          }
        },
        {
          id: "plans-also", group: "Asking", name: "Are you going too?",
          tip: "yě goes before the verb: nǐ yě qù ma? = are you going too?",
          core: ["build:ye", "verb:qu"], slots: { S: S_.people }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, "build:ye", f.neg && BU, "verb:qu", f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going too?` : f.neg ? `${E.beNot(f.S)} going either.` : `${E.beSubj(f.S)} going too.`
            };
          }
        },
        {
          id: "plans-wantgo", group: "Asking", name: "Would you like to go?",
          tip: "xiǎng qù = would like to go.",
          core: ["verb:xiang", "verb:qu"], slots: { S: S_.people }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, f.neg && BU, "verb:xiang", "verb:qu", f.q && MA],
              end: f.q ? "?" : ".",
              en: f.q ? `Would ${E.s(f.S)} like to go?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want to go.` : `${E.S(f.S)} would like to go.`
            };
          }
        },
        {
          id: "plans-cancome", group: "Asking", name: "Can I come?",
          tip: "kěyǐ … ma? asks permission: wǒ kěyǐ lái ma? = can I come?",
          core: ["build:keyi", "verb:lai"], slots: { S: S_.people, V: ["verb:lai", "verb:qu"] }, flags: ["q"], qMe: true,
          make(f, E) {
            const v = f.V === "verb:lai" ? "come" : "go";
            return { t: [f.S, "build:keyi", f.V, f.q && MA], end: f.q ? "?" : ".", en: f.q ? `Can ${E.s(f.S)} ${v}?` : `${E.S(f.S)} can ${v}.` };
          }
        },
        { id: "pr-tomorrow", q: ["build:ni", "money:mingtian", "verb:qu", "build:ma"], qen: "Are you going tomorrow?",
          a: [{ t: ["build:wo", "money:mingtian", "verb:qu"], en: "I'm going tomorrow." }, { t: ["build:wo", "money:mingtian", "build:bu", "verb:qu"], en: "I'm not going tomorrow." },
              { t: ["build:bu", "verb:qu"], en: "No, I'm not going." }] },
        { id: "pr-wherego", q: ["build:ni", "verb:qu", "build:nar"], qen: "Where are you going?",
          a: [{ t: ["build:wo", "verb:qu", "verb:chi", { any: "eat" }], en: "I'm going to eat {x}." },
              { t: ["build:wo", "verb:qu", "verb:mai", { any: "food" }], en: "I'm going to buy {x}." }] },
        { id: "pr-comingtoday", q: ["build:ni", "money:jintian", "verb:lai", "build:ma"], qen: "Are you coming today?",
          a: [{ t: ["build:wo", "money:jintian", "verb:lai"], en: "I'm coming today." }, { t: ["build:wo", "money:jintian", "build:bu", "verb:lai"], en: "I'm not coming today." },
              { t: ["build:bu", "verb:lai"], en: "No, I'm not coming." }] }
      ]
    },

    // ===================================================== Doing things
    {
      id: "do", name: "Doing things", sub: "Looking, talking, slowly, lots of, hello and goodbye",
      items: [
        {
          id: "do-now", group: "Right now", name: "I'm looking at you",
          tip: "zài before a verb means 'in the middle of doing it': wǒ zài hē chá = I'm drinking tea (right now).",
          core: ["verb:zai"], slots: { S: S_.people, V: ["verb:kan", "verb:he", "verb:chi", "verb:mai"], O: [...L.person, ...S_.food, "money:pengyou"] }, flags: ["q"],
          valid: f => f.V === "verb:kan" ? f.O !== f.S && !(f.S === "build:women" && f.O === "build:wo") && !(f.S === "build:wo" && f.O === "build:women")
            : f.V === "verb:he" ? S_.drink.includes(f.O) : f.V === "verb:chi" ? S_.eat.includes(f.O) : S_.food.includes(f.O),
          make(f, E) {
            const ing = VERBS[f.V].ing, o = objEn(f.O, E, f.g === 0 ? 1 : 0);
            return {
              t: [f.S, "verb:zai", f.V, f.O, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} ${ing} ${o}?` : `${E.beSubj(f.S)} ${ing} ${o}.`
            };
          }
        },
        {
          id: "do-look", group: "Look!", name: "Look, the tea is hot!",
          tip: "kàn (look) can start a sentence, like 'Look!' in English.",
          core: ["verb:kan", "build:hen"], slots: { O: S_.food, A: ["adj:re", "adj:leng", "adj:da", "adj:xiao", "adj:gui"] },
          make(f, E) { return { t: ["verb:kan", ",", f.O, HEN, f.A], end: "!", en: `Look, ${lc(E.isVery(f.O))} ${E.adj(f.A)}!` }; }
        },
        {
          id: "do-lookthis", group: "Look!", name: "I'd like to look at this one",
          tip: "kàn + zhè gè = look at this one. With xiǎng first: I'd like to have a look.",
          core: ["verb:kan", "build:ge"], slots: { S: ["x:0", "build:wo", "build:women"], D: S_.dem },
          make(f, E) {
            const one = f.D === "build:zhe" ? "this" : "that";
            if (f.S === "x:0") return { t: ["verb:kan", f.D, "build:ge"], end: "!", en: `Look at ${one} one!` };
            return { t: [f.S, "verb:xiang", "verb:kan", f.D, "build:ge"], end: ".", en: `${E.S(f.S)} would like to look at ${one} one.` };
          }
        },
        {
          id: "do-slowly", group: "Slowly or quickly", name: "I'm drinking slowly",
          tip: "màn màn (slow slow) before a verb = slowly: màn màn hē = drink slowly. kuài before a verb = quickly.",
          core: ["adj:man"], slots: { S: S_.people, H: ["adj:man", "adj:kuai"], O: S_.food },
          make(f, E) {
            const v = verbEn(f.O), how = f.H === "adj:man" ? ["adj:man", "adj:man"] : ["adj:kuai"];
            return { t: [f.S, ...how, verbFor(f.O), f.O], end: ".", en: `${E.S(f.S)} ${E.v(f.S, v, v + "s")} ${E.thing(f.O)} ${f.H === "adj:man" ? "slowly" : "quickly"}.` };
          }
        },
        {
          id: "do-takeyourtime", group: "Slowly or quickly", name: "Take your time / come quickly",
          tip: "màn màn chī! (slowly slowly eat) is a polite 'enjoy your meal'. kuài lái! = come quickly!",
          core: ["adj:man", "adj:kuai"], slots: { H: ["verb:chi", "verb:he", "verb:lai", "verb:qu"] },
          make(f) {
            if (f.H === "verb:chi") return { t: ["adj:man", "adj:man", "verb:chi"], end: "!", en: "Enjoy your meal! (Eat slowly.)" };
            if (f.H === "verb:he") return { t: ["adj:man", "adj:man", "verb:he"], end: "!", en: "Drink slowly!" };
            if (f.H === "verb:lai") return { t: ["adj:kuai", "verb:lai"], end: "!", en: "Come quickly!" };
            return { t: ["build:ni", "adj:kuai", "verb:qu"], end: "!", en: "Go quickly!" };
          }
        },
        {
          id: "do-lots", group: "Lots of", name: "I have lots of friends",
          tip: "hěn duō = a lot of: wǒ yǒu hěn duō péngyou = I have lots of friends.",
          core: ["adj:duo", "verb:you"], slots: { S: S_.people, O: ["money:pengyou", "money:qian"] }, flags: ["neg", "q"], needsNeg: ["build:mei"],
          make(f, E) {
            const o = f.O === "money:pengyou" ? "friends" : "money";
            return {
              t: [f.S, f.neg && "build:mei", "verb:you", HEN, "adj:duo", f.O, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} have a lot of ${o}?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} have a lot of ${o}.` : `${E.S(f.S)} ${E.v(f.S, "have", "has")} a lot of ${o}.`
            };
          }
        },
        {
          id: "do-saywhat", group: "Talking", name: "What are you saying?",
          tip: "shuō = say / speak. nǐ shuō shénme? = you say what?",
          core: ["verb:shuo", "build:shenme"], slots: { S: ["build:ni", "build:ta"] },
          make(f, E) { return { t: [f.S, "verb:shuo", "build:shenme"], end: "?", en: `What ${E.be(f.S)} ${E.s(f.S)} saying?` }; }
        },
        {
          id: "do-slowspeak", group: "Talking", name: "Please speak slowly",
          tip: "qǐng (please) + màn màn (slowly) + shuō (speak). A very useful sentence!",
          core: ["verb:shuo", "adj:man", "greet:qing"], slots: { S: ["x:0", "build:ni"] },
          make(f) { return { t: ["greet:qing", f.S !== "x:0" && f.S, "adj:man", "adj:man", "verb:shuo"], also: [["greet:qing", "adj:man", "adj:man", "verb:shuo"], ["greet:qing", "build:ni", "adj:man", "adj:man", "verb:shuo"]], end: ".", en: "Please speak slowly." }; }
        },
        {
          id: "do-says", group: "Talking", name: "She says she's tired",
          tip: "No word for 'that': tā shuō tā hěn lèi = she says she (is) very tired.",
          core: ["verb:shuo", "build:hen"], slots: { S: ["build:ni", "build:ta"], A: ["adj:lei", "adj:re", "adj:leng", "adj:hao"] },
          make(f, E) {
            const a = f.A === "adj:hao" ? "well" : E.adj(f.A);
            return { t: [f.S, "verb:shuo", f.S, HEN, f.A], end: ".", en: `${E.S(f.S)} ${E.v(f.S, "say", "says")} ${lc(E.beSubj(f.S))} very ${a}.` };
          }
        },
        {
          id: "do-hello", group: "Hello and goodbye", name: "Hi! Where are you going?",
          tip: "A greeting, a comma, then the question: nǐ hǎo, nǐ qù nǎr?",
          core: ["verb:qu", "build:nar"], slots: { G: ["greet:nihao", "greet:hai", "greet:zao"], S: ["build:ni", "build:ta"] },
          make(f, E) {
            const g = { "greet:nihao": "Hello", "greet:hai": "Hi", "greet:zao": "Morning" }[f.G];
            return { t: [f.G, ",", f.S, "verb:qu", "build:nar"], end: "?", en: `${g}! Where ${E.be(f.S)} ${E.s(f.S)} going?` };
          }
        },
        {
          id: "do-bye", group: "Hello and goodbye", name: "Goodbye! I'm coming tomorrow",
          tip: "zàijiàn (goodbye), then your plan.",
          core: ["greet:zaijian", "verb:lai"], slots: { S: ["build:wo", "build:women"], T: S_.time },
          make(f, E) { return { t: ["greet:zaijian", ",", f.S, f.T, "verb:lai"], end: ".", en: `Goodbye! ${E.beSubj(f.S)} coming ${E.time(f.T)}.` }; }
        },
        {
          id: "do-okay", group: "Hello and goodbye", name: "OK, I'll go tomorrow",
          tip: "hǎo de = OK / sure, to agree to something.",
          core: ["greet:haode", "verb:qu"], slots: { S: ["build:wo", "build:women"], T: S_.time },
          make(f, E) { return { t: ["greet:haode", ",", f.S, f.T, "verb:qu"], end: ".", en: `OK, ${lc(E.beSubj(f.S))} going ${E.time(f.T)}.` }; }
        },
        { id: "dr-sorry", q: ["greet:duibuqi"], qen: "Sorry!",
          a: [{ t: ["greet:meiguanxi", ",", "build:wo", HEN, "adj:hao"], en: "It's okay, I'm fine." }] },
        { id: "dr-thanks", q: ["greet:xiexie", "build:ni"], qen: "Thank you!",
          a: [{ t: ["greet:bukeqi", ",", "greet:zaijian"], en: "You're welcome. Goodbye!" }] },
        { id: "dr-saywhat", q: ["build:ni", "verb:shuo", "build:shenme"], qen: "What are you saying?",
          a: [{ t: ["build:wo", "verb:shuo", "greet:nihao"], en: "I'm saying hello." }, { t: ["build:wo", "build:bu", "verb:zhidao"], en: "I don't know." }] },
        { id: "dr-comingtomorrow", q: ["build:ni", "money:mingtian", "verb:lai", "build:ma"], qen: "Are you coming tomorrow?",
          a: [{ t: ["greet:haode", ",", "build:wo", "money:mingtian", "verb:lai"], en: "OK, I'll come tomorrow." },
              { t: ["build:wo", "money:mingtian", "build:bu", "verb:lai"], en: "I'm not coming tomorrow." }] }
      ]
    }
  ];

  // ---------------------------------------------------------------- literal meanings
  // Shown word by word under each sentence after you answer, so you can see how it's built.
  // Words not listed here use the first part of their English from the word bank.
  const LITERAL = {
    "build:wo": "I", "build:ni": "you", "build:ta": "he/she", "build:women": "we",
    "build:shi": "is", "build:bu": "not", "build:hen": "very", "build:ma": "(question)",
    "build:ne": "and…?", "build:de": "'s", "build:zhe": "this", "build:na": "that",
    "build:ge": "(measure)", "build:shenme": "what", "build:nar": "where", "build:duoshao": "how much",
    "build:keyi": "can", "build:mei": "not", "build:ye": "also", "build:tai": "too",
    "verb:yao": "want", "verb:xiang": "would like", "verb:xihuan": "like", "verb:zai": "be at",
    "verb:kan": "look", "verb:shuo": "say", "verb:zhidao": "know",
    "money:kuai": "yuan", "money:qian": "money", "money:pengyou": "friend",
    "greet:xiexie": "thanks", "greet:duibuqi": "sorry", "greet:qing": "please", "greet:nihao": "hello",
    "greet:bukeqi": "you're welcome", "greet:meiguanxi": "it's okay", "greet:haode": "okay",
    "food:mifan": "rice", "x:le": "(emphasis)"
  };

  // ---------------------------------------------------------------- grammar rules for "Explain"
  // Each rule applies when the sentence contains one of its words (and passes "when", if given).
  // Rules about a word you got wrong are shown first.
  const QW = ["build:shenme", "build:nar", "build:duoshao"];
  const RULES = [
    { id: "bu", title: "Saying “not” with bù", words: [BU],
      text: "bù goes straight before the verb or describing word: wǒ bù hē = I not drink. Before a 4th tone it's said bú: bú yào, bú qù." },
    { id: "mei", title: "méi yǒu, never bù yǒu", words: ["build:mei"],
      text: "yǒu (have) is the one verb that takes méi instead of bù: wǒ méi yǒu qián = I not have money." },
    { id: "ma", title: "Yes/no questions with ma", words: [MA], when: t => !t.some(x => QW.includes(x)),
      text: "Add ma to the end of a statement to make a yes/no question. Nothing else moves: nǐ hē chá → nǐ hē chá ma?" },
    { id: "qword", title: "Question words: no ma", words: QW,
      text: "shénme (what), nǎr (where) and duōshao (how much) sit where the answer would go, and they already make it a question, so there's no ma: nǐ qù nǎr? = you go where?" },
    { id: "hen", title: "No “is” before describing words", words: [HEN],
      text: "Chinese doesn't use shì (is) before a describing word. hěn goes there instead: chá hěn rè = tea very hot. hěn often just means “is”." },
    { id: "adjq", title: "Describing words work like verbs", words: L.adj, when: t => !t.includes(HEN) && !t.includes("build:tai") && !t.includes("build:shi"),
      text: "A describing word needs no “is”: nǐ lèi ma? = you tired? · chá bú rè = tea not hot." },
    { id: "tai", title: "tài … le = too …", words: ["build:tai"],
      text: "tài goes before the describing word and le at the end: tài guì le! = too expensive!" },
    { id: "time", title: "Time words come early", words: L.time,
      text: "jīntiān (today) and míngtiān (tomorrow) go before the verb: straight after who, or at the very start. wǒ míngtiān qù / míngtiān wǒ qù = I tomorrow go." },
    { id: "de", title: "de = 's", words: ["build:de"], when: t => !t.some((x, i) => t[i + 1] === "build:de" && L.adj.includes(x)),
      text: "de after a person shows whose it is: wǒ de chá = my tea · tā de péngyou = his friend." },
    { id: "ge", title: "Numbers need gè", words: ["build:ge"],
      text: "Between a number (or zhè / nà) and a thing goes a measure word. gè is the all-purpose one: sān gè jiǎozi = three dumplings · zhè gè = this one. Before gè, 2 is liǎng, not èr." },
    { id: "price", title: "Saying prices", words: ["money:kuai"],
      text: "Number + kuài (+ qián): wǔ kuài qián = 5 yuan. kuài is the everyday word for yuan." },
    { id: "ye", title: "yě = also, before the verb", words: ["build:ye"],
      text: "yě goes after who and before the verb, never at the end like “too”: wǒ yě hē chá = I also drink tea." },
    { id: "want", title: "yào / xiǎng + another verb", words: ["verb:yao", "verb:xiang"],
      text: "yào (want) and xiǎng (would like) go before another verb: wǒ xiǎng chī jiǎozi = I would-like eat dumplings. xiǎng sounds softer." },
    { id: "ne", title: "ne = and you?", words: ["build:ne"],
      text: "ne after a person turns the question back to them: wǒ hěn hǎo, nǐ ne? = I'm well, you ne?" },
    { id: "keyi", title: "kěyǐ = can / may", words: ["build:keyi"],
      text: "kěyǐ goes before the verb. Add ma to ask permission: wǒ kěyǐ lái ma? = I can come ma?" },
    { id: "shi", title: "shì links two things", words: ["build:shi"],
      text: "shì (is) joins two nouns: zhè shì chá = this is tea. It's not used before describing words." },
    { id: "zai", title: "zài = to be somewhere", words: ["verb:zai"],
      text: "zài means “to be (at)”: nǐ zài nǎr? = you be-at where?" },
    { id: "qing", title: "qǐng = please", words: ["greet:qing"],
      text: "qǐng comes first, before the verb: qǐng hē chá = please drink tea." },
    { id: "adjde", title: "describing word + de", words: ["build:de"], when: t => t.some((x, i) => t[i + 1] === "build:de" && L.adj.includes(x)),
      text: "Put de between a describing word and a thing: rè de jiǎozi = hot dumplings. On its own, dà de = the big one." },
    { id: "zaidoing", title: "zài + verb = doing it now", words: ["verb:zai"], when: t => t.some((x, i) => x === "verb:zai" && VERBS[t[i + 1]]),
      text: "zài (be at) before a verb means you're in the middle of it: wǒ zài kàn nǐ = I'm looking at you (right now)." },
    { id: "qudo", title: "qù + verb = go and do", words: ["verb:qu"], when: t => t.some((x, i) => x === "verb:qu" && VERBS[t[i + 1]]),
      text: "qù before another verb means really going somewhere to do it: wǒ qù chī jiǎozi = I'm going (out) to eat dumplings. For a plan with no travelling ('I'm going to…'), use yào: wǒ jīntiān yào chī shūcài." },
    { id: "yaoplan", title: "yào = going to (a plan)", words: ["verb:yao"], when: t => t.some(x => L.time.includes(x)),
      text: "With a time word, yào + verb is a plan: wǒ míngtiān yào chī jiǎozi = I'm going to eat dumplings tomorrow." },
    { id: "manman", title: "màn màn = slowly", words: ["adj:man", "adj:kuai"], when: t => t.some((x, i) => (x === "adj:man" || x === "adj:kuai") && (VERBS[t[i + 1]] || t[i + 1] === "adj:man" || ["verb:lai", "verb:qu", "verb:shuo"].includes(t[i + 1]))),
      text: "Doubling màn (slow) and putting it before a verb gives 'slowly': màn màn hē = drink slowly. kuài (fast) before a verb = quickly: kuài lái! = come quickly!" },
    { id: "henduo", title: "hěn duō = a lot of", words: ["adj:duo"],
      text: "hěn duō goes straight before the thing, with no extra word: hěn duō péngyou = lots of friends · hěn duō kāfēi = a lot of coffee." },
    { id: "order", title: "The basic order", words: [],
      text: "who → when → not / also → verb → what. Much like English, except that time words come early and question words stay where the answer would go." }
  ];

  return { QUESTION_WORDS: QW, ROLES, ROLE_BY_GROUP, ROLE_OVERRIDES, EXTRA, PEOPLE, THINGS, VERBS, ADJ, NUMBERS, TIMES, LISTS: L, PATTERNS, SECTIONS, LITERAL, RULES,
    // Counting words: yī changes tone before these (yí gè, yì bēi). Topics add their own.
    MEASURES: ["build:ge", "money:kuai"] };
}());
