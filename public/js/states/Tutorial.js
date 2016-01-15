GALACTIC_STRIKE.Tutorial = function (game) {};

GALACTIC_STRIKE.Tutorial.prototype = {
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

        game.world.setBounds(0, 0, stages['tutorial'].width, stages['tutorial'].height);
        /////////////////////////////
        GALACTIC_STRIKE.room = new Room("Tutorial Room", GALACTIC_STRIKE.player.id, 8);
        GALACTIC_STRIKE.room.addPlayer(GALACTIC_STRIKE.player.id, GALACTIC_STRIKE.player);
        GALACTIC_STRIKE.room.addTeam("Red Team", GALACTIC_STRIKE.redTeamAnthem);
        GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[0]);
        GALACTIC_STRIKE.player.team.color = 1;

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

        //console.log(GALACTIC_STRIKE.room.currentStageName);


        console.log("LLEGA3")




        GALACTIC_STRIKE.room.stage = new Stage(game, stages['tutorial']);

        var spawnPosition = GALACTIC_STRIKE.room.stage.spawnPositionTeam(0); //1=red

        //        var data = {
        //            id: GALACTIC_STRIKE.player.id,
        //            x: spawnPosition.x,
        //            y: spawnPosition.y,
        //            angle: toRad(spawnPosition.angle - 180),
        //            velocityX: 0,
        //            velocityY: 0,
        //            orientation: 0
        //        }
        //
        //        socket.emit('joinGame', data);
        //        console.log(data);

        GALACTIC_STRIKE.room.gameMode = new GameMode(GALACTIC_STRIKE.room, gameModes['tutorial']);
        GALACTIC_STRIKE.room.gameMode.init();
        GALACTIC_STRIKE.room.gameOver = false;

        spacePhysicsTimerTutorial();
        //        updateOnlineTimer();
        //        if (GALACTIC_STRIKE.player.id == GALACTIC_STRIKE.room.host)
        //        {
        //            console.log("I am host");
        //            GALACTIC_STRIKE.room.gameMode.createItems();
        //            updateStageOnlineTimer();
        //        }
        GALACTIC_STRIKE.createGameReady = true;

        //        for (var c in GALACTIC_STRIKE.charactersBuffer)
        //        {
        //var input = GALACTIC_STRIKE.charactersBuffer[0];
        var asset = ('playerRed');
        GALACTIC_STRIKE.room.characters[GALACTIC_STRIKE.player.id] = new Character(970, 500, GALACTIC_STRIKE.player.angle, game, GALACTIC_STRIKE.player, characters['robotnik']);
        GALACTIC_STRIKE.room.players[GALACTIC_STRIKE.player.id].character = GALACTIC_STRIKE.room.characters[GALACTIC_STRIKE.player.id];
        GALACTIC_STRIKE.player.characterSetup();


        var style = {
            font: "bold 26px Arial",
            fill: "#fff",
        };

        var controlText1 = game.add.text(970, 400, "Move with [A D] and brake with [S]", style);
        controlText1.anchor.set(0.5);
        controlText1.fixedToCamera = false;


        var controlText2 = game.add.text(1370, 520, "Hold [SHIFT] to use the turbo", style);
        controlText2.anchor.set(0.5);
        controlText2.fixedToCamera = false;
        controlText2.angle = 50;

        var buttonMenu = game.add.button(1000, 1000, 'buttonTutorial',
            function () {
                location.reload();
            }
            , this, 0, 0, 0, 0);

        buttonMenu.anchor.set(0.5);
        buttonMenu.fixedToCamera = false;
        // if (input.id === GALACTIC_STRIKE.player.id)
        //{
        //     GALACTIC_STRIKE.player.characterSetup();
        //}

        //console.log("Clients: " + logMsg);

        GALACTIC_STRIKE.zoomed = false;

        //GALACTIC_STRIKE.hud = new HUD(game);
        GALACTIC_STRIKE.room.roundReady = true;
        GALACTIC_STRIKE.currentSong.play();
    },
    update: function ()
    {
        game.camera.focusOn(GALACTIC_STRIKE.player.character);

        GALACTIC_STRIKE.player.movePlayer();
        // GALACTIC_STRIKE.hud.updateText();

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

function spacePhysicsTimerTutorial()
{

    game.spacePhysics.update();

    /*if (GALACTIC_STRIKE.player.character && GALACTIC_STRIKE.player.character.alive && !GALACTIC_STRIKE.room.gameOver)
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
*/
    game.time.events.add(80, spacePhysicsTimerTutorial, this);

}

function updateOnlineTimerTutorial()
{

    if (GALACTIC_STRIKE.player.character)
    {
        GALACTIC_STRIKE.player.character.updateOnline();
    }
    game.time.events.add(8 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateOnlineTimerTutorial, this);

}

function updateStageOnlineTimerTutorial()
{

    var items = GALACTIC_STRIKE.room.stage.itemsData();
    var output = {
        items: items
    };
    socket.emit('updateStage', output);
    game.time.events.add(30 * (Object.keys(GALACTIC_STRIKE.room.players).length), updateStageOnlineTimerTutorial, this);

}


function toRad(value)
{

    return (value * Math.PI) / 180;

}
