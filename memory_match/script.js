const symbols = ['🍎', '🍌', '🍓', '🍇', '🍒', '🍉', '🥝', '🍑'];
let cards = [...symbols, ...symbols];
cards = shuffle(cards);

const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = highScore;

cards.forEach(symbol => {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <div class="front">${symbol}</div>
    <div class="back"></div>
  `;

  card.addEventListener('click', () => flipCard(card));
  game.appendChild(card);
});

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.querySelector('.front').textContent === secondCard.querySelector('.front').textContent;
  if (isMatch) {
    disableCards();
    updateScore();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', () => flipCard(firstCard));
  secondCard.removeEventListener('click', () => flipCard(secondCard));
  resetBoard();
  matchedPairs++;
  if (matchedPairs === symbols.length) {
    setTimeout(() => alert('Game Over!'), 300);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateScore() {
  score += 10;
  scoreDisplay.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
    localStorage.setItem('highScore', highScore);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
