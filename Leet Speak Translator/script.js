const leetMap = {
  'A': '4', 'B': '8', 'C': '(', 'D': 'D', 'E': '3', 'F': 'F', 'G': '6', 'H': '#',
  'I': '1', 'J': 'J', 'K': 'K', 'L': '1', 'M': 'M', 'N': 'N', 'O': '0', 'P': 'P',
  'Q': 'Q', 'R': 'R', 'S': '5', 'T': '7', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
  'Y': 'Y', 'Z': '2'
};
const leetReverseMap = {
  '4': 'A', '8': 'B', '(': 'C', '3': 'E', '6': 'G', '#': 'H', '1': 'I', '0': 'O', '5': 'S', '7': 'T', '2': 'Z'
};
function toLeet(text) {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (leetMap[upper]) {
      if (char === char.toLowerCase()) return leetMap[upper].toLowerCase();
      return leetMap[upper];
    }
    return char;
  }).join('');
}
function toEnglish(text) {
  return text.split('').map(char => {
    if (leetReverseMap[char]) return leetReverseMap[char];
    if (leetReverseMap[char.toUpperCase()]) return leetReverseMap[char.toUpperCase()].toLowerCase();
    return char;
  }).join('');
}
const input = document.getElementById('input');
const output = document.getElementById('output');
document.getElementById('toLeet').onclick = () => {
  output.value = toLeet(input.value);
};
document.getElementById('toEng').onclick = () => {
  output.value = toEnglish(input.value);
};
document.getElementById('clear').onclick = () => {
  input.value = '';
  output.value = '';
};
