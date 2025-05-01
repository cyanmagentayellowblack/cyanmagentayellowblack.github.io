// --- THEME TOGGLE LOGIC ---

// Get references to the theme toggle button and the body element
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Function to set the theme (dark or light)
function setTheme(mode) {
    if (mode === 'dark') {
        body.classList.add('dark');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        body.classList.remove('dark');
        themeToggle.textContent = '🌙 Dark Mode';
    }
    // Save the user's choice in localStorage
    localStorage.setItem('theme', mode);
}

// Function to toggle between dark and light mode
function toggleTheme() {
    if (body.classList.contains('dark')) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// On page load, set the theme based on saved preference or system preference
document.addEventListener('DOMContentLoaded', () => {
    // Check saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // If no saved theme, use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
    // Add click event to toggle button
    themeToggle.addEventListener('click', toggleTheme);

    // --- MAIN APP LOGIC BELOW ---

    // Get references to input, select, and output elements
    const inputWord = document.getElementById('inputWord');
    const selectOption = document.getElementById('selectOption');
    const outputWord = document.getElementById('outputWord');

    // Method 1: Replace each letter with a visually similar Unicode character (mostly uppercase Greek/Cyrillic)
    function processWordScript1(word) {
        const replacements = {
            "a": "Α", "b": "Β", "c": "С", "d": "Đ", "e": "Ε",
            "f": "Ƒ", "g": "Ĝ", "h": "Ή", "i": "İ", "j": "Ј",
            "k": "Κ", "l": "Ĺ", "m": "Μ", "n": "Ν", "o": "Ø",
            "p": "Ρ", "q": "Ꝗ", "r": "Ř", "s": "Š", "t": "Τ",
            "u": "Џ", "v": "Ṿ", "w": "Ш", "x": "Χ", "y": "Ύ",
            "z": "Ζ"
        };
        // Convert word to lowercase, replace each character if possible
        return word.toLowerCase().split('').map(char => replacements[char] || char).join('');
    }

    // Method 2: Similar to Method 1, but replaces 's' with '$' for a different effect
    function processWordScript2(word) {
        return word
            .replace(/a/g, 'Α').replace(/b/g, 'Β').replace(/c/g, 'С')
            .replace(/d/g, 'Đ').replace(/e/g, 'Ε').replace(/f/g, 'Ƒ')
            .replace(/g/g, 'Ĝ').replace(/h/g, 'Ή').replace(/i/g, 'İ')
            .replace(/j/g, 'Ј').replace(/k/g, 'Κ').replace(/l/g, 'Ĺ')
            .replace(/m/g, 'Μ').replace(/n/g, 'Ν').replace(/o/g, 'Ø')
            .replace(/p/g, 'Ρ').replace(/q/g, 'Ꝗ').replace(/r/g, 'Ř')
            .replace(/s/g, '$').replace(/t/g, 'Τ').replace(/u/g, 'Џ')
            .replace(/v/g, 'Ṿ').replace(/w/g, 'Ш').replace(/x/g, 'Χ')
            .replace(/y/g, 'Ύ').replace(/z/g, 'Ζ');
    }

    // Method 3: Uses a different set of replacements, with more lowercase and symbol-like letters
    function processWordScript3(word) {
        const replacements = {
            "a": "α", "b": "β", "c": "¢", "d": "∂", "e": "є",
            "f": "ƒ", "g": "g", "h": "н", "i": "ι", "j": "נ",
            "k": "к", "l": "ℓ", "m": "м", "n": "η", "o": "σ",
            "p": "ρ", "q": "q", "r": "я", "s": "$", "t": "т",
            "u": "υ", "v": "ν", "w": "ω", "x": "χ", "y": "γ",
            "z": "z"
        };
        // Convert word to lowercase, replace each character if possible
        return word.toLowerCase().split('').map(char => replacements[char] || char).join('');
    }

    // Main function to choose which processing method to use
    function processWord(option, word) {
        if (!word) return '';
        switch (option) {
            case '1': return processWordScript1(word);
            case '2': return processWordScript2(word);
            case '3': return processWordScript3(word);
            default: return word;
        }
    }

    // Function to update the output whenever input or method changes
    function updateOutput() {
        const word = inputWord.value.trim();
        const option = selectOption.value;
        outputWord.textContent = processWord(option, word);
    }

    // Listen for changes in the input field
    inputWord.addEventListener('input', updateOutput);

    // Listen for changes in the select dropdown
    selectOption.addEventListener('change', updateOutput);

    // Initial output update on page load
    updateOutput();
});
