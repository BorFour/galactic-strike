
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

    this.player = player;
    this.game = game;

    this.game.spacePhysics.addDynamic(this);
    this.game.physics.box2d.enable(this);
    this.body.dynamic = true;

    this.jumpForce = 150;
    this.jumpCooldown = true;
    this.fireCooldown = true;
    this.health = 100;
    this.items = [];
    this.bullets = [];


    var PTM = 50;
    var driveJoints = [];

	var frequency = 150;
	var damping = 15;
	var motorTorque = 2;
	var rideHeight = 0.25;


    this.planetTouched = null;
//    this = game.add.sprite(x, y, 'player');

    this.body.setCircle(20,0,0,0); //.setCircle(0.2*PTM);
    this.body.mass = 0.28;
//    this.body.friction = 0.001;

/*
	this.wheelBody = new Phaser.Physics.Box2D.Body(game, null, x, y);
	this.wheelBody.setRectangle(45,12,0,0,0);
    this.wheelBody.friction = 0.001;
    this.wheelBody.mass = 0.63;

    this.driveJoint = game.physics.box2d.weldJoint(this.body, this.wheelBody, 0,rideHeight*PTM, 0,0, 0,1, frequency, damping);
*/


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
    this.scale.setTo(0.65,0.65);
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

Character.prototype.fire = function (){
    if(this.fireCooldown){
        this.fireCooldown = false;

        var bullet = new Item(game, this.x, this.y, items['bullet']);
        console.log(bullet)
        bullet.owner = this;
        this.bullets.push(bullet);
        var fn = bullet.collide;
        for (c in charactersList){
            bullet.body.setBodyContactCallback(charactersList[c], fn, this);
        }
        bullet.body.velocity.x = (Math.random() < 0.5) ? 500 : -500;
        game.time.events.add(this.fireCooldownTime, function(){this.fireCooldown = true}, this)

    }
}


Character.prototype.kill = function() {
	this.alive = false;
	this.kill();
	//this.turret.kill();
	//this.shadow.kill();
}

Character.prototype.toString = function () {
    return "Player id: " + this.player + " HP : " + this.health;
}
