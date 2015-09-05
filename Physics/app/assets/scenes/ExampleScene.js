var Physics = require('io.platino.physicsjs');

var ExampleScene = function(game) {
	// Scene setup
	var scene = Alloy.Globals.Platino.createScene();
	var bg = Alloy.Globals.Platino.createSprite({image: 'sprites/bg.png'});
	var label = Ti.UI.createLabel({text: "Touch anywhere", height: 'auto', width: 'auto', color:'#fff', font:{fontSize:24}, top: 0, left: 5});
	var ballSpriteTemplate = Alloy.Globals.Platino.createSprite({image: 'sprites/basketball.png'}); // For knowing its size
	scene.add(bg);
	game.add(label);
	
	// Physics
  	Physics(function(world){
	  	// Gravity
		world.addBehavior( Physics.behavior('constant-acceleration'));
		
  		// Bouncing
	  	world.add( Physics.behavior('body-impulse-response') );
	  
		// Rigid bodies
		world.addBehavior( Physics.behavior('body-collision-detection', {check:true}));
		
	  	// World boundaries
  		world.add(Physics.behavior('edge-collision-detection', {
		      aabb: Physics.aabb(0, 0, game.screen.width, game.screen.height),
		      restitution: 0.99,
		      cof: 0.99
	  	}));
		
		// The user can click anywhere on the background to drop a ball
		bg.addEventListener('touchstart', function(e) {			
			// Create the ball as only a physics object
			var ball = Physics.body('circle', { radius: ballSpriteTemplate.width / 2 });
			
			// Position the physics object
			ball.state.pos.x = e.x;
			ball.state.pos.y = e.y;
			
			// Make sure the world acts upon the ball
			world.add(ball);
			
			// Set the lable to balls total
			label.text = "Total balls: " + world.getBodies().length;
			
			// Associate a platino sprite with the physics body
			ball.sprite = Alloy.Globals.Platino.createSprite({image: 'sprites/basketball.png', centerX: e.x, centerY: e.y});
			scene.add(ball.sprite);
		});

		// Once per frame, step the world and apply each physics object's position to its referenced sprite
		game.addEventListener('enterframe', function(e) {
			world.stepDelta(e.delta);
		});
	});
	
	return scene;
};

module.exports = ExampleScene; 
