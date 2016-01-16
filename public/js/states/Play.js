GALACTIC_STRIKE.Play = function (game) {};

GALACTIC_STRIKE.Play.prototype = {
    preload: function () {},
    create: function ()
    {

        switch (GALACTIC_STRIKE.controller)
        {
        case 'keyboard':
            GALACTIC_STRIKE.player.controller = new Controller(0);
            break;
        case 'gamepad':
            GALACTIC_STRIKE.player.controller = new Controller(1);
            break;
        case 'virtual':
            GALACTIC_STRIKE.player.controller = new Controller(2);
            break;
        }

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

        game.world.setBounds(0, 0, stages[GALACTIC_STRIKE.room.currentStageName].width, stages[GALACTIC_STRIKE.room.currentStageName].height);

        if (!game.spacePhysics)
        {
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.setImpactEvents(true);
            game.physics.p2.restitution = 0.1;
            game.physics.p2.friction = 0.5;
            game.physics.p2.gravityScale = 0;

            game.spacePhysics = new SpacePhysics(game)
            game.spacePhysics.debug = true;
            //            game.physics.p2.friction = 50;
        }

        //        planetCollisionGroup =  game.physics.box2d.createCollisionGroup();

        // Adding graphic objects
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        console.log(GALACTIC_STRIKE.room.currentStageName);
        GALACTIC_STRIKE.room.stage = new Stage(game, stages[GALACTIC_STRIKE.room.currentStageName]);

        var spawnPosition = GALACTIC_STRIKE.room.stage.spawnPositionTeam(GALACTIC_STRIKE.player.team.color - 1);

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
        if (GALACTIC_STRIKE.player.id == GALACTIC_STRIKE.room.host)
        {
            console.log("I am host");
            GALACTIC_STRIKE.room.gameMode.createItems();
            updateStageOnlineTimer();
        }
        GALACTIC_STRIKE.createGameReady = true;

        for (var c in GALACTIC_STRIKE.charactersBuffer)
        {
            var input = GALACTIC_STRIKE.charactersBuffer[c];
            var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
            GALACTIC_STRIKE.room.characters[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], characters[GALACTIC_STRIKE.room.players[input.id].characterKey]);
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
        GALACTIC_STRIKE.currentSong.play();
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

//
//        if (GALACTIC_STRIKE.player.character)
//        {
//            //            var point = new Phaser.Point(GALACTIC_STRIKE.player.character.x, GALACTIC_STRIKE.player.character.y);
//            //            game.debug.geom(point, 'rgba(255,255,255,1)');
//
//            //            for (var i = 0; i < GALACTIC_STRIKE.room.stage.planets.length; i++)
//            //            {
//            ////                var point = new Phaser.Point(GALACTIC_STRIKE.room.stage.planets[i].x, GALACTIC_STRIKE.room.stage.planets[i].y);
//            ////                game.debug.geom(point, 'rgba(255,0,255,1)');
//            //
//            //            }
//            var j = 1;
//            game.debug.text('Grounded: ' + GALACTIC_STRIKE.player.character.isGrounded(), 32, offsetDebug - 32 * j);
//            j++;
//            game.debug.text('Sprite : ' + GALACTIC_STRIKE.player.character.grounded +
//                ', wheels[0] : ' + GALACTIC_STRIKE.player.character.wheels[0].grounded +
//                ', wheels[1] : ' + GALACTIC_STRIKE.player.character.wheels[1].grounded, 32, offsetDebug - 32 * j);
//            j++;
//            game.debug.text('In atmosphere: ' + GALACTIC_STRIKE.player.character.inAtmosphere(), 32, offsetDebug - 32 * j);
//            j++;
//            game.debug.text('Atmosphere: ' + GALACTIC_STRIKE.player.character.atmosphere, 32, offsetDebug - 32 * j);
//            j++;
//            var p = GALACTIC_STRIKE.player.character.atmosphere[0];
//            if (p)
//            {
//                var c = GALACTIC_STRIKE.player.character;
//                game.debug.text('Distance: ' + Phaser.Math.distance(c.x, c.y, p.x, p.y), 32, offsetDebug - 32 * j);
//                j++;
//                game.debug.text('Gravity Radius: ' + p.gravityRadius + ' GR + CR: ' + ((p.collisionRadius + p.gravityRadius) / 2), 32, offsetDebug - 32 * j);
//                j++;
//                game.debug.text('Width: ' + p.width + ' collisioRadius: ' + p.collisionRadius, 32, offsetDebug - 32 * j);
//                j++;
//            }



            //            game.debug.cameraInfo(game.camera, 300, 32);

//        }
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
    game.time.events.add(8 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateOnlineTimer, this);

}

function updateStageOnlineTimer()
{

    var items = GALACTIC_STRIKE.room.stage.itemsData();
    var output = {
        items: items
    };
    socket.emit('updateStage', output);
    game.time.events.add(30 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateStageOnlineTimer, this);

}

function zoomInGame()
{
    if (GALACTIC_STRIKE.zoomed)
    {
        GALACTIC_STRIKE.zoomed = false;
        GALACTIC_STRIKE.room.stage.zoomIn();
        game.world.scale.set(1);
        GALACTIC_STRIKE.hud.scaleSet(1);
    }
}

function zoomOutGame()
{
    if (!GALACTIC_STRIKE.zoomed)
    {
        GALACTIC_STRIKE.zoomed = true;
        GALACTIC_STRIKE.room.stage.zoomOut();
        game.world.scale.set(0.5);
        GALACTIC_STRIKE.hud.scaleSet(2);
    }
}

function toRad(value)
{

    return (value * Math.PI) / 180;

}

function fromRad(value)
{

    return (value * 180) / Math.PI;
}
