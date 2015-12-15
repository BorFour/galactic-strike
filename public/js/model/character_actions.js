/**
 * This file is an extension of character.js
 */


/**
 * Jumps from the planet the character is grounded to
 */
Character.prototype.jump = function () {

    if (this.planetTouched != null && this.jumpCooldown) {
        this.jumpCooldown = false;
        var angle = Phaser.Math.angleBetween(this.x, this.y, this.planetTouched.x, this.planetTouched.y);
        this.body.applyForce(-Math.cos(angle) * this.jumpForce, -Math.sin(angle) * this.jumpForce);
        if (debug) console.log("jump from (" + this.planetTouched.x + "," + this.planetTouched.y + ")");
        this.planetTouched = null;
        //      this.jumpSound.play();
        game.time.events.add(560, function () {
            this.jumpCooldown = true;
        }, this);
    }

}

Character.prototype.attack0 = function () {

    if (this.attackCooldown && this.alive) {
        this.attackSound.play();
        this.attackCooldown = false;
        this.cucumber = new Item(game, this.body.x + Math.sin(this.body.rotation) * 80, this.body.y - Math.cos(this.body.rotation) * 80, items['spikeball']);
        //        console.log(this.cucumber)
        this.cucumber.owner = this;
        //        this.bullets.push(bullet);
        //        var fn = cucumber.collide;
        //        cucumber.body.mass = 0.1;
        //        cucumber.body.bullet = true;
        //        for (c in GALACTIC_STRIKE.room.characters){
        //            cucumber.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], fn, this);
        //        }

        // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
        this.cucumber.damage = 65;
        game.physics.box2d.motorJoint(this, this.cucumber, 80, 50, 0.25, this.orientation * 80, 50, 4.5);

        //        cucumber.body.rotation = this.body.rotation; // Este ángulo va en grados
        //        cucumber.body.angularVelocity = 20;
        this.cucumber.body.thrust(1000);

        for (var c in GALACTIC_STRIKE.room.characters) {
            this.cucumber.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }

        game.time.events.add(this.attackCooldownTime, function () {
            this.cucumber.die();
            this.attackCooldown = true;
        }, this)

        return true;
    } else {
        return false;
    }

//    return true;
}

Character.prototype.attack1 = function () {
    if (this.attackCooldown && this.alive) {
        this.attackSound.play();
        this.attackCooldown = false;
        this.cucumber2 = new Item(game, this.x + Math.cos(this.body.rotation) * 80 * this.orientation, this.y + Math.sin(this.body.rotation) * 80 * this.orientation, items['spikeball']);
        //        console.log(this.cucumber2)
        this.cucumber2.owner = this;
        //        this.bullets.push(bullet);
        //        var fn = cucumber.collide;
        //        cucumber.body.mass = 0.1;
        //        cucumber.body.bullet = true;
        //        for (c in GALACTIC_STRIKE.room.characters){
        //            cucumber.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], fn, this);
        //        }

        //        game.physics.box2d.motorJoint(spriteA, spriteB, 800, 500, 0.25, -100, 200, 45);
        this.cucumber2.damage = 35;
        //        game.physics.box2d.motorJoint(this, this.cucumber2, 80*this.orientation, 0, 0.25, 120, 0, 4.5);
        game.physics.box2d.motorJoint(this, this.cucumber2, 80, 50, 0.25, this.orientation * 120, 0, 4.5);
        //        cucumber.body.rotation = this.body.rotation; // Este ángulo va en grados
        //        cucumber.body.angularVelocity = 20;
        this.cucumber2.body.thrust(1000);

        for (var c in GALACTIC_STRIKE.room.characters) {
            this.cucumber2.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }
        game.time.events.add(this.attack2CooldownTime, function () {
            this.cucumber2.die();
            this.attackCooldown = true;
        }, this)

        return true;
    } else {
        return false;
    }

//     return true;
}

Character.prototype.attack2 = function () {
    if (this.attackCooldown && this.alive) {
        this.attackSound.play();
        this.attackCooldown = false;
        this.cucumber3 = new Item(game, this.x + Math.cos(this.body.rotation) * 80 * this.orientation,
            this.y + Math.sin(this.body.rotation) * 80 * this.orientation, items['hammer']);
        //        console.log(this.cucumber2)
        this.cucumber3.owner = this;
        //        this.bullets.push(bullet);
        //        var fn = cucumber.collide;
        //        cucumber.body.mass = 0.1;
        //        cucumber.body.bullet = true;
        //        for (c in GALACTIC_STRIKE.room.characters){
        //            cucumber.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], fn, this);
        //        }

        //        game.physics.box2d.motorJoint(spriteA, spriteB, 800, 500, 0.25, -100, 200, 45);
        this.cucumber3.damage = 25;
        //        game.physics.box2d.motorJoint(this, this.cucumber2, 80*this.orientation, 0, 0.25, 120, 0, 4.5);
        game.physics.box2d.motorJoint(this, this.cucumber3, 80, 50, 0.25, this.orientation * 120, 0, 4.5);
        //        cucumber.body.rotation = this.body.rotation; // Este ángulo va en grados
        //        cucumber.body.angularVelocity = 20;
        this.cucumber3.body.thrust(1000);

        for (var c in GALACTIC_STRIKE.room.characters) {
            this.cucumber3.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }
        game.time.events.add(this.attack3CooldownTime, function () {
            this.cucumber3.die();
            this.attackCooldown = true;
        }, this)

        return true;
    } else {
        return false;
    }

//    return true;
}

Character.prototype.attack3 = function () {
    if (this.attackCooldown && this.alive) {
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

        if (this.inAtmosphere()) {
            bullet.body.angle = this.angle + 90 * this.orientation; // Este ángulo va en grados
            bullet.body.thrust(155400);
        } else {
            bullet.body.angle = this.angle;
            bullet.body.thrust(155400);
        }

        for (var c in GALACTIC_STRIKE.room.characters) {
            bullet.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }

        game.time.events.add(this.fireCooldownTime, function () {
            this.attackCooldown = true
        }, this)
        game.time.events.add(1000, function () {
            bullet.destroy()
        }, this)

        return true;
    } else {
        return false;
    }
}

Character.prototype.attackSpace1 = function () {
    if (this.attackCooldown && this.alive) {
        this.attackSound.play();
        this.attackCooldown = false;
        this.cucumber2 = new Item(game, this.body.x + Math.sin(this.body.rotation) * 80, this.body.y - Math.cos(this.body.rotation) * 80, items['spaceAttack1']);
        this.cucumber2.body.rotation = this.body.rotation;
        //        console.log(this.cucumber2)
        this.cucumber2.owner = this;
        //        this.bullets.push(bullet);
        //        var fn = cucumber.collide;
        //        cucumber.body.mass = 0.1;
        //        cucumber.body.bullet = true;
        //        for (c in GALACTIC_STRIKE.room.characters){
        //            cucumber.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], fn, this);
        //        }

        //        game.physics.box2d.motorJoint(spriteA, spriteB, 800, 500, 0.25, -100, 200, 45);
        this.cucumber2.damage = 15;
        //        game.physics.box2d.motorJoint(this, this.cucumber2, 80*this.orientation, 0, 0.25, 120, 0, 4.5);

        // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
        this.cucumber2.body.thrust(100000);

        //        cucumber.body.rotation = this.body.rotation; // Este ángulo va en grados
        //        cucumber.body.angularVelocity = 20;

        for (var c in GALACTIC_STRIKE.room.characters) {
            this.cucumber2.body.setBodyContactCallback(GALACTIC_STRIKE.room.characters[c], touchSpikeballEnemy, this);
        }
        game.time.events.add(500, function () {
            this.cucumber2.destroy();
            this.attackCooldown = true;
        }, this)

        return true;
    } else {
        return false;
    }
}

Character.prototype.attacks = function (attack_id, space) {

    if (space) {
        switch (attack_id) {
            case 0:
                return this.attack0();
            case 1:
                return this.attackSpace1();
            case 2:
                return this.attack2();
            case 3:
                return this.attack3();
        }
    } else {
        switch (attack_id) {
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
