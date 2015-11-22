

// El cliente está en el lobby
// Por tanto, ya debería tener asignado un host y un servidor

GALACTIC_STRIKE.Lobby = function() {

};

GALACTIC_STRIKE.Lobby.prototype = {
    preload: function () {
        game.load.image('starBackground', '../../assets/starBackground.jpg');
        game.load.image('buttonEnter', '../../assets/buttons/enterRoom.png');
        game.load.image('buttonCreate', '../../assets/buttons/createRoom.png');
        var buttonBegin;
        var buttonDisband;
    },
	create: function() {
        //this.room = new Room (); // ¿?

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        var bmpText = game.add.text(game.world.centerX, game.world.centerY, "Esto es el lobby", style);

        buttonCreate
        // Aquí habría que crear todos los elementos gráficos del lobby
        buttonBegin = game.add.button(game.world.centerX - 195, 400, 'buttonEnter', this.beginMatch, this, 0, 0, 0, 0);
        buttonDisband = game.add.button(game.world.centerX + 195, 400, 'buttonCreate', this.disbandRoom, this, 0, 0, 0, 0);

	},
	update: function() {

	},
	beginMatch: function(pointer) {
		this.state.start('Play');
	},
    disbandRoom: function(pointer) {
        // El host decide eliminar la sala
		this.state.start('MainMenu');
	},
	render: function() {

	}

};
