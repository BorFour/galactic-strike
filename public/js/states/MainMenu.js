/**
 * Main menu of the game.
 * @private
 */

GALACTIC_STRIKE.MainMenu = function (game) {};

GALACTIC_STRIKE.MainMenu.prototype = {

    preload: function ()
    {

        var buttonEnter;
        var buttonCreate;

    },
    create: function ()
    {

        GALACTIC_STRIKE.endGame = false;

        // Initialization of the buttons of the menu

        buttonEnter = game.add.button(game.world.centerX - 200, 550, 'buttonEnter', this.joinRoom, this, 0, 0, 0, 0);
        buttonCreate = game.add.button(game.world.centerX + 200, 550, 'buttonCreate', this.createRoom, this, 0, 0, 0, 0);

        buttonCreate.anchor.set(0.5);
        buttonEnter.anchor.set(0.5);

        var controlsText =
            'Controls in planet : move [A D] + stop [S] + turbo [SHIFT] + jump [SPACEBAR] (Hold to use jetpack)\n' +
            'Controls in space : rotate [A D] + thrust [SPACEBAR / W] + reverse [S]\n' +
            'Attacks : [Arrow Keys]\n' +
            'Controls while dead : move camera [W A S D]\n' +
            'Mute : on/off [M] + up [K] + down [J]\n';


        var textBox = game.add.text(game.world.centerX, 330, controlsText,
        {
            font: '25px Arial',
            fill: '#ffffff'
        });
        textBox.anchor.set(0.5);

        var controls = game.add.text(game.world.centerX - textBox.width / 2, 130, 'CONTROLS:',
        {
            font: '45px Arial',
            fill: '#ffffff'
        });

        var textBoxSupport = game.add.text(game.world.centerX, 700, "ONLY SUPPORTED IN GOOGLE CHROME",
        {
            font: '55px Arial',
            fill: '#ffffff'
        });
        textBoxSupport.anchor.set(0.5);

    },
    createRoom: function ()
    {

        // The client emits the 'createRoom' event
        console.log('@Client ->      \t| createRoom');
        socket.emit('createRoom',
        {
            id: GALACTIC_STRIKE.player.id,
            name: GALACTIC_STRIKE.player.nickname,
            timestamp: GALACTIC_STRIKE.serverTimestamp
        });

    },
    joinRoom: function ()
    {

        // The client emits the 'joinRoom' event
        // The client emits the 'joinRoom' event
        console.log('@Client ->      \t| joinRoom');
        socket.emit('joinRoom',
        {
            id: GALACTIC_STRIKE.player.id,
            name: GALACTIC_STRIKE.player.nickname,
            timestamp: GALACTIC_STRIKE.serverTimestamp
        });

    }
};
