$(document).ready(function() {
	var socket = io.connect('http://localhost');
	
	socket.on('player', function(player) {
		SNAKE.init(socket, player);
		if(GRAPHICS.init()) {
			console.log("GRAPHICS init ok! yay!");
		}
		else {
			//displayMessage("Your browser does not seem to support HTML5 canvas...");
		}
	});

	socket.on('players', function(players) {
		//console.log(players);
	});
});