var game;

var starfield;



var planets;

var planetCollisionGroup;

var orb;

var jumpForce = 150;


var debug = true;     // Para el debug que se muestra por la consola
var gameDebug = true; // Para el debug que se muestra por pantalla
var useGamepad = false; // true para usar el gamepad, false para usar el teclado (WASD)
var randomPlanets = false;

// a force reducer to let the simulation run smoothly

var forceReducer = 0.015;

// graphic object where to draw planet gravity area

var gravityGraphics;

////////////////////
// CLIENT CONNECTION
//

var socket;


var inputChanged = true;
var charactersList;

var DEFINITION = {
    width: 1200,
    height : 800
}

GALACTIC_STRIKE.PlayGame = function(game){};

/**
 * Load all the assets (images and sound) for this game
 */

// No sé muy bien dónde iría esto, pero de momento aquí

load_assets = function (){

        game.load.image("spaceBackground", "../assets/spaceBackground.jpg");
		game.load.image("pokeball", "../assets/pokeball.png");
		game.load.image("potion", "../assets/potion.gif");
		game.load.image("moon", "../assets/moon1.png");
		game.load.image("bullet", "../assets/blue-bullet.gif");
		game.load.image("laser_bullet", "../assets/laser_bullet.jpg");
		game.load.image("cucumber", "../assets/cucumber.png");
		game.load.image("spikeball", "../assets/spikeball.gif");
        //game.load.spritesheet("player", "../assets/ironman_45_75.png", 45, 75);
        game.load.spritesheet("playerRed", "../assets/spritesIndividuales/robotnik/robotnik_red.png", 48, 59); //rueda: 26_23  | robotnik: 49_43
        game.load.spritesheet("playerBlue", "../assets/spritesIndividuales/robotnik/robotnik_blue.png", 48, 59); //rueda: 26_23  | robotnik: 49_43

        //game.load.spritesheet("player_jump", "assets/jump_fly_land.png", 52, 75);
        game.load.spritesheet("deathstar", "../assets/deathstar.gif", 64, 64);
		game.load.image("planet", "../assets/planet1.png");
		game.load.image("bigplanet", "../assets/bigplanet.png");
		game.load.image("giantplanet", "../assets/giantplanet.png");
		game.load.image("wheel_red", "../assets/spritesIndividuales/robotnik/wheel_red.png");
		game.load.image("wheel_blue", "../assets/spritesIndividuales/robotnik/wheel_blue.png");


        game.load.audio('jump', ['../assets/jump.ogg', '../assets/jump.mp3']);
        game.load.audio('pingas', '../assets/sound/pingas.mp3');

}

GALACTIC_STRIKE.PlayGame.prototype = {
	preload: function(){

        //load_assets();


	},
  	create: function(){


        planets = []
//        planetCollisionGroup =  game.physics.box2d.createCollisionGroup();
        charactersList = {};

		// adding graphic objects

		gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2,0xffffff,0.5);

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

		// stage setup

		game.stage.backgroundColor = "#122112";
        game.world.setBounds(0, 0, 2400, 2400);

        /*
        starfield = game.add.sprite(0, 0, 'spaceBackground');
        starfield.x = 0;
        starfield.y = 0;
        starfield.height = game.world.height;
        starfield.width = game.world.width;
        */
        //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;


		// physics initialization

		game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.setBoundsToWorld();
        game.physics.box2d.friction = 50;


        // Inicializamos el motor de físicas
        game.spacePhysics = new SpacePhysics(game)
        game.spacePhysics.debug = true;
		//game.physics.box2d.friction = 5000;

//        var planet = new Star(680, 700, 400, 250, "planet", game);
//        var bigPlanet = new Star(1070, 850, 400, 250, "bigplanet", game);
        var giantPlanet = new Star(800, 900, 600, 750, "giantplanet", game);

//(Edu) No se si hay que hacer spacePhysics.addPlanet para añadirlo al grupo de esa clase o simplemente con el planets.push de aqui valdría
//            planets.push(planet)
//            planets.push(bigPlanet)
        planets.push(giantPlanet)
        giantPlanet.body.setCircle(525);

        console.log("Planets: " + planets)


        orb = game.add.sprite(600, 450, 'moon');
        orb.anchor.setTo(0.5);
        orb.pivot.x = 100;

//        var elementoPrueba = new Element(game, game.world.randomX, game.world.randomY, 'deathstar');
//        game.physics.box2d.enable(elementoPrueba);


        // Mira cómo instancio a la poción
        // la variable 'items' se encuentra en 'items.json', donde estarán definidos todos los objetos del juego

//        var objetoPrueba = new Item(game, game.world.randomX, game.world.randomY, items['potion']);
//        game.physics.box2d.enable(objetoPrueba);
//        game.spacePhysics.addDynamic(objetoPrueba);


//        game.time.events.loop(GALACTIC_STRIKE.updateOnlineRate, function(){if(myCharacter) myCharacter.updateOnline();}, this);

//         myCharacterSetup(GALACTIC_STRIKE.player.character);

        var data = {
            id : GALACTIC_STRIKE.player.id,
            x: game.world.randomX,
            y: game.world.randomY,
            angle: 0,
            velocityX : 0,
            velocityY : 0,
            orientation: 0
        }

        socket.emit('joinGame', data);
        console.log(data);

        GALACTIC_STRIKE.room.gameMode = new GameMode(GALACTIC_STRIKE.room, gameModes['deathmatch']);
        GALACTIC_STRIKE.room.gameMode.init();
        GALACTIC_STRIKE.room.gameMode.startRound();
        GALACTIC_STRIKE.room.gameOver = false;

	},
	update: function(){

        GALACTIC_STRIKE.player.movePlayer();
        if(GALACTIC_STRIKE.player.character)
        {
            GALACTIC_STRIKE.player.character.updateOnline();
        }
        game.spacePhysics.update();
        if(!GALACTIC_STRIKE.room.gameOver) GALACTIC_STRIKE.room.gameOver = GALACTIC_STRIKE.room.gameMode.update();
        orb.rotation += 0.05;
        if(GALACTIC_STRIKE.endGame) this.quitGame();

	},
    render: function(){

         if(gameDebug)
         {
             game.debug.text("Jump cooldown: " + game.time.events.duration, 32, 32);
             if(GALACTIC_STRIKE.player.character)
             {
                game.debug.text("Planet touched: " + GALACTIC_STRIKE.player.character.planetTouched, 32, 64);
                game.debug.text("In atmosphere: " + GALACTIC_STRIKE.player.character.inAtmosphere(), 32, 96);
                game.debug.text("Grounded: " + GALACTIC_STRIKE.player.character.isGrounded(), 32, 128);
                game.debug.text('My ID: ' + GALACTIC_STRIKE.player.id, 32, 160);
                game.debug.text('Zoom (toggle with \'Z\') :'  + GALACTIC_STRIKE.zoomed, 32, 192);
                game.debug.text('Mute (toggle with \'M\') :'  + game.sound.mute, 32, 224);
                game.debug.text("Move with : [W A S D]"  + "\t",32, 256);
                game.debug.text("Rotate with: [Q E]" ,32, 288);
                game.debug.text("Jump with : [Spacebar]" ,32, 320);
                game.debug.text("Attack with Arrow keys!!" ,32, 352);
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
            for (var c in charactersList){
                game.debug.text(charactersList[c], 640, i*32);
                ++i;
            }
            game.debug.text("Events : " + game.time.events.length, 640, i*32);


    },
    quitGame: function(){
        console.log("QUIT GAME");
        socket.emit('leaveGame', {id : GALACTIC_STRIKE.player.id});
        this.state.start('MainMenu', true, true);
    }
}

function touchPlanetCallback(body1, body2, fixture1, fixture2, begin) {

        body1.mainSprite.planetTouched = body2;
        body1.mainSprite.setGrounded();
//        body1.fixedRotation = true;
        if(debug) {
//            console.log("planet touched gravity force: " + body2.x)
//            console.log(body1)
        }
}

function touchSpikeballEnemy(body1, body2, fixture1, fixture2, begin) {

        if(body1.sprite &&
           body2.sprite &&
           body1.sprite.owner !== body2.sprite &&
           !body2.sprite.hitImmune &&
           body2.sprite.health > 0)
        {
            if(body1.sprite.owner === GALACTIC_STRIKE.player.character)
            {
               console.log(body2.mainSprite.player);
               var output = {
                   id : GALACTIC_STRIKE.player.id,
                   target : body2.mainSprite.player.id,
                   damage : body1.sprite.damage
               };

                console.log(output);
                socket.emit('hit', output);
                console.log("Hit");
            }


        }
}

function toRad(value){
    return (value * Math.PI) / 180
}


function myCharacterSetup(character){


//            character.jumpSound = game.add.audio('jump');

//            game.spacePhysics.addDynamic(sprite);

            // ESTO PROBABLEMENTE NO DEBA IR AQUÍ
            game.camera.follow(character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

            var fireKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
            fireKey.onDown.add(function(){character.fire()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NUMPAD_0);



            var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            attackKey.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id};
                socket.emit('attack', output);
                character.attack()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);



            var attack2Key = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            attack2Key.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id};
                socket.emit('attack2', output);
                character.attack2()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);



            var zoomKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
            zoomKey.onDown.add(function(){
                if (!GALACTIC_STRIKE.zoomed){
                    game.camera.follow(null);
                    game.add.tween(game.world.scale).to( {x: 0.5, y:0.5}, 350, Phaser.Easing.Quadratic.InOut, true);
                    GALACTIC_STRIKE.zoomed = true;
                    game.camera.follow(GALACTIC_STRIKE.player.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

                }
                else{
                    game.camera.follow(null);
                    game.add.tween(game.world.scale).to( {x: 1, y:1}, 350, Phaser.Easing.Quadratic.InOut, true);
                    GALACTIC_STRIKE.zoomed = false;
                    game.camera.follow(GALACTIC_STRIKE.player.character,  Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
                }
            }, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Z);



            var muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
            muteKey.onDown.add(function(){
                if (!game.sound.mute){
                    game.sound.mute = true;
                }
                else{
                    game.sound.mute = false;
                }
            }, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.M);


            var respawnKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
            respawnKey.onDown.add(function(){
                console.log("DIE")
                GALACTIC_STRIKE.player.character.die();
                charactersList[GALACTIC_STRIKE.player.id] = new Character(game.world.randomX, game.world.randomY, game, GALACTIC_STRIKE.player.id, 'player');
                GALACTIC_STRIKE.player.character = charactersList[GALACTIC_STRIKE.player.id];
                myCharacterSetup(GALACTIC_STRIKE.player.character);
            }, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.R);


            for (var i = 0; i < planets.length; i++){
//                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
                character.body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                character.wheels[0].body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                character.wheels[1].body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);

            }

//            character.body.setColissionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.PLAYER);
}


