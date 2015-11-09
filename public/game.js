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
        game.load.spritesheet("player", "assets/dude.png", 32, 48);
		game.load.image("planet", "assets/planet1.png");
		game.load.image("bigplanet", "assets/planet2.png");
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

        if(randomPlanets){

            for (var i = 0; i < 5; i++){
                planets.push(game.spacePhysics.addPlanet(game.world.randomX, game.world.randomY, 400, 250, "planet"))
            }

            for (var i = 0; i < 3; i++){
                planets.push(game.spacePhysics.addPlanet(game.world.randomX, game.world.randomY, 400, 250, "bigplanet"))
            }
        }
		else{
            planets.push(game.spacePhysics.addPlanet(680, 700, 400, 250, "planet"))
            planets.push(game.spacePhysics.addPlanet(1070, 850, 400, 250, "bigplanet"))
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
        myCharacter = new Character (300, 300, game, -1)
        console.log("He creado a mi personaje")
//        charactersList[myId] = myCharacter

        sprite = myCharacter.character

        /*
        sprite = game.add.sprite(game.world.randomX, game.world.randomY,'player');
        sprite.anchor.setTo(0.5, 0.5);
        //DUDE es demasiado grande
        sprite.scale.setTo(0.65,0.65);
        //game.physics.arcade.enable(this.player);
        game.physics.box2d.enable(sprite);
          */
        //añadimos rebote
        /*
        sprite.body.bounce.y = 0.2;
        sprite.body.gravity.y = 500;
        */

        //DUDE
        // Our two animations, walking left and right.
          /*
        sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        sprite.animations.add('right', [5, 6, 7, 8], 10, true);

        */


        game.spacePhysics.addDynamic(sprite);
        game.camera.follow(sprite);

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

        for (var i = 0; i < planets.length; i++){
            console.log("loooop")
            sprite.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
        }

        // Crea la conexión con el servidor
        socket = io();
        if(socket){
            console.log("@Socket.io | Cliente conectado");
        }

        clientSetup();

        var data = {
            x: myCharacter.character.x,
            y: myCharacter.character.y,
            angle: myCharacter.character.angle
        }

        socket.emit('add user', data);


	},
	update: function(){

        myCharacter.update();
        movePlayer();
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

         }

            game.debug.text(myCharacter, 640, 32);

    }
}

function updateEureca(){

    myCharacter.input.left = leftKey.isDown;
	myCharacter.input.right = rightKey.isDown;
	myCharacter.input.up = upKey.isDown;
    myCharacter.input.down = downKey.isDown;
	myCharacter.input.fire = game.input.activePointer.isDown;
	myCharacter.input.tx = game.input.x+ game.camera.x;
	myCharacter.input.ty = game.input.y+ game.camera.y;

     for (var i in charactersList)
    {
		if (!charactersList[i]) continue;
		//var curBullets = charactersList[i].bullets;
		var curChar = charactersList[i].character;
		for (var j in charactersList)
		{
			if (!charactersList[j]) continue;
			if (j!=i)
			{

				var targetChar = charactersList[j].character;

				//game.physics.arcade.overlap(curBullets, targetChar, bulletHitPlayer, null, this);

			}
			if (charactersList[j].alive)
			{
				charactersList[j].update();
			}
		}
    }


}

function movePlayer(){

      //sprite.body.setZeroVelocity();

      //  if(sprite.body.wasTouching.down){
      //      }

        //if (cursors.left.isDown)
        if (leftKey.isDown)
        {
            sprite.body.velocity.x -= 5.101;
            sprite.animations.play('left');
        }
        //else if (cursors.right.isDown)
        else if (rightKey.isDown)
        {
            sprite.body.velocity.x += 5.101;
            sprite.animations.play('right');
        }

        else {
            sprite.animations.stop();
        }

        //if (cursors.up.isDown)
        if (upKey.isDown)
        {
            sprite.body.velocity.y -= 5.101;
        }
        //else if (cursors.down.isDown)
        else if (downKey.isDown)
        {
            sprite.body.velocity.y += 5.101;
        }

        if (rotateLKey.isDown)
        {
            sprite.body.angularVelocity -= 0.15;
        }
        //else if (cursors.down.isDown)
        else if (rotateRKey.isDown)
        {
            sprite.body.angularVelocity += 0.15;
        }

        // NO FUNCIONA
        // Parece que el navegador no le da permisos suficientes
        // a Phaser

        /*
        if (fullscreenKey.isDown)
        {
            gofull()
        }
        */

}

function clientSetup(){

  // Socket events

  // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        console.log(message, {
          prepend: true
        });
        myCharacter.id = data.id;
        console.log("Your client ID is: " + myCharacter.id);
//        addParticipantsMessage(data);
    });

  // Whenever the server emits 'updatePlayer', update the chat body
    socket.on('updatePlayer', function (input) {
        if(myCharacter.id == input.id){
            console.log("Updating my character");
            myCharacter.character.x = input.data.x
            myCharacter.character.y = input.data.y
            myCharacter.character.angle = input.data.angle
        }
        else{
            charactersList[input.id].x = input.data.x
            charactersList[input.id].y = input.data.y
            charactersList[input.id].angle = input.data.angle
        }
    });

  // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
        console.log("Client " + data.id + ' joined');
        charactersList[data.id] = new Character(data.x, data.y, game, data.id);
//        addParticipantsMessage(data);
    });

  // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
        console.log(data.username + ' left');
        var c = charactersList[data.id];
        c.kill()
        delete charactersList[data.id];
//        addParticipantsMessage(data);
//        removeChatTyping(data);
    });

  // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function (data) {
        addChatTyping(data);
    });

  // Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', function (data) {
    removeChatTyping(data);
});



}

function jumpCharacter(){
        if(planetTouched != null && jumpCooldown){
            jumpCooldown = false;
            var angle = Phaser.Math.angleBetween(sprite.x,sprite.y,planetTouched.x,planetTouched.y);
            // add gravity force to the crate in the direction of planet center
            sprite.body.applyForce(-Math.cos(angle)*jumpForce,-Math.sin(angle)*jumpForce);
            if(debug) console.log("jump from (" + planetTouched.x + "," + planetTouched.y + ")")
            planetTouched = null
            game.time.events.add(560, refreshJumpCooldown, this)
        }
}

function refreshJumpCooldown(){
    jumpCooldown = true;
}

function touchPlanetCallback(player, planet){
    if(!planetTouched){
        planetTouched = planet
        if(debug) console.log("planet touched gravity force: " + planet.x)


        // NO FUNCIONA
        //game.time.events.add(30, rotateTo, this)

    }
}

function rotateTo(){

    if (!planetTouched) return;

    var angle = Phaser.Math.angleBetween(sprite.x,sprite.y,planetTouched.x,planetTouched.y);

    console.log("Ángulo = " + angle + " ángulo sprite = " + toRad(sprite.angle))

    if (Math.abs(angle - toRad(sprite.angle) < -0.8)) {
        if(debug) console.log("Ángulo corregido")
        sprite.body.immovable = true;
        sprite.body.static = true;
        sprite.body.moves = false;
        sprite.body.velocity = 0;
        //game.physics.removeBody(sprite.body);
        //sprite.angularVelocity = 0;
        //sprite.body.velocity.x = 0;
        //sprite.body.velocity.y = 0;
        return;
    }
    if(angle < 0){
        sprite.angle += 5;
        if(debug) console.log("Girando a la izquierda")
    }
    else{
        if(debug) console.log("Girando a la derecha")
        sprite.angle -= 5;
    }

    game.time.events.add(30, rotateTo,this)

}

function toRad(value){
    return (value * Math.PI) / 180
}

function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

}

function isGrounded(body){
    var vs = 25
    return (Math.abs(body.velocity.x) < vs) && (Math.abs(body.velocity.y) < vs)
}

function setGrounded(player, planets){

    grounded = true;

}



function checkPosition(){
	if((crateGroup.getChildAt(0).x === x && crateGroup.getChildAt(0).y === y) || (numCollision > 2)){
		alert('GAMEOVER');
	} else if(gameover > 10){
		alert('LEVEL COMPLETED')
	} else {
		gameover = gameover + 1;
		x = crate.x;
		y = crate.y;
	}
}

function collisionCallback(body1, body2, fixture1, fixture2, begin) {
	if (!begin)
    {
        return;
    }
	 body1.velocity.y = body1.velocity.y * 0.5;
	 body1.velocity.x = body1.velocity.x * 0.5;
	 numCollision = numCollision + 1;
	 //wait(2000);
	 //body1.destroy();
	 //fixture1.destroy();

}
