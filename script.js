// DOM Elements
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartButton = document.getElementById('restart');
const resultElement = document.getElementById('result');
const resultsContainer = document.getElementById('results-container');
const finalWpmElement = document.getElementById('final-wpm');
const finalAccuracyElement = document.getElementById('final-accuracy');
const chartContainer = document.getElementById('chart-container');
const testTypeElement = document.getElementById('test-type');
const rawWpmElement = document.getElementById('raw-wpm');
const rawCpmElement = document.getElementById('raw-cpm');
const charCountElement = document.getElementById('char-count');
const consistencyElement = document.getElementById('consistency');
const timeTakenElement = document.getElementById('time-taken');
const virtualKeyboard = document.getElementById('virtual-keyboard');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');

// Game variables
let words = [];
let wordIndex = 0;
let letterIndex = 0;
let startTime;
let timerInterval;
let isGameActive = false;
let correctWords = 0;
let incorrectWords = 0;
let totalKeystrokes = 0;
let correctKeystrokes = 0;
let timeLimit = 60; // Default time in seconds
let wpmHistory = []; // Track WPM over time
let wpmValues = []; // Store all WPM values for consistency calculation
let incorrectChars = 0;
let correctChars = 0;

// Common English words for the typing test
const commonWords = [
    'school', 'back', 'such', 'number', 'open', 'both', 'man', 'old', 'without', 'must', 'know', 'because', 'down', 'keep',
    'play', 'first', 'present', 'one', 'with', 'plan', 'off', 'real', 'might', 'feel', 'course', 'all', 'old', 'move', 'who',
    'here', 'do', 'only', 'order', 'before', 'set', 'tell', 'begin', 'only', 'run', 'find', 'say', 'no', 'into', 'find', 'year',
    'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they', 'say', 'she', 'will',
    'one', 'all', 'would', 'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make', 'can', 'like',
    'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
    'our', 'work', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

// Keyboard layout (Monkeytype style)
const keyboardLayout = [
  [
    { key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }, { key: '5' }, { key: '6' }, { key: '7' }, { key: '8' }, { key: '9' }, { key: '0' }, { key: '-' }, { key: '=' }
  ],
  [
    { key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' }, { key: 't' }, { key: 'y' }, { key: 'u' }, { key: 'i' }, { key: 'o' }, { key: 'p' }, { key: '[' }, { key: ']' }
  ],
  [
    { key: 'a' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' }, { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }, { key: ';' }, { key: '\'' }
  ],
  [
    { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' }, { key: 'n' }, { key: 'm' }, { key: ',' }, { key: '.' }, { key: '/' }
  ],
  [
    { key: 'default', label: 'default', class: 'default-key' }
  ]
];

// Initialize the game
function initGame() {
    // Generate random words
    generateWords(100); // Generate 100 random words
    
    // Reset game variables
    wordIndex = 0;
    letterIndex = 0;
    correctWords = 0;
    incorrectWords = 0;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    incorrectChars = 0;
    correctChars = 0;
    wpmHistory = [];
    wpmValues = [];
    
    // Reset timer
    timerElement.textContent = timeLimit;
    
    // Reset WPM and accuracy
    wpmElement.textContent = '0 WPM';
    accuracyElement.textContent = '100%';
    
    // Clear result
    resultElement.textContent = '';
    
    // Hide results container
    resultsContainer.classList.remove('show');
    
    // Display words
    displayWords();
    
    // Focus on input field
    inputField.value = '';
    inputField.focus();
    
    // Set game as inactive until user starts typing
    isGameActive = false;
}

// Generate random words for the typing test
function generateWords(count) {
    words = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * commonWords.length);
        words.push(commonWords[randomIndex]);
    }
}

// Display words in the text display
function displayWords() {
    textDisplay.innerHTML = '';
    
    words.forEach((word, index) => {
        const wordElement = document.createElement('span');
        wordElement.classList.add('word');
        if (index === wordIndex) {
            wordElement.classList.add('current-word');
        }
        
        // Split word into letters
        for (let i = 0; i < word.length; i++) {
            const letterElement = document.createElement('span');
            letterElement.classList.add('letter');
            
            // Add correct/incorrect classes for the current word
            if (index === wordIndex) {
                if (i < letterIndex) {
                    const typedValue = inputField.value.trim();
                    if (i < typedValue.length) {
                        if (typedValue[i] === word[i]) {
                            letterElement.classList.add('correct-letter');
                        } else {
                            letterElement.classList.add('incorrect-letter');
                        }
                    }
                } else if (i === letterIndex && letterIndex < word.length) {
                    // Add current-letter class to the current letter position
                    letterElement.classList.add('current-letter');
                }
            }
            
            letterElement.textContent = word[i];
            wordElement.appendChild(letterElement);
        }
        
        // Add cursor after the last letter when the word is completed
        if (index === wordIndex && letterIndex === word.length) {
            const cursorElement = document.createElement('span');
            cursorElement.classList.add('letter', 'current-letter');
            cursorElement.innerHTML = '&nbsp;'; // Add a space character
            wordElement.appendChild(cursorElement);
        }
        
        textDisplay.appendChild(wordElement);
    });
}

// Start the timer
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        const remainingTime = timeLimit - elapsedTime;
        
        if (remainingTime <= 0) {
            endGame();
        } else {
            timerElement.textContent = remainingTime;
            updateWPM(elapsedTime);
        }
    }, 1000);
}

// Update WPM (Words Per Minute)
function updateWPM(elapsedTime) {
    if (elapsedTime === 0) return;
    
    // Calculate WPM: (correct keystrokes / 5) / time in minutes
    // We divide by 5 as the average word length is considered to be 5 characters
    const minutes = elapsedTime / 60;
    const wpm = Math.round((correctKeystrokes / 5) / minutes);
    
    wpmElement.textContent = `${wpm} WPM`;
    
    // Update accuracy
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
    accuracyElement.textContent = `${accuracy}%`;
    
    // Record WPM for the chart (every second)
    if (elapsedTime % 1 === 0) {
        wpmHistory.push({ x: elapsedTime, y: wpm });
        wpmValues.push(wpm);
    }
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    
    // Calculate final WPM
    const elapsedTime = Math.floor((new Date() - startTime) / 1000);
    const minutes = elapsedTime / 60;
    const wpm = Math.round((correctKeystrokes / 5) / minutes);
    
    // Calculate accuracy
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
    
    // Display simple result
    resultElement.textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
    
    // Disable input field
    inputField.blur();
    
    // Show detailed results
    showResults(wpm, accuracy, elapsedTime);
}

// Handle input
inputField.addEventListener('input', (e) => {
    if (!isGameActive) {
        isGameActive = true;
        startTimer();
    }
    
    const currentWord = words[wordIndex];
    const typedValue = e.target.value;
    
    // Update total keystrokes
    totalKeystrokes++;
    
    // Check if the user pressed space and the typed value matches the current word
    if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // Word completed correctly
        correctWords++;
        correctKeystrokes += currentWord.length + 1; // +1 for space
        correctChars += currentWord.length;
        
        // Move to next word
        wordIndex++;
        letterIndex = 0;
        
        // Keep any characters after the space instead of clearing the input
        const remainingChars = typedValue.substring(typedValue.indexOf(' ') + 1);
        e.target.value = remainingChars;
        
        // Update display
        displayWords();
        
        // Scroll if necessary
        if (wordIndex > 0 && wordIndex % 10 === 0) {
            textDisplay.scrollTop += 40;
        }
    } else {
        // Word is being typed
        const trimmedValue = typedValue.trim();
        
        // Check if the user is typing the current word (not pressing space yet)
        if (trimmedValue.length <= currentWord.length) {
            let isCorrect = true;
            
            for (let i = 0; i < trimmedValue.length; i++) {
                if (trimmedValue[i] !== currentWord[i]) {
                    isCorrect = false;
                    incorrectChars++;
                    break;
                }
            }
            
            if (isCorrect) {
                correctKeystrokes++;
                correctChars++;
            }
            
            // Update letter index
            letterIndex = trimmedValue.length;
            
            // Update display to show correct/incorrect letters
            displayWords();
        }
    }
});

// Handle restart button
restartButton.addEventListener('click', () => {
    if (isGameActive) {
        clearInterval(timerInterval);
    }
    initGame();
});

// Handle time buttons
document.getElementById('time-15').addEventListener('click', () => {
    timeLimit = 15;
    updateActiveTimeButton('time-15');
    timerElement.textContent = timeLimit;
    generateWords(100 + Math.floor(Math.random() * 100)); // Ensure new random words
    if (isGameActive) {
        clearInterval(timerInterval);
    }
    initGame();
});

document.getElementById('time-30').addEventListener('click', () => {
    timeLimit = 30;
    updateActiveTimeButton('time-30');
    timerElement.textContent = timeLimit;
    generateWords(100 + Math.floor(Math.random() * 100)); // Ensure new random words
    if (isGameActive) {
        clearInterval(timerInterval);
    }
    initGame();
});

document.getElementById('time-60').addEventListener('click', () => {
    timeLimit = 60;
    updateActiveTimeButton('time-60');
    timerElement.textContent = timeLimit;
    generateWords(100 + Math.floor(Math.random() * 100)); // Ensure new random words
    if (isGameActive) {
        clearInterval(timerInterval);
    }
    initGame();
});

document.getElementById('time-120').addEventListener('click', () => {
    timeLimit = 120;
    updateActiveTimeButton('time-120');
    timerElement.textContent = timeLimit;
    generateWords(100 + Math.floor(Math.random() * 100)); // Ensure new random words
    if (isGameActive) {
        clearInterval(timerInterval);
    }
    initGame();
});

// Function to update active time button
function updateActiveTimeButton(activeButtonId) {
    // Remove active class from all time buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to the clicked button
    document.getElementById(activeButtonId).classList.add('active');
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);

// Ensure input field is focused when clicking anywhere in the text display
textDisplay.addEventListener('click', () => {
    inputField.focus();
});

// Prevent default behavior for some keys
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        restartButton.click();
    }
});

// Show detailed results
function showResults(wpm, accuracy, elapsedTime) {
    // Set main stats
    finalWpmElement.textContent = wpm;
    finalAccuracyElement.textContent = `${accuracy}%`;
    
    // Set test type
    testTypeElement.textContent = 'words';
    
    // Calculate raw WPM (all keystrokes)
    const rawWpm = Math.round((totalKeystrokes / 5) / (elapsedTime / 60));
    rawWpmElement.textContent = `${rawWpm} wpm`;
    
    // Calculate CPM (Characters Per Minute)
    const cpm = Math.round(totalKeystrokes / (elapsedTime / 60));
    rawCpmElement.textContent = cpm;
    
    // Character count (correct/incorrect/total)
    charCountElement.textContent = `${correctChars}/${incorrectChars}/${correctChars + incorrectChars}`;
    
    // Calculate consistency
    let consistency = 100;
    if (wpmValues.length > 0) {
        const avgWpm = wpmValues.reduce((sum, val) => sum + val, 0) / wpmValues.length;
        const squaredDiffs = wpmValues.map(val => Math.pow(val - avgWpm, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / wpmValues.length;
        const stdDev = Math.sqrt(variance);
        consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / avgWpm) * 100)));
    }
    consistencyElement.textContent = `${consistency}%`;
    
    // Format time taken
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timeTakenElement.textContent = minutes > 0 ? 
        `${minutes}:${seconds.toString().padStart(2, '0')}` : 
        `${seconds}s`;
    
    // Create chart
    if (wpmHistory.length > 0) {
        // Ensure we have at least two data points for the chart
        if (wpmHistory.length === 1) {
            wpmHistory.push({x: elapsedTime, y: wpmHistory[0].y});
        }
        
        // Initialize chart
        chartContainer.innerHTML = '';
        const chart = new SimpleChart(chartContainer, {
            height: 150,
            lineColor: '#4dd0e1',
            animate: true
        });
        
        // Set chart data
        chart.setData(wpmHistory);
    }
    
    // Show results container
    resultsContainer.classList.add('show');
}

function renderVirtualKeyboard() {
  virtualKeyboard.innerHTML = '';
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(k => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'keyboard-key' + (k.class ? ' ' + k.class : '');
      keyDiv.dataset.key = k.key;
      keyDiv.textContent = k.label || k.key;
      rowDiv.appendChild(keyDiv);
    });
    virtualKeyboard.appendChild(rowDiv);
  });
}

function setKeyActive(key, active) {
  // Handle both lower and upper case
  const keyEls = Array.from(document.querySelectorAll('.keyboard-key'));
  keyEls.forEach(el => {
    if (
      el.dataset.key === key.toLowerCase() ||
      el.dataset.key === key.toUpperCase() ||
      (key === ' ' && el.dataset.key === 'default')
    ) {
      if (active) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
}

// Keyboard event listeners
window.addEventListener('keydown', e => {
  setKeyActive(e.key, true);
});
window.addEventListener('keyup', e => {
  setKeyActive(e.key, false);
});

// Settings modal logic
settingsBtn.addEventListener('click', () => {
  settingsModal.classList.add('show');
});
closeSettings.addEventListener('click', () => {
  settingsModal.classList.remove('show');
});
window.addEventListener('click', e => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('show');
  }
});

// Render keyboard on load
window.addEventListener('DOMContentLoaded', renderVirtualKeyboard);