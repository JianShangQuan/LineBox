module.exports = class Board{

    #xGap;
    #yGap;
    #clickedLines = [];
    #completedSquarePoints = [];
    #turns = 1;
    #playMode = null;
    #gameStarted = false;
    #waitingOpponent = false;

    static LineType = Object.freeze({
        horizontal: 'horizontal',
        vertical: 'vertical'
    });

    static PlayMode = Object.freeze({
        online: 'online', 
        local: 'local'
    })

    constructor(options){
        this.gameId = options.gameId;

        this.width = options.width;
        this.height = options.height;
        this.row = options.row;
        this.col = options.col;
        this.ctx = options.ctx;
        this.canvas = options.canvas;
        this.threshold = 0.1;

        this.players = options.players.length;
        this.playerConfig = options.players;
        this.#playMode = options.playMode;

        this.#xGap = this.width / this.row;
        this.#yGap = this.height / this.col;

        this.events = options.events;

        this.#init();        
    }

    draw(event = null){
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.#drawHover(event);
        this.#drawClickline();
        this.#drawCompleteSquareDots();
        this.#drawDots();
    }

    #init(){
        const self = this;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.events.init({
            players: self.playerConfig.map((player, index) => { return {...player, id: index + 1}})
        });

        this.draw();

        if(this.row < 2 || this.col < 2) throw new Error('A board must have at least 2x2');
    }

    #drawDots(){
        for(let i = 0; i < this.row; i ++){
            for(let j = 0; j < this.col; j++){
                this.ctx.beginPath();
                this.ctx.arc((i * this.#xGap) + (this.#xGap / 2), (j * this.#yGap) + (this.#yGap / 2), (Math.min(this.width, this.height) / 95) , 0, 2 * Math.PI);
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
            let react = this.canvas.getBoundingClientRect();            
            let hoverX = (event.clientX - react.left + xGap / 2) / xGap;
            let hoverY = (event.clientY - react.top + yGap / 2) / yGap;

            const floorX = Math.floor(hoverX);
            const floorY = Math.floor(hoverY);

            // console.log("x", hoverX, 'y', hoverY, event.type, "x floor", floorX, "y floor", floorY);


            if(hoverY > 1 && 
                (hoverX - floorX > (1 - this.threshold) || hoverX - floorX < this.threshold) && hoverY < this.col){

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

                let x = floorX + 0.5;

                let y1 = (floorY - 1) + 0.5;
                let y2 = floorY + 0.5;

                if(hoverX - floorX < this.threshold) x = x - 1;

                return {
                    x1: x, 
                    y1: y1,
                    x2: x, 
                    y2: y2 
                }
            }else if(hoverX > 1 && 
                (hoverY - floorY > (1 - this.threshold) || hoverY - floorY < this.threshold) && hoverX < this.row){


                // for horizontal line "--"
                // in horizonal "Y" position are same
                //
                //   (x1, y1)                 (x2, y2)
                //      o=======================o
                //

                let x1 = (floorX - 1) + 0.5;
                let x2 = floorX + 0.5;
                
                let y = floorY + 0.5;

                if(hoverY - floorY < this.threshold) y = y - 1;

                return {
                    x1: x1, 
                    y1: y,  
                    x2: x2, 
                    y2: y 
                }
            }

            return null;
        }
    }

    #drawHover(event){

        if(this.#playMode == Board.PlayMode.online){
            if(this.#waitingOpponent) return;
        }

        const line = this.#findJointPointsFromPexelPosition(event);
        if(line){
            console.log(event.clientX, event.clientY);

            this.canvas.style.cursor = 'pointer';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1 * this.#xGap, line.y1 * this.#yGap); 
            this.ctx.lineTo(line.x2 * this.#xGap, line.y2 * this.#yGap);
            this.ctx.stroke();
            this.ctx.closePath();
        }else{
            this.canvas.style.cursor = 'default';
        }
    }

    #drawClickline(){
        // console.log(this.#clickedLines);
        this.ctx.lineWidth = Math.min(this.width, this.height) * 0.008;
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
            this.ctx.arc(p.point.x * this.#xGap, p.point.y * this.#yGap, Math.min(this.#xGap, this.#yGap) * 0.3 , 0, 2 * Math.PI);
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
                    line2: {x1: line.x1, y1: line.y1, x2: line.x1, y2: line.y1 + 1},
                    line3: {x1: line.x1, y1: line.y1 + 1, x2: line.x2, y2: line.y2 + 1},
                    line4: {x1: line.x2, y1: line.y2, x2: line.x2, y2: line.y2 + 1}
                },
                up: {
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1 - 1, x2: line.x1, y2: line.y1},
                    line3: {x1: line.x2, y1: line.y2 - 1, x2: line.x2, y2: line.y2},
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
                    for(let i = 0; i < upValid.length; i++)
                        if(self.#isEqualLine(l, upValid[i].line)) return false;
                    return true;
                })
            });
            if(downValid.length == 3) goingToBeSquare.push({
                side: downValid, 
                type: 'down',
                needSide: Object.values(squareLines.down).filter((l, index) => {
                    for(let i = 0; i < downValid.length; i++)
                        if(self.#isEqualLine(l, downValid[i].line)) return false;
                    return true;
                })
            });

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
                    line2: {x1: line.x1 - 1, y1: line.y1, x2: line.x1, y2: line.y1},
                    line3: {x1: line.x2 - 1, y1: line.y2, x2: line.x2, y2: line.y2},
                    line4: {x1: line.x1 - 1, y1: line.y1, x2: line.x2 - 1, y2: line.y2},
                },
                right: {
                    line1: line,
                    line2: {x1: line.x1, y1: line.y1, x2: line.x2 + 1, y2: line.y1},
                    line3: {x1: line.x2, y1: line.y2, x2: line.x2 + 1, y2: line.y2},
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
                    for(let i = 0; i < leftValid.length; i++)
                        if(self.#isEqualLine(l, leftValid[i].line)) return false;
                    return true;
                })
            });
            if(rightValid.length == 3) goingToBeSquare.push({
                side: rightValid, 
                type: 'right',
                needSide: Object.values(squareLines.right).filter((l, index) => {
                    for(let i = 0; i < rightValid.length; i++)
                        if(self.#isEqualLine(l, rightValid[i].line)) return false;
                    return true;
                })
            });

            return {
                isValidSquare: isValidSquare,
                validSquare: validSquare,
                isGoingToValidSquare: goingToBeSquare.length > 0,
                goingToBeSquare: goingToBeSquare
            }
        }
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
            if(this.#isEqualLine(this.#clickedLines[i].line, line))
                return true;
        }
        return false;
    }

    startGame(){
        this.#gameStarted = true;
    }

    pauseGame(){
        this.#gameStarted = false;
    }

    nextTurn(id){
        const self = this;
        id && (this.#turns = id);
        const previousPlayer = this.#turns;

        if(this.players == this.#turns || !this.#turns){
            this.#turns = 1;
        }else{
            this.#turns++;
        }
        this.events?.onPlayerChanged && this.events?.onPlayerChanged(
            {
                ...this.playerConfig[previousPlayer - 1],
                score: self.getPlayerScores(previousPlayer),
                id: previousPlayer
            },
            {
                ...this.playerConfig[this.#turns - 1], 
                score: self.getPlayerScores(this.#turns),
                id: this.#turns
            } 
        );
        return {
            ...this.playerConfig[this.#turns - 1], 
            score: self.getPlayerScores(this.#turns),
            id: this.#turns
        }
    }

    click(event){

        if(this.#playMode == Board.PlayMode.online){
            if(this.#waitingOpponent) return;
        }

        const self = this;
        const line = this.#findJointPointsFromPexelPosition(event);

        if(line){
            if(this.#hasLine(line)) return;
            this.#clickedLines.push({
                line: line,
                player: this.#turns
            });

            const validLine = this.#checkValidBox(line);
            if(validLine.isValidSquare){
                validLine.validSquare.forEach(square => {
                    const centerPoint = self.#findCenterPointOfSquareLines(square.side.map(s => s.line));
                    self.#completedSquarePoints.push({
                        point: centerPoint,
                        player: this.#turns
                    });
                });

                if(validLine.isGoingToValidSquare){
                    const react = self.canvas.getBoundingClientRect();
                    console.log('validation', validLine);
                    validLine.goingToBeSquare.forEach((square, index) => {
                        const ob = {
                            ...event,
                            clientX: (((square.needSide[index].x1 + square.needSide[index].x2) / 2) * self.#xGap) + react.left, // 236
                            clientY: (((square.needSide[index].y1 + square.needSide[index].y2) / 2) * self.#yGap) + react.top // 331
                        };
                        console.log('square', ob.clientX, ob.clientY);
                        self.click(ob);
                    });
                    return;
                }
            }
            this.events?.onClick && this?.events?.onClick(line);
            this.nextTurn();
            this.draw();
            this.canvas.style.cursor = 'default';
            this.#waitingOpponent = true;
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

    getPlayerScores(playerId){
        return this.#completedSquarePoints.filter(completed => {
            return completed.player == playerId;
        }).length;
    }

    get currentPlayer(){
        return {
            id: this.#turns,
            player: this.playerConfig[this.#turns - 1]
        };
    }


    get clickLines(){
        return this.#clickedLines;
    }

    get completeSquarePoints(){
        return this.#completedSquarePoints;
    }

    get playMode(){
        return this.#playMode;
    }

    get isWaitingOpponent(){
        return this.#waitingOpponent;
    }


    joinOpponent(){
        this.#waitingOpponent = true;
        return this;
    }

    
    updateDataFromOpponent(clickLines, completedDots){
        if(this.#clickedLines.length == 0 || this.clickLines.length != clickLines.length){
            this.#clickedLines = clickLines;
            this.#completedSquarePoints = completedDots;
            console.log('clickLines', clickLines);
            this.draw();
            this.nextTurn(clickLines[clickLines.length - 1].player);
            this.#waitingOpponent = false;
        }
    }


    dispose(){
        this.events.dispose();
        this.#clickedLines = [];
        this.#completedSquarePoints = [];
        this.#gameStarted = false;
        this.#waitingOpponent = false;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.players = [];
    }
}