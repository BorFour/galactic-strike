Player = function (nickname)
{

    this.nickname = nickname;
    this.team = null;
    this.isReady = false;
    this.character = null;
    this.controller = new Controller(Controller.KEYBOARD);
    this.keyFns = [] // Probablemente prescindible
};

Player.prototype.leaveTeam = function ()
{

    if (this.team)
    {
        this.team.removePlayer(this);
    }
    this.team = null;

}

Player.prototype.joinTeam = function (team)
{

    this.leaveTeam();
    team.addPlayer(this);
}

// Función que se ejectuará cuando se presione la tecla 'left'
// del controlador del usuario
// Almacenamos la función en 'this' también por si queremos cambiar
// de controlador

Player.prototype.setKeyFunction = function (key, fn)
{

    this.keyFns[key] = fn;
    this.controller.keys[key].onDown.add(fn, this);

}

Player.prototype.movePlayer = function ()
{
    var moveForce = 0.515;

    if (!GALACTIC_STRIKE.room.gameOver && (!this.character || !this.character.alive))
    {
        if (this.controller.leftDown())
        {
            game.camera.x -= 5;
        }
        else if (this.controller.rightDown())
        {
            game.camera.x += 5;
        }
        if (this.controller.upDown())
        {
            game.camera.y -= 5;
        }
        else if (this.controller.downDown())
        {
            game.camera.y += 5;
        }
        return;
    }

    if (this.character.isGrounded())
    {
        if (this.controller.jumpDown())
        {
            this.character.jump();
        }
        else if (this.controller.downDown())
        {
            this.character.moveGrounded('down');
        }
        else if (this.controller.leftDown())
        {
            this.character.moveGrounded('left');
        }
        else if (this.controller.rightDown())
        {
            this.character.moveGrounded('right');
        }
        else
        {
            this.character.moveGrounded('still');
        }
    }
    else if (this.character.inAtmosphere())
    {
        if (this.controller.leftDown())
        {
            this.character.moveInOrbit('left');
        }
        else if (this.controller.rightDown())
        {
            this.character.moveInOrbit('right');
        }
        if (this.controller.jumpDown() && this.character.jumpCooldown)
        {
            this.character.moveInOrbit('jetpack');
        }
        else
        {
            this.character.moveInOrbit('still');
        }
    }
    else
    {
        if (this.controller.leftDown())
        {
            this.character.moveSpace('left');
        }
        else if (this.controller.rightDown())
        {
            this.character.moveSpace('right');
        }
        else
        {
            this.character.moveSpace('still');
        }
        if (this.controller.upDown() || this.controller.jumpDown())
        {
            this.character.moveSpace('up');
        }
        else if (this.controller.downDown())
        {
            this.character.moveSpace('down');
        }
        else
        {
            this.character.moveSpace('still');
        }
        if (this.controller.rotateLDown())
        {
            this.character.moveSpace('rotateL');
        }
        else if (this.controller.rotateRDown())
        {
            this.character.moveSpace('rotateR');
        }
    }

    //    if (this.attack0Key.isDown) {
    //        if (this.character.inAtmosphere()) {
    //            if (this.character.attack0()) {
    //                GALACTIC_STRIKE.player.character.currentAttack = {
    //                    id: 0,
    //                    space: false
    //                };
    //            }
    //        } else if (this.character.attack0()) {
    //            GALACTIC_STRIKE.player.character.currentAttack = {
    //                id: 0,
    //                space: true
    //            };
    //        }
    //    } else if (this.attack1Key.isDown) {
    //        if (this.character.inAtmosphere()) {
    //            if (this.character.attack1()) {
    //                GALACTIC_STRIKE.player.character.currentAttack = {
    //                    id: 1,
    //                    space: false
    //                };
    //            }
    //        } else if (this.character.attackSpace1()) {
    //            GALACTIC_STRIKE.player.character.currentAttack = {
    //                id: 1,
    //                space: true
    //            };
    //        }
    //    } else if (this.attack2Key.isDown) {
    //        if (this.character.inAtmosphere()) {
    //            if (this.character.attack2()) {
    //                GALACTIC_STRIKE.player.character.currentAttack = {
    //                    id: 2,
    //                    space: false
    //                };
    //            }
    //        } else if (this.character.attack2()) {
    //            GALACTIC_STRIKE.player.character.currentAttack = {
    //                id: 2,
    //                space: true
    //            };
    //        }
    //    }
    //    else if (attack3Key.isDown) {
    //         if (this.character.inAtmosphere()) {
    //            if (this.character.attack0()) {
    //                GALACTIC_STRIKE.player.character.currentAttack = {
    //                    id: 3,
    //                    space: false
    //                };
    //            }
    //        } else if (this.character.attack0()) {
    //                GALACTIC_STRIKE.player.character.currentAttack = {
    //                    id: 3,
    //                    space: true
    //                };
    //            }
    //    }

    //comprobamos si el jugador sigue en el mundo
    //    if (!this.character.inWorld && this.character.alive) {
    //        this.character.simpleDie();
    //        var output = {
    //            id: -1,
    //            target: this.id,
    //            damage: 100
    //        };
    //        socket.emit('hit', output);
    //    }
}

Player.prototype.characterSetup = function ()
{

    game.camera.follow(this.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

    this.attack0Key = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.attack0Key.onDown.add(function ()
    {
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
    }, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);

    this.attack1Key = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.attack1Key.onDown.add(function ()
    {
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
    }, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);

    this.attack2Key = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.attack2Key.onDown.add(function ()
    {
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
    }, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);

    this.attack3Key = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.attack3Key.onDown.add(function ()
    {
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
    }, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);


    for (var i = 0; i < GALACTIC_STRIKE.room.map.planets.length; i++)
    {
        //                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
        this.character.body.setBodyPresolveCallback(GALACTIC_STRIKE.room.map.planets[i], touchPlanetCallback, this);
        this.character.wheels[0].body.setBodyPresolveCallback(GALACTIC_STRIKE.room.map.planets[i], touchPlanetCallback, this);
        this.character.wheels[1].body.setBodyPresolveCallback(GALACTIC_STRIKE.room.map.planets[i], touchPlanetCallback, this);

    }

    //            character.body.setColissionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.PLAYER);
}

Player.prototype.toString = function ()
{
    return this.nickname;
}
