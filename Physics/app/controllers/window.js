// Import the main file, which must return a game object. This is simply added to our window and we start.
// The window can be set up in window.tss

var game = require('main');
$.win.add(game);
$.win.open();

// Free up game resources when window is closed
$.win.addEventListener('close', function(e) {
	game = null;
});
