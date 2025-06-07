const STOPWORDS = new Set([
    "the","and","a","an","in","on","at","of","to","for","with","by","from","as","but","or","nor","so","yet","if","then","than","that","which","who","whom","whose","this","these","those","am","is","are","was","were","be","been","being","have","has","had","do","does","did"
]);

const inputPage = document.getElementById('input-page');
const readerPage = document.getElementById('reader-page');
const startBtn = document.getElementById('start-btn');
const inputText = document.getElementById('input-text');
const speedreaderBox = document.getElementById('speedreader-box');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const settingsBtn = document.getElementById('settings-btn');
const progressBar = document.getElementById('progress-bar');
const progressInfo = document.getElementById('progress-info');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const advancedDropdown = document.getElementById('advanced-dropdown');
const advancedBtn = document.getElementById('advanced-btn');
const advancedContent = document.getElementById('advanced-content');
const wpmInput = document.getElementById('wpm');
const chunkSizeInput = document.getElementById('chunk-size');
const fontSizeInput = document.getElementById('font-size');
const fontColorInput = document.getElementById('font-color');
const bgColorInput = document.getElementById('bg-color');
const alignmentInput = document.getElementById('alignment');
const speedVarInput = document.getElementById('speed-variability');
const chunkSentenceInput = document.getElementById('chunk-sentence');
const pauseSentenceInput = document.getElementById('pause-sentence');
const skipStopwordsInput = document.getElementById('skip-stopwords');
const aiAdaptiveInput = document.getElementById('ai-adaptive');
const comprehensionModal = document.getElementById('comprehension-modal');
const comprehensionQuestion = document.getElementById('comprehension-question');
const comprehensionAnswer = document.getElementById('comprehension-answer');
const submitAnswer = document.getElementById('submit-answer');
const closeComprehension = document.getElementById('close-comprehension');
const readingModeInput = document.getElementById('reading-mode');
const importUrlBtn = document.getElementById('import-url-btn');
const importGithubBtn = document.getElementById('import-github-btn');
const githubTokenInput = document.getElementById('github-token');
const githubPathInput = document.getElementById('github-path');
const fileUploadInput = document.getElementById('file-upload');
const consentModal = document.getElementById('consent-modal');
const acceptConsentBtn = document.getElementById('accept-consent');
const declineConsentBtn = document.getElementById('decline-consent');
const closeConsent = document.getElementById('close-consent');

let words = [];
let chunks = [];
let sentences = [];
let currentIndex = 0;
let timer = null;
let playing = false;
let comprehensionStats = JSON.parse(localStorage.getItem('comprehensionStats')) || { correct: 0, total: 0 };
let githubConsentGiven = false;

// Ensure settings modal is hidden and input page is visible on page load
settingsModal.classList.remove('active');
comprehensionModal.classList.remove('active');
consentModal.classList.remove('active');
inputPage.classList.remove('hidden');
readerPage.classList.add('hidden');

skipStopwordsInput.checked = false;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker Registered');
    });
}

function analyzeTextComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length || 0;
    const avgWordLength = text.split(' ').reduce((sum, w) => sum + w.length, 0) / text.split(' ').length || 0;
    return { avgSentenceLength, avgWordLength };
}

function splitTextToChunks(text, chunkSize, options = {}) {
    let rawWords = text.replace(/\s+/g, ' ').trim().split(' ');
    if (options.skipStopwords) {
        rawWords = rawWords.filter(w => !STOPWORDS.has(w.toLowerCase()));
    }
    let result = [];
    let chunk = [];
    let sentenceChunks = [];
    let currentSentence = [];
    for (let i = 0; i < rawWords.length; i++) {
        chunk.push(rawWords[i]);
        currentSentence.push(rawWords[i]);
        let endOfSentence = /[.!?]$/.test(rawWords[i]);
        if (
            chunk.length >= chunkSize ||
            (options.chunkSentence && endOfSentence)
        ) {
            result.push(chunk.join(' '));
            sentenceChunks.push(currentSentence.join(' '));
            chunk = [];
            if (endOfSentence) currentSentence = [];
        }
    }
    if (chunk.length > 0) {
        result.push(chunk.join(' '));
        sentenceChunks.push(currentSentence.join(' '));
    }
    return { chunks: result, sentences: sentenceChunks };
}

function getPauseDuration(chunk, wpm, options = {}) {
    let wordsInChunk = chunk.split(' ').length;
    let msPerWord = 60000 / wpm;
    let base = msPerWord * wordsInChunk;
    if (options.speedVar) {
        if (wordsInChunk > 2) base *= 1.15;
        if (wordsInChunk === 1) base *= 0.85;
    }
    if (options.pauseSentence && /[.!?]$/.test(chunk)) {
        base *= 1.7;
    }
    if (options.pauseSentence && /\n$/.test(chunk)) {
        base *= 2.2;
    }
    if (aiAdaptiveInput.checked) {
        const { avgSentenceLength, avgWordLength } = analyzeTextComplexity(chunks.join(' '));
        if (avgSentenceLength > 15 || avgWordLength > 6) base *= 1.3;
        if (comprehensionStats.total > 0 && comprehensionStats.correct / comprehensionStats.total < 0.7) {
            base *= 1.2;
            chunkSizeInput.value = Math.max(1, parseInt(chunkSizeInput.value) - 1);
            const chunkData = splitTextToChunks(inputText.value.trim(), parseInt(chunkSizeInput.value), {
                chunkSentence: chunkSentenceInput.checked,
                skipStopwords: skipStopwordsInput.checked
            });
            chunks = chunkData.chunks;
            sentences = chunkData.sentences;
        }
    }
    return base;
}

function updateBoxStyle() {
    speedreaderBox.style.setProperty('--fontsize', fontSizeInput.value + 'px');
    speedreaderBox.style.setProperty('--color', fontColorInput.value);
    speedreaderBox.style.setProperty('--bg', bgColorInput.value);
    speedreaderBox.style.setProperty('--align', alignmentInput.value);
    speedreaderBox.classList.remove('color-gradient', 'focus-mode');
    if (readingModeInput.value === 'color-gradient') {
        speedreaderBox.classList.add('color-gradient');
    } else if (readingModeInput.value === 'focus') {
        speedreaderBox.classList.add('focus-mode');
    }
}

function showChunk(idx) {
    const chunk = chunks[idx] || '';
    if (readingModeInput.value === 'focus') {
        const words = chunk.split(' ');
        const highlighted = words.map(word => {
            const orpIndex = Math.floor(word.length / 3);
            return `<span data-orp="${word[orpIndex] || ''}">${word}</span>`;
        }).join(' ');
        speedreaderBox.innerHTML = highlighted;
    } else {
        speedreaderBox.textContent = chunk;
    }
    currentIndex = idx;
    updateProgress();
}

function showComprehensionQuestion() {
    pause();
    const sentenceIndex = Math.min(sentences.length - 1, Math.floor(currentIndex / 50));
    const sentence = sentences[sentenceIndex] || 'What is the main idea?';
    comprehensionQuestion.textContent = `What is the main idea of: "${sentence}"?`;
    comprehensionModal.classList.add('active');
}

function importText(text) {
    inputText.value = text;
    sessionStorage.removeItem('githubToken');
    githubTokenInput.value = '';
}

async function importFromUrl(url) {
    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error('Failed to fetch URL');
        const text = await response.text();
        importText(text);
    } catch (error) {
        alert('Error importing URL: ' + error.message);
        console.error(error);
    }
}

async function importFromGithub(token, path) {
    if (!githubConsentGiven) {
        consentModal.classList.add('active');
        return;
    }
    try {
        const [owner, repo, ...filePath] = path.split('/');
        const file = filePath.join('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
            headers: { Authorization: `token ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch GitHub content');
        const data = await response.json();
        const text = atob(data.content);
        importText(text);
    } catch (error) {
        alert('Error importing from GitHub: ' + error.message);
        console.error(error);
    }
}

async function importFromFile(file) {
    if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => importText(e.target.result);
        reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        importText(text);
    } else {
        alert('Unsupported file type. Use .txt or .pdf.');
    }
}

function play() {
    if (playing) return;
    playing = true;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    step();
}

function pause() {
    playing = false;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    if (timer) clearTimeout(timer);
}

function step() {
    if (!playing || currentIndex >= chunks.length) {
        pause();
        return;
    }
    showChunk(currentIndex);
    if (aiAdaptiveInput.checked && currentIndex % 50 === 0 && currentIndex > 0) {
        showComprehensionQuestion();
        return;
    }
    let duration = getPauseDuration(
        chunks[currentIndex],
        parseInt(wpmInput.value),
        {
            speedVar: speedVarInput.checked,
            pauseSentence: pauseSentenceInput.checked
        }
    );
    timer = setTimeout(() => {
        currentIndex++;
        step();
    }, duration);
}

function skip(n) {
    let next = Math.max(0, Math.min(chunks.length - 1, currentIndex + n));
    showChunk(next);
}

function restart() {
    pause();
    showChunk(0);
}

function updateProgress() {
    let percent = ((currentIndex + 1) / chunks.length) * 100;
    progressBar.style.width = percent + "%";
    let totalTime = getTotalTime();
    let elapsedTime = getElapsedTime();
    progressInfo.textContent = `${formatTime(elapsedTime)} / ${formatTime(totalTime)} (${Math.round(percent)}%)`;
}

function getTotalTime() {
    let total = 0;
    for (let i = 0; i < chunks.length; i++) {
        total += getPauseDuration(
            chunks[i],
            parseInt(wpmInput.value),
            {
                speedVar: speedVarInput.checked,
                pauseSentence: pauseSentenceInput.checked
            }
        );
    }
    return total;
}

function getElapsedTime() {
    let elapsed = 0;
    for (let i = 0; i <= currentIndex; i++) {
        elapsed += getPauseDuration(
            chunks[i],
            parseInt(wpmInput.value),
            {
                speedVar: speedVarInput.checked,
                pauseSentence: pauseSentenceInput.checked
            }
        );
    }
    return elapsed;
}

function formatTime(ms) {
    let sec = Math.round(ms / 1000);
    let min = Math.floor(sec / 60);
    sec = sec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

function enterFullscreen() {
    readerPage.requestFullscreen?.() || readerPage.webkitRequestFullscreen?.() || readerPage.mozRequestFullScreen?.() || readerPage.msRequestFullscreen?.();
    speedreaderBox.classList.add('fullscreen');
}

function exitFullscreen() {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.mozCancelFullScreen?.() || document.msExitFullscreen?.();
    speedreaderBox.classList.remove('fullscreen');
}

startBtn.onclick = () => {
    let text = inputText.value.trim();
    if (!text) {
        alert('Please enter some text!');
        return;
    }
    let chunkSize = parseInt(chunkSizeInput.value);
    let options = {
        chunkSentence: chunkSentenceInput.checked,
        skipStopwords: skipStopwordsInput.checked
    };
    const chunkData = splitTextToChunks(text, chunkSize, options);
    chunks = chunkData.chunks;
    sentences = chunkData.sentences;
    currentIndex = 0;
    inputPage.classList.add('hidden');
    readerPage.classList.remove('hidden');
    updateBoxStyle();
    showChunk(0);
    pause();
};

importUrlBtn.onclick = () => {
    const url = importUrl.value.trim();
    if (url) importFromUrl(url);
    else alert('Please enter a valid URL.');
};

importGithubBtn.onclick = () => {
    const token = githubTokenInput.value.trim();
    const path = githubPathInput.value.trim();
    if (token && path) {
        sessionStorage.setItem('githubToken', token);
        githubConsentGiven = false;
        consentModal.classList.add('active');
    } else {
        alert('Please enter both a GitHub token and repository path.');
    }
};

acceptConsentBtn.onclick = () => {
    githubConsentGiven = true;
    consentModal.classList.remove('active');
    importFromGithub(sessionStorage.getItem('githubToken'), githubPathInput.value.trim());
};

declineConsentBtn.onclick = () => {
    githubConsentGiven = false;
    sessionStorage.removeItem('githubToken');
    githubTokenInput.value = '';
    consentModal.classList.remove('active');
};

closeConsent.onclick = () => {
    declineConsentBtn.click();
};

consentModal.onclick = (e) => {
    if (e.target === consentModal) {
        closeConsent.click();
    }
};

fileUploadInput.onchange = () => {
    const file = fileUploadInput.files[0];
    if (file) importFromFile(file);
};

playBtn.onclick = play;
pauseBtn.onclick = pause;
restartBtn.onclick = restart;
backBtn.onclick = () => skip(-10);
forwardBtn.onclick = () => skip(10);

fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
};

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        speedreaderBox.classList.remove('fullscreen');
    }
});

settingsBtn.onclick = () => {
    console.log('Settings button clicked');
    settingsModal.classList.add('active');
};

closeSettings.onclick = () => {
    console.log('Close settings button clicked');
    settingsModal.classList.remove('active');
};

settingsModal.onclick = (e) => {
    if (e.target === settingsModal) {
        console.log('Modal background clicked');
        settingsModal.classList.remove('active');
    }
};

submitAnswer.onclick = () => {
    console.log('Submit answer clicked');
    const answer = comprehensionAnswer.value.trim();
    comprehensionStats.total++;
    if (answer) comprehensionStats.correct++;
    localStorage.setItem('comprehensionStats', JSON.stringify(comprehensionStats));
    comprehensionModal.classList.remove('active');
    comprehensionAnswer.value = '';
    play();
};

closeComprehension.onclick = () => {
    console.log('Close comprehension clicked');
    comprehensionStats.total++;
    localStorage.setItem('comprehensionStats', JSON.stringify(comprehensionStats));
    comprehensionModal.classList.remove('active');
    comprehensionAnswer.value = '';
    play();
};

comprehensionModal.onclick = (e) => {
    if (e.target === comprehensionModal) {
        console.log('Comprehension modal background clicked');
        closeComprehension.click();
    }
};

advancedBtn.onclick = () => {
    advancedDropdown.classList.toggle('open');
    advancedBtn.innerHTML = advancedDropdown.classList.contains('open') ? 'Advanced ▴' : 'Advanced ▾';
};

[wpmInput, chunkSizeInput, fontSizeInput, fontColorInput, bgColorInput, alignmentInput,
 speedVarInput, chunkSentenceInput, pauseSentenceInput, skipStopwordsInput, aiAdaptiveInput, readingModeInput]
.forEach(el => el.oninput = () => {
    updateBoxStyle();
    pause();
    updateProgress();
});

document.addEventListener('keydown', e => {
    if (readerPage.classList.contains('hidden')) return;
    if (e.code === 'Space') {
        if (playing) pause(); else play();
        e.preventDefault();
    }
    if (e.code === 'ArrowRight') skip(1);
    if (e.code === 'ArrowLeft') skip(-1);
    if (e.key.toLowerCase() === 'r') restart();
    if (e.key.toLowerCase() === 'f') fullscreenBtn.click();
    if (e.key.toLowerCase() === 's') settingsBtn.click();
});
