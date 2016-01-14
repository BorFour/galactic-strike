function touchPlanetCallback(body1, body2, fixture1, fixture2, begin)
{

    body1.mainSprite.planetTouched = body2;
    body1.mainSprite.grounded = true;
    //    body1.mainSprite.planetSpring = game.physics.p2.createSpring(body1.mainSprite, body2.sprite, 0.01, 0.01, 0);

}

function untouchPlanetCallback(target)
{

    //    setUngrounded(target);

}

function touchSunCallback(body1, body2, fixture1, fixture2, begin)
{

    if (body1.mainSprite.hitImmune)
    {
        return;
    }
    var angle = Phaser.Math.angleBetween(body1.mainSprite.x, body1.mainSprite.y, body2.sprite.x, body2.sprite.y);
    // add gravity force to the crate in the direction of planet center
    body1.mainSprite.body.applyImpulse([100 * Math.cos(angle),
                         100 * Math.sin(angle)], 0, 0);
    body1.mainSprite.hurt(body2.sprite.damage);
}



function touchItemCallback(body1, body2, fixture1, fixture2, begin)
{

    console.log('@Client ->      \t| pickUpItem');
    socket.emit('pickUpItem',
    {
        id: body2.sprite.player.id,
        index: body1.sprite.index
    });

}


function touchWormholeCallback(body1, body2, fixture1, fixture2, begin)
{

    console.log("Wormhole callback");
    var nextWormhole = body2.sprite.nextWormholes[Math.floor(Math.random() * body2.sprite.nextWormholes.length)];

    var nextPosition = GALACTIC_STRIKE.room.stage.spawnPositionPlanet(nextWormhole);

    body1.sprite.x = nextPosition.x;
    body1.sprite.y = nextPosition.y;
    body1.sprite.body.rotation = nextPosition.angle;


}

function touchWormholeCallback2(body1, body2, fixture1, fixture2, begin)
{
    if (!body2.sprite.wormholeCooldown)
    {
        return;
    }

    body2.sprite.wormholeCooldown = false;
    console.log("Wormhole callback");
    var nextWormhole = body1.sprite.nextWormholes[Math.floor(Math.random() * body1.sprite.nextWormholes.length)];

    var nextPosition = GALACTIC_STRIKE.room.stage.spawnPositionPlanet(nextWormhole);

    body2.mainSprite.wormholeSound.play();
    body2.x = nextPosition.x;
    body2.y = nextPosition.y;
    body2.rotation = nextPosition.angle;
    body2.sprite.wheels[0].body.x = nextPosition.x;
    body2.sprite.wheels[1].body.x = nextPosition.x;
    body2.sprite.wheels[0].body.y = nextPosition.y;
    body2.sprite.wheels[1].body.y = nextPosition.y;
    for (var s in body2.sprite.spikeballs)
    {
        if (body2.sprite.spikeballs[s].constraint)
        {
            if (body2.sprite.spikeballs[s].body)
            {
                body2.sprite.spikeballs[s].body.x = nextPosition.x;
                body2.sprite.spikeballs[s].body.y = nextPosition.y;
            }
        }
    }

    game.time.events.add(body2.sprite.wormholeCooldownTime, function ()
    {
        if (body2 && body2.sprite) body2.sprite.wormholeCooldown = true;
    }, this);

}

/**
 * Sets the grounded attribute of the character to true and tries to set it false after a period of time
 */

function setUngrounded(target)
{
    this.body.mainSprite.grounded = false;
    //    if (this.body.groundedTimer)
    //    {
    //        game.time.events.remove(target.groundedTimer);
    //        targthis.bodyet.groundedTimer = null;
    //    }
    //
    //    this.body.groundedTimer = game.time.events.add(100, function ()
    //    {
    //        this.body.grounded = false;
    //
    ////        this.body.mainSprite.planetTouched = null;
    //    }, this);

}


function touchSpikeballEnemy(body1, body2, fixture1, fixture2, begin)
{
    console.log("Spikeball callback");
    if (body1.sprite &&
        body2.sprite &&
        body1.sprite.owner !== body2.sprite &&
        !body2.sprite.hitImmune &&
        body2.sprite.health > 0)
    {
        if (body1.sprite.owner.player.team === body2.mainSprite.player.team)
        {
            return;
        }
        if (body1.sprite.owner === GALACTIC_STRIKE.player.character)
        {
            body2.sprite.hitImmune = true;
            console.log(body2.mainSprite.player);

            var output = {
                id: GALACTIC_STRIKE.player.id,
                target: body2.mainSprite.player.id,
                damage: body1.sprite.damage
            };

            socket.emit('hit', output);
            console.log('@Client ->      \t| hit');
            console.log(output);
        }

        if (body1.sprite.constraint) game.physics.p2.removeConstraint(body1.sprite.constraint);
        body1.destroy();

    }
}


function touchPunchEnemy(body1, body2, fixture1, fixture2, begin)
{
    console.log("Punch callback");
    if (body1.sprite &&
        body2.sprite &&
        body1.sprite.owner !== body2.sprite &&
        !body2.sprite.hitImmune &&
        body2.sprite.health > 0)
    {
        if (body1.sprite.owner.player.team === body2.mainSprite.player.team)
        {
            return;
        }
        if (body1.sprite.owner === GALACTIC_STRIKE.player.character)
        {
            body2.sprite.hitImmune = true;
            console.log(body2.mainSprite.player);

            var output = {
                id: GALACTIC_STRIKE.player.id,
                target: body2.mainSprite.player.id,
                damage: body1.sprite.damage
            };

            socket.emit('hit', output);
            console.log('@Client ->      \t| hit');
            console.log(output);
        }

        if (body1.sprite.constraint) game.physics.p2.removeConstraint(body1.sprite.constraint);
        body1.destroy();

    }
}


function touchHammerEnemy(body1, body2, fixture1, fixture2, begin)
{
    console.log("Hammer callback");
    if (body1.sprite &&
        body2.sprite &&
        body1.sprite.owner !== body2.sprite &&
        !body2.sprite.hitImmune &&
        body2.sprite.health > 0)
    {
        if (body1.sprite.owner.player.team === body2.mainSprite.player.team)
        {
            return;
        }
        if (body1.sprite.owner === GALACTIC_STRIKE.player.character)
        {
            body2.sprite.hitImmune = true;
            console.log(body2.mainSprite.player);

            var output = {
                id: GALACTIC_STRIKE.player.id,
                target: body2.mainSprite.player.id,
                damage: body1.sprite.damage
            };

            socket.emit('hit', output);
            console.log('@Client ->      \t| hit');
            console.log(output);
        }

        if (body1.sprite.constraint) game.physics.p2.removeConstraint(body1.sprite.constraint);
        body1.destroy();

    }
}


function touchMineEnemy(body1, body2, fixture1, fixture2, begin)
{
    console.log("Mines callback");
    if (body1.sprite &&
        body2.sprite &&
        body1.sprite.owner !== body2.sprite &&
        !body2.sprite.hitImmune &&
        body2.sprite.health > 0)
    {
        if (body1.sprite.owner.player.team === body2.mainSprite.player.team)
        {
            return;
        }
        if (body1.sprite.owner === GALACTIC_STRIKE.player.character)
        {
            body2.sprite.hitImmune = true;
            console.log(body2.mainSprite.player);

            var output = {
                id: GALACTIC_STRIKE.player.id,
                target: body2.mainSprite.player.id,
                damage: body1.sprite.damage
            };

            socket.emit('hit', output);
            console.log('@Client ->      \t| hit');
            console.log(output);

        }
        body1.sprite.destroy();
        //        if(body1.sprite.contraint)  game.physics.p2.removeConstraint(body1.sprite.contraint);

        // Explosion animation

    }
}

function attack0Callback()
{
    if (!this.character || !this.character.alive)
    {
        return;
    }
    if (this.character.inAtmosphere())
    {
        if (this.character.attack0())
        {
            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 0,
                space: false
            };
            socket.emit('attack', output);
        }
    }
    else if (this.character.attack0())
    {
        var output = {
            id: GALACTIC_STRIKE.player.id,
            attack_id: 0,
            space: true
        };

        socket.emit('attack', output);
    }
}

function attack1Callback()
{
    if (!this.character || !this.character.alive)
    {
        return;
    }
    if (this.character.inAtmosphere())
    {
        if (this.character.attack1())
        {
            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 1,
                space: false
            };
            socket.emit('attack', output);
        }
    }
    else
    {
        if (this.character.attack1())
        {

            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 1,
                space: true
            };

            socket.emit('attack', output);
        }
    }
}

function attack2Callback()
{
    if (!this.character || !this.character.alive)
    {
        return;
    }
    if (this.character.inAtmosphere())
    {
        if (this.character.attack2())
        {
            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 2,
                space: false
            };
            socket.emit('attack', output);
        }
    }
    else
    {
        if (this.character.attack2())
        {
            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 2,
                space: true
            };
            socket.emit('attack', output);
        }
    }
}

function attack3Callback()
{
    if (!this.character || !this.character.alive)
    {
        return;
    }
    if (this.character.inAtmosphere())
    {
        if (this.character.attack3())
        {
            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 3,
                space: false
            };
            socket.emit('attack', output);
        }
    }
    else
    {
        if (this.character.attack3())
        {
            var output = {
                id: GALACTIC_STRIKE.player.id,
                attack_id: 3,
                space: true
            };
            socket.emit('attack', output);
        }
    }
}

// Destroys the attack when it touch a planet.
// Don't understand why this function is called twice
function touchPlanetSpaceAttack(body1, body2, fixture1, fixture2, begin)
{
    if (body1.sprite != null)
    {
        body1.sprite.destroy();
    }
}



function touchPlanetPunch(body1, body2, fixture1, fixture2, begin)
{
    if (body1.sprite != null)
    {
        game.physics.p2.removeConstraint(body1.sprite.constraint);
        body1.sprite.destroy();
    }
}

