var Camera = function(myScene, focalLength, width, height) {
    this.scene = myScene;
    this.width = width;
    this.height = height;
    this.spacing = this.width / Alloy.Globals.wall_resolution;
    this.focalLength = focalLength || .8;
    this.range = 28;
    this.scale = (this.width + this.height) / 1200;
    var skyAdded = false;
    var allColumnsAdded = false;
    this.render = function(player, map) {
        if (!skyAdded) {
            this.drawSky(player.direction, map.sky, map.light);
            skyAdded = true;
        }
        this.drawColumns(player, map);
    };
    this.drawSky = function(direction, sky) {
        var width = sky.width * (this.height / sky.height) * 2;
        var left = direction / Alloy.Globals.circle * -width;
        sky.width = width;
        sky.height = this.height;
        sky.x = left;
        sky.y = 0;
        this.scene.add(sky);
    };
    this.drawColumns = function(player, map) {
        params = [];
        for (var column = 0; column < Alloy.Globals.wall_resolution; column++) {
            var x = column / Alloy.Globals.wall_resolution - .5;
            var angle = Math.atan2(x, this.focalLength);
            var ray = map.cast(player, player.direction + angle, this.range);
            params[column] = {
                ray: ray,
                angle: angle
            };
        }
        for (var column = 0; column < Alloy.Globals.wall_resolution; column++) this.drawColumn(column, params[column].ray, params[column].angle, map);
        allColumnsAdded = true;
    };
    this.drawColumn = function(column, ray, angle, map) {
        var drawWall = false;
        var texture = map.wallTexture[column];
        var hit = -1;
        while (++hit < ray.length && ray[hit].height <= 0) ;
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
                var diff = wall.height / texture.height;
                var lighting = Math.max(diff, .25);
                texture.frame = texture.frameCount * step.offset;
                texture.y = wall.top;
                texture.scaleY = diff;
                texture.color(lighting, diff, diff);
                allColumnsAdded || this.scene.add(texture);
            }
        }
        drawWall || texture.hide();
    };
    this.project = function(height, angle, distance) {
        var z = distance * Math.cos(angle);
        var wallHeight = this.height * height / z;
        var bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    };
};

module.exports = Camera;