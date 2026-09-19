(function () {
  const digitPin = ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"];
  const digitHan = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const sounds = {
    "líng":"ling", "yī":"ee", "èr":"arr", "sān":"sahn", "sì":"suh", "wǔ":"woo",
    "liù":"lyoh", "qī":"chee", "bā":"bah", "jiǔ":"jyoh", "shí":"shrr",
    "bǎi":"bye", "qiān":"chyen", "liǎng":"lyahng"
  };

  function under100(n, includeOneBeforeTen) {
    if (n < 10) return digitPin[n];
    const tens = Math.floor(n / 10), ones = n % 10;
    const start = tens === 1 ? (includeOneBeforeTen ? "yī shí" : "shí") : `${digitPin[tens]} shí`;
    return ones ? `${start} ${digitPin[ones]}` : start;
  }

  function numberToPinyin(n) {
    n = Number(n);
    if (!Number.isInteger(n) || n < 0 || n > 9999) throw new Error("Number must be 0–9999");
    if (n < 100) return under100(n, false);
    if (n < 1000) {
      const hundreds = Math.floor(n / 100), rest = n % 100;
      let result = `${hundreds === 2 ? "liǎng" : digitPin[hundreds]} bǎi`;
      if (!rest) return result;
      if (rest < 10) return `${result} líng ${digitPin[rest]}`;
      return `${result} ${under100(rest, true)}`;
    }
    const thousands = Math.floor(n / 1000), rest = n % 1000;
    let result = `${thousands === 2 ? "liǎng" : digitPin[thousands]} qiān`;
    if (!rest) return result;
    if (rest < 100) result += " líng";
    if (rest < 10) return `${result} ${digitPin[rest]}`;
    if (rest < 100) return `${result} ${under100(rest, true)}`;
    return `${result} ${numberToPinyin(rest)}`;
  }

  function under100Hanzi(n, includeOneBeforeTen) {
    if (n < 10) return digitHan[n];
    const tens = Math.floor(n / 10), ones = n % 10;
    let result = tens === 1 ? (includeOneBeforeTen ? "一十" : "十") : `${digitHan[tens]}十`;
    if (ones) result += digitHan[ones];
    return result;
  }

  function numberToHanzi(n) {
    if (n < 100) return under100Hanzi(n, false);
    if (n < 1000) {
      const h = Math.floor(n / 100), rest = n % 100;
      let result = `${h === 2 ? "两" : digitHan[h]}百`;
      if (!rest) return result;
      if (rest < 10) return `${result}零${digitHan[rest]}`;
      return `${result}${under100Hanzi(rest, true)}`;
    }
    const th = Math.floor(n / 1000), rest = n % 1000;
    let result = `${th === 2 ? "两" : digitHan[th]}千`;
    if (!rest) return result;
    if (rest < 100) result += "零";
    if (rest < 10) return result + digitHan[rest];
    if (rest < 100) return result + under100Hanzi(rest, true);
    return result + numberToHanzi(rest);
  }

  function pronunciation(pinyin) {
    return pinyin.split(" ").map(part => sounds[part] || part).join("-");
  }

  function word(n) {
    const pinyin = numberToPinyin(n);
    return [pinyin, String(n), pronunciation(pinyin), numberToHanzi(n)];
  }

  window.MandarinNumbers = { numberToPinyin, numberToHanzi, pronunciation };
  window.NUMBER_TOPICS = [
    { id:"teens", name:"Eleven to twenty", emoji:"1️⃣", sub:"Learn the first number pattern", words:[11,12,13,14,15,16,17,18,19,20].map(word) },
    { id:"landmarks", name:"Tens and landmarks", emoji:"🔟", sub:"Twenty to one thousand", words:[20,30,40,50,60,70,80,90,100,1000].map(word) },
    { id:"mixed", name:"Useful mixed numbers", emoji:"🎲", sub:"See how the patterns fit together", words:[21,35,48,52,67,74,86,99,101,110].map(word) }
  ];
}());
