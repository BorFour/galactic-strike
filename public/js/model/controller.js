Controller = {};

Controller.KEYBOARD = 0;
Controller.GAMEPAD = 1;

// TODO

Controller = function (input)
{

    this.KEYBOARD = 0;
    this.GAMEPAD = 1;

    if (input === Controller.KEYBOARD)
    {
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rotateLKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.rotateRKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.gamepad = false;
    }
    else
    {
        this.gamepad = game.input.gamepad.pad1;
    }

};

Controller.prototype.leftDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.leftKey.isDown;
    }

}

Controller.prototype.rightDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.rightKey.isDown;
    }

}

Controller.prototype.upDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.upKey.isDown;
    }

}

Controller.prototype.downDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.downKey.isDown;
    }

}

Controller.prototype.rotateLDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.rotateLKey.isDown;
    }

}

Controller.prototype.rotateRDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.rotateRKey.isDown;
    }

}

Controller.prototype.jumpDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.jumpKey.isDown;
    }

}

Controller.prototype.attackDown = function (player)
{

    if (this.gamepad)
    {
        //
    }
    else
    {
        return this.attackKey.isDown;
    }

}
