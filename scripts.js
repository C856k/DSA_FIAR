"use strict";
// Model
const ROWS = 6;
const COLS = 7;
const model = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0));

function writeToCell(row, col, value) {
    model[row][col] = value;
}

function readFromCell(row, col) {
    return model[row][col];
}

function isColumnAvailable(col) {
    return readFromCell(0, col) === 0;
}

// View
function displayBoard() {
    const board = document.querySelector("#board");
    board.innerHTML = "";

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
        }
    }
}

function updateView() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = readFromCell(row, col);

        switch (value) {
            case 0:
                cell.textContent = " ";
                break;
            case 1:
                cell.textContent = "X";
                break;
            case 2:
                cell.textContent = "O";
                break;
        }
    });
}

// Event listener for clicking on columns
function makeBoardClickable() {
    document.querySelector("#board").addEventListener("click", boardClicked);
}

function boardClicked(event) {
    const cell = event.target;
    const col = cell.dataset.col;

    console.log(`Clicked on column: ${col}`);
    selectCell(col);
}

// Controller
let currentPlayer = 1;

function startGame() {
    console.log("Game started");
    makeBoardClickable();
    displayBoard();
}

function selectCell(col) {
    const row = findAvailableRow(col);

    if (row !== -1) {
        writeToCell(row, col, currentPlayer);
        updateView();

        if (checkWinner(row, col, currentPlayer)) {
            console.log(`Player ${currentPlayer} wins!`);
            resetGame();
        } else if (isBoardFull()) {
            console.log("It's a draw!");
            resetGame();
        } else {
            currentPlayer = 3 - currentPlayer; // Switch player (1 to 2, 2 to 1)
            if (currentPlayer === 2) {
                setTimeout(() => {
                    machineMove();
                }, 500);
            }
        }
    }
}

function machineMove() {
    let col;
    do {
        col = Math.floor(Math.random() * COLS);
    } while (!isColumnAvailable(col));

    selectCell(col);
}

function resetGame() {
    console.log("Game reset");
    model.forEach(row => row.fill(0));
    currentPlayer = 1;
    displayBoard();
}

// Additional helper functions
function findAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (readFromCell(row, col) === 0) {
            return row;
        }
    }
    return -1; // Column is full
}

function isBoardFull() {
    return model.every(row => row.every(cell => cell !== 0));
}

// Check for a winner
function checkWinner(row, col, player) {
    return (
        checkVertical(row, col, player) ||
        checkHorizontal(row, col, player) ||
        checkDiagonalUpRight(row, col, player) ||
        checkDiagonalUpLeft(row, col, player)
    );
}

function checkVertical(row, col, player) {
    let count = 0;
    for (let r = 0; r < ROWS; r++) {
        if (readFromCell(r, col) === player) {
            count++;
            if (count === 4) {
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

function checkHorizontal(row, col, player) {
    let count = 0;
    for (let c = 0; c < COLS; c++) {
        if (readFromCell(row, c) === player) {
            count++;
            if (count === 4) {
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

function checkDiagonalUpRight(row, col, player) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = row + i;
        const c = col + i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            if (readFromCell(r, c) === player) {
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }
    return false;
}

function checkDiagonalUpLeft(row, col, player) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = row + i;
        const c = col - i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            if (readFromCell(r, c) === player) {
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }
    return false;
}

