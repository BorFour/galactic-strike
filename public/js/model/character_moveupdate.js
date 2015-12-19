/**
 * This file is an extension of character.js
 */

/**
 * Sends data about this character to the other players in the room
 */

Character.prototype.updateOnline = function ()
{


    var data = {
        x: this.x,
        y: this.y,
        angle: this.angle,
        velocityX: this.body.velocity.x,
        velocityY: this.body.velocity.y,
        angularVelocity: this.body.angularVelocity,
        orientation: this.orientation,
        jumpAnimation: this.jumpAnimation
    }

    socket.emit('update', data);
    //    console.log('@Client sent | update');

}

/**
 * Moves the character when it's grounded
 * @param {string} direction : Indicates the direction in which the character moves
 */

Character.prototype.moveGrounded = function (direction)
{

    this.motorEnabled = true;
    this.body.damping = 0.3;

    this.body.angularDamping = 0.15;
    switch (direction)
    {
    case 'left':
        this.animations.play('left');
        this.wheels[0].body.angularVelocity = -40;
        this.wheels[1].body.angularVelocity = -40;
        this.orientation = this.LEFT;
        this.jumpAnimation = false;
        break;
    case 'right':
        this.animations.play('right');
        this.wheels[0].body.angularVelocity = 30;
        this.wheels[1].body.angularVelocity = 30;
        this.orientation = this.RIGHT;
        this.jumpAnimation = false;
        break;
    case 'down':
        this.wheels[0].body.angularVelocity = 0;
        this.wheels[1].body.angularVelocity = 0;
        this.animations.stop();
        this.jumpAnimation = false;
        break;
    case 'still':
        this.motorEnabled = false;
        this.animations.stop();
        this.jumpAnimation = false;
        //            this.animations.play('stop');
        break;
    }

    for (var i = 0; i < 2; i++)
    {
//        this.driveJoints[i].EnableMotor(this.motorEnabled);
//        this.driveJoints[i].SetMotorSpeed(this.motorSpeed);
    }
}

/**
 * Moves the character when it is within the orbit of a planet but not grounded
 * @param {string} direction Indicates the direction in which the character moves
 */

Character.prototype.moveInOrbit = function (direction)
{

    this.body.damping = 0.3;
    this.body.angularDamping = 0.15;
    switch (direction)
    {
    case 'left':
        this.animations.play('left');
        this.body.rotateLeft(50);
        this.orientation = this.LEFT;
        break;
    case 'right':
        this.animations.play('right');
        this.body.rotateRight(50);
        this.orientation = this.RIGHT;
        break;
    case 'jetpack':
        this.body.thrust(970);
        if (this.orientation === this.LEFT) this.animations.play('jumpL');
        if (this.orientation === this.RIGHT) this.animations.play('jumpR');
        this.jumpAnimation = true;
        if (!this.jetpackSound.isPlaying) this.jetpackSound.play();
        break;
    case 'still':
        if (this.orientation === this.LEFT) this.animations.play('left');
        if (this.orientation === this.RIGHT) this.animations.play('right');
        this.jumpAnimation = false;
        break;
    default:
        break;
    }

}

/**
 * Moves the character when it isn't within the orbit of any planet
 * @param {string} direction Indicates the direction in which the character moves
 */

Character.prototype.moveSpace = function (direction)
{


    switch (direction)
    {
    case 'left':
        this.body.rotateLeft(50);
        this.animations.play('left');
        this.orientation = this.LEFT;
        this.body.angularDamping = 0.15;
        this.body.damping = 0.3;
        break;
    case 'right':
        this.body.rotateRight(50);
        this.animations.play('right');
        this.orientation = this.RIGHT;
        this.body.angularDamping = 0.15;
        this.body.damping = 0.3;
        break;
    case 'up':
        this.body.thrust(500);
        if (this.orientation === this.LEFT) this.animations.play('jumpL');
        if (this.orientation === this.RIGHT) this.animations.play('jumpR');
        this.body.angularDamping = 0.7;
        this.body.damping = 0.3;
        this.jumpAnimation = true;
        break;
    case 'down':
        this.body.reverse(300);
        if (this.orientation === this.LEFT) this.animations.play('jumpL');
        if (this.orientation === this.RIGHT) this.animations.play('jumpR');
        this.body.angularDamping = 0.7;
        this.body.damping = 0.73;
        this.jumpAnimation = true;
        break;
    case 'rotateL':
//        this.body.angularVelocity -= 0.05;
        break;
    case 'rotateR':
//        this.body.angularVelocity += 0.05;
        break;
    case 'still':
        if (this.orientation === this.LEFT) this.animations.play('left');
        if (this.orientation === this.RIGHT) this.animations.play('right');
        this.body.angularDamping = 0.7;
        this.body.damping = 0.73;
        this.jumpAnimation = false;
        break;
    }

}

/**
 * This method is called when a character is killed or his owner disconnects
 */

Character.prototype.flightMode = function ()
{

    var PTM = 50;

    this.wheels[0] = new Phaser.Sprite(game, this.x + -0.22 * 50, this.y + 0.6 * -50, this.wheel);
    this.wheels[0].anchor.set(0.5);
    game.add.existing(this.wheels[0]);
    this.wheels[1] = new Phaser.Sprite(game, this.x + 0.22 * 50, this.y + 0.6 * -50, this.wheel);
    this.wheels[1].anchor.set(0.5);
    game.add.existing(this.wheels[1]);

//    this.wheels[0].body = new Phaser.Physics.Box2D.Body(this.game, null, this.x + -0.22 * PTM, this.y + 0.6 * -PTM);
    game.physics.p2.enable(this.wheels[0], false);
    this.wheels[0].body.sprite = this.wheels[0];
//    this.wheels[1].body = new Phaser.Physics.Box2D.Body(this.game, null, this.x + 0.22 * PTM, this.y + 0.6 * -PTM);
    game.physics.p2.enable(this.wheels[1], false);
    this.wheels[1].body.sprite = this.wheels[1];
    this.wheels[0].body.setCircle(0.2 * PTM);
    this.wheels[1].body.setCircle(0.2 * PTM);
    this.wheels[0].body.setCircle(0.2 * PTM);
    this.wheels[1].body.setCircle(0.2 * PTM);

//    this.driveJoints[0] = game.physics.box2d.wheelJoint(this.body, this.wheels[0].body, -3, 8, 0, 0, 0, 1, 0, 0, 0, 0, true); // rear
//    this.driveJoints[1] = game.physics.box2d.wheelJoint(this.body, this.wheels[1].body, 3, 8, 0, 0, 0, 1, 0, 0, 0, 0, true); // front

}

/**
 * Sets the grounded attribute of the character to true and tries to set it false after a period of time
 */

Character.prototype.setGrounded = function ()
{
    if (this.groundedTimer)
    {
        game.time.events.remove(this.groundedTimer);
        this.groundedTimer = null;
    }

    this.grounded = true;
    this.groundedTimer = game.time.events.add(500, function ()
    {
        this.grounded = false;
    }, this);

}


/**
 * Predicate: is the character within any atmosphere?
 * @returns {Boolean} False if the list of atmospheres is empty, True IOC
 */

Character.prototype.inAtmosphere = function ()
{
//    return false;
    return this.atmosphere.length > 0;
}

/**
 * Predicate: is the character touching any planet?
 * @returns {Boolean} True if it is currently touching a planet, False if not
 */

Character.prototype.isGrounded = function ()
{

    for (var i = 0; i < this.atmosphere.length; i++){
        if (Phaser.Math.distance(this.x, this.y, this.atmosphere[i].x, this.atmosphere[i].y) <= this.atmosphere[i].width / 2 + 35) return true;
    }
    return false;

//    return this.grounded || this.wheels[0].grounded || this.wheels[1].grounded;
}





