// --- DARK/LIGHT MODE LOGIC ---

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

/**
 * Set the theme (dark or light), update button label, and save to localStorage
 */
function setTheme(mode) {
    if (mode === 'dark') {
        body.classList.add('dark');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        body.classList.remove('dark');
        themeToggle.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem('theme', mode);
}

/**
 * Toggle between dark and light mode
 */
function toggleTheme() {
    setTheme(body.classList.contains('dark') ? 'light' : 'dark');
}

// --- HOMOGLYPH MAPS FOR EACH METHOD ---

// Method 1: Simple - Only a few obvious replacements
const simpleMap = {
    a: 'α', A: 'Α',
    e: 'е', E: 'Ε',
    i: 'і', I: 'Ι',
    o: 'ο', O: 'Ο',
    c: 'с', C: 'С',
    y: 'у', Y: 'Υ',
    s: 'ѕ', S: 'Ѕ'
};

// Method 2: Intermediate - More substitutions, some Greek & Cyrillic
const intermediateMap = {
    a: 'α', A: 'Α',
    b: 'Ь', B: 'Β',
    c: 'с', C: 'С',
    d: 'ԁ', D: 'Ꭰ',
    e: 'е', E: 'Ε',
    f: 'ғ', F: 'Ғ',
    g: 'ɡ', G: 'Ԍ',
    h: 'һ', H: 'Н',
    i: 'і', I: 'Ι',
    j: 'ј', J: 'Ј',
    k: 'κ', K: 'Κ',
    l: 'ӏ', L: 'Ꮮ',
    m: 'м', M: 'Μ',
    n: 'η', N: 'Ν',
    o: 'ο', O: 'Ο',
    p: 'р', P: 'Ρ',
    q: 'զ', Q: 'Ⴓ',
    r: 'г', R: 'Я',
    s: 'ѕ', S: 'Ѕ',
    t: 'τ', T: 'Τ',
    u: 'υ', U: 'Ս',
    v: 'ν', V: 'Ѵ',
    w: 'ѡ', W: 'Ԝ',
    x: 'х', X: 'Χ',
    y: 'у', Y: 'Υ',
    z: 'ᴢ', Z: 'Ζ'
};

// Method 3: Advanced - Full random mixed homoglyphs for each letter
const advancedHomoglyphs = {
    A: ['Α', 'А', 'Ꭺ', 'Λ'],
    B: ['Β', 'В', 'Ƀ', 'Ᏼ'],
    C: ['С', 'Ϲ', 'Ꮯ', 'Ⅽ'],
    D: ['Ꭰ', 'ԁ', 'Đ'],
    E: ['Ε', 'Е', 'Ꭼ', 'Ɇ', '𝑬'],
    F: ['Ғ', 'Ϝ', 'ᖴ'],
    G: ['ɢ', 'ɡ', 'Ԍ', 'Ꮐ'],
    H: ['Η', 'Н', 'Ꮋ', 'ʜ'],
    I: ['Ι', 'І', 'Ӏ', 'Ꭵ', '𝑰'],
    J: ['Ј', 'Ꭻ', 'Ɉ', 'ʝ'],
    K: ['Κ', 'К', 'Ꮶ', '𝑲'],
    L: ['Ꮮ', 'ʟ', 'ӏ', '𝑳'],
    M: ['Μ', 'М', 'Ꮇ', '𝑴'],
    N: ['Ν', 'N', 'И', 'Ꮑ', '𝑵'],
    O: ['Ο', 'О', 'Օ', 'Ꮎ', '𝑶'],
    P: ['Ρ', 'Р', 'Ꮲ', '𝑷'],
    Q: ['Ԛ', 'Ⴓ', 'Ꭴ'],
    R: ['Ꭱ', 'ʀ', 'Я', '𝑹'],
    S: ['Ѕ', 'Ⴝ', 'Ꮪ', '𝑺', 'ʂ'],
    T: ['Τ', 'Т', 'Ꭲ', '𝑻'],
    U: ['Ս', 'Ս', 'Ꮼ', '𝑼', 'υ'],
    V: ['Ѵ', 'ν', 'Ꮩ', '𝑽'],
    W: ['Ԝ', 'Ꮃ', '𝑾'],
    X: ['Χ', 'Х', 'Ꮖ', '𝑿'],
    Y: ['Υ', 'Ү', 'Ꭹ', '𝒀', 'γ'],
    Z: ['Ζ', 'З', 'Ꮓ', '𝒁', 'ż'],

    a: ['а', 'α', 'ɑ', 'ạ', 'ą', 'à', 'á'],
    b: ['Ь', 'Ꮟ', 'ь', 'ƅ'],
    c: ['с', 'ϲ', 'ċ', 'ƈ', 'ς'],
    d: ['ԁ', 'ɗ', 'đ', 'Ꮷ'],
    e: ['е', 'є', 'ɛ', 'ė', 'ẹ', 'é', 'è'],
    f: ['ғ', 'ƒ', 'ϝ'],
    g: ['ɡ', 'ɢ', 'ġ', 'ᶃ'],
    h: ['һ', 'ḥ', 'ɦ', 'Ꮒ'],
    i: ['і', 'í', 'ï', 'ɪ', 'ı'],
    j: ['ј', 'ʝ', 'ɉ', 'ȷ'],
    k: ['κ', 'к', 'ķ', 'ᶄ'],
    l: ['ӏ', 'ḷ', 'ł', 'ⅼ', 'Ꮮ'],
    m: ['м', 'ṃ', 'Ꮇ', 'ɱ'],
    n: ['и', 'η', 'ɲ', 'ñ', 'Ꮑ'],
    o: ['о', 'ο', 'օ', 'ö', 'ó', 'ò', 'ɵ'],
    p: ['р', 'ρ', 'þ', 'Ꮲ'],
    q: ['զ', 'ɋ', 'ᑫ'],
    r: ['г', 'г', 'ř', 'ŕ', 'ɾ', 'я'],
    s: ['ѕ', 'ş', 'ș', 'ʂ', 'Ꮪ'],
    t: ['τ', 'т', 'ţ', 'ț', 'Ꮦ'],
    u: ['υ', 'ս', 'ü', 'ú', 'ù', 'ʋ'],
    v: ['ν', 'ѵ', 'ʋ', 'Ꮩ'],
    w: ['ԝ', 'ѡ', 'Ꮤ', 'ɯ'],
    x: ['х', 'χ', 'ҳ', 'Ꮖ'],
    y: ['у', 'ү', 'γ', 'ʏ', 'Ꭹ'],
    z: ['з', 'ζ', 'ż', 'ʐ', 'Ꮓ']
};

/**
 * Method 1: Simple processor - only replaces a few obvious letters
 */
function processWordSimple(word) {
    return word.split('').map(char => simpleMap[char] || char).join('');
}

/**
 * Method 2: Intermediate processor - replaces more letters with common homoglyphs
 */
function processWordIntermediate(word) {
    return word.split('').map(char => intermediateMap[char] || char).join('');
}

/**
 * Method 3: Advanced processor - replaces every letter with a random homoglyph from a large set
 */
function processWordAdvanced(word) {
    return word.split('').map(char => {
        const options = advancedHomoglyphs[char];
        if (!options) return char;
        const idx = Math.floor(Math.random() * options.length);
        return options[idx];
    }).join('');
}

/**
 * Main processing function - picks the method based on dropdown selection
 */
function processWord(option, word) {
    if (!word) return '';
    switch (option) {
        case '1': return processWordSimple(word);
        case '2': return processWordIntermediate(word);
        case '3': return processWordAdvanced(word);
        default: return word;
    }
}

// --- MAIN APP LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    // Set theme on page load based on saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
    themeToggle.addEventListener('click', toggleTheme);

    // Get references to input, select, and output elements
    const inputWord = document.getElementById('inputWord');
    const selectOption = document.getElementById('selectOption');
    const outputWord = document.getElementById('outputWord');

    /**
     * Update the processed output whenever input or method changes
     */
    function updateOutput() {
        const word = inputWord.value.trim();
        const option = selectOption.value;
        outputWord.textContent = processWord(option, word);
    }

    // Listen for input and method changes
    inputWord.addEventListener('input', updateOutput);
    selectOption.addEventListener('change', updateOutput);

    // Initial output update on page load
    updateOutput();
});
