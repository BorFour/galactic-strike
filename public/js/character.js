
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


    this.game = game;
    this.health = 30;
    this.player = player;
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
    this.character = game.add.sprite(x, y, 'player');
    this.character.animations.add('left', [0, 1, 2, 3], 10, true);
    this.character.animations.add('right', [5, 6, 7, 8], 10, true);

    game.spacePhysics.addDynamic(this.character);

    //this.shadow.anchor.set(0.5);
    this.character.anchor.set(0.5);
    this.character.scale.setTo(0.65,0.65);
    //this.turret.anchor.set(0.3, 0.5);

//    this.character.id = index;
    game.physics.box2d.enable(this.character);
    //game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.character.body.immovable = false;
    this.character.body.collideWorldBounds = true;


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
                x : this.character.x,
                y : this.character.y,
                angle : this.character.angle
        }
//      console.log("Updating character " + this.character.id)
        socket.emit('updatePlayer', data);
	}


	//cursor value is now updated by eurecaClient.exports.updateState method


    if (this.cursor.left)
    {
        this.character.angle -= 1;
    }
    else if (this.cursor.right)
    {
        this.character.angle += 1;
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
	this.character.kill();
	//this.turret.kill();
	//this.shadow.kill();
}

Character.prototype.toString = function () {
    return "Player id: " + this.character.id + "\n HP : " + this.health;
}
