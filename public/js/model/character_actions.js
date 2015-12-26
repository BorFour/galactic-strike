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
//        game.physics.p2.removeSpring(this.planetSpring);
        this.grounded = false;

        this.jumpCooldown = false;
//        var angle = Phaser.Math.angleBetween(this.x, this.y, this.planetTouched.x, this.planetTouched.y);
//        this.body.applyForce(-Math.cos(angle) * this.jumpForce, -Math.sin(angle) * this.jumpForce);

                // calculating angle between the planet and the crate
         var angle = Phaser.Math.angleBetween(this.x, this.y, this.planetTouched.x, this.planetTouched.y);
        // add gravity force to the crate in the direction of planet center
        this.body.applyImpulse([this.jumpForce * Math.cos(angle),
-                     - this.jumpForce * Math.sin(angle)], 0, 0);

        this.wheels[0].body.angularVelocity = 0;
        this.wheels[1].body.angularVelocity = 0;

        //        console.log("jump from (" + this.planetTouched.x + "," + this.planetTouched.y + ")");
        this.planetTouched = null;
        //      this.jumpSound.play();
        game.time.events.add(560, function ()
        {
            this.jumpCooldown = true;
        }, this);
        this.flightMode();
    }

}

/**
 * Performs attack0. MINES
 */

Character.prototype.attack0 = function ()
{

    if (this.minesCooldown && this.alive && this.numberOfMines > 0)
    {

//        this.attackSound.play();
        this.minesCooldown = false;
        this.numberOfMines--;
        var mine = new Item(game, this.body.x , this.body.y , items[(this.player.team.color == 1 ? 'red_mine' : 'blue_mine')]);
        mine.owner = this;
        mine.damage = this.damageAttack0;
        mine.body.setCollisionGroup(game.spacePhysics.CG_attacks);
        mine.body.static = true;
        // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
//        this.attackJoint = game.physics.box2d.motorJoint(this, this.spikeball, 80, 50, 0.25, this.orientation * 80, 50, 4.5);


//        this.spikeballs[0].body.thrust(1000);
        mine.body.collides(game.spacePhysics.CG_planets);
        for (var t in game.spacePhysics.CG_teams)
        {
            if (game.spacePhysics.CG_teams[t] !== game.spacePhysics.CG_teams[this.player.team.color-1])
            {
                mine.body.collides(game.spacePhysics.CG_teams[t], touchMineEnemy, this);
            }
        }

        this.mines.push(mine);
        // After this.attackCooldownTime, the spikeball is destroyed and the attack cooldown is restored
        game.time.events.add(this.minesCooldownTime, function ()
        {
//            console.log("Destroying attack");
//            if(this.spikeballs[0]) this.spikeballs[0].die();
//            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
//            this.attackJoint = null;
            this.minesCooldown = true;
        }, this)

        return true;

    }
    else
    {

        return false;

    }

}

/**
 * Performs attack1. PUNCH
 */

Character.prototype.attack1 = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeballs[1] = new Item(game, this.x + Math.cos(this.body.rotation) * 60 * this.orientation, this.y + Math.sin(this.body.rotation) * 60 * this.orientation, items[(this.player.team.color == 1 ? 'punch' : 'punch')]);
        this.spikeballs[1].owner = this;
        this.spikeballs[1].damage = this.damageAttack1;
        this.spikeballs[1].anchor.set(0.5);

        this.spikeballs[1].body.rotation = this.rotation + this.orientation*Math.PI/2;
        this.spikeballs[1].body.setCollisionGroup(game.spacePhysics.CG_attacks);
        this.spikeballs[1].constraint = game.physics.p2.createLockConstraint(this.spikeballs[1], this, [this.orientation*100, -275],-50);

        this.spikeballs[1].body.thrust(9000);

        this.spikeballs[1].body.collides(game.spacePhysics.CG_planets);

        for (var t in GALACTIC_STRIKE.room.teams)
        {
            if (t !== this.player.team.color-1)
            {
                this.spikeballs[1].body.collides(game.spacePhysics.CG_teams[t], touchSpikeballEnemy, this);
            }
        }

        this.orientation == this.RIGHT ? this.body.rotateLeft(20000) : this.body.rotateRight(20000);


        // After this.attack2CooldownTime, the spikeball is destroyed and the attack cooldown is restored
        game.time.events.add(this.attack1CooldownTime, function ()
        {
            console.log("Destroying attack");
            if(this.spikeballs[1]) this.spikeballs[1].die();
            game.physics.p2.removeConstraint(this.spikeballs[1].constraint);
//            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
//            this.attackJoint = null;
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
 * Performs attack2. HAMMER
 */

Character.prototype.attack2 = function ()
{

    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeballs[2] = new Item(game, this.body.x + Math.sin(this.body.rotation) * 80, this.body.y - Math.cos(this.body.rotation) * 80, items['hammer']);
//        this.spikeballcontraint2 = game.physics.p2.createDistanceConstraint(this, this.spikeballs[2], 80);
        this.spikeballs[2].constraint = game.physics.p2.createDistanceConstraint(this, this.spikeballs[2], 80);

        this.spikeballs[2].body.rotation = this.rotation + this.orientation*Math.PI/2;
        this.spikeballs[2].body.velocity.x = this.body.velocity.x;
        this.spikeballs[2].body.velocity.y = this.body.velocity.y;
        this.spikeballs[2].owner = this;
        this.spikeballs[2].damage = this.damageAttack2;
//        this.attackJoint = game.physics.box2d.motorJoint(this, this.spikeball, 80, 50, 0.25, this.orientation * 120, 0, 4.5);
        this.spikeballs[2].body.thrust(32000);
        this.spikeballs[2].body.setCollisionGroup(game.spacePhysics.CG_attacks);
        this.spikeballs[2].body.collides(game.spacePhysics.CG_planets);

        for (var t in GALACTIC_STRIKE.room.teams)
        {
            if (t !== this.player.team.color-1)
            {
                this.spikeballs[2].body.collides(game.spacePhysics.CG_teams[t], touchSpikeballEnemy, this);
            }
        }

        // After this.attack3CooldownTime, the spikeball is destroyed and the attack cooldown is restored
        game.time.events.add(this.attack2CooldownTime, function ()
        {
            console.log("Destroying attack");

            if(this.spikeballs[2]) {
                if(this.spikeballs[2].constraint)game.physics.p2.removeConstraint(this.spikeballs[2].constraint);
                this.spikeballs[2].die();
            }

//            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
//            this.attackJoint = null;
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
 * Performs attack3. SONIC WAVE
 */

Character.prototype.attack3 = function ()
{
    console.log("Attack3");
    if (this.attackCooldown && this.alive)
    {

        this.attackSound.play();
        this.attackCooldown = false;
        this.spikeballs[3] = new Item(game, this.body.x + Math.sin(this.body.rotation) * 40, this.body.y - Math.cos(this.body.rotation) * 40, items['spaceAttack1']);

         //  This adjusts the collision body size.
        //  sprite.body.setRectangle(width, height, offsetX, offsetY)
        this.spikeballs[3].body.setRectangle(130, 30, 0, 10);



        this.spikeballs[3].owner = this;
        this.spikeballs[3].damage = this.damageAttack3;
        this.spikeballs[3].body.rotation = this.body.rotation;
        this.spikeballs[3].body.collideWorldBounds = false;
        this.spikeballs[3].body.setCollisionGroup(game.spacePhysics.CG_attacks);
        this.spikeballs[3].body.collides(game.spacePhysics.CG_planets, touchPlanetSpaceAttack, this);
        // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
        this.spikeballs[3].body.thrust(100000);

        for (var t in game.spacePhysics.CG_teams)
        {
            console.log(game.spacePhysics.CG_teams[t]);
//            if (t !== this.player.team.color-1)
//            {
                this.spikeballs[3].body.collides(game.spacePhysics.CG_teams[t], touchSpikeballEnemy, this);
//            }
        }
        // SpaceAttack collides with planet and it's destroyed
        //this.spikeballs[3].body.collides(game.spacePhysics.CG_planets, touchPlanetSpaceAttack, this);

        game.time.events.add(this.attack3CooldownTime, function ()
        {
            console.log("Destroying attack");
            if(this.spikeballs[3]) this.spikeballs[3].die();
//            if(this.attackJoint) game.physics.box2d.world.DestroyJoint(this.attackJoint);
//            this.attackJoint = null;
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
