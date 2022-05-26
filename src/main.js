const DEBUG_PLAY = false;
let gameController;

const gameBoard = (() => {
    const TOTAL_GRIDS = 9;
    const BOARD_DIV = document.createElement("div");
    BOARD_DIV.id = "gameBoard";

    const boxCreate = () => {
        const INNER_TEXT = document.createElement("h1");
        const BOX_ELEMENT = document.createElement("div");
        INNER_TEXT.classList.add("boxHeader");
        INNER_TEXT.textContent = "X";
        BOX_ELEMENT.appendChild(INNER_TEXT);

        BOX_ELEMENT.classList.add("boxElement");
        BOX_ELEMENT.addEventListener("click", () => { console.log("Box clicked") });
        return BOX_ELEMENT;
    }

    // Add all boxes into the grid
    for (let i = 0; i < TOTAL_GRIDS; i++) {
        BOARD_DIV.appendChild(boxCreate());
    }

    return BOARD_DIV;
})();

class player {
    constructor(human, moveChar) {
        this.human = human;
        this.moveChar = moveChar;
    }

    setMoveChar(moveChar) { this.moveChar = moveChar; }
    setHuman(human) { this.human = human; }
    getMoveChar() { return this.moveChar; }
    getHuman() { return this.human; }
}

class Players {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    getPlayer1() { return this.player1; }
    getPlayer2() { return this.player2; }
    setPlayer1(player1) { this.player1 = player1; }
    setPlayer2(player2) { this.player2 = player2; }
    printPlayers(){console.log(`Player 1 -- Human : ${this.player1.getHuman()} -- Char : ${this.player1.getMoveChar()}\nPlayer 2 -- Human : ${this.player2.getHuman()} -- Char : ${this.player2.getMoveChar()}`)}
}


class TicTacToe {
    constructor() {
        this.GAME_BOARD = gameBoard;
        this.GAME_DIV = document.querySelector("#gameDiv");
        this.GAME_DIV.style.display = "none";
        this.GAME_DIV.appendChild(this.GAME_BOARD);
    }

    setPlayers(players) { this.players = players; }
    getPlayers() { return this.players; }
    toggleDisplay() {
        if (window.getComputedStyle(this.GAME_DIV).display === "none") {
            this.GAME_DIV.style.display = "flex";
            document.querySelector("#startingDiv").style.display = "none"
        }

        else {
            this.GAME_DIV.style.display = "none";
            document.querySelector("#startingDiv").style.display = "flex";
        }
    }
}

class GameController {
    constructor() {
        this.ticTacToe = new TicTacToe();
        this.players = new Players(new player(true, "X"), new player(true, "O")); // Players are human by default for easier debugging
    }

    setPlayer = (playerNum, human) => {
        switch (playerNum) {
            case 1:
                this.players.setPlayer1(new player(human, "X"));
                break;

            case 2:
                this.players.setPlayer2(new player(human, "O"));
                break;
        }

        console.log(this.players.printPlayers());
    }

    toggleDisplay = () => { this.ticTacToe.toggleDisplay(); }
}

function main() {
    gameController = new GameController();

    if (DEBUG_PLAY) {
        Players = new players[new player(true, "x"), new player(false, "o")];
        TicTacToe(Players);
    }
}





document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        main();
    }
})