// Convenience class to call a callback at a given interval

var GameLoop = function() {
	this.lastTime = 0;
	this.callback = function() {
	};

	this.start = function(callback) {
		this.callback = callback;
	};

	this.frame = function() {
		this.callback(0.075);
	};
};

module.exports = GameLoop;
