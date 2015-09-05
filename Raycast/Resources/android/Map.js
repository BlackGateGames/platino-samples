var Map = function(size) {
    this.size = size;
    this.wallGrid = new Array(size * size);
    this.sky = Alloy.Globals.Platino.createSprite({
        width: 2e3,
        height: 750,
        image: "images/deathvalley_panorama.jpg"
    });
    this.wallTexture = new Array(Alloy.Globals.wall_resolution);
    for (i = 0; i < Alloy.Globals.wall_resolution; i++) {
        this.wallTexture[i] = Alloy.Globals.Platino.createSpriteSheet({
            width: 1024 / Alloy.Globals.wall_resolution,
            height: 1024,
            image: "images/wall_texture.png"
        });
        this.wallTexture[i].anchorPoint = {
            x: 0,
            y: 0
        };
    }
    this.light = 0;
    this.get = function(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (0 > x || x > this.size - 1 || 0 > y || y > this.size - 1) return -1;
        return this.wallGrid[y * this.size + x];
    };
    this.randomize = function() {
        for (var i = 0; i < this.size * this.size; i++) this.wallGrid[i] = Math.random() < .3 ? 1 : 0;
    };
    this.update = function(seconds) {
        this.light > 0 ? this.light = Math.max(this.light - 10 * seconds, 0) : 5 * Math.random() < seconds && (this.light = 2);
    };
    this.cast = function(point, angle, range) {
        function ray(origin) {
            var stepX = step(sin, cos, origin.x, origin.y);
            var stepY = step(cos, sin, origin.y, origin.x, true);
            var nextStep = stepX.length2 < stepY.length2 ? inspect(stepX, 1, 0, origin.distance, stepX.y) : inspect(stepY, 0, 1, origin.distance, stepY.x);
            if (nextStep.distance > range) return [ origin ];
            return [ origin ].concat(ray(nextStep));
        }
        function step(rise, run, x, y, inverted) {
            if (0 === run) return noWall;
            var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            var dy = dx * (rise / run);
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                length2: dx * dx + dy * dy
            };
        }
        function inspect(step, shiftX, shiftY, distance, offset) {
            var dx = 0 > cos ? shiftX : 0;
            var dy = 0 > sin ? shiftY : 0;
            step.height = self.get(step.x - dx, step.y - dy);
            step.distance = distance + Math.sqrt(step.length2);
            step.shading = shiftX ? 0 > cos ? 2 : 0 : 0 > sin ? 2 : 1;
            step.offset = offset - Math.floor(offset);
            return step;
        }
        var self = this;
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var noWall = {
            length2: 1/0
        };
        return ray({
            x: point.x,
            y: point.y,
            height: 0,
            distance: 0
        });
    };
};

module.exports = Map;