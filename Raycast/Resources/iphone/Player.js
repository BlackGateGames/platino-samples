var Player = function(x, y, direction, game) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    var left = false;
    var right = false;
    var forward = false;
    this.rotate = function(angle) {
        this.direction = (this.direction + angle + Alloy.Globals.circle) % Alloy.Globals.circle;
    };
    this.walk = function(distance, map) {
        var dx = Math.cos(this.direction) * distance;
        var dy = Math.sin(this.direction) * distance;
        map.get(this.x + dx, this.y) <= 0 && (this.x += dx);
        map.get(this.x, this.y + dy) <= 0 && (this.y += dy);
    };
    this.update = function(map, seconds) {
        left && this.rotate(-Math.PI * seconds);
        right && this.rotate(Math.PI * seconds);
        forward && this.walk(3 * seconds, map);
    };
    this.onTouch = function(e) {
        left = false;
        right = false;
        forward = e.y < .25 * game.screen.height && e.x > .1 * game.screen.width && e.x < .35 * game.screen.width;
        forward || (e.x < .25 * game.screen.width ? left = true : right = true);
    };
    game.addEventListener("touchstart", this.onTouch);
    game.addEventListener("touchmove", this.onTouch);
    game.addEventListener("touchend", function() {
        left = right = forward = false;
    });
};

module.exports = Player;