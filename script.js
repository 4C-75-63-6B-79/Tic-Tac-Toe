/* script.js */

const displayControl = (function(document) {

    // id of the last div that is clicked
    let lastDivId = "";
  
    // get the data-id of the div to add an event listener to each of them to mark them on click
    const boxes = Array.from(document.querySelectorAll('[data-id]'));
    boxes.forEach((box) => box.addEventListener('click', markActiveSymbol));

    // Marks the div which is clicked
    function markActiveSymbol() {
        if(this.textContent == "" && gameControl.getHumanPlayerSymbol() != "") {
            console.log(this.getAttribute('data-id'));
            let currentPlayerSymbol = mainGameContorl.getActivePlayerSymbol();
            this.textContent = currentPlayerSymbol;
            // call the other fucntion which in turn call the reset function which are required on filling of a position in board.
            eventFireAtBoradBoxClick(currentPlayerSymbol, this.getAttribute('data-id'));
            makeComputerPlayerMark();
            // gameBoardLogic.getEmptyDivId();
        } 
    }

    function makeComputerPlayerMark() {
        if(gameControl.getLonelyMode() == false) {
            return;
        }
        let divId = gameBoardLogic.getEmptyDivId(); 
        let div = document.querySelector(`div[data-id="${divId}"]`);
        if(div != null && div.textContent == "")  {
            console.log(div.textContent);
            let currentPlayerSymbol = mainGameContorl.getActivePlayerSymbol();
            div.textContent = currentPlayerSymbol;
            eventFireAtBoradBoxClick(currentPlayerSymbol, divId);
        }
    }

    // calls the necessary fucntions when a position in the box is marked
    function eventFireAtBoradBoxClick(playerSymbol, divId) {
        console.log('necessary events fired');
        setLastDivId(divId);
        gameBoardLogic.populateMainBoard(playerSymbol);
        let winCheck = gameBoardLogic.checkWinner();
        if(gameBoardLogic.checkBoardFilled() == true && winCheck == false) {
            gameControl.setGameOverMsg("Game is tied");
        }
    }

    // Set the last div id to the variable lastDivId
    function setLastDivId(value) {
        lastDivId = value;
    }

    // returns the last div id
    const getLastDivId = function() {
        return lastDivId;
    };

    // clears the game board marks of the players
    const resetDisplay = function() {
        console.log('reset display works');
        boxes.forEach((box) => box.textContent = "");
        setLastDivId("");
    };

    return {
        getLastDivId,
        resetDisplay
    };

})(document);

const gameControl = (function(document) {

    // store the choice of the human player symbol
    let humanPlayerSymbol = "";
    let lonelyMode = false;
    
    // get the buttons used in the game to choose the symbol
    const buttons = Array.from(document.querySelectorAll('#symbol-choice > button'));

    // selecting and adding a event listnere to the restart button 
    document.getElementById("restart").addEventListener("click", reset);

    document.querySelector("input").addEventListener("change", setLonelyMode);

    // adding eventlistener to the control buttons
    buttons.forEach((button) => button.addEventListener('click', setHumanPlayerSymbol));

    // setting the human player symbol according to the textcontent of the button if only the human player symbol is empty
    function setHumanPlayerSymbol() {
        if(displayControl.getLastDivId() == "") {
            humanPlayerSymbol = this.textContent;
            console.log("Symbol choice button was pressed" + humanPlayerSymbol);
            mainGameContorl.initMainGameControl();
            gameBoardLogic.initGameBoardLogic();
        } else {
            console.log('Symbol choice button was pressed but you need to restart the game since already made marks in game.')
        }
    }

    function setLonelyMode() {
        if(displayControl.getLastDivId() == "") {
            if(lonelyMode) {
                lonelyMode = false;
            } else {
                lonelyMode = true;
            }
        } else {
            console.log("Lonely mode can only be change if no move have been made");
            this.checked = lonelyMode;
        }
    }

    const getLonelyMode = function() {
        return lonelyMode;
    }

    const setGameOverMsg = function(message) {
        let div = document.getElementById('game-over');
        if(div.hasChildNodes()) {
            return;
        }
        div.addEventListener("click", reset);
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        p1.textContent = "GAME OVER";
        p2.textContent = message;
        div.appendChild(p1);
        div.appendChild(p2);
        div.style.transform = 'scale(1)';
        div.style.transform = 'translate(-50%, -50%)';
    }

    function resetGameOverMsg() {
        let div = document.getElementById('game-over');
        if(div.hasChildNodes()) {
            div.removeChild(div.firstChild);
            div.removeChild(div.firstChild);
            div.removeEventListener('click', reset);
            div.style.transform = 'scale(0)';
        }
    }

    function reset() {
        console.log('restart button was pressed');
        humanPlayerSymbol = "";
        resetGameOverMsg();
        displayControl.resetDisplay();
        mainGameContorl.resetMainGameControl();
        gameBoardLogic.initGameBoardLogic();
    }

    // return the human player sysmbol
    const getHumanPlayerSymbol = function() {
        return humanPlayerSymbol;
    };

    return {
        getHumanPlayerSymbol,
        getLonelyMode,
        setGameOverMsg
    };

})(document);


const Player = function(name, symbol, playerNumber) {
    const equals = function(player) {
        if(this.name == player.name && this.symbol == player.symbol) {
            return true;
        }
    };
    return {name, symbol, playerNumber, equals};
};

const mainGameContorl = (function() {
    
    let player1, player2, activePlayerSeries;

    let setGamePlayers = function() {
        console.log("set game player works");
        let humanPlayerSymbol = gameControl.getHumanPlayerSymbol();

        // Player 1 is  always going to be the player who chooes his symbol from the buttons
        // Player 2 is going to be the player to whom the left out symbol is assigned
        player1 = Player(humanPlayerSymbol == "X" ? 'cross' : 'zero', humanPlayerSymbol, '1');
        player2 = Player(humanPlayerSymbol == "X" ? 'zero' : 'cross', humanPlayerSymbol == "X" ? 'O' : 'X', '2');
    };

    // The player which has symbol as X will always get first chance.
    let setActivePlayerSeries = (function() {
        console.log("set active player works");
        activePlayerSeries = [];
        if(player1.symbol == "X") {
            activePlayerSeries = [player1, player2, player1, player2, player1, player2, player1, player2, player1];
        } else {
            activePlayerSeries = [player2, player1, player2, player1, player2, player1, player2, player1, player2];
        }
    });

    // returns the player whose chance is next to make a move on the board
    const getActivePlayerSymbol = function() {
        console.log('get active work player works');
        return(activePlayerSeries.pop().symbol);
    };

    const initMainGameControl = function() {
        console.log("Starting the game");
        setGamePlayers();
        setActivePlayerSeries();
    };

    let getWinnerPlayer = function(col, row, diag) {
        let symbol = col != 1 ? col : row != 1 ? row : diag != 1 ? diag : false;

        console.log(symbol);
        if(symbol == player1.symbol) {
            return player1;
        } else {
            return player2;
        }
    }; 

    const resetMainGameControl = function() {
        player1 = undefined;
        player2 = undefined;
        activePlayerSeries = undefined;
        console.log('reset main game control works.');
    };
    
    let printActivePlayerSeries = function() {
        console.log(activePlayerSeries);
    };

    const printPlayer = function() {
        console.log(player1);
        console.log(player2);
    };

    return {
        getActivePlayerSymbol,
        initMainGameControl,
        getActivePlayerSymbol,
        getWinnerPlayer,
        resetMainGameControl,
        printPlayer,
        printActivePlayerSeries,
    };

})();

const gameBoardLogic = (function() {
    let mainBoard;

    const populateMainBoard = function(playerSymbol) {
        let divId = displayControl.getLastDivId();
        divId = divId.split('');
        let [row, col] = divId; 
        mainBoard[row][col] = playerSymbol;
    };

    const initGameBoardLogic = function() {
        console.log("the game board is initialized");
        mainBoard = [[1,1,1],[1,1,1],[1,1,1]];
    };

    const checkWinner = function() {
        let col = checkCol();
        let row = checkRow();
        let diag = checkDiag();
        console.log(col + " " + row + " " + diag);

        if(col != '1' || row != '1' || diag != '1') {
            let winPlayer = mainGameContorl.getWinnerPlayer(col, row, diag);
            console.log(winPlayer);
            gameControl.setGameOverMsg(`${winPlayer.name} wins`);
            return true;
        }
        return false;
    }

    function checkCol() {
        for(let i=0; i<mainBoard.length; i++) {
            if(mainBoard[0][i] == mainBoard[1][i] && mainBoard[1][i] == mainBoard[2][i] && mainBoard[0][i] != 1) {
                return mainBoard[0][i];
            }
        }
        return 1;
    }

    function checkRow() {
        for(let i=0; i<mainBoard.length; i++) {
            if(mainBoard[i][0] == mainBoard[i][1] && mainBoard[i][1] == mainBoard[i][2] && mainBoard[i][0] != 1) {
                return mainBoard[i][0];
            }
        }
        return 1;
    }

    function checkDiag() {
        if(
            mainBoard[0][0] == mainBoard[1][1] && mainBoard[1][1] == mainBoard[2][2] && mainBoard[0][0] != 1 ||
            mainBoard[0][2] == mainBoard[1][1] && mainBoard[1][1] == mainBoard[2][0] && mainBoard[0][2] != 1
        ) {
            return mainBoard[1][1];
        }
        return 1;
    }

    const checkBoardFilled = function() {
        let count = 0;

        for(let i=0; i<mainBoard.length; i++) {
            for(let j=0; j<mainBoard[i].length; j++) {
                if(mainBoard[i][j] != 1) {
                    count = count + 1;
                }
            }
        }

        if(count == 9) {
            return true;
        } else {
            return false;
        }
        
    };

    const getEmptyDivId = function() {
        for(let i=0; i<mainBoard.length; i++) {
            for(let j=0; j<mainBoard[i].length; j++) {
                if(mainBoard[i][j] == "1") {
                    console.log(i+""+j);
                    return i+""+j;
                }
            }
        }
    }

    const printMainBoard = function() {
        mainBoard.forEach((row) => console.log(row));
    };

    return {
        initGameBoardLogic,
        populateMainBoard,
        checkWinner,
        checkBoardFilled,
        getEmptyDivId,
        printMainBoard
    }
})();

const computerPlayer = (function() {

})();