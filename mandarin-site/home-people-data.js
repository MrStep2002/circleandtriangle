(function () {
  const T = (pin, phon) => [pin, phon];
  const P = (en, punct, literal, tokens) => ({ en, punct, literal, tokens });
  window.SENTENCE_TOPICS = [
    { id: "home", name: "Around the home", emoji: "🏠", sub: "Rooms, furniture and belongings", phrases: [
      P("This is my room.", ".", "this / is / my / room", [T("zhè","juh"),T("shì","shrr"),T("wǒ","waw"),T("de","duh"),T("fángjiān","fahng-jyen")]),
      P("My keys are on the table.", ".", "my / keys / are at / table / on", [T("wǒ","waw"),T("de","duh"),T("yàoshi","yow-shrr"),T("zài","dzye"),T("zhuōzi","jwaw-dzuh"),T("shàng","shahng")]),
      P("The bag is under the chair.", ".", "bag / is at / chair / underneath", [T("bāo","baow"),T("zài","dzye"),T("yǐzi","yee-dzuh"),T("xiàmiàn","shyah-myen")]),
      P("The computer is in the room.", ".", "computer / is at / room / inside", [T("diànnǎo","dyen-now"),T("zài","dzye"),T("fángjiān","fahng-jyen"),T("lǐ","lee")]),
      P("Where are my shoes?", "?", "my / shoes / are at / where", [T("wǒ","waw"),T("de","duh"),T("xié","shyeh"),T("zài","dzye"),T("nǎr","nar")])
    ]},
    { id: "people", name: "People around me", emoji: "👥", sub: "Family, colleagues and occupations", phrases: [
      P("She is my colleague.", ".", "she / is / my / colleague", [T("tā","tah"),T("shì","shrr"),T("wǒ","waw"),T("de","duh"),T("tóngshì","tohng-shrr")]),
      P("He is a teacher.", ".", "he / is / teacher", [T("tā","tah"),T("shì","shrr"),T("lǎoshī","laow-shrr")]),
      P("That child is a student.", ".", "that / child / is / student", [T("nà","nah"),T("ge","guh"),T("háizi","high-dzuh"),T("shì","shrr"),T("xuésheng","shweh-shung")]),
      P("My mother is a doctor.", ".", "my / mother / is / doctor", [T("wǒ","waw"),T("māma","mah-ma"),T("shì","shrr"),T("yīshēng","ee-shung")]),
      P("I want to speak to the server.", ".", "I / want / with / server / speak", [T("wǒ","waw"),T("xiǎng","shyahng"),T("gēn","gun"),T("fúwùyuán","foo-woo-ywen"),T("shuōhuà","shwaw-hwah")])
    ]},
    { id: "questions", name: "Useful questions", emoji: "❓", sub: "Ask about people and belongings", phrases: [
      P("Whose bag is this?", "?", "this / is / whose / bag", [T("zhè","juh"),T("shì","shrr"),T("shéi","shay"),T("de","duh"),T("bāo","baow")]),
      P("Is this your computer?", "?", "this / is / your / computer / [question]", [T("zhè","juh"),T("shì","shrr"),T("nǐ","nee"),T("de","duh"),T("diànnǎo","dyen-now"),T("ma","mah")]),
      P("Who is that person?", "?", "that / person / is / who", [T("nà","nah"),T("ge","guh"),T("rén","run"),T("shì","shrr"),T("shéi","shay")]),
      P("Do you have the key?", "?", "you / have / key / [question]", [T("nǐ","nee"),T("yǒu","yoh"),T("yàoshi","yow-shrr"),T("ma","mah")]),
      P("My friend is outside.", ".", "my / friend / is at / outside", [T("wǒ","waw"),T("de","duh"),T("péngyou","pung-yoh"),T("zài","dzye"),T("wàimiàn","wye-myen")])
    ]}
  ];
}());
