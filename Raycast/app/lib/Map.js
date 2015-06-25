// Generates and stores a map of boolean values representing the presence of walls. Can be randomized.

var Map = function(size) {
	this.size = size;
	this.wallGrid = new Array(size * size);  // 2D map of wall locations in memory

	// The sky backdrop
	this.sky = Alloy.Globals.Platino.createSprite({
		width : 2000,
		height : 750,
		image : 'images/deathvalley_panorama.jpg'
	});

	// Create the wall texture by dividing it up into sections which can be scaled to create the 3d effect
	this.wallTexture = new Array(Alloy.Globals.wall_resolution);
	for ( i = 0; i < Alloy.Globals.wall_resolution; i++) {
		this.wallTexture[i] = Alloy.Globals.Platino.createSpriteSheet({
			width : 1024 / Alloy.Globals.wall_resolution,
			height : 1024,
			image : 'images/wall_texture.png'
		});
		this.wallTexture[i].anchorPoint = {
			x : 0,
			y : 0
		};
	}

	this.light = 0;

	// Retrieve whether there is a wall at the given coordinate
	this.get = function(x, y) {
		x = Math.floor(x);
		y = Math.floor(y);
		if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
			return -1;
		return this.wallGrid[y * this.size + x];
	};

	// Randomly generate which squares have walls and which do not.
	this.randomize = function() {
		for (var i = 0; i < this.size * this.size; i++) {
			this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0;
		}
	};

	// Fade in the light for the backdrop
	this.update = function(seconds) {
		if (this.light > 0)
			this.light = Math.max(this.light - 10 * seconds, 0);
		else if (Math.random() * 5 < seconds)
			this.light = 2;
	};

	// Perform a raycast from a given point
	this.cast = function(point, angle, range) {
		var self = this;
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		var noWall = {
			length2 : Infinity
		};

		return ray({
			x : point.x,
			y : point.y,
			height : 0,
			distance : 0
		});

		function ray(origin) {
			var stepX = step(sin, cos, origin.x, origin.y);
			var stepY = step(cos, sin, origin.y, origin.x, true);
			var nextStep = stepX.length2 < stepY.length2 ? inspect(stepX, 1, 0, origin.distance, stepX.y) : inspect(stepY, 0, 1, origin.distance, stepY.x);

			if (nextStep.distance > range)
				return [origin];
			return [origin].concat(ray(nextStep));
		}

		function step(rise, run, x, y, inverted) {
			if (run === 0)
				return noWall;
			var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
			var dy = dx * (rise / run);
			return {
				x : inverted ? y + dy : x + dx,
				y : inverted ? x + dx : y + dy,
				length2 : dx * dx + dy * dy
			};
		}

		function inspect(step, shiftX, shiftY, distance, offset) {
			var dx = cos < 0 ? shiftX : 0;
			var dy = sin < 0 ? shiftY : 0;
			step.height = self.get(step.x - dx, step.y - dy);
			step.distance = distance + Math.sqrt(step.length2);
			if (shiftX)
				step.shading = cos < 0 ? 2 : 0;
			else
				step.shading = sin < 0 ? 2 : 1;
			step.offset = offset - Math.floor(offset);
			return step;
		}
	};
}; 

module.exports = Map;
