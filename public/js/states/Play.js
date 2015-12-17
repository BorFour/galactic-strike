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
var text;

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


        var muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        muteKey.onDown.add(function () {
            if (!game.sound.mute) {
                game.sound.mute = true;
            } else {
                game.sound.mute = false;
            }
        }, this);

        var upSound = game.input.keyboard.addKey(Phaser.Keyboard.K);
        upSound.onDown.add(function () {
            if (game.sound.mute) {
                game.sound.mute = false;
            }
            if (game.sound.volume < 1) {
                game.sound.volume += 0.2;
            }
        }, this);

        var downSound = game.input.keyboard.addKey(Phaser.Keyboard.J);
        downSound.onDown.add(function () {
            if (!game.sound.mute) {
                game.sound.volume -= 0.2;
            }
            if (game.sound.volume < 0.2){
                game.sound.volume = 0;
                game.sound.mute = true;
            }
        }, this);

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

        console.log(GALACTIC_STRIKE.room.currentStageName);
        GALACTIC_STRIKE.room.map = new Stage(game, stages[GALACTIC_STRIKE.room.currentStageName]);
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

        GALACTIC_STRIKE.hud = new HUD(game);
        GALACTIC_STRIKE.room.roundReady = true;

    },
    update: function () {

        GALACTIC_STRIKE.player.movePlayer();
        GALACTIC_STRIKE.hud.updateText();

    },
    render: function () {

        if (gameDebug) {
            var i = 1;
            var offsetDebug = 750;
/*            game.debug.text("Event cooldown: " + game.time.events.duration, 32, offsetDebug + 32*i);
            i++;
            if (GALACTIC_STRIKE.player.character) {
                game.debug.text("Planet touched: " +
                    (GALACTIC_STRIKE.player.character.planetTouched ? GALACTIC_STRIKE.player.character.planetTouched.sprite : GALACTIC_STRIKE.player.character.planetTouched), 32, offsetDebug + 32*i);
                i++;
                game.debug.text("In atmosphere: " + GALACTIC_STRIKE.player.character.inAtmosphere(), 32, offsetDebug + 32*i);
                i++;
                game.debug.text("Grounded: " + GALACTIC_STRIKE.player.character.isGrounded(), 32, offsetDebug + 32*i);
                i++;
                game.debug.text('My ID: ' + GALACTIC_STRIKE.player.id, 32, offsetDebug + 32*i);
                i++;
                game.debug.text('Zoom (toggle with \'Z\') :' + GALACTIC_STRIKE.zoomed, 32, offsetDebug + 32*i);
*/
                i++;
                game.debug.text('Mute (toggle with \'M\') :' + game.sound.mute, 32, offsetDebug + 32*i);
                i++;
                game.debug.text('Volume (+Up \'K\' , -Down \'J\') :' + game.sound.volume.toPrecision(2)*100 + '%', 32, offsetDebug + 32*i);
                i++;
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

//        }
//        var i = 1;
        // Cuando recorres así una tabla asociativa, en
        // var c se almacena el valor de las CLAVES
        // Para acceder a los valores, hay que indexar la
        // lista con la propia clave 'c'
//        for (var c in GALACTIC_STRIKE.room.characters) {
//            game.debug.text(GALACTIC_STRIKE.room.characters[c], 640, i * 32);
//            ++i;
//        }
//        game.debug.text(GALACTIC_STRIKE.room.teams[0] + " : " +
//                        GALACTIC_STRIKE.room.gameMode.scores[GALACTIC_STRIKE.room.teams[0]] +
//                        " " +
//                        GALACTIC_STRIKE.room.teams[1] + " : " +
//                        GALACTIC_STRIKE.room.gameMode.scores[GALACTIC_STRIKE.room.teams[1]], 640, i * 32);
//        i++;

//        game.debug.text("Events : " + game.time.events.length, 640, i * 32);


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
        if (GALACTIC_STRIKE.player.character.inAtmosphere()) {
          zoomInGame();
        } else {
          zoomOutGame();
        }
    }

    game.time.events.add(80, spacePhysicsTimer, this);

}

function updateOnlineTimer() {

    if (GALACTIC_STRIKE.player.character) {
        GALACTIC_STRIKE.player.character.updateOnline();
    }
    game.time.events.add(20 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateOnlineTimer, this);

}

function zoomInGame () {

     if (GALACTIC_STRIKE.zoomed) {
        GALACTIC_STRIKE.zoomed = false;
        GALACTIC_STRIKE.room.map.zoomIn();
        game.world.scale.set(1);
        GALACTIC_STRIKE.hud.scaleSet(1);
    }
}

function zoomOutGame () {

    if (!GALACTIC_STRIKE.zoomed) {
        GALACTIC_STRIKE.zoomed = true;
        GALACTIC_STRIKE.room.map.zoomOut();
        game.world.scale.set(0.5);
        GALACTIC_STRIKE.hud.scaleSet(2);
    }
}


function toRad(value) {

    return (value * Math.PI) / 180;

}
