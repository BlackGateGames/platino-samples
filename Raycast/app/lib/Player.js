
var Player = function(x, y, direction, game) {
	this.x = x;
	this.y = y;
	this.direction = direction;

	// Active directions of motion
	var left = false;
	var right = false;
	var forward = false;
	
	// Rotate the player
	this.rotate = function(angle) {
		this.direction = (this.direction + angle + Alloy.Globals.circle) % (Alloy.Globals.circle);
	};
	
	// Move the player forward
	this.walk = function(distance, map) {
		var dx = Math.cos(this.direction) * distance;
		var dy = Math.sin(this.direction) * distance;
		
		// Block player from walking through walls
		if (map.get(this.x + dx, this.y) <= 0)
			this.x += dx;
		if (map.get(this.x, this.y + dy) <= 0)
			this.y += dy;
	};
	
	// Update the player for the controls state
	this.update = function(map, seconds) {
		if (left)
			this.rotate(-Math.PI * seconds);
		if (right)
			this.rotate(Math.PI * seconds);
		if (forward)
			this.walk(3 * seconds, map);
	};
	
	this.onTouch = function(e) {
		left = false;
		right = false;
		forward = (e.y < game.screen.height * 0.25) &&
				  (e.x > game.screen.width * 0.10) && 
				  (e.x < game.screen.width * 0.35);
		if(!forward) {
			if (e.x < game.screen.width * 0.25) 
				left = true;
			else
				right = true;
		}
	};
	
	// Control the Player
    game.addEventListener('touchstart', this.onTouch);
    game.addEventListener('touchmove', this.onTouch);
    game.addEventListener('touchend', function(e) {
    	left = right = forward = false;
    });
}; 

module.exports = Player;
