var game;

var debug = true; // Para el debug que se muestra por la consola
var gameDebug = true; // Para el debug que se muestra por pantalla
var useGamepad = false; // true para usar el gamepad, false para usar el teclado (WASD)
var randomPlanets = false;


var starfield;
var planets;
var planetCollisionGroup;
var orb;

var jumpForce = 150;

// a force reducer to let the simulation run smoothly
var forceReducer = 0.015;
// graphic object where to draw planet gravity area

var gravityGraphics;

var socket;

var inputChanged = true;
var charactersList;

var DEFINITION = {
    width: 1200,
    height: 800
}

GALACTIC_STRIKE.Play = function (game) {};

GALACTIC_STRIKE.Play.prototype = {
    preload: function () {},
    create: function () {

        if (!game.spacePhysics) {
            // Inicializamos el motor de físicas
            game.spacePhysics = new SpacePhysics(game)
            game.spacePhysics.debug = true;
            // physics initialization
            game.physics.startSystem(Phaser.Physics.BOX2D);
            //            game.physics.box2d.setBoundsToWorld();
            game.physics.box2d.friction = 50;
        }

        planets = [];
        //        planetCollisionGroup =  game.physics.box2d.createCollisionGroup();
        charactersList = {};


        // Adding graphic objects
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        orb = game.add.sprite(600, 450, 'moon');
        orb.anchor.setTo(0.5);
        orb.pivot.x = 100;


        GALACTIC_STRIKE.room.map = new Stage(game, stages['map2']);
        //        game.physics.box2d.enable(objetoPrueba);
        //        game.spacePhysics.addDynamic(objetoPrueba);

        //        game.time.events.loop(GALACTIC_STRIKE.updateOnlineRate, function(){if(myCharacter) myCharacter.updateOnline();}, this);

        //         myCharacterSetup(GALACTIC_STRIKE.player.character);

        var spawnPosition = GALACTIC_STRIKE.room.map.spawnPositionTeam(GALACTIC_STRIKE.player.team.color - 1);

        var data = {
            id: GALACTIC_STRIKE.player.id,
            x: spawnPosition.x,
            y: spawnPosition.y,
            angle: toRad(spawnPosition.angle - 180),
            velocityX: 0,
            velocityY: 0,
            orientation: 0
        }

        socket.emit('joinGame', data);
        console.log(data);

        GALACTIC_STRIKE.room.gameMode = new GameMode(GALACTIC_STRIKE.room, gameModes['deathmatch']);
        GALACTIC_STRIKE.room.gameMode.init();
        //        GALACTIC_STRIKE.room.gameMode.startRound();
        GALACTIC_STRIKE.room.gameOver = false;
        //        GALACTIC_STRIKE.room.updateCounter = 0;

        spacePhysicsTimer();
        updateOnlineTimer();
        GALACTIC_STRIKE.createGameReady = true;

        for (var c in GALACTIC_STRIKE.charactersBuffer) {
            var input = GALACTIC_STRIKE.charactersBuffer[c];
            var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
            GALACTIC_STRIKE.room.characters[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], asset);
            GALACTIC_STRIKE.room.players[input.id].character = GALACTIC_STRIKE.room.characters[input.id];

            if (input.id === GALACTIC_STRIKE.player.id) {
                GALACTIC_STRIKE.player.characterSetup();
            }


            var logMsg = "";
            for (var c in GALACTIC_STRIKE.room.characters) {
                logMsg += GALACTIC_STRIKE.room.characters[c] + " ";
            }
            console.log("Clients: " + logMsg);
        }
        GALACTIC_STRIKE.zoomed = false;

    },
    update: function () {

        GALACTIC_STRIKE.player.movePlayer();

    },
    render: function () {

        if (gameDebug) {
            game.debug.text("Event cooldown: " + game.time.events.duration, 32, 32);
            if (GALACTIC_STRIKE.player.character) {
                game.debug.text("Planet touched: " +
                    (GALACTIC_STRIKE.player.character.planetTouched ? GALACTIC_STRIKE.player.character.planetTouched.sprite : GALACTIC_STRIKE.player.character.planetTouched), 32, 64);
                game.debug.text("In atmosphere: " + GALACTIC_STRIKE.player.character.inAtmosphere(), 32, 96);
                game.debug.text("Grounded: " + GALACTIC_STRIKE.player.character.isGrounded(), 32, 128);
                game.debug.text('My ID: ' + GALACTIC_STRIKE.player.id, 32, 160);
                game.debug.text('Zoom (toggle with \'Z\') :' + GALACTIC_STRIKE.zoomed, 32, 192);
                game.debug.text('Mute (toggle with \'M\') :' + game.sound.mute, 32, 224);
                //  game.debug.text("Controls in atmosphere : move with : [A D]" + "\t", 32, 256);
                //  game.debug.text("Jump with : [Spacebar]", 32, 288);
                //  game.debug.text("Controls in space : rotate with : [A D]" + "\t", 32, 320);
                //  game.debug.text("Thrust with [SPACEBAR W] and reverse with [S]", 32, 352);
                //  game.debug.text("Attack with Arrow keys!!", 32, 384);
                //                game.debug.spriteCoords(GALACTIC_STRIKE.player.character, 32, 256,'rgba(0,255,255,1)');
                //                game.debug.bodyInfo(GALACTIC_STRIKE.player.character, 32, 308,'rgba(0,255,255,1)');
                //                game.debug.text('Body angle: ' + GALACTIC_STRIKE.player.character.body.angle, 32, 192);
                //                game.debug.text('Anchor: ' + GALACTIC_STRIKE.player.character.x + ',' + GALACTIC_STRIKE.player.character.y, 32, 224);
            }

            //             game.debug.box2dWorld();
            //             game.debug.cameraInfo(game.camera, 300, 32);

        }
        var i = 1;
        // Cuando recorres así una tabla asociativa, en
        // var c se almacena el valor de las CLAVES
        // Para acceder a los valores, hay que indexar la
        // lista con la propia clave 'c'
        for (var c in GALACTIC_STRIKE.room.characters) {
            game.debug.text(GALACTIC_STRIKE.room.characters[c], 640, i * 32);
            ++i;
        }
        game.debug.text("Events : " + game.time.events.length, 640, i * 32);


    },
    quitGame: function () {

        console.log("QUIT GAME");
        socket.emit('leaveGame', {
            id: GALACTIC_STRIKE.player.id
        });
        this.state.start('MainMenu', true, true);

    }
}

function touchPlanetCallback(body1, body2, fixture1, fixture2, begin) {

    body1.mainSprite.planetTouched = body2;
    body1.mainSprite.setGrounded();

}

function touchSpikeballEnemy(body1, body2, fixture1, fixture2, begin) {

    if (body1.sprite &&
        body2.sprite &&
        body1.sprite.owner !== body2.sprite &&
        !body2.sprite.hitImmune &&
        body2.sprite.health > 0) {
        if (body1.sprite.owner.player.team === body2.mainSprite.player.team) {
            return;
        }
        if (body1.sprite.owner === GALACTIC_STRIKE.player.character) {
            body2.sprite.hitImmune = true;
            console.log(body2.mainSprite.player);

            var output = {
                id: GALACTIC_STRIKE.player.id,
                target: body2.mainSprite.player.id,
                damage: body1.sprite.damage
            };

            console.log(output);
            socket.emit('hit', output);
            console.log("Hit");
        }


    }
}

function spacePhysicsTimer() {

    game.spacePhysics.update();

    if (GALACTIC_STRIKE.player.character && GALACTIC_STRIKE.player.character.alive && !GALACTIC_STRIKE.room.gameOver) {
        if (GALACTIC_STRIKE.zoomed && GALACTIC_STRIKE.player.character.inAtmosphere()) {
            //          game.camera.follow(null);
            GALACTIC_STRIKE.zoomed = false;
            GALACTIC_STRIKE.zooming = true;
            var tween = game.add.tween(game.world.scale).to({
                x: 1,
                y: 1
            }, 350, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                game.camera.follow(GALACTIC_STRIKE.player.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
                GALACTIC_STRIKE.room.map.zoomIn();
                GALACTIC_STRIKE.zooming = false;
            }, this);
            tween.start();

        } else if (!GALACTIC_STRIKE.zoomed && !GALACTIC_STRIKE.player.character.inAtmosphere()) {
            //          game.camera.follow(null);
            GALACTIC_STRIKE.zoomed = true;
            GALACTIC_STRIKE.zooming = true;
            var tween = game.add.tween(game.world.scale).to({
                x: 0.5,
                y: 0.5
            }, 350, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {

                game.camera.follow(GALACTIC_STRIKE.player.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
                GALACTIC_STRIKE.room.map.zoomOut();
                GALACTIC_STRIKE.zooming = false;

            }, this);
            tween.start();

            //          GALACTIC_STRIKE.player.character.flightMode();
        }
    }

    game.time.events.add(80, spacePhysicsTimer, this);

}

function updateOnlineTimer() {

    if (GALACTIC_STRIKE.player.character) {
        GALACTIC_STRIKE.player.character.updateOnline();
    }
    game.time.events.add(16 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateOnlineTimer, this);

}


function toRad(value) {

    return (value * Math.PI) / 180;

}
