// Game variables
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const gameWords = ['jazz','pizzaz', 'pizza', 'carrot', 'gizelle','tree','bee','truck','dark','cart','fragrance'];
const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

let currentWord = '';
let guessedWord = '';
let wrongGuesses = 0;
let guessedLetters = [];
let gameOver = false;

// Get elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById('restart-button');
const homeButton = document.getElementById('home-button');
const wordDisplay = document.getElementById('word-display');
const alphabetButtons = document.getElementById('alphabet-buttons');
const wrongCount = document.getElementById('wrong-count');
const wrongLetters = document.getElementById('wrong-letters');
const gameMessage = document.getElementById('game-message');

// Functions
function gameStart() {
    wrongGuesses = 0;
    guessedLetters = [];
    gameOver = false;
    
    // Pick random word
    const randomIndex = Math.floor(Math.random() * gameWords.length);
    currentWord = gameWords[randomIndex].toLowerCase();
    
    // Create guessed word with underscores
    guessedWord = '';
    for (let i = 0; i < currentWord.length; i++) {
        guessedWord += '_';
    }
    
    // Reset hangman drawing
    resetHangman();
    
    // Update display
    updateDisplay();
    createAlphabetButtons();
    
    // Clear game message
    gameMessage.innerHTML = '';
}

function resetHangman() {
    // Hide all hangman parts
    for (let i = 0; i < hangmanParts.length; i++) {
        const part = document.getElementById(hangmanParts[i]);
        if (part) {
            part.style.display = 'none';
        }
    }
}

function showHangmanPart(partIndex) {
    if (partIndex < hangmanParts.length) {
        const part = document.getElementById(hangmanParts[partIndex]);
        if (part) {
            part.style.display = 'block';
        }
    }
}

function updateDisplay() {
    // Update word display - show letters above underscores
    let displayWord = '';
    for (let i = 0; i < currentWord.length; i++) {
        if (guessedWord[i] !== '_') {
            displayWord += guessedWord[i].toUpperCase() + ' ';
        } else {
            displayWord += '_ ';
        }
    }
    wordDisplay.textContent = displayWord;
    
    // Update wrong count
    wrongCount.textContent = wrongGuesses;
    
    // Update wrong letters display
    let wrongLettersText = '';
    for (let i = 0; i < guessedLetters.length; i++) {
        if (currentWord.indexOf(guessedLetters[i]) === -1) {
            wrongLettersText += guessedLetters[i].toUpperCase() + ' ';
        }
    }
    wrongLetters.textContent = wrongLettersText;
}

function createAlphabetButtons() {
    alphabetButtons.innerHTML = '';
    
    for (let i = 0; i < alphabet.length; i++) {
        const button = document.createElement('button');
        button.className = 'letter-button';
        
        // Create image element
        const img = document.createElement('img');
        img.src = '/alphabet_images/' + alphabet[i] + '_letter.png';
        img.alt = alphabet[i].toUpperCase();
        img.onerror = function() {
            // If image fails to load, show text instead
            button.innerHTML = alphabet[i].toUpperCase();
            button.style.fontSize = '1.5em';
            button.style.color = 'white';
            button.style.border = '2px solid white';
            button.style.borderRadius = '5px';
            button.style.backgroundColor = 'transparent';
        };
        
        button.appendChild(img);
        button.onclick = function() {
            guessLetter(alphabet[i]);
        };
        alphabetButtons.appendChild(button);
    }
}

function guessLetter(letter) {
    if (gameOver || guessedLetters.indexOf(letter) !== -1) {
        return;
    }
    
    guessedLetters.push(letter);
    
    // Check if letter is in word
    let foundLetter = false;
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            guessedWord = guessedWord.substring(0, i) + letter + guessedWord.substring(i + 1);
            foundLetter = true;
        }
    }
    
    if (!foundLetter) {
        showHangmanPart(wrongGuesses);
        wrongGuesses++;
    }
    
    updateDisplay();
    disableButton(letter);
    checkGameEnd();
}

function disableButton(letter) {
    const buttons = document.querySelectorAll('.letter-button');
    for (let i = 0; i < buttons.length; i++) {
        const img = buttons[i].querySelector('img');
        if (img && img.alt.toLowerCase() === letter) {
            buttons[i].disabled = true;
            buttons[i].classList.add('used');
            break;
        } else if (!img && buttons[i].textContent.toLowerCase() === letter) {
            buttons[i].disabled = true;
            buttons[i].classList.add('used');
            break;
        }
    }
}

function checkGameEnd() {
    // Check if player won
    if (guessedWord === currentWord) {
        gameOver = true;
        gameMessage.innerHTML = '<div class="game-over win">🎉 You Won! 🎉</div>';
        disableAllButtons();
    }
    // Check if player lost
    else if (wrongGuesses >= 6) {
        gameOver = true;
        gameMessage.innerHTML = '<div class="game-over lose">😞 You Lost! The word was: ' + currentWord.toUpperCase() + '</div>';
        disableAllButtons();
    }
}

function disableAllButtons() {
    const buttons = document.querySelectorAll('.letter-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        buttons[i].classList.add('used');
    }
}

// Event listeners
if (playButton) {
    playButton.addEventListener('click', function() {
        window.location.href = 'game.html';
    });
}

if (restartButton) {
    restartButton.addEventListener('click', function() {
        gameStart();
    });
}

if (homeButton) {
    homeButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// Check which page we're on and start game if on game page
if (window.location.pathname.includes('game.html') || gameScreen) {
    // We're on the game page, start the game
    if (gameScreen) {
        gameStart();
    }
}