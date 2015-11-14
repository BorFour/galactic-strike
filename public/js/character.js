
Character = function (x, y, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		fire:false
	}

	this.input = {
		left:false,
		right:false,
		up:false,
		fire:false
	}

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
    this.sprite = game.add.sprite(x, y, 'player');
    game.physics.box2d.enable(this.sprite);

    this.sprite.body.setCircle(0.2*PTM);//.setRectangle(20,18,0,0,0);

	this.sprite.wheelBody = new Phaser.Physics.Box2D.Body(game, null, x, y);
	this.sprite.wheelBody.setCircle(0.2*PTM);

    this.driveJoint = game.physics.box2d.wheelJoint(this.sprite.body, this.sprite.wheelBody, 0,rideHeight*PTM, 0,0, 0,1, frequency, damping, 0, motorTorque, true);


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

    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    game.spacePhysics.addDynamic(this.sprite);

    //this.shadow.anchor.set(0.5);ç
    this.sprite.scale.setTo(0.65,0.65);
//    this.sprite.anchor.setTo(this.wheelBody.x,this.wheelBody.y + this.wheelBody.radius);



    //this.turret.anchor.set(0.3, 0.5);

//    this.character.id = index;
//    game.physics.box2d.enable(this.sprite);
    //game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.static = false;
    this.sprite.body.collideWorldBounds = true;


    //this.tank.angle = 0;

//game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);

};

Character.prototype.update = function() {


    // TODO
	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up ||
		this.cursor.fire != this.input.fire
	);

    inputChanged = true;
	if (inputChanged)
	{
        var data = {
                x : this.sprite.x,
                y : this.sprite.y,
                angle : this.sprite.angle,
                velocityX : this.sprite.body.velocity.x,
                velocityY : this.sprite.body.velocity.y
        }
//      console.log("Updating character " + this.character.id)
        socket.emit('updatePlayer', data);
	}


	//cursor value is now updated by eurecaClient.exports.updateState method


    if (this.cursor.left)
    {
        this.sprite.angle -= 1;
    }
    else if (this.cursor.right)
    {
        this.sprite.angle += 1;
    }
    if (this.cursor.up)
    {
        //  The speed we'll travel at
        this.currentSpeed = 300;
    }
    else
    {
        if (this.currentSpeed > 0)
        {
            this.currentSpeed -= 4;
        }
    }
    if (this.cursor.fire)
    {
		this.fire({x:this.cursor.tx, y:this.cursor.ty});
    }



    if (this.currentSpeed > 0)
    {
        //game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
    }
	else
	{
		//game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);
	}




    //this.shadow.x = this.character.x;
    //this.shadow.y = this.character.y;
    //this.shadow.rotation = this.tank.rotation;

    //this.turret.x = this.tank.x;
    //this.turret.y = this.tank.y;
}

// De momento no la usamos
Character.prototype.fire = function(target) {
		if (!this.alive) return;
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.turret.x, this.turret.y);

			bullet.rotation = this.game.physics.arcade.moveToObject(bullet, target, 500);
        }
}


Character.prototype.kill = function() {
	this.alive = false;
	this.sprite.kill();
	//this.turret.kill();
	//this.shadow.kill();
}

Character.prototype.toString = function () {
    return "Player id: " + this.player + " HP : " + this.health;
}
