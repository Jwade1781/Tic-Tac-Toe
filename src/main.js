const DEBUG_PLAY = false;
let gameController;
let domController;

const gameBoard = (() => {
    const TOTAL_GRIDS = 9;
    const BOARD_DIV = document.createElement("div");
    BOARD_DIV.id = "gameBoard";

    const boxCreate = (boxNum) => {
        const INNER_TEXT = document.createElement("h1");
        const BOX_ELEMENT = document.createElement("div");
        INNER_TEXT.classList.add("boxHeader");
        BOX_ELEMENT.appendChild(INNER_TEXT);

        BOX_ELEMENT.classList.add("boxElement");
        BOX_ELEMENT.addEventListener("click", () => {
            if (INNER_TEXT.childNodes.length === 0) {
                INNER_TEXT.textContent = gameController.getPlayerTurn().getMoveChar();
                gameController.getPlayerTurn().setMove(boxNum);
                gameController.changeTurn();
            }
        });
        return BOX_ELEMENT;
    }

    // Add all boxes into the grid
    for (let i = 0; i < TOTAL_GRIDS; i++)
        BOARD_DIV.appendChild(boxCreate(i));

    const resetBoard = () => {
        let headers = document.querySelectorAll(".boxHeader");
        for (let i = 0; i < headers.length; i++)
            headers[i].textContent = "";
    }
    return { BOARD_DIV, resetBoard }
})();

class TicTacToe {
    constructor() {
        this.GAME_BOARD = gameBoard.BOARD_DIV;
        this.GAME_DIV = document.querySelector("#gameDiv");
        this.GAME_DIV.style.display = "none";
        this.GAME_DIV.appendChild(this.GAME_BOARD);
    }

    setPlayers(players) { this.players = players; }
    getPlayers() { return this.players; }
    toggleDisplay() {
        if (window.getComputedStyle(this.GAME_DIV).display === "none") {
            this.GAME_DIV.style.display = "flex";
            document.querySelector("#startingDiv").parentElement.style.display = "none"
        }

        else {
            this.GAME_DIV.style.display = "none";
            document.querySelector("#startingDiv").parentElement.style.display = "flex";
        }
    }

    reset() { gameBoard.resetBoard(); }
}

class player {
    constructor(human, moveChar) {
        this.human = human;
        this.moveChar = moveChar;
        this.moves = [];
    }

    setMoveChar(moveChar) { this.moveChar = moveChar; }
    setHuman(human) { this.human = human; }
    setMove(move) { this.moves.push(move); }

    getMoveChar() { return this.moveChar; }
    getHuman() { return this.human; }
    getMoves() { return this.moves; }

    resetMoves() { this.moves = []; }
    botMove() {
        let min = Math.ceil(0);
        let max = Math.floor(9);
        return Math.floor(Math.random() * (max - min) + min);
    }
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
    resetPlayersMoves() {
        this.player1.resetMoves();
        this.player2.resetMoves();
    }

    botMove(player) {
        let picked;
        let validMove = false;
        while (!validMove) {
            picked = player.botMove();
            validMove = !(this.player1.getMoves().includes(picked));
            if (validMove)
                validMove = !(this.player2.getMoves().includes(picked));
        }
        player.setMove(picked);
        document.querySelectorAll(".boxElement")[picked].firstChild.textContent = player.getMoveChar();
        gameController.changeTurn();
    }

    printPlayers() { console.log(`Player 1 -- Human : ${this.player1.getHuman()} -- Char : ${this.player1.getMoveChar()}\nPlayer 2 -- Human : ${this.player2.getHuman()} -- Char : ${this.player2.getMoveChar()}`) }
}

class GameController {
    constructor() {
        this.ticTacToe = new TicTacToe();
        this.players = new Players(new player(true, "X"), new player(true, "O")); // Players are human by default for easier debugging
    }

    setPlayer = (playerNum, human) => {
        let selectText;
        human ? selectText = "SELECTED HUMAN" : selectText = "SELECTED BOT";
        domController.setPLAYER_HEADER(playerNum, selectText);
        playerNum === "player1" ? this.players.setPlayer1(new player(human, "X")) : this.players.setPlayer2(new player(human, "O"));
    }

    getPlayerTurn() { return this.playerTurn }
    startGame() {
        domController.setANNOUNCEMENT_HEADER("Player 1's Turn");
        this.playerTurn = this.players.getPlayer1();
        this.toggleDisplay();
        if (!(this.playerTurn.getHuman())) this.botMove();
    }

    endGame() {
        setTimeout(() => {
            this.ticTacToe.reset();
            this.players.resetPlayersMoves();
            this.ticTacToe.toggleDisplay();
        }, 2500);
    }

    toggleDisplay() { this.ticTacToe.toggleDisplay(); }
    checkWin() {
        let currentPlayerMoves = this.playerTurn.getMoves().sort();
        const WIN_CONDITIONS = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ]

        for (let i = 0; i < WIN_CONDITIONS.length; i++) {
            for (var j = 0; j < WIN_CONDITIONS[i].length; j++) {
                if (!(currentPlayerMoves.includes(WIN_CONDITIONS[i][j])))
                    break;

                if (j + 1 === WIN_CONDITIONS[i].length)
                    return true;
            }
        }
        return false;
    }

    botMove(){
        this.players.botMove(this.playerTurn);
    }

    changeTurn() {
        let totalMovesPlayed = this.players.getPlayer1().getMoves().length + this.players.getPlayer2().getMoves().length;
        const TOTAL_POSSIBLE_MOVES = document.querySelectorAll(".boxElement").length;
        switch (this.checkWin()) {
            case true:
                domController.setANNOUNCEMENT_HEADER(`${this.playerTurn.getMoveChar()} wins!`);
                this.endGame();
                return;

            case false:
                if (totalMovesPlayed < TOTAL_POSSIBLE_MOVES) {
                    if (this.playerTurn === this.players.getPlayer1()) {
                        this.playerTurn = this.players.getPlayer2();
                        domController.setANNOUNCEMENT_HEADER("Player 2's Turn");
                    }

                    else {
                        this.playerTurn = this.players.getPlayer1();
                        domController.setANNOUNCEMENT_HEADER("Player 1's Turn");
                    }

                    if (!this.playerTurn.getHuman())
                        this.botMove();
                }

                else if (totalMovesPlayed === document.querySelectorAll(".boxElement").length) {
                    domController.setANNOUNCEMENT_HEADER("DRAW!");
                    this.endGame();
                }
        }
    }
}

class DomController {
    constructor() {
        this.ANNOUNCEMENT_HEADER = document.querySelector(".layer>h2");
        this.PLAYER_HEADERS = {
            player1: document.querySelector("#player1Div>h4"),
            player2: document.querySelector("#player2Div>h4")
        };
    }

    setANNOUNCEMENT_HEADER(textContent) { this.ANNOUNCEMENT_HEADER.textContent = textContent };
    setPLAYER_HEADER(playerKey, textContent) { this.PLAYER_HEADERS[playerKey].textContent = textContent };
}

function main() {
    gameController = new GameController();
    domController = new DomController();

    if (DEBUG_PLAY) {
        gameController.setPlayer(1, true);
        gameController.setPlayer(2, true);
        gameController.startGame();
    }
}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        main();
    }
})