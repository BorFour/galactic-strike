// Inheritance
Character.prototype = Object.create(Element.prototype);
Character.prototype.constructor = Element;

function Character(x, y, angle, game, player, conf)
{

    Element.call(this, game, x, y, player.team.color == 1 ? conf.spritesheet.red : conf.spritesheet.blue);

    this.rotation = angle;
    this.player = player;
    this.game = game;

    this.debug = false;

    game.physics.p2.updateBoundsCollisionGroup(); //UPDATE COLLISION BOUND FOR GROUPS

    console.log(game.spacePhysics.CG_teams[this.player.team.color - 1]);
    if (player == GALACTIC_STRIKE.player) this.game.spacePhysics.addDynamic(this);
    this.game.physics.p2.enable([this], this.debug);
    this.body.clearShapes();
    this.anchor.setTo(0.5, 0.35);
    this.body.loadPolygon('robotnikShape', "robotnik");
    this.body.dynamic = true;
    this.body.immovable = false;
    this.body.static = false;
    this.body.setCollisionGroup(game.spacePhysics.CG_teams[this.player.team.color - 1]);
    this.body.collideWorldBounds = true;

    //Attributes
    this.jumpForce = 75;
    this.health = 100;
    this.items = [];
    this.bullets = [];
    this.spikeballs = [];
    this.mines = [];
    this.numberOfMines = 3;
    this.turbos = 0;
    this.body.mass = 1

    // Velocity in space
    this.moveSpaceThrust = 500;
    this.moveInOrbitJetpack = 1470;

    // States
    this.RIGHT = 1;
    this.LEFT = -1;
    this.orientation = 1;
    this.jumpAnimation = false;
    this.alive = true;

    // Cooldowns
    this.jumpCooldown = true;
    this.hitImmune = false;
    this.attackCooldown = true;
    this.minesCooldown = true;
    this.fireCooldown = true;
    this.wormholeCooldown = true;
    this.usingTurbo = false;

    // Cooldown times
    this.jumpCooldownTime = 350;
    this.attack0CooldownTime = 700;
    this.attack1CooldownTime = 450;
    this.attack2CooldownTime = 1200;
    this.attack3CooldownTime = 750;
    this.minesCooldownTime = 7000;
    this.wormholeCooldownTime = 1500;
    this.fireCooldownTime = 250;
    this.turboDuration = 1000;
    this.hitImmuneTime = 550; //After being attacked, the character cannot be hurted for this time


    // Damages
    this.damageAttack0 = 25;
    this.damageAttack1 = 20;
    this.damageAttack2 = 25;
    this.damageAttack3 = 10;

    // Multipliers
    this.turboMultiplier = 5;

    // Sounds
    this.attackSound = game.add.audio(conf.sounds.attack, 0.6, false);
    this.dieSound = game.add.audio(conf.sounds.die, 0.7, false);
    this.hitSound = game.add.audio(conf.sounds.hit, 0.8, false);
    this.jetpackSound = game.add.audio(conf.sounds.jetpack, 0.5, false);
    this.wormholeSound = game.add.audio(conf.sounds.wormhole, 0.5, false);
    this.turboSound = game.add.audio(conf.sounds.turbo, 0.6, false);

    var PTM = 50;
    var driveJoints = [];
    var frequency = 12;
    var damping = 100;
    var motorTorque = 1;
    var rideHeight = 0.25;

    this.planetTouched = null;
    this.atmosphere = [];
    this.grounded = false;
    this.driveJoints = [];
    this.wheels = [];

    //    var truckVertices = [-10, -30, 10, -30, 20, 0, -20, 0];
    //    this.body.setPolygon(truckVertices);
    this.body.mass = 1;
    this.body.angularDamping = 0.15;
    this.body.linearDamping = 0.3;

    if (player.team.color == 1)
    {
        this.wheel = conf.wheel.red;
    }
    else
    {
        this.wheel = conf.wheel.blue;
    }

    this.wheels[0] = new Phaser.Sprite(game, this.x + -0.22 * PTM, this.y + 0.3 * -PTM, this.wheel);
    this.wheels[0].anchor.set(0.5);
    game.add.existing(this.wheels[0]);

    this.wheels[1] = new Phaser.Sprite(game, this.x + 0.22 * PTM, this.y + 0.3 * -PTM, this.wheel);
    this.wheels[1].anchor.set(0.5);
    game.add.existing(this.wheels[1]);

    // Bodies of the wheels
    this.game.physics.p2.enable([this.wheels[0], this.wheels[1]], this.debug);
    this.wheels[0].body.setCircle(0.2 * PTM);
    this.wheels[1].body.setCircle(0.2 * PTM);

    // Wheel's properties
    var frequency = 3.5;
    var damping = 0.5;
    var motorTorque = 2;
    var rideHeight = 0.5;

    this.springs = [];
    this.springs[0] = game.physics.p2.createSpring(this, this.wheels[0], 70, 150, 50, null, null, [30, 0], null);
    this.springs[1] = game.physics.p2.createSpring(this, this.wheels[1], 70, 150, 50, null, null, [-30, 0], null);


    this.constraint = game.physics.p2.createPrismaticConstraint(this, this.wheels[0], false, [30, 0], [0, 0], [0, 1]);
    this.constraint_1 = game.physics.p2.createPrismaticConstraint(this, this.wheels[1], false, [-30, 0], [0, 0], [0, 1]);

    // Set limits left wheel
    this.constraint_1.lowerLimitEnabled = this.constraint_1.upperLimitEnabled = true;
    this.constraint_1.upperLimit = -0.7;
    this.constraint_1.lowerLimit = -1;

    // Set limits right wheel
    this.constraint.lowerLimitEnabled = this.constraint.upperLimitEnabled = true;
    this.constraint.upperLimit = -0.7;
    this.constraint.lowerLimit = -1;

    // Collisions
    this.wheels[0].body.setCollisionGroup(game.spacePhysics.CG_teams[this.player.team.color - 1]);
    this.wheels[1].body.setCollisionGroup(game.spacePhysics.CG_teams[this.player.team.color - 1]);

    this.body.collides(game.spacePhysics.CG_planets, touchPlanetCallback, this);
    this.wheels[0].body.collides(game.spacePhysics.CG_planets, touchPlanetCallback, this);
    this.wheels[1].body.collides(game.spacePhysics.CG_planets, touchPlanetCallback, this);

    this.body.collides(game.spacePhysics.CG_suns, touchSunCallback, this);
    this.wheels[0].body.collides(game.spacePhysics.CG_suns, touchSunCallback, this);
    this.wheels[1].body.collides(game.spacePhysics.CG_suns, touchSunCallback, this);

    this.body.collides(game.spacePhysics.CG_wormholes, touchWormholeCallback, this);

    this.body.collides(game.spacePhysics.CG_attacks);
    this.wheels[0].body.collides(game.spacePhysics.CG_attacks);
    this.wheels[1].body.collides(game.spacePhysics.CG_attacks);

    this.body.collides(game.spacePhysics.CG_stageItems);

    // Characters only collide with enemies
    for (var t in game.spacePhysics.CG_teams)
    {
        if (game.spacePhysics.CG_teams[t] === game.spacePhysics.CG_teams[this.player.team.color - 1])
        {
            continue;
        }
        this.body.collides(game.spacePhysics.CG_teams[t]);
        this.wheels[0].body.collides(game.spacePhysics.CG_teams[t]);
        this.wheels[1].body.collides(game.spacePhysics.CG_teams[t]);
    }

    // This is for the collision callback
    this.wheels[0].body.mainSprite = this;
    this.wheels[1].body.mainSprite = this;
    this.body.mainSprite = this;


    // Spritesheet animations
    this.animations.add('left', [0]);
    this.animations.add('right', [1]);
    this.animations.add('jumpL', [2]);
    this.animations.add('jumpR', [3]);

    // Blood effect when damaging
    this.bloodEffect = this.addChild(game.make.sprite(0, 0, 'blood'));
    this.bloodEffect.anchor.set(0.5);
    this.bloodEffect.animations.add('bleeding', [0, 1, 2, 3, 4, 5]);

    // Display player name
    var text = game.add.text(0, -56, player.nickname,
    {
        font: "16px Arial",
        fill: "#ffffff"
    });
    this.addChild(text);
    text.anchor.set(0.5);

    // Material of the character's bodies
    this.body.setMaterial(game.spacePhysics.spriteMaterial);
    this.wheels[0].body.setMaterial(game.spacePhysics.wheelMaterial);
    this.wheels[1].body.setMaterial(game.spacePhysics.wheelMaterial);
    console.log(this);


};

/**
 * This method is called when a character is killed or his owner disconnects
 */

Character.prototype.die = function ()
{
    if (!this.alive) return;

    this.dieSound.play();
    //      PARTICLES COMMENTED BECAUSE OF A BUG
    //    var emitter = game.add.emitter(0, 0, 100);
    //    emitter.makeParticles('pokeball');
    //    emitter.x = this.x;//    emitter.y = this.y;
    //    emitter.start(true, 2000, null, 10);
    //    game.time.events.add(2000, function () {
    //        if (emitter) emitter.destroy();
    //    }, this);
    game.physics.p2.removeConstraint(this.constraint)
    game.physics.p2.removeConstraint(this.constraint_1)
    this.health = 0;
    this.wheels[0].destroy();
    this.wheels[1].destroy();
    for (var a in this.spikeballs)
    {
        if (this.spikeballs[a])
        {
            this.spikeballs[a].die();
            if (this.spikeballs[a].constraint) game.physics.p2.removeConstraint(this.spikeballs[a].constraint);
        }
    }

    for (var m in this.mines)
    {
        if (this.mines[m])
        {
            this.mines[m].die();
        }
    }

    this.destroy();

}

Character.prototype.respawn = function (x, y, angle)
{
    if (this.alive) return;

    this.reset(x, y);

    this.body.rotation = angle;
    this.wheels[0].revive();
    this.wheels[1].revive();

    // Set limits left wheel
    this.constraint = game.physics.p2.createPrismaticConstraint(this, this.wheels[0], false, [30, 0], [0, 0], [0, 1]);
    this.constraint.lowerLimitEnabled = this.constraint.upperLimitEnabled = true;
    this.constraint.upperLimit = -0.7;
    this.constraint.lowerLimit = -1;

    // Set limits right wheel
    this.constraint_1 = game.physics.p2.createPrismaticConstraint(this, this.wheels[1], false, [-30, 0], [0, 0], [0, 1]);
    this.constraint_1.lowerLimitEnabled = this.constraint_1.upperLimitEnabled = true;
    this.constraint_1.upperLimit = -0.7;
    this.constraint_1.lowerLimit = -1;
}

/**
 * This method kills the character without particles
 */

Character.prototype.simpleDie = function ()
{
    if (!this.alive) return;
    game.physics.p2.removeConstraint(this.constraint)
    game.physics.p2.removeConstraint(this.constraint_1)
    this.wheels[0].destroy();
    this.wheels[1].destroy();
    for (var a in this.spikeballs)
    {
        if (this.spikeballs[a])
        {
            this.spikeballs[a].die();
            if (this.spikeballs[a].constraint) game.physics.p2.removeConstraint(this.spikeballs[a].constraint);
        }
    }

    for (var m in this.mines)
    {
        if (this.mines[m])
        {
            this.mines[m].die();
        }
    }

    this.health = 0;
    this.destroy();

}


Character.prototype.hurt = function (damage)
{
    this.bloodEffect.animations.play('bleeding', 15, false);
    this.health -= damage;
    this.hitSound.play();

    // When the character's health drops below zero, the character dies.
    if (this.health <= 0)
    {
        delete GALACTIC_STRIKE.room.characters[this.player.id];
        delete GALACTIC_STRIKE.room.players[this.player.id].character;

        if (this.player.id == GALACTIC_STRIKE.player.id)
        {
            game.camera.follow(null);
            game.camera.reset();
            zoomOutGame();
        }

        this.die();
        GALACTIC_STRIKE.room.gameMode.update();


    }
    else
    {
        // This character is damage immune for a short period of time
        this.hitImmune = true;
        game.time.events.add(this.hitImmuneTime, function ()
        {
            if (this)
            {
                this.hitImmune = false;
            }
        }, this);
    }
}

/**
 * Checks if the character is in the world. Not used
 */

Character.prototype.inWorldCustom = function ()
{
    return this.x >= 0 &&
        this.y >= 0 &&
        this.x <= game.world.x &&
        this.y <= game.world.y;

}

/**
 * Overriding toString method
 * @returns {String} The character as a string
 */

Character.prototype.toString = function ()
{
    return "Player : " + this.player.nickname + " | HP : " + (this.health > 0 ? this.health : 'dead');
}
