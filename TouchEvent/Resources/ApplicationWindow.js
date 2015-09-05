var Platino = require('io.platino');

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
		
		var outerLayout = Ti.UI.createView({backgroundColor: 'black', layout: 'relative'});
		window.add(outerLayout);
		
		var layout = Ti.UI.createView({backgroundColor: 'black', layout: 'vertical'});
		outerLayout.add(layout);

		var sceneInfo = Ti.UI.createView({borderRadius:"20", borderWidth:"5", backgroundColor:"#F3EAEA", borderColor:"#8A2E2E", width:"95%", height:"10%"});
		var label = Ti.UI.createLabel({text: "hi", color: "black", textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER});
		sceneInfo.add(label);
		
		// Game setup
		var game = Platino.createGameView({height:"90%"});
		
		game.fps = 30;
		game.color(0, 0, 0);
		game.debug = true;
		game.usePerspective = true;
		
		var updateSceneName = function(e) {
			label.text = (game.topScene() == game.scene1) ? "scene 1" : "scene 2";
		};
		
		// Loads our scene, launches the game
		game.addEventListener('onload', function(e) {
			game.screen = {width: 480, height: 320};	// Fixed resolution
			game.registerForMultiTouch();	// Up to two touches at once are handled in this sample
			
			var MainScene = require("MainScene");
			game.scene1 = new MainScene(window, game, "sprites/bg.png", outerLayout);
			game.scene2 = new MainScene(window, game, "sprites/bg2.png", outerLayout);
			
			game.scene1.addEventListener("activated", updateSceneName);
			game.scene2.addEventListener("activated", updateSceneName);

			game.pushScene(game.scene1);
			
			// Begin
			game.start();
			
		});
		
		// Free up game resources when window is closed
		window.addEventListener('close', function(e) {
			game = null;
		});
		
		// Return the prepared window
		layout.add(game);
		layout.add(sceneInfo);
		return window;
	};
	
	// Export as class (module) type
	module.exports = ApplicationWindow;
})();
