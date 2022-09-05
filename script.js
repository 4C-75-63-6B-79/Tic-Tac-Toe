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
            // this.textContent = "M";
            this.textContent = mainGameContorl.getActivePlayerSymbol().symbol;
            setLastDivId(this.getAttribute('data-id'));
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
            console.log("Symbol choice button was pressed");
            humanPlayerSymbol = this.textContent ;
            console.log("The choice of the human player symbol is " + humanPlayerSymbol);
            mainGameContorl.initMainGameControl();
        } else {
            console.log('Symbol choice button was pressed but you need to restart the game since already made marks in game.')
        }
    }

    function reset() {
        humanPlayerSymbol = "";
        displayControl.resetDisplay();
    }

    // return the human player sysmbol
    const getHumanPlayerSymbol = function() {
        return humanPlayerSymbol;
    };

    return {
        getHumanPlayerSymbol
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

    let printActivePlayerSeries = function() {
        console.log(activePlayerSeries);
    };

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

    const printPlayer = function() {
        console.log(player1);
        console.log(player2);
    };

    return {
        getActivePlayerSymbol,
        initMainGameControl,
        getActivePlayerSymbol,
        printPlayer,
        printActivePlayerSeries
    };

})();