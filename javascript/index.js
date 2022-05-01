var padSize = 50;
var turn = "red";
var c = document.getElementById("gameView");
c.width = $("#canvasContainer").width();
c.height = $("#canvasContainer").height();
var clickedData = [];
var opponentPointData = [];

redraw();
$("#gameView").mousemove(e => {
    // console.log("X : " + e.clientX + " Y : " + e.clientY);
    // console.log("Row : " + (((e.clientY) - (e.clientY % padSize)) / padSize) + " Column : " + ((e.clientX - (e.clientX % padSize))) / padSize);
    // console.log((e.clientY - (e.clientY % padSize)));
    var line = c.getContext("2d");

    line.clearRect(0, 0, c.width, c.height);
    redraw();
    line.strokeStyle = "red";
    if (e.clientX > (e.clientX - (e.clientX % padSize)) && e.clientX < (e.clientX - (e.clientX % padSize)) + 10) {
        line.beginPath();
        line.moveTo((e.clientX - (e.clientX % padSize)), padSize * (((e.clientY) - (e.clientY % padSize)) / padSize));
        line.lineTo((e.clientX - (e.clientX % padSize)), padSize * (((e.clientY) - (e.clientY % padSize)) / padSize) + padSize);
        line.stroke();

    } else if (e.clientY > ((e.clientY) - (e.clientY % padSize)) && e.clientY < ((e.clientY) - (e.clientY % padSize)) + 10) {
        line.beginPath();
        line.moveTo(padSize * (((e.clientX) - (e.clientX % padSize)) / padSize), (e.clientY - (e.clientY % padSize)));
        line.lineTo(padSize * (((e.clientX) - (e.clientX % padSize)) / padSize) + padSize, (e.clientY - (e.clientY % padSize)));
        line.stroke();
    }
});

$("#gameView").click(e => {
    // console.log("Clicked");
    var line = c.getContext("2d");
    var lineData = [];
    line.strokeStyle = "black";
    if (e.clientX > (e.clientX - (e.clientX % padSize)) && e.clientX < (e.clientX - (e.clientX % padSize)) + 10) {
        line.beginPath();
        line.moveTo((e.clientX - (e.clientX % padSize)), padSize * (((e.clientY) - (e.clientY % padSize)) / padSize));
        line.lineTo((e.clientX - (e.clientX % padSize)), padSize * (((e.clientY) - (e.clientY % padSize)) / padSize) + padSize);
        line.stroke();
        lineData.push((e.clientX - (e.clientX % padSize)));
        lineData.push(padSize * (((e.clientY) - (e.clientY % padSize)) / padSize));
        lineData.push((e.clientX - (e.clientX % padSize)));
        lineData.push(padSize * (((e.clientY) - (e.clientY % padSize)) / padSize) + padSize);
        clickedData.push(lineData);

    } else if (e.clientY > ((e.clientY) - (e.clientY % padSize)) && e.clientY < ((e.clientY) - (e.clientY % padSize)) + 10) {
        line.beginPath();
        line.moveTo(padSize * (((e.clientX) - (e.clientX % padSize)) / padSize), (e.clientY - (e.clientY % padSize)));
        line.lineTo(padSize * (((e.clientX) - (e.clientX % padSize)) / padSize) + padSize, (e.clientY - (e.clientY % padSize)));
        line.stroke();
        lineData.push(padSize * (((e.clientX) - (e.clientX % padSize)) / padSize));
        lineData.push((e.clientY - (e.clientY % padSize)));
        lineData.push(padSize * (((e.clientX) - (e.clientX % padSize)) / padSize) + padSize);
        lineData.push((e.clientY - (e.clientY % padSize)));
        clickedData.push(lineData);
    }
    turn == 'red' ? turn = "black" : turn = "red";
    console.log(clickedData);
    // checkBox(lineData);
    lineData = null;
});


function redraw() {
    drawDots();
    drawClickedLine();
}






function drawClickedLine() {
    var line = c.getContext("2d");
    for (var i = 0; i < clickedData.length; i++) {
        for (var j = 0; j < clickedData[i].length; j++) {
            line.beginPath();
            line.moveTo(clickedData[i][0], clickedData[i][1]);
            line.lineTo(clickedData[i][2], clickedData[i][3]);
            line.stroke();
        }
    }
    line = null;
}
function drawDots() {
    var ctx
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 11; j++) {
            ctx = c.getContext("2d");
            ctx.beginPath();
            ctx.arc((i * padSize) + padSize, (j * padSize) + padSize, 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
        }
    }
    ctx = null;
}