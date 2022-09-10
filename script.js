const displayControl = (function(document){

    let boxes = Array.from(document.querySelectorAll("[data-id]"));
    boxes.forEach((box) => box.addEventListener('click', boxClicked));

    function boxClicked() {
        console.log("------------------------");
        console.log(this.getAttribute('data-id') + ' is clicked.');
        gameControl.humanMakeMove(this.getAttribute('data-id'));
    }

    function markBox(dataId) {
        let box = document.querySelector(`div[data-id="${dataId}"]`);
        if(box != null && box.textContent == "") {
            box.textContent = gameControl.getActivePlayer();
        }
    }

    let displayReset = function() {
        console.log('display is reset.')
        boxes.forEach((box) => box.textContent = "");
    };

    let displayGameOverMessage = function(symbol) {
        let div = document.getElementById('game-over');
        if(div.hasChildNodes()) {
            return;
        }
        div.addEventListener("click", resetGameOverMessage);
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        p1.textContent = "GAME OVER";
        p2.textContent = symbol + " wins the game";
        div.appendChild(p1);
        div.appendChild(p2);
        div.style.transform = 'scale(1)';
        div.style.transform = 'translate(-50%, -50%)';
    }

    function resetGameOverMessage() {
        let div = document.getElementById('game-over');
        if(div.hasChildNodes()) {
            div.removeChild(div.firstChild);
            div.removeChild(div.firstChild);
            div.removeEventListener('click', resetGameOverMessage);
            div.style.transform = 'scale(0)';
        }
        displayControl.displayReset();
        gameControl.initGameBoard();
    }

    return {
        displayReset,
        markBox,
        displayGameOverMessage
    };

})(document);

const buttonControl = (function(document) {

    const symbolButtons = Array.from(document.querySelectorAll('#symbol-choice > button'));
    symbolButtons.forEach((button) => button.addEventListener('click', symbolButtonClicked));

    symbolButtons[0].classList.add('selected-symbol');

    function addSelectedSymbolClass() {
        symbolButtons.forEach((button) => {
            if(button.classList.contains('selected-symbol')) {
                button.classList.remove('selected-symbol');
            } else {
                button.classList.add('selected-symbol');
            }
        });
    }

    function symbolButtonClicked() {
        console.log("------------------------");
        console.log(this.textContent + " symbol button clicked");
        addSelectedSymbolClass();
        displayControl.displayReset();
        gameControl.setPlayers(this.textContent);
        gameControl.initGameBoard();
    }

})(document);

const gameControl = (function(){
    let gameBoard;
    let humanPlayer, computerPlayer;
    let playersMoveSeries;

    let initGameBoard = function()  {
        gameBoard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        playersMoveSeries = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'].reverse();
        console.log("Game Board is initialized");
        makeFirstMove();
    };

    (function initPlayer() {
        humanPlayer = "X";
        computerPlayer = "O";
        initGameBoard();
    })();

    let setPlayers = function(hum_symbol) {
        console.log('players are set.');
        humanPlayer = hum_symbol;
        computerPlayer = hum_symbol == "X" ? 'O' : 'X';
    };

    function gameBoardPopulate(symbol, dataId) {
        let x = dataId[0];
        let y = dataId[1];
        gameBoard[x][y] = symbol;
    }

    let getActivePlayer = function() {
            return playersMoveSeries.pop();
    };

    function getEmpytDiv() {
        for(let i=0; i<gameBoard.length; i++) {
            for(let j=0; j<gameBoard[i].length; j++) {
                if(gameBoard[i][j] == "") {
                    return i+""+j;
                }
            }
        }
    }

    function makeFirstMove() {
        if(computerPlayer == "X") {
            let emptyDiv = getEmpytDiv();
            displayControl.markBox(emptyDiv);
            gameBoardPopulate("X", emptyDiv);
        }
    };

    let humanMakeMove = function(dataId) {
        displayControl.markBox(dataId);
        gameBoardPopulate(humanPlayer, dataId);
        if(checkWinner()) {
            displayControl.displayGameOverMessage(checkWinner());
            return;
        }
        computerMakeMove();
    };

    function computerMakeMove() {
        let emptyDiv = getEmpytDiv();
        displayControl.markBox(emptyDiv);
        gameBoardPopulate(computerPlayer, emptyDiv);
        if(checkWinner()) {
            displayControl.displayGameOverMessage(checkWinner());
            return;
        }
    }

    let checkWinner = function() {
        function checkRow(symbol) {
            for(let i=0; i<gameBoard.length; i++) {
                if(gameBoard[i][0] == symbol && gameBoard[i][1] == symbol && gameBoard[i][2] == symbol) {
                    return true;
                }
            }
            return false;
        }
    
        function checkCol(symbol) {
            for(let i=0; i<gameBoard.length; i++) {
                if(gameBoard[0][i] == symbol && gameBoard[1][i] == symbol && gameBoard[2][i] == symbol) {
                    return true;
                }
            }
            return false;
        }
    
        function checkDiag(symbol) {
            if((gameBoard[0][0] == symbol && gameBoard[1][1] == symbol && gameBoard[2][2] == symbol) ||
               (gameBoard[0][2] == symbol && gameBoard[1][1] == symbol && gameBoard[2][0] == symbol)) {
                return true;
            }
            return false;
        }

        function checkTie() {
            for(let i=0; i<gameBoard.length; i++) {
                for(let j=0; j<gameBoard[i].length; j++) {
                    if(gameBoard[i][j] == "") {
                        return false;
                    }
                }
            }
            return true;
        }

        if(checkRow(computerPlayer) || checkCol(computerPlayer) || checkDiag(computerPlayer)) {
            return computerPlayer;
        } else if(checkRow(humanPlayer) || checkCol(humanPlayer) || checkDiag(humanPlayer)) {
            return humanPlayer;
        } else if(checkTie()) {
            return "tie";
        }
    }

    return {
        initGameBoard,
        setPlayers,
        getActivePlayer,
        humanMakeMove,
        computerMakeMove,
        checkWinner
    };
})();