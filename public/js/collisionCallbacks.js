
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


    }
}
