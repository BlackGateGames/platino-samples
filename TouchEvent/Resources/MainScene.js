// Test Application for the Platino game engine
// Copyright 2015 BlackGate Games

var Platino = require('co.lanica.platino');

// Main Scene
(function() {
	var MainScene = function(window, game) {
		var scene = Platino.createScene();
		
		// These show where the user is touching the scene
		var touchMarkerA = null;
		var touchMarkerB = null;
		
		// A switch in the middle of the scene
		var testSwitch = null;
		
		// Buttons for the hud
		var button2D = null;
		var button3D = null;
		
		// Selected of the HUD buttons
		var selectedButton = null;
		
		// Used because of current issues with HUD. This is currently how you can handle them. 
		// Please be aware that API is subject to change to streamline the API for hud events
		var buttonContains = function(button, _x, _y) {
			var scale = game.screen.height / game.size.height;
			x = _x * scale;
			y = _y * scale;
			
			if((x >= button.x) && (y >= button.y)) {
				if(x <= (button.x + button.width)) {
					if(y <= (button.y + button.height)) {
						return true;
					}
				}
			}
			return false;
		};
		
		// Handle touch events to the HUD buttons via game touches themselves. This used to be the only way,
		// so this serves to show how such a method still works despite the scene and sprite event additions.
		var onGameTouch = function(e) {
			// For now we need to manually convert since HUD is not supported for touch events properly
			var touchScaleX = game.screen.width / game.size.width;
			var touchScaleY = game.screen.height / game.size.height;
			e.x *= touchScaleX;
			e.y *= touchScaleY;
			
			// Handle touch canceling on the buttons
			if(selectedButton && !buttonContains(selectedButton, e.x, e.y)) {
       			selectedButton.color(1, 1, 1);
       			selectedButton = null;
			} else {
				// Find pushed button (only handling for main touch event, not multitouch)
				if(buttonContains(button2D, e.x, e.y)) {
					selectedButton = button2D;
				} else if(buttonContains(button3D, e.x, e.y)) {
					selectedButton = button3D;
				} else
       				selectedButton = null;
       				
       			// Did a button get touched?
				if(selectedButton) {
					// Just gray out while touched
					if(e.type == 'touchstart') {
	           			selectedButton.color(0.5, 0.5, 0.5);
					} 
					// Highlight again when touch finished
					else if(e.type == 'touchend') {
	           			selectedButton.color(1, 1, 1);
	           			
	           			// ...and act upon the button
	       				if(selectedButton == button2D) {
							var transform_camera = Platino.createTransform();
							transform_camera.duration = 1000;
							transform_camera.easing = Platino.ANIMATION_CURVE_BACK_OUT;
							transform_camera.lookAt_centerY = game.screen.height / 2;
							game.moveCamera(transform_camera);
	       					
	       				} else {
							var transform_camera = Platino.createTransform();
							transform_camera.duration = 1000;
							transform_camera.easing = Platino.ANIMATION_CURVE_BACK_OUT;
							transform_camera.lookAt_centerY = game.screen.height / 4;
							game.moveCamera(transform_camera);
	       				}
					}
				}
			}
		};
		
		var onSceneTouch = function(e) {
			// While touching, show the markers that are relevant (up to two fingers)
			if((e.type == 'touchstart' ) || (e.type == 'touchmove')) {
				
				touchMarkerA.x = (e.x - (touchMarkerA.width / 2));
				touchMarkerA.y = (e.y - (touchMarkerB.height / 2));
				
				if(e.points[1]) {
					touchMarkerB.x = e.points[1].x - (touchMarkerB.width / 2);
					touchMarkerB.y = e.points[1].y - (touchMarkerB.height / 2);
					touchMarkerB.show();
				} else
					touchMarkerB.hide();
				
				touchMarkerA.show();
			} else {
				touchMarkerA.hide();
				touchMarkerB.hide();
			}
		};
		
		// Sprite specific events for the switch shown in the scene
		var onSwitchPushed = function(e) {
			testSwitch.frame = 1;
		};
		var onSwitchReleased = function(e) {
			testSwitch.frame = 2;
		};
		var onSwitchCancelled = function(e) {
			testSwitch.frame = 0;
		};
		
		var onSceneActivated = function(e) {
			game.addEventListener('touchstart', onGameTouch);
			game.addEventListener('touchend', onGameTouch);
			game.addEventListener('touchcancel', onGameTouch);
			
			// Background image
			bg = Platino.createSprite({image:"sprites/bg.png"});
			scene.add(bg);
			
			// Switch to be pressed - it goes center screen
			testSwitch = Platino.createSpriteSheet({image:"sprites/switch.png", width: 50, height: 50});
			testSwitch.x = (bg.width / 2) - (testSwitch.width / 2);
			testSwitch.y = (bg.height / 2) - (testSwitch.height / 2);
			testSwitch.frame = 2;
			scene.add(testSwitch);
			
			// Events on the switch - As you can see, you can do them separate, or you could do a switch statement on the event type in a
			// single function.
			testSwitch.addEventListener('touchstart', onSwitchPushed);
			testSwitch.addEventListener('touchend', onSwitchReleased);
			testSwitch.addEventListener('touchcancel', onSwitchCancelled);
			
			// Markers
			touchMarkerA = Platino.createSprite({image:"sprites/gametouch.png"});
			touchMarkerA.hide();
			scene.add(touchMarkerA);
			touchMarkerB = Platino.createSprite({image:"sprites/gametouch.png"});
			touchMarkerA.hide();
			scene.add(touchMarkerA);
			
			// Scene touching. Again, this is handled in a single function using case statements, whereas the button is separated.
			scene.addEventListener('touchstart', onSceneTouch);
			scene.addEventListener('touchmove', onSceneTouch);
			scene.addEventListener('touchend', onSceneTouch);
			
			// HUD buttons
			button2D = Platino.createSprite({image:"sprites/button_2d.png"});
			button3D = Platino.createSprite({image:"sprites/button_3d.png"});
			button2D.x = button3D.x = 10;
			button2D.y = 10;
			button3D.y = 20 + button2D.height;
			
			game.addHUD(button2D);
			game.addHUD(button3D);
		};
		
		var onSceneDeactivated = function(e) {
			game.removeHUD(button2D);
			game.removeHUD(button3D);
			game.removeEventListener('touchstart', onGameTouch);
			game.removeEventListener('touchend', onGameTouch);
			game.removeEventListener('touchcancel', onGameTouch);
			
		};
		
		scene.addEventListener('activated', onSceneActivated);
		scene.addEventListener('deactivated', onSceneDeactivated);
		
		
		return scene;
	};
	
	// Export as class (module) type
	module.exports = MainScene;
})();
