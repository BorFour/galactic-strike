/**
 *
 * @file spacePhysics.js
 * @date 07/11/2015
 */

function SpacePhysics(game)
{

    this.game = game;

    // groups containing crates and planets

    this.dynamicGroup = [];
    this.planetGroup = [];

    // a force reducer to let the simulation run smoothly

    this.forceReducer = 0.0115;

    // graphic object where to draw planet gravity area

    this.debug = false;

    this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
    this.wheelMaterial = game.physics.p2.createMaterial('wheelMaterial');
    this.planetMaterial = game.physics.p2.createMaterial('planetMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);

    this.contactMaterialSpriteWorld = game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial);
    this.contactMaterialWheelPlanet = game.physics.p2.createContactMaterial(this.wheelMaterial, this.planetMaterial);

    // Contact: Sprite - World Bounds
    this.contactMaterialSpriteWorld.friction = 0.3;     // Friction to use in the contact of these two materials.
    this.contactMaterialSpriteWorld.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    this.contactMaterialSpriteWorld.stiffness = 1e7;    // Stiffness(rigidez) of the resulting ContactEquation that this ContactMaterial generate.
    this.contactMaterialSpriteWorld.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    this.contactMaterialSpriteWorld.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    this.contactMaterialSpriteWorld.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    this.contactMaterialSpriteWorld.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

    // Contact: Wheel - Planets
    this.contactMaterialWheelPlanet.friction = 8;
    this.contactMaterialWheelPlanet.restitution = 0.1;
    //this.contactMaterialWheelPlanet.stiffness = 1e7;
    this.contactMaterialWheelPlanet.relaxation = 2;
    //this.contactMaterialWheelPlanet.frictionStiffness = 1e7;
    //this.contactMaterialWheelPlanet.frictionRelaxation = 1;
    //this.contactMaterialWheelPlanet.surfaceVelocity = 3;


    this.CG_planets = game.physics.p2.createCollisionGroup();
    this.CG_teams = {};
    for (var t in GALACTIC_STRIKE.room.teams) {
        console.log(t);
        this.CG_teams[t] = game.physics.p2.createCollisionGroup();
    }
//    this.CG_characters = game.physics.p2.createCollisionGroup();
    this.CG_suns = game.physics.p2.createCollisionGroup();
    this.CG_attacks = game.physics.p2.createCollisionGroup();
    this.CG_wormholes = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();


}


SpacePhysics.prototype.consoleLog = function ()
{

    console.log("@Physics: " + dynamicGroup);

};

/**
 * Adds an object to the space physics engine's planet group (bodies with a gravitational field)
 * @param {Element} sprite element with a body
 */

SpacePhysics.prototype.addPlanet = function (planet)
{

    this.planetGroup.push(planet);
    return planet;

}

/**
 * Adds an object to the space physics engine's dynamic group
 * @param {Element} sprite element with a body
 */

SpacePhysics.prototype.addDynamic = function (sprite)
{

    this.dynamicGroup.push(sprite)

}

/**
 * This function is called in the game loop. It applies the gravitational field of each planet to each dynamic element
 */

SpacePhysics.prototype.update = function ()
{

    for (var i = 0; i < this.dynamicGroup.length; i++)
    {
        var c = this.dynamicGroup[i];
        var atmosphere = [];

        if (!c.alive || c.body.static)
        {
            continue;
        }
        for (var j = 0; j < this.planetGroup.length; j++)
        {
            var p = this.planetGroup[j];
            if (Phaser.Math.distance(c.x, c.y, p.x, p.y) < (p.collisionRadius + p.gravityRadius)/2)
            {

                // calculating angle between the planet and the crate
                var angle = Phaser.Math.angleBetween(c.x, c.y, p.x, p.y);
                // add gravity force to the crate in the direction of planet center
                c.body.applyImpulse([- p.gravityForce * Math.cos(angle) * this.forceReducer,
-                    p.gravityForce * Math.sin(angle) * this.forceReducer], 0, 0);
                atmosphere.push(p);
            }
        }
        c.atmosphere = atmosphere;
    }

}
