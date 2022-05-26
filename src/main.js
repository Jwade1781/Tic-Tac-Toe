const DEBUG_PLAY = true;
let gameController;

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
            //console.log(`Box clicked by : ${gameController.getPlayerTurn().getHuman()}\t${gameController.getPlayerTurn().getMoveChar()}`)
            if (INNER_TEXT.childNodes.length === 0) {
                INNER_TEXT.textContent = gameController.getPlayerTurn().getMoveChar();
                //console.log(`Set tile on box ${boxNum} : ${gameController.getPlayerTurn().getMoveChar()}`)
                gameController.getPlayerTurn().setMove(boxNum);
                gameController.changeTurn();
            }
        });
        return BOX_ELEMENT;
    }

    // Add all boxes into the grid
    for (let i = 0; i < TOTAL_GRIDS; i++) {
        BOARD_DIV.appendChild(boxCreate(i));
    }

    return BOARD_DIV;
})();

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
            document.querySelector("#startingDiv").parentElement.style.display = "none"
        }

        else {
            this.GAME_DIV.style.display = "none";
            document.querySelector("#startingDiv").parentElement.style.display = "flex";
        }
    }
}

class player {
    constructor(human, moveChar) {
        this.human = human;
        this.moveChar = moveChar;
        this.moves = [];
    }

    setMoveChar(moveChar) { this.moveChar = moveChar; }
    setHuman(human) { this.human = human; }
    setMove(move){this.moves.push(move);}

    getMoveChar() { return this.moveChar; }
    getHuman() { return this.human; }
    getMoves(){return this.moves;}
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
    printPlayers() { console.log(`Player 1 -- Human : ${this.player1.getHuman()} -- Char : ${this.player1.getMoveChar()}\nPlayer 2 -- Human : ${this.player2.getHuman()} -- Char : ${this.player2.getMoveChar()}`) }
}

class GameController {
    constructor() {
        this.ticTacToe = new TicTacToe();
        this.players = new Players(new player(true, "X"), new player(true, "O")); // Players are human by default for easier debugging
        this.ANNOUNCEMENT_HEADER = document.querySelector(".layer>h2");
    }

    setPlayer = (playerNum, human) => {
        let selectText;
        human ? selectText = "SELECTED HUMAN" : selectText = "SELECTED BOT";
        switch (playerNum) {
            case 1:
                this.players.setPlayer1(new player(human, "X"));
                document.querySelector("#player1Div>h4").textContent = `${selectText}`
                break;

            case 2:
                this.players.setPlayer2(new player(human, "O"));
                document.querySelector("#player2Div>h4").textContent = `${selectText}`
                break;
        }

        console.log(this.players.printPlayers());
    }

    getPlayerTurn = () => { return this.playerTurn }
    toggleDisplay = () => { this.ticTacToe.toggleDisplay(); }
    makeTurn = () => { }
    startGame = () => {
        this.ANNOUNCEMENT_HEADER.textContent = "Player 1's Turn";
        this.playerTurn = this.players.getPlayer1();
        this.toggleDisplay();
    }

    checkWin = () => {
        const BOXES = document.querySelectorAll(".boxElement");
        let currentPlayerMoves = this.playerTurn.getMoves().sort();
        const WIN_CONDITIONS = [
            [0,1,2], [3,4,5], [6.7,8], // Horizontal
            [0,3,6], [1,4,7], [2,5,8], // Vertical
            [0,4,8], [2,4,6]           // Diagnol
        ]

        for (let i = 0; i < currentPlayerMoves.length; i++){
            let currentCheck = [];
            for (let j = 0; j < 3; j++){
                if (currentPlayerMoves[i+j] !== undefined) 
                    currentCheck.push(currentPlayerMoves[i+j]);
            }

            for (let j = 0; j < WIN_CONDITIONS.length; j++){
                const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
                if (equals(currentCheck, WIN_CONDITIONS[j])){
                    console.log("Winner!")
                    return true;
                }
            }
        }
        return false;
    }

    changeTurn = () => {
        if (!(this.checkWin())) {
            if (this.playerTurn === this.players.getPlayer1()) {
                this.playerTurn = this.players.getPlayer2();
                this.ANNOUNCEMENT_HEADER.textContent = "Player 2's Turn";
            }

            else {
                this.playerTurn = this.players.getPlayer1();
                this.ANNOUNCEMENT_HEADER.textContent = "Player 1's Turn";
            }
        }

        else {
            console.log(this.playerTurn.getMoveChar() + " Wins!");
        }
    }


}

function main() {
    gameController = new GameController();

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