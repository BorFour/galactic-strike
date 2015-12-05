GALACTIC_STRIKE.Play = function(game) {

};

GALACTIC_STRIKE.Play.prototype = {
    preload: function(){
        game.load.image('starkek', '../assets/estrella_kek.jpg');
    },
	create: function() {

        GALACTIC_STRIKE.room.gameMode = new GameMode(GALACTIC_STRIKE.room, gameModes[GALACTIC_STRIKE.room.gameModeID]);
        GALACTIC_STRIKE.room.gameMode.init();




        GALACTIC_STRIKE.room.gameMode.startRound();

	},
	update: function() {

        if(GALACTIC_STRIKE.room.gameMode.update()) quitGame();

	},
	quitGame: function(pointer) {

        socket.emit('userLeftRoom', {id: socket.id});
		this.state.start('MainMenu');

	},
	render: function() {

	}
};
