var game;

// groups containing crates and planets

////////////
// Gráficos

var starfield;

var crateGroup;
var planets;
var planetTouched;
var orb;

//flag for gameover and limit of crates
var gameover = 0;
var numCrates = 0;
var numCollision = 0;
var x = -1;
var y = -1;

var jumpForce = 150;

var teclado;

var leftKey;
var rightKey;
var upKey;
var downKey;
var rotateLKey;
var rotateRKey;
var fullscreenKey;

var grounded = false;
var debug = true;     // Para el debug que se muestra por la consola
var gameDebug = true; // Para el debug que se muestra por pantalla
var useGamepad = false; // true para usar el gamepad, false para usar el teclado (WASD)
var randomPlanets = false;
var jumpCooldown = true;
// a force reducer to let the simulation run smoothly

var forceReducer = 0.015;

// graphic object where to draw planet gravity area

var gravityGraphics;
var sprite;

////////////////////
// CLIENT CONNECTION
//

var socket;


var inputChanged = true;
var player;
var myId = 0;
var myCharacter;
var charactersList;


window.onload = function() {
	 game = new Phaser.Game(1200, 800, Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
	preload: function(){
        game.load.image("spaceBackground", "assets/spaceBackground.jpg");
		game.load.image("moon", "assets/moon1.png");
        game.load.spritesheet("player", "assets/walking.png", 45, 61);
		game.load.image("planet", "assets/planet1.png");
		game.load.image("bigplanet", "assets/planet2.png");

        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
	},
  	create: function(){

  		// adding groupswddddddddd

        // Llamamos a la conexión del cliente


//        sleep(3000)
        planets = []
        charactersList = {};


  		//crateGroup = game.add.group();
  		//planetGroup = game.add.group();

		// adding graphic objects

		gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2,0xffffff,0.5);



        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

		// stage setup

		game.stage.backgroundColor = "#122112";
        game.world.setBounds(0, 0, 1400, 1400);

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


		// adding a couple of planets. Arguments are:
		// x position
		// y position
		// gravity radius
		// gravity force
		// graphic asset

        var planet = new Star(680, 700, 400, 250, "planet", game);
        var bigPlanet = new Star(1070, 850, 400, 250, "bigplanet", game);

        if(randomPlanets){
//(Edu) No se si hay que hacer spacePhysics.addPlanet para añadirlo al grupo de esa clase o simplemente con el planets.push de aqui valdría
            for (var i = 0; i < 5; i++){
                planets.push(new Star(game.world.randomX, game.world.randomY, 400, 250, "planet", game))
            }

            for (var i = 0; i < 3; i++){
                planets.push(new Star(game.world.randomX, game.world.randomY, 400, 250, "bigplanet", game))
            }
        }
		else{
//(Edu) No se si hay que hacer spacePhysics.addPlanet para añadirlo al grupo de esa clase o simplemente con el planets.push de aqui valdría
            planets.push(planet)
            planets.push(bigPlanet)
        }

        console.log("Planets: " + planets)


        orb = game.add.sprite(600, 450, 'moon');
        orb.anchor.setTo(0.5);
        orb.pivot.x = 100;

		// waiting for player input

		//game.input.onDown.add(addCrate, this);

        // Añadimos al "jugador" al mundo

        /*
        sprite = game.add.sprite(game.world.randomX, game.world.randomY, "crate");
        sprite.anchor.setTo(0.5, 0.5)
        game.physics.box2d.enable(sprite);
        */

        //////////////////
        //NUEVO PERSONAJE
        //


//        myCharacter = new Character (myId, game.world.randomX, game.world.randomY, game, player)


        //game.physics.overlap(sprite, planetGroup, setGrounded, null, this);

        cursors = game.input.keyboard.createCursorKeys();

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(jumpCharacter, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);


        ///////////
        // TECLADO
        //

        if (!useGamepad){

            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
            rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
            upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
            downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
            rotateLKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            rotateRKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
            fullscreenKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
        }
        ///////////
        // GAMEPAD
        //

        // No funciona todavía!
        else {
            game.input.gamepad.start();
            var pad = game.input.gamepad.pad1;
            console.log(pad)
            leftKey = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightKey = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
            upKey = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
            downKey = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
            rotateLKey = pad.getButton(Phaser.Gamepad.XBOX360_LEFT_TRIGGER)
            rotateRKey = pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)
        }



        // Actualizar el planeta en el que está el personaje

        // Crea la conexión con el servidor
        socket = io();
        if(socket){
            console.log("@Socket.io | Cliente conectado");
        }

        clientSetup();

        var data = {
            x: game.world.randomX,
            y: game.world.randomY,
            angle: 0
        }

        socket.emit('add user', data);


	},
	update: function(){

        movePlayer();
        if(myCharacter) myCharacter.update();
        game.spacePhysics.update();
        orb.rotation += 0.05;

	},
    render: function(){

         if(gameDebug) {
             game.debug.text("Jump cooldown: " + game.time.events.duration, 32, 32);
             game.debug.text("Planet touched: " + planetTouched, 32, 64);
             game.debug.text("Move with : [W A S D]"  + "\t",32, 688);
             game.debug.text("Rotate with: [Q E]" ,32, 720);
             game.debug.text("Jump with : [Spacebar]" ,32, 752);
            //  game.debug.box2dWorld();

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


function jumpCharacter(){
        if(planetTouched != null && jumpCooldown){
            jumpCooldown = false;
            var angle = Phaser.Math.angleBetween(sprite.x,sprite.y,planetTouched.x,planetTouched.y);
            // add gravity force to the crate in the direction of planet center
            sprite.body.applyForce(-Math.cos(angle)*jumpForce,-Math.sin(angle)*jumpForce);
            if(debug) console.log("jump from (" + planetTouched.x + "," + planetTouched.y + ")")
            planetTouched = null
//            myCharacter.jumpSound.play();
            game.time.events.add(560, refreshJumpCooldown, this)
        }
}

function refreshJumpCooldown(){
    jumpCooldown = true;
}

function touchPlanetCallback(body1, body2, fixture1, fixture2, begin) {
    if(!planetTouched){
        planetTouched = body2
        if(debug) {
            console.log("planet touched gravity force: " + body2.x)
            console.log(typeof body1)
        }
        myCharacter.sprite.body.static = true;
        myCharacter.sprite.body.dynamic = false;

        // NO FUNCIONA
        //game.time.events.add(30, rotateTo, this)
    }
}


function toRad(value){
    return (value * Math.PI) / 180
}

