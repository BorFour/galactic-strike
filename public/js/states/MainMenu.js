GALACTIC_STRIKE.MainMenu = function (game) {
};

GALACTIC_STRIKE.MainMenu.prototype = {

	create: function () {
		this.game.stage.backgroundColor = '#ffffff';
	},

	createRoom: function() {
		this.state.start('Game');
	},

    joinRoom: function() {
		this.state.start('Game');
	},

	update: function () {

	}
};
