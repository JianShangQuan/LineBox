const Board = require('./board');




const board = document.getElementById('board');
const ctx = board.getContext('2d');
const BoardController = new Board({
    width: 400,
    height: 400,
    row: 10, 
    col: 10,
    ctx: ctx,
    canvas: board
});



board.addEventListener('mousemove', e => {
    BoardController.mousemove(e);
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
    console.log('resize');
    BoardController.setDimension(window.innerWidth / 2, window.innerHeight / 2);
}, true);