/**
 * First state of the game
 * @public
 * @property undefined
 */

GALACTIC_STRIKE.Boot = function (game) {

};

GALACTIC_STRIKE.Boot.prototype = {
    init: function ()
    {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        this.game.orientated = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = this.game.width / 2;
        this.scale.minHeight = this.game.height / 2;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        if (false && this.game.device.desktop)
        {
            console.log("I'm desktop");
            this.scale.maxWidth = this.game.width;
            this.scale.maxHeight = this.game.height;
        }
        else
        {
            console.log("I'm mobile");
            this.scale.maxWidth = this.game.width * 2.5;
            this.scale.maxHeight = this.game.height * 2.5;
            this.scale.forceOrientation(false, true);
            this.scale.updateLayout(true);
        }
    },
    preload: function ()
    {
        game.load.image('progressBar', '../assets/progressBar.png');
    },
    create: function ()
    {
        this.state.start('Loader');
    }
};
