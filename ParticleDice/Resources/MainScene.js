var platino = require('co.lanica.platino');

function MainScene(window, game) {

    var debug = false;

    // Create scene
    var self = platino.createScene();

    var number = null;
    var particles = [];
    var particlenames = ["star.pex", "spining.pex", "vortex.pex", "ghost.pex", "firering.pex"];
    var currentParticleIndex = 0;

    var loadingsong  = Ti.Media.createSound({url:"sound/circus-loadingsong.wav"});
    loadingsong.looping = true;

    var drumroll  = Ti.Media.createSound({url:"sound/drumroll.wav"});
    var bombsound = Ti.Media.createSound({url:"sound/bomb.wav"});
    drumroll.addEventListener('complete', function(e) {
        if (timerId > 0) {
            finishDice();
        }
    });

    function finishDice() {
        bombsound.play();

        diceRunning = false;

        clearInterval(timerId);
        timerId = 0;

        diceTransform.scaleX = 1;
        diceTransform.scaleY = 1;
        diceTransform.duration = 600;
        diceTransform.easing = platino.ANIMATION_CURVE_BACK_OUT;

        number.transform(diceTransform);
    }

    var timerId = 0;

    var diceRunning = false;
    var diceTransform = null;

    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    var updateNumber = function(e) {
        if (number === null) return;

        var count = Math.floor(Math.random() * 81);

        var r = Math.random();
        var b = Math.random();
        var g = Math.random();

        if (r < 0.1 && b < 0.1 && g < 0.1) {
            r = 1;
            b = 1;
            g = 1;
        }

        number.text = pad(count, 2);
        number.color(r, b, g);
    };

    var handleTouch = function(_e) {
        var e =  {type:_e.type, source:_e.source};
        e.x = _e.x * game.touchScaleX;
        e.y = _e.y * game.touchScaleY;

        loadingsong.stop();

        if (!diceRunning) {
            diceRunning = true;
            number.scale(0.5, 0.5);

            bombsound.stop();
            drumroll.play();

            self.remove(particles[currentParticleIndex]);

            currentParticleIndex++;
            if (currentParticleIndex >= particles.length) {
                currentParticleIndex = 0;
            }

            if (particles[currentParticleIndex].started) {
                particles[currentParticleIndex] = null;

                particles[currentParticleIndex] = platino.createParticles({image:'graphics/' + particlenames[currentParticleIndex]});
                particles[currentParticleIndex].x = game.screen.width  * 0.5;
                particles[currentParticleIndex].y = game.screen.height * 0.5;
                particles[currentParticleIndex].z = currentParticleIndex;
            }

            particles[currentParticleIndex].started = true;

            self.add(particles[currentParticleIndex]);

            timerId = setInterval(updateNumber, 100);
        } else {
            drumroll.stop();
            finishDice();
        }
    };

    self.addEventListener('activated', function(e) {
        Ti.API.info("main scene is activated");

        loadingsong.play();

        particles = [];

        game.debug = debug;

        if (number === null) {
            number = platino.createTextSprite();
        }

        number.text = "00";
        number.fontFamily = "Clarendon Text TF";
        number.fontSize = 256;
        number.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
        number.color(1, 1, 1);

        var textSize = number.sizeWithText("88");
        number.height = textSize.height;
        number.width  = textSize.width;

        number.center = {x:game.screen.width * 0.5, y:game.screen.height * 0.5};
        number.z = 99;
        number.scale(0.5, 0.5);

        self.add(number);

        for (var i = 0; i < particlenames.length; i++) {
            particles[i] = platino.createParticles({image:'graphics/' + particlenames[i]});
            particles[i].x = game.screen.width  * 0.5;
            particles[i].y = game.screen.height * 0.5;
            particles[i].z = i;
            particles[i].started = false;
        }

        particles[0].started = true;
        self.add(particles[0]);

        diceTransform = platino.createTransform();

        game.startCurrentScene();

        game.addEventListener('touchstart', handleTouch);
    });

    self.addEventListener('deactivated', function(e) {
        Ti.API.info("main scene is deactivated");

        if (timerId > 0) {
            clearInterval(timerId);
            timerId = 0;
        }

        if (number !== null) {
            self.remove(number);
            number = null;
        }

        game.removeEventListener('touchstart', handleTouch);
    });

    return self;
}

module.exports = MainScene;
