Controller = {};

Controller.KEYBOARD = 0;
Controller.GAMEPAD = 1;
Controller.VIRTUAL = 2;


// TODO

Controller = function (input)
{

    this.KEYBOARD = 0;
    this.GAMEPAD = 1;
    this.VIRTUAL = 2;

    this.pushed = {};
    if (input === this.KEYBOARD)
    {
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rotateLKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.rotateRKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.boostKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.gamepad = false;

    }
    else if (input === this.GAMEPAD)
    {
        game.input.gamepad.start();
        this.gamepad = game.input.gamepad.pad1;
    }
    else if (input === this.VIRTUAL)
    {
        this.virtualButtons = [];
        this.pushed = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            boost: false
        }
        this.buttonjump = game.add.button(game.camera.x + 1450, game.camera.y + 750, 'buttonjump', null, this); //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
        this.virtualButtons.push(this.buttonjump);
        this.buttonjump.fixedToCamera = true; //our buttons should stay on the same place
        this.buttonjump.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.jump = true;
        }, this);
        this.buttonjump.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.jump = false;
        }, this);
        this.buttonjump.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.jump = true;
        }, this);
        this.buttonjump.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.jump = false;
        }, this);


        this.buttonboost = game.add.button(game.camera.x + 1300, game.camera.y + 750, 'buttonfire', null, this, 0, 1, 0, 1);
        this.virtualButtons.push(this.buttonboost);
        this.buttonboost.fixedToCamera = true;
        this.buttonboost.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.boost = true;
        }, this);
        this.buttonboost.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.boost = false;
        }, this);
        this.buttonboost.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.boost = true;
        }, this);
        this.buttonboost.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.boost = false;
        }, this);

        this.buttonleft = game.add.button(game.camera.x + 10, game.camera.y + 742, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        this.virtualButtons.push(this.buttonleft);
        this.buttonleft.fixedToCamera = true;
        this.buttonleft.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = true;
        }, this);
        this.buttonleft.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = false;
        }, this);
        this.buttonleft.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = true;
        }, this);
        this.buttonleft.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = false;
        }, this);

        this.buttonbottomleft = game.add.button(game.camera.x + 42, game.camera.y + 776, 'buttondiagonal', null, this, 6, 4, 6, 4);
        this.virtualButtons.push(this.buttonbottomleft);
        this.buttonbottomleft.fixedToCamera = true;
        this.buttonbottomleft.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = true;
            GALACTIC_STRIKE.player.controller.pushed.down = true;
        }, this);
        this.buttonbottomleft.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = false;
            GALACTIC_STRIKE.player.controller.pushed.down = false;
        }, this);
        this.buttonbottomleft.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = true;
            GALACTIC_STRIKE.player.controller.pushed.down = true;
        }, this);
        this.buttonbottomleft.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.left = false;
            GALACTIC_STRIKE.player.controller.pushed.down = false;
        }, this);

        this.buttonright = game.add.button(game.camera.x + 170, game.camera.y + 742, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        this.virtualButtons.push(this.buttonright);
        this.buttonright.fixedToCamera = true;
        this.buttonright.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = true;
        }, this);
        this.buttonright.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = false;
        }, this);
        this.buttonright.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = true;
        }, this);
        this.buttonright.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = false;
        }, this);

        this.buttonbottomright = game.add.button(game.camera.x + 170, game.camera.y + 676, 'buttondiagonal', null, this, 7, 5, 7, 5);
        this.virtualButtons.push(this.buttonbottomright);
        this.buttonbottomright.fixedToCamera = true;
        this.buttonbottomright.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = true;
            GALACTIC_STRIKE.player.controller.pushed.down = true;
        }, this);
        this.buttonbottomright.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = false;
            GALACTIC_STRIKE.player.controller.pushed.down = false;
        }, this);
        this.buttonbottomright.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = true;
            GALACTIC_STRIKE.player.controller.pushed.down = true;
        }, this);
        this.buttonbottomright.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.right = false;
            GALACTIC_STRIKE.player.controller.pushed.down = false;
        }, this);

        this.buttondown = game.add.button(game.camera.x + 106, game.camera.y + 816, 'buttonvertical', null, this, 0, 1, 0, 1);
        this.virtualButtons.push(this.buttondown);
        this.buttondown.fixedToCamera = true;
        this.buttondown.events.onInputOver.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.down = true;
        }, this);
        this.buttondown.events.onInputOut.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.down = false;
        }, this);
        this.buttondown.events.onInputDown.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.down = true;
        }, this);
        this.buttondown.events.onInputUp.add(function ()
        {
            GALACTIC_STRIKE.player.controller.pushed.down = false;
        }, this);

    }

    this.mode = input;

};

Controller.prototype.leftDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        return this.gamepad.axis(4) === -1;;
    }
    else if (this.mode === this.VIRTUAL)
    {
        return this.pushed.left;
    }
    else
    {
        return this.leftKey.isDown;
    }

}

Controller.prototype.rightDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        return this.gamepad.axis(4) === 1;
    }
    else if (this.mode === this.VIRTUAL)
    {
        return this.pushed.right;
    }
    else
    {
        return this.rightKey.isDown;
    }

}

Controller.prototype.upDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        return this.gamepad.axis(5) === -1;
    }
    else if (this.mode === this.VIRTUAL)
    {
        return this.pushed.up;
    }
    else
    {
        return this.upKey.isDown;
    }

}

Controller.prototype.downDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        return this.gamepad.axis(5) === 1;
    }
    else if (this.mode === this.VIRTUAL)
    {
        return this.pushed.down;
    }
    else
    {
        return this.downKey.isDown;
    }

}

Controller.prototype.rotateLDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        //
    }
    else if (this.mode === this.VIRTUAL)
    {

    }
    else
    {
        return this.rotateLKey.isDown;
    }

}

Controller.prototype.rotateRDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        //
    }
    else if (this.mode === this.VIRTUAL)
    {

    }
    else
    {
        return this.rotateRKey.isDown;
    }

}

Controller.prototype.jumpDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        return this.gamepad.isDown(Phaser.Gamepad.XBOX360_A);
    }
    else if (this.mode === this.VIRTUAL)
    {
        return this.pushed.jump;
    }
    else
    {
        return this.jumpKey.isDown;
    }

}

Controller.prototype.boostDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        return this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
    }
    else if (this.mode === this.VIRTUAL)
    {
        return this.pushed.boost;
    }
    else
    {
        return this.boostKey.isDown;
    }

}

Controller.prototype.attackDown = function (player)
{

    if (this.mode === this.GAMEPAD)
    {
        //
    }
    else if (this.mode === this.VIRTUAL)
    {

    }
    else
    {
        return this.attackKey.isDown;
    }

}
