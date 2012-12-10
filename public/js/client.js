$(document).ready(function() {
	SNAKE.init({

			length : 3,
			posX : 10,
			posY : 20,
			direction : [0, 1]
		
	});
	

	if(GRAPHICS.init()) {
		console.log("GRAPHICS init ok! yay!");
	}
	else {
		//displayMessage("Your browser does not seem to support HTML5 canvas...");
	}

	var socket = io.connect('http://localhost');
	socket.on('players', function(players) {
		console.log(players);
	})
});