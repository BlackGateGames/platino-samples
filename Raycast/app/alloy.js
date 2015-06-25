// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//

Alloy.Globals.Platino = require('io.platino'); // Core engine 
Alloy.Globals.wall_resolution = 1024; // Set to powers of 2 up to 1024 to sharpen the imagery at performance costs
Alloy.Globals.circle = Math.PI * 2;
