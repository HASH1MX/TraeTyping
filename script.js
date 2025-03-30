// DOM Elements
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartButton = document.getElementById('restart');
const resultElement = document.getElementById('result');

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
    
    // Reset timer
    timerElement.textContent = timeLimit;
    
    // Reset WPM and accuracy
    wpmElement.textContent = '0 WPM';
    accuracyElement.textContent = '100%';
    
    // Clear result
    resultElement.textContent = '';
    
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
                } else if (i === letterIndex) {
                    // Add current-letter class to the current letter position
                    letterElement.classList.add('current-letter');
                }
            }
            
            letterElement.textContent = word[i];
            wordElement.appendChild(letterElement);
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
    
    // Display result
    resultElement.textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
    
    // Disable input field
    inputField.blur();
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
                    break;
                }
            }
            
            if (isCorrect) {
                correctKeystrokes++;
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
    if (isGameActive) {
        clearInterval(timerInterval);
        initGame();
    }
});

document.getElementById('time-30').addEventListener('click', () => {
    timeLimit = 30;
    updateActiveTimeButton('time-30');
    timerElement.textContent = timeLimit;
    if (isGameActive) {
        clearInterval(timerInterval);
        initGame();
    }
});

document.getElementById('time-60').addEventListener('click', () => {
    timeLimit = 60;
    updateActiveTimeButton('time-60');
    timerElement.textContent = timeLimit;
    if (isGameActive) {
        clearInterval(timerInterval);
        initGame();
    }
});

document.getElementById('time-120').addEventListener('click', () => {
    timeLimit = 120;
    updateActiveTimeButton('time-120');
    timerElement.textContent = timeLimit;
    if (isGameActive) {
        clearInterval(timerInterval);
        initGame();
    }
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