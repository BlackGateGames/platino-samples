
// Prepare the game
var game = Alloy.Globals.Platino.createGameView();
game.fps = 60;
game.color(0, 0, 0);
game.debug = false;
game.enableOnDrawFrameEvent = false;
game.screen = {width: 1138, height: 640};

// Loads HomeScene.js as starting point to the app
game.addEventListener('onload', function(e) {
	var HomeScene = require("HomeScene");
	game.currentScene = new HomeScene($.win, game);

	// push loading scene and start the game
	game.pushScene(game.currentScene);
	game.start();
});

// Free up game resources when window is closed
$.win.addEventListener('close', function(e) {
	game = null;
});

// Launch
$.win.add(game);
$.win.open();
