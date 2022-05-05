const Board = require('./board');
const db = require('./db-operation');



let gameid = null;


const player1Input = document.querySelector('body');
const player2Input = document.querySelector('body');
const joinGameIdInput = document.querySelector('#join-game-id-input');

const currentPlayerView = document.querySelector('.current-player span');
const gameidView = document.querySelector('span.game-id-view');
const startGameBtn = document.querySelector('#start-game-btn');
const joinGameBtn = document.querySelector('#join-game-btn');


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
];
const BoardController = new Board({
    gameId: "",
    width: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    height: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    row: 10, 
    col: 10,
    ctx: ctx,
    canvas: board,
    players: players,
    playMode: Board.PlayMode.online,
    fixedPlayer: 1,
    events: {
        init: function(){
            currentPlayerView.textContent = players[0].name;
        },
        onClick: function(line){
            // console.log('on clicked', line);
        },
        onPlayerChanged: function (previousPlayerInfo, currentPlayerInfo){
            document.querySelector(`.player-info .player[data-player-id="${previousPlayerInfo.id}"] .player-score`).textContent = previousPlayerInfo.score;
            currentPlayerView.textContent = currentPlayerInfo.name;
            db.saveState(gameid, {
                currentTurn: previousPlayerInfo.id,
                clickedLines: BoardController.clickLines,
                completeSquarePoints: BoardController.completeSquarePoints
            })
        }
    }
});




window.BoardController = BoardController;


board.addEventListener('mousemove', e => {
    BoardController.mousemove(e);
});

board.addEventListener('click', e => {
    BoardController.click(e);
});




(function init(){
    BoardController.draw();

    startGameBtn.addEventListener('click', async e => {
        const ob = await db.createNewGame(players, {
            size: {
                row: 10,
                col: 10
            }
        });
        gameid = ob.gameid;
        gameidView.textContent = 'Game id : ' +  ob.gameid;
        ob.onStateChanged(gameid, (data) => {
            console.log('state changed', data);
            BoardController.updateData(data.clickedLines, data.completeSquarePoints ?? []);
            BoardController.nextTurn(data.currentTurn);
        })
    });

    joinGameBtn.addEventListener('click', e => {
        console.log('game joined');
        gameid = joinGameIdInput.value;
        gameidView.textContent = 'Game id : ' +  gameid;
        db.onStateChanged(joinGameIdInput.value, (data) => {
            console.log('state changed', data);
            BoardController.updateData(data.clickedLines ?? [], data.completeSquarePoints ?? []);
            BoardController.nextTurn(data.currentTurn);
        });
    });

})();








// ctx.beginPath();
// ctx.arc(20,20, 10,0,2*Math.PI);
// ctx.fillStyle = '#000000';
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(10, 10);
// ctx.lineTo(20, 20);
// ctx.stroke();
// ctx.closePath();




window.addEventListener('resize', function(event) {
    const minSize = Math.min(window.innerWidth, window.innerHeight);
    BoardController.setDimension(minSize * 0.75, minSize * 0.75);
}, true);