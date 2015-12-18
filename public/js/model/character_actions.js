/**
 * This file is an extension of character.js
 */

/**
 * Jumps from the planet the character is grounded to
 */

Character.prototype.jump = function ()
{

    if (this.planetTouched != null && this.jumpCooldown)
    {

        this.jumpCooldown = false;
        var angle = Phaser.Math.angleBetween(this.x, this.y, this.planetTouched.x, this.planetTouched.y);
        this.body.applyForce(-Math.cos(angle) * this.jumpForce, -Math.sin(angle) * this.jumpForce);
        //        console.log("jump from (" + this.planetTouched.x + "," + this.planetTouched.y + ")");
        this.planetTouched = null;
        //      this.jumpSound.play();
        game.time.events.add(560, function ()
        {
            this.jumpCooldown = true;
        }, this);

    }

}

/**
 * Performs attack0
 */

Character.prototype.attack0 = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeball = new Item(game, this.body.x + Math.sin(this.body.rotation) * 80, this.body.y - Math.cos(this.body.rotation) * 80, items['spikeball']);
        this.spikeball.owner = this;
        this.spikeball.damage = 65;

        // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
        this.attackJoint = game.physics.box2d.motorJoint(this, this.spikeball, 80, 50, 0.25, this.orientation * 80, 50, 4.5);

        this.spikeball.body.thrust(1000);

        for (var c in GALACTIC_STRIKE.room.characters)
        {
            this.spikeball.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }

        // After this.attackCooldownTime, the spikeball is destroyed and the attack cooldown is restored
        game.time.events.add(this.attack0CooldownTime, function ()
        {
            if(this.spikeball) this.spikeball.die();
            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
            this.attackJoint = null;
            this.attackCooldown = true;
        }, this)

        return true;

    }
    else
    {

        return false;

    }

}

/**
 * Performs attack1
 */

Character.prototype.attack1 = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeball = new Item(game, this.x + Math.cos(this.body.rotation) * 80 * this.orientation, this.y + Math.sin(this.body.rotation) * 80 * this.orientation, items['spikeball']);
        this.spikeball.owner = this;
        this.spikeball.damage = 35;

        this.attackJoint = game.physics.box2d.motorJoint(this, this.spikeball, 80, 50, 0.25, this.orientation * 120, 0, 4.5);
        this.spikeball.body.thrust(1000);

        for (var c in GALACTIC_STRIKE.room.characters)
        {
            this.spikeball.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }

        // After this.attack2CooldownTime, the spikeball is destroyed and the attack cooldown is restored
        game.time.events.add(this.attack1CooldownTime, function ()
        {
            if(this.spikeball) this.spikeball.die();
            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
            this.attackJoint = null;
            this.attackCooldown = true;
        }, this)

        return true;

    }
    else
    {

        return false;

    }

}

/**
 * Performs attack2
 */

Character.prototype.attack2 = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeball = new Item(game, this.x + Math.cos(this.body.rotation) * 80 * this.orientation,
            this.y + Math.sin(this.body.rotation) * 80 * this.orientation, items['hammer']);
        this.spikeball.owner = this;
        this.spikeball.damage = 25;
        this.attackJoint = game.physics.box2d.motorJoint(this, this.spikeball, 80, 50, 0.25, this.orientation * 120, 0, 4.5);
        this.spikeball.body.thrust(1000);

        for (var c in GALACTIC_STRIKE.room.characters)
        {
            this.spikeball.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }
        // After this.attack3CooldownTime, the spikeball is destroyed and the attack cooldown is restored
        game.time.events.add(this.attack2CooldownTime, function ()
        {
            if(this.spikeball) this.spikeball.die();
            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
            this.attackJoint = null;
            this.attackCooldown = true;
        }, this)

        return true;

    }
    else
    {

        return false;

    }

}

/**
 * Performs attack3
 */

Character.prototype.attack3 = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeball = new Item(game, this.body.x + Math.sin(this.body.rotation) * 80, this.body.y - Math.cos(this.body.rotation) * 80, items['spaceAttack1']);
        this.spikeball.body.rotation = this.body.rotation;
        this.spikeball.owner = this;
        this.spikeball.damage = 15;

        // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
        this.spikeball.body.thrust(100000);

        for (var c in GALACTIC_STRIKE.room.characters)
        {
            this.spikeball.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }
        game.time.events.add(this.attack3CooldownTime, function ()
        {
            if(this.spikeball) this.spikeball.die();
            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
            this.attackJoint = null;
            this.attackCooldown = true;
        }, this)

        return true;

    }
    else
    {

        return false;

    }

}

/**
 * Performs attackFire
 */

Character.prototype.attackFire = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackCooldown = false;

        var bullet = new Item(game, this.x, this.y, items['misil']);
        bullet.body.setCollisionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.BULLET);

        bullet.angle += 90;
        bullet.body.angle += 90;

        bullet.owner = this;
        bullet.damage = 15;
        bullet.body.fixedRotation = true;

        this.bullets.push(bullet);
        bullet.body.mass = 0.001;
        bullet.body.bullet = true;

        if (this.inAtmosphere())
        {
            bullet.body.angle = this.angle + 90 * this.orientation; // Este ángulo va en grados
            bullet.body.thrust(155400);
        }
        else
        {
            bullet.body.angle = this.angle;
            bullet.body.thrust(155400);
        }

        for (var c in GALACTIC_STRIKE.room.characters)
        {
            bullet.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }

        game.time.events.add(this.fireCooldownTime, function ()
        {
            this.attackCooldown = true
        }, this)
        game.time.events.add(1000, function ()
        {
            bullet.destroy()
        }, this)

        return true;

    }
    else
    {

        return false;

    }
}

/**
 * Function that decodes an attack from an attack event received from the server
 */

Character.prototype.attacks = function (attack_id, space)
{

    if (space)
    {
        switch (attack_id)
        {
        case 0:
            return this.attack0();
        case 1:
            return this.attack1();
        case 2:
            return this.attack2();
        case 3:
            return this.attack3();
        }
    }
    else
    {
        switch (attack_id)
        {
        case 0:
            return this.attack0();
        case 1:
            return this.attack1();
        case 2:
            return this.attack2();
        case 3:
            return this.attack3();
        }
    }

}
