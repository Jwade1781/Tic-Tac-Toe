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
        BOX_ELEMENT.appendChild(INNER_TEXT);

        BOX_ELEMENT.classList.add("boxElement");
        BOX_ELEMENT.addEventListener("click", () => { 
            console.log(`Box clicked by : ${gameController.getPlayerTurn().getHuman()}\t${gameController.getPlayerTurn().getMoveChar()}`)
            if (INNER_TEXT.childNodes.length === 0){
                INNER_TEXT.textContent = gameController.getPlayerTurn().getMoveChar();
                gameController.changeTurn();
            }
            console.log(`Set tile to : ${gameController.getPlayerTurn().getMoveChar()}`)
            
        });
        return BOX_ELEMENT;
    }

    // Add all boxes into the grid
    for (let i = 0; i < TOTAL_GRIDS; i++) {
        BOARD_DIV.appendChild(boxCreate());
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

    getPlayerTurn = () => {return this.playerTurn}
    toggleDisplay = () => { this.ticTacToe.toggleDisplay(); }
    makeTurn = () => {}
    startGame = () => {
        this.ANNOUNCEMENT_HEADER.textContent = "Player 1's Turn";
        this.playerTurn = this.players.getPlayer1();
        this.toggleDisplay();
    }
    
    changeTurn = () => { 
        
        if (this.playerTurn === this.players.getPlayer1()) {
            this.playerTurn = this.players.getPlayer2();
            this.ANNOUNCEMENT_HEADER.textContent = "Player 2's Turn";
        }

        else {
            this.playerTurn = this.players.getPlayer1(); 
            this.ANNOUNCEMENT_HEADER.textContent = "Player 1's Turn";
        }
    }
}

function main() {
    gameController = new GameController();

    if (DEBUG_PLAY) {
        gameController.setPlayer(1, new player(true, "x"));
        gameController.setPlayer(2, new player(false, "o"));
        gameController.toggleDisplay();
    }
}





document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        main();
    }
})