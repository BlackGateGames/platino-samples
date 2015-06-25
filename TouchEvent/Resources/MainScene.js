// Test Application for the Platino game engine
// Copyright 2015 BlackGate Games

var Platino = require('io.platino');

// Main Scene
(function() {
	var MainScene = function(window, game, background, outerLayout) {
		var scene = Platino.createScene();
		
		// These show where the user is touching the scene
		var touchMarkerA = null;
		var touchMarkerB = null;
		
		// A switch in the middle of the scene
		var testSwitch = null;
		var test2 = null;
		
		// Selected of the HUD buttons
		var selectedButton = null;
		
		var onSceneTouch = function(e) {
			if(testSwitch.contains(e.x, e.y) && (e.type == 'touchstart')) {
				return;
			} else {
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
			}
		};
		
		// Sprite specific events for the switch shown in the scene
		var onSwitchPushed = function(e) {
			testSwitch.frame = 1;
		};
		
		var onSwitchReleased = function(e) {
			testSwitch.frame = 2;
			
			if(game.topScene() == game.scene1) {
				game.replaceScene(game.scene2);
			} else {
				game.replaceScene(game.scene1);
			}
			game.startCurrentScene();
		};
		
		var onSwitchCancelled = function(e) {
			testSwitch.frame = 0;
		};
	
		// Background image
		bg = Platino.createSprite({image:background});
		scene.add(bg);
		
		// Switch to be pressed - it goes center screen
		testSwitch = Platino.createSpriteSheet({image:"sprites/switch.png", width: 50, height: 50});
		testSwitch.center = { x: (bg.width / 2), y: (bg.height / 2) };
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
		touchMarkerB.hide();
		scene.add(touchMarkerB);
		touchMarkerA.alwaysPropagateTouches = true;
		touchMarkerB.alwaysPropagateTouches = true;
		
		// Scene touching. Again, this is handled in a single function using case statements, whereas the button is separated.
		scene.addEventListener('touchstart', onSceneTouch);
		scene.addEventListener('touchmove', onSceneTouch);
		scene.addEventListener('touchend', onSceneTouch);
		
		// UI buttons - for now we have to place them manually since putting them in a layout will mess with our touch events around the
		// buttons; views want to halt the events internally, even though they will 'bubble'to the gameview's proxy.
		var buttonStyle = {backgroundColor:"red", borderWidth: 3, borderColor: "yellow", color:"white", left:10, height: 40, width: "20%"};
		var button2D = Ti.UI.createButton(buttonStyle); button2D.title = "Top-Down"; button2D.top = 10;
		var button3D = Ti.UI.createButton(buttonStyle); button3D.title = "Angled"; button3D.top = 60;
		
		var onUIButtonTouch = function(e) {
			if(e.source == button2D) {
				var transform_camera = Platino.createTransform();
				transform_camera.duration = 1000;
				transform_camera.easing = Platino.ANIMATION_CURVE_BACK_OUT;
				transform_camera.lookAt_centerY = game.screen.height / 2;
				game.moveCamera(transform_camera);
			} else if(e.source == button3D) {
				var transform_camera = Platino.createTransform();
				transform_camera.duration = 1000;
				transform_camera.easing = Platino.ANIMATION_CURVE_BACK_OUT;
				transform_camera.lookAt_centerY = game.screen.height / 4;
				game.moveCamera(transform_camera);
			}
		};
		
		button2D.addEventListener('click', onUIButtonTouch);
		button3D.addEventListener('click', onUIButtonTouch);
		var onSceneActivated = function(e) {
			outerLayout.add(button2D);
			outerLayout.add(button3D);
		};
		
		var onSceneDeactivated = function(e) {
			outerLayout.remove(button2D);
			outerLayout.remove(button3D);
		};
		
		scene.addEventListener('activated', onSceneActivated);
		scene.addEventListener('deactivated', onSceneDeactivated);
		
		return scene;
	};
	
	// Export as class (module) type
	module.exports = MainScene;
})();
