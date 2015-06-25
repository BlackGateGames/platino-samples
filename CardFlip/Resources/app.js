/* Created by Peach Pellen, 2013, for use in a simple prototype.
 * As this was mocked up in all of 10 minutes, please do not assume these are good coding practices.
 */

// Like all Titanium/Platino apps, we start with a new window
var window = Ti.UI.createWindow({backgroundColor:'black'});

// Require Platino, create the game view as always, then set the game color if you wish. (I made it black.)
var platino = require('io.platino');
var game = platino.createGameView();
game.color(0, 0, 0);

// Create a scene to add to our game for all our visual elements
var scene = platino.createScene();

// Create the background image and add it to the scene
var bg = platino.createSprite({image:"cardBG2.jpg"});
scene.add(bg);

// Create the front and back of the card, then add them to the scene as well
var cardFront = platino.createSprite({image:"cardFront.png"});
var cardBack = platino.createSprite({image:"cardBack.png"});
cardBack.alpha=0;
scene.add(cardFront);
scene.add(cardBack);

// Create a transform for the first half of flipping the card to its back
var flipToBack1 = platino.createTransform();
flipToBack1.duration = 300;
flipToBack1.angle = 90;
flipToBack1.rotate_axis = platino.Y;

// Create a transform for the second half of flipping the card to its back
var flipToBack2 = platino.createTransform();
flipToBack2.duration = 300;
flipToBack2.angle = 0;
flipToBack2.rotate_axis = platino.Y;

// Create a transform for the first half of flipping the card to its front
var flipToFront1 = platino.createTransform();
flipToFront1.duration = 300;
flipToFront1.angle = -90;
flipToFront1.rotate_axis = platino.Y;

// Create a transform for the second half of flipping the card to its front
var flipToFront2 = platino.createTransform();
flipToFront2.duration = 300;
flipToFront2.angle = 0;
flipToFront2.rotate_axis = platino.Y;

// Call the second half of the transform once the first is finished (back)
flipToBack1.addEventListener('complete', function(e) {
    cardBack.transform(flipToBack2);
    cardFront.alpha = 0;
    cardBack.alpha = 1;
});

// Call the second half of the transform once the first is finished (front)
flipToFront1.addEventListener('complete', function(e) {
    cardFront.transform(flipToFront2);
    cardBack.alpha = 0;
    cardFront.alpha = 1;
});

// Add a listener to the game so the flip happens whenever the screen is touched
game.addEventListener('touchstart', function(e) {
    if(cardBack.alpha===0){
        cardFront.clearTransforms();
        cardBack.clearTransforms();
        cardFront.transform(flipToBack1);
    }
    else if(cardFront.alpha===0){
        cardFront.clearTransforms();
        cardBack.clearTransforms();
        cardBack.transform(flipToFront1);
    }
});

// Show the scene we created for our visuals called "scene"
game.pushScene(scene);

// When the game loads resize the background to fill the screen, set the rotation axis for the
// cards, and position them in the center of the screen, then start the game
game.addEventListener('onload', function(e) {
    
    bg.height = game.screen.height;
    bg.width = game.screen.width;

    cardFront.rotateFromAxis(0, cardFront.width * 0.5, cardFront.height * 0.5, platino.Y);
    cardBack.rotateFromAxis(-90, cardBack.width * 0.5, cardBack.height * 0.5, platino.Y);

    cardFront.center = {x: game.screen.width * 0.5, y: game.screen.height * 0.5};
    cardBack.center = {x: cardFront.center.x, y: cardFront.center.y};
    
    game.start();
});

// Finally, we add the game to the window and open it to make everything run
window.add(game);
window.open({fullscreen:true, navBarHidden:true});