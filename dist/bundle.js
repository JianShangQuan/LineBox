/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/***/ ((module) => {

eval("module.exports = class Board{\r\n\r\n    constructor(options){\r\n        this.width = options.width;\r\n        this.height = options.height;\r\n        this.row = options.row;\r\n        this.col = options.col;\r\n        this.ctx = options.ctx;\r\n        this.canvas = options.canvas;\r\n\r\n        this.#init();        \r\n    }\r\n\r\n    #init(){\r\n        this.canvas.width = this.width;\r\n        this.canvas.height = this.height;\r\n    }\r\n\r\n    draw(event = null){\r\n        this.ctx.clearRect(0, 0, this.width, this.height);\r\n        let xGap = this.width / this.row;\r\n        let yGap = this.height / this.col;\r\n\r\n        if(event){\r\n\r\n            let react = this.canvas.getBoundingClientRect();            \r\n            let hoverX = (event.clientX - react.left + xGap / 2) / xGap;\r\n            let hoverY = (event.clientY - react.top + yGap / 2) / yGap;\r\n\r\n            console.log(\"x\", hoverX, 'y', hoverY);\r\n\r\n\r\n            // if(hoverY > 1 && hoverX - Math.floor(hoverX) > 0.85 && hoverY < this.col){\r\n            //     this.ctx.beginPath();\r\n            //     this.ctx.moveTo(Math.floor(hoverX) * xGap + (xGap / 2) , Math.floor(hoverY) * yGap + (yGap / 2)); \r\n            //     this.ctx.lineTo(Math.floor(hoverX) * xGap + (xGap / 2) , (Math.floor(hoverY) - 1) * yGap + (yGap / 2));\r\n            //     this.ctx.stroke();\r\n            //     this.ctx.closePath();\r\n            // }else \r\n            if(hoverX > 1 && ((hoverY - Math.floor(hoverY) > 0.85) || hoverY - Math.floor(hoverY) < 0.2) && hoverX < this.row){\r\n                let flag = hoverY - Math.floor(hoverY) < 0.2;\r\n\r\n                this.ctx.beginPath();\r\n                this.ctx.moveTo(Math.floor(hoverX) * xGap + (xGap / 2) , Math.floor(hoverY) * yGap + (yGap / 2)); \r\n                this.ctx.lineTo((Math.floor(hoverX) - 1) * xGap + (xGap / 2) , Math.floor(hoverY) * yGap + (yGap / 2));\r\n                this.ctx.stroke();\r\n                this.ctx.closePath();\r\n            }\r\n\r\n        }\r\n\r\n        for(let i = 0; i < this.row; i ++){\r\n            for(let j = 0; j < this.col; j++){\r\n                this.ctx.beginPath();\r\n                this.ctx.arc((i * xGap) + (xGap / 2), (j * yGap) + (yGap / 2), (this.width / 95) , 0, 2 * Math.PI);\r\n                this.ctx.fillStyle = '#000000';\r\n                this.ctx.fill();\r\n            }\r\n        }\r\n    }\r\n\r\n    mousemove(event){\r\n        this.draw(event);\r\n    }\r\n\r\n    addLine(point1, point2){\r\n\r\n    }\r\n\r\n    setDimension(width, height){\r\n        this.width = width;\r\n        this.height = height;\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.draw();\r\n    }\r\n}\n\n//# sourceURL=webpack://linebox-2/./src/board.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const Board = __webpack_require__(/*! ./board */ \"./src/board.js\");\r\n\r\n\r\n\r\n\r\nconst board = document.getElementById('board');\r\nconst ctx = board.getContext('2d');\r\nconst BoardController = new Board({\r\n    width: 400,\r\n    height: 400,\r\n    row: 10, \r\n    col: 10,\r\n    ctx: ctx,\r\n    canvas: board\r\n});\r\n\r\n\r\n\r\nboard.addEventListener('mousemove', e => {\r\n    BoardController.mousemove(e);\r\n});\r\n\r\n\r\n\r\n\r\n\r\n(function init(){\r\n    BoardController.draw();\r\n})();\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// ctx.beginPath();\r\n// ctx.arc(20,20, 10,0,2*Math.PI);\r\n// ctx.fillStyle = '#000000';\r\n// ctx.fill();\r\n\r\n// ctx.beginPath();\r\n// ctx.moveTo(10, 10);\r\n// ctx.lineTo(20, 20);\r\n// ctx.stroke();\r\n// ctx.closePath();\r\n\r\n\r\n\r\n\r\nwindow.addEventListener('resize', function(event) {\r\n    console.log('resize');\r\n    BoardController.setDimension(window.innerWidth / 2, window.innerHeight / 2);\r\n}, true);\n\n//# sourceURL=webpack://linebox-2/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;