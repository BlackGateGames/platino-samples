var GameLoop = function() {
    this.lastTime = 0;
    this.callback = function() {};
    this.start = function(callback) {
        this.callback = callback;
    };
    this.frame = function() {
        this.callback(.075);
    };
};

module.exports = GameLoop;