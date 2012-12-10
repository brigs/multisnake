var SNAKE = (function(s, GRAPHICS) {
	//Public object
	var s = {};
	s.version = "0.1";
	s.snakes = [];
	s.snake = {};
	//Private game vars
	var GAMEBOARD_XSIZE = 50;
	var GAMEBOARD_YSIZE = 50;
	var GAME_SPEED = 50;
	var START_FOOD = 1;
	var gameBoard;
	var SCORE = 0;
	
	var lastEatTime = 0;
	
	//Keyboard
	var KEYCODE_UP = 38;
	var KEYCODE_DOWN = 40;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_R = 82;
	var KEYCODE_P = 80;
	var KEYCODE_SPACE = 32;
	var KEYCODE_ENTER = 13;
	var KEYCODE_PLUS = 187;
	var KEYCODE_MINUS = 189;
	
	//Game state
	s.headings = {
		north: [0,-1],
		east: [-1,0],
		south: [0,1],
		west:[1,0]
	}
	s.currentHeading = {};
	var gamePaused = true;
	var snakeIsUpdating = false;
	
	//Snake
	//s.snake;
	var INIT_SNAKE_LENGTH = 3;
	var snakePart = function(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.snake = true;
	};
	
	//Food
	var foodItem = function(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.food = true;
	}
	
	//Init game
	s.init = function(players) {
		s.currentHeading = s.headings.north;
		createGameBoard(GAMEBOARD_XSIZE, GAMEBOARD_YSIZE);
		console.log(players);

		for (var key in players) {
			var player = (players[key]);
			createSnake(INIT_SNAKE_LENGTH, player.posX, player.posY, player.direction);
		}

        

		//createSnake(INIT_SNAKE_LENGTH);
		initFoods(START_FOOD);
		initKeyboard();
		gameScore = 0;
		lastEatTime = new Date();
		updateGameScore();
		console.log("SNAKE init done");
	}
	
	function createGameBoard(sizeX, sizeY) {
		gameBoard = []; 
		for (i=0; i < sizeX; ++i) {
			gameBoard[i] = [];
		}
	}
	
	function createSnake(length, posX, posY, direction) {
				
		var snake = [];
		for (i=0; i < length; i++) {
			var x = (posX)+(i*direction[0]);
			var y = (posY)+(i*direction[1]);
			
			newSnakePart = new snakePart(x, y);

			snake.push(newSnakePart);
			
			gameBoard[newSnakePart.posX][newSnakePart.posY] = newSnakePart;
			console.log("snakePart created @" + newSnakePart.posX + "," + newSnakePart.posY);
		}
		s.snakes.push(snake);
	}
	
	s.addFood = function(posX,posY) {
		console.log("adding food @", posX, posY);
		if(typeof(gameBoard[posX][posY]) !== "undefined") { 
			console.log("addFood failed! Something (food, snake) already exists at pos", posX, posY, gameBoard[posX][posY]);
			return false;
		}
		else {
			var food = new foodItem(posX, posY);
			gameBoard[posX][posY] = food;
			return food;
		}
	}
	
	s.eatFood = function(posX, posY) {
		if(typeof(gameBoard[posX][posY]) !== "undefined") {
			if(typeof(gameBoard[posX][posY].food) === "boolean") {
				gameBoard[posX][posY] = undefined;
				for(i=0;i < SNAKE.food.length;i++) {
					if(typeof(SNAKE.food[i]) === "object") { 
						if(SNAKE.food[i].posX === posX && SNAKE.food[i].posY === posY) {
							//console.log("food removed from index", i, SNAKE.food[i]);
							SNAKE.food[i] = undefined;
						}
					}
				}
				
				var penalty = Math.min(Math.max((new Date() - lastEatTime), 0), 10000);
				gameScore += 10000 - penalty;

				lastEatTime = new Date();
				updateGameScore();
				initFoods(1);
				//Draw food
				for (i=0; i < SNAKE.food.length; ++i) {
					GRAPHICS.drawBox(SNAKE.food[i].posX,SNAKE.food[i].posY, "blue");
				}
				//console.log("food eaten @", posX, posY);
			}
			else {
				console.log("WTF: Trying to eat food at empty or snake pos?");
			}
		}
	}
	
	function initFoods(items) {
		s.food = [];
		for(i=0;i < items;i++) {
			var randPosX = Math.round(Math.random()*(GAMEBOARD_XSIZE-2));
			var randPosY = Math.round(Math.random()*(GAMEBOARD_XSIZE-2));
			s.food.push(s.addFood(randPosX, randPosY));
		}
	}
	
	s.getGameboardSize = function() {
		return {
			xSize: GAMEBOARD_XSIZE,
			ySize: GAMEBOARD_YSIZE
		}
	}
	
	function initKeyboard() {
		//Keyboard handling
		$(document).unbind("keydown");
		$(document).keydown(function(event) {
			switch(event.keyCode) {
				case KEYCODE_UP:
					if(!gamePaused && s.currentHeading !== s.headings.south && !snakeIsUpdating) {
						s.currentHeading = s.headings.north;
						// PUSH STATE TO SERVER
					}
					break;
				case KEYCODE_DOWN:
					if(!gamePaused && s.currentHeading !== s.headings.north && !snakeIsUpdating) { 
						s.currentHeading = s.headings.south;
						// PUSH STATE TO SERVER
					}
					break;
				case KEYCODE_LEFT:
					if(!gamePaused && s.currentHeading !== s.headings.west && !snakeIsUpdating) { 
						s.currentHeading = s.headings.east;
						// PUSH STATE TO SERVER
					}
					break;	
				case KEYCODE_RIGHT:
					if(!gamePaused && s.currentHeading !== s.headings.east && !snakeIsUpdating) { 
						s.currentHeading = s.headings.west;
						// PUSH STATE TO SERVER
					}
					break;
				case KEYCODE_R:
					console.log("R PRESSED");
					s.restart();
					break;	
				case KEYCODE_SPACE:
					console.log("SPACE PRESSED");
					if(gamePaused) {
						s.play();
					}else {
						s.pause();
					}
					break;
				case KEYCODE_ENTER:
					console.log("ENTER PRESSED");
					if(gamePaused) {
						s.play();
					}else {
						// PUSH STATE TO SERVER TO TELL OTHERS THAT GAME IS PAUSED
						s.pause();
					}
					break;	
				case KEYCODE_P:
					console.log("P PRESSED");
					if(gamePaused) {
						s.play();
					}else {
						// PUSH STATE TO SERVER TO TELL OTHERS THAT GAME IS PAUSED
						s.pause();
					}
					break;
			}
		});
	}
	
	s.play = function() {
		console.log("PLAY");
		s.gameTimer = setInterval(function() {
			updateSnakePosition();
		}, GAME_SPEED);
		gamePaused = false;
	}
	
	s.pause = function() {
		console.log("PAUSE");
		clearInterval(s.gameTimer);
		gamePaused = true;
	};
	
	s.restart = function() {
		console.log("RESTART");
		s.init();
		GRAPHICS.init();
	}
	
	function gameOver() {
		GRAPHICS.drawEndScreen("black", gameScore);
		s.pause();
		alert("GAME OVER - SCORE:" + gameScore);
		s.restart();
	}
	
	function updateSnakePosition() {
		snakeIsUpdating = true;
		var currentHead = SNAKE.snake[SNAKE.snake.length-1];

		if(
			//Wall collision
			currentHead.posX+1 === SNAKE.getGameboardSize().xSize ||
			currentHead.posY+1 === SNAKE.getGameboardSize().ySize ||
			currentHead.posX === 0 ||
			currentHead.posY === 0) {
			
			gameOver();
		}
		else {
			//Wall not hit, check if snake itself or food is it
			var destinationPosX = currentHead.posX + s.currentHeading[0];
			var destinationPosY = currentHead.posY + s.currentHeading[1];

			if(typeof(gameBoard[destinationPosX][destinationPosY]) !== "undefined") {
				if(typeof(gameBoard[destinationPosX][destinationPosY].snake) === "boolean") {
					gameOver();
				}
				else if(typeof(gameBoard[destinationPosX][destinationPosY].food) === "boolean") {
					s.eatFood(destinationPosX, destinationPosY);
					var newSnakeHead = new snakePart(0,0);
				}
			}
			
			else {
				var newSnakeHead = SNAKE.snake.shift();
				GRAPHICS.clearBox(newSnakeHead.posX, newSnakeHead.posY); //Remove tail graphically
				gameBoard[newSnakeHead.posX][newSnakeHead.posY] = undefined; //Clear tail from gameBoard
			}

			newSnakeHead.posX = destinationPosX;
			newSnakeHead.posY = destinationPosY;
			SNAKE.snake.push(newSnakeHead);
			gameBoard[newSnakeHead.posX][newSnakeHead.posY] = newSnakeHead;
			GRAPHICS.drawBox(newSnakeHead.posX, newSnakeHead.posY, "black");
			snakeIsUpdating = false;
		}
	}
	
	function updateGameScore() {
		$(".gameScore").html(gameScore);
	}
	
	return s;
})(SNAKE || {}, GRAPHICS);