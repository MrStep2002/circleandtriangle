/* Essentials Vocab Bank — 78 items.

   Each word:
     id     permanent ID. Never change it once published: your progress is stored against it.
     py     pinyin. Use | to mark a syllable break inside one word (péng|you) so tone
            colours work. The | is never shown. Use a normal space between separate words.
     say    "sounds like" guide
     en     English
     group  which group it belongs to (see GROUPS below)
     note   optional: a short usage tip, shown when the word is taught and when you get it wrong

   The order of WORDS is the teaching order: New Words introduces them 4 at a time, top to bottom.
*/
window.ESSENTIALS = {
  GROUPS: [
    { id: "greetings", name: "Greetings & social" },
    { id: "people",    name: "People & identity",   parent: "Sentence-building words" },
    { id: "changing",  name: "Changing a sentence", parent: "Sentence-building words" },
    { id: "pointing",  name: "Pointing & connecting", parent: "Sentence-building words" },
    { id: "info",      name: "Getting information", parent: "Sentence-building words" },
    { id: "more",      name: "More building words", parent: "Sentence-building words" },
    { id: "numbers",   name: "Numbers" },
    { id: "verbs",     name: "Verbs" },
    { id: "adjectives",name: "Adjectives" },
    { id: "food",      name: "Food & drink" },
    { id: "money",     name: "People, money & time" }
  ],

  /* Words whose meanings overlap. They never appear as answer choices for each other,
     and never in the same Quick Match round, so you're never asked to pick between them. */
  ALIKE: [
    ["verb:yao", "verb:xiang", "verb:xihuan"],
    ["greet:bukeqi", "greet:meiguanxi", "greet:haode"],
    ["build:bu", "build:mei"],
    ["greet:nihao", "greet:hai", "greet:zao"],
    ["adj:hao", "greet:haode", "greet:nihao"],
    ["money:qian", "money:kuai"],
    ["adj:duo", "build:duoshao"],
    ["build:hen", "build:tai"]
  ],

  WORDS: [
    // 1
    { id: "greet:nihao",     py: "nǐ hǎo",      say: "nee how",        en: "hello",               group: "greetings" },
    { id: "greet:xiexie",    py: "xiè|xie",     say: "shyeh-shyeh",    en: "thank you",           group: "greetings" },
    { id: "greet:zaijian",   py: "zài|jiàn",    say: "dzye-jyen",      en: "goodbye",             group: "greetings" },
    { id: "greet:haode",     py: "hǎo de",      say: "how duh",        en: "okay / sure",         group: "greetings", note: "Agreeing to something. hǎo on its own means good." },
    // 2
    { id: "build:wo",        py: "wǒ",          say: "waw",            en: "I / me",              group: "people" },
    { id: "build:ni",        py: "nǐ",          say: "nee",            en: "you",                 group: "people" },
    { id: "build:ta",        py: "tā",          say: "tah",            en: "he / she",            group: "people" },
    { id: "build:shi",       py: "shì",         say: "shrr",           en: "to be",               group: "people" },
    // 3
    { id: "adj:hao",         py: "hǎo",         say: "how",            en: "good",                group: "adjectives" },
    { id: "build:bu",        py: "bù",          say: "boo",            en: "not",                 group: "changing", note: "The everyday no: wǒ bù hē = I don't drink." },
    { id: "build:hen",       py: "hěn",         say: "hun",            en: "very",                group: "changing" },
    { id: "build:ma",        py: "ma",          say: "mah",            en: "yes/no question marker", group: "changing" },
    // 4
    { id: "num:yi",          py: "yī",          say: "ee",             en: "one",                 group: "numbers" },
    { id: "num:er",          py: "èr",          say: "ar",             en: "two",                 group: "numbers" },
    { id: "num:san",         py: "sān",         say: "sahn",           en: "three",               group: "numbers" },
    { id: "num:si",          py: "sì",          say: "suh",            en: "four",                group: "numbers" },
    // 5
    { id: "verb:yao",        py: "yào",         say: "yow",            en: "want",                group: "verbs", note: "Direct: wǒ yào chá = I want tea." },
    { id: "verb:he",         py: "hē",          say: "huh",            en: "drink",               group: "verbs" },
    { id: "food:shui",       py: "shuǐ",        say: "shway",          en: "water",               group: "food" },
    { id: "food:cha",        py: "chá",         say: "chah",           en: "tea",                 group: "food" },
    // 6
    { id: "verb:chi",        py: "chī",         say: "chrr",           en: "eat",                 group: "verbs" },
    { id: "food:mifan",      py: "mǐ|fàn",      say: "mee-fahn",       en: "cooked rice",         group: "food" },
    { id: "food:miantiao",   py: "miàn|tiáo",   say: "myen-tyaow",     en: "noodles",             group: "food" },
    { id: "food:jiaozi",     py: "jiǎo|zi",     say: "jyaow-dzuh",     en: "dumplings",           group: "food" },
    // 7
    { id: "num:wu",          py: "wǔ",          say: "woo",            en: "five",                group: "numbers" },
    { id: "num:liu",         py: "liù",         say: "lyoh",           en: "six",                 group: "numbers" },
    { id: "num:qi",          py: "qī",          say: "chee",           en: "seven",               group: "numbers" },
    { id: "num:ba",          py: "bā",          say: "bah",            en: "eight",               group: "numbers" },
    // 8
    { id: "verb:xihuan",     py: "xǐ|huan",     say: "shee-hwahn",     en: "like",                group: "verbs", note: "Enjoy something: wǒ xǐhuan chá = I like tea." },
    { id: "food:kafei",      py: "kā|fēi",      say: "kah-fay",        en: "coffee",              group: "food" },
    { id: "food:pijiu",      py: "pí|jiǔ",      say: "pee-jyoh",       en: "beer",                group: "food" },
    { id: "build:ne",        py: "ne",          say: "nuh",            en: "and…? / what about…?", group: "changing" },
    // 9
    { id: "greet:duibuqi",   py: "duì|bu|qǐ",   say: "dway-boo-chee",  en: "sorry",               group: "greetings" },
    { id: "greet:meiguanxi", py: "méi guān|xi", say: "may gwahn-shee", en: "it's okay (reply to sorry)", group: "greetings", note: "Someone says duìbuqǐ (sorry), you say méi guānxi." },
    { id: "greet:qing",      py: "qǐng",        say: "ching",          en: "please",              group: "greetings" },
    { id: "greet:bukeqi",    py: "bú kè|qi",    say: "boo kuh-chee",   en: "you're welcome (reply to thanks)", group: "greetings", note: "Someone says xièxie (thank you), you say bú kèqi." },
    // 10
    { id: "num:jiu",         py: "jiǔ",         say: "jyoh",           en: "nine",                group: "numbers" },
    { id: "num:shi",         py: "shí",         say: "shrr",           en: "ten",                 group: "numbers" },
    { id: "money:qian",      py: "qián",        say: "chyen",          en: "money",               group: "money", note: "Money in general: duōshao qián? = how much money?" },
    { id: "money:kuai",      py: "kuài",        say: "kwhy",           en: "yuan (unit of money)", group: "money", note: "Counting money: shí kuài = 10 yuan." },
    // 11
    { id: "build:duoshao",   py: "duō|shao",    say: "dwaw-shaow",     en: "how much / how many", group: "info" },
    { id: "verb:mai",        py: "mǎi",         say: "my",             en: "buy",                 group: "verbs" },
    { id: "adj:gui",         py: "guì",         say: "gway",           en: "expensive",           group: "adjectives" },
    { id: "build:tai",       py: "tài",         say: "tie",            en: "too (too much)",      group: "more" },
    // 12
    { id: "build:zhe",       py: "zhè",         say: "juh",            en: "this",                group: "pointing" },
    { id: "build:na",        py: "nà",          say: "nah",            en: "that",                group: "pointing" },
    { id: "build:ge",        py: "gè",          say: "guh",            en: "general measure word", group: "pointing" },
    { id: "build:de",        py: "de",          say: "duh",            en: "possession marker ('s)", group: "pointing" },
    // 13
    { id: "build:shenme",    py: "shén|me",     say: "shun-muh",       en: "what",                group: "info" },
    { id: "build:nar",       py: "nǎr",         say: "nar",            en: "where",               group: "info" },
    { id: "verb:zai",        py: "zài",         say: "dzye",           en: "be at / in",          group: "verbs" },
    { id: "verb:qu",         py: "qù",          say: "chyoo",          en: "go",                  group: "verbs" },
    // 14
    { id: "adj:da",          py: "dà",          say: "dah",            en: "big",                 group: "adjectives" },
    { id: "adj:xiao",        py: "xiǎo",        say: "shyaow",         en: "small",               group: "adjectives" },
    { id: "adj:re",          py: "rè",          say: "ruh",            en: "hot",                 group: "adjectives" },
    { id: "adj:leng",        py: "lěng",        say: "lung",           en: "cold",                group: "adjectives" },
    // 15
    { id: "verb:you",        py: "yǒu",         say: "yoh",            en: "have",                group: "verbs" },
    { id: "build:mei",       py: "méi",         say: "may",            en: "not (with yǒu)",      group: "more", note: "Use méi with yǒu: wǒ méi yǒu = I don't have." },
    { id: "build:women",     py: "wǒ|men",      say: "waw-mun",        en: "we / us",             group: "more" },
    { id: "build:ye",        py: "yě",          say: "yeh",            en: "also",                group: "more" },
    // 16
    { id: "food:jirou",      py: "jī|ròu",      say: "jee-roh",        en: "chicken",             group: "food" },
    { id: "food:yu",         py: "yú",          say: "yoo",            en: "fish",                group: "food" },
    { id: "food:shucai",     py: "shū|cài",     say: "shoo-tsye",      en: "vegetables",          group: "food" },
    { id: "verb:xiang",      py: "xiǎng",       say: "shyahng",        en: "would like to",       group: "verbs", note: "Softer than yào, usually before a verb: wǒ xiǎng qù = I'd like to go." },
    // 17
    { id: "verb:lai",        py: "lái",         say: "lye",            en: "come",                group: "verbs" },
    { id: "verb:kan",        py: "kàn",         say: "kahn",           en: "look / watch / see",  group: "verbs" },
    { id: "verb:shuo",       py: "shuō",        say: "shwaw",          en: "speak / say",         group: "verbs" },
    { id: "verb:zhidao",     py: "zhī|dào",     say: "jrr-dow",        en: "know",                group: "verbs" },
    // 18
    { id: "adj:kuai",        py: "kuài",        say: "kwhy",           en: "fast",                group: "adjectives" },
    { id: "adj:man",         py: "màn",         say: "mahn",           en: "slow",                group: "adjectives" },
    { id: "adj:duo",         py: "duō",         say: "dwaw",           en: "many / much",         group: "adjectives" },
    { id: "adj:lei",         py: "lèi",         say: "lay",            en: "tired",               group: "adjectives" },
    // 19
    { id: "build:keyi",      py: "kě|yǐ",       say: "kuh-yee",        en: "can / may",           group: "info" },
    { id: "money:pengyou",   py: "péng|you",    say: "pung-yoh",       en: "friend",              group: "money" },
    { id: "money:jintian",   py: "jīn|tiān",    say: "jin-tyen",       en: "today",               group: "money" },
    { id: "money:mingtian",  py: "míng|tiān",   say: "ming-tyen",      en: "tomorrow",            group: "money" },
    // 20
    { id: "greet:hai",       py: "hāi",         say: "hi",             en: "hi",                  group: "greetings" },
    { id: "greet:zao",       py: "zǎo",         say: "dzaow",          en: "morning!",            group: "greetings" }
  ]
};
