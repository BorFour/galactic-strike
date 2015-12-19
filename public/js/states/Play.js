GALACTIC_STRIKE.Play = function (game) {};

GALACTIC_STRIKE.Play.prototype = {
    preload: function () {},
    create: function ()
    {

        // Setup of the volume keys
        var muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        muteKey.onDown.add(function ()
        {
            if (!game.sound.mute)
            {
                game.sound.mute = true;
            }
            else
            {
                game.sound.mute = false;
            }
        }, this);

        var upSound = game.input.keyboard.addKey(Phaser.Keyboard.K);
        upSound.onDown.add(function ()
        {
            if (game.sound.mute)
            {
                game.sound.mute = false;
            }
            if (game.sound.volume < 1)
            {
                game.sound.volume += 0.2;
            }
        }, this);

        var downSound = game.input.keyboard.addKey(Phaser.Keyboard.J);
        downSound.onDown.add(function ()
        {
            if (!game.sound.mute)
            {
                game.sound.volume -= 0.2;
            }
            if (game.sound.volume < 0.2)
            {
                game.sound.volume = 0;
                game.sound.mute = true;
            }
        }, this);

        if (!game.spacePhysics)
        {

            game.spacePhysics = new SpacePhysics(game)
            game.spacePhysics.debug = true;

            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.setImpactEvents(true);
            game.physics.p2.updateBoundsCollisionGroup();
            game.physics.p2.restitution = 0.1;
            game.physics.p2.friction = 0.5;
            game.physics.p2.gravityScale = 0;

//            game.physics.p2.friction = 50;
        }

        //        planetCollisionGroup =  game.physics.box2d.createCollisionGroup();

        // Adding graphic objects
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        console.log(GALACTIC_STRIKE.room.currentStageName);
        GALACTIC_STRIKE.room.map = new Stage(game, stages[GALACTIC_STRIKE.room.currentStageName]);

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
        GALACTIC_STRIKE.room.gameOver = false;

        spacePhysicsTimer();
        updateOnlineTimer();
        GALACTIC_STRIKE.createGameReady = true;

        for (var c in GALACTIC_STRIKE.charactersBuffer)
        {
            var input = GALACTIC_STRIKE.charactersBuffer[c];
            var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
            GALACTIC_STRIKE.room.characters[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], asset);
            GALACTIC_STRIKE.room.players[input.id].character = GALACTIC_STRIKE.room.characters[input.id];

            if (input.id === GALACTIC_STRIKE.player.id)
            {
                GALACTIC_STRIKE.player.characterSetup();
            }


            var logMsg = "";
            for (var c in GALACTIC_STRIKE.room.characters)
            {
                logMsg += GALACTIC_STRIKE.room.characters[c] + " ";
            }

            GALACTIC_STRIKE.charactersBuffer[c] = null;

            console.log("Clients: " + logMsg);
        }
        GALACTIC_STRIKE.zoomed = false;

        GALACTIC_STRIKE.hud = new HUD(game);
        GALACTIC_STRIKE.room.roundReady = true;

    },
    update: function ()
    {

        GALACTIC_STRIKE.player.movePlayer();
        GALACTIC_STRIKE.hud.updateText();

    },
    render: function ()
    {

        var i = 1;
        var offsetDebug = 750;
        game.debug.text('Mute (toggle with \'M\') :' + game.sound.mute, 32, offsetDebug + 32 * i);
        i++;
        game.debug.text('Volume (+Up \'K\' , -Down \'J\') :' + game.sound.volume.toPrecision(2) * 100 + '%', 32, offsetDebug + 32 * i);

        if(GALACTIC_STRIKE.player.character) {
            var j = 1;
            game.debug.text('Grounded: ' + GALACTIC_STRIKE.player.character.isGrounded(), 32, offsetDebug - 32 * j);
            j++;
            game.debug.text('Sprite : ' + GALACTIC_STRIKE.player.character.grounded +
                            ', wheels[0] : ' + GALACTIC_STRIKE.player.character.wheels[0].grounded +
                            ', wheels[1] : ' + GALACTIC_STRIKE.player.character.wheels[1].grounded , 32, offsetDebug - 32 * j);
            j++;
            game.debug.text('In atmosphere: ' + GALACTIC_STRIKE.player.character.inAtmosphere(), 32, offsetDebug - 32 * j);
          j++;
            game.debug.text('Atmosphere: ' + GALACTIC_STRIKE.player.character.atmosphere, 32, offsetDebug - 32 * j);
        }
        //            game.debug.box2dWorld();
        //            game.debug.cameraInfo(game.camera, 300, 32);

    },
    quitGame: function ()
    {

        console.log("QUIT GAME");
        socket.emit('leaveGame',
        {
            id: GALACTIC_STRIKE.player.id
        });
        this.state.start('MainMenu', true, true);

    }
}

function touchPlanetCallback(body1, body2, fixture1, fixture2, begin)
{

    body1.mainSprite.planetTouched = body2;
    body1.mainSprite.grounded = true;
//    body1.mainSprite.planetSpring = game.physics.p2.createSpring(body1.mainSprite, body2.sprite, 0.01, 0.01, 0);

}

function untouchPlanetCallback(target)
{

//    setUngrounded(target);

}

/**
 * Sets the grounded attribute of the character to true and tries to set it false after a period of time
 */

function setUngrounded(target)
{
    this.body.mainSprite.grounded = false;
//    if (this.body.groundedTimer)
//    {
//        game.time.events.remove(target.groundedTimer);
//        targthis.bodyet.groundedTimer = null;
//    }
//
//    this.body.groundedTimer = game.time.events.add(100, function ()
//    {
//        this.body.grounded = false;
//
////        this.body.mainSprite.planetTouched = null;
//    }, this);

}


function touchSpikeballEnemy(body1, body2, fixture1, fixture2, begin)
{

    if (body1.sprite &&
        body2.sprite &&
        body1.sprite.owner !== body2.sprite &&
        !body2.sprite.hitImmune &&
        body2.sprite.health > 0)
    {
        if (body1.sprite.owner.player.team === body2.mainSprite.player.team)
        {
            return;
        }
        if (body1.sprite.owner === GALACTIC_STRIKE.player.character)
        {
            body2.sprite.hitImmune = true;
            console.log(body2.mainSprite.player);

            var output = {
                id: GALACTIC_STRIKE.player.id,
                target: body2.mainSprite.player.id,
                damage: body1.sprite.damage
            };

            socket.emit('hit', output);
            console.log('@Client ->      \t| hit');
            console.log(output);
        }


    }
}

function spacePhysicsTimer()
{

    game.spacePhysics.update();

    if (GALACTIC_STRIKE.player.character && GALACTIC_STRIKE.player.character.alive && !GALACTIC_STRIKE.room.gameOver)
    {
        if (GALACTIC_STRIKE.player.character.inAtmosphere())
        {
            zoomInGame();
        }
        else
        {
            zoomOutGame();
        }
    }

    game.time.events.add(80, spacePhysicsTimer, this);

}

function updateOnlineTimer()
{

    if (GALACTIC_STRIKE.player.character)
    {
        GALACTIC_STRIKE.player.character.updateOnline();
    }
    game.time.events.add(20 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateOnlineTimer, this);

}

function zoomInGame()
{

    if (GALACTIC_STRIKE.zoomed)
    {
        GALACTIC_STRIKE.zoomed = false;
        GALACTIC_STRIKE.room.map.zoomIn();
        game.world.scale.set(1);
        GALACTIC_STRIKE.hud.scaleSet(1);
    }
}

function zoomOutGame()
{

    if (!GALACTIC_STRIKE.zoomed)
    {
        GALACTIC_STRIKE.zoomed = true;
        GALACTIC_STRIKE.room.map.zoomOut();
        game.world.scale.set(0.5);
        GALACTIC_STRIKE.hud.scaleSet(2);
    }
}

function toRad(value)
{

    return (value * Math.PI) / 180;

}
