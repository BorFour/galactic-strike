

// El cliente está en el lobby
// Por tanto, ya debería tener asignado un host y un servidor
var bmpText;
GALACTIC_STRIKE.Lobby = function() {

};

GALACTIC_STRIKE.Lobby.prototype = {
    preload: function () {
        game.load.image('starBackground', '../assets/starBackground.jpg');
        game.load.image('buttonEnter', '../assets/buttons/enterRoom.png');
        game.load.image('buttonCreate', '../assets/buttons/createRoom.png');
        game.load.image('redTeam', '../assets/lobby/red_team.jpg');
        game.load.image('blueTeam', '../assets/lobby/blue_team.jpg');
        var buttonBegin;
        var buttonDisband;
    },
	create: function() {

        GALACTIC_STRIKE.room = new Room("Default", GALACTIC_STRIKE.player, 8, "localhost", 3000);
        GALACTIC_STRIKE.room.addTeam("Red Team");
        GALACTIC_STRIKE.room.addTeam("Blue Team");

        console.log(GALACTIC_STRIKE.room);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        bmpText = game.add.text(game.world.centerX - 100, game.world.centerY, "Esto es el lobby", style);



        // Aquí habría que crear todos los elementos gráficos del lobby
        buttonBegin = game.add.button(game.world.centerX - 195, 400, 'buttonEnter', this.beginMatch, this, 0, 0, 0, 0);
        buttonDisband = game.add.button(game.world.centerX + 195, 400, 'buttonCreate', this.disbandRoom, this, 0, 0, 0, 0);

        buttonRed = game.add.button(game.world.centerX - 400, game.world.centerY - 250, 'redTeam', function(){GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[0])}, this, 0, 0, 0, 0);
        buttonRed.scale.set(0.3);
        buttonBlue = game.add.button(game.world.centerX + 200, game.world.centerY - 250, 'blueTeam', function(){GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[1])}, this, 0, 0, 0, 0);
        buttonBlue.scale.set(0.3);

	},
	update: function() {
        if(GALACTIC_STRIKE.player.team){
            bmpText.text = GALACTIC_STRIKE.player.team.name
        }
	},
	beginMatch: function(pointer) {
		this.state.start('PlayGame');
	},
    disbandRoom: function(pointer) {
        // El host decide eliminar la sala
		this.state.start('Play');
	},
	render: function() {
	}

};
