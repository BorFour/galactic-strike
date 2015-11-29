
function Character (x, y, game, player, asset) {
//	this.cursor = {
//		left:false,
//		right:false,
//		up:false,
//		fire:false
//	}
//
//	this.input = {
//		left:false,
//		right:false,
//		up:false,
//		fire:false
//	}

    Element.call(this, game, x, y, asset);
    game.add.existing(this);
    this.anchor.setTo(0.5,1);

    this.player = player;
    this.game = game;

    this.game.spacePhysics.addDynamic(this);
    this.game.physics.box2d.enable(this);
    this.body.dynamic = true;

    // States
    this.RIGHT = 1;
    this.LEFT = -1;
    this.orientation = 1;

    // Cooldowns
    this.jumpCooldown = true;
    this.fireCooldown = true;


    this.jumpForce = 550;
    this.health = 100;
    this.items = [];
    this.bullets = [];


    var PTM = 50;
    var driveJoints = [];


	var frequency = 12;
	var damping = 100;
	var motorTorque = 1;
	var rideHeight = 0.25;


    this.planetTouched = null;
    this.atmosphere = [];
    this.grounded = false;
//    this = game.add.sprite(x, y, 'player');

    var truckVertices = [-10, -10, 10,-10, 20,10,-20, 10];

    this.body.setPolygon(truckVertices); //.setRectangle(40,30,0,10,0); //.setCircle(0.2*PTM);
    this.body.mass = 1;
    this.body.angularDamping = 0.15; // ESTO CONTROLA LA ROTACIÓN JIJIJI :)
    this.body.linearDamping =0.4// 0.94;
//    this.body.friction = 0.001;



    this.driveJoints = [];
    this.wheels = [];

    this.wheels[0] = new Phaser.Sprite (game, this.x + -0.22*PTM,  this.y + 0.6*-PTM, 'ruedaL');
    this.wheels[0].anchor.set(0.5);
    game.add.existing(this.wheels[0]);
    this.wheels[1] = new Phaser.Sprite (game, this.x + 0.22*PTM,  this.y + 0.6*-PTM, 'ruedaR');
    this.wheels[1].anchor.set(0.5);
    game.add.existing(this.wheels[1]);

	this.wheels[0].body = new Phaser.Physics.Box2D.Body(this.game, null, this.x + -0.22*PTM, this.y + 0.6*-PTM);
	this.wheels[0].body.sprite = this.wheels[0];
	this.wheels[1].body = new Phaser.Physics.Box2D.Body(this.game, null, this.x + 0.22*PTM, this.y + 0.6*-PTM);
	this.wheels[1].body.sprite = this.wheels[1];
	this.wheels[0].body.setCircle(0.2*PTM);
	this.wheels[1].body.setCircle(0.2*PTM);
	this.motorEnabled = false;
    this.motorSpeed = 30;

	var frequency = 3.5;
	var damping = 0.5;
	var motorTorque = 2;
	var rideHeight = 0.5;

	// Make wheel joints
	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
	this.driveJoints[0] = game.physics.box2d.wheelJoint(this.body, this.wheels[0].body, -0.65*PTM,rideHeight*PTM, 0,0, 0,1, frequency, damping, 0, motorTorque, true ); // rear
	this.driveJoints[1] = game.physics.box2d.wheelJoint(this.body, this.wheels[1].body,  0.65*PTM,rideHeight*PTM, 0,0, 0,1, frequency, damping, 0, motorTorque, true ); // front


    this.wheels[0].body.mainSprite = this;
    this.wheels[1].body.mainSprite = this;
    this.wheels[0].body.friction = 0.8;
    this.wheels[1].body.friction = 0.8;

    this.body.mainSprite = this;


    /* this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);	 */

	this.currentSpeed =0;
    this.fireRate = 100;
    this.nextFire = 0;
    this.alive = true;
    this.jumpCooldownTime = 350;
    this.fireCooldownTime = 100;

    //this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');

    /*
    this.animations.add('left', [0, 1, 2], 10, true);
    this.animations.add('right', [4, 5, 6], 10, true);
    this.animations.add('stop', [3], 10, true);
    this.animations.add('jump', [7, 8], 10, true);
    this.animations.add('fly', [9], 10, true);
    this.animations.add('land', [10, 11], 10, true);
    */


    //this.shadow.anchor.set(0.5);ç

//    this.anchor.setTo(0.5, 0.90);



    //this.turret.anchor.set(0.3, 0.5);

//    this.character.id = index;
//    game.physics.box2d.enable(this);
    //game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.body.immovable = false;
    this.body.static = false;
    this.body.collideWorldBounds = true;


    //this.tank.angle = 0;

//game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);

};

// Herencia
Character.prototype = Object.create(Element.prototype);
Character.prototype.constructor = Element;


Character.prototype.updateOnline = function() {


    var data = {
            x : this.x,
            y : this.y,
            angle : this.angle,
            velocityX : this.body.velocity.x,
            velocityY : this.body.velocity.y,
            orientation: this.orientation
    }

    socket.emit('update', data);
//    console.log('@Client sent | update');

}

Character.prototype.fire = function (){
    if(this.fireCooldown){
        this.fireCooldown = false;

//        socket.emit('firePlayer', {id:GALACTIC_STRIKE.player.id});
        var bullet = new Item(game, this.x, this.y, items['bullet']);
        bullet.body.setCollisionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.BULLET);
        console.log(bullet)
        bullet.owner = this;
        this.bullets.push(bullet);
        var fn = bullet.collide;
        bullet.body.mass = 0.001;
        bullet.body.bullet = true;
        for (c in charactersList){
            bullet.body.setBodyContactCallback(charactersList[c], fn, this);
        }
        if(this.inAtmosphere()){
            bullet.body.angle = this.angle + 90*this.orientation; // Este ángulo va en grados
            bullet.body.thrust(155400);
        }
        else{
            bullet.body.angle = this.angle;
            bullet.body.thrust(155400);
        }
        game.time.events.add(this.fireCooldownTime, function(){this.fireCooldown = true}, this)
        game.time.events.add(1000, function(){bullet.destroy()}, this)

    }
}

Character.prototype.attack = function (){
    if(this.fireCooldown){
        this.fireCooldown = false;

//        socket.emit('attackPlayer', {id:GALACTIC_STRIKE.player.id});
        var cucumber = new Item(game, this.x - Math.sin(this.angle)* 100, this.y - Math.cos(this.angle)*100, items['cucumber']);
        console.log(cucumber)
        cucumber.owner = this;
//        this.bullets.push(bullet);
//        var fn = cucumber.collide;
        cucumber.body.mass = 0.1;
//        cucumber.body.bullet = true;
//        for (c in charactersList){
//            cucumber.body.setBodyContactCallback(charactersList[c], fn, this);
//        }

	// bodyA, bodyB, axisX, axisY, ax, ay, bx, by, motorSpeed, motorForce, motorEnabled, lowerLimit, upperLimit, limitEnabled
	game.physics.box2d.prismaticJoint(this, cucumber, 1, 1, 0, 0, 0, 0, 0, 0, true, -100, 200, true);

        if(this.inAtmosphere()){
            cucumber.body.angle = this.angle - 90*this.orientation; // Este ángulo va en grados
            cucumber.body.angularVelocity = 20;
            cucumber.body.reverse(10000);
        }
        else{
            cucumber.body.angle = this.angle - 90*this.orientation; // Este ángulo va en grados
            cucumber.body.angularVelocity = 20;
            cucumber.body.reverse(10000);
        }
        game.time.events.add(this.fireCooldownTime, function(){this.fireCooldown = true}, this)
        game.time.events.add(1000, function(){cucumber.destroy()}, this)

    }
}

/**
 * Moves the character when it's grounded
 * @param {string} direction : Indicates the direction in which the character moves
 */

Character.prototype.moveGrounded = function(direction){

    var moveForce1 = 250;
    this.motorEnabled = true;

    switch(direction){
        case 'left':
            this.animations.play('left');
            this.motorSpeed = -30;
            this.orientation = this.LEFT;
            break;
        case 'right':
            this.animations.play('right');
            this.motorSpeed = 30;
            this.orientation = this.RIGHT;
            break;
         case 'down':
            this.motorSpeed = 0;
            this.animations.stop();
            this.animations.play('stop');
            break;
        case 'still':
            this.motorEnabled = false;
            this.animations.stop();
//            this.animations.play('stop');
            break;
    }

        for (var i = 0; i < 2; i++) {
            this.driveJoints[i].EnableMotor(this.motorEnabled);
            this.driveJoints[i].SetMotorSpeed(this.motorSpeed);
        }
}

/**
 * Moves the character when it is within the orbit of a planet but not grounded
 * @param {string} direction Indicates the direction in which the character moves
 */

Character.prototype.moveInOrbit = function(direction){

    switch(direction){
        case 'left':
            this.animations.play('left');
            this.body.rotateLeft(150);
            this.orientation = this.LEFT;
            break;
        case 'right':
            this.animations.play('right');
            this.body.rotateRight(150);
            this.orientation = this.RIGHT;
            break;
         case 'jetpack':
            this.body.thrust(700);
            this.animations.play('fly');
            break;
    }

}

/**
 * Moves the character when it isn't within the orbit of any planet
 * @param {string} direction Indicates the direction in which the character moves
 */

Character.prototype.moveSpace = function(direction){

    switch(direction){
        case 'left':
            this.body.rotateLeft(100);
            this.animations.play('left');
            break;
        case 'right':
            this.body.rotateRight(100);
            this.animations.play('right');
            break;
         case 'up':
            this.body.thrust(200);
            this.animations.play('fly');
            break;
         case 'down':
            this.body.reverse(200);
            this.animations.play('fly');
            break;
         case 'rotateL':
            this.body.angularVelocity -= 0.15;
            break;
         case 'rotateR':
            this.body.angularVelocity += 0.15;
            break;
        case 'still':
            this.animations.stop();
            this.animations.play('stop');
            break;
    }

}

/**
 * Jumps from the planet the character is grounded to
 */

Character.prototype.jump = function (){
    if(this.planetTouched != null && this.jumpCooldown){
        this.jumpCooldown = false;
        var angle = Phaser.Math.angleBetween(this.x,this.y,this.planetTouched.x,this.planetTouched.y);
        // add gravity force to the crate in the direction of planet center
        this.body.applyForce(-Math.cos(angle)*this.jumpForce,-Math.sin(angle)*this.jumpForce);
        if(debug) console.log("jump from (" + this.planetTouched.x + "," + this.planetTouched.y + ")")
        this.planetTouched = null
//      this.jumpSound.play();
        game.time.events.add(560, function(){this.jumpCooldown = true}, this)
    }
}

/**
 * This method is called when a character is killed or his owner disconnects
 */

Character.prototype.die = function() {
	this.alive = false;
    this.wheels[0].destroy();
    this.wheels[1].destroy();
    this.body.destroy();
	this.kill();
}

Character.prototype.setGrounded = function (){
    if(this.groundedTimer){
        game.time.events.remove(this.groundedTimer);
        this.groundedTimer = null;
    }

    this.grounded = true;
    this.groundedTimer = game.time.events.add(50,function() {this.grounded = false;}, this);

}

// PREDICATES

/**
 * Predicate: is the character within any atmosphere?
 * @returns {Boolean} False if the list of atmospheres is empty, True IOC
 */

Character.prototype.inAtmosphere = function (){
    return this.atmosphere.length > 0;
}

/**
 * Predicate: is the character touching any planet?
 * @returns {Boolean} True if it is currently touching a planet, False if not
 */

Character.prototype.isGrounded = function () {
    return this.grounded;
}




Character.prototype.toString = function () {
    return "Player id: " + this.player + " HP : " + this.health;
}