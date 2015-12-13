/**
 * Main menu of the game.
 * @private
 */

GALACTIC_STRIKE.MainMenu = function (game) {};

GALACTIC_STRIKE.MainMenu.prototype = {

    preload: function () {

        var buttonEnter;
        var buttonCreate;

    },
    create: function () {

        GALACTIC_STRIKE.endGame = false;

        // Initialization of the buttons of the menu

        buttonEnter = game.add.button(game.world.centerX - 95, 400, 'buttonEnter', this.joinRoom, this, 0, 0, 0, 0);
        buttonCreate = game.add.button(game.world.centerX + 95, 400, 'buttonCreate', this.createRoom, this, 0, 0, 0, 0);

    },
    createRoom: function () {

        // The client emits the 'createRoom' event
        socket.emit('createRoom', {
            id: GALACTIC_STRIKE.player.id,
            name: GALACTIC_STRIKE.player.nickname,
            timestamp: GALACTIC_STRIKE.serverTimestamp
        });

    },
    joinRoom: function () {

        // The client emits the 'joinRoom' event
        socket.emit('joinRoom', {
            id: GALACTIC_STRIKE.player.id,
            name: GALACTIC_STRIKE.player.nickname,
            timestamp: GALACTIC_STRIKE.serverTimestamp
        });

    }
};
