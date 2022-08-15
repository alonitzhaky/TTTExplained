// Defining all tiles insife of the board
const tiles = document.querySelectorAll(".tile");
// Defining Players (X & O)
const PLAYER_X = "X";
const PLAYER_O = "O";
// Turn Tracker (X will begin the game)
let turn = PLAYER_X;
// Array of all 9 tiles, showing all are functional and will be marked during player's turn.
const boardState = Array(tiles.length);
boardState.fill(null);
// End of game elements ("Game Over and winner declaration.")
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
playAgain.addEventListener("click" , startNewGame)

// Adding an EventListener (purpose = registering marks on the board.)
tiles.forEach(tile => tile.addEventListener("click", tileClick));

// Implemention of Hovering Text, overrides current hovering effects.
function setHoverText() {
    // 1. Remove All Hover Text
    tiles.forEach((tile) => {
        tile.classList.remove("x-hover");
        tile.classList.remove("o-hover");
    });
    // Defining which class will be used based on the turn. 
    const hoverClass = `${turn.toLowerCase()}-hover`;

    // Sets hover *only* if the tile is empty, not when it is selected.
    tiles.forEach((tile) => {
        if (tile.innerText == "") {
            tile.classList.add(hoverClass);
        }
    });

}

setHoverText();

//tileClick's event will show us which tile will be clicked by the user, turn-appropriate.
function tileClick(event) {
    if (gameOverArea.classList.contains("visible")) {
        return;
    }
    // Reference to the HTML buttom that the player has clicked.
    const tile = event.target;
    // Shows which tile was clicked (by number using data-index in HTML; contains id inside of it.)
    const tileNumber = tile.dataset.index;
    // Checks if the tile is taken by an X or an O.
    if (tile.innerText != "") {
        return;
    }
    // Turn Checker
    if (turn === PLAYER_X) { // If this is X's turn, O will be next
        tile.innerText = PLAYER_X;
        boardState[tileNumber - 1] = PLAYER_X; // Arrays start from 0; our HTML tiles begin with an id if *1*.
        turn = PLAYER_O;
    } else { // If this is O's turn, X will be next.
        tile.innerText = PLAYER_O;
        boardState[tileNumber - 1] = PLAYER_O;
        turn = PLAYER_X;
    }

    // Runs at end of function to make it functional.
    setHoverText();
    checkWinner(); // Called upon on every click, in order to determine if a winning combination has been achieved by a player.
}

// This function runs upon completing a combination; presents a winning screen and shows a restart button.
function checkWinner() {
    for (const winningCombination of winningCombinations) {
        // Pulls data from the data structure to check for victory. 
        const { combo, strikeClass } = winningCombination; // Object Destructuring: extracts a combination and a proper row/column/diagonal combo. 

        const tileValue1 = boardState[combo[0] - 1] // Code started with a 1 and JS starts as 0 - this makes the code work properly by beginning count from 0 by subsctracting 1. 
        const tileValue2 = boardState[combo[1] - 1]
        const tileValue3 = boardState[combo[2] - 1]

        // Value Checking to cross for a victory!
        if (tileValue1 != null &&
            tileValue1 === tileValue2 &&
            tileValue1 === tileValue3
        ) {
            strike.classList.add(strikeClass); // Adds a line across the proper combo/
            gameOverScreen(tileValue1) // Initiates the winner screen + restart button.
            return; // Returns a win from a combo instead of a draw, which is incorrect. 
        }
    }
    // Draw Check
    const allTileFilledIn = boardState.every((tile) => tile !== null); // Checks if all tiles are full and no combos written in 107-118) have been achieved.
    if (allTileFilledIn) {
        gameOverScreen(null); // Calls for gameOverScreen to show text = Draw! (line 97). 
    }
}

function gameOverScreen(winnerText) {
    let text = "Draw!"
    if (winnerText != null) { // Automation to seek a draw or a victry.  
        // THEN
        text = `Winner Is ${winnerText}!`; // Shows a winner screen - either X / O in our scenario. 
    }
    gameOverArea.className = "visible"; // Overrides hidden attribute and becomes visible during draw or victory. 
    gameOverText.innerText = text; // Shows proper text in victory / draw.
}

function startNewGame(){ // Play Again Button
    strike.className = "strike";
    gameOverArea.className = "hidden"; // Changes winner sections attribute to hidden.
    boardState.fill(null); // Fills entire board with empty spaces.
    tiles.forEach((tile=>tile.innerText = "")) // Resets all selections on entire board; "" = empty
    turn = PLAYER_X; // X will begin the next game.
    setHoverText();
}


// Data Structure (Winning Combinations)
const winningCombinations = [
    // Rows
    { combo: [1, 2, 3], strikeClass: "strike-row-1" },
    { combo: [4, 5, 6], strikeClass: "strike-row-2" },
    { combo: [7, 8, 9], strikeClass: "strike-row-3" },
    // Columns
    { combo: [1, 4, 7], strikeClass: "strike-column-1" },
    { combo: [2, 5, 8], strikeClass: "strike-column-2" },
    { combo: [3, 6, 9], strikeClass: "strike-column-3" },
    // Diagonals
    { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
    { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
]

