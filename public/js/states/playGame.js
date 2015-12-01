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
        game.load.image("player", "../assets/spritesIndividuales/robotnik/slice04_04.png"); //rueda: 26_23  | robotnik: 49_43

        //game.load.spritesheet("player_jump", "assets/jump_fly_land.png", 52, 75);
        game.load.spritesheet("deathstar", "../assets/deathstar.gif", 64, 64);
		game.load.image("planet", "../assets/planet1.png");
		game.load.image("bigplanet", "../assets/bigplanet.png");
		game.load.image("giantplanet", "../assets/giantplanet.png");
		game.load.image("ruedaL", "../assets/spritesIndividuales/robotnik/slice01_01.png");
		game.load.image("ruedaR", "../assets/spritesIndividuales/robotnik/slice03_03.png");

        game.load.audio('jump', ['../assets/jump.ogg', '../assets/jump.mp3']);

}

GALACTIC_STRIKE.PlayGame.prototype = {
	preload: function(){

        load_assets();


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


        // Crea la conexión con el servidor
        socket = io();
        console.log(io)
        console.log(socket)
        if(socket){
            console.log("@Socket.io | Cliente conectado");
        }

        clientSetup();

        var data = {
            x: game.world.randomX,
            y: game.world.randomY,
            angle: 0,
            velocityX : 0,
            velocityY : 0,
            orientation: 0
        }

        socket.emit('login', data);
        console.log('@Client sent | login');

//        game.time.events.loop(GALACTIC_STRIKE.updateOnlineRate, function(){if(myCharacter) myCharacter.updateOnline();}, this);


	},
	update: function(){

        GALACTIC_STRIKE.player.movePlayer();
        if(GALACTIC_STRIKE.player.character) GALACTIC_STRIKE.player.character.updateOnline();
        game.spacePhysics.update();
        orb.rotation += 0.05;

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
                game.debug.text("Attack with NUMPAD!!" ,32, 352);
//                game.debug.spriteCoords(GALACTIC_STRIKE.player.character, 32, 256,'rgba(0,255,255,1)');
//                game.debug.bodyInfo(GALACTIC_STRIKE.player.character, 32, 308,'rgba(0,255,255,1)');
//                game.debug.text('Body angle: ' + GALACTIC_STRIKE.player.character.body.angle, 32, 192);
//                game.debug.text('Anchor: ' + GALACTIC_STRIKE.player.character.x + ',' + GALACTIC_STRIKE.player.character.y, 32, 224);
             }

//             game.debug.box2dWorld();
             game.debug.cameraInfo(game.camera, 300, 32);

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

        if(body1.sprite.owner !== body2.sprite)
        {
            body2.mainSprite.hp -= 35;
        }
}

function toRad(value){
    return (value * Math.PI) / 180
}

