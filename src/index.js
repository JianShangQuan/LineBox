const Board = require('./board');



const currentPlayerView = document.querySelector('.current-player span');


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
    width: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    height: Math.min(window.innerWidth,window.innerHeight) * 0.75,
    row: 10, 
    col: 10,
    ctx: ctx,
    canvas: board,
    players: players,
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