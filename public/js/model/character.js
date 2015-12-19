// Inheritance
Character.prototype = Object.create(Element.prototype);
Character.prototype.constructor = Element;

function Character(x, y, angle, game, player, asset)
{

    Element.call(this, game, x, y, asset);
    //game.add.existing(this);

    this.rotation = angle;

    this.player = player;
    this.game = game;
    this.debug = true;

//    this.CG_character = game.physics.p2.createCollisionGroup(); //COLLISION GROUP

    game.physics.p2.updateBoundsCollisionGroup(); //UPDATE COLLISION BOUND FOR GROUPS

    this.game.spacePhysics.addDynamic(this);
//    this.game.physics.box2d.enable(this);
    this.game.physics.p2.enable([this], this.debug);
    this.body.clearShapes();
    this.anchor.setTo(0.5, 0.25);
    this.body.loadPolygon('robotnikShape', "robotnik");
    this.body.dynamic = true;
    this.body.immovable = false;
    this.body.static = false;
    this.body.collideWorldBounds = true;
    this.body.setCollisionGroup(GALACTIC_STRIKE.room.map.CG_characters);


    //Attributes

    this.jumpForce = 50;
    this.health = 100;
    this.items = [];
    this.bullets = [];

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
    this.fireCooldown = true;

    // Cooldown times
    this.jumpCooldownTime = 350;
    this.attack0CooldownTime = 700;
    this.attack1CooldownTime = 330;
    this.attack2CooldownTime = 1500;
    this.attack3CooldownTime = 500;
    this.fireCooldownTime = 250;
    this.hitImmuneTime = 550; //After being attacked, the character cannot be hurted for this time


    // Sounds

    this.attackSound = game.add.audio('pingas', 0.6, false);
    this.dieSound = game.add.audio('dieSound', 0.7, false);
    this.hitSound = game.add.audio('hitSound', 0.8, false);
    this.jetpackSound = game.add.audio('jetpackSound', 0.5, false);

    var PTM = 50;
    var driveJoints = [];


    var frequency = 12;
    var damping = 100;
    var motorTorque = 1;
    var rideHeight = 0.25;


    this.planetTouched = null;
    this.atmosphere = [];
    this.grounded = false;

//    var truckVertices = [-10, -30, 10, -30, 20, 0, -20, 0];

//    this.body.setPolygon(truckVertices);
    this.body.mass = 1;
    this.body.angularDamping = 0.15;
    this.body.linearDamping = 0.3;

    //    // Atributes while grounded
    //    this.angularDampingGrounded = 0.15;
    //    this.speedGrounded = 30;
    //
    //    // Atributes while not grounded in orbit
    //    this.angularDampingOrbit = 0.15;
    //    this.forceOrbit = 700;
    //    this.angularSpeedOrbit = 150;
    //
    //    // Atributes in space
    //    this.angularDampingSpaceRotating = 0.15;
    //    this.angularDampingSpaceMoving = 10;
    //    this.angularDampingSpaceStill = 0.15;
    //    this.rotateSpace = 100;
    //    this.angularVelocitySpace = 0.15;
    //    this.angularSpeedSpace = 150;
    //    this.forceSpace = 250;


    this.driveJoints = [];
    this.wheels = [];

    if (asset === 'playerRed')
    {
        this.wheel = 'wheel_red';
    }
    else
    {
        this.wheel = 'wheel_blue';
    }
    this.wheels[0] = new Phaser.Sprite(game, this.x + -0.22 * PTM, this.y + 0.3 * -PTM, this.wheel);
    this.wheels[0].anchor.set(0.5);
    game.add.existing(this.wheels[0]);
    this.wheels[1] = new Phaser.Sprite(game, this.x + 0.22 * PTM, this.y + 0.3 * -PTM, this.wheel);
    this.wheels[1].anchor.set(0.5);
    game.add.existing(this.wheels[1]);

    // Bodies of the wheels

    this.game.physics.p2.enable([this.wheels[0], this.wheels[1]] , this.debug, true);

//    this.wheels[0].body = new Phaser.Physics.Box2D.Body(this.game, null, this.x + -0.22 * PTM, this.y + 0.6 * -PTM, 1);
//    this.wheels[0].body = new Phaser.Physics.P2.Body(this.game, this.wheels[0], this.x + -0.22 * PTM, this.y + 0.6 * -PTM, 1);
//    this.wheels[0].body.sprite = this.wheels[0];
//    this.wheels[1].body = new Phaser.Physics.Box2D.Body(this.game, null, this.x + 0.22 * PTM, this.y + 0.6 * -PTM);
//    this.wheels[1].body.sprite = this.wheels[1];
//    this.wheels[1].body = new Phaser.Physics.P2.Body(this.game, this.wheels[1], this.x + -0.22 * PTM, this.y + 0.6 * -PTM, 1);
    this.wheels[0].body.setCircle(0.2 * PTM);
    this.wheels[1].body.setCircle(0.2 * PTM);
//    this.wheels[0].body.collideWorldBounds = true;
//    this.wheels[1].body.collideWorldBounds = true;
//    this.wheels[0].body.friction = 0.8;
//    this.wheels[1].body.friction = 0.8;
//    this.motorEnabled = false;
//    this.motorSpeed = 30;

    var frequency = 3.5;
    var damping = 0.5;
    var motorTorque = 2;
    var rideHeight = 0.5;

    // Joints between de wheels and the main body
//    this.driveJoints[0] = game.physics.box2d.wheelJoint(this.body, this.wheels[0].body, -0.65 * PTM, rideHeight * PTM, 0, 0, 0, 1, frequency, damping, 0, motorTorque, true);
//    this.driveJoints[1] = game.physics.box2d.wheelJoint(this.body, this.wheels[1].body, 0.65 * PTM, rideHeight * PTM, 0, 0, 0, 1, frequency, damping, 0, motorTorque, true);

    this.springs = [];
    this.springs[0] = game.physics.p2.createSpring(this, this.wheels[0], 70, 150, 50,null,null,[30,0],null);
    this.springs[1] = game.physics.p2.createSpring(this, this.wheels[1], 70, 150,50,null,null,[-30,0],null);


    this.constraint = game.physics.p2.createPrismaticConstraint(this, this.wheels[0], false,[30,0],[0,0],[0,1]);

    //SET LIMITS
     this.constraint.lowerLimitEnabled= this.constraint.upperLimitEnabled = true;
     this.constraint.upperLimit = -0.7;
     this.constraint.lowerLimit = -1;
    this.constraint_1 = game.physics.p2.createPrismaticConstraint(this, this.wheels[1], false,[-30,0],[0,0],[0,1]);

    //SET LIMITS
     this.constraint_1.lowerLimitEnabled= this.constraint_1.upperLimitEnabled = true;
     this.constraint_1.upperLimit = -0.7;
     this.constraint_1.lowerLimit = -1;

    this.wheels[0].body.setCollisionGroup(GALACTIC_STRIKE.room.map.CG_characters);
    this.wheels[1].body.setCollisionGroup(GALACTIC_STRIKE.room.map.CG_characters);

    this.body.collides(GALACTIC_STRIKE.room.map.CG_planets, touchPlanetCallback, this);
    this.wheels[0].body.collides(GALACTIC_STRIKE.room.map.CG_planets, touchPlanetCallback, this);
    this.wheels[1].body.collides(GALACTIC_STRIKE.room.map.CG_planets, touchPlanetCallback, this);

//    this.body.onEndContact.add(untouchPlanetCallback, this);
//    this.wheels[0].body.onEndContact.add(untouchPlanetCallback, this.wheels[0]);
//    this.wheels[1].body.onEndContact.add(untouchPlanetCallback, this.wheels[1]);



    // This is for the collision callback
    this.wheels[0].body.mainSprite = this;
    this.wheels[1].body.mainSprite = this;
    this.body.mainSprite = this;


    // Spritesheet animations
    this.animations.add('left', [0]);
    this.animations.add('right', [1]);
    this.animations.add('jumpL', [4]);
    this.animations.add('jumpR', [5]);


    //Display player name

    var text = game.add.text(0, -56, player.nickname,
    {
        font: "16px Arial",
        fill: "#ffffff"
    });
    this.addChild(text);
    text.anchor.set(0.5);

    this.body.setMaterial(game.spacePhysics.spriteMaterial);

    console.log(this);


};

/**
 * This method is called when a character is killed or his owner disconnects
 */

Character.prototype.die = function ()
{

    if (!this.alive) return;

    this.alive = false;
    this.dieSound.play();
    //    var emitter = game.add.emitter(0, 0, 100);
    //    emitter.makeParticles('pokeball');
    //    emitter.x = this.x;
    //    emitter.y = this.y;
    //    emitter.start(true, 2000, null, 10);
    //    game.time.events.add(2000, function () {
    //        if (emitter) emitter.destroy();
    //    }, this);
    this.wheels[0].destroy();
    this.wheels[1].destroy();
    if(this.spikeball) this.spikeball.die();
    //this.body.destroy();
    this.destroy();

}

/**
 * This method kills the character without particles
 */

Character.prototype.simpleDie = function ()
{

    if (!this.alive) return;
    this.alive = false;
    this.wheels[0].destroy();
    this.wheels[1].destroy();
    if(this.spikeball) this.spikeball.die();
    //this.body.destroy();
    this.destroy();

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
