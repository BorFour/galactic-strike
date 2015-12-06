GALACTIC_STRIKE.MainMenu = function(game) {
};

GALACTIC_STRIKE.MainMenu.prototype = {

    preload: function () {
        game.load.image('starBackground', '../assets/starBackground.jpg');
        game.load.image('buttonEnter', '../assets/buttons/enterRoom.png');
        game.load.image('buttonCreate', '../assets/buttons/createRoom.png');
        game.load.image("exitButton" , "../assets/buttons/boton_exit.png");

        var buttonEnter;
        var buttonCreate;
    },
    create: function () {
        GALACTIC_STRIKE.endGame = false;
       buttonEnter = game.add.button(game.world.centerX - 95, 400, 'buttonEnter', this.joinRoom, this, 0, 0, 0, 0);
       buttonCreate = game.add.button(game.world.centerX + 95, 400, 'buttonCreate', this.createRoom, this, 0, 0, 0, 0);
   // buttonCreate.onInputUp.add(up, this);
  //  buttonEnter.onInputUp.add(up, this);
    },
    createRoom: function() {
//        this.state.start('Lobby');
        socket.emit('createRoom', {id : GALACTIC_STRIKE.player.id, name : GALACTIC_STRIKE.player.nickname});
    },
    joinRoom: function() {
//        this.state.start('Lobby');
        socket.emit('joinRoom', {id : GALACTIC_STRIKE.player.id, name : GALACTIC_STRIKE.player.nickname});
    }
};
