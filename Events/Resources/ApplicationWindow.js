var platino = require('co.lanica.platino');

(function() {
	var ApplicationWindow = function() {
		var window = Ti.UI.createWindow({
			backgroundColor: 'black',
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT], //others: Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT
			fullscreen: true,
			navBarHidden: true
		});

		var game = platino.createGameView();
		game.fps = 30;
		game.color(0, 0, 0);
		game.debug = false; // disables debug logs (not to be used for production)

		// Set your target screen resolution (in points) below
		// Set your target screen resolution (in points) below
		var screenHeight = Ti.Platform.displayCaps.platformHeight;
		if (screenHeight >= 568) {
			screenHeight = 568;
		} else {
			screenHeight = 480;
		}
		
		game.TARGET_SCREEN = {
			width: 320,
			height: screenHeight
		}

		// Updates screen scale
		var updateScreenSize = function() {
			var screenScale = game.size.height / game.TARGET_SCREEN.height;
			game.screen = {
				width: game.size.width / screenScale,
				height: game.size.height / screenScale
			};
		};

		// Loads MainScene.js as starting point to the app
		game.addEventListener('onload', function(e) {
			updateScreenSize();

			var MainScene  = require("MainScene");
			game.currentScene = new MainScene(window, game);

			// push loading scene and start the game
			game.pushScene(game.currentScene);
			game.start();
		});

		game.addEventListener('onsurfacechanged', function(e) {
				game.orientation = e.orientation;
				updateScreenSize();
		});
		
		// Free up game resources when window is closed
		window.addEventListener('close', function(e) {
			game = null;
		});

		window.add(game);
		return window;
	};

	module.exports = ApplicationWindow;
})();