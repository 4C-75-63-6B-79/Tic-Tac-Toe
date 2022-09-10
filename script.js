const displayControl = (function(document){

    let boxes = Array.from(document.querySelectorAll("[data-id]"));
    boxes.forEach((box) => box.addEventListener('click', boxClicked));

    function boxClicked() {
        console.log("------------------------");
        console.log(this.getAttribute('data-id') + ' is clicked.');
    }

    let displayReset = function() {
        console.log('display is reset.')
        boxes.forEach((box) => box.textContent = "");

    };

    return {
        displayReset
    };

})(document);

const buttonControl = (function(document) {

    const symbolButtons = Array.from(document.querySelectorAll('#symbol-choice > button'));
    symbolButtons.forEach((button) => button.addEventListener('click', symbolButtonClicked));

    function symbolButtonClicked() {
        console.log("------------------------");
        console.log(this.textContent + " symbol button clicked");
        gameControl.gameControlReset();
        displayControl.displayReset();
        gameControl.setPlayers(this.textContent);
    }


})(document);

const gameControl = (function(){
    let gameBoard;

    function initGameBoard()  {
        gameBoard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        console.log("Game Board is initialized")
    };

    let setPlayers = function(hum_symbol) {
        console.log('players are set.');
    }

    let gameControlReset = function() {
        console.log("Game board is reset.")
        initGameBoard();
    };

    return {
        gameControlReset,
        setPlayers
    };
})();