(function() {
	var platino = require('io.platino');

	var MainScene = function(window, game) {
		var scene = platino.createScene();
		
		var blue = null,
			red = null,
			green = null;
			
		// Report touch events here
		var onSpriteTouch = function(e) {
			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
		};
		
		var onSceneActivated = function(e) {
			// ---- create sprites, add listeners, etc. ----

			Ti.API.info("MainScene has been activated.");
			
			blue = platino.createSprite({
				width: 64,
				height: 64,
				x: 10,
				y: 100
			});
			blue.color(0, 0, 1.0);
			blue.name = 'BLUE';
			
			red = platino.createSprite({
				width: 64,
				height: 64,
				x: 100,
				y: 200
			});
			red.color(1.0, 0, 0);
			red.name = 'RED';

			green = platino.createSprite({
				width: 64,
				height: 64,
				x: 200,
				y: 300
			});
			green.color(0, 1.0, 0);
			green.name = 'GREEN';
			
			scene.add(blue);
			scene.add(red);
			scene.add(green);
			
			// add touch events to sprites
			blue.addEventListener('touchstart', onSpriteTouch);
			blue.addEventListener('touchend', onSpriteTouch);
			red.addEventListener('touchstart', onSpriteTouch);
			red.addEventListener('touchend', onSpriteTouch);
			green.addEventListener('touchstart', onSpriteTouch);
			green.addEventListener('touchend', onSpriteTouch);
		};

		var onSceneDeactivated = function(e) {

			// ---- remove sprites, listeners, etc. ----

			Ti.API.info("MainScene has been deactivated.");
			
			if (blue) {
				scene.remove(blue);
				blue.removeEventListener('touchstart', onSpriteTouch);
				blue.removeEventListener('touchend', onSpriteTouch);
				blue = null;
			}

			if (red) {
				scene.remove(red);
				red.removeEventListener('touchstart', onSpriteTouch);
				red.removeEventListener('touchend', onSpriteTouch);
				red = null;
			}

			if (green) {
				scene.remove(green);
				green.removeEventListener('touchstart', onSpriteTouch);
				green.removeEventListener('touchend', onSpriteTouch);
				green = null;
			}

			touchable = null;

			scene.dispose();
		};

		scene.addEventListener('activated', onSceneActivated);
		scene.addEventListener('deactivated', onSceneDeactivated);
		return scene;
	};

	module.exports = MainScene;
}).call(this);
