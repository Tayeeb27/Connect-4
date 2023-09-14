const readline = require('readline');
const c = require('ansi-colors')

const rows = 6;
const columns = 7;
const players = ['Player 1', 'Player 2'];
let currentPlayer = 0;

// Creates an empty game board
const board = Array.from({ length: rows }, () => Array(columns).fill(' '));

// Function to display the game board
const displayBoard = () => {
  console.clear();
  for (let row of board) {
    console.log(c.blue(`|${row.join('|')}|`));
  }
  console.log(' 1 2 3 4 5 6 7');
}

// Function to check if a column is full
const isColumnFull = (col) => {
  return board[0][col] !== ' ';
}

// Function to place a piece in a column
const placePiece = (col) => {
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][col] === ' ') {
      board[row][col] = currentPlayer === 0 ? c.red('X') : c.yellow('O');
      return row;
    }
  }
  return -1; // Column is full
}

// Function to check for a win
const checkForWin = (row, col) => {
  const directions = [
    [1, 0], [0, 1], [1, 1], [-1, 1] // Checks for Vertical, Horizontal, Diagonal Up, Diagonal Down
  ];

  for (let dir of directions) {
    const [dx, dy] = dir;
    let count = 1;

    // Check in both directions
    for (let i = 1; i <= 3; i++) {
      const newRow1 = row + dx * i;
      const newCol1 = col + dy * i;
      const newRow2 = row - dx * i;
      const newCol2 = col - dy * i;

      if (
        (newRow1 >= 0 && newRow1 < rows && newCol1 >= 0 && newCol1 < columns && board[newRow1][newCol1] === board[row][col]) ||
        (newRow2 >= 0 && newRow2 < rows && newCol2 >= 0 && newCol2 < columns && board[newRow2][newCol2] === board[row][col])
      ) {
        count++;
        if (count === 4) {
          return true; // We have a winner!
        }
      } else {
        break; // No need to check further in this direction
      }
    }
  }

  return false;
}

// Function to check for a draw
const checkForDraw = () => {
  return board.every(row => row.every(cell => cell !== ' '));
}

// Initialize the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to start the game
const startGame = () => {
  rl.question('Choose a game mode:\n1. Play against another player\n2. Play against the computer\nEnter 1 or 2: ', (answer) => {
    if (answer === '1') {
      console.log('You are playing against another player.\n');
      players[0] = 'Player 1';
      players[1] = 'Player 2';
    } else if (answer === '2') {
      console.log('You are playing against the computer.\n');
      players[0] = 'Player';
      players[1] = 'Computer';
    } else {
      console.log('Invalid choice. Please enter 1 or 2.');
      startGame();
      return;
    }

    displayBoard();
    takeTurn();
  });
}

// Function to generate a random computer move
const generateComputerMove = () => {
  const availableColumns = [];
  for (let col = 0; col < columns; col++) {
    if (!isColumnFull(col)) {
      availableColumns.push(col);
    }
  }

  const randomIndex = Math.floor(Math.random() * availableColumns.length);
  return availableColumns[randomIndex];
}

// Function to handle player input or computer move
const takeTurn = () => {
  if (currentPlayer === 0) {
    // Human player's turn
    rl.question(`${players[currentPlayer]}, enter your move (column 1-7): `, (answer) => {
      const col = parseInt(answer) - 1;

      if (col >= 0 && col < columns && !isColumnFull(col)) {
        const row = placePiece(col);
        displayBoard();

        if (checkForWin(row, col)) {
          console.log(`${players[currentPlayer]} wins!`);
          rl.close();
        } else if (checkForDraw()) {
          console.log("It's a draw!");
          rl.close();
        } else {
          currentPlayer = 1 - currentPlayer;
          takeTurn();
        }
      } else {
        console.log('Invalid move. Please try again.');
        takeTurn();
      }
    });
  } else if (players[currentPlayer] === 'Computer') {
    // Computer player's turn
    setTimeout(() => {
      const col = generateComputerMove();
      const row = placePiece(col);
      displayBoard();

      if (checkForWin(row, col)) {
        console.log(`${players[currentPlayer]} wins!`);
        rl.close();
      } else if (checkForDraw()) {
        console.log("It's a draw!");
        rl.close();
      } else {
        currentPlayer = 1 - currentPlayer;
        takeTurn();
      }
    }, 1000); // Add a delay time
  } else {
    // player 2's turn
    rl.question(`${players[currentPlayer]}, enter your move (column 1-7): `, (answer) => {
      const col = parseInt(answer) - 1;

      if (col >= 0 && col < columns && !isColumnFull(col)) {
        const row = placePiece(col);
        displayBoard();

        if (checkForWin(row, col)) {
          console.log(`${players[currentPlayer]} wins!`);
          rl.close();
        } else if (checkForDraw()) {
          console.log("It's a draw!");
          rl.close();
        } else {
          currentPlayer = 1 - currentPlayer;
          takeTurn();
        }
      } else {
        console.log('Invalid move. Please try again.');
        takeTurn();
      }
    });
  }
}

// Start the game 
startGame();
