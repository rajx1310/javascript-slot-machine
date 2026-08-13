const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VSLUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount : ");
    const numDepAmount = parseFloat(depositAmount);

    if (isNaN(numDepAmount) || numDepAmount <= 0) {
      console.log("deposit amount is Invalid");
    } else {
      return numDepAmount;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the total bet per line: ");
    const numOfbet = parseFloat(bet);

    if (isNaN(numOfbet) || numOfbet <= 0 || numOfbet > balance / lines) {
      console.log("Invalid bet. Try again");
    } else {
      return numOfbet;
    }
  }
};

const getNumOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3) : ");
    const numOfLines = parseFloat(lines);

    if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines >= 3) {
      console.log("Invalid Number of lines try agai n");
    } else {
      return numOfLines;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [[], [], []];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];

    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transport = (reels) => {
  const rows = [];
  for (let i = 0; i < COLS; i++) {
    rows.push([]);
    for (let j = 0; j < ROWS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";

    for (const [i, symbol] of row.entries()) {
      rowString += symbol;

      if (i !== row.length - 1) {
        rowString += " | ";
      }
    }

    console.log(rowString);
  }
};

const getWinning = (rows, bet, lines) => {
  let win = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      win += bet * SYMBOL_VSLUES[symbols[0]];
    }
  }
  return win;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log(`You have balance of $${balance}`);
    const numOfLines = getNumOfLines();
    const bet = getBet(balance, numOfLines);
    balance -= bet * numOfLines;
    const reels = spin();
    const rows = transport(reels);
    printRows(rows);
    const win = getWinning(rows, bet, numOfLines);
    balance += win;
    console.log("You Won $" + win.toString());

    if (balance <= 0) {
      console.log("You ran out of money");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n) ?");
    if (playAgain != "y") break;
  }
};
game();
