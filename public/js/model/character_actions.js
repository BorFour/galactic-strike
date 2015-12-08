
/**
 * This file is an extension of character.js
 */


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

Character.prototype.attack0 = function (){
    if(this.attackCooldown && this.alive){
        this.attackSound.play();
        this.attackCooldown = false;
        this.cucumber = new Item(game, this.body.x + Math.sin(this.body.rotation)* 80, this.body.y - Math.cos(this.body.rotation)*80, items['spikeball']);
//        console.log(this.cucumber)
        this.cucumber.owner = this;
//        this.bullets.push(bullet);
//        var fn = cucumber.collide;
//        cucumber.body.mass = 0.1;
//        cucumber.body.bullet = true;
//        for (c in charactersList){
//            cucumber.body.setBodyContactCallback(charactersList[c], fn, this);
//        }

//        game.physics.box2d.motorJoint(spriteA, spriteB, 800, 500, 0.25, -100, 200, 45);
        this.cucumber.damage = 80;
        game.physics.box2d.motorJoint(this, this.cucumber, 80 , 50, 0.25, this.orientation*80, 50, 4.5);

//        cucumber.body.rotation = this.body.rotation; // Este ángulo va en grados
//        cucumber.body.angularVelocity = 20;
        this.cucumber.body.thrust(1000);

        for(var c in charactersList){
            this.cucumber.body.setBodyContactCallback(charactersList[c], touchSpikeballEnemy, this);
        }

        game.time.events.add(this.attackCooldownTime, function(){this.cucumber.destroy(); this.attackCooldown = true;}, this)

    }
}

Character.prototype.attack1 = function (){
    if(this.attackCooldown && this.alive){
        this.attackSound.play();
        this.attackCooldown = false;
        this.cucumber2 = new Item(game, this.x + Math.cos(this.body.rotation)* 80*this.orientation, this.y + Math.sin(this.body.rotation)*80*this.orientation, items['spikeball']);
//        console.log(this.cucumber2)
        this.cucumber2.owner = this;
//        this.bullets.push(bullet);
//        var fn = cucumber.collide;
//        cucumber.body.mass = 0.1;
//        cucumber.body.bullet = true;
//        for (c in charactersList){
//            cucumber.body.setBodyContactCallback(charactersList[c], fn, this);
//        }

//        game.physics.box2d.motorJoint(spriteA, spriteB, 800, 500, 0.25, -100, 200, 45);
        this.cucumber2.damage = 35;
//        game.physics.box2d.motorJoint(this, this.cucumber2, 80*this.orientation, 0, 0.25, 120, 0, 4.5);
        game.physics.box2d.motorJoint(this, this.cucumber2, 80 , 50, 0.25, this.orientation*120, 0, 4.5);
//        cucumber.body.rotation = this.body.rotation; // Este ángulo va en grados
//        cucumber.body.angularVelocity = 20;
        this.cucumber2.body.thrust(1000);

        for(var c in charactersList){
            this.cucumber2.body.setBodyContactCallback(charactersList[c], touchSpikeballEnemy, this);
        }
        game.time.events.add(this.attack2CooldownTime, function(){this.cucumber2.destroy(); this.attackCooldown = true;}, this)

    }
}

Character.prototype.attack2 = function (){
    if(this.fireCooldown && this.alive){
        this.fireCooldown = false;

        var bullet = new Item(game, this.x, this.y, items['bullet']);
        bullet.body.setCollisionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.BULLET);

        bullet.owner = this;
        bullet.damage = 15;

        this.bullets.push(bullet);
        bullet.body.mass = 0.001;
        bullet.body.bullet = true;

        if(this.inAtmosphere()){
            bullet.body.angle = this.angle + 90*this.orientation; // Este ángulo va en grados
            bullet.body.thrust(155400);
        }
        else{
            bullet.body.angle = this.angle;
            bullet.body.thrust(155400);
        }

        for(var c in charactersList){
            bullet.body.setBodyContactCallback(charactersList[c], touchSpikeballEnemy, this);
        }

        game.time.events.add(this.fireCooldownTime, function(){this.fireCooldown = true}, this)
        game.time.events.add(1000, function(){bullet.destroy()}, this)

    }
}

Character.prototype.attack3 = function (){
    if(this.fireCooldown && this.alive){
        this.fireCooldown = false;

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

        if(this.inAtmosphere()){
            bullet.body.angle = this.angle + 90*this.orientation; // Este ángulo va en grados
            bullet.body.thrust(155400);
        }
        else{
            bullet.body.angle = this.angle;
            bullet.body.thrust(155400);
        }

        for(var c in charactersList){
            bullet.body.setBodyContactCallback(charactersList[c], touchSpikeballEnemy, this);
        }

        game.time.events.add(this.fireCooldownTime, function(){this.fireCooldown = true}, this)
        game.time.events.add(1000, function(){bullet.destroy()}, this)

    }
}

Character.prototype.attacks = function (attack_id){

    switch(attack_id)
    {
        case 0 :
            return this.attack0();
        case 1:
            return this.attack1();
        case 2:
            return this.attack2();
        case 3:
            return this.attack3();
    }

}
