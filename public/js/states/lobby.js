

// El cliente está en el lobby
// Por tanto, ya debería tener asignado un host y un servidor

GALACTIC_STRIKE.Lobby = function() {

};

GALACTIC_STRIKE.Lobby.prototype = {
	create: function() {
        this.room = new Room (); // ¿?
	},
	update: function() {

	},
	quitGame: function(pointer) {
		this.state.start('MainMenu');
	},
	render: function() {

	}
};
