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

    this.forceReducer = 0.00615;

    // graphic object where to draw planet gravity area

    this.debug = false;

    this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);

    this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');

    this.spriteMaterial = game.physics.p2.createMaterial('planetMaterial');

    this.contactMaterial = game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial);

    this.contactMaterial.friction = 0.3;     // Friction to use in the contact of these two materials.
    this.contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    this.contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    this.contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    this.contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    this.contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    this.contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

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

        if (c.body.static)
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
