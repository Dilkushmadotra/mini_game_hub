const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');
const difficultySelect = document.getElementById('difficulty');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'pvp'; // Default to Player vs Player
let aiDifficulty = 'easy'; // Default AI difficulty

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6]  // diagonals
];

// Set game mode and AI difficulty
modeSelect.addEventListener('change', () => {
  gameMode = modeSelect.value;
  resetGame();
});

difficultySelect.addEventListener('change', () => {
  aiDifficulty = difficultySelect.value;
  resetGame();
});

// Handle cell click
function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');

  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a Tie!";
    gameActive = false;
    return;
  }

  // Change turns
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (gameMode === 'pvc' && currentPlayer === 'O') {
    aiMove();
  }
}

// Check for winner
function checkWin() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      highlightWinningCells(combo);
      return true;
    }
  }
  return false;
}

// Highlight winning cells
function highlightWinningCells(combo) {
  combo.forEach(i => {
    cells[i].classList.add('winning');
  });
}

// AI Move based on difficulty
function aiMove() {
  let bestMove;

  if (aiDifficulty === 'easy') {
    bestMove = easyAI();
  } else if (aiDifficulty === 'medium') {
    bestMove = mediumAI();
  } else if (aiDifficulty === 'hard') {
    bestMove = hardAI();
  }

  // Make the AI move
  board[bestMove] = 'O';
  cells[bestMove].textContent = 'O';

  if (checkWin()) {
    statusText.textContent = `Player O Wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a Tie!";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Player X's Turn`;
}

// Easy AI: Random move
function easyAI() {
  const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium AI: Block winning move or random move
function mediumAI() {
  const blockMove = findBlockingMove('X');
  if (blockMove !== null) return blockMove;
  return easyAI();
}

// Hard AI: Minimax algorithm
function hardAI() {
  return minimax(board, 'O').index;
}

// Minimax algorithm
function minimax(board, player) {
  const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
  if (checkWin()) return { score: -10 };
  if (board.every(cell => cell !== '')) return { score: 0 };

  let moves = [];
  availableMoves.forEach(move => {
    const newBoard = board.slice();
    newBoard[move] = player;
    const score = minimax(newBoard, player === 'O' ? 'X' : 'O').score;
    moves.push({ index: move, score });
  });

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    moves.forEach(move => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(move => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}

// Find blocking move to prevent the player from winning
function findBlockingMove(player) {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    const line = [board[a], board[b], board[c]];
    const emptyIndex = line.indexOf('') !== -1 ? line.indexOf('') : -1;

    if (line.filter(cell => cell === player).length === 2 && emptyIndex !== -1) {
      const index = combo[emptyIndex];
      if (board[index] === '') return index;
    }
  }
  return null;
}

// Reset the game
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player X's Turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning');
  });

  if (gameMode === 'pvc' && currentPlayer === 'O') {
    aiMove();
  }
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
