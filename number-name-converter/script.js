const scaleNames = [
  '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion',
  'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion',
  'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion',
  'sexdecillion', 'septendecillion', 'octodecillion', 'novemdecillion', 'vigintillion',
  'unvigintillion', 'duovigintillion', 'trevigintillion', 'quattuorvigintillion',
  'quinvigintillion', 'sexvigintillion', 'septenvigintillion', 'octovigintillion', 'novemvigintillion',
  'trigintillion', 'untrigintillion', 'duotrigintillion', 'tretrigintillion', 'quattuortrigintillion',
  'quintrigintillion', 'sextrigintillion', 'septentrigintillion', 'octotrigintillion', 'novemtrigintillion',
  'quadragintillion', 'unquadragintillion', 'duoquadragintillion', 'trequadragintillion', 'quattuorquadragintillion',
  'quinquadragintillion', 'sexquadragintillion', 'septenquadragintillion', 'octoquadragintillion', 'novemquadragintillion',
  'quinquagintillion', 'unquinquagintillion', 'duoquinquagintillion', 'trequinquagintillion', 'quattuorquinquagintillion',
  'quinquinquagintillion', 'sexquinquagintillion', 'septenquinquagintillion', 'octoquinquagintillion', 'novemquinquagintillion',
  'sexagintillion', 'unsexagintillion', 'duosexagintillion', 'tresexagintillion', 'quattuorsexagintillion',
  'quinsexagintillion', 'sexsexagintillion', 'septensexagintillion', 'octosexagintillion', 'novemsexagintillion',
  'septuagintillion', 'unseptuagintillion', 'duoseptuagintillion', 'treseptuagintillion', 'quattuorseptuagintillion',
  'quinseptuagintillion', 'sexseptuagintillion', 'septenseptuagintillion', 'octoseptuagintillion', 'novemseptuagintillion',
  'octogintillion', 'unoctogintillion', 'duooctogintillion', 'treoctogintillion', 'quattuoroctogintillion',
  'quinoctogintillion', 'sexoctogintillion', 'septoctogintillion', 'octooctogintillion', 'novemoctogintillion',
  'nonagintillion', 'unnonagintillion', 'duononagintillion', 'trenonagintillion', 'quattuornonagintillion',
  'quinnonagintillion', 'sexnonagintillion', 'septennonagintillion', 'octononagintillion', 'novemnonagintillion',
  'centillion', // 10^303, but for 10^100, we use googol
  'googol' // 10^100
];

const below20 = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

function chunkNumber(str) {
  let out = [];
  while (str.length > 0) {
    out.unshift(str.slice(-3));
    str = str.slice(0, -3);
  }
  return out;
}

function threeDigitsToWords(num) {
  num = parseInt(num, 10);
  if (num === 0) return '';
  if (num < 20) return below20[num];
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 ? '-' + below20[num % 10] : '');
  }
  return (
    below20[Math.floor(num / 100)] +
    ' hundred' +
    (num % 100 ? ' ' + threeDigitsToWords(num % 100) : '')
  );
}

function numberToWords(numStr) {
  if (!/^\d+$/.test(numStr)) return '';
  if (numStr === '0') return 'zero';

  // Special case for googol
  if (numStr === '1' + '0'.repeat(100)) return 'one googol';

  let chunks = chunkNumber(numStr);
  let words = [];
  for (let i = 0; i < chunks.length; i++) {
    let chunkNum = parseInt(chunks[i], 10);
    if (chunkNum !== 0) {
      let chunkWords = threeDigitsToWords(chunks[i]);
      let scaleIndex = chunks.length - i - 1;
      let scale = '';
      // For 10^100, call it 'googol'
      if (chunks.length === 34 && i === 0) scale = 'googol';
      else if (scaleIndex < scaleNames.length) scale = scaleNames[scaleIndex];
      words.push(chunkWords + (scale ? ' ' + scale : ''));
    }
  }
  return words.join(' ').replace(/\s+/g, ' ').trim();
}

function wordsToNumber(words) {
  if (!words) return "";
  words = words.toLowerCase().replace(/-/g, " ").replace(/ and /g, " ");
  const numberWords = {
    "zero":0,"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,"eight":8,"nine":9,
    "ten":10,"eleven":11,"twelve":12,"thirteen":13,"fourteen":14,"fifteen":15,"sixteen":16,
    "seventeen":17,"eighteen":18,"nineteen":19,"twenty":20,"thirty":30,"forty":40,"fifty":50,
    "sixty":60,"seventy":70,"eighty":80,"ninety":90,"hundred":100,"thousand":1000,"million":1000000,
    "billion":1000000000,"trillion":1000000000000,"quadrillion":1000000000000000,
    "quintillion":1000000000000000000,"sextillion":1e21,"septillion":1e24,"octillion":1e27,
    "nonillion":1e30,"decillion":1e33,"undecillion":1e36,"duodecillion":1e39,"tredecillion":1e42,
    "quattuordecillion":1e45,"quindecillion":1e48,"sexdecillion":1e51,"septendecillion":1e54,
    "octodecillion":1e57,"novemdecillion":1e60,"vigintillion":1e63,
    "unvigintillion":1e66,"duovigintillion":1e69,"trevigintillion":1e72,"quattuorvigintillion":1e75,
    "quinvigintillion":1e78,"sexvigintillion":1e81,"septenvigintillion":1e84,"octovigintillion":1e87,"novemvigintillion":1e90,
    "trigintillion":1e93,"untrigintillion":1e96,"duotrigintillion":1e99,"googol":1e100
  };
  let tokens = words.split(/\s+/);
  let num = 0, current = 0;
  for (let token of tokens) {
    if (token === "minus") {
      current *= -1;
    } else if (numberWords[token] >= 100) {
      current *= numberWords[token];
    } else if (numberWords[token] !== undefined) {
      current += numberWords[token];
    } else if (token === "") {
      continue;
    } else {
      return "";
    }
    if (numberWords[token] >= 1000) {
      num += current;
      current = 0;
    }
  }
  return (num + current).toString();
}

document.getElementById('to-name').onclick = function() {
  const val = document.getElementById('number-input').value.trim();
  document.getElementById('name-output').textContent = numberToWords(val) || "";
};

document.getElementById('to-number').onclick = function() {
  const val = document.getElementById('name-input').value.trim();
  document.getElementById('number-output').textContent = wordsToNumber(val) || "";
};

// Dropdown logic
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownContent = document.getElementById('dropdown-content');
const arrow = document.getElementById('arrow');
dropdownToggle.onclick = function() {
  dropdownContent.classList.toggle('open');
  if (dropdownContent.classList.contains('open')) {
    arrow.style.transform = 'rotate(90deg)';
  } else {
    arrow.style.transform = 'rotate(0deg)';
  }
};
