module.exports = class Board{

    #xGap;
    #yGap;
    #clickedLines = [];
    #completedSquarePoints = [];
    #turns = 1;

    static LineType = Object.freeze({
        horizontal: 'horizontal',
        vertical: 'vertical'
    });

    constructor(options){
        this.width = options.width;
        this.height = options.height;
        this.row = options.row;
        this.col = options.col;
        this.ctx = options.ctx;
        this.canvas = options.canvas;
        this.threshold = 0.1;

        this.players = options.players.length;
        this.playerConfig = options.players;

        this.#xGap = this.width / this.row;
        this.#yGap = this.height / this.col;

        this.#init();        
    }

    #init(){
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    draw(event = null){
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.#drawHover(event);
        this.#drawClickline();
        this.#drawCompleteSquareDots();
        this.#drawDots();
    }

    #drawDots(){
        for(let i = 0; i < this.row; i ++){
            for(let j = 0; j < this.col; j++){
                this.ctx.beginPath();
                this.ctx.arc((i * this.#xGap) + (this.#xGap / 2), (j * this.#yGap) + (this.#yGap / 2), (this.width / 95) , 0, 2 * Math.PI);
                this.ctx.fillStyle = '#000000';
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }

    #findJointPointsFromPexelPosition(event){
        let xGap = this.#xGap;
        let yGap = this.#yGap;

        if(event){
            // console.log(event.clientX, event.clientY);
            let react = this.canvas.getBoundingClientRect();            
            let hoverX = (event.clientX - react.left + xGap / 2) / xGap;
            let hoverY = (event.clientY - react.top + yGap / 2) / yGap;

            // console.log("x", hoverX, 'y', hoverY, event.type);


            if(hoverY > 1 && 
                (hoverX - Math.floor(hoverX) > (1 - this.threshold) || hoverX - Math.floor(hoverX) < this.threshold) && hoverY < this.col){

                // for vertical line "|"
                // in vertical "X" position are same
                //
                //   (x1, y1)
                //      o
                //      |
                //      |
                //      |
                //      |
                //      |
                //      |
                //      o
                //   (x2, y2)
                // 

                let x = Math.floor(hoverX) * xGap + (xGap / 2);

                let y1 = Math.floor(hoverY) * yGap + (yGap / 2);
                let y2 = (Math.floor(hoverY) - 1) * yGap + (yGap / 2);

                if(hoverX - Math.floor(hoverX) < this.threshold) x = x - xGap;

                this.ctx.beginPath();
                this.ctx.moveTo(x, y1); 
                this.ctx.lineTo(x, y2);
                this.ctx.stroke();
                this.ctx.closePath();

                return {
                    x1: x / xGap, 
                    y1: y1 / yGap,
                    x2: x / xGap, 
                    y2: y2 / yGap 
                }
            }else if(hoverX > 1 && 
                (hoverY - Math.floor(hoverY) > (1 - this.threshold) || hoverY - Math.floor(hoverY) < this.threshold) && hoverX < this.row){


                // for horizontal line "--"
                // in horizonal "Y" position are same
                //
                //   (x1, y1)                 (x2, y2)
                //      o=======================o
                //

                let x1 = Math.floor(hoverX) * xGap + (xGap / 2);
                let x2 = (Math.floor(hoverX) - 1) * xGap + (xGap / 2);
                
                let y = Math.floor(hoverY) * yGap + (yGap / 2);

                if(hoverY - Math.floor(hoverY) < this.threshold) y = y - yGap;

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y); 
                this.ctx.lineTo(x2, y);
                this.ctx.stroke();
                this.ctx.closePath();

                return {
                    x1: x1 / xGap, 
                    y1: y / yGap,  
                    x2: x2 / xGap, 
                    y2: y / yGap 
                }
            }

            return null;
        }
    }

    #drawHover(event){
        const line = this.#findJointPointsFromPexelPosition(event);
        if(line){
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1 * this.#xGap, line.y1 * this.#yGap); 
            this.ctx.lineTo(line.x2 * this.#xGap, line.y2 * this.#yGap);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    #drawClickline(){
        // console.log(this.#clickedLines);
        for(let i = 0; i < this.#clickedLines.length; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(this.#clickedLines[i].line.x1 * this.#xGap, this.#clickedLines[i].line.y1 * this.#yGap); 
            this.ctx.lineTo(this.#clickedLines[i].line.x2 * this.#xGap, this.#clickedLines[i].line.y2 * this.#yGap);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    #drawCompleteSquareDots(){
        this.#completedSquarePoints.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.point.x * this.#xGap, p.point.y * this.#yGap, this.#xGap * 0.3 , 0, 2 * Math.PI);
            this.ctx.fillStyle = this.playerConfig[p.player - 1].color;
            this.ctx.fill();
            this.ctx.closePath();
        })
    }

    #checkValidBox(line){
        // if line is horizonal
        // console.log('click line', line);
        // console.log('linked line ',this.#getLinkedLines(line));
        const self = this;
        const validSquare = [];
        const goingToBeSquare = [];
        if(this.#lineType(line) == Board.LineType.horizontal){
            let squareLines = {
                down: {
                    line1: line,
                    line2: {x1: line.x1 - 1, y1: line.y1 + 1, x2: line.x2, y2: line.y2},
                    line3: {x1: line.x1, y1: line.y1 + 1, x2: line.x2 + 1, y2: line.y2},
                    line4: {x1: line.x1, y1: line.y1 + 1, x2: line.x2, y2: line.y2 + 1}
                },
                up: {
                    line1: line,
                    line2: {x1: line.x1 - 1, y1: line.y1, x2: line.x2, y2: line.y2 - 1},
                    line3: {x1: line.x1, y1: line.y1, x2: line.x2 + 1, y2: line.y2 - 1},
                    line4: {x1: line.x1, y1: line.y1 - 1, x2: line.x2, y2: line.y2 - 1}
                }
            }

            let upValid = [], downValid = [];

            this.#clickedLines.forEach(l => {
                if(
                    this.#isEqualLine(l.line, squareLines.down.line1) ||
                    this.#isEqualLine(l.line, squareLines.down.line2) ||
                    this.#isEqualLine(l.line, squareLines.down.line3) ||
                    this.#isEqualLine(l.line, squareLines.down.line4)
                ){
                    downValid.push(l);
                };

                if(
                    this.#isEqualLine(l.line, squareLines.up.line1) ||
                    this.#isEqualLine(l.line, squareLines.up.line2) ||
                    this.#isEqualLine(l.line, squareLines.up.line3) ||
                    this.#isEqualLine(l.line, squareLines.up.line4)
                ){
                    upValid.push(l);
                };
            });

            const isValidSquare = upValid.length == 4 || downValid.length == 4;
            if(upValid.length == 4) validSquare.push({side: upValid, type:'up'});
            if(downValid.length == 4) validSquare.push({side: downValid, type:'down'});

            if(upValid.length == 3) goingToBeSquare.push({
                side: upValid, 
                type: 'up',
                needSide: Object.values(squareLines.up).filter((l, index) => {
                    for(let i = 0; i < upValid.length; i++){
                        return self.#isEqualLine(l, upValid[i].line);
                    }
                })
            });
            if(downValid.length == 3) goingToBeSquare.push({
                side: downValid, 
                type: 'down',
                needSide: Object.values(squareLines.down).filter((l, index) => {
                    for(let i = 0; i < downValid.length; i++){
                        return self.#isEqualLine(l, downValid[i].line);
                    }
                })
            });

            console.log('square line', squareLines);

            return {
                isValidSquare: isValidSquare,
                validSquare: validSquare,
                isGoingToValidSquare: goingToBeSquare.length > 0,
                goingToBeSquare: goingToBeSquare,
            };
        }else{ // if line is vertical

            let squareLines = {
                left: {
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1 - 1, x2: line.x2 - 1, y2: line.y2},
                    line3: {x1: line.x1, y1: line.y1, x2: line.x2 - 1, y2: line.y2 + 1},
                    line4: {x1: line.x1 - 1, y1: line.y1, x2: line.x2 - 1, y2: line.y2},
                },
                right: {
                    line1: line,
                    line2: {x1: line.x1 + 1, y1: line.y1 - 1, x2: line.x2, y2: line.y2},
                    line3: {x1: line.x1 + 1, y1: line.y1, x2: line.x2, y2: line.y2 + 1},
                    line4: {x1: line.x1 + 1, y1: line.y1, x2: line.x2 + 1, y2: line.y2},
                }
            }

            let leftValid = [], rightValid = [];

            this.#clickedLines.forEach(l => {

                if(
                    this.#isEqualLine(l.line, squareLines.left.line1) ||
                    this.#isEqualLine(l.line, squareLines.left.line2) ||
                    this.#isEqualLine(l.line, squareLines.left.line3) ||
                    this.#isEqualLine(l.line, squareLines.left.line4)
                ){
                    leftValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, squareLines.right.line1) ||
                    this.#isEqualLine(l.line, squareLines.right.line2) ||
                    this.#isEqualLine(l.line, squareLines.right.line3) ||
                    this.#isEqualLine(l.line, squareLines.right.line4)
                ){
                    rightValid.push(l);
                };
            });
            const isValidSquare = leftValid.length == 4 || rightValid.length == 4;
            if(leftValid.length == 4) validSquare.push({side: leftValid, type: 'left'});
            if(rightValid.length == 4) validSquare.push({side: rightValid, type: 'right'});
            
            if(leftValid.length == 3) goingToBeSquare.push({
                side: leftValid, 
                type: 'left',
                needSide: Object.values(squareLines.left).filter((l, index) => {
                    for(let i = 0; i < leftValid.length; i++){
                        return self.#isEqualLine(l, leftValid[i].line);
                    }
                })
            });
            if(rightValid.length == 3) goingToBeSquare.push({
                side: rightValid, 
                type: 'right',
                needSide: Object.values(squareLines.right).filter((l, index) => {
                    for(let i = 0; i < rightValid.length; i++){
                        return self.#isEqualLine(l, rightValid[i].line);
                    }
                })
            });

            console.log('square line', squareLines);

            return {
                isValidSquare: isValidSquare,
                validSquare: validSquare,
                isGoingToBeSquare: goingToBeSquare.length > 0,
                goingToBeSquare: goingToBeSquare
            }
        }
    }

    #checkIsGoingToBecomeValidBox(line){
        const leftValid = [],
              rightValid = [],
              upValid = [],
              downValid = [];

        if(this.#lineType(line) == Board.LineType.horizontal){ // horizontal
            let goingToBeSquareLines = {
                left: { // square "]" shape
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2},
                    line3: {x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2},
                },
                right: { // square "[" shpae
                    line1: line,
                    line2: {x1: line.x1 - 1, y1: line.y1, x2: line.x2, y2: line.y2 - 1},
                    line3: {x1: line.x1, y1: line.y1 - 1, x2: line.x2, y2: line.y2 - 1}
                },
                down: { // square "n" shape
                    line1: line,
                    line2: {x1: line.x1 - 1, y1: line.y1 + 1, x2: line.x2, y2: line.y2},
                    line3: {x1: line.x1, y1: line.y1 + 1, x2: line.x2 + 1, y2: line.y2},
                },
                up: { // square "u" shape
                    line1: line,
                    line2: {x1: line.x1 - 1, y1: line.y1, x2: line.x2, y2: line.y2 - 1},
                    line3: {x1: line.x1, y1: line.y1, x2: line.x2 + 1, y2: line.y2 - 1},
                }
            }


            this.#clickedLines.forEach(l => {
                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.left.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.left.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.left.line3)
                ){
                    leftValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.right.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.right.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.right.line3)
                ){
                    rightValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.up.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.up.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.up.line3)
                ){
                    upValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.down.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.down.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.down.line3)
                ){
                    downValid.push(l);
                }
            });


            console.log(goingToBeSquareLines);
        }else{ // is vertical
            let goingToBeSquareLines = {
                left: { // square "]" shape
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1 - 1, x2: line.x2 - 1, y2: line.y2},
                    line3: {x1: line.x1, y1: line.y1, x2: line.x2 - 1, y2: line.y2 + 1}
                },
                right: { // square "[" shpae
                    line1: line,
                    line2: {x1: line.x1 + 1, y1: line.y1 - 1, x2: line.x2, y2: line.y2},
                    line3: {x1: line.x1 + 1, y1: line.y1, x2: line.x2, y2: line.y2 + 1}
                },
                down: { // square "n" shape
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1 - 1, x2: line.x2 - 1, y2: line.y2},
                    line3: {x1: line.x1 - 1, y1: line.y1, x2: line.x2 - 1, y2: line.y2},
                },
                up: { // square "u" shape
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1, x2: line.x2 - 1, y2: line.y2 + 1},
                    line3: {x1: line.x1 - 1, y1: line.y1, x2: line.x2 - 1, y2: line.y2},
                }
            }


            this.#clickedLines.forEach(l => {
                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.left.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.left.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.left.line3)
                ){
                    leftValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.right.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.right.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.right.line3)
                ){
                    rightValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.up.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.up.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.up.line3)
                ){
                    upValid.push(l);
                }

                if(
                    this.#isEqualLine(l.line, goingToBeSquareLines.down.line1) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.down.line2) ||
                    this.#isEqualLine(l.line, goingToBeSquareLines.down.line3)
                ){
                    downValid.push(l);
                }
            });

            console.log(goingToBeSquareLines);
        }

        console.log('upValid', upValid);
        console.log('downValid', downValid);
        console.log('rightValid', rightValid);
        console.log('leftValid', leftValid);
    }

    #lineType(line){
        if(line.x1 == line.x2) return Board.LineType.vertical;
        if(line.y1 == line.y2) return Board.LineType.horizontal;
    }

    #isEqualLine(line1, line2){
        if(!(line1 || line2)) return false;
        return (line1.x1 == line2.x1 && 
                line1.y1 == line2.y1 && 
                line1.x2 == line2.x2 && 
                line1.y2 == line2.y2) || 
               (line1.x1 == line2.x2 && 
                   line1.y1 == line2.y2 && 
                   line1.x2 == line2.x1 && 
                   line1.y2 == line2.y1);
    }

    #getLinkedLines(line){
        let linkedLine = [];
        this.#clickedLines.forEach(l => {
            if((line.x1 == l.line.x1 && line.y1 == l.line.y1) || (line.x2 == l.line.x2 && line.y2 == l.line.y2) ||
            (line.x1 == l.line.x2 && line.y1 == l.line.y2) || (line.x2 == l.line.x1 && line.y2 == l.line.y1)) 
                linkedLine.push(l);
        });
        return linkedLine;
    }

    #findCenterPointOfSquareLines(lines){
        let minX, 
            minY, 
            maxX, 
            maxY;

        for(let i = 0; i < lines.length; i++){
            let xpos = [lines[i].x1, lines[i].x2].sort();
            let ypos = [lines[i].y1, lines[i].y2].sort();

            if(i == 0){
                minX = xpos[0];
                minY = ypos[0];
                maxX = xpos[xpos.length - 1];
                maxY = ypos[ypos.length - 1];
            }else{
                if(minX > xpos[0]) minX = xpos[0];
                if(minY > ypos[0]) minY = ypos[0];
                if(maxX < xpos[xpos.length - 1]) maxX = xpos[xpos.length - 1];
                if(maxY < ypos[ypos.length - 1]) maxY = ypos[ypos.length - 1];
            }
        }
        return {
            x: minX + ((maxX - minX) / 2),
            y: minY + ((maxY - minY) / 2)
        }
    }

    #hasLine(line){
        for(let i = 0; i < this.#clickedLines.length; i++ ){
            if(this.#isEqualLine(this.#clickedLines[0].line, line))
                return true;
        }
        return false;
    }

    nextTurn(){
        if(this.players == this.#turns){
            this.#turns = 1;
        }else{
            this.#turns++;
        }
    }

    click(event){
        const self = this;
        const line = this.#findJointPointsFromPexelPosition(event);
        console.log('click called', line);
        if(line){
            if(this.#hasLine(line)) return;
            this.#clickedLines.push({
                line: line,
                player: this.players
            });

            const validLine = this.#checkValidBox(line);
            console.log(validLine);
            if(validLine.isValidSquare){
                validLine.validSquare.forEach(square => {
                    const centerPoint = this.#findCenterPointOfSquareLines(square.side.map(s => s.line));
                    self.#completedSquarePoints.push({
                        point: centerPoint,
                        player: this.#turns
                    });
                });

                if(validLine.isGoingToValidSquare){
                    validLine.goingToBeSquare.forEach(square => {
                        console.log((square.needSide[0].x1), (square.needSide[0].y1),
                        (square.needSide[0].x1) * self.#xGap, (square.needSide[0].y1) * self.#yGap, self.#xGap, self.#yGap);
                        self.click({
                            ...event,
                            clientX: (square.needSide[0].x1) * self.#xGap, // 236
                            clientY: (square.needSide[0].y1) * self.#yGap // 331
                        });
                    });
                }
            }
            this.nextTurn();
            this.draw();
        }
    }

    mousemove(event){
        this.draw(event);
    }


    setDimension(width, height){
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.#xGap = this.width / this.row;
        this.#yGap = this.height / this.col;

        this.draw();
    }

    setBoardSize(row, col){
        this.#xGap = this.width / this.row;
        this.#yGap = this.height / this.col;

        this.draw();
    }
}