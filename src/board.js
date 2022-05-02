module.exports = class Board{

    constructor(options){
        this.width = options.width;
        this.height = options.height;
        this.row = options.row;
        this.col = options.col;
        this.ctx = options.ctx;
        this.canvas = options.canvas;

        this.#init();        
    }

    #init(){
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    draw(event = null){
        this.ctx.clearRect(0, 0, this.width, this.height);
        let xGap = this.width / this.row;
        let yGap = this.height / this.col;

        if(event){

            let react = this.canvas.getBoundingClientRect();            
            let hoverX = (event.clientX - react.left + xGap / 2) / xGap;
            let hoverY = (event.clientY - react.top + yGap / 2) / yGap;

            console.log("x", hoverX, 'y', hoverY);


            // if(hoverY > 1 && hoverX - Math.floor(hoverX) > 0.85 && hoverY < this.col){
            //     this.ctx.beginPath();
            //     this.ctx.moveTo(Math.floor(hoverX) * xGap + (xGap / 2) , Math.floor(hoverY) * yGap + (yGap / 2)); 
            //     this.ctx.lineTo(Math.floor(hoverX) * xGap + (xGap / 2) , (Math.floor(hoverY) - 1) * yGap + (yGap / 2));
            //     this.ctx.stroke();
            //     this.ctx.closePath();
            // }else 
            if(hoverX > 1 && ((hoverY - Math.floor(hoverY) > 0.85) || hoverY - Math.floor(hoverY) < 0.2) && hoverX < this.row){
                let flag = hoverY - Math.floor(hoverY) < 0.2;

                this.ctx.beginPath();
                this.ctx.moveTo(Math.floor(hoverX) * xGap + (xGap / 2) , Math.floor(hoverY) * yGap + (yGap / 2)); 
                this.ctx.lineTo((Math.floor(hoverX) - 1) * xGap + (xGap / 2) , Math.floor(hoverY) * yGap + (yGap / 2));
                this.ctx.stroke();
                this.ctx.closePath();
            }

        }

        for(let i = 0; i < this.row; i ++){
            for(let j = 0; j < this.col; j++){
                this.ctx.beginPath();
                this.ctx.arc((i * xGap) + (xGap / 2), (j * yGap) + (yGap / 2), (this.width / 95) , 0, 2 * Math.PI);
                this.ctx.fillStyle = '#000000';
                this.ctx.fill();
            }
        }
    }

    mousemove(event){
        this.draw(event);
    }

    addLine(point1, point2){

    }

    setDimension(width, height){
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.draw();
    }
}