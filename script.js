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
            this.textContent = gameControl.getHumanPlayerSymbol();
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
    }

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
        if(humanPlayerSymbol == "") {
            humanPlayerSymbol = this.textContent ;
            console.log("The choice of the human player symbol is " + humanPlayerSymbol);
        }
        console.log("Symbol choice button was pressed");
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
    }

})(document);


const mainGameContorl = (function() {

});