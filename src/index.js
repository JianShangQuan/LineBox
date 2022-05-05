const Board = require('./board');
const db = require('./db-operation');

window.db = db;

let gameid = null;


const player1Input = document.querySelector('body');
const player2Input = document.querySelector('body');
const joinGameIdInput = document.querySelector('#join-game-id-input');

const currentPlayerView = document.querySelector('.current-player span');
const gameidView = document.querySelector('span.game-id-view');
const startGameBtn = document.querySelector('#start-game-btn');
const joinGameBtn = document.querySelector('#join-game-btn');


let BoardController = null;
const board = document.getElementById('board');
const ctx = board.getContext('2d');
const players = [
    {
        name: '简尚全',
        color: 'red'
    },
    {
        name: '简尚威',
        color: 'green'
    }
]
const boardConfig = {
    width: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    height: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    ctx: ctx,
    canvas: board,
    players: players,
    playMode: Board.PlayMode.online,
    events: {
        init: function(){
            currentPlayerView.textContent = players[0].name;
        },
        onClick: function(line){
            console.log('on clicked', line);
            db.saveState(gameid, {
                currentTurn: BoardController.currentPlayer.id,
                clickedLines: BoardController.clickLines,
                completeSquarePoints: BoardController.completeSquarePoints
            })
        },
        onPlayerChanged: function (previousPlayerInfo, currentPlayerInfo){
            console.log('player changed');
            document.querySelector(`.player-info .player[data-player-id="${previousPlayerInfo.id}"] .player-score`).textContent = previousPlayerInfo.score;
            currentPlayerView.textContent = currentPlayerInfo.name;
        }
    }
}












function init(){
    // BoardController.draw();

    startGameBtn.addEventListener('click', async e => {
        const boardSize = {
            row: 10,
            col: 10
        };
        const gameCreatedObject = await db.createNewGame(players, { size: boardSize });
        gameid = gameCreatedObject.gameid;
        gameidView.textContent = 'Game id : ' +  gameid;


        BoardController = new Board({
            ...boardConfig,
            gameid: gameid,
            row: boardSize.row,
            col: boardSize.col,
        });


        board.addEventListener('mousemove', e => {
            BoardController.mousemove(e);
        });
        
        board.addEventListener('click', e => {
            BoardController.click(e);
        });
        

        window.BoardController = BoardController;


        gameCreatedObject.onStateChanged(gameid, (data) => {
            BoardController.updateDataFromOpponent(data.clickedLines, data.completeSquarePoints ?? []);
            // BoardController.nextTurn(data.currentTurn);
        })

        window.BoardController = BoardController;

        window.addEventListener('resize', function(event) {
            const minSize = Math.min(window.innerWidth, window.innerHeight);
            BoardController.setDimension(minSize * 0.75, minSize * 0.75);
        }, true);
    });

    joinGameBtn.addEventListener('click', async e => {
        console.log('game joined');
        gameid = joinGameIdInput.value;
        gameidView.textContent = 'Game id : ' +  gameid;



        const gameInfo = await db.getGameInfo(gameid);
        console.log(gameInfo);
        BoardController = new Board({
            ...boardConfig,
            gameid: gameid,
            row: gameInfo.game.size.row,
            col: gameInfo.game.size.col,
        });


        board.addEventListener('mousemove', e => {
            BoardController.mousemove(e);
        });
        
        board.addEventListener('click', e => {
            BoardController.click(e);
        });

        window.BoardController = BoardController;


        db.onStateChanged(joinGameIdInput.value, (data) => {
            BoardController.updateDataFromOpponent(data.clickedLines ?? [], data.completeSquarePoints ?? []);
            // BoardController.nextTurn(data.currentTurn);
        });

        window.BoardController = BoardController;
    });

};

init();


window.onbeforeunload = async function(e){
    db.clean();
}







// ctx.beginPath();
// ctx.arc(20,20, 10,0,2*Math.PI);
// ctx.fillStyle = '#000000';
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(10, 10);
// ctx.lineTo(20, 20);
// ctx.stroke();
// ctx.closePath();




