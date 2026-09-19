(function () {
  const T = (pin, phon) => [pin, phon];
  const P = (en, punct, literal, tokens) => ({ en, punct, literal, tokens });
  window.SENTENCE_TOPICS = [
    { id: "position", name: "Where things are", emoji: "📍", sub: "Left, right, inside and outside", phrases: [
      P("The bank is on the left.", ".", "bank / is at / left side", [T("yínháng","yeen-hahng"),T("zài","dzye"),T("zuǒbian","dzwaw-byen")]),
      P("The shop is on the right.", ".", "shop / is at / right side", [T("shāngdiàn","shahng-dyen"),T("zài","dzye"),T("yòubian","yoh-byen")]),
      P("The toilet is inside.", ".", "toilet / is at / inside", [T("cèsuǒ","tsuh-swaw"),T("zài","dzye"),T("lǐmiàn","lee-myen")]),
      P("The car is outside.", ".", "car / is at / outside", [T("chē","chuh"),T("zài","dzye"),T("wàimiàn","wye-myen")]),
      P("The hospital is in front.", ".", "hospital / is at / in front", [T("yīyuàn","ee-ywen"),T("zài","dzye"),T("qiánmiàn","chyen-myen")])
    ]},
    { id: "directions", name: "Giving directions", emoji: "🧭", sub: "Turn, continue, near and far", phrases: [
      P("Turn left.", ".", "towards / left / turn", [T("wǎng","wahng"),T("zuǒ","dzwaw"),T("zhuǎn","jwan")]),
      P("Turn right.", ".", "towards / right / turn", [T("wǎng","wahng"),T("yòu","yoh"),T("zhuǎn","jwan")]),
      P("Keep going straight.", ".", "towards / ahead / walk", [T("wǎng","wahng"),T("qián","chyen"),T("zǒu","dzoh")]),
      P("It isn't far.", ".", "not / far", [T("bù","boo"),T("yuǎn","ywen")]),
      P("The station is behind the supermarket.", ".", "station / is at / supermarket / behind", [T("huǒchēzhàn","hwaw-chuh-jahn"),T("zài","dzye"),T("chāoshì","chow-shrr"),T("hòumiàn","hoh-myen")])
    ]},
    { id: "plans", name: "Making simple plans", emoji: "📅", sub: "Where, when and meeting up", phrases: [
      P("Where are you now?", "?", "you / now / are at / where", [T("nǐ","nee"),T("xiànzài","shyen-dzye"),T("zài","dzye"),T("nǎr","nar")]),
      P("I'm at home.", ".", "I / am at / home", [T("wǒ","waw"),T("zài","dzye"),T("jiā","jyah")]),
      P("I'll go tomorrow.", ".", "I / tomorrow / go", [T("wǒ","waw"),T("míngtiān","ming-tyen"),T("qù","chyoo")]),
      P("Let's meet at the restaurant.", ".", "we / at / restaurant / meet / [suggestion]", [T("wǒmen","waw-mun"),T("zài","dzye"),T("fànguǎn","fahn-gwahn"),T("jiàn","jyen"),T("ba","bah")]),
      P("See you there.", ".", "at / there / meet", [T("zài","dzye"),T("nàr","nar"),T("jiàn","jyen")])
    ]},
    { id: "travel", name: "Getting around", emoji: "🚕", sub: "Airports, parks and taxis", phrases: [
      P("I want to go to the airport.", ".", "I / want / go / airport", [T("wǒ","waw"),T("xiǎng","shyahng"),T("qù","chyoo"),T("jīchǎng","jee-chahng")]),
      P("Is the park far?", "?", "park / far / [question]", [T("gōngyuán","gohng-ywen"),T("yuǎn","ywen"),T("ma","mah")]),
      P("The taxi is outside.", ".", "taxi / is at / outside", [T("chūzūchē","choo-dzoo-chuh"),T("zài","dzye"),T("wàimiàn","wye-myen")]),
      P("Please stop in front.", ".", "please / at / in front / stop", [T("qǐng","ching"),T("zài","dzye"),T("qiánmiàn","chyen-myen"),T("tíng","ting")]),
      P("I'm going the wrong way.", ".", "I / walk / wrong / [change]", [T("wǒ","waw"),T("zǒu","dzoh"),T("cuò","tswaw"),T("le","luh")])
    ]}
  ];
}());
