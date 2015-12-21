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

        if (body1.sprite.contraint) game.physics.p2.removeConstraint(body1.sprite.contraint);
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

        //        if(body1.sprite.contraint)  game.physics.p2.removeConstraint(body1.sprite.contraint);
        body1.sprite.destroy();
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
