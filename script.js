const displayControl = (function(document){

    let boxes = Array.from(document.querySelectorAll("[data-id]"));
    boxes.forEach((box) => box.addEventListener('click', boxClicked));

    function boxClicked() {
        console.log("------------------------");
        console.log(this.getAttribute('data-id') + ' is clicked.');
        if(this.textContent == "") {
            gameControl.humanMakeMove(this.getAttribute('data-id'));
        }
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
        p2.textContent = symbol == 'tie' ? 'game is tied' : symbol + " wins the game";
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

    function addSelectedSymbolClass(clickedButton) {
        symbolButtons.forEach((button) => {
            if(button == clickedButton && !button.classList.contains('selected-symbol')) {
                button.classList.add('selected-symbol');
            } else if(button != clickedButton && button.classList.contains('selected-symbol')) {
                button.classList.remove('selected-symbol');
            }
        });
    }

    function symbolButtonClicked() {
        console.log("------------------------");
        console.log(this.textContent + " symbol button clicked");
        addSelectedSymbolClass(this);
        console.log("-------------------------");
        displayControl.displayReset();
        gameControl.setPlayers(this.textContent);
        gameControl.initGameBoard();
    }

    const difficultySelector = document.getElementById("difficulty-selector");
    difficultySelector.addEventListener("click", setDifficulty);
    
    function setDifficulty() {
        displayControl.displayReset();
        gameControl.initGameBoard();
        gameControl.setDifficulty();
    }

})(document);

const gameControl = (function(){
    let gameBoard, humanPlayer, computerPlayer, playersMoveSeries, difficulty;

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
        difficulty = 'easy';
        initGameBoard();
    })();

    let setPlayers = function(hum_symbol) {
        console.log('players are set.');
        humanPlayer = hum_symbol;
        computerPlayer = hum_symbol == "X" ? 'O' : 'X';
    };

    let getPlayer = function(player) {
        if(player == 'human') {
            return humanPlayer;
        } else if(player == 'computer') {
            return computerPlayer;
        }
    }

    let setDifficulty = function() {
        difficulty = difficulty == 'easy' ? 'hard' : 'easy';
        console.log('difficulty is set to ' + difficulty);
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
            let emptyDiv = difficulty == "easy" ? getEmpytDiv() : computerMoveCompute.getBestMoveId(gameBoard);
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
        let emptyDiv = difficulty == "easy" ? getEmpytDiv() : computerMoveCompute.getBestMoveId(gameBoard);;
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
        getPlayer,
        setDifficulty,
        getActivePlayer,
        humanMakeMove,
        computerMakeMove,
        checkWinner
    };
})();

const computerMoveCompute = (function() {

    let scoreData = {};

    let getBestMoveId = function(gameBoard) {
        let bestScore = -Infinity, bestMove;
        setScoreData();

        for(let i=0; i<gameBoard.length; i++) {
            for(let j=0; j<gameBoard[i].length; j++) {
                if(gameBoard[i][j] == "") {
                    gameBoard[i][j] = gameControl.getPlayer('computer');
                    let score = minmax(gameBoard,0,false);
                    if(score > bestScore) {
                        bestScore = score;
                        bestMove = i+""+j;
                    }
                    gameBoard[i][j] = "";
                }
            }
        }
        console.log('move made on hard difficulty');
        return bestMove;
    };

    function minmax(gameBoard,depth,isMaximizing) {
        let result = gameControl.checkWinner();
        if(result != null) {
            let score = scoreData[result];
            return score;
        } 

        if(isMaximizing) {
            let bestScore = -Infinity;
            for(let i=0; i<gameBoard.length; i++) {
                for(let j=0; j<gameBoard[i].length; j++) {
                    if(gameBoard[i][j] == "") {
                        gameBoard[i][j] = gameControl.getPlayer('computer');
                        let score = minmax(gameBoard,depth+1,false);
                        bestScore = score > bestScore ? score : bestScore;
                        gameBoard[i][j] = "";
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for(let i=0; i<gameBoard.length; i++) {
                for(let j=0; j<gameBoard[i].length; j++) {
                    if(gameBoard[i][j] == "") {
                        gameBoard[i][j] = gameControl.getPlayer('human');
                        let score = minmax(gameBoard,depth+1,true);
                        bestScore = score < bestScore ? score : bestScore;                         
                        gameBoard[i][j] = "";
                    }
                }
            }
            return bestScore;
        }
    }

    function setScoreData() {
        scoreData = {};
        scoreData[gameControl.getPlayer('human')] = -1;
        scoreData[gameControl.getPlayer('computer')] = 1;
        scoreData['tie'] = 0;
    }

    return {
        getBestMoveId
    }
})();