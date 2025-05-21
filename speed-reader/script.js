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
skipStopwordsInput.checked = false;

let words = [];
let chunks = [];
let currentIndex = 0;
let timer = null;
let playing = false;

function splitTextToChunks(text, chunkSize, options = {}) {
    let rawWords = text.replace(/\s+/g, ' ').trim().split(' ');
    if (options.skipStopwords) {
        rawWords = rawWords.filter(w => !STOPWORDS.has(w.toLowerCase()));
    }
    let result = [];
    let chunk = [];
    for (let i = 0; i < rawWords.length; i++) {
        chunk.push(rawWords[i]);
        let endOfSentence = /[.!?]$/.test(rawWords[i]);
        let endOfParagraph = /\n$/.test(rawWords[i]);
        if (
            chunk.length >= chunkSize ||
            (options.chunkSentence && (endOfSentence || endOfParagraph))
        ) {
            result.push(chunk.join(' '));
            chunk = [];
        }
    }
    if (chunk.length > 0) result.push(chunk.join(' '));
    return result;
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
    return base;
}

function updateBoxStyle() {
    speedreaderBox.style.setProperty('--fontsize', fontSizeInput.value + 'px');
    speedreaderBox.style.setProperty('--color', fontColorInput.value);
    speedreaderBox.style.setProperty('--bg', bgColorInput.value);
    speedreaderBox.style.setProperty('--align', alignmentInput.value);
}

function showChunk(idx) {
    speedreaderBox.textContent = chunks[idx] || '';
    currentIndex = idx;
    updateProgress();
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
    chunks = splitTextToChunks(text, chunkSize, options);
    currentIndex = 0;
    inputPage.classList.add('hidden');
    readerPage.classList.remove('hidden');
    updateBoxStyle();
    showChunk(0);
    pause();
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
    settingsModal.classList.add('active');
};
closeSettings.onclick = () => {
    settingsModal.classList.remove('active');
};
settingsModal.onclick = (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('active');
};

advancedBtn.onclick = () => {
    advancedDropdown.classList.toggle('open');
    advancedBtn.innerHTML = advancedDropdown.classList.contains('open') ? 'Advanced &#9652;' : 'Advanced &#9662;';
};

[wpmInput, chunkSizeInput, fontSizeInput, fontColorInput, bgColorInput, alignmentInput,
 speedVarInput, chunkSentenceInput, pauseSentenceInput, skipStopwordsInput]
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
