var Platino = require('co.lanica.platino');

// Main application window class
(function() {
	var ApplicationWindow = function() {
		var window = Ti.UI.createWindow({
			backgroundColor: 'black',
			orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
			fullscreen: true,
			navBarHidden: true,
			exitOnClose:true
		});

		// Game setup
		var game = Platino.createGameView();
		game.fps = 30;
		game.color(0, 0, 0);
		game.debug = true;
		
		// Loads our scene, launches the game
		game.addEventListener('onload', function(e) {
			game.screen = {width: 480, height: 320};	// Fixed resolution
			game.registerForMultiTouch();	// Up to two touches at once are handled in this sample

			// Bring in the main scene
			var MainScene = require("MainScene");
			game.currentScene = new MainScene(window, game);
			game.pushScene(game.currentScene);
			
			// Begin
			game.start();
		});
		
		// Free up game resources when window is closed
		window.addEventListener('close', function(e) {
			game = null;
		});
		
		// Return the prepared window
		window.add(game);
		return window;
	};
	
	// Export as class (module) type
	module.exports = ApplicationWindow;
})();
