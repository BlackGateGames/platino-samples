// Start place of your application. Generally used for control of the scene setup and general game flow.

// Create and set up the game
var game = Alloy.Globals.Platino.createGameView();
game.fps = 30;
game.color(0, 0, 0);
game.debug = false; // disables debug logs (not to be used for production)
game.screen = {width: 320, height: 480};
game.orthographicMode = Alloy.Globals.Platino.ORTHOGRAPHIC_MODE_FIT;
game.enableOnDrawFrameEvent = true;

// Load the scene and start the game
game.addEventListener('onload', function(e) {
	var scene = require("scenes/ExampleScene");
	game.pushScene(new scene(game));
	game.start();
});

// The game is what you get back by requiring this. It is used by the window controller.
module.exports = game;
