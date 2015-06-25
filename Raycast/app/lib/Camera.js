// Renderer to the scene - actually, it places and scales sprites where needed for the 3D effect
var Camera = function(myScene, focalLength, width, height) {
	this.scene = myScene;
	this.width = width;
	this.height = height;
	this.spacing = this.width / Alloy.Globals.wall_resolution;
	this.focalLength = focalLength || 0.8;
	this.range = 28;
	this.scale = (this.width + this.height) / 1200;

	// Only add the sprites once
	var skyAdded = false;
//	var weaponAdded = false;
	var allColumnsAdded = false;

	this.render = function(player, map) {
		if (!skyAdded) {
			this.drawSky(player.direction, map.sky, map.light);
			skyAdded = true;
		}

		this.drawColumns(player, map);
/*
		if (!weaponAdded) {
			this.drawWeapon(player.weapon, player.paces);
			waponAdded = true;
		}
*/
	};

	// Add the sky to the scene
	this.drawSky = function(direction, sky, ambient) {
		var width = sky.width * (this.height / sky.height) * 2;
		var left = (direction / Alloy.Globals.circle) * -width;

		sky.width = width;
		sky.height = this.height;
		sky.x = left;
		sky.y = 0;
		this.scene.add(sky);
	};

	// Add and/or scale the columns to create the walls
	this.drawColumns = function(player, map) {
		params = [];
		for (var column = 0; column < Alloy.Globals.wall_resolution; column++) {
			var x = column / Alloy.Globals.wall_resolution - 0.5;
			var angle = Math.atan2(x, this.focalLength);
			var ray = map.cast(player, player.direction + angle, this.range);
			params[column] = {
				ray : ray,
				angle : angle
			};
		}
		for (var column = 0; column < Alloy.Globals.wall_resolution; column++) {
			this.drawColumn(column, params[column].ray, params[column].angle, map);
		}

		allColumnsAdded = true;
	};

	this.drawColumn = function(column, ray, angle, map) {
		var drawWall = false; // Is there even a wall close enough to draw for this column?
		var texture = map.wallTexture[column]; // The sprite to use
		var hit = -1;

		while (++hit < ray.length && ray[hit].height <= 0);

		for (var s = ray.length - 1; s >= 0; s--) {
			var step = ray[s];

			if (s === hit) {
				drawWall = true;
				texture.show();
				var wall = this.project(step.height, angle, step.distance);

				if (!allColumnsAdded) {
					texture.x = Math.floor(column * this.spacing);
					texture.width = Math.ceil(this.spacing);
				}

				var diff = (wall.height / texture.height);
				var lighting = Math.max(diff, 0.25);

				texture.frame = texture.frameCount * step.offset;
				texture.y = wall.top;
				texture.scaleY = diff;
				texture.color(lighting, diff, diff);

				if (!allColumnsAdded) {
					this.scene.add(texture);
				}
			}
		}

		if (!drawWall) {
			texture.hide();
		}
	};

/*
	this.drawWeapon = function(weapon, paces) {
		var bobX = Math.cos(paces * 2) * this.scale * 6;
		var bobY = Math.sin(paces * 4) * this.scale * 6;
		var left = this.width * 0.66 + bobX;
		var top = this.height * 0.6 + bobY;
		weapon.x = left;
		weapon.y = top;
		weapon.width = weapon.width * this.scale;
		weapon.height = weapon.height * this.scale;
		//if (!weaponAdded) {
		//	this.ctx.add(weapon);
		//	weaponAdded = true;
		//}
		//        this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
	};
*/

	// Projection to determine the placement and scale of a wall column
	this.project = function(height, angle, distance) {
		var z = distance * Math.cos(angle);
		var wallHeight = this.height * height / z;
		var bottom = this.height / 2 * (1 + 1 / z);
		return {
			top : bottom - wallHeight,
			height : wallHeight
		};
	};
};

module.exports = Camera;
