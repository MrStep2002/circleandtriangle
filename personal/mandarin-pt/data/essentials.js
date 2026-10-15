/* Banco de palavras Essencial (português do Brasil): 78 palavras.

   Cada palavra:
     id     identificador permanente. Nunca mude depois de publicado: o progresso fica guardado nele.
     py     pinyin. Use | entre as sílabas de uma palavra (péng|you) para as cores dos tons.
     say    "soa como", escrito para quem lê em português (x = som de "x" em "xícara",
            tch = "tchau", dj = "djavan", r no começo = "r" de "rato", â = som abafado).
     en     o significado (em português nesta versão)
     group  o grupo (veja GROUPS)
     note   dica opcional, mostrada quando a palavra é ensinada e quando você erra

   A ordem é a ordem de ensino: Palavras novas apresenta 4 de cada vez.
*/
window.ESSENTIALS = {
  GROUPS: [
    { id: "greetings", name: "Cumprimentos" },
    { id: "people",    name: "Pessoas",            parent: "Palavras para montar frases" },
    { id: "changing",  name: "Mudando a frase",    parent: "Palavras para montar frases" },
    { id: "pointing",  name: "Apontar e ligar",    parent: "Palavras para montar frases" },
    { id: "info",      name: "Perguntas",          parent: "Palavras para montar frases" },
    { id: "more",      name: "Mais palavras úteis", parent: "Palavras para montar frases" },
    { id: "numbers",   name: "Números" },
    { id: "verbs",     name: "Verbos" },
    { id: "adjectives",name: "Adjetivos" },
    { id: "food",      name: "Comida e bebida" },
    { id: "money",     name: "Pessoas, dinheiro e tempo" }
  ],

  ALIKE: [
    ["verb:yao", "verb:xiang", "verb:xihuan"],
    ["greet:bukeqi", "greet:meiguanxi", "greet:haode"],
    ["build:bu", "build:mei"],
    ["greet:nihao", "greet:hai", "greet:zao"],
    ["adj:hao", "greet:haode", "greet:nihao"],
    ["money:qian", "money:kuai"],
    ["adj:duo", "build:duoshao", "build:hen"],
    ["build:hen", "build:tai"],
    ["adj:kuai", "money:kuai"]
  ],

  WORDS: [
    // 1
    { id: "greet:nihao", py: "nǐ hǎo", say: "ni rau", en: "olá / oi", group: "greetings" },
    { id: "greet:xiexie", py: "xiè|xie", say: "chiê-chiê", en: "obrigado / obrigada", group: "greetings" },
    { id: "greet:zaijian", py: "zài|jiàn", say: "dzai-djien", en: "tchau / até logo", group: "greetings" },
    { id: "greet:haode", py: "hǎo de", say: "rau dâ", en: "tá bom / certo", group: "greetings", note: "Para concordar com algo. hǎo sozinho quer dizer bom." },
    // 2
    { id: "build:wo", py: "wǒ", say: "uô", en: "eu / me", group: "people" },
    { id: "build:ni", py: "nǐ", say: "ni", en: "você", group: "people" },
    { id: "build:ta", py: "tā", say: "tá", en: "ele / ela", group: "people", note: "A mesma palavra para ele e ela." },
    { id: "build:shi", py: "shì", say: "xr", en: "ser", group: "people" },
    // 3
    { id: "adj:hao", py: "hǎo", say: "rau", en: "bom", group: "adjectives" },
    { id: "build:bu", py: "bù", say: "bu", en: "não", group: "changing", note: "O não do dia a dia: wǒ bù hē = eu não bebo." },
    { id: "build:hen", py: "hěn", say: "rân", en: "muito (antes de adjetivo)", group: "changing", note: "wǒ hěn hǎo = eu estou (muito) bem." },
    { id: "build:ma", py: "ma", say: "ma", en: "partícula de pergunta (sim/não)", group: "changing", note: "Vai no fim da frase: nǐ hǎo ma? = você está bem?" },
    // 4
    { id: "num:yi", py: "yī", say: "i", en: "um", group: "numbers" },
    { id: "num:er", py: "èr", say: "ar", en: "dois", group: "numbers" },
    { id: "num:san", py: "sān", say: "san", en: "três", group: "numbers" },
    { id: "num:si", py: "sì", say: "sâ", en: "quatro", group: "numbers" },
    // 5
    { id: "verb:yao", py: "yào", say: "iau", en: "querer", group: "verbs", note: "Direto: wǒ yào chá = eu quero chá." },
    { id: "verb:he", py: "hē", say: "râ", en: "beber", group: "verbs" },
    { id: "food:shui", py: "shuǐ", say: "xuei", en: "água", group: "food" },
    { id: "food:cha", py: "chá", say: "tchá", en: "chá", group: "food" },
    // 6
    { id: "verb:chi", py: "chī", say: "tchr", en: "comer", group: "verbs" },
    { id: "food:mifan", py: "mǐ|fàn", say: "mi-fan", en: "arroz (cozido)", group: "food" },
    { id: "food:miantiao", py: "miàn|tiáo", say: "mien-tiau", en: "macarrão", group: "food" },
    { id: "food:jiaozi", py: "jiǎo|zi", say: "djiau-dzâ", en: "jiaozi (pastelzinho chinês)", group: "food" },
    // 7
    { id: "num:wu", py: "wǔ", say: "u", en: "cinco", group: "numbers" },
    { id: "num:liu", py: "liù", say: "liôu", en: "seis", group: "numbers" },
    { id: "num:qi", py: "qī", say: "tchi", en: "sete", group: "numbers" },
    { id: "num:ba", py: "bā", say: "bá", en: "oito", group: "numbers" },
    // 8
    { id: "verb:xihuan", py: "xǐ|huan", say: "chi-ruan", en: "gostar", group: "verbs", note: "Gostar de algo: wǒ xǐhuan chá = eu gosto de chá." },
    { id: "food:kafei", py: "kā|fēi", say: "ká-fei", en: "café", group: "food" },
    { id: "food:pijiu", py: "pí|jiǔ", say: "pi-djiôu", en: "cerveja", group: "food" },
    { id: "build:ne", py: "ne", say: "nâ", en: "e…? / e você?", group: "changing", note: "wǒ hěn hǎo, nǐ ne? = estou bem, e você?" },
    // 9
    { id: "greet:duibuqi", py: "duì|bu|qǐ", say: "duei-bu-tchi", en: "desculpa", group: "greetings" },
    { id: "greet:meiguanxi", py: "méi guān|xi", say: "mei guan-chi", en: "tudo bem (resposta a desculpa)", group: "greetings", note: "Alguém diz duìbuqǐ (desculpa), você responde méi guānxi." },
    { id: "greet:qing", py: "qǐng", say: "tching", en: "por favor", group: "greetings" },
    { id: "greet:bukeqi", py: "bú kè|qi", say: "bu kâ-tchi", en: "de nada (resposta a obrigado)", group: "greetings", note: "Alguém diz xièxie (obrigado), você responde bú kèqi." },
    // 10
    { id: "num:jiu", py: "jiǔ", say: "djiôu", en: "nove", group: "numbers" },
    { id: "num:shi", py: "shí", say: "xr", en: "dez", group: "numbers" },
    { id: "money:qian", py: "qián", say: "tchien", en: "dinheiro", group: "money", note: "Dinheiro em geral: duōshao qián? = quanto custa?" },
    { id: "money:kuai", py: "kuài", say: "kuai", en: "yuan (moeda)", group: "money", note: "Para contar dinheiro: shí kuài = 10 yuans." },
    // 11
    { id: "build:duoshao", py: "duō|shao", say: "duô-xau", en: "quanto / quantos", group: "info" },
    { id: "verb:mai", py: "mǎi", say: "mai", en: "comprar", group: "verbs" },
    { id: "adj:gui", py: "guì", say: "guei", en: "caro", group: "adjectives" },
    { id: "build:tai", py: "tài", say: "tai", en: "demais", group: "more", note: "tài guì le! = caro demais!" },
    // 12
    { id: "build:zhe", py: "zhè", say: "djâ", en: "este / isto", group: "pointing" },
    { id: "build:na", py: "nà", say: "ná", en: "aquele / aquilo", group: "pointing" },
    { id: "build:ge", py: "gè", say: "gâ", en: "classificador (para contar)", group: "pointing", note: "Vai entre o número e a coisa: sān gè jiǎozi = três jiaozi." },
    { id: "build:de", py: "de", say: "dâ", en: "partícula de posse (de)", group: "pointing", note: "wǒ de chá = o meu chá (chá de mim)." },
    // 13
    { id: "build:shenme", py: "shén|me", say: "xân-mâ", en: "o quê / que", group: "info" },
    { id: "build:nar", py: "nǎr", say: "nar", en: "onde", group: "info" },
    { id: "verb:zai", py: "zài", say: "dzai", en: "estar em", group: "verbs" },
    { id: "verb:qu", py: "qù", say: "tchiu", en: "ir", group: "verbs" },
    // 14
    { id: "adj:da", py: "dà", say: "dá", en: "grande", group: "adjectives" },
    { id: "adj:xiao", py: "xiǎo", say: "chiau", en: "pequeno", group: "adjectives" },
    { id: "adj:re", py: "rè", say: "jâ", en: "quente", group: "adjectives", note: "O r chinês fica entre o j de 'já' e o r do inglês." },
    { id: "adj:leng", py: "lěng", say: "lâng", en: "frio", group: "adjectives" },
    // 15
    { id: "verb:you", py: "yǒu", say: "iôu", en: "ter", group: "verbs" },
    { id: "build:mei", py: "méi", say: "mei", en: "não (com yǒu)", group: "more", note: "Use méi com yǒu: wǒ méi yǒu = eu não tenho." },
    { id: "build:women", py: "wǒ|men", say: "uô-mân", en: "nós", group: "more" },
    { id: "build:ye", py: "yě", say: "iê", en: "também", group: "more" },
    // 16
    { id: "food:jirou", py: "jī|ròu", say: "dji-jôu", en: "frango", group: "food" },
    { id: "food:yu", py: "yú", say: "iü", en: "peixe", group: "food", note: "ü: diga 'i' com os lábios em biquinho." },
    { id: "food:shucai", py: "shū|cài", say: "xu-tsai", en: "verduras / legumes", group: "food" },
    { id: "verb:xiang", py: "xiǎng", say: "chiang", en: "gostaria de", group: "verbs", note: "Mais suave que yào, geralmente antes de um verbo: wǒ xiǎng qù = eu gostaria de ir." },
    // 17
    { id: "verb:lai", py: "lái", say: "lai", en: "vir", group: "verbs" },
    { id: "verb:kan", py: "kàn", say: "kan", en: "olhar / ver / assistir", group: "verbs" },
    { id: "verb:shuo", py: "shuō", say: "xuô", en: "falar / dizer", group: "verbs" },
    { id: "verb:zhidao", py: "zhī|dào", say: "djr-dau", en: "saber", group: "verbs" },
    // 18
    { id: "adj:kuai", py: "kuài", say: "kuai", en: "rápido", group: "adjectives" },
    { id: "adj:man", py: "màn", say: "man", en: "devagar / lento", group: "adjectives" },
    { id: "adj:duo", py: "duō", say: "duô", en: "muitos / bastante", group: "adjectives", note: "hěn duō péngyou = muitos amigos." },
    { id: "adj:lei", py: "lèi", say: "lei", en: "cansado", group: "adjectives" },
    // 19
    { id: "build:keyi", py: "kě|yǐ", say: "kâ-i", en: "poder (permissão)", group: "info" },
    { id: "money:pengyou", py: "péng|you", say: "pâng-iôu", en: "amigo / amiga", group: "money" },
    { id: "money:jintian", py: "jīn|tiān", say: "djin-tien", en: "hoje", group: "money" },
    { id: "money:mingtian", py: "míng|tiān", say: "ming-tien", en: "amanhã", group: "money" },
    // 20
    { id: "greet:hai", py: "hāi", say: "rai", en: "oi", group: "greetings" },
    { id: "greet:zao", py: "zǎo", say: "dzau", en: "bom dia!", group: "greetings" }
  ]
};
