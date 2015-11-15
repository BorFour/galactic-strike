
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
    game.spacePhysics.addDynamic(this);
    game.physics.box2d.enable(this);
    this.body.dynamic = true;


    this.player = player;
    this.game = game;

    this.health = 100;
    this.items = [];


    var PTM = 50;
    var driveJoints = [];

	var frequency = 150;
	var damping = 15;
	var motorTorque = 2;
	var rideHeight = 0.25;


    this.planetTouched = null;
//    this = game.add.sprite(x, y, 'player');

    this.body.setRectangle(12,25,0,0,0); //.setCircle(0.2*PTM);

/*

	this.wheelBody = new Phaser.Physics.Box2D.Body(game, null, x, y);
	this.wheelBody.setCircle(0.2*PTM);

    this.driveJoint = game.physics.box2d.wheelJoint(this.body, this.wheelBody, 0,rideHeight*PTM, 0,0, 0,1, frequency, damping, 0, motorTorque, true);
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
    this.jumpCooldown = 350;

    //this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');

    this.animations.add('left', [0, 1, 2], 10, true);
    this.animations.add('right', [4, 5, 6], 10, true);
    this.animations.add('stop', [3], 10, true);



    //this.shadow.anchor.set(0.5);ç
    this.scale.setTo(0.65,0.65);
//    this.anchor.setTo(this.wheelBody.x,this.wheelBody.y + this.wheelBody.radius);



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

Character.prototype.kill = function() {
	this.alive = false;
	this.kill();
	//this.turret.kill();
	//this.shadow.kill();
}

Character.prototype.toString = function () {
    return "Player id: " + this.player + " HP : " + this.health;
}
