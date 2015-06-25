var Player = require("Player");
var Map = require("Map");
var Camera = require("Camera");
var GameLoop = require("GameLoop");

var HomeScene = function(window, game) {
	var scene = Alloy.Globals.Platino.createScene(); // This scene
	const SPEED_DAMPEN = 75; // Dampens game speed... the higher it is, the slower the player can walk around
	
	// Member variables
	var player = new Player(15.3, -1.2, Math.PI * 0.3, game);
	var camera = new Camera(scene, 0.8, game.screen.width, game.screen.height);
	var loop = new GameLoop();
	var map = new Map(32);
	  
	// Scene Entry Point
	scene.addEventListener('activated', function(e) {
      map.randomize();	// Random level generation
      
      loop.start(function frame(seconds) {
        map.update(seconds);
        player.update(map, seconds);
        camera.render(player, map);
      });
      
      updateTimerID = setInterval(function(e) { loop.frame(); }, SPEED_DAMPEN);
	});

	return scene;
};

module.exports = HomeScene;