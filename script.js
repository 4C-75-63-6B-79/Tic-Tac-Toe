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
            let currentPlayer = mainGameContorl.getActivePlayerSymbol();
            this.textContent = currentPlayer.symbol;
            // call the other fucntion which in turn call the reset function which are required on filling of a position in board.
            eventFireAtBoradBoxClick(currentPlayer, this.getAttribute('data-id'));
        } 
    }

    // calls the necessary fucntions when a position in the box is marked
    function eventFireAtBoradBoxClick(player, divId) {
        console.log('necessary events fired');
        setLastDivId(divId);
        gameBoardLogic.populateMainBoard(player);
        if(gameBoardLogic.checkBoardFilled() == true) {
            gameControl.reset();
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
    
    // get the buttons used in the game to choose the symbol
    const buttons = Array.from(document.querySelectorAll('#symbol-choice > button'));

    // selecting and adding a event listnere to the restart button 
    document.getElementById("restart").addEventListener("click", reset);


    // adding eventlistener to the control buttons
    buttons.forEach((button) => button.addEventListener('click', setHumanPlayerSymbol));

    // store the choice of the human player symbol
    let humanPlayerSymbol = "";
    
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

    function reset() {
        console.log('restart button was pressed');
        humanPlayerSymbol = "";
        displayControl.resetDisplay();
        mainGameContorl.resetMainGameControl();
        gameBoardLogic.resetMainGameBoardLogic();
    }

    // return the human player sysmbol
    const getHumanPlayerSymbol = function() {
        return humanPlayerSymbol;
    };

    return {
        getHumanPlayerSymbol,
        reset
    };

})(document);


const Player = function(name, symbol, playerNumber) {
    return {name, symbol, playerNumber};
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
        return(activePlayerSeries.pop());
    };

    const initMainGameControl = function() {
        console.log("Starting the game");
        setGamePlayers();
        setActivePlayerSeries();
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
        resetMainGameControl,
        printPlayer,
        printActivePlayerSeries,
    };

})();

const gameBoardLogic = (function() {
    let mainBoard;

    const populateMainBoard = function(player) {
        let divId = displayControl.getLastDivId();
        divId = divId.split('');
        let [row, col] = divId; 
        mainBoard[row][col] = player;
    };

    const initGameBoardLogic = function() {
        console.log("the game board is initialized");
        mainBoard = [[],[],[]];
    };

    const checkWhichPlayerWin = function() {

    };

    const checkBoardFilled = function() {
        if(!(mainBoard instanceof Array)) {
            return false;
        }

        let count = 0;

        for(let i=0; i<mainBoard.length; i++) {
            for(let j=0; j<mainBoard[i].length; j++) {
                if(mainBoard[i][j]) {
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

    const resetMainGameBoardLogic = function() {
        mainBoard = undefined;
        console.log("the main board is reset");
    };

    const printMainBoard = function() {
        mainBoard.forEach((row) => console.log(row));
    };

    return {
        initGameBoardLogic,
        populateMainBoard,
        checkBoardFilled,
        resetMainGameBoardLogic,
        printMainBoard
    }
})();