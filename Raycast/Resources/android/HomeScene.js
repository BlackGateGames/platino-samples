var Player = require("Player");

var Map = require("Map");

var Camera = require("Camera");

var GameLoop = require("GameLoop");

var HomeScene = function(window, game) {
    var scene = Alloy.Globals.Platino.createScene();
    const SPEED_DAMPEN = 75;
    var player = new Player(15.3, -1.2, .3 * Math.PI, game);
    var camera = new Camera(scene, .8, game.screen.width, game.screen.height);
    var loop = new GameLoop();
    var map = new Map(32);
    scene.addEventListener("activated", function() {
        map.randomize();
        loop.start(function(seconds) {
            map.update(seconds);
            player.update(map, seconds);
            camera.render(player, map);
        });
        updateTimerID = setInterval(function() {
            loop.frame();
        }, SPEED_DAMPEN);
    });
    return scene;
};

module.exports = HomeScene;