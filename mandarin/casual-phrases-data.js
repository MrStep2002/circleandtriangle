(function () {
  const T = (pin, phon) => [pin, phon];
  const P = (en, punct, literal, tokens) => ({ en, punct, literal, tokens });
  window.SENTENCE_TOPICS = [
    { id: "casual", name: "Casual greetings", emoji: "👋", sub: "Relaxed ways to greet people", phrases: [
      P("Hey, how's it going?", "?", "hey / recently / how is it", [T("hāi","high"),T("zuìjìn","dzway-jin"),T("zěnmeyàng","dzun-muh-yahng")]),
      P("Pretty good.", ".", "quite / good", [T("tǐng","ting"),T("hǎo","how"),T("de","duh")]),
      P("Not bad.", ".", "still / not bad", [T("hái","high"),T("búcuò","boo-tswaw")]),
      P("Long time no see.", ".", "long time / not / see", [T("hǎojiǔ","how-jyoh"),T("bú","boo"),T("jiàn","jyen")]),
      P("See you later.", ".", "later / see", [T("huítóu","hway-toh"),T("jiàn","jyen")])
    ]},
    { id: "reactions", name: "Natural reactions", emoji: "😄", sub: "Really, no way, brilliant…", phrases: [
      P("Really?", "?", "real / [question]", [T("zhēn","jun"),T("de","duh"),T("ma","mah")]),
      P("No way!", "!", "can't be / [softening particle]", [T("bú","boo"),T("huì","hway"),T("ba","bah")]),
      P("Awesome!", "!", "too / brilliant / [change]", [T("tài","tye"),T("bàng","bahng"),T("le","luh")]),
      P("That's really funny.", ".", "really / funny", [T("zhēn","jun"),T("hǎoxiào","how-shyow")]),
      P("I'm kidding.", ".", "I / make / joke / [descriptive]", [T("wǒ","waw"),T("kāi","kye"),T("wánxiào","wahn-shyow"),T("de","duh")])
    ]},
    { id: "meetup", name: "Making plans", emoji: "🍜", sub: "Food, meeting and being on the way", phrases: [
      P("Are you free tonight?", "?", "you / tonight / have free time / [question]", [T("nǐ","nee"),T("jīnwǎn","jin-wahn"),T("yǒu","yoh"),T("kòng","kohng"),T("ma","mah")]),
      P("Want to eat together?", "?", "want or not want / together / eat", [T("yào","yow"),T("bu","boo"),T("yào","yow"),T("yīqǐ","ee-chee"),T("chīfàn","chrr-fahn")]),
      P("Let's go.", ".", "go / [suggestion]", [T("zǒu","dzoh"),T("ba","bah")]),
      P("I'm on my way.", ".", "I / am at / road-on", [T("wǒ","waw"),T("zài","dzye"),T("lùshang","loo-shahng")]),
      P("I'm almost there.", ".", "I / nearly / arrive / [change]", [T("wǒ","waw"),T("kuài","kwye"),T("dào","daow"),T("le","luh")])
    ]},
    { id: "help", name: "Conversation help", emoji: "🗣️", sub: "Keep a real conversation moving", phrases: [
      P("Wait a second.", ".", "wait / a moment", [T("děng","dung"),T("yīxià","ee-shyah")]),
      P("Say it again.", ".", "again / say / one / time", [T("zài","dzye"),T("shuō","shwaw"),T("yī","ee"),T("biàn","byen")]),
      P("Speak a little more slowly.", ".", "speak / slow / a little", [T("shuō","shwaw"),T("màn","mahn"),T("yīdiǎn","ee-dyen")]),
      P("I get it now.", ".", "I / understand / [change]", [T("wǒ","waw"),T("dǒng","dohng"),T("le","luh")]),
      P("I still don't understand.", ".", "I / still / not / understand", [T("wǒ","waw"),T("háishi","high-shrr"),T("bù","boo"),T("dǒng","dohng")])
    ]},
    { id: "everyday", name: "Everyday responses", emoji: "📱", sub: "No worries, messages and WeChat", phrases: [
      P("No worries.", ".", "nothing is wrong", [T("méishìr","may-shrr")]),
      P("No problem.", ".", "not have / problem", [T("méi","may"),T("wèntí","wun-tee")]),
      P("Anything is fine.", ".", "all / can", [T("dōu","doh"),T("kěyǐ","kuh-yee")]),
      P("Send me a message.", ".", "to / me / send / one / message", [T("gěi","gay"),T("wǒ","waw"),T("fā","fah"),T("ge","guh"),T("xiāoxi","shyow-shee")]),
      P("Add me on WeChat.", ".", "add / briefly / my / WeChat", [T("jiā","jyah"),T("yīxià","ee-shyah"),T("wǒ","waw"),T("de","duh"),T("Wēixìn","way-sheen")])
    ]}
  ];
}());
