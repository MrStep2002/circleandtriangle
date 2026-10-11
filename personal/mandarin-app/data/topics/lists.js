/* Topic: Lists. Colours, days, months, bigger numbers, telling the time, seasons,
   the zodiac and countries.

   Same shape as the other topic files. Word IDs start with "li:" and must never change.
   Two words are borrowed from Eating out ({ borrow: "eo:…" }): they're taught here too,
   and progress on them counts in both topics.

   Numbers like 37, 850 or 3:15 aren't single words: the sentences build them from
   1–10 plus bǎi, qiān and wàn. Their slots hold placeholders like "x:n37", which the
   number() helper below turns into tiles (sān shí qī). */
window.TOPIC_DATA = window.TOPIC_DATA || {};
window.TOPIC_DATA["lists"] = (function () {
  const SD = window.SENTENCES;

  const GROUPS = [
    { id: "li-colour", name: "Colours" },
    { id: "li-day",    name: "Days & weeks" },
    { id: "li-month",  name: "Months, dates & years" },
    { id: "li-num",    name: "Bigger numbers & ages" },
    { id: "li-time",   name: "Telling the time" },
    { id: "li-season", name: "Seasons" },
    { id: "li-zodiac", name: "The zodiac" },
    { id: "li-world",  name: "Countries & languages" },
    { id: "li-ask",    name: "Asking & favourites" }
  ];

  const WORDS = [
    // 1
    { id: "li:yanse",   py: "yán|sè",    say: "yen-suh",     en: "colour",  group: "li-colour", role: "thing", note: "Most colours end in sè (colour): hóngsè = red-colour." },
    { id: "li:hong",    py: "hóng|sè",   say: "hong-suh",    en: "red",     group: "li-colour", role: "describe", note: "Red is the lucky colour in China. You'll also hear just hóng." },
    { id: "li:bai",     py: "bái|sè",    say: "bye-suh",     en: "white",   group: "li-colour", role: "describe" },
    { id: "li:hei",     py: "hēi|sè",    say: "hay-suh",     en: "black",   group: "li-colour", role: "describe" },
    // 2
    { id: "li:xingqi",  py: "xīng|qī",   say: "shing-chee",  en: "week",    group: "li-day", role: "time", note: "Days of the week are xīngqī + a number: xīngqīyī = Monday (week-1)." },
    { id: "li:xq1",     py: "xīng|qī|yī", say: "shing-chee-ee", en: "Monday", group: "li-day", role: "time", note: "Week-1. The yī keeps its 1st tone here." },
    { id: "li:xq2",     py: "xīng|qī|'èr", say: "shing-chee-ar", en: "Tuesday", group: "li-day", role: "time", note: "Week-2." },
    { id: "li:xq3",     py: "xīng|qī|sān", say: "shing-chee-sahn", en: "Wednesday", group: "li-day", role: "time", note: "Week-3." },
    // 3
    { id: "li:lan",     py: "lán|sè",    say: "lahn-suh",    en: "blue",    group: "li-colour", role: "describe" },
    { id: "li:lv",      py: "lǜ|sè",     say: "lyoo-suh",    en: "green",   group: "li-colour", role: "describe", note: "lǜ: say 'ee' with rounded lips." },
    { id: "li:huang",   py: "huáng|sè",  say: "hwahng-suh",  en: "yellow",  group: "li-colour", role: "describe" },
    { id: "li:zui",     py: "zuì",       say: "dzway",       en: "most",    group: "li-ask", role: "glue", note: "zuì xǐhuan = like most = favourite." },
    // 4
    { id: "li:xq4",     py: "xīng|qī|sì", say: "shing-chee-suh", en: "Thursday", group: "li-day", role: "time", note: "Week-4." },
    { id: "li:xq5",     py: "xīng|qī|wǔ", say: "shing-chee-woo", en: "Friday", group: "li-day", role: "time", note: "Week-5." },
    { id: "li:xq6",     py: "xīng|qī|liù", say: "shing-chee-lyoh", en: "Saturday", group: "li-day", role: "time", note: "Week-6." },
    { id: "li:xq7",     py: "xīng|qī|tiān", say: "shing-chee-tyen", en: "Sunday", group: "li-day", role: "time", note: "Not week-7! Sunday is week-day (tiān). You'll also see xīngqīrì." },
    // 5
    { borrow: "eo:ji",    group: "li-ask", note: "Asks for a number: xīngqī jǐ? = what day? jǐ diǎn? = what time? No ma: jǐ already asks." },
    { borrow: "eo:liang", group: "li-num", note: "2 before diǎn, suì, qiān and wàn: liǎng diǎn = 2 o'clock. But 12 is shí'èr." },
    { id: "li:dian",    py: "diǎn",      say: "dyen",        en: "o'clock", group: "li-time", role: "time", note: "sān diǎn = 3 o'clock. Same sound as diǎn (to order) in Eating out." },
    { id: "li:ban",     py: "bàn",       say: "bahn",        en: "half (past)", group: "li-time", role: "time", note: "sān diǎn bàn = half past 3." },
    // 6
    { id: "li:m1",      py: "yī|yuè",    say: "ee-yweh",     en: "January",  group: "li-month", role: "time", note: "Months are a number + yuè (month): yīyuè = 1-month." },
    { id: "li:m2",      py: "èr|yuè",    say: "ar-yweh",     en: "February", group: "li-month", role: "time" },
    { id: "li:m3",      py: "sān|yuè",   say: "sahn-yweh",   en: "March",    group: "li-month", role: "time" },
    { id: "li:m4",      py: "sì|yuè",    say: "suh-yweh",    en: "April",    group: "li-month", role: "time" },
    // 7
    { id: "li:xianzai", py: "xiàn|zài",  say: "shyen-dzye",  en: "now",      group: "li-time", role: "time" },
    { id: "li:fen",     py: "fēn",       say: "fun",         en: "minute(s)", group: "li-time", role: "time", note: "sān diǎn shíwǔ fēn = 3:15." },
    { id: "li:zaoshang", py: "zǎo|shang", say: "dzaow-shahng", en: "morning", group: "li-time", role: "time", note: "Goes before the time: zǎoshang bā diǎn = 8am." },
    { id: "li:wanshang", py: "wǎn|shang", say: "wahn-shahng", en: "evening", group: "li-time", role: "time", note: "wǎnshang qī diǎn = 7pm." },
    // 8
    { id: "li:m5",      py: "wǔ|yuè",    say: "woo-yweh",    en: "May",       group: "li-month", role: "time" },
    { id: "li:m6",      py: "liù|yuè",   say: "lyoh-yweh",   en: "June",      group: "li-month", role: "time" },
    { id: "li:m7",      py: "qī|yuè",    say: "chee-yweh",   en: "July",      group: "li-month", role: "time" },
    { id: "li:m8",      py: "bā|yuè",    say: "bah-yweh",    en: "August",    group: "li-month", role: "time" },
    // 9
    { id: "li:chun",    py: "chūn|tiān", say: "chwun-tyen",  en: "spring",    group: "li-season", role: "time", note: "All four seasons end in tiān (day/sky)." },
    { id: "li:xiatian", py: "xià|tiān",  say: "shyah-tyen",  en: "summer",    group: "li-season", role: "time" },
    { id: "li:qiu",     py: "qiū|tiān",  say: "chyoh-tyen",  en: "autumn",    group: "li-season", role: "time" },
    { id: "li:dong",    py: "dōng|tiān", say: "dong-tyen",   en: "winter",    group: "li-season", role: "time" },
    // 10
    { id: "li:m9",      py: "jiǔ|yuè",   say: "jyoh-yweh",   en: "September", group: "li-month", role: "time" },
    { id: "li:m10",     py: "shí|yuè",   say: "shrr-yweh",   en: "October",   group: "li-month", role: "time" },
    { id: "li:m11",     py: "shí|yī|yuè", say: "shrr-ee-yweh", en: "November", group: "li-month", role: "time", note: "11-month." },
    { id: "li:m12",     py: "shí|'èr|yuè", say: "shrr-ar-yweh", en: "December", group: "li-month", role: "time", note: "12-month. Here 2 is èr, not liǎng." },
    // 11
    { id: "li:yue",     py: "yuè",       say: "yweh",        en: "month",     group: "li-month", role: "time", note: "jǐ yuè? = which month?" },
    { id: "li:hao",     py: "hào",       say: "how",         en: "(day of the month)", group: "li-month", role: "time", note: "Dates: month then day: sānyuè wǔ hào = 5 March." },
    { id: "li:shengri", py: "shēng|rì",  say: "shung-rrr",   en: "birthday",  group: "li-month", role: "thing" },
    { id: "li:na",      py: "nǎ",        say: "nah",         en: "which",     group: "li-ask", role: "glue", note: "nǎ (3rd tone) = which. Not nà (that) or nǎr (where). Usually nǎ gè: which one." },
    // 12
    { id: "li:bai100",  py: "bǎi",       say: "bye",         en: "hundred",   group: "li-num", role: "number", note: "sānbǎi = 300. 100 is yìbǎi: yī changes tone." },
    { id: "li:qian",    py: "qiān",      say: "chyen",       en: "thousand",  group: "li-num", role: "number", note: "2,000 is liǎngqiān." },
    { id: "li:wan",     py: "wàn",       say: "wahn",        en: "ten thousand", group: "li-num", role: "number", note: "Chinese counts big numbers in 10,000s: shí wàn = 100,000." },
    { id: "li:ling",    py: "líng",      say: "ling",        en: "zero",      group: "li-num", role: "number", note: "Also fills a gap in a number: yìbǎi líng wǔ = 105." },
    // 13
    { id: "li:sui",     py: "suì",       say: "sway",        en: "years old", group: "li-num", role: "number", note: "wǒ sānshí suì = I'm 30. No verb needed." },
    { id: "li:zuotian", py: "zuó|tiān",  say: "dzwaw-tyen",  en: "yesterday", group: "li-day", role: "time" },
    { id: "li:xiawu",   py: "xià|wǔ",    say: "shyah-woo",   en: "afternoon", group: "li-time", role: "time", note: "xiàwǔ sān diǎn = 3pm." },
    { id: "li:jijie",   py: "jì|jié",    say: "jee-jyeh",    en: "season",    group: "li-season", role: "thing" },
    // 14
    { id: "li:zhongguo", py: "Zhōng|guó", say: "jong-gwaw",  en: "China",     group: "li-world", role: "thing", note: "Literally 'middle country'." },
    { id: "li:yingguo", py: "Yīng|guó",  say: "ying-gwaw",   en: "the UK",    group: "li-world", role: "thing", note: "Used for both Britain and England." },
    { id: "li:ren",     py: "rén",       say: "run",         en: "person",    group: "li-world", role: "thing", note: "Country + rén = a person from there: Yīngguó rén = British." },
    { id: "li:guo",     py: "guó",       say: "gwaw",        en: "country",   group: "li-world", role: "thing", note: "nǐ shì nǎ guó rén? = where are you from? (which country person?)" },
    // 15
    { id: "li:meiguo",  py: "Měi|guó",   say: "may-gwaw",    en: "the US",    group: "li-world", role: "thing", note: "Literally 'beautiful country'." },
    { id: "li:faguo",   py: "Fǎ|guó",    say: "fah-gwaw",    en: "France",    group: "li-world", role: "thing" },
    { id: "li:deguo",   py: "Dé|guó",    say: "duh-gwaw",    en: "Germany",   group: "li-world", role: "thing" },
    { id: "li:riben",   py: "Rì|běn",    say: "rrr-bun",     en: "Japan",     group: "li-world", role: "thing", note: "Literally 'sun origin'. No guó on this one." },
    // 16
    { id: "li:shu",     py: "shǔ",       say: "shoo",        en: "to be born in the Year of", group: "li-zodiac", role: "verb", note: "Literally 'belong to': wǒ shǔ lóng = I'm a Dragon. Same sound as shǔ (Rat)!" },
    { id: "li:rat",     py: "shǔ",       say: "shoo",        en: "Rat (zodiac)",     group: "li-zodiac", role: "thing", note: "wǒ shǔ shǔ = I'm a Rat (I belong rat)." },
    { id: "li:ox",      py: "niú",       say: "nyoh",        en: "Ox (zodiac)",      group: "li-zodiac", role: "thing", note: "As in niúròu (beef = ox meat)." },
    { id: "li:tiger",   py: "hǔ",        say: "hoo",         en: "Tiger (zodiac)",   group: "li-zodiac", role: "thing", note: "Outside the zodiac a tiger is lǎohǔ." },
    // 17
    { id: "li:rabbit",  py: "tù",        say: "too",         en: "Rabbit (zodiac)",  group: "li-zodiac", role: "thing", note: "Outside the zodiac a rabbit is tùzi." },
    { id: "li:dragon",  py: "lóng",      say: "long",        en: "Dragon (zodiac)",  group: "li-zodiac", role: "thing", note: "The luckiest sign. Dragon years see a baby boom." },
    { id: "li:snake",   py: "shé",       say: "shuh",        en: "Snake (zodiac)",   group: "li-zodiac", role: "thing" },
    { id: "li:horse",   py: "mǎ",        say: "mah",         en: "Horse (zodiac)",   group: "li-zodiac", role: "thing", note: "2026 is a Horse year. Careful: mǎ (horse), ma (question marker)." },
    // 18
    { id: "li:goat",    py: "yáng",      say: "yahng",       en: "Goat (zodiac)",    group: "li-zodiac", role: "thing", note: "As in yángròu (lamb). Sometimes translated Sheep." },
    { id: "li:monkey",  py: "hóu",       say: "hoh",         en: "Monkey (zodiac)",  group: "li-zodiac", role: "thing", note: "Outside the zodiac a monkey is hóuzi." },
    { id: "li:rooster", py: "jī",        say: "jee",         en: "Rooster (zodiac)", group: "li-zodiac", role: "thing", note: "As in jīròu (chicken)." },
    { id: "li:dog",     py: "gǒu",       say: "goh",         en: "Dog (zodiac)",     group: "li-zodiac", role: "thing" },
    // 19
    { id: "li:pig",     py: "zhū",       say: "joo",         en: "Pig (zodiac)",     group: "li-zodiac", role: "thing", note: "As in zhūròu (pork)." },
    { id: "li:nian",    py: "nián",      say: "nyen",        en: "year",      group: "li-zodiac", role: "time", note: "mǎ nián = the Year of the Horse." },
    { id: "li:jinnian", py: "jīn|nián",  say: "jin-nyen",    en: "this year", group: "li-month", role: "time", note: "Like jīntiān (today): jīn = this/now." },
    { id: "li:mingnian", py: "míng|nián", say: "ming-nyen",  en: "next year", group: "li-month", role: "time", note: "Like míngtiān (tomorrow)." },
    // 20
    { id: "li:zi",      py: "zǐ|sè",     say: "dzuh-suh",    en: "purple",    group: "li-colour", role: "describe" },
    { id: "li:fen2",    py: "fěn|sè",    say: "fun-suh",     en: "pink",      group: "li-colour", role: "describe", note: "Also fěnhóngsè." },
    { id: "li:hui",     py: "huī|sè",    say: "hway-suh",    en: "grey",      group: "li-colour", role: "describe" },
    { id: "li:cheng",   py: "chéng|sè",  say: "chung-suh",   en: "orange",    group: "li-colour", role: "describe", note: "The colour. The fruit is júzi." },
    // 21
    { id: "li:hanguo",  py: "Hán|guó",   say: "hahn-gwaw",   en: "South Korea", group: "li-world", role: "thing" },
    { id: "li:aodaliya", py: "Ào|dà|lì|yà", say: "ow-dah-lee-yah", en: "Australia", group: "li-world", role: "thing" },
    { id: "li:jianada", py: "Jiā|ná|dà", say: "jyah-nah-dah", en: "Canada",   group: "li-world", role: "thing" },
    { id: "li:yidali",  py: "Yì|dà|lì",  say: "ee-dah-lee",  en: "Italy",     group: "li-world", role: "thing" },
    // 22
    { id: "li:xibanya", py: "Xī|bān|yá", say: "shee-bahn-yah", en: "Spain",   group: "li-world", role: "thing" },
    { id: "li:aierlan", py: "Ài|'ěr|lán", say: "eye-ar-lahn", en: "Ireland",  group: "li-world", role: "thing" },
    { id: "li:zhongwen", py: "Zhōng|wén", say: "jong-wun",   en: "Chinese (language)", group: "li-world", role: "thing", note: "wén = language. wǒ shuō Zhōngwén = I speak Chinese." },
    { id: "li:yingwen", py: "Yīng|wén",  say: "ying-wun",    en: "English (language)", group: "li-world", role: "thing" },
    // 23
    { id: "li:zhoumo",  py: "zhōu|mò",   say: "joh-maw",     en: "weekend",   group: "li-day", role: "time" },
    { id: "li:shang",   py: "shàng",     say: "shahng",      en: "last (week, month)", group: "li-day", role: "describe", note: "Literally 'up': shàng gè xīngqī = last week." },
    { id: "li:xia",     py: "xià",       say: "shyah",       en: "next (week, month)", group: "li-day", role: "describe", note: "Literally 'down': xià gè xīngqī = next week. Time flows downwards." },
    { id: "li:qunian",  py: "qù|nián",   say: "chyoo-nyen",  en: "last year", group: "li-month", role: "time", note: "Literally 'gone year'." },
    // 24
    { id: "li:zong",    py: "zōng|sè",   say: "dzong-suh",   en: "brown",     group: "li-colour", role: "describe", note: "Also kāfēisè (coffee-colour)." },
    { id: "li:yindu",   py: "Yìn|dù",    say: "yin-doo",     en: "India",     group: "li-world", role: "thing" },
    { id: "li:nanfei",  py: "Nán|fēi",   say: "nahn-fay",    en: "South Africa", group: "li-world", role: "thing", note: "Literally 'south Africa'. Fēizhōu is Africa." }
  ];

  const ALIKE = [
    ["li:shu", "li:rat"],
    ["li:dian", "eo:dian"],
    ["li:zaoshang", "greet:zao"],
    ["li:rooster", "food:jirou"]
  ];

  // ---------------------------------------------------------------- word lists
  const COLOURS = ["li:hong", "li:bai", "li:hei", "li:lan", "li:lv", "li:huang", "li:zi", "li:fen2", "li:hui", "li:cheng", "li:zong"];
  const DAYS = ["li:xq1", "li:xq2", "li:xq3", "li:xq4", "li:xq5", "li:xq6", "li:xq7"];
  const MONTHS = ["li:m1", "li:m2", "li:m3", "li:m4", "li:m5", "li:m6", "li:m7", "li:m8", "li:m9", "li:m10", "li:m11", "li:m12"];
  const SEASONS = ["li:chun", "li:xiatian", "li:qiu", "li:dong"];
  const ANIMALS = ["li:rat", "li:ox", "li:tiger", "li:rabbit", "li:dragon", "li:snake", "li:horse", "li:goat", "li:monkey", "li:rooster", "li:dog", "li:pig"];
  const COUNTRIES = ["li:zhongguo", "li:yingguo", "li:meiguo", "li:faguo", "li:deguo", "li:riben", "li:hanguo", "li:aodaliya", "li:jianada", "li:yidali", "li:xibanya", "li:aierlan", "li:yindu", "li:nanfei"];
  const NAT = {
    "li:zhongguo": "Chinese", "li:yingguo": "British", "li:meiguo": "American", "li:faguo": "French", "li:deguo": "German",
    "li:riben": "Japanese", "li:hanguo": "Korean", "li:aodaliya": "Australian", "li:jianada": "Canadian", "li:yidali": "Italian",
    "li:xibanya": "Spanish", "li:aierlan": "Irish", "li:yindu": "Indian", "li:nanfei": "South African"
  };
  const people = ["build:wo", "build:ni", "build:ta", "build:women"];
  const notMe = ["build:ni", "build:ta", "build:women"];
  const youHer = ["build:ni", "build:ta"];
  const single = ["build:wo", "build:ni", "build:ta"];
  const weMe = ["build:wo", "build:women"];
  const DRINKS = ["food:cha", "food:kafei", "food:pijiu", "food:shui"];

  const BU = "build:bu", MA = "build:ma", HEN = "build:hen", SHI = "build:shi", DE = "build:de", GE = "build:ge";
  const JI = "eo:ji", LIANG = "eo:liang";
  const en = w => Banks.BY_ID[w].en.split(" (")[0];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const an = s => (/^[aeiou]/i.test(s) ? "an " : "a ") + s;
  const was = (E, S) => E.be(S) === "are" ? "were" : "was";

  // ---------------------------------------------------------------- building numbers
  // Placeholder slot values: "x:n37" means 37. They're never shown, only turned into tiles.
  const DIG = [null, "num:yi", "num:er", "num:san", "num:si", "num:wu", "num:liu", "num:qi", "num:ba", "num:jiu"];
  const range = (a, b, step) => { const out = []; for (let i = a; i <= b; i += (step || 1)) out.push(i); return out; };
  const ph = (p, list) => list.map(n => "x:" + p + n);
  const val = x => +x.replace(/^x:[a-z]+/, "");
  const fmt = n => n.toLocaleString("en-GB");

  // 1–99. inside: after bǎi/qiān, where 10–19 are said yīshí… (yìbǎi yīshí = 110).
  function small(n, inside) {
    const t = Math.floor(n / 10), u = n % 10, out = [];
    if (t) { if (t > 1 || inside) out.push(DIG[t]); out.push("num:shi"); }
    if (u) out.push(DIG[u]);
    return out;
  }
  // Any number up to 999,999 (only round ones above 10,000).
  function number(n) {
    if (n < 100) return small(n);
    const out = [];
    if (n >= 10000) {
      const w = Math.floor(n / 10000);
      out.push(...(w === 2 ? [LIANG] : w < 10 ? [DIG[w]] : small(w)), "li:wan");
      n %= 10000;
      if (!n) return out;
    }
    if (n >= 1000) {
      const q = Math.floor(n / 1000);
      out.push(q === 2 ? LIANG : DIG[q], "li:qian");
      n %= 1000;
      if (!n) return out;
      if (n < 100) out.push("li:ling");
    }
    if (n >= 100) {
      const h = Math.floor(n / 100);
      out.push(DIG[h], "li:bai100");
      n %= 100;
      if (!n) return out;
      if (n < 10) out.push("li:ling");
    }
    out.push(...small(n, true));
    return out;
  }
  // 200 can be èrbǎi or liǎngbǎi: accept both.
  const liangBai = t => {
    const i = t.indexOf("li:bai100");
    return i > 0 && t[i - 1] === "num:er" ? [...t.slice(0, i - 1), LIANG, ...t.slice(i - 1 + 1)] : null;
  };
  // Hours: 2 o'clock is liǎng diǎn, but 12 is shí'èr diǎn.
  const hour = h => h === 2 ? [LIANG] : small(h);
  function minutes(m) {
    if (!m) return [];
    if (m === 30) return ["li:ban"];
    return [...small(m), "li:fen"];
  }
  function clock(h, m) {
    if (!m) return `${h} o'clock`;
    if (m === 30) return `half past ${h}`;
    return `${h}:${String(m).padStart(2, "0")}`;
  }
  const PERIOD = { "li:zaoshang": "in the morning", "li:xiawu": "in the afternoon", "li:wanshang": "in the evening" };
  const periodFits = (p, h) => p === "li:zaoshang" ? h >= 6 && h <= 11 : p === "li:xiawu" ? h >= 1 && h <= 5 : h >= 6 && h <= 11;

  const N99 = ph("n", range(11, 99));
  const AGES = ph("n", range(3, 99).filter(n => n !== 2));
  const DATES = ph("n", range(1, 31));
  const HOURS = ph("h", range(1, 12));
  const MINS = ph("m", [0, 10, 15, 20, 25, 30, 40, 45, 50]);
  const HUNDREDS = ph("n", [...range(1, 9).flatMap(h => range(0, 9).map(t => h * 100 + t * 10))]);
  const LING = ph("n", range(1, 9).flatMap(h => [1, 5, 8].map(u => h * 100 + u)));
  const THOUSANDS = ph("n", range(1, 9).flatMap(q => range(0, 9).map(h => q * 1000 + h * 100)));
  const WANS = ph("n", [...range(1, 9), 10, 20, 50].map(w => w * 10000));
  const DAYS_IN = { "li:m2": 28, "li:m4": 30, "li:m6": 30, "li:m9": 30, "li:m11": 30 };

  // Northern-hemisphere seasons, as in China.
  const SEASON_OF = {
    "li:m12": "li:dong", "li:m1": "li:dong", "li:m2": "li:dong", "li:m3": "li:chun", "li:m4": "li:chun", "li:m5": "li:chun",
    "li:m6": "li:xiatian", "li:m7": "li:xiatian", "li:m8": "li:xiatian", "li:m9": "li:qiu", "li:m10": "li:qiu", "li:m11": "li:qiu"
  };
  // The real zodiac years around now: 2025 Snake, 2026 Horse, 2027 Goat.
  const YEAR_ANIMAL = { "li:qunian": "li:snake", "li:jinnian": "li:horse", "li:mingnian": "li:goat" };
  const YEAR_EN = { "li:qunian": ["Last year", "was"], "li:jinnian": ["This year", "is"], "li:mingnian": ["Next year", "is"] };
  const ANIMAL_EN = id => en(id);

  // ---------------------------------------------------------------- English forms and glosses
  Object.assign(SD.THINGS, {
    "li:zhongguo": { en: "China" }, "li:yingguo": { en: "the UK" }, "li:meiguo": { en: "the US" }, "li:faguo": { en: "France" },
    "li:deguo": { en: "Germany" }, "li:riben": { en: "Japan" }, "li:hanguo": { en: "South Korea" }, "li:aodaliya": { en: "Australia" },
    "li:jianada": { en: "Canada" }, "li:yidali": { en: "Italy" }, "li:xibanya": { en: "Spain" }, "li:aierlan": { en: "Ireland" },
    "li:yindu": { en: "India" }, "li:nanfei": { en: "South Africa" },
    "li:zhongwen": { en: "Chinese" }, "li:yingwen": { en: "English" },
    "li:rat": { en: "Rat" }, "li:ox": { en: "Ox" }, "li:tiger": { en: "Tiger" }, "li:rabbit": { en: "Rabbit" }, "li:dragon": { en: "Dragon" },
    "li:snake": { en: "Snake" }, "li:horse": { en: "Horse" }, "li:goat": { en: "Goat" }, "li:monkey": { en: "Monkey" },
    "li:rooster": { en: "Rooster" }, "li:dog": { en: "Dog" }, "li:pig": { en: "Pig" }
  });
  SD.NUMBERS["eo:liang"] = [2, "two"];
  SD.YI_BEFORE = (SD.YI_BEFORE || []).concat(["li:bai100", "li:qian", "li:wan"]);
  SD.QUESTION_WORDS.push("li:na");
  Object.assign(SD.LITERAL, {
    "li:yanse": "colour", "li:zui": "most", "li:na": "which", "li:xingqi": "week",
    "li:xq1": "week-1", "li:xq2": "week-2", "li:xq3": "week-3", "li:xq4": "week-4", "li:xq5": "week-5", "li:xq6": "week-6", "li:xq7": "week-day",
    "li:m1": "1-month", "li:m2": "2-month", "li:m3": "3-month", "li:m4": "4-month", "li:m5": "5-month", "li:m6": "6-month",
    "li:m7": "7-month", "li:m8": "8-month", "li:m9": "9-month", "li:m10": "10-month", "li:m11": "11-month", "li:m12": "12-month",
    "li:yue": "month", "li:hao": "date", "li:shengri": "birth-day", "li:dian": "o'clock", "li:ban": "half", "li:fen": "minute",
    "li:xiawu": "after-noon", "li:bai100": "hundred", "li:qian": "thousand", "li:wan": "10,000", "li:ling": "0", "li:sui": "years old",
    "li:zuotian": "yesterday", "li:zhoumo": "week-end", "li:shang": "last", "li:xia": "next",
    "li:jinnian": "this year", "li:mingnian": "next year", "li:qunian": "last year", "li:nian": "year", "li:shu": "belong",
    "li:zhongguo": "China", "li:meiguo": "America", "li:ren": "person", "li:guo": "country", "li:zhongwen": "Chinese", "li:yingwen": "English",
    "li:jijie": "season"
  });

  // ---------------------------------------------------------------- sections
  const SECTIONS = [
    // ============================================== Colours
    {
      id: "li-colours", name: "Colours & favourites", sub: "Likes, favourites, the red one",
      items: [
        {
          id: "li-likecol", group: "Likes", name: "I like blue",
          core: ["verb:xihuan"], slots: { S: people, C: COLOURS }, flags: ["neg", "q"],
          make(f, E) {
            const c = en(f.C);
            return {
              t: [f.S, f.neg && BU, "verb:xihuan", f.C, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} like ${c}?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} like ${c}.` : `${E.S(f.S)} ${E.v(f.S, "like", "likes")} ${c}.`
            };
          }
        },
        {
          id: "li-favcol", group: "Likes", name: "Blue is my favourite colour",
          core: ["li:zui", "verb:xihuan"], slots: { S: people, C: COLOURS },
          make(f, E) { return { t: [f.S, "li:zui", "verb:xihuan", f.C], end: ".", en: `${cap(en(f.C))} is ${E.poss(f.S)} favourite colour.` }; }
        },
        {
          id: "li-whichcol", group: "Likes", name: "Which colour do you like?",
          core: ["li:na", "li:yanse"], slots: { S: youHer },
          make(f, E) { return { t: [f.S, "verb:xihuan", "li:na", GE, "li:yanse"], end: "?", en: `Which colour ${E.Do(f.S).toLowerCase()} ${E.s(f.S)} like?` }; }
        },
        {
          id: "li-havecol", group: "Choosing", name: "Do you have a red one?",
          core: ["verb:you", DE], slots: { C: COLOURS },
          make(f) { return { t: ["verb:you", f.C, DE, MA], end: "?", en: `Do you have ${an(en(f.C))} one?` }; }
        },
        {
          id: "li-wantcol", group: "Choosing", name: "I'd like the blue one",
          core: ["verb:yao", DE], slots: { S: weMe, C: COLOURS },
          make(f, E) { return { t: [f.S, "verb:yao", f.C, DE], end: ".", en: `${E.S(f.S)}'d like the ${en(f.C)} one.` }; },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "li-thisis", group: "Choosing", name: "This one is red",
          core: [SHI, DE], slots: { D: ["build:zhe", "build:na"], C: COLOURS }, flags: ["neg", "q"],
          make(f) {
            const one = f.D === "build:zhe" ? "this" : "that", c = en(f.C);
            return {
              t: [f.D, GE, f.neg && BU, SHI, f.C, DE, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `Is ${one} one ${c}?` : f.neg ? `${cap(one)} one isn't ${c}.` : `${cap(one)} one is ${c}.`
            };
          }
        },
        { id: "li-r-favcol", q: ["build:ni", "li:zui", "verb:xihuan", "build:shenme", "li:yanse"], qen: "What's your favourite colour?",
          a: [{ t: ["build:wo", "li:zui", "verb:xihuan", { any: "liColour" }], en: "My favourite is {x}." },
              { t: ["build:wo", "verb:xihuan", { any: "liColour" }], en: "I like {x}." }] }
      ]
    },

    // ============================================== Numbers
    {
      id: "li-numbers", name: "Numbers, prices & ages", sub: "11 to 99, hundreds, thousands, wàn, how old",
      items: [
        {
          id: "li-count", group: "11 to 99", name: "Numbers 11 to 99",
          core: ["num:shi"], slots: { N: N99 },
          make(f) { return { t: small(val(f.N)), end: ".", en: `${val(f.N)}.` }; }
        },
        {
          id: "li-price99", group: "11 to 99", name: "Prices up to 99",
          core: ["num:shi", "money:kuai"], slots: { N: N99 },
          make(f) {
            const t = small(val(f.N));
            return { t: [...t, "money:kuai"], also: [[...t, "money:kuai", "money:qian"]], end: ".", en: `${val(f.N)} yuan.` };
          }
        },
        {
          id: "li-hundreds", group: "Big numbers", name: "Hundreds",
          core: ["li:bai100", "money:kuai"], slots: { N: HUNDREDS },
          make(f) {
            const t = number(val(f.N)), l = liangBai(t);
            return { t: [...t, "money:kuai"], also: l ? [[...l, "money:kuai"]] : [], end: ".", en: `${fmt(val(f.N))} yuan.` };
          }
        },
        {
          id: "li-ling", group: "Big numbers", name: "Hundreds with líng",
          core: ["li:bai100", "li:ling", "money:kuai"], slots: { N: LING },
          make(f) {
            const t = number(val(f.N)), l = liangBai(t);
            return { t: [...t, "money:kuai"], also: l ? [[...l, "money:kuai"]] : [], end: ".", en: `${fmt(val(f.N))} yuan.` };
          }
        },
        {
          id: "li-thousands", group: "Big numbers", name: "Thousands",
          core: ["li:qian", "li:bai100", LIANG, "money:kuai"], slots: { N: THOUSANDS },
          make(f) {
            const t = number(val(f.N)), l = liangBai(t);
            return { t: [...t, "money:kuai"], also: l ? [[...l, "money:kuai"]] : [], end: ".", en: `${fmt(val(f.N))} yuan.` };
          }
        },
        {
          id: "li-wan", group: "Big numbers", name: "Tens of thousands (wàn)",
          core: ["li:wan", LIANG, "money:kuai"], slots: { N: WANS },
          make(f) { return { t: [...number(val(f.N)), "money:kuai"], end: ".", en: `${fmt(val(f.N))} yuan.` }; }
        },
        {
          id: "li-age", group: "Ages", name: "I'm 37",
          core: ["li:sui"], slots: { S: people, N: AGES }, flags: ["q"],
          make(f, E) {
            const n = val(f.N);
            return {
              t: [f.S, ...small(n), "li:sui", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} ${n}?` : `${E.beSubj(f.S)} ${n}.`
            };
          }
        },
        {
          id: "li-howold", group: "Ages", name: "How old are you?",
          core: ["li:sui", "adj:duo", "adj:da"], slots: { S: youHer },
          make(f, E) { return { t: [f.S, "adj:duo", "adj:da"], end: "?", en: `How old ${E.be(f.S)} ${E.s(f.S)}?` }; }
        },
        { id: "li-r-age", q: ["build:ni", JI, "li:sui"], qen: "How old are you, little one?",
          a: [{ t: ["build:wo", { any: "liAge" }, "li:sui"], en: "I'm {x}." }] }
      ]
    },

    // ============================================== Days, months & dates
    {
      id: "li-calendar", name: "Days, months & dates", sub: "What day is it, birthdays, next week",
      items: [
        {
          id: "li-today", group: "Days", name: "Today is Friday",
          core: ["li:xingqi"], slots: { T: ["money:jintian", "money:mingtian", "li:zuotian"], D: DAYS }, flags: ["neg"],
          make(f) {
            const day = en(f.D);
            const past = f.T === "li:zuotian";
            const who = { "money:jintian": "Today", "money:mingtian": "Tomorrow", "li:zuotian": "Yesterday" }[f.T];
            const verb = past ? (f.neg ? "wasn't" : "was") : (f.neg ? "isn't" : "is");
            return {
              t: [f.T, f.neg && BU, SHI, f.D], also: f.neg ? [] : [[f.T, f.D]], end: ".",
              en: `${who} ${verb} ${day}.`
            };
          }
        },
        {
          id: "li-dayq", group: "Days", name: "What day is it today?",
          core: ["li:xingqi", JI], slots: { T: ["money:jintian", "money:mingtian", "li:zuotian"] },
          make(f) {
            const en = { "money:jintian": "What day is it today?", "money:mingtian": "What day is it tomorrow?", "li:zuotian": "What day was it yesterday?" }[f.T];
            return { t: [f.T, "li:xingqi", JI], end: "?", en };
          }
        },
        {
          id: "li-wherego", group: "Days", name: "Where are you going on Sunday?",
          core: ["verb:qu", "build:nar"], slots: { D: [...DAYS, "li:zhoumo"], S: notMe },
          make(f, E) {
            const when = f.D === "li:zhoumo" ? "at the weekend" : "on " + en(f.D);
            return { t: [f.D, f.S, "verb:qu", "build:nar"], also: [[f.S, f.D, "verb:qu", "build:nar"]], end: "?", en: `Where ${E.be(f.S)} ${E.s(f.S)} going ${when}?` };
          }
        },
        {
          id: "li-nextweek", group: "Last, this & next", name: "I'm going next week",
          core: ["li:xia", "li:xingqi", "verb:qu"], slots: { S: people, W: ["build:zhe", "li:xia"], U: ["li:xingqi", "li:yue"] }, flags: ["neg", "q"],
          make(f, E) {
            const when = (f.W === "li:xia" ? "next " : "this ") + (f.U === "li:yue" ? "month" : "week");
            const when2 = [f.W, GE, f.U];
            const tail = [f.neg && BU, "verb:qu", f.q && MA];
            return {
              t: [f.S, ...when2, ...tail], also: [[...when2, f.S, ...tail]], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going ${when}?` : f.neg ? `${E.beSubj(f.S)} not going ${when}.` : `${E.beSubj(f.S)} going ${when}.`
            };
          }
        },
        {
          id: "li-weekweather", group: "Last, this & next", name: "Last week was very cold",
          core: ["li:shang", "li:xia"], slots: { W: ["li:shang", "build:zhe", "li:xia"], U: ["li:xingqi", "li:yue"], A: ["adj:leng", "adj:re"] }, flags: ["neg"],
          make(f) {
            const unit = f.U === "li:yue" ? "month" : "week", a = en(f.A);
            const w = { "li:shang": "Last", "build:zhe": "This", "li:xia": "Next" }[f.W];
            const be = f.W === "li:shang" ? (f.neg ? "wasn't" : "was very") : f.W === "li:xia" ? (f.neg ? "won't be" : "will be very") : (f.neg ? "isn't" : "is very");
            return { t: [f.W, GE, f.U, f.neg ? BU : HEN, f.A], end: ".", en: `${w} ${unit} ${be} ${a}.` };
          }
        },
        {
          id: "li-date", group: "Dates", name: "Today is 5 March",
          core: ["li:hao"], slots: { T: ["money:jintian", "money:mingtian"], M: MONTHS, N: DATES },
          valid: f => val(f.N) <= (DAYS_IN[f.M] || 31),
          make(f) {
            const d = [f.M, ...small(val(f.N)), "li:hao"];
            return { t: [f.T, ...d], also: [[f.T, SHI, ...d]], end: ".", en: `${f.T === "money:jintian" ? "Today" : "Tomorrow"} is ${val(f.N)} ${en(f.M)}.` };
          }
        },
        {
          id: "li-birthday", group: "Dates", name: "My birthday is on 21 May",
          core: ["li:shengri", "li:hao"], slots: { S: single, M: MONTHS, N: DATES }, flags: ["q"],
          valid: f => val(f.N) <= (DAYS_IN[f.M] || 31),
          make(f, E) {
            const d = [f.M, ...small(val(f.N)), "li:hao"], whose = [f.S, DE, "li:shengri"];
            const date = `${val(f.N)} ${en(f.M)}`;
            return {
              t: [...whose, SHI, ...d, f.q && MA], also: [[...whose, ...d, f.q && MA]], end: f.q ? "?" : ".",
              en: f.q ? `Is ${E.poss(f.S)} birthday on ${date}?` : `${cap(E.poss(f.S))} birthday is on ${date}.`
            };
          }
        },
        {
          id: "li-monthcold", group: "Months", name: "January is very cold",
          core: [HEN], slots: { M: MONTHS, A: ["adj:leng", "adj:re"] }, flags: ["neg", "q"],
          make(f) {
            const m = en(f.M), a = en(f.A);
            if (f.q) return { t: [f.M, f.A, MA], end: "?", en: `Is ${m} ${a}?` };
            if (f.neg) return { t: [f.M, BU, f.A], end: ".", en: `${m} isn't ${a}.` };
            return { t: [f.M, HEN, f.A], end: ".", en: `${m} is very ${a}.` };
          }
        },
        {
          id: "li-gomonth", group: "Months", name: "I'm going to Japan in August",
          core: ["verb:qu"], slots: { S: people, M: MONTHS, C: COUNTRIES },
          make(f, E) {
            return { t: [f.S, f.M, "verb:qu", f.C], also: [[f.M, f.S, "verb:qu", f.C]], end: ".", en: `${E.beSubj(f.S)} going to ${SD.THINGS[f.C].en} in ${en(f.M)}.` };
          }
        },
        { id: "li-r-day", q: ["money:jintian", "li:xingqi", JI], qen: "What day is it today?",
          a: [{ t: ["money:jintian", { any: "liDay" }], en: "Today is {x}." },
              { t: ["money:jintian", SHI, { any: "liDay" }], en: "Today is {x}." }] },
        { id: "li-r-birthday", q: ["build:ni", DE, "li:shengri", SHI, JI, "li:yue"], qen: "Which month is your birthday in?",
          a: [{ t: ["build:wo", DE, "li:shengri", SHI, { any: "liMonth" }], en: "My birthday is in {x}." }] }
      ]
    },

    // ============================================== Time
    {
      id: "li-time", name: "Telling the time", sub: "What time is it, half past, 7pm",
      items: [
        {
          id: "li-now", group: "What time is it?", name: "What time it is",
          core: ["li:dian", "li:xianzai"], slots: { H: HOURS, M: MINS },
          make(f) {
            const h = val(f.H), m = val(f.M);
            return { t: ["li:xianzai", ...hour(h), "li:dian", ...minutes(m)], end: ".", en: `It's ${clock(h, m)}.` };
          }
        },
        {
          id: "li-whattime", group: "What time is it?", name: "What time are you going?",
          core: [JI, "li:dian", "verb:qu"], slots: { S: notMe },
          make(f, E) { return { t: [f.S, JI, "li:dian", "verb:qu"], end: "?", en: `What time ${E.be(f.S)} ${E.s(f.S)} going?` }; }
        },
        {
          id: "li-goat", group: "Morning, afternoon, evening", name: "I'm going at 7pm",
          core: ["li:dian", "verb:qu"], slots: { S: people, P: ["li:zaoshang", "li:xiawu", "li:wanshang"], H: HOURS, M: ["x:m0", "x:m30"] }, flags: ["q"],
          valid: f => periodFits(f.P, val(f.H)),
          make(f, E) {
            const h = val(f.H), m = val(f.M);
            const when = [f.P, ...hour(h), "li:dian", ...minutes(m)];
            const tail = ["verb:qu", f.q && MA];
            const at = `at ${clock(h, m)} ${PERIOD[f.P]}`.replace(" o'clock", "");
            return {
              t: [f.S, ...when, ...tail], also: [[...when, f.S, ...tail]], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going ${at}?` : `${E.beSubj(f.S)} going ${at}.`
            };
          }
        },
        {
          id: "li-period", group: "Morning, afternoon, evening", name: "I drink coffee in the morning",
          core: ["verb:he"], slots: { S: people, P: ["li:zaoshang", "li:xiawu", "li:wanshang"], D: DRINKS }, flags: ["neg", "q"],
          make(f, E) {
            const d = SD.THINGS[f.D].en, p = PERIOD[f.P];
            const tail = [f.neg && BU, "verb:he", f.D, f.q && MA];
            return {
              t: [f.S, f.P, ...tail], also: [[f.P, f.S, ...tail]], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} drink ${d} ${p}?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} drink ${d} ${p}.` : `${E.S(f.S)} ${E.v(f.S, "drink", "drinks")} ${d} ${p}.`
            };
          }
        },
        { id: "li-r-time", q: ["li:xianzai", JI, "li:dian"], qen: "What time is it now?",
          a: [{ t: ["li:xianzai", { any: "liHour" }, "li:dian"], en: "It's {x} o'clock." },
              { t: ["li:xianzai", { any: "liHour" }, "li:dian", "li:ban"], en: "It's half past {x}." }] }
      ]
    },

    // ============================================== Seasons & the zodiac
    {
      id: "li-seasons", name: "Seasons & the zodiac", sub: "Hot summers, favourite seasons, your animal",
      items: [
        {
          id: "li-seasonweather", group: "Seasons", name: "Summer is very hot",
          core: [HEN], slots: { X: SEASONS, A: ["adj:re", "adj:leng"] }, flags: ["neg", "q"],
          make(f) {
            const s = en(f.X), a = en(f.A);
            if (f.q) return { t: [f.X, f.A, MA], end: "?", en: `Is ${s} ${a}?` };
            if (f.neg) return { t: [f.X, BU, f.A], end: ".", en: `${cap(s)} isn't ${a}.` };
            return { t: [f.X, HEN, f.A], end: ".", en: `${cap(s)} is very ${a}.` };
          }
        },
        {
          id: "li-monthseason", group: "Seasons", name: "December is winter",
          core: [SHI], slots: { M: MONTHS, X: SEASONS },
          valid: f => SEASON_OF[f.M] === f.X,
          make(f) { return { t: [f.M, SHI, f.X], end: ".", en: `${en(f.M)} is in ${en(f.X)}.` }; }
        },
        {
          id: "li-favseason", group: "Seasons", name: "Autumn is my favourite season",
          core: ["li:zui"], slots: { S: people, X: SEASONS },
          make(f, E) { return { t: [f.S, "li:zui", "verb:xihuan", f.X], end: ".", en: `${cap(en(f.X))} is ${E.poss(f.S)} favourite season.` }; }
        },
        {
          id: "li-seasongo", group: "Seasons", name: "Where do you go in winter?",
          core: ["verb:qu", "build:nar"], slots: { X: SEASONS, S: notMe },
          make(f, E) { return { t: [f.X, f.S, "verb:qu", "build:nar"], also: [[f.S, f.X, "verb:qu", "build:nar"]], end: "?", en: `Where ${E.Do(f.S).toLowerCase()} ${E.s(f.S)} go in ${en(f.X)}?` }; }
        },
        {
          id: "li-zodiac", group: "The zodiac", name: "I'm a Dragon",
          core: ["li:shu"], slots: { S: single, A: ANIMALS }, flags: ["neg", "q"],
          make(f, E) {
            const a = an(ANIMAL_EN(f.A));
            return {
              t: [f.S, f.neg && BU, "li:shu", f.A, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} ${a}?` : f.neg ? `${E.beNot(f.S)} ${a}.` : `${E.beSubj(f.S)} ${a}.`
            };
          }
        },
        {
          id: "li-zodiacyear", group: "The zodiac", name: "This year is the Year of the Horse",
          core: ["li:nian", "li:horse"], slots: { Y: ["li:qunian", "li:jinnian", "li:mingnian"], A: ["li:snake", "li:horse", "li:goat"] },
          valid: f => YEAR_ANIMAL[f.Y] === f.A,
          make(f) {
            const [y, be] = YEAR_EN[f.Y];
            return { t: [f.Y, SHI, f.A, "li:nian"], end: ".", en: `${y} ${be} the Year of the ${ANIMAL_EN(f.A)}.` };
          }
        },
        { id: "li-r-zodiac", q: ["build:ni", "li:shu", "build:shenme"], qen: "What's your zodiac animal?",
          a: [{ t: ["build:wo", "li:shu", { any: "liAnimal" }], en: "I was born in the Year of the {x}." }] },
        { id: "li-r-season", q: ["build:ni", "li:zui", "verb:xihuan", "li:na", GE, "li:jijie"], qen: "Which season do you like best?",
          a: [{ t: ["build:wo", "li:zui", "verb:xihuan", { any: "liSeason" }], en: "I like {x} best." }] }
      ]
    },

    // ============================================== Countries
    {
      id: "li-world", name: "Countries & languages", sub: "Where are you from, going to France",
      items: [
        {
          id: "li-nationality", group: "Where you're from", name: "I'm British",
          core: ["li:ren", SHI], slots: { S: people, C: COUNTRIES }, flags: ["neg", "q"],
          make(f, E) {
            const n = NAT[f.C];
            return {
              t: [f.S, f.neg && BU, SHI, f.C, "li:ren", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} ${n}?` : f.neg ? `${E.beNot(f.S)} ${n}.` : `${E.beSubj(f.S)} ${n}.`
            };
          }
        },
        {
          id: "li-gocountry", group: "Going places", name: "I'm going to France",
          core: ["verb:qu"], slots: { S: people, C: COUNTRIES }, flags: ["neg", "q"],
          make(f, E) {
            const c = SD.THINGS[f.C].en;
            return {
              t: [f.S, f.neg && BU, "verb:qu", f.C, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} going to ${c}?` : f.neg ? `${E.beSubj(f.S)} not going to ${c}.` : `${E.beSubj(f.S)} going to ${c}.`
            };
          }
        },
        {
          id: "li-incountry", group: "Going places", name: "She's in Japan",
          core: ["verb:zai"], slots: { S: people, C: COUNTRIES }, flags: ["neg", "q"],
          make(f, E) {
            const c = SD.THINGS[f.C].en;
            return {
              t: [f.S, f.neg && BU, "verb:zai", f.C, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} in ${c}?` : f.neg ? `${E.beNot(f.S)} in ${c}.` : `${E.beSubj(f.S)} in ${c}.`
            };
          }
        },
        {
          id: "li-nextweekgo", group: "Going places", name: "Next week I'm going to China",
          core: ["li:xia", "li:xingqi", "verb:qu"], slots: { S: people, W: ["build:zhe", "li:xia"], U: ["li:xingqi", "li:yue"], C: COUNTRIES },
          make(f, E) {
            const when = (f.W === "li:xia" ? "next " : "this ") + (f.U === "li:yue" ? "month" : "week");
            const w = [f.W, GE, f.U];
            return { t: [...w, f.S, "verb:qu", f.C], also: [[f.S, ...w, "verb:qu", f.C]], end: ".", en: `${cap(when)} ${E.beSubj(f.S).replace(/^(?!I')./, c => c.toLowerCase())} going to ${SD.THINGS[f.C].en}.` };
          }
        },
        {
          id: "li-speak", group: "Languages", name: "I speak Chinese",
          core: ["verb:shuo"], slots: { S: people, L: ["li:zhongwen", "li:yingwen"] }, flags: ["neg", "q"],
          make(f, E) {
            const l = SD.THINGS[f.L].en;
            return {
              t: [f.S, f.neg && BU, "verb:shuo", f.L, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} speak ${l}?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} speak ${l}.` : `${E.S(f.S)} ${E.v(f.S, "speak", "speaks")} ${l}.`
            };
          }
        },
        { id: "li-r-from", q: ["build:ni", SHI, "li:na", "li:guo", "li:ren"], qen: "Where are you from?",
          a: [{ t: ["build:wo", SHI, { any: "liCountry" }, "li:ren"], en: "I'm from {x}." }] },
        { id: "li-r-speak", q: ["build:ni", "verb:shuo", "li:yingwen", MA], qen: "Do you speak English?",
          a: [{ t: ["build:wo", "verb:shuo", "li:yingwen"], en: "I speak English." },
              { t: ["build:wo", BU, "verb:shuo", "li:yingwen"], en: "I don't speak English." }] }
      ]
    }
  ];

  // Lists the replies can draw from ({ any: "…" }).
  Object.assign(SD.LISTS, {
    liColour: COLOURS, liDay: DAYS, liMonth: MONTHS, liSeason: SEASONS, liAnimal: ANIMALS, liCountry: COUNTRIES,
    liHour: ["num:yi", LIANG, "num:san", "num:si", "num:wu", "num:liu", "num:qi", "num:ba", "num:jiu", "num:shi"],
    liAge: ["num:yi", LIANG, "num:san", "num:si", "num:wu", "num:liu", "num:qi", "num:ba", "num:jiu", "num:shi"]
  });

  // Extra grammar for Explain. "de = 's" doesn't fit "the red one", so it steps aside there.
  const deRule = SD.RULES.find(r => r.id === "de");
  if (deRule) { const w = deRule.when; deRule.when = t => !t.some(x => COLOURS.includes(x)) && (!w || w(t)); }
  const digits = DIG.filter(Boolean);
  const order = SD.RULES.findIndex(r => r.id === "order");
  SD.RULES.splice(order, 0,
    { id: "days", title: "Days are week + number", words: ["li:xingqi", ...DAYS],
      text: "xīngqī (week) + a number: xīngqīyī = week-1 = Monday … xīngqīliù = Saturday. Sunday is the odd one: xīngqītiān (or xīngqīrì)." },
    { id: "months", title: "Months are number + yuè", words: MONTHS,
      text: "A number + yuè (month): yīyuè = 1-month = January … shí'èryuè = December." },
    { id: "dates", title: "Dates go big to small", words: ["li:hao"],
      text: "Month first, then the day with hào: sānyuè wǔ hào = 3-month 5-date = 5 March. A year would go before both." },
    { id: "ji", title: "jǐ = which number?", words: [JI],
      text: "jǐ asks for a number and sits where the number would go: xīngqī jǐ? (week-which? = what day?), jǐ diǎn? (what time?), jǐ suì? (how old, to a child). It's already a question, so no ma." },
    { id: "na3", title: "nǎ = which", words: ["li:na"],
      text: "nǎ (3rd tone) = which, usually with gè: nǎ gè jìjié? = which season? Not to be confused with nà (that) or nǎr (where)." },
    { id: "zui", title: "zuì xǐhuan = favourite", words: ["li:zui"],
      text: "zuì (most) goes before the verb: wǒ zuì xǐhuan lánsè = I most like blue = blue is my favourite." },
    { id: "colourde", title: "colour + de = the … one", words: COLOURS, when: t => t.includes(DE),
      text: "Put de after a colour to mean 'the … one': wǒ yào hóngsè de = I want red one. zhè gè shì lánsè de = this one is blue." },
    { id: "tens", title: "11 to 99 from 1 to 10", words: ["num:shi"], when: t => t.filter(x => x === "num:shi" || digits.includes(x)).length > 1,
      text: "Just combine: shí wǔ = 10-5 = 15, wǔ shí = 5-10 = 50, wǔ shí wǔ = 55. Tens go before shí, units after it." },
    { id: "bignum", title: "bǎi, qiān, wàn", words: ["li:bai100", "li:qian", "li:wan"],
      text: "Say each digit with its place: sān bǎi wǔ shí = 3-hundred 5-ten = 350. wàn is 10,000, so 50,000 is wǔ wàn and 100,000 is shí wàn. yī changes tone before these: yìbǎi, yìqiān, yíwàn." },
    { id: "ling", title: "líng fills a gap", words: ["li:ling"],
      text: "When a place is empty in the middle of a number, say líng (zero): yìbǎi líng wǔ = 105." },
    { id: "liang2", title: "2 is liǎng before diǎn, suì, qiān, wàn", words: [LIANG], when: t => t.some(x => ["li:dian", "li:sui", "li:qian", "li:wan", "li:bai100"].includes(x)),
      text: "liǎng diǎn = 2 o'clock, liǎngqiān = 2,000, liǎng wàn = 20,000 (200 can be èrbǎi or liǎngbǎi). But 12 stays shí'èr and 20 stays èrshí." },
    { id: "time", title: "Hour, then minutes", words: ["li:dian"],
      text: "Hour + diǎn, then minutes + fēn, or bàn for half past: sān diǎn bàn = 3:30, sān diǎn shíwǔ fēn = 3:15. Morning or evening goes first: wǎnshang qī diǎn = 7pm." },
    { id: "whenfirst", title: "When-words go before the verb", words: [...DAYS, ...SEASONS, ...MONTHS, "li:zhoumo", "li:zaoshang", "li:xiawu", "li:wanshang", "li:xingqi"],
      when: t => t.some(x => ["verb:qu", "verb:he"].includes(x)),
      text: "Times go before the verb, either before or after the person, never at the end: wǒ xīngqīliù qù or xīngqīliù wǒ qù = I'm going on Saturday." },
    { id: "shangxia", title: "shàng = last, xià = next", words: ["li:shang", "li:xia"],
      text: "shàng (up) means last and xià (down) means next, with gè: shàng gè xīngqī = last week, xià gè yuè = next month. zhè gè = this." },
    { id: "sui", title: "Ages: number + suì", words: ["li:sui"],
      text: "No verb needed: wǒ sānshí suì = I 30 years-old. Ask a child nǐ jǐ suì?, and an adult nǐ duō dà? (you how big?)." },
    { id: "shu", title: "shǔ = belong to", words: ["li:shu"],
      text: "Your zodiac animal is the year you belong to: wǒ shǔ lóng = I belong dragon = I'm a Dragon. Ask nǐ shǔ shénme?" },
    { id: "ren", title: "Country + rén", words: ["li:ren"],
      text: "Add rén (person) to a country for its people: Yīngguó rén = British, Zhōngguó rén = Chinese. Where are you from? = nǐ shì nǎ guó rén? (you are which country person?)" },
    { id: "wen", title: "wén = language", words: ["li:zhongwen", "li:yingwen"],
      text: "Zhōngwén = Chinese, Yīngwén = English. Use shuō (speak): wǒ shuō Yīngwén." },
    { id: "seasons", title: "Seasons end in tiān", words: SEASONS,
      text: "chūntiān (spring), xiàtiān (summer), qiūtiān (autumn), dōngtiān (winter). They work like time words: dōngtiān hěn lěng = winter is very cold." }
  );

  return {
    id: "lists", name: "Lists", sub: "Colours, days, months, numbers, time, the zodiac, countries",
    GROUPS, WORDS, ALIKE, SECTIONS
  };
}());
