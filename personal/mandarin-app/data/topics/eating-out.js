/* Topic: Eating out.

   Same shape as the Essentials files: words (in teaching order), groups, look-alikes,
   then sentence sections. Sentences mix these words with Essentials words.
   Word IDs start with "eo:" and must never change once used. */
window.TOPIC_DATA = window.TOPIC_DATA || {};
window.TOPIC_DATA["eating-out"] = (function () {
  const SD = window.SENTENCES;

  const GROUPS = [
    { id: "eo-order", name: "Ordering & asking" },
    { id: "eo-table", name: "On the table" },
    { id: "eo-count", name: "Counting words" },
    { id: "eo-taste", name: "Tastes & feelings" },
    { id: "eo-food",  name: "Dishes" },
    { id: "eo-drink", name: "Drinks" }
  ];

  // role = tile colour in sentences (who / does / what / describes / number / little words / phrases)
  const WORDS = [
    // 1
    { id: "eo:fuwuyuan", py: "fú|wù|yuán", say: "foo-woo-ywen", en: "waiter / waitress", group: "eo-order", role: "person", note: "Call it out to get attention: fúwùyuán! It's normal and polite in China." },
    { id: "eo:caidan",   py: "cài|dān",    say: "tsye-dahn",    en: "menu",              group: "eo-order", role: "thing" },
    { id: "eo:dian",     py: "diǎn",       say: "dyen",         en: "to order (food)",   group: "eo-order", role: "verb", note: "diǎn cài = order dishes." },
    { id: "eo:cai",      py: "cài",        say: "tsye",         en: "dish (of food)",    group: "eo-order", role: "thing" },
    // 2
    { id: "eo:ji",       py: "jǐ",         say: "jee",          en: "how many? (small number)", group: "eo-count", role: "glue", note: "jǐ wèi? = how many people? No ma: jǐ already asks." },
    { id: "eo:liang",    py: "liǎng",      say: "lyahng",       en: "two (before a counting word)", group: "eo-count", role: "number", note: "Before a counting word, 2 is liǎng, not èr: liǎng bēi, liǎng gè, liǎng wèi." },
    { id: "eo:wei",      py: "wèi",        say: "way",          en: "(polite counter for people)", group: "eo-count", role: "number", note: "liǎng wèi = two people (said politely)." },
    { id: "eo:zhuozi",   py: "zhuō|zi",    say: "jwaw-dzuh",    en: "table",             group: "eo-table", role: "thing" },
    // 3
    { id: "eo:gei",      py: "gěi",        say: "gay",          en: "to give",           group: "eo-order", role: "verb", note: "gěi wǒ … = give me … A normal way to ask." },
    { id: "eo:bei",      py: "bēi",        say: "bay",          en: "a cup / glass of",  group: "eo-count", role: "number", note: "A counting word: yì bēi chá = a cup of tea." },
    { id: "eo:wan",      py: "wǎn",        say: "wahn",         en: "a bowl of",         group: "eo-count", role: "number", note: "yì wǎn miàntiáo = a bowl of noodles." },
    { id: "eo:ping",     py: "píng",       say: "ping",         en: "a bottle of",       group: "eo-count", role: "number", note: "yì píng píjiǔ = a bottle of beer." },
    // 4
    { id: "eo:zai",      py: "zài",        say: "dzye",         en: "again / one more",  group: "eo-order", role: "glue", note: "zài lái liǎng gè = two more (again-come two). Not the same as zài = be at." },
    { id: "eo:hai",      py: "hái",        say: "high",         en: "also / still",      group: "eo-order", role: "glue", note: "hái yào … = (I) also want …" },
    { id: "eo:yiyang",   py: "yí|yàng",    say: "ee-yahng",     en: "the same",          group: "eo-order", role: "describe", note: "yíyàng de = the same one." },
    { id: "eo:biede",    py: "bié|de",     say: "byeh-duh",     en: "anything else / other", group: "eo-order", role: "thing", note: "hái yào biéde ma? = anything else?" },
    // 5
    { id: "eo:niurou",   py: "niú|ròu",    say: "nyoh-roh",     en: "beef",              group: "eo-food", role: "thing" },
    { id: "eo:zhurou",   py: "zhū|ròu",    say: "joo-roh",      en: "pork",              group: "eo-food", role: "thing" },
    { id: "eo:jidan",    py: "jī|dàn",     say: "jee-dahn",     en: "egg",               group: "eo-food", role: "thing" },
    { id: "eo:doufu",    py: "dòu|fu",     say: "doh-foo",      en: "tofu",              group: "eo-food", role: "thing" },
    // 6
    { id: "eo:haochi",   py: "hǎo|chī",    say: "how-chrr",     en: "tasty (food)",      group: "eo-taste", role: "describe", note: "For food. For drinks say hǎohē." },
    { id: "eo:la",       py: "là",         say: "lah",          en: "spicy",             group: "eo-taste", role: "describe" },
    { id: "eo:weila",    py: "wēi|là",     say: "way-lah",      en: "mildly spicy",      group: "eo-taste", role: "describe" },
    { id: "eo:shao",     py: "shǎo",       say: "shaow",        en: "less / few",        group: "eo-order", role: "describe", note: "shǎo là = less spicy." },
    // 7
    { id: "eo:guozhi",   py: "guǒ|zhī",    say: "gwaw-jrr",     en: "juice",             group: "eo-drink", role: "thing" },
    { id: "eo:kele",     py: "kě|lè",      say: "kuh-luh",      en: "cola",              group: "eo-drink", role: "thing" },
    { id: "eo:kuangquanshui", py: "kuàng|quán|shuǐ", say: "kwahng-chwen-shway", en: "bottled water", group: "eo-drink", role: "thing" },
    { id: "eo:bing",     py: "bīng",       say: "bing",         en: "ice",               group: "eo-drink", role: "thing", note: "bú yào bīng = no ice." },
    // 8
    { id: "eo:chaofan",  py: "chǎo|fàn",   say: "chaow-fahn",   en: "fried rice",        group: "eo-food", role: "thing" },
    { id: "eo:chaomian", py: "chǎo|miàn",  say: "chaow-myen",   en: "fried noodles",     group: "eo-food", role: "thing" },
    { id: "eo:baozi",    py: "bāo|zi",     say: "baow-dzuh",    en: "steamed bun",       group: "eo-food", role: "thing" },
    { id: "eo:tang",     py: "tāng",       say: "tahng",        en: "soup",              group: "eo-food", role: "thing" },
    // 9
    { id: "eo:e",        py: "è",          say: "uh",           en: "hungry",            group: "eo-taste", role: "describe", note: "wǒ è le = I'm hungry (now)." },
    { id: "eo:ke",       py: "kě",         say: "kuh",          en: "thirsty",           group: "eo-taste", role: "describe" },
    { id: "eo:bao",      py: "bǎo",        say: "baow",         en: "full (after eating)", group: "eo-taste", role: "describe", note: "wǒ bǎo le = I'm full." },
    { id: "eo:deng",     py: "děng",       say: "dung",         en: "to wait",           group: "eo-order", role: "verb" },
    // 10
    { id: "eo:kuaizi",   py: "kuài|zi",    say: "kwhy-dzuh",    en: "chopsticks",        group: "eo-table", role: "thing" },
    { id: "eo:shaozi",   py: "sháo|zi",    say: "shaow-dzuh",   en: "spoon",             group: "eo-table", role: "thing" },
    { id: "eo:beizi",    py: "bēi|zi",     say: "bay-dzuh",     en: "cup / glass",       group: "eo-table", role: "thing", note: "The cup itself. bēi (without zi) is the counting word: yì bēi chá." },
    { id: "eo:zhijin",   py: "zhǐ|jīn",    say: "jrr-jin",      en: "napkin / tissue",   group: "eo-table", role: "thing" },
    // 11
    { id: "eo:maidan",   py: "mǎi|dān",    say: "my-dahn",      en: "the bill, please",  group: "eo-order", role: "verb", note: "Call out fúwùyuán, mǎidān! to ask for the bill." },
    { id: "eo:yong",     py: "yòng",       say: "yohng",        en: "to use",            group: "eo-order", role: "verb" },
    { id: "eo:weixin",   py: "wēi|xìn",    say: "way-shin",     en: "WeChat",            group: "eo-order", role: "thing", note: "kěyǐ yòng wēixìn ma? = can I pay with WeChat?" },
    { id: "eo:dabao",    py: "dǎ|bāo",     say: "dah-baow",     en: "to take away / box up", group: "eo-order", role: "verb" },
    // 12
    { id: "eo:qingwen",  py: "qǐng|wèn",   say: "ching-wun",    en: "excuse me (may I ask)", group: "eo-order", role: "greet", note: "Polite opener for a question: qǐngwèn, xǐshǒujiān zài nǎr?" },
    { id: "eo:xishoujian", py: "xǐ|shǒu|jiān", say: "shee-show-jyen", en: "washroom / toilet", group: "eo-order", role: "thing", note: "The polite word (literally 'wash-hands-room')." },
    { id: "eo:yizi",     py: "yǐ|zi",      say: "yee-dzuh",     en: "chair",             group: "eo-table", role: "thing" },
    { id: "eo:panzi",    py: "pán|zi",     say: "pahn-dzuh",    en: "plate",             group: "eo-table", role: "thing", note: "The plate itself. pán (without zi) is the counting word: yì pán jiǎozi." },
    // 13
    { id: "eo:hongjiu",  py: "hóng|jiǔ",   say: "hong-jyoh",    en: "red wine",          group: "eo-drink", role: "thing" },
    { id: "eo:baiputaojiu", py: "bái pú|tao|jiǔ", say: "bye poo-taow-jyoh", en: "white wine", group: "eo-drink", role: "thing", note: "Literally 'white grape alcohol'. Don't ask for báijiǔ by mistake!" },
    { id: "eo:baijiu",   py: "bái|jiǔ",    say: "bye-jyoh",     en: "baijiu (strong Chinese spirit)", group: "eo-drink", role: "thing", note: "Not white wine: a very strong grain spirit, used for toasts." },
    { id: "eo:haohe",    py: "hǎo|hē",     say: "how-huh",      en: "tasty (drink)",     group: "eo-taste", role: "describe", note: "For drinks. For food say hǎochī." },
    // 14
    { id: "eo:kaoya",    py: "kǎo|yā",     say: "kaow-yah",     en: "roast duck",        group: "eo-food", role: "thing" },
    { id: "eo:yangrou",  py: "yáng|ròu",   say: "yahng-roh",    en: "lamb",              group: "eo-food", role: "thing" },
    { id: "eo:xia",      py: "xiā",        say: "shyah",        en: "prawns",            group: "eo-food", role: "thing" },
    { id: "eo:huoguo",   py: "huǒ|guō",    say: "hwaw-gwaw",    en: "hotpot",            group: "eo-food", role: "thing" },
    // 15
    { id: "eo:tian",     py: "tián",       say: "tyen",         en: "sweet",             group: "eo-taste", role: "describe" },
    { id: "eo:xian",     py: "xián",       say: "shyen",        en: "salty",             group: "eo-taste", role: "describe" },
    { id: "eo:suan",     py: "suān",       say: "swahn",        en: "sour",              group: "eo-taste", role: "describe" },
    { id: "eo:pan",      py: "pán",        say: "pahn",         en: "a plate of",        group: "eo-count", role: "number", note: "yì pán jiǎozi = a plate of dumplings." },
    // 16
    { id: "eo:daozi",    py: "dāo|zi",     say: "daow-dzuh",    en: "knife",             group: "eo-table", role: "thing" },
    { id: "eo:chazi",    py: "chā|zi",     say: "chah-dzuh",    en: "fork",              group: "eo-table", role: "thing" },
    { id: "eo:fanguan",  py: "fàn|guǎn",   say: "fahn-gwahn",   en: "restaurant",        group: "eo-order", role: "thing" },
    { id: "eo:shaokao",  py: "shāo|kǎo",   say: "shaow-kaow",   en: "barbecue skewers",  group: "eo-food", role: "thing" },
    // 17
    { id: "eo:qingcai",  py: "qīng|cài",   say: "ching-tsye",   en: "green vegetables",  group: "eo-food", role: "thing" },
    { id: "eo:tudou",    py: "tǔ|dòu",     say: "too-doh",      en: "potato",            group: "eo-food", role: "thing" },
    { id: "eo:qiezi",    py: "qié|zi",     say: "chyeh-dzuh",   en: "aubergine",         group: "eo-food", role: "thing" },
    { id: "eo:huntun",   py: "hún|tun",    say: "hwun-tun",     en: "wontons",           group: "eo-food", role: "thing" },
    // 18
    { id: "eo:shuiguo",  py: "shuǐ|guǒ",   say: "shway-gwaw",   en: "fruit",             group: "eo-food", role: "thing" },
    { id: "eo:bingqilin", py: "bīng|qí|lín", say: "bing-chee-lin", en: "ice cream",      group: "eo-food", role: "thing" },
    // 19: spice levels
    { id: "eo:zhongla",  py: "zhōng|là",   say: "jong-lah",     en: "medium spicy",      group: "eo-taste", role: "describe", note: "The three usual levels: wēilà (mild), zhōnglà (medium), tèlà (extra hot)." },
    { id: "eo:tela",     py: "tè|là",      say: "tuh-lah",      en: "extra spicy",       group: "eo-taste", role: "describe" },
    { id: "eo:pa",       py: "pà",         say: "pah",          en: "to be afraid of",   group: "eo-taste", role: "verb", note: "wǒ pà là = I can't handle spicy food (I fear spicy). wǒ bú pà là = I'm fine with it." },
    { id: "eo:yidianr",  py: "yì|diǎnr",   say: "ee-dyar",      en: "a little",          group: "eo-taste", role: "describe", note: "yǒu yìdiǎnr là = it's a bit spicy." }
  ];

  const ALIKE = [
    ["eo:haochi", "eo:haohe"],
    ["eo:liang", "num:er"],
    ["eo:ji", "build:duoshao"],
    ["eo:bei", "eo:beizi"],
    ["eo:pan", "eo:panzi"],
    ["eo:cai", "eo:caidan"],
    ["eo:la", "eo:weila"],
    ["eo:shao", "adj:xiao"],
    ["eo:hai", "build:ye"]
  ];

  // ---------------------------------------------------------------- English forms for sentences
  // en: plain. pl: takes "are". one/many: for counting with gè. req: how you'd ask for it.
  const THINGS = {
    "eo:caidan": { en: "menu", req: "the menu" },
    "eo:zhuozi": { en: "table", req: "a table" },
    "eo:yizi": { en: "chair", req: "a chair" },
    "eo:kuaizi": { en: "chopsticks", pl: true, req: "some chopsticks" },
    "eo:daozi": { en: "knife", req: "a knife" },
    "eo:chazi": { en: "fork", req: "a fork" },
    "eo:shaozi": { en: "spoon", req: "a spoon" },
    "eo:beizi": { en: "cup", req: "a cup" },
    "eo:panzi": { en: "plate", req: "a plate" },
    "eo:zhijin": { en: "napkins", pl: true, req: "some napkins" },
    "eo:xishoujian": { en: "washroom" },
    "eo:weixin": { en: "WeChat" },
    "eo:cai": { en: "dish" },
    "eo:biede": { en: "something else" },
    "eo:bing": { en: "ice" },
    "eo:niurou": { en: "beef" }, "eo:zhurou": { en: "pork" }, "eo:yangrou": { en: "lamb" },
    "eo:kaoya": { en: "roast duck" }, "eo:xia": { en: "prawns", pl: true },
    "eo:jidan": { en: "eggs", pl: true, one: "egg", many: "eggs" },
    "eo:doufu": { en: "tofu" },
    "eo:baozi": { en: "steamed buns", pl: true, one: "steamed bun", many: "steamed buns" },
    "eo:chaofan": { en: "fried rice" }, "eo:chaomian": { en: "fried noodles", pl: true },
    "eo:huntun": { en: "wontons", pl: true }, "eo:tang": { en: "soup" },
    "eo:qingcai": { en: "greens", pl: true }, "eo:tudou": { en: "potatoes", pl: true },
    "eo:qiezi": { en: "aubergine" }, "eo:huoguo": { en: "hotpot" }, "eo:shaokao": { en: "skewers", pl: true },
    "eo:shuiguo": { en: "fruit" }, "eo:bingqilin": { en: "ice cream" },
    "eo:guozhi": { en: "juice" }, "eo:kele": { en: "cola" }, "eo:kuangquanshui": { en: "bottled water" },
    "eo:hongjiu": { en: "red wine" }, "eo:baiputaojiu": { en: "white wine" }, "eo:baijiu": { en: "baijiu" }
  };
  Object.assign(SD.THINGS, THINGS);
  SD.NUMBERS["eo:liang"] = [2, "two"];
  SD.MEASURES.push("eo:bei", "eo:wan", "eo:ping", "eo:pan", "eo:wei");
  SD.QUESTION_WORDS.push("eo:ji");
  Object.assign(SD.LITERAL, {
    "eo:fuwuyuan": "waiter", "eo:dian": "order", "eo:ji": "how many", "eo:liang": "2", "eo:wei": "(people)",
    "eo:gei": "give", "eo:bei": "glass", "eo:wan": "bowl", "eo:ping": "bottle", "eo:pan": "plate",
    "eo:zai": "again", "eo:hai": "also", "eo:yiyang": "same", "eo:biede": "other", "eo:haochi": "tasty",
    "eo:haohe": "tasty", "eo:weila": "mild-spicy", "eo:shao": "less", "eo:bao": "full", "eo:maidan": "bill",
    "eo:dabao": "box-up", "eo:qingwen": "may I ask", "eo:xishoujian": "washroom", "eo:baiputaojiu": "white wine",
    "eo:baijiu": "baijiu", "eo:cai": "dish", "eo:beizi": "cup", "eo:panzi": "plate", "eo:zhijin": "napkin",
    "eo:kuangquanshui": "bottled water", "eo:qingcai": "greens", "eo:shaokao": "skewers", "eo:yong": "use", "eo:deng": "wait",
    "eo:zhongla": "medium-spicy", "eo:tela": "extra-spicy", "eo:pa": "fear", "eo:yidianr": "a little"
  });

  // ---------------------------------------------------------------- slot lists
  const people = ["build:wo", "build:ni", "build:ta", "build:women"];
  const weMe = ["build:wo", "build:women"];
  const count = ["num:yi", "eo:liang", "num:san", "num:si", "num:wu", "num:liu"];
  const more = ["num:yi", "eo:liang", "num:san"];
  const dishes = ["eo:niurou", "eo:zhurou", "eo:yangrou", "eo:kaoya", "eo:xia", "eo:jidan", "eo:doufu", "eo:baozi",
    "eo:chaofan", "eo:chaomian", "eo:huntun", "eo:tang", "eo:qingcai", "eo:tudou", "eo:qiezi", "eo:huoguo",
    "eo:shaokao", "eo:shuiguo", "eo:bingqilin", "food:mifan", "food:miantiao", "food:jiaozi", "food:jirou", "food:yu"];
  const drinks = ["eo:guozhi", "eo:kele", "eo:kuangquanshui", "eo:hongjiu", "eo:baiputaojiu", "eo:baijiu",
    "food:cha", "food:kafei", "food:pijiu", "food:shui"];
  const tableThings = ["eo:caidan", "eo:kuaizi", "eo:daozi", "eo:chazi", "eo:shaozi", "eo:beizi", "eo:panzi", "eo:zhijin"];
  const foodTaste = ["eo:haochi", "eo:la", "eo:tian", "eo:xian", "eo:suan"];
  const drinkTaste = ["eo:haohe", "eo:tian", "eo:suan"];
  const noThanks = ["eo:bing", "eo:zhurou", "eo:niurou", "eo:yangrou", "food:jirou", "eo:xia", "eo:jidan", "eo:qingcai"];
  const measures = ["eo:bei", "eo:wan", "eo:ping", "eo:pan", "build:ge"];

  // Which counting word goes with which food or drink.
  const MEASURE_OF = {
    "eo:bei": ["eo:guozhi", "eo:kele", "eo:hongjiu", "eo:baiputaojiu", "eo:baijiu", "food:cha", "food:kafei", "food:pijiu", "food:shui"],
    "eo:ping": ["eo:kele", "eo:kuangquanshui", "eo:hongjiu", "eo:baiputaojiu", "eo:baijiu", "food:pijiu"],
    "eo:wan": ["food:mifan", "food:miantiao", "eo:tang", "eo:chaofan", "eo:huntun", "eo:chaomian"],
    "eo:pan": ["food:jiaozi", "eo:chaofan", "eo:chaomian", "eo:qingcai", "eo:tudou", "eo:qiezi", "eo:xia", "eo:niurou", "eo:zhurou", "food:jirou", "eo:doufu", "eo:kaoya", "eo:shaokao"],
    "build:ge": ["eo:baozi", "eo:jidan", "food:jiaozi"]
  };
  const orderable = [...new Set(Object.values(MEASURE_OF).flat())];
  const fits = (m, o) => MEASURE_OF[m] && MEASURE_OF[m].includes(o);
  const MEAS_EN = { "eo:bei": ["glass", "glasses"], "eo:wan": ["bowl", "bowls"], "eo:ping": ["bottle", "bottles"], "eo:pan": ["plate", "plates"] };
  const hot = ["food:cha", "food:kafei"];

  // English for "a bowl of noodles", "two glasses of juice", "three steamed buns".
  function amount(N, M, O) {
    const n = SD.NUMBERS[N][0], word = SD.NUMBERS[N][1];
    if (M === "build:ge") return (n === 1 ? "a " : word + " ") + (n === 1 ? THINGS_ALL()[O].one : THINGS_ALL()[O].many);
    let [one, many] = MEAS_EN[M];
    if (M === "eo:bei" && hot.includes(O)) { one = "cup"; many = "cups"; }
    return (n === 1 ? "a " + one : word + " " + many) + " of " + THINGS_ALL()[O].en;
  }
  function measureOnly(N, M) {
    const n = SD.NUMBERS[N][0], word = SD.NUMBERS[N][1];
    if (M === "build:ge") return n === 1 ? "one more" : word + " more";
    const [one, many] = MEAS_EN[M];
    return n === 1 ? "another " + one : word + " more " + many;
  }
  const THINGS_ALL = () => SD.THINGS;
  const req = id => THINGS_ALL()[id].req || "some " + THINGS_ALL()[id].en;
  const isDrink = id => drinks.includes(id);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const BU = "build:bu", MA = "build:ma", HEN = "build:hen";

  // ---------------------------------------------------------------- sections
  const SECTIONS = [
    // ============================================== Arriving & ordering
    {
      id: "eo-arrive", name: "Arriving & ordering", sub: "Tables, menus, ordering dishes",
      items: [
        {
          id: "eo-people", group: "Arriving", name: "Two of us",
          core: ["eo:wei"], slots: { N: count },
          make(f) {
            const n = SD.NUMBERS[f.N];
            return { t: [f.N, "eo:wei"], end: ".", en: n[0] === 1 ? "Just one." : `${cap(n[1])} people.` };
          }
        },
        {
          id: "eo-havetable", group: "Arriving", name: "Do you have a table?",
          core: ["verb:you", "eo:zhuozi"], slots: { N: count },
          make(f) {
            const n = SD.NUMBERS[f.N];
            return { t: ["verb:you", f.N, "eo:wei", "build:de", "eo:zhuozi", MA], end: "?", en: n[0] === 1 ? "Do you have a table for one?" : `Do you have a table for ${n[1]}?` };
          }
        },
        {
          id: "eo-waiter", group: "Arriving", name: "Waiter, the menu!",
          core: ["eo:fuwuyuan"], slots: { X: tableThings },
          make(f) { return { t: ["eo:fuwuyuan", ",", f.X], end: "!", en: `Waiter, ${req(f.X)}, please!` }; }
        },
        {
          id: "eo-diancai", group: "Ordering", name: "We'd like to order",
          core: ["eo:dian", "eo:cai"], slots: { S: people }, flags: ["q"],
          make(f, E) {
            return {
              t: [f.S, "verb:yao", "eo:dian", "eo:cai", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} ready to order?` : `${E.S(f.S)} would like to order.`
            };
          },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-thisone", group: "Ordering", name: "I'll have this one",
          core: ["build:ge"], slots: { S: weMe, D: ["build:zhe", "build:na"] },
          make(f, E) { return { t: [f.S, "verb:yao", f.D, "build:ge"], end: ".", en: `${E.S(f.S)}'ll have ${f.D === "build:zhe" ? "this" : "that"} one.` }; },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-lai", group: "Ordering", name: "A bowl of noodles, please",
          core: ["verb:lai"], slots: { N: count, M: measures, O: orderable },
          valid: f => fits(f.M, f.O),
          make(f) { return { t: ["verb:lai", f.N, f.M, f.O], end: ".", en: `${cap(amount(f.N, f.M, f.O))}, please.` }; }
        },
        {
          id: "eo-give", group: "Ordering", name: "Give me a glass of juice",
          core: ["eo:gei"], slots: { N: count, M: measures, O: orderable },
          valid: f => fits(f.M, f.O),
          make(f) { return { t: ["eo:gei", "build:wo", f.N, f.M, f.O], end: ".", en: `Give me ${amount(f.N, f.M, f.O)}, please.` }; }
        },
        {
          id: "eo-want", group: "Ordering", name: "I'd like a bottle of beer",
          core: ["verb:yao"], slots: { S: weMe, N: count, M: measures, O: orderable },
          valid: f => fits(f.M, f.O),
          make(f, E) { return { t: [f.S, "verb:yao", f.N, f.M, f.O], end: ".", en: `${E.S(f.S)}'d like ${amount(f.N, f.M, f.O)}.` }; },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-haveany", group: "Ordering", name: "Do you have roast duck?",
          core: ["verb:you"], slots: { O: [...dishes, ...drinks] },
          make(f) { return { t: ["verb:you", f.O, MA], end: "?", en: `Do you have ${THINGS_ALL()[f.O].en}?` }; }
        },
        { id: "eor-people", q: ["eo:ji", "eo:wei"], qen: "How many people?",
          a: [{ t: [{ any: "eoPeople" }, "eo:wei"], en: "{x} people." }] },
        { id: "eor-drink", q: ["verb:he", "build:shenme"], qen: "What would you like to drink?",
          a: [{ t: ["verb:lai", "num:yi", "eo:bei", { any: "eoGlass" }], en: "A glass of {x}, please." },
              { t: ["build:wo", "verb:yao", "num:yi", "eo:bei", { any: "eoGlass" }], en: "I'd like a glass of {x}." }] }
      ]
    },

    // ============================================== More & changes
    {
      id: "eo-more", name: "More, again & changes", sub: "Two more, the same, no ice, less spicy",
      items: [
        {
          id: "eo-again", group: "More of the same", name: "Two more",
          core: ["eo:zai", "verb:lai"], slots: { N: more, M: measures },
          make(f) { return { t: ["eo:zai", "verb:lai", f.N, f.M], end: ".", en: `${cap(measureOnly(f.N, f.M))}, please.` }; }
        },
        {
          id: "eo-another", group: "More of the same", name: "Another bottle of beer",
          core: ["eo:zai", "verb:lai"], slots: { N: more, M: measures, O: orderable },
          valid: f => fits(f.M, f.O),
          make(f) {
            const n = SD.NUMBERS[f.N][0];
            const amt = amount(f.N, f.M, f.O);
            const en = n === 1 ? amt.replace(/^a /, "another ") : amt.replace(/^(\w+) /, "$1 more ");
            return { t: ["eo:zai", "verb:lai", f.N, f.M, f.O], end: ".", en: `${cap(en)}, please.` };
          }
        },
        {
          id: "eo-same", group: "More of the same", name: "The same, please",
          core: ["eo:yiyang", "build:de"], slots: { S: ["build:wo", "build:women", "build:ta"] },
          make(f, E) { return { t: [f.S, "verb:yao", "eo:yiyang", "build:de"], end: ".", en: `${E.S(f.S)}'ll have the same.` }; },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-also", group: "More of the same", name: "We'd also like…",
          core: ["eo:hai"], slots: { S: weMe, O: [...dishes, ...drinks] },
          make(f, E) { return { t: [f.S, "eo:hai", "verb:yao", f.O], end: ".", en: `${E.S(f.S)}'d also like ${THINGS_ALL()[f.O].en}.` }; },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-without", group: "Changes", name: "No ice, please",
          core: ["verb:yao"], slots: { X: noThanks },
          make(f) { return { t: [BU, "verb:yao", f.X], end: ".", en: `No ${THINGS_ALL()[f.X].en}, please.` }; }
        },
        {
          id: "eo-spicelevel", group: "Spice levels", name: "Medium spicy, please",
          core: ["eo:weila", "eo:zhongla", "eo:tela"], slots: { S: weMe, L: ["eo:weila", "eo:zhongla", "eo:tela"] },
          make(f, E) {
            const lvl = { "eo:weila": "mildly", "eo:zhongla": "medium", "eo:tela": "extra" }[f.L];
            return { t: [f.S, "verb:yao", f.L], end: ".", en: `${E.S(f.S)}'d like it ${lvl} spicy.` };
          },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-chila", group: "Spice levels", name: "Do you eat spicy food?",
          core: ["eo:la"], slots: { S: people }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, f.neg && BU, "verb:chi", "eo:la", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} eat spicy food?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} eat spicy food.` : `${E.S(f.S)} ${E.v(f.S, "eat", "eats")} spicy food.`
            };
          }
        },
        {
          id: "eo-pala", group: "Spice levels", name: "I can't handle spicy food",
          core: ["eo:pa", "eo:la"], slots: { S: people }, flags: ["neg", "q"],
          make(f, E) {
            return {
              t: [f.S, f.neg && BU, "eo:pa", "eo:la", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} okay with spicy food?` : f.neg ? `${E.beSubj(f.S)} fine with spicy food.` : `${E.S(f.S)} can't handle spicy food.`
            };
          }
        },
        {
          id: "eo-bitspicy", group: "Spice levels", name: "This dish is a bit spicy",
          core: ["eo:yidianr", "verb:you"], slots: { D: ["build:zhe", "build:na"], A: ["eo:la", "eo:xian", "eo:tian", "eo:suan"] },
          make(f) {
            const one = f.D === "build:zhe" ? "This" : "That";
            return { t: [f.D, "build:ge", "eo:cai", "verb:you", "eo:yidianr", f.A], end: ".", en: `${one} dish is a bit ${Banks.BY_ID[f.A].en}.` };
          }
        },
        {
          id: "eo-toohotforme", group: "Spice levels", name: "Too spicy, I can't handle it",
          core: ["eo:pa", "build:tai"], slots: {},
          make() { return { t: ["build:tai", "eo:la", "x:le", ",", "build:wo", "eo:pa", "eo:la"], end: "!", en: "Too spicy! I can't handle spicy food." }; }
        },
        {
          id: "eo-notspicy", group: "Spice levels", name: "Not spicy",
          core: ["eo:la"], slots: { H: [BU, "eo:shao", "eo:weila"] },
          make(f) {
            if (f.H === BU) return { t: [BU, "verb:yao", "eo:la"], end: ".", en: "Not spicy, please." };
            if (f.H === "eo:shao") return { t: ["eo:shao", "eo:la"], end: ".", en: "Less spicy, please." };
            return { t: ["eo:weila", ",", "greet:xiexie"], end: ".", en: "Mildly spicy, thanks." };
          }
        },
        {
          id: "eo-thatsall", group: "Changes", name: "That's all, thanks",
          core: ["verb:yao"], slots: {},
          make() { return { t: [BU, "verb:yao", "x:le", ",", "greet:xiexie"], end: ".", en: "No more, thanks." }; }
        },
        {
          id: "eo-wait", group: "Changes", name: "Please wait",
          core: ["eo:deng"], slots: {},
          make() { return { t: ["greet:qing", "eo:deng"], end: ".", en: "Please wait." }; }
        },
        { id: "eor-else", q: ["eo:hai", "verb:yao", "eo:biede", "build:ma"], qen: "Anything else?",
          a: [{ t: [BU, "verb:yao", "x:le", ",", "greet:xiexie"], en: "No more, thanks." },
              { t: ["eo:zai", "verb:lai", { any: "eoMore" }, "build:ge"], en: "{x} more, please." },
              { t: ["eo:hai", "verb:yao", { any: "eoDish" }], en: "I'd also like {x}." }] },
        { id: "eor-spicy", q: ["verb:yao", "eo:la", "build:ma"], qen: "Do you want it spicy?",
          a: [{ t: [BU, "verb:yao", "eo:la"], en: "Not spicy, please." }, { t: ["eo:shao", "eo:la"], en: "Less spicy." },
              { t: ["verb:yao", { any: "eoLevel" }], en: "Yes, {x}." }] },
        { id: "eor-chila", q: ["build:ni", "verb:chi", "eo:la", "build:ma"], qen: "Do you eat spicy food?",
          a: [{ t: ["build:wo", "verb:chi", "eo:la"], en: "I eat spicy food." }, { t: ["build:wo", BU, "verb:chi", "eo:la"], en: "I don't eat spicy food." },
              { t: ["build:wo", "eo:pa", "eo:la"], en: "I can't handle spicy food." }, { t: ["build:wo", BU, "eo:pa", "eo:la"], en: "I'm fine with spicy food." }] }
      ]
    },

    // ============================================== At the table
    {
      id: "eo-table", name: "At the table", sub: "Tastes, hungry or full, chopsticks, the washroom",
      items: [
        {
          id: "eo-tasty", group: "Tastes", name: "This dish is delicious",
          core: ["eo:cai", "build:ge"], slots: { D: ["build:zhe", "build:na"], A: foodTaste }, flags: ["neg", "q"],
          make(f) {
            const one = f.D === "build:zhe" ? "this" : "that", a = SD.LITERAL[f.A] === "tasty" ? "delicious" : Banks.BY_ID[f.A].en;
            if (f.q) return { t: [f.D, "build:ge", "eo:cai", f.A, MA], end: "?", en: `Is ${one} dish ${a}?` };
            if (f.neg) return { t: [f.D, "build:ge", "eo:cai", BU, f.A], end: ".", en: `${cap(one)} dish isn't ${a}.` };
            return { t: [f.D, "build:ge", "eo:cai", HEN, f.A], end: ".", en: `${cap(one)} dish is very ${a}.` };
          }
        },
        {
          id: "eo-foodtaste", group: "Tastes", name: "The soup is very salty",
          core: ["build:hen"], slots: { O: [...dishes, ...drinks], A: [...new Set([...foodTaste, ...drinkTaste])] }, flags: ["neg", "q"],
          valid: f => (isDrink(f.O) ? drinkTaste : foodTaste).includes(f.A),
          make(f, E) {
            const a = (f.A === "eo:haochi" || f.A === "eo:haohe") ? "delicious" : Banks.BY_ID[f.A].en;
            if (f.q) return { t: [f.O, f.A, MA], end: "?", en: `${E.Be(f.O)} the ${E.thing(f.O)} ${a}?` };
            if (f.neg) return { t: [f.O, BU, f.A], end: ".", en: `${E.beNot(f.O)} ${a}.` };
            return { t: [f.O, HEN, f.A], end: ".", en: `${E.isVery(f.O)} ${a}.` };
          }
        },
        {
          id: "eo-toospicy", group: "Tastes", name: "Too spicy!",
          core: ["build:tai"], slots: { A: ["eo:la", "eo:tian", "eo:xian", "eo:suan"] },
          make(f) { return { t: ["build:tai", f.A, "x:le"], end: "!", en: `Too ${Banks.BY_ID[f.A].en}!` }; }
        },
        {
          id: "eo-feel", group: "Hungry or full", name: "Are you hungry?",
          core: ["build:hen"], slots: { S: people, F: ["eo:e", "eo:ke", "eo:bao"] }, flags: ["neg", "q"],
          make(f, E) {
            const a = Banks.BY_ID[f.F].en.split(" (")[0];
            if (f.q) return { t: [f.S, f.F, MA], end: "?", en: `${E.Be(f.S)} ${E.s(f.S)} ${a}?` };
            if (f.neg) return { t: [f.S, BU, f.F], end: ".", en: `${E.beNot(f.S)} ${a}.` };
            return { t: [f.S, HEN, f.F], end: ".", en: `${E.isVery(f.S)} ${a}.` };
          }
        },
        {
          id: "eo-feelnow", group: "Hungry or full", name: "I'm full!",
          core: ["x:le"], slots: { S: ["build:wo", "build:women", "build:ta"], F: ["eo:e", "eo:ke", "eo:bao"] },
          make(f, E) { return { t: [f.S, f.F, "x:le"], end: "!", en: `${E.beSubj(f.S)} ${Banks.BY_ID[f.F].en.split(" (")[0]} now!` }; }
        },
        {
          id: "eo-giveme", group: "Things on the table", name: "Could I have a fork?",
          core: ["eo:gei"], slots: { X: tableThings.filter(x => x !== "eo:caidan").concat(["eo:caidan"]) },
          make(f) { return { t: ["eo:gei", "build:wo", f.X], end: ".", en: `Could I have ${req(f.X)}, please?`.replace("?,", "?") }; }
        },
        {
          id: "eo-haveit", group: "Things on the table", name: "Do you have a knife?",
          core: ["verb:you"], slots: { X: ["eo:daozi", "eo:chazi", "eo:shaozi", "eo:zhijin", "eo:kuaizi", "eo:yizi", "eo:bing"] },
          make(f) { return { t: ["verb:you", f.X, MA], end: "?", en: `Do you have ${req(f.X).replace("some ", "any ")}?` }; }
        },
        {
          id: "eo-canuse", group: "Things on the table", name: "Can I use a fork?",
          core: ["eo:yong", "build:keyi"], slots: { S: weMe, X: ["eo:chazi", "eo:daozi", "eo:shaozi", "eo:kuaizi"] },
          make(f, E) { return { t: [f.S, "build:keyi", "eo:yong", f.X, MA], end: "?", en: `Can ${E.s(f.S)} use ${req(f.X).replace("some ", "")}?` }; }
        },
        {
          id: "eo-washroom", group: "The washroom", name: "Excuse me, where's the washroom?",
          core: ["eo:qingwen", "eo:xishoujian"], slots: { X: ["eo:xishoujian", "eo:fuwuyuan"] },
          make(f) { return { t: ["eo:qingwen", ",", f.X, "verb:zai", "build:nar"], end: "?", en: `Excuse me, where is the ${f.X === "eo:fuwuyuan" ? "waiter" : "washroom"}?` }; }
        },
        { id: "eor-tasty", q: ["eo:haochi", "build:ma"], qen: "Is it tasty?",
          a: [{ t: [HEN, "eo:haochi"], en: "Very tasty." }, { t: ["build:tai", "eo:haochi", "x:le"], en: "Delicious!" },
              { t: [BU, "eo:haochi"], en: "Not tasty." }] },
        { id: "eor-hungry", q: ["build:ni", "eo:e", "build:ma"], qen: "Are you hungry?",
          a: [{ t: ["build:wo", HEN, "eo:e"], en: "I'm very hungry." }, { t: ["build:wo", BU, "eo:e"], en: "I'm not hungry." },
              { t: ["build:wo", "eo:bao", "x:le"], en: "I'm full now." }] }
      ]
    },

    // ============================================== Paying & leaving
    {
      id: "eo-pay", name: "Paying & leaving", sub: "The bill, WeChat, taking it away",
      items: [
        {
          id: "eo-bill", group: "The bill", name: "Waiter, the bill!",
          core: ["eo:maidan", "eo:fuwuyuan"], slots: {},
          make() { return { t: ["eo:fuwuyuan", ",", "eo:maidan"], end: "!", en: "Waiter, the bill, please!" }; }
        },
        {
          id: "eo-wepay", group: "The bill", name: "We'd like to pay",
          core: ["eo:maidan"], slots: { S: weMe },
          make(f, E) { return { t: [f.S, "verb:yao", "eo:maidan"], end: ".", en: `${E.S(f.S)}'d like the bill.` }; },
          alts: { "verb:yao": ["verb:xiang"] }
        },
        {
          id: "eo-wechat", group: "The bill", name: "Can I pay with WeChat?",
          core: ["eo:yong", "eo:weixin", "build:keyi"], slots: { S: weMe },
          make(f, E) { return { t: [f.S, "build:keyi", "eo:yong", "eo:weixin", MA], end: "?", en: `Can ${E.s(f.S)} pay with WeChat?` }; }
        },
        {
          id: "eo-cost", group: "The bill", name: "How much is a bowl of soup?",
          core: ["build:duoshao", "money:qian"], slots: { N: ["num:yi"], M: measures, O: orderable },
          valid: f => fits(f.M, f.O),
          make(f) { return { t: [f.N, f.M, f.O, "build:duoshao", "money:qian"], end: "?", en: `How much is ${amount(f.N, f.M, f.O)}?` }; }
        },
        {
          id: "eo-takeaway", group: "Leaving", name: "I'd like to take it away",
          core: ["eo:dabao"], slots: { S: weMe }, flags: ["neg"],
          make(f, E) {
            return {
              t: [f.S, f.neg && BU, "verb:yao", "eo:dabao", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} want it to take away?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} want it to take away.` : `${E.S(f.S)}'d like it to take away.`
            };
          }
        },
        {
          id: "eo-canbox", group: "Leaving", name: "Can I take this away?",
          core: ["eo:dabao", "build:keyi"], slots: { D: ["build:zhe", "build:na"] },
          make(f) { return { t: [f.D, "build:ge", "build:keyi", "eo:dabao", MA], end: "?", en: `Can I take ${f.D === "build:zhe" ? "this" : "that"} one away?` }; }
        },
        {
          id: "eo-thanksbye", group: "Leaving", name: "Delicious, thank you!",
          core: ["eo:haochi"], slots: { A: ["eo:haochi", "eo:haohe"] },
          make(f) { return { t: [HEN, f.A, ",", "greet:xiexie"], end: "!", en: "Very tasty, thank you!" }; }
        },
        { id: "eor-takeaway", q: ["verb:yao", "eo:dabao", "build:ma"], qen: "Do you want it to take away?",
          a: [{ t: ["verb:yao", "eo:dabao"], en: "Yes, to take away." }, { t: [BU, "verb:yao", ",", "greet:xiexie"], en: "No, thanks." }] },
        { id: "eor-cost", q: ["build:duoshao", "money:qian"], qen: "How much is it?",
          a: [{ t: [{ any: "count" }, "money:kuai", "money:qian"], en: "{x} yuan." }] }
      ]
    }
  ];

  // Lists the replies can draw from ({ any: "…" }).
  Object.assign(SD.LISTS, {
    eoPeople: count.slice(1),
    eoGlass: MEASURE_OF["eo:bei"].filter(x => !hot.includes(x)),
    eoMore: more,
    eoDish: dishes,
    eoLevel: ["eo:weila", "eo:zhongla", "eo:tela"]
  });

  // Extra grammar for Explain.
  const order = SD.RULES.findIndex(r => r.id === "order");
  SD.RULES.splice(order, 0,
    { id: "measure", title: "Counting words", words: ["eo:bei", "eo:wan", "eo:ping", "eo:pan", "eo:wei"],
      text: "Between a number and the food goes a counting word: bēi (glass), wǎn (bowl), píng (bottle), pán (plate). yì wǎn tāng = one bowl soup. People get wèi: liǎng wèi." },
    { id: "liang", title: "Two is liǎng here", words: ["eo:liang"], when: t => !t.some(x => /^li:/.test(x)),
      text: "Before a counting word, 2 is liǎng, not èr: liǎng bēi, liǎng gè, liǎng wèi." },
    { id: "yi", title: "yī changes tone", words: ["num:yi"], when: t => t.some(x => SD.MEASURES.includes(x)),
      text: "Before a counting word, yī is said yì (yì bēi, yì wǎn, yì píng), but yí before a 4th tone (yí gè, yí wèi)." },
    { id: "laiorder", title: "lái = I'll have", words: ["verb:lai"], when: t => t[0] === "verb:lai" || t[1] === "verb:lai",
      text: "lái (come) is the everyday way to order: lái yì wǎn miàntiáo = come one bowl noodles. zài lái … = another …" },
    { id: "zaimore", title: "zài lái = one more", words: ["eo:zai"],
      text: "zài (again) + lái (come) asks for more: zài lái liǎng gè = again come two = two more." },
    { id: "hai", title: "hái yào = also want", words: ["eo:hai"],
      text: "hái (also/still) goes before the verb: wǒ hái yào tāng = I also want soup. hái yào biéde ma? = anything else?" },
    { id: "gei", title: "gěi wǒ … = give me …", words: ["eo:gei"],
      text: "gěi wǒ + thing is a direct but normal way to ask for something: gěi wǒ yì bēi shuǐ." },
    { id: "qingwen", title: "qǐngwèn opens a question", words: ["eo:qingwen"],
      text: "qǐngwèn (please-ask) is how to politely start a question to a stranger, like “excuse me”." },
    { id: "lechange", title: "le shows a change", words: ["x:le"], when: t => t.some(x => ["eo:e", "eo:ke", "eo:bao"].includes(x)),
      text: "le at the end shows something has changed: wǒ bǎo le = I'm full (now). bú yào le = I don't want any more." },
    { id: "spice", title: "Spice levels", words: ["eo:weila", "eo:zhongla", "eo:tela"],
      text: "wēilà (mild), zhōnglà (medium), tèlà (extra hot). Say the level after yào: wǒ yào zhōnglà = I want medium-spicy." },
    { id: "pa", title: "pà là = can't handle spice", words: ["eo:pa"],
      text: "pà means 'to fear', so wǒ pà là = I fear spicy = I can't handle it. wǒ bú pà là = I'm fine with spicy." },
    { id: "yidianr", title: "yǒu yìdiǎnr = a bit", words: ["eo:yidianr"],
      text: "yǒu yìdiǎnr + describing word = a bit …, usually a little more than you'd like: zhè gè cài yǒu yìdiǎnr là = this dish is a bit spicy." },
    { id: "yiyang", title: "yíyàng de = the same one", words: ["eo:yiyang"],
      text: "yíyàng (same) + de turns it into “the same one”: wǒ yào yíyàng de = I want same one." }
  );

  return {
    id: "eating-out", name: "Eating out", sub: "Ordering, tastes, paying the bill",
    GROUPS, WORDS, ALIKE, SECTIONS
  };
}());
