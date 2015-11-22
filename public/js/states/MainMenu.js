GALACTIC_STRIKE.MainMenu = function(game) {
};

GALACTIC_STRIKE.MainMenu.prototype = {

    preload: function () {
        game.load.image('starBackground', '../../assets/starBackground.jpg');
        game.load.image('buttonEnter', '../../assets/buttons/enterRoom.png');
        game.load.image('buttonCreate', '../../assets/buttons/createRoom.png');
        var buttonEnter;
        var buttonCreate;
    },
    create: function () {
       buttonEnter = game.add.button(game.world.centerX - 95, 400, 'buttonEnter', this.joinRoom, this, 0, 0, 0, 0);
       buttonCreate = game.add.button(game.world.centerX + 95, 400, 'buttonCreate')//, createRoom, 2, 1, 0);
   // buttonCreate.onInputUp.add(up, this);
  //  buttonEnter.onInputUp.add(up, this);
    },
    createRoom: function() {
        this.state.start('Lobby');
    },
    joinRoom: function() {
        this.state.start('Lobby');
    }
};
