// Create the app window
var window = Ti.UI.createWindow({
		orientationModes: [Ti.UI.PORTRAIT],
		fullscreen: true,
		navBarHidden: true,
		exitOnClose:true
	});

// Require Platino and Chipmunk2d
var platino = require('io.platino');
require('co.lanica.chipmunk2d');
var chipmunk = co_lanica_chipmunk2d;
var v = chipmunk.cpv;

// Set the window scale
var WINDOW_SCALE_FACTOR_X = 1;
var WINDOW_SCALE_FACTOR_Y = 1;

// Set the initial variables for the game
var worldSpeed = 4;
var birdAngle = 0;
var bounce = false;
var bounceX = 0;
var bounceY = 0;
var start = false;
var die = false;
var _accumulator = 0.0;
var marginWidth = 0;

// How many pipes can exist at any one time
var numPipes = 3;

// Recommended between 60 and 240; higher = more accuracy (but higher CPU load)
var TICKS_PER_SECOND = 240;

// Load sound effects for flying, crashing, scoring, etc.
var fly = Ti.Media.createSound({url:"sounds/sfx_wing.caf"});  
var pow = Ti.Media.createSound({url:"sounds/sfx_hit.caf"});
var point = Ti.Media.createSound({url:"sounds/sfx_point.aif"});
var enter = Ti.Media.createSound({url:"sounds/sfx_swooshing.caf"});
var falling = Ti.Media.createSound({url:"sounds/sfx_die.caf"});

// Create the platino gameview, set fps, color, enable enter frame events
var game = platino.createGameView();
	game.fps = 60;
	game.color(0, 0, 0);
	game.enableOnDrawFrameEvent = true;
	game.correctionHint = platino.OPENGL_LINEAR;

// Create the platino scene and add it to the game
var scene = platino.createScene();
game.pushScene(scene);

// Set up Chipmunk for physics
space = chipmunk.cpSpaceNew();
chipmunk.cpSpaceSetIterations(space, 30);
chipmunk.cpSpaceSetGravity(space, v(0, -500));
chipmunk.cpSpaceSetSleepTimeThreshold(space, 0.5);
chipmunk.cpSpaceSetCollisionSlop(space, 0.5);
	
// Set up 
var bodies = {};
var sprite = {};
var shape = {};
sprite.up = [];
sprite.down = [];
		
shape.up = [];
shape.down = [];
		
bodies.up = [];
bodies.down = [];

// Set up the initial score and wing positions
var score = 0;
var wing = 0;
var wFat = 1;

// Array for moving of the pipes		
var movePipe = {};
movePipe.up = [];
movePipe.down = [];
	
// Array for moving of the floor
var floor = [];
var moveFloor = [];
var moveFloorFlw = [];
	
// Variables for if there's a floor and if the bird is falling
var noFloor = false;
var fall = false;

// Animation information for the bird when flying
var animate = [63,65,67];
var animPos = 0;
var flyBird;

// Variables for defining target device width and height
var targetWidth = 288;
var targetHeight = 512;

// Set the game's target screen size
game.TARGET_SCREEN = {
	width: targetWidth,
	height: targetHeight,
	difference: Titanium.Platform.displayCaps.platformHeight - 480,
};

// Used to get the height of the game screen, minus the bird's Y
var cpY = function(y) {
	return (game.screen.height - y);
};

// Used to get the birds current angle
var cpAngle = function(angle) {
	return -(angle) * (180/Math.PI);
};

// Conversion function for angles/degrees
function convert(type, num) {
	if (type == "radian") {
		result = -num * (180/Math.PI);
	}
	
	if (type == "degrees") {
          result = -num * (Math.PI/180);
    }
	
    return result;
}

// When a collision starts, act accordingly
function startCollision(arbiter, space) {
	var sh = [];
		chipmunk.cpArbiterGetShapes(arbiter, sh);
		Ti.API.info("=="+sh);
		
		if(sh[1].equals(shape.bird) && sh[0].equals(shape.floor)) {
			if(die==false) {
				pow.stop();
				pow.play();
			}
		noFloor=true;
		die = true;
	}
};

// When a collision ends, act accordingly
function endCollision(arbiter, space) {
	var sh = [];
	chipmunk.cpArbiterGetShapes(arbiter, sh);
	Ti.API.info("=="+sh);
};
 
// Update the screen size
var updateScreenSize = function() {
	var screenScale = game.size.height / game.TARGET_SCREEN.height;
	game.screen = {
		width: game.size.width / screenScale,
		height: game.size.height / screenScale,
	};
	game.screenScale = game.screen.height / game.TARGET_SCREEN.height;
};

// Create the pipes
var createPipes = function(){
	for(var i=0; i<numPipes; i++) {

		sprite.up[i] = platino.createSpriteSheet({
		  	asset:'images/sprites.xml', 
		  	frame: 66,
		  	y: -(100+(Math.random(0,10)*200)),
		  	x:480 + (i*160),
		  	index: i,
		  	z:1,
		  	ready: true,
		  	anchorPoint: {
		  		x: 0.5,
		  		y: 0.5
		  	}
		});
		game.setupSpriteSize(sprite.up[i]);
		scene.add(sprite.up[i]);
		sprite.down[i] = platino.createSpriteSheet({
		  	asset:'images/sprites.xml', 
		  	frame: 68,
		  	y: (sprite.up[i].y + sprite.up[i].height) + 100,
		  	x: sprite.up[i].x,
		  	index: i,
		  	z:1,
		  	ready: true,
		  	anchorPoint: {
		  		x: 0.5,
		  		y:0.5
		  	}
		});
		game.setupSpriteSize(sprite.down[i]);
		scene.add(sprite.down[i]);			
	}
};

// Set up the correct size for sprites based on the screen size
game.setupSpriteSize = function(sprite) {
	var width = sprite.width / game.screenScale;
	var height = sprite.height / game.screenScale;
	sprite.width = (width < 1) ? 1 : width;
	sprite.height = (height < 1) ? 1 : height;
};

//	
game.stepWorld = function(delta) {
	var dt = delta/1000.0;
	var fixed_dt = 1.0/TICKS_PER_SECOND;

	// add the current dynamic timestep to the accumulator
	_accumulator += dt;

	while(_accumulator > fixed_dt) {
		chipmunk.cpSpaceStep(space, fixed_dt);
		_accumulator -= fixed_dt;
	}
};

// Keep the sprites in sync
game.syncSprites = function(){
	var i, pos, angle;
		
	if(die==false) {
			
		// Move the floor
		floor[0].x = floor[0].x - worldSpeed;
		floor[1].x = floor[1].x - worldSpeed;
		if((floor[0].x+floor[0].width) < 0) floor[0].x = 333;
		if((floor[1].x+floor[1].width) < 0) floor[1].x = 333;
	}
		
			
	if(noFloor==false) {
			
		// Floating in the beginning
		if(start==false && die==false) {
			chipmunk.cpBodySetVel(bodies.bird,v(0,0));
			chipmunk.cpBodySetPos(bodies.bird, v(50,(game.screen.height * 0.5)+wing));
			chipmunk.cpBodySetAngle(bodies.bird, 0 );
			wing = wing + wFat;
			if(wing>5 || wing<-5) wFat = wFat *-1;
		}
		
		
	// The bird goes faster
	var velo = chipmunk.cpBodyGetVel(bodies.bird); 
	angle = cpAngle(chipmunk.cpBodyGetAngle(bodies.bird)); 
	
	// If the player dies, play the sound
	if(die && velo.y<0 && fall==false) {
		falling.play();
		fall = true;
	}
		// Turn the bird
		if(velo.y<0) angle = angle + 10;
		if(velo.y>0) angle = angle - 10;
		if(angle <= -30) angle = -30;
		if(angle >= 90) angle = 90; 
		chipmunk.cpBodySetAngle(bodies.bird, convert("degrees",angle) );
	} 
		
	// Move the bird
	if (!chipmunk.cpBodyIsSleeping(bodies.bird)) {
		pos = chipmunk.cpBodyGetPos(bodies.bird); 
		angle = cpAngle(chipmunk.cpBodyGetAngle(bodies.bird)); 
			
		sprite.bird.x = pos.x - (sprite.bird.width * 0.5);
		sprite.bird.y = cpY(pos.y) - (sprite.bird.height * 0.5);
		sprite.bird.angle = angle;
		chipmunk.cpBodySetPos(bodies.bird, pos);
	}
				
	// Handle the pipes		
	for(var i=0; i<numPipes; i++) {
		if(start==true && die==false) {
				
			// move pipes
			sprite.up[i].x -= worldSpeed;
			sprite.down[i].x = sprite.up[i].x;
				
			if((sprite.up[i].x+sprite.up[i].width)<0) {
				sprite.up[i].x = 430;
				sprite.down[i].x = sprite.up[i].x;
				
				sprite.up[i].y = -(100+(Math.random(0,10)*200));
				sprite.down[i].y = (sprite.up[i].y+sprite.up[i].height) + 100;
				sprite.up[i].ready = true;
			}
			
				
			// Navigated a pipe
			if(pos.x > sprite.up[i].x) {
				if(sprite.up[i].ready==true) {
					point.stop();
					point.play();
					score++;
					sprite.up[i].ready = false;
				}
			}
				
			// Bam! Hit a pipe
			if(sprite.up[i].collidesWith(sprite.bird) === true || sprite.down[i].collidesWith(sprite.bird)) 
			{
				die = true;
				pow.stop();
				pow.play();
				sprite.bird.stop();
			}
				
		}
	}
};	
		
// When the app is launched, update screen size and start the game	
game.addEventListener('onload', function(){
	updateScreenSize();		
	game.start();
});

// Function for start of touch to move the bird and play a sound
game.addEventListener('touchstart', function(e) {
	if(noFloor==false) {
		if(start==false) start=true;
		if(die==false) {
			pos = chipmunk.cpBodyGetPos(bodies.bird);
			if(cpY(pos.y)>0) {
				chipmunk.cpBodySetVel(bodies.bird,v(0,0));
				chipmunk.cpBodyApplyImpulse(bodies.bird, v(0, 65), v(0,0));
				birdAngle = 0;
				chipmunk.cpBodySetAngle(bodies.bird, convert("degrees",0) );
				fly.stop();
				fly.play();
			}
		}
	} else {
		wing = 0;
		
		chipmunk.cpBodySetVel(bodies.bird,v(0,0));
		chipmunk.cpBodySetPos(bodies.bird, v(50,(game.screen.height * 0.5)+wing));
		for(var i=0; i<numPipes; i++) {
			scene.remove(sprite.up[i]);
			scene.remove(sprite.down[i]);	
		}
		sprite.bird.animate(animate, 500, -1,0);
		createPipes();
		noFloor=false;
		die = false;
		start = false;
		fall = false;
		score = 0;		
	}
 });

// When the game scene is activated, set up the backgrounds, floor and bird
scene.addEventListener('activated', function(){
	var background = platino.createSpriteSheet({asset:'images/sprites.xml', frame:39, x:0, y:0 });
	game.setupSpriteSize(background);
	scene.add(background);
	
	var background2 = platino.createSpriteSheet({asset:'images/sprites.xml', frame:39, x:288, y:0 });
	game.setupSpriteSize(background2);
	scene.add(background2);
		
	floor[0] = platino.createSpriteSheet({
	  	asset:'images/sprites.xml', 
	  	frame: 2,
	  	y: game.TARGET_SCREEN.height- 95,
	  	x:0,
	  	ready: true,
	  	z:5,
	});
	game.setupSpriteSize(floor[0]);
	scene.add(floor[0]);
	
	floor[1] = platino.createSpriteSheet({
	  	asset:'images/sprites.xml', 
	  	frame: 2,
	  	y: game.TARGET_SCREEN.height- 95,
	  	x: 336,
	  	ready: true,
	  	z:5,
	});
	game.setupSpriteSize(floor[1]);
	scene.add(floor[1]);
	
	var box = chipmunk.cpBBNew(-320, 0, 640, 90);
	shape.floor = chipmunk.cpBoxShapeNew2(space.staticBody, box);
	chipmunk.cpSpaceAddShape(space, shape.floor);
	chipmunk.cpShapeSetElasticity(shape.floor, 0.5);
	chipmunk.cpShapeSetFriction(shape.floor, 10);
					 
					 
	sprite.bird = platino.createSpriteSheet({
	  	asset:'images/sprites.xml', 
	  	frame: animate[animPos],
	  	anchorPoint: {
			x: 0.5,
			y: 0.5
		},
		x: 50,
		y: game.screen.height * 0.5,
		z: 15,
	});
	game.setupSpriteSize(sprite.bird);
	scene.add(sprite.bird);		
	sprite.bird.animate(animate, 500, -1,0);
		
	var mass = 0.3;
	var moment = chipmunk.cpMomentForBox(mass, sprite.bird.width, sprite.bird.height);
	bodies.bird = chipmunk.cpBodyNew(mass, moment);
	chipmunk.cpSpaceAddBody(space, bodies.bird);
	chipmunk.cpBodySetPos(bodies.bird, v(sprite.bird.center.x, cpY(sprite.bird.center.y)));
				
	shape.bird = chipmunk.cpBoxShapeNew(bodies.bird, sprite.bird.width, sprite.bird.height);
	chipmunk.cpSpaceAddShape(space, shape.bird);
	chipmunk.cpShapeSetElasticity(shape.bird, 0.4);
	chipmunk.cpShapeSetFriction(shape.bird, 10);	
		
	collisionBird = new chipmunk.cpSpaceAddCollisionHandlerContainer();
	chipmunk.cpSpaceAddCollisionHandler(space, 0, 0, startCollision, null, null, endCollision, collisionBird);
		
	flyBird = setInterval(function(){
		animPos++;
		if(animPos>animate.length-1) animPos = 0;
		sprite.bird.frame = animate[animPos];
	},100);
		
	createPipes();
		
	var update = setInterval(function(){
		game.stepWorld(30);		
		game.syncSprites();
		Label.text = score;
	},30);	
});

// Add the game to the window
window.add(game);

// A text label for the score
var Label = Titanium.UI.createLabel( {
	text: score,
	color: "#fff",
	top: 30,
	font: { fontSize:30, fontFamily:'Trebuchet MS', fontWeight: "bold"},
	shadowOffset: {x:2,y:2},
	shadowColor: "#000",
});
window.add(Label);

// Open the window the game is in and hide the navigation bar
window.open({fullscreen:true, navBarHidden:true}); 
