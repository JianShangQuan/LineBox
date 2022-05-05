const Board = require('./board');
const db = require('./db-operation');

window.db = db;

let gameid = null;


const player1Input = document.querySelector('.player-1-input');
const player2Input = document.querySelector('.player-2-input');
const joinGameIdInput = document.querySelector('#join-game-id-input');

const currentPlayerView = document.querySelector('.current-player span');
const gameidView = document.querySelector('span.game-id-view');
const startGameBtn = document.querySelector('#start-game-btn');
const joinGameBtn = document.querySelector('#join-game-btn');


let BoardController = null;
const board = document.getElementById('board');
const ctx = board.getContext('2d');
const boardConfig = {
    width: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    height: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    ctx: ctx,
    canvas: board,
    playMode: Board.PlayMode.online,
    events: {
        init: function(obj){
            currentPlayerView.textContent = obj.players[0].name;
            obj.players.forEach(player => {
                document.querySelector(`.player[data-player-id="${player.id}"] .player-name`).textContent = player.name;
            });
        },
        onClick: function(line){
            console.log('on clicked', line);
            db.saveState(gameid, {
                currentTurn: BoardController.currentPlayer.id,
                clickedLines: BoardController.clickLines,
                completeSquarePoints: BoardController.completeSquarePoints
            });
        },
        onPlayerChanged: function (previousPlayerInfo, currentPlayerInfo){
            console.log('player changed');
            document.querySelector(`.player-info .player[data-player-id="${previousPlayerInfo.id}"] .player-score`).textContent = previousPlayerInfo.score;
            currentPlayerView.textContent = currentPlayerInfo.name;
        },
        onDispose: function(){
            board.removeEventListener('mousemove', BoardController.mousemove);
            board.removeEventListener('click', BoardController.click);
            window.removeEventListener('resize', onResize, true);
        }
    }
}














function init(){
    // BoardController.draw();

    startGameBtn.addEventListener('click', async e => {
        const boardSize = {
            row: parseInt(document.querySelector('.board-size input[data-board-size-x="x"]').value),
            col: parseInt(document.querySelector('.board-size input[data-board-size-y="y"]').value)
        };
        const players = [
            {
                name: player1Input.value.trim(),
                color: 'red'
            },
            {
                name: player2Input.value.trim(),
                color: 'black'
            }
        ];
        const gameCreatedObject = await db.createNewGame(players, { size: boardSize });
        gameid = gameCreatedObject.gameid;
        gameidView.textContent = 'Game id : ' +  gameid;


        BoardController = new Board({
            ...boardConfig,
            gameid: gameid,
            row: boardSize.row,
            col: boardSize.col,
            players: players
        });


        board.addEventListener('mousemove', BoardController.mousemove.bind(BoardController));
        board.addEventListener('click', BoardController.click.bind(BoardController));
        window.addEventListener('resize', onResize, true);
        

        window.BoardController = BoardController;


        gameCreatedObject.onStateChanged(gameid, (data) => {
            BoardController.updateDataFromOpponent(data.clickedLines, data.completeSquarePoints ?? []);
        })

        window.BoardController = BoardController;

        document.querySelector('.join-game').classList.add('hide');
        document.querySelector('.start-game').classList.add('hide');
    });

    joinGameBtn.addEventListener('click', async e => {
        console.log('joining game');
        gameid = joinGameIdInput.value;
        gameidView.textContent = 'Game id : ' +  gameid;



        const gameInfo = await db.getGameInfo(gameid);
        console.log(gameInfo);
        BoardController = new Board({
            ...boardConfig,
            gameid: gameid,
            row: gameInfo.game.size.row,
            col: gameInfo.game.size.col,
            players: gameInfo.players
        });


        board.addEventListener('mousemove', BoardController.mousemove.bind(BoardController));
        board.addEventListener('click', BoardController.click.bind(BoardController));
        window.addEventListener('resize', onResize, true);


        db.onStateChanged(joinGameIdInput.value, (data) => {
            BoardController.updateDataFromOpponent(data.clickedLines ?? [], data.completeSquarePoints ?? []);
        });

        BoardController.joinOpponent();

        window.BoardController = BoardController;
        console.log('game joined');

        document.querySelector('.start-game').classList.add('hide');
        document.querySelector('.join-game').classList.add('hide');
    });

};

init();




function onResize(){
    const minSize = Math.min(window.innerWidth, window.innerHeight);
    BoardController.setDimension(minSize * 0.75, minSize * 0.75);
}


window.onbeforeunload = async function(e){
    db.dispose();
    BoardController.dispose();
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




