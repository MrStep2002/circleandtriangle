/* Topic: Work & study. For teachers of secondary students (11–18):
   classroom commands, lateness and homework, praise, looking after students, meeting parents.
   Short phrases that show you care, and catch the students by surprise.

   Word IDs start with "ws:" and must never change once used.
   A few words are borrowed from other topics ({ borrow: … }); progress on them is shared. */
window.TOPIC_DATA = window.TOPIC_DATA || {};
window.TOPIC_DATA["work-study"] = (function () {
  const SD = window.SENTENCES;

  const GROUPS = [
    { id: "ws-people",  name: "People at school" },
    { id: "ws-class",   name: "Classroom commands" },
    { id: "ws-praise",  name: "Praise" },
    { id: "ws-time",    name: "Late, homework & tests" },
    { id: "ws-things",  name: "Classroom things" },
    { id: "ws-places",  name: "Places at school" },
    { id: "ws-care",    name: "Care & parents" },
    { id: "ws-subject", name: "Subjects" }
  ];

  const WORDS = [
    // 1
    { id: "ws:laoshi",    py: "lǎo|shī",     say: "laow-shrr",     en: "teacher",       group: "ws-people", role: "person", note: "Students greet you with lǎoshī hǎo! and call you lǎoshī, or surname + lǎoshī: like 'Miss' or 'Sir'." },
    { id: "ws:xuesheng",  py: "xué|shēng",   say: "shweh-shung",   en: "student",       group: "ws-people", role: "person" },
    { id: "ws:tongxuemen", py: "tóng|xué|men", say: "tong-shweh-mun", en: "everyone (class)", group: "ws-people", role: "person", note: "Literally 'classmates'. How a teacher addresses the class: tóngxuémen hǎo! = hello, everyone!" },
    { id: "ws:anjing",    py: "ān|jìng",     say: "ahn-jing",      en: "quiet",         group: "ws-class", role: "describe", note: "ānjìng! on its own works as a command. Softer: qǐng ānjìng." },
    // 2
    { id: "ws:zuo",       py: "zuò",         say: "dzwaw",         en: "to sit",        group: "ws-class", role: "verb", note: "qǐng zuò = please sit down. Also what you say to a parent: take a seat." },
    { id: "ws:zhanqilai", py: "zhàn qǐ|lái", say: "jahn chee-lye", en: "to stand up",   group: "ws-class", role: "verb", note: "Literally 'stand rise-come'." },
    { id: "ws:ting",      py: "tīng",        say: "ting",          en: "to listen",     group: "ws-class", role: "verb", note: "tīng wǒ shuō = listen to me (listen me speak)." },
    { borrow: "eo:deng",  group: "ws-class", note: "qǐng děng = please wait." },
    // 3
    { id: "ws:bang",      py: "bàng",        say: "bahng",         en: "great / brilliant", group: "ws-praise", role: "describe", note: "The classic teacher praise: hěn bàng! or tài bàng le!" },
    { id: "ws:dui",       py: "duì",         say: "dway",          en: "right / correct", group: "ws-praise", role: "describe", note: "bú duì = not right." },
    { id: "ws:zuodehao",  py: "zuò de hǎo",  say: "dzwaw duh how", en: "well done",     group: "ws-praise", role: "greet", note: "Literally 'done well'. This zuò means 'do', not 'sit'." },
    { id: "ws:jiayou",    py: "jiā|yóu",     say: "jyah-yoh",      en: "come on! / you can do it!", group: "ws-praise", role: "greet", note: "Literally 'add oil!' Shouted at sports day, said before exams." },
    // 4
    { id: "ws:chidao",    py: "chí|dào",     say: "chrr-daow",     en: "to be late",    group: "ws-time", role: "verb" },
    { id: "ws:weishenme", py: "wèi|shén|me", say: "way-shun-muh",  en: "why",           group: "ws-time", role: "glue", note: "nǐ wèishénme chídào? = why are you late? No ma: it's already a question." },
    { id: "ws:shijian",   py: "shí|jiān",    say: "shrr-jyen",     en: "time",          group: "ws-time", role: "thing", note: "shíjiān dào le! = time's up!" },
    { id: "ws:dao",       py: "dào",         say: "daow",          en: "to arrive / be up", group: "ws-time", role: "verb" },
    // 5
    { borrow: "eo:yidianr", group: "ws-class", note: "After a describing word it softens a command: kuài yìdiǎnr = a bit faster = hurry up!" },
    { id: "ws:kaishi",    py: "kāi|shǐ",     say: "kye-shrr",      en: "to start",      group: "ws-class", role: "verb", note: "wǒmen kāishǐ ba = let's start." },
    { id: "ws:jushou",    py: "jǔ|shǒu",     say: "joo-show",      en: "to put your hand up", group: "ws-class", role: "verb", note: "Literally 'raise hand'." },
    { id: "ws:xie",       py: "xiě",         say: "shyeh",         en: "to write",      group: "ws-class", role: "verb" },
    // 6
    { id: "ws:lihai",     py: "lì|hai",      say: "lee-high",      en: "impressive / amazing", group: "ws-praise", role: "describe", note: "tài lìhai le! = that's amazing! Students will love hearing it." },
    { id: "ws:niu",       py: "niú",         say: "nyoh",          en: "awesome (slang)", group: "ws-praise", role: "describe", note: "Literally 'ox'. Teen slang: tài niú le! = so awesome! Guaranteed surprise." },
    { id: "ws:wanmei",    py: "wán|měi",     say: "wahn-may",      en: "perfect",       group: "ws-praise", role: "describe" },
    { id: "ws:meicuo",    py: "méi cuò",     say: "may tswaw",     en: "not bad / that's right", group: "ws-praise", role: "greet", note: "Literally 'not wrong'. Means both 'correct' and 'pretty good'." },
    // 7
    { id: "ws:zuoye",     py: "zuò|yè",      say: "dzwaw-yeh",     en: "homework",      group: "ws-time", role: "thing" },
    { id: "ws:kaoshi",    py: "kǎo|shì",     say: "kaow-shrr",     en: "test / exam",   group: "ws-time", role: "thing" },
    { id: "ws:jiao",      py: "jiāo",        say: "jyaow",         en: "to hand in",    group: "ws-time", role: "verb", note: "jiāo zuòyè = hand in homework." },
    { id: "ws:wang",      py: "wàng",        say: "wahng",         en: "to forget",     group: "ws-time", role: "verb", note: "wǒ wàng le! = I forgot! You'll hear this one." },
    // 8
    { id: "ws:shouji",    py: "shǒu|jī",     say: "show-jee",      en: "mobile phone",  group: "ws-things", role: "thing", note: "Literally 'hand machine'." },
    { borrow: "eo:gei",   group: "ws-class", note: "shǒujī, gěi wǒ = phone, give (it to) me." },
    { id: "ws:bie",       py: "bié",         say: "byeh",          en: "don't",         group: "ws-class", role: "glue", note: "bié + verb = don't …: bié shuōhuà = stop talking." },
    { id: "ws:shuohua",   py: "shuō|huà",    say: "shwaw-hwah",    en: "to talk",       group: "ws-class", role: "verb", note: "Literally 'speak words'." },
    // 9
    { id: "ws:wanr",      py: "wánr",        say: "wahr",          en: "to play",       group: "ws-class", role: "verb", note: "bié wánr shǒujī = stop playing on your phone." },
    { id: "ws:gan",       py: "gàn",         say: "gahn",          en: "to do (casual)", group: "ws-class", role: "verb", note: "nǐ gàn shénme? = what are you doing? Very direct!" },
    { id: "ws:dong",      py: "dǒng",        say: "dong",          en: "to understand", group: "ws-time", role: "verb", note: "nǐ dǒng ma? = do you understand? wǒ dǒng le = I get it." },
    { id: "ws:wenti",     py: "wèn|tí",      say: "wun-tee",       en: "question / problem", group: "ws-time", role: "thing", note: "yǒu wèntí ma? = any questions? méi wèntí = no problem." },
    // 10
    { id: "ws:shangke",   py: "shàng|kè",    say: "shahng-kuh",    en: "to start class", group: "ws-time", role: "verb", note: "shàngkè le! = class is starting! Literally 'go up to class'." },
    { id: "ws:xiake",     py: "xià|kè",      say: "shyah-kuh",     en: "to finish class", group: "ws-time", role: "verb", note: "xiàkè le = the lesson's over." },
    { id: "ws:fangxue",   py: "fàng|xué",    say: "fahng-shweh",   en: "school finishes", group: "ws-time", role: "verb", note: "Literally 'release from study'." },
    { id: "ws:zenmeyang", py: "zěn|me|yàng", say: "dzun-muh-yahng", en: "how is it?",   group: "ws-time", role: "glue", note: "kǎoshì zěnmeyàng? = how did the test go?" },
    // 11
    { id: "ws:congming",  py: "cōng|ming",   say: "tsong-ming",    en: "clever",        group: "ws-praise", role: "describe" },
    { id: "ws:nuli",      py: "nǔ|lì",       say: "noo-lee",       en: "hard-working",  group: "ws-praise", role: "describe", note: "Lovely to say to parents: tā hěn nǔlì." },
    { id: "ws:feichang",  py: "fēi|cháng",   say: "fay-chahng",    en: "extremely",     group: "ws-praise", role: "glue", note: "Stronger than hěn: fēicháng hǎo = really excellent." },
    { id: "ws:jinbu",     py: "jìn|bù",      say: "jin-boo",       en: "progress",      group: "ws-praise", role: "thing", note: "jìnbù hěn dà = progress very big = has improved a lot." },
    // 12
    { id: "ws:shu",       py: "shū",         say: "shoo",          en: "book",          group: "ws-things", role: "thing" },
    { id: "ws:benzi",     py: "běn|zi",      say: "bun-dzuh",      en: "exercise book", group: "ws-things", role: "thing" },
    { id: "ws:bi",        py: "bǐ",          say: "bee",           en: "pen",           group: "ws-things", role: "thing" },
    { id: "ws:dai",       py: "dài",         say: "dye",           en: "to bring",      group: "ws-things", role: "verb", note: "nǐ dài bǐ le ma? = did you bring a pen?" },
    // 13
    { id: "ws:dakai",     py: "dǎ|kāi",      say: "dah-kye",       en: "to open",       group: "ws-class", role: "verb" },
    { id: "ws:heshang",   py: "hé|shàng",    say: "huh-shahng",    en: "to close (a book)", group: "ws-class", role: "verb" },
    { id: "ws:huida",     py: "huí|dá",      say: "hway-dah",      en: "to answer",     group: "ws-class", role: "verb" },
    { id: "ws:wen",       py: "wèn",         say: "wun",           en: "to ask",        group: "ws-class", role: "verb" },
    // 14
    { borrow: "eo:hai",   group: "ws-care", note: "nǐ hái hǎo ma? = are you OK? (you still good?)" },
    { id: "ws:meishi",    py: "méi|shì",     say: "may-shrr",      en: "it's fine / no worries", group: "ws-care", role: "greet", note: "Literally 'no matter'. Reassuring, and also 'I'm fine'." },
    { id: "ws:shufu",     py: "shū|fu",      say: "shoo-foo",      en: "comfortable / well", group: "ws-care", role: "describe", note: "bù shūfu = not feeling well." },
    { id: "ws:bang2",     py: "bāng",        say: "bahng",         en: "to help",       group: "ws-care", role: "verb", note: "1st tone. bàng (4th) is 'great'." },
    // 15
    { borrow: "eo:xishoujian", group: "ws-places", note: "What students ask for: lǎoshī, wǒ kěyǐ qù xǐshǒujiān ma?" },
    { id: "ws:jiaoshi",   py: "jiào|shì",    say: "jyaow-shrr",    en: "classroom",     group: "ws-places", role: "thing" },
    { id: "ws:tushuguan", py: "tú|shū|guǎn", say: "too-shoo-gwahn", en: "library",      group: "ws-places", role: "thing", note: "Literally 'picture-book-hall'." },
    { id: "ws:bangongshi", py: "bàn|gōng|shì", say: "bahn-gong-shrr", en: "office",    group: "ws-places", role: "thing" },
    // 16
    { id: "ws:shitang",   py: "shí|táng",    say: "shrr-tahng",    en: "canteen",       group: "ws-places", role: "thing" },
    { id: "ws:caochang",  py: "cāo|chǎng",   say: "tsaow-chahng",  en: "sports field / playground", group: "ws-places", role: "thing" },
    { id: "ws:shubao",    py: "shū|bāo",     say: "shoo-baow",     en: "school bag",    group: "ws-things", role: "thing" },
    { id: "ws:ke",        py: "kè",          say: "kuh",           en: "lesson / class", group: "ws-things", role: "thing" },
    // 17
    { id: "ws:nin",       py: "nín",         say: "neen",          en: "you (polite)",  group: "ws-care", role: "person", note: "The respectful 'you': use it with parents. Shows real care." },
    { id: "ws:gaoxing",   py: "gāo|xìng",    say: "gaow-shing",    en: "happy / glad",  group: "ws-care", role: "describe" },
    { id: "ws:renshi",    py: "rèn|shi",     say: "run-shrr",      en: "to meet / know (a person)", group: "ws-care", role: "verb", note: "hěn gāoxìng rènshi nín = very glad to know you = nice to meet you." },
    { id: "ws:huanying",  py: "huān|yíng",   say: "hwahn-ying",    en: "welcome",       group: "ws-care", role: "greet" },
    // 18
    { id: "ws:jiazhang",  py: "jiā|zhǎng",   say: "jyah-jahng",    en: "parent",        group: "ws-people", role: "person", note: "Literally 'family head'. The word schools use: jiāzhǎnghuì = parents' evening." },
    { id: "ws:haizi",     py: "hái|zi",      say: "high-dzuh",     en: "child",         group: "ws-people", role: "person" },
    { id: "ws:erzi",      py: "ér|zi",       say: "ar-dzuh",       en: "son",           group: "ws-people", role: "person" },
    { id: "ws:nuer",      py: "nǚ|'ér",      say: "nyoo-ar",       en: "daughter",      group: "ws-people", role: "person" },
    // 19
    { id: "ws:limao",     py: "lǐ|mào",      say: "lee-maow",      en: "manners",       group: "ws-praise", role: "thing", note: "yǒu lǐmào = has manners = polite. hěn yǒu lǐmào = very polite." },
    { id: "ws:manzou",    py: "màn zǒu",     say: "mahn dzoh",     en: "take care (to a guest leaving)", group: "ws-care", role: "greet", note: "Literally 'walk slowly'. A warm goodbye to parents at the door." },
    { id: "ws:banzhuren", py: "bān|zhǔ|rèn", say: "bahn-joo-run",  en: "form tutor",    group: "ws-people", role: "person" },
    { id: "ws:yingyu",    py: "Yīng|yǔ",     say: "ying-yoo",      en: "English (subject)", group: "ws-subject", role: "thing", note: "The school subject. Yīngwén also means English." },
    // 20
    { id: "ws:shuxue",    py: "shù|xué",     say: "shoo-shweh",    en: "maths",         group: "ws-subject", role: "thing" },
    { id: "ws:kexue",     py: "kē|xué",      say: "kuh-shweh",     en: "science",       group: "ws-subject", role: "thing" },
    { id: "ws:wuli",      py: "wù|lǐ",       say: "woo-lee",       en: "physics",       group: "ws-subject", role: "thing" },
    { id: "ws:huaxue",    py: "huà|xué",     say: "hwah-shweh",    en: "chemistry",     group: "ws-subject", role: "thing" },
    // 21
    { id: "ws:shengwu",   py: "shēng|wù",    say: "shung-woo",     en: "biology",       group: "ws-subject", role: "thing" },
    { id: "ws:lishi",     py: "lì|shǐ",      say: "lee-shrr",      en: "history",       group: "ws-subject", role: "thing" },
    { id: "ws:dili",      py: "dì|lǐ",       say: "dee-lee",       en: "geography",     group: "ws-subject", role: "thing" },
    { id: "ws:yinyue",    py: "yīn|yuè",     say: "yin-yweh",      en: "music",         group: "ws-subject", role: "thing" },
    // 22
    { id: "ws:meishu",    py: "měi|shù",     say: "may-shoo",      en: "art",           group: "ws-subject", role: "thing" },
    { id: "ws:tiyu",      py: "tǐ|yù",       say: "tee-yoo",       en: "PE",            group: "ws-subject", role: "thing" }
  ];

  const ALIKE = [
    ["ws:niu", "li:ox"],
    ["ws:bang", "ws:lihai", "ws:niu", "ws:wanmei"],
    ["ws:shuohua", "verb:shuo"],
    ["ws:dong", "verb:zhidao"],
    ["ws:meishi", "greet:meiguanxi"],
    ["ws:meicuo", "ws:dui"],
    ["ws:feichang", "build:hen"],
    ["ws:nin", "build:ni"],
    ["ws:zuodehao", "ws:bang"],
    ["ws:gan", "ws:zuodehao"],
    ["ws:yingyu", "li:yingwen"]
  ];

  // ---------------------------------------------------------------- lists and English
  const BU = "build:bu", MA = "build:ma", HEN = "build:hen", DE = "build:de", LE = "x:le", QING = "greet:qing", WO = "build:wo";
  const people = ["build:wo", "build:ni", "build:ta", "build:women"];
  const youHer = ["build:ni", "build:ta"];
  const meHer = ["build:wo", "build:ta"];
  const single = ["build:wo", "build:ni", "build:ta"];
  const SUBJECTS = ["ws:yingyu", "ws:shuxue", "ws:kexue", "ws:wuli", "ws:huaxue", "ws:shengwu", "ws:lishi", "ws:dili", "ws:yinyue", "ws:meishu", "ws:tiyu"];
  const PLACES = ["eo:xishoujian", "ws:jiaoshi", "ws:tushuguan", "ws:bangongshi", "ws:shitang", "ws:caochang"];
  const PLACE_EN = { "eo:xishoujian": "the toilet", "ws:jiaoshi": "the classroom", "ws:tushuguan": "the library", "ws:bangongshi": "the office", "ws:shitang": "the canteen", "ws:caochang": "the sports field" };
  const DUE = ["money:jintian", "money:mingtian", "li:xq1", "li:xq2", "li:xq3", "li:xq4", "li:xq5"];
  const dueEn = t => t === "money:jintian" ? "today" : t === "money:mingtian" ? "tomorrow" : "on " + Banks.BY_ID[t].en;
  const OBJ_EN = { "ws:shu": "book", "ws:benzi": "exercise book", "ws:bi": "pen", "ws:zuoye": "homework", "ws:shouji": "phone" };
  const CHILD_EN = { "ws:haizi": "child", "ws:erzi": "son", "ws:nuer": "daughter" };
  const QUALITY = ["ws:congming", "ws:nuli", "ws:lihai", "ws:limao"];
  const QUALITY_EN = { "ws:congming": "clever", "ws:nuli": "hard-working", "ws:bang": "great", "ws:lihai": "impressive", "ws:limao": "polite" };
  const quality = a => a === "ws:limao" ? ["verb:you", "ws:limao"] : [a];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const known = id => id.startsWith("x:") || Memory.isIntro(id);
  const real = x => x && x !== "x:0";
  // "You've", "He's", "I've", "We've"
  const have = (E, S) => S === "build:ta" ? E.beSubj(S) : E.S(S) + "'ve";

  Object.assign(SD.THINGS, {
    "ws:yingyu": { en: "English" }, "ws:shuxue": { en: "maths" }, "ws:kexue": { en: "science" }, "ws:wuli": { en: "physics" },
    "ws:huaxue": { en: "chemistry" }, "ws:shengwu": { en: "biology" }, "ws:lishi": { en: "history" }, "ws:dili": { en: "geography" },
    "ws:yinyue": { en: "music" }, "ws:meishu": { en: "art" }, "ws:tiyu": { en: "PE" }
  });
  SD.QUESTION_WORDS.push("ws:weishenme", "ws:zenmeyang");
  Object.assign(SD.LITERAL, {
    "ws:tongxuemen": "classmates", "ws:zhanqilai": "stand up", "ws:jushou": "raise hand", "ws:zuodehao": "done well", "ws:jiayou": "add oil",
    "ws:chidao": "late", "ws:weishenme": "why", "ws:dao": "arrive", "ws:meicuo": "not wrong", "ws:niu": "awesome (ox)", "ws:lihai": "amazing",
    "ws:jiao": "hand in", "ws:bie": "don't", "ws:shuohua": "talk", "ws:gan": "do", "ws:shangke": "start class", "ws:xiake": "end class",
    "ws:fangxue": "school out", "ws:zenmeyang": "how is it", "ws:feichang": "extremely", "ws:jinbu": "progress", "ws:meishi": "no matter",
    "ws:shufu": "comfortable", "ws:bang2": "help", "ws:nin": "you (polite)", "ws:renshi": "know", "ws:manzou": "slowly walk",
    "ws:limao": "manners", "ws:heshang": "close", "ws:ting": "listen", "ws:xie": "write", "ws:dakai": "open", "ws:wen": "ask",
    "ws:dai": "bring", "ws:wang": "forget", "ws:kaishi": "start", "ws:huida": "answer", "ws:zuo": "sit", "ws:wanr": "play", "ws:dong": "understand", "ws:anjing": "quiet", "ws:shouji": "phone", "ws:tushuguan": "library"
  });

  // ---------------------------------------------------------------- sections
  const COMMAND_EN = {
    "ws:anjing": "Quiet", "ws:zuo": "Sit down", "ws:zhanqilai": "Stand up", "ws:ting": "Listen", "ws:jushou": "Put your hand up",
    "ws:kaishi": "Start", "ws:xie": "Write it down", "ws:huida": "Answer", "eo:deng": "Wait"
  };
  const ABIT = { "adj:kuai": "Hurry up!", "adj:man": "Slow down a bit!", "ws:anjing": "A bit quieter!" };
  const DONT = {
    "ws:shuohua": { t: ["ws:bie", "ws:shuohua"], en: "Stop talking!" },
    "ws:wanr": { t: ["ws:bie", "ws:wanr", "ws:shouji"], en: "Stop playing on your phone!" },
    "ws:wang": { t: ["ws:bie", "ws:wang", LE, "ws:zuoye"], en: "Don't forget your homework!" },
    "ws:chidao": { t: ["ws:bie", "ws:chidao"], en: "Don't be late!" }
  };
  const BELL = { "ws:shangke": "Class is starting!", "ws:xiake": "The lesson's over!", "ws:fangxue": "School's out!" };
  const TAI = { "ws:bang": "Brilliant!", "ws:lihai": "Amazing!", "ws:niu": "Awesome!", "ws:congming": "So clever!", "adj:hao": "That's great!" };
  const RIGHT = { "ws:zuodehao": "Well done!", "ws:wanmei": "Perfect!", "ws:bang": "Great!" };

  const SECTIONS = [
    // ============================================== Classroom commands
    {
      id: "ws-class", name: "Classroom commands", sub: "Quiet, sit down, hurry up, phones away",
      items: [
        {
          id: "ws-hello", group: "Starting the lesson", name: "Hello, everyone!",
          core: ["adj:hao"], slots: { W: ["ws:tongxuemen", "ws:laoshi"] },
          make(f) { return { t: [f.W, "adj:hao"], end: "!", en: f.W === "ws:laoshi" ? "Hello, teacher!" : "Hello, everyone!" }; }
        },
        {
          id: "ws-command", group: "Starting the lesson", name: "Everyone, sit down, please",
          core: [QING], slots: { X: Object.keys(COMMAND_EN), A: ["ws:tongxuemen", "x:0"] },
          make(f) {
            const who = real(f.A) ? [f.A, ","] : [];
            const en = COMMAND_EN[f.X];
            return {
              t: [...who, QING, f.X], also: [[...who, f.X]], end: ".",
              en: (real(f.A) ? "Everyone, " + en.charAt(0).toLowerCase() + en.slice(1) : en) + ", please."
            };
          }
        },
        {
          id: "ws-abit", group: "Hurry up!", name: "Hurry up!",
          core: ["eo:yidianr"], slots: { A: Object.keys(ABIT) },
          make(f) { return { t: [f.A, "eo:yidianr"], end: "!", en: ABIT[f.A] }; }
        },
        {
          id: "ws-lookme", group: "Hurry up!", name: "Listen to me",
          core: [WO], slots: { V: ["verb:kan", "ws:ting", "ws:wen"] },
          make(f) {
            if (f.V === "verb:kan") return { t: ["verb:kan", WO], end: "!", en: "Look at me!" };
            if (f.V === "ws:ting") return { t: ["ws:ting", WO, "verb:shuo"], end: ".", en: "Listen to me." };
            return { t: ["verb:you", "ws:wenti", ",", "ws:wen", WO], end: ".", en: "Any questions, ask me." };
          },
          valid: f => f.V !== "ws:wen" || known("ws:wenti")
        },
        {
          id: "ws-openclose", group: "Books & bags", name: "Open your books",
          core: ["ws:dakai", "ws:heshang"], slots: { V: ["ws:dakai", "ws:heshang"], O: ["ws:shu", "ws:benzi", "ws:shubao"] },
          make(f) {
            const o = { "ws:shu": "books", "ws:benzi": "exercise books", "ws:shubao": "bags" }[f.O];
            return { t: [f.V, f.O], end: ".", en: `${f.V === "ws:dakai" ? "Open" : "Close"} your ${o}.` };
          }
        },
        {
          id: "ws-dont", group: "Don't!", name: "Stop talking!",
          core: ["ws:bie"], slots: { H: Object.keys(DONT) },
          valid: f => DONT[f.H].t.every(known),
          make(f) { return { t: DONT[f.H].t, end: "!", en: DONT[f.H].en }; }
        },
        {
          id: "ws-phone", group: "Don't!", name: "Phone. Hand it over!",
          core: ["ws:shouji", "eo:gei"], slots: {},
          make() { return { t: ["ws:shouji", ",", "eo:gei", WO], also: [["eo:gei", WO, "ws:shouji"]], end: "!", en: "Phone. Hand it over!" }; }
        },
        {
          id: "ws-whatdoing", group: "Don't!", name: "What are you doing?",
          core: ["ws:gan", "build:shenme"], slots: { S: youHer },
          make(f, E) { return { t: [f.S, "ws:gan", "build:shenme"], end: "?", en: `What ${E.be(f.S)} ${E.s(f.S)} doing?` }; }
        },
        {
          id: "ws-bring", group: "Books & bags", name: "Did you bring a pen?",
          core: ["ws:dai", "x:le"], slots: { S: youHer, O: ["ws:shu", "ws:benzi", "ws:bi", "ws:zuoye"] },
          make(f, E) { return { t: [f.S, "ws:dai", f.O, LE, MA], end: "?", en: `Did ${E.s(f.S)} bring ${E.poss(f.S)} ${OBJ_EN[f.O]}?` }; }
        },
        {
          id: "ws-notbring", group: "Books & bags", name: "I didn't bring my book",
          core: ["ws:dai", "build:mei"], slots: { S: meHer, O: ["ws:shu", "ws:benzi", "ws:bi", "ws:zuoye"] },
          make(f, E) { return { t: [f.S, "build:mei", "ws:dai", f.O], end: ".", en: `${E.S(f.S)} didn't bring ${E.poss(f.S)} ${OBJ_EN[f.O]}.` }; }
        },
        { id: "wsr-hello", q: ["ws:tongxuemen", "adj:hao"], qen: "Hello, everyone!",
          a: [{ t: ["ws:laoshi", "adj:hao"], en: "Hello, teacher!" }] }
      ]
    },

    // ============================================== Late, homework & tests
    {
      id: "ws-late", name: "Late, homework & tests", sub: "Why are you late? Time's up! Hand it in",
      items: [
        {
          id: "ws-whylate", group: "Late!", name: "Why are you late?",
          core: ["ws:weishenme", "ws:chidao"], slots: { S: youHer },
          make(f, E) { return { t: [f.S, "ws:weishenme", "ws:chidao"], also: [[f.S, "ws:weishenme", "ws:chidao", LE]], end: "?", en: `Why ${E.be(f.S)} ${E.s(f.S)} late?` }; }
        },
        {
          id: "ws-late", group: "Late!", name: "You're late!",
          core: ["ws:chidao"], slots: { S: people },
          make(f, E) { return { t: [f.S, "ws:chidao", LE], end: "!", en: `${E.beSubj(f.S)} late!` }; }
        },
        {
          id: "ws-bell", group: "Late!", name: "Class is starting!",
          core: ["x:le"], slots: { H: Object.keys(BELL) },
          make(f) { return { t: [f.H, LE], end: "!", en: BELL[f.H] }; }
        },
        {
          id: "ws-timesup", group: "Late!", name: "Time's up!",
          core: ["ws:shijian", "ws:dao"], slots: {},
          make() { return { t: ["ws:shijian", "ws:dao", LE], end: "!", en: "Time's up!" }; }
        },
        {
          id: "ws-forgot", group: "Homework", name: "I forgot my homework",
          core: ["ws:wang"], slots: { S: single, O: ["x:0", "ws:zuoye", "ws:shu", "ws:benzi"] },
          make(f, E) {
            const o = real(f.O) ? ` ${E.poss(f.S)} ${OBJ_EN[f.O]}` : "";
            return { t: [f.S, "ws:wang", LE, real(f.O) && f.O], end: real(f.O) ? "." : "!", en: `${E.S(f.S)} forgot${o}${real(f.O) ? "." : "!"}` };
          }
        },
        {
          id: "ws-hwwhere", group: "Homework", name: "Where's your homework?",
          core: ["ws:zuoye", "build:ne"], slots: { S: youHer },
          make(f, E) { return { t: [f.S, DE, "ws:zuoye", "build:ne"], end: "?", en: `Where's ${E.poss(f.S)} homework?` }; }
        },
        {
          id: "ws-handin", group: "Homework", name: "Hand it in tomorrow",
          core: ["ws:jiao", "ws:zuoye"], slots: { T: DUE },
          make(f) { return { t: [f.T, "ws:jiao", "ws:zuoye"], end: ".", en: `Hand your homework in ${dueEn(f.T)}.` }; }
        },
        {
          id: "ws-test", group: "Tests", name: "There's a test on Friday",
          core: ["ws:kaoshi", "verb:you"], slots: { T: DUE }, flags: ["neg", "q"], needsNeg: ["build:mei"],
          make(f) {
            const when = dueEn(f.T);
            return {
              t: [f.T, f.neg && "build:mei", "verb:you", "ws:kaoshi", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `Is there a test ${when}?` : f.neg ? `There's no test ${when}.` : `There's a test ${when}.`
            };
          }
        },
        {
          id: "ws-howwas", group: "Tests", name: "How did the test go?",
          core: ["ws:zenmeyang"], slots: { O: ["ws:kaoshi", "ws:zuoye"] },
          make(f) { return { t: [f.O, "ws:zenmeyang"], end: "?", en: f.O === "ws:kaoshi" ? "How did the test go?" : "How's the homework going?" }; }
        },
        {
          id: "ws-understand", group: "Understanding", name: "Do you understand?",
          core: ["ws:dong"], slots: { S: single }, flags: ["neg", "q"],
          make(f, E) {
            if (f.q) return { t: [f.S, "ws:dong", MA], end: "?", en: `${E.Do(f.S)} ${E.s(f.S)} understand?` };
            if (f.neg) return { t: [f.S, BU, "ws:dong"], end: ".", en: `${E.S(f.S)} ${E.dont(f.S)} understand.` };
            return { t: [f.S, "ws:dong", LE], end: ".", en: `${E.S(f.S)} ${E.v(f.S, "get", "gets")} it now.` };
          }
        },
        {
          id: "ws-questions", group: "Understanding", name: "Any questions?",
          core: ["ws:wenti"], slots: { H: ["verb:you", "build:mei"] },
          make(f) {
            return f.H === "verb:you" ? { t: ["verb:you", "ws:wenti", MA], end: "?", en: "Any questions?" }
                                      : { t: ["build:mei", "ws:wenti"], end: "!", en: "No problem!" };
          }
        },
        { id: "wsr-late", q: ["build:ni", "ws:weishenme", "ws:chidao"], qen: "Why are you late?",
          a: [{ t: ["greet:duibuqi", ",", "ws:laoshi"], en: "Sorry, teacher." },
              { t: [WO, "ws:wang", LE], en: "I forgot." }] },
        { id: "wsr-hw", q: ["build:ni", DE, "ws:zuoye", "build:ne"], qen: "Where's your homework?",
          a: [{ t: ["greet:duibuqi", ",", WO, "ws:wang", LE], en: "Sorry, I forgot!" }] },
        { id: "wsr-dong", q: ["build:ni", "ws:dong", MA], qen: "Do you understand?",
          a: [{ t: [WO, "ws:dong", LE], en: "I get it now." }, { t: [WO, BU, "ws:dong"], en: "I don't understand." }] }
      ]
    },

    // ============================================== Praise
    {
      id: "ws-praise", name: "Praise & encouragement", sub: "Well done, brilliant, you can do it",
      items: [
        {
          id: "ws-tai", group: "Wow!", name: "Brilliant!",
          core: ["build:tai"], slots: { P: Object.keys(TAI) },
          make(f) { return { t: ["build:tai", f.P, LE], end: "!", en: TAI[f.P] }; }
        },
        {
          id: "ws-right", group: "Wow!", name: "Right! Well done!",
          core: ["ws:dui"], slots: { H: Object.keys(RIGHT) },
          make(f) { return { t: ["ws:dui", ",", f.H === "ws:bang" ? HEN : null, f.H], end: "!", en: "Right! " + RIGHT[f.H] }; }
        },
        {
          id: "ws-youare", group: "You're …", name: "You're really clever",
          core: ["ws:congming"], slots: { S: youHer, I: [HEN, "ws:feichang"], A: QUALITY },
          make(f, E) { return { t: [f.S, f.I, ...quality(f.A)], end: ".", en: `${E.beSubj(f.S)} ${f.I === HEN ? "very" : "really"} ${QUALITY_EN[f.A]}.` }; }
        },
        {
          id: "ws-progress", group: "You're …", name: "You've improved a lot",
          core: ["ws:jinbu"], slots: { S: youHer, I: [HEN, "ws:feichang"] },
          make(f, E) { return { t: [f.S, "ws:jinbu", f.I, "adj:da"], end: ".", en: `${have(E, f.S)} improved ${f.I === HEN ? "a lot" : "so much"}.` }; }
        },
        {
          id: "ws-youcan", group: "Keep going", name: "You can do it!",
          core: ["ws:jiayou", "build:keyi"], slots: { S: ["build:ni", "ws:tongxuemen"] },
          make(f) {
            const who = f.S === "ws:tongxuemen" ? ["ws:tongxuemen", ","] : [];
            return { t: [...who, "build:ni", "build:keyi", DE, ",", "ws:jiayou"], end: "!", en: `${who.length ? "Everyone, you" : "You"} can do it! Come on!` };
          }
        },
        {
          id: "ws-meicuo", group: "Keep going", name: "Not bad! Keep going!",
          core: ["ws:meicuo", "ws:jiayou"], slots: {},
          make() { return { t: ["ws:meicuo", ",", "ws:jiayou"], end: "!", en: "Not bad! Keep going!" }; }
        },
        { id: "wsr-right", q: ["build:zhe", "build:ge", "ws:dui", MA], qen: "Is this right?",
          a: [{ t: ["ws:dui", ",", "ws:zuodehao"], en: "Yes! Well done." }, { t: [BU, "ws:dui", ",", "ws:jiayou"], en: "Not quite. Keep going!" }] }
      ]
    },

    // ============================================== Looking after students
    {
      id: "ws-care", name: "Looking after students", sub: "Are you OK? Can I go to…? Take your time",
      items: [
        {
          id: "ws-ok", group: "Are you OK?", name: "Are you OK?",
          core: ["eo:hai"], slots: { S: youHer },
          make(f, E) { return { t: [f.S, "eo:hai", "adj:hao", MA], end: "?", en: `${E.Be(f.S)} ${E.s(f.S)} OK?` }; }
        },
        {
          id: "ws-unwell", group: "Are you OK?", name: "I don't feel well",
          core: ["ws:shufu"], slots: { S: single }, flags: ["q"],
          make(f, E) {
            return {
              t: [f.S, BU, "ws:shufu", f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Be(f.S)} ${E.s(f.S)} not feeling well?` : `${E.S(f.S)} ${E.dont(f.S)} feel well.`
            };
          }
        },
        {
          id: "ws-meishi", group: "Are you OK?", name: "No worries, take your time",
          core: ["ws:meishi"], slots: {},
          make() { return { t: ["ws:meishi", ",", "adj:man", "adj:man", "verb:lai"], end: ".", en: "No worries, take your time." }; }
        },
        {
          id: "ws-help", group: "Are you OK?", name: "Can I help you?",
          core: ["ws:bang2", "build:keyi"], slots: { O: youHer },
          make(f) { return { t: [WO, "build:keyi", "ws:bang2", f.O, MA], end: "?", en: `Can I help ${f.O === "build:ni" ? "you" : ["him", "her"][f.g]}?` }; }
        },
        {
          id: "ws-canigo", group: "Can I go to…?", name: "Teacher, can I go to the toilet?",
          core: ["ws:laoshi", "build:keyi", "verb:qu"], slots: { P: PLACES },
          make(f) { return { t: ["ws:laoshi", ",", WO, "build:keyi", "verb:qu", f.P, MA], end: "?", en: `Teacher, can I go to ${PLACE_EN[f.P]}?` }; }
        },
        {
          id: "ws-goto", group: "Can I go to…?", name: "Go to the office, please",
          core: ["verb:qu"], slots: { P: PLACES.slice(1) },
          make(f) { return { t: [QING, "verb:qu", f.P], also: [["verb:qu", f.P]], end: ".", en: `Go to ${PLACE_EN[f.P]}, please.` }; }
        },
        {
          id: "ws-whereis", group: "Can I go to…?", name: "Where's the library?",
          core: ["verb:zai", "build:nar"], slots: { P: PLACES },
          make(f) { return { t: [f.P, "verb:zai", "build:nar"], end: "?", en: `Where's ${PLACE_EN[f.P]}?` }; }
        },
        {
          id: "ws-likesubject", group: "Chatting", name: "Do you like maths?",
          core: ["verb:xihuan"], slots: { S: single, X: SUBJECTS }, flags: ["neg", "q"],
          make(f, E) {
            const s = SD.THINGS[f.X].en;
            return {
              t: [f.S, f.neg && BU, "verb:xihuan", f.X, f.q && MA], end: f.q ? "?" : ".",
              en: f.q ? `${E.Do(f.S)} ${E.s(f.S)} like ${s}?` : f.neg ? `${E.S(f.S)} ${E.dont(f.S)} like ${s}.` : `${E.S(f.S)} ${E.v(f.S, "like", "likes")} ${s}.`
            };
          }
        },
        { id: "wsr-ok", q: ["build:ni", "eo:hai", "adj:hao", MA], qen: "Are you OK?",
          a: [{ t: [WO, "ws:meishi"], en: "I'm fine." }, { t: [WO, BU, "ws:shufu"], en: "I don't feel well." }, { t: [WO, HEN, "adj:hao"], en: "I'm good." }] },
        { id: "wsr-subject", q: ["build:ni", "verb:xihuan", "build:shenme", "ws:ke"], qen: "Which lessons do you like?",
          a: [{ t: [WO, "verb:xihuan", { any: "wsSubject" }], en: "I like {x}." }] }
      ]
    },

    // ============================================== Meeting parents
    {
      id: "ws-parents", name: "Meeting parents", sub: "Nice to meet you, your son works hard",
      items: [
        {
          id: "ws-nice", group: "Hello & goodbye", name: "Nice to meet you",
          core: ["ws:renshi", "ws:gaoxing"], slots: { O: ["ws:nin", "build:ni"] },
          make(f) {
            return { t: [HEN, "ws:gaoxing", "ws:renshi", f.O], also: [["ws:renshi", f.O, HEN, "ws:gaoxing"]], end: ".", en: "Very nice to meet you." };
          }
        },
        {
          id: "ws-welcome", group: "Hello & goodbye", name: "Welcome! Please take a seat",
          core: ["ws:huanying", "ws:zuo"], slots: {},
          make() { return { t: ["ws:huanying", ",", QING, "ws:zuo"], end: ".", en: "Welcome! Please take a seat." }; }
        },
        {
          id: "ws-thanks", group: "Hello & goodbye", name: "Thank you for coming",
          core: ["ws:nin"], slots: { H: ["verb:lai", "ws:manzou"] },
          make(f) {
            return f.H === "verb:lai" ? { t: ["greet:xiexie", "ws:nin", "verb:lai"], end: ".", en: "Thank you for coming." }
                                      : { t: ["greet:xiexie", "ws:nin", ",", "ws:manzou"], end: "!", en: "Thank you. Take care!" };
          }
        },
        {
          id: "ws-iam", group: "Who I am", name: "I'm his maths teacher",
          core: ["ws:laoshi", "build:shi"], slots: { X: [...SUBJECTS, "ws:banzhuren"] },
          make(f, E) {
            if (f.X === "ws:banzhuren") return { t: [WO, "build:shi", "build:ta", DE, "ws:banzhuren"], end: ".", en: `I'm ${E.poss("build:ta")} form tutor.` };
            return { t: [WO, "build:shi", "build:ta", DE, f.X, "ws:laoshi"], end: ".", en: `I'm ${E.poss("build:ta")} ${SD.THINGS[f.X].en} teacher.` };
          }
        },
        {
          id: "ws-areparent", group: "Who I am", name: "Are you his parent?",
          core: ["ws:jiazhang", "ws:nin"], slots: {},
          make(f, E) { return { t: ["ws:nin", "build:shi", "build:ta", DE, "ws:jiazhang", MA], end: "?", en: `Are you ${E.poss("build:ta")} parent?` }; }
        },
        {
          id: "ws-yourchild", group: "About their child", name: "Your son is very hard-working",
          core: ["ws:nin", DE], slots: { C: Object.keys(CHILD_EN), I: [HEN, "ws:feichang"], A: QUALITY },
          make(f) {
            return { t: ["ws:nin", DE, f.C, f.I, ...quality(f.A)], end: ".", en: `Your ${CHILD_EN[f.C]} is ${f.I === HEN ? "very" : "really"} ${QUALITY_EN[f.A]}.` };
          }
        },
        {
          id: "ws-childprogress", group: "About their child", name: "Your daughter has improved a lot",
          core: ["ws:nin", "ws:jinbu"], slots: { C: Object.keys(CHILD_EN), I: [HEN, "ws:feichang"] },
          make(f) { return { t: ["ws:nin", DE, f.C, "ws:jinbu", f.I, "adj:da"], end: ".", en: `Your ${CHILD_EN[f.C]} has improved ${f.I === HEN ? "a lot" : "so much"}.` }; }
        },
        {
          id: "ws-goodstudent", group: "About their child", name: "She's a good student",
          core: ["ws:xuesheng"], slots: { A: ["adj:hao", "ws:bang"] },
          make(f, E) {
            const t = ["build:ta", "build:shi", "num:yi", "build:ge", f.A === "ws:bang" ? HEN : null, f.A, f.A === "ws:bang" ? DE : null, "ws:xuesheng"];
            return { t, end: ".", en: `${E.beSubj("build:ta")} ${f.A === "ws:bang" ? "a brilliant" : "a good"} student.` };
          }
        }
      ]
    }
  ];

  Object.assign(SD.LISTS, { wsSubject: SUBJECTS });

  // Extra grammar for Explain.
  const order = SD.RULES.findIndex(r => r.id === "order");
  SD.RULES.splice(order, 0,
    { id: "bie", title: "bié = don't", words: ["ws:bie"],
      text: "bié + verb tells someone not to do something: bié shuōhuà = don't talk. bié wàng le zuòyè = don't forget your homework." },
    { id: "why", title: "wèishénme = why", words: ["ws:weishenme"],
      text: "wèishénme goes before the verb, and it's already a question, so no ma: nǐ wèishénme chídào? = you why late?" },
    { id: "abit", title: "… yìdiǎnr = a bit more …", words: ["eo:yidianr"], when: t => t.indexOf("eo:yidianr") === 1,
      text: "A describing word + yìdiǎnr softens a command: kuài yìdiǎnr = fast a-bit = hurry up. ānjìng yìdiǎnr = a bit quieter." },
    { id: "lenow", title: "le = it's happened", words: [LE], when: t => t.some(x => ["ws:chidao", "ws:shangke", "ws:xiake", "ws:fangxue", "ws:dao", "ws:dong", "ws:wang", "ws:dai"].includes(x)),
      text: "le shows something has just happened or changed: shàngkè le! = class (has) started! nǐ chídào le = you're late. wǒ wàng le = I forgot." },
    { id: "nin", title: "nín = polite 'you'", words: ["ws:nin"],
      text: "nín is the respectful nǐ, for parents and anyone older. Using it shows care: hěn gāoxìng rènshi nín." },
    { id: "dehao", title: "zuò de hǎo = done well", words: ["ws:zuodehao"],
      text: "zuò (do) + de + hǎo (well): this de links an action to how well it was done. Not the de that means 's." },
    { id: "kedede", title: "nǐ kěyǐ de = you can do it", words: ["ws:jiayou"], when: t => t.includes("build:keyi"),
      text: "kěyǐ de at the end means 'it's possible': nǐ kěyǐ de = you can (do it). Add jiāyóu (add oil!) for 'come on!'" },
    { id: "jinbu", title: "jìnbù hěn dà = improved a lot", words: ["ws:jinbu"],
      text: "jìnbù (progress) + hěn dà (very big): tā jìnbù hěn dà = his progress is big = he's improved a lot." },
    { id: "limao", title: "yǒu lǐmào = polite", words: ["ws:limao"],
      text: "yǒu lǐmào = has manners = polite. hěn yǒu lǐmào = very polite." },
    { id: "mei-did", title: "méi + verb = didn't", words: ["build:mei"], when: t => t.includes("ws:dai"),
      text: "For something that didn't happen, use méi, not bù: wǒ méi dài bǐ = I didn't bring a pen." },
    { id: "ledid", title: "… le ma? = did …?", words: [LE], when: t => t.includes(MA) && t.includes("ws:dai"),
      text: "le + ma asks whether something has happened: nǐ dài bǐ le ma? = you bring pen (done)? = did you bring a pen?" },
    { id: "manzou", title: "màn zǒu = take care", words: ["ws:manzou"],
      text: "Literally 'walk slowly'. What a host says as guests leave: a warm goodbye at the classroom door." },
    { id: "niu", title: "niú = awesome", words: ["ws:niu"],
      text: "niú means ox, but it's also slang for awesome: tài niú le! Expect a surprised laugh." },
    { id: "laoshi", title: "lǎoshī = Miss / Sir", words: ["ws:laoshi"],
      text: "Students call teachers lǎoshī, on its own or after a surname: Wáng lǎoshī. lǎoshī hǎo! = hello, teacher!" },
    { id: "bangtone", title: "bàng or bāng?", words: ["ws:bang2", "ws:bang"],
      text: "bàng (4th tone) = great; bāng (1st tone) = help. wǒ kěyǐ bāng nǐ ma? = can I help you?" },
    { id: "ne-where", title: "… ne? = where's …?", words: ["build:ne"], when: t => t.includes("ws:zuoye"),
      text: "A thing + ne on its own asks where it is: nǐ de zuòyè ne? = your homework? = where's your homework?" }
  );

  return {
    id: "work-study", name: "Work & study", sub: "Classroom commands, praise, homework, parents",
    GROUPS, WORDS, ALIKE, SECTIONS
  };
}());
