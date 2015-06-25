function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "black",
        orientationModes: "[Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]",
        id: "win",
        fullscreen: "true",
        navbarHidden: "true"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var game = Alloy.Globals.Platino.createGameView();
    game.fps = 60;
    game.color(0, 0, 0);
    game.debug = false;
    game.enableOnDrawFrameEvent = false;
    game.screen = {
        width: 1138,
        height: 640
    };
    game.addEventListener("onload", function() {
        var HomeScene = require("HomeScene");
        game.currentScene = new HomeScene($.win, game);
        game.pushScene(game.currentScene);
        game.start();
    });
    $.win.addEventListener("close", function() {
        game = null;
    });
    $.win.add(game);
    $.win.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;