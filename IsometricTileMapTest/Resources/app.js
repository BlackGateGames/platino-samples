//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
    alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
    var Window = require('ApplicationWindow');
    new Window().open({fullscreen:true, navBarHidden:true, exitOnClose:true});
})();
