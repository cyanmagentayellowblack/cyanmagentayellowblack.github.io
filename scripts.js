// --- DARK/LIGHT MODE LOGIC ---

// Get references to the theme toggle button and the body element
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

/**
 * Set the theme (dark or light), update button label, and save to localStorage
 * @param {string} mode - 'dark' or 'light'
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
    if (body.classList.contains('dark')) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// --- ADVANCED MIXED HOMOGLYPH PROCESSING ---

/**
 * Map each English letter (upper & lower case) to an array of visually similar Unicode homoglyphs
 */
const homoglyphs = {
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
 * Randomly pick a homoglyph for a given character, or return the character unchanged if none found.
 * @param {string} char - Single character to process
 * @returns {string} - Homoglyph or original character
 */
function randomHomoglyph(char) {
    const options = homoglyphs[char];
    if (!options) return char; // No homoglyphs for this char
    const idx = Math.floor(Math.random() * options.length);
    return options[idx];
}

/**
 * Main processing function: replaces each letter with a random homoglyph from the list.
 * Leaves non-alphabet characters untouched.
 * @param {string} word - Input string to process
 * @returns {string} - Processed string with mixed homoglyphs
 */
function processWordMixed(word) {
    return word.split('').map(char => randomHomoglyph(char)).join('');
}

/**
 * Unified processor for all modes (currently all modes use the mixed homoglyph approach)
 * @param {string} option - Method number as string ('1', '2', '3')
 * @param {string} word - Input string
 * @returns {string} - Processed string
 */
function processWord(option, word) {
    if (!word) return '';
    // All methods use the same advanced mixed homoglyph processor for max variety
    return processWordMixed(word);
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
