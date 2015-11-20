
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


    this.jumpForce = 350;
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
    this.wheelBodies = [];
	this.wheelBodies[0] = new Phaser.Physics.Box2D.Body(this.game, null, this.x + -0.22*PTM, this.y + 0.6*-PTM);
	this.wheelBodies[1] = new Phaser.Physics.Box2D.Body(this.game, null, this.x + 0.22*PTM, this.y + 0.6*-PTM);
	this.wheelBodies[0].setCircle(0.2*PTM);
	this.wheelBodies[1].setCircle(0.2*PTM);
	this.motorEnabled = false;
    this.motorSpeed = 30;

	var frequency = 3.5;
	var damping = 0.5;
	var motorTorque = 2;
	var rideHeight = 0.5;

	// Make wheel joints
	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
	this.driveJoints[0] = game.physics.box2d.wheelJoint(this.body, this.wheelBodies[0], -0.62*PTM,rideHeight*PTM, 0,0, 0,1, frequency, damping, 0, motorTorque, true ); // rear
	this.driveJoints[1] = game.physics.box2d.wheelJoint(this.body, this.wheelBodies[1],  0.62*PTM,rideHeight*PTM, 0,0, 0,1, frequency, damping, 0, motorTorque, true ); // front


    this.wheelBodies[0].sprite = this;
    this.wheelBodies[1].sprite = this;
    this.wheelBodies[0].friction = 0.8;
    this.wheelBodies[1].friction = 0.8;




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

    this.animations.add('left', [0, 1, 2], 10, true);
    this.animations.add('right', [4, 5, 6], 10, true);
    this.animations.add('stop', [3], 10, true);
    this.animations.add('jump', [7, 8], 10, true);
    this.animations.add('fly', [9], 10, true);
    this.animations.add('land', [10, 11], 10, true);



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


Character.prototype.update = function() {


    var data = {
            x : this.x,
            y : this.y,
            angle : this.angle,
            velocityX : this.body.velocity.x,
            velocityY : this.body.velocity.y
    }

    socket.emit('updatePlayer', data);

}


Character.prototype.fire = function (){
    if(this.fireCooldown){
        this.fireCooldown = false;

        var bullet = new Item(game, this.x, this.y, items['bullet']);
        console.log(bullet)
        bullet.owner = this;
        this.bullets.push(bullet);
        var fn = bullet.collide;
        bullet.body.mass = 0.001;
        bullet.body.bullet = true;
        for (c in charactersList){
            bullet.body.setBodyContactCallback(charactersList[c], fn, this);
        }
        if(this.planetTouched){
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

/**
 * Moves the character when it's grounded
 * @param {String} direction : Indicates the direction to move the character
 */

Character.prototype.moveGrounded = function(direction){

    var moveForce1 = 250;

    switch(direction){
        case 'left':
            // add gravity force to the crate in the direction of planet center
            var angle = Phaser.Math.angleBetween(this.body.x,this.body.y,planetTouched.x,planetTouched.y);

            this.body.velocity.x = -moveForce*Math.sin(angle)*moveForce1;
            this.body.velocity.y = moveForce*Math.cos(angle)*moveForce1;
            // this.body.applyForce(-moveForce*Math.sin(angle), moveForce*Math.cos(angle));
            this.animations.play('left');
            this.angle = angle;
            this.orientation = this.LEFT;
            break;
        case 'right':
            // add gravity force to the crate in the direction of planet center
            var angle = Phaser.Math.angleBetween(this.body.x,this.body.y,planetTouched.x,planetTouched.y);
            this.body.velocity.x = moveForce*Math.sin(angle)*moveForce1;
            this.body.velocity.y = -moveForce*Math.cos(angle)*moveForce1;
            // this.body.applyForce(moveForce*Math.sin(angle), -moveForce*Math.cos(angle));
            this.animations.play('right');
            this.angle = angle;
            this.orientation = this.RIGHT;
            break;
        case 'still':
            //  this.body.velocity.x = 0;
            //  this.body.velocity.y = 0;
            if(this.jumpCooldown){
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
            this.animations.stop();
            this.animations.play('stop');
            break;
        default:
            break;
    }
}

/**
 * Moves the character when it is within the orbit of a planet but not grounded
 * @param {[[Type]]} direction [[Description]]
 */

Character.prototype.moveInOrbit = function(direction){

}

/**
 * Moves the character when it isn't within the orbit of any planet
 * @param {[[Type]]} direction [[Description]]
 */

Character.prototype.moveSpace = function(direction){

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
//            myCharacter.jumpSound.play();
        game.time.events.add(560, function(){this.jumpCooldown = true}, this)
    }
}


Character.prototype.kill = function() {
	this.alive = false;
	this.kill();
	//this.turret.kill();
	//this.shadow.kill();
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
