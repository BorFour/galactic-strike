

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


        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        bmpText = game.add.text(game.world.centerX - 125, game.world.centerY, "Esto es el lobby", style);


        if(GALACTIC_STRIKE.player.id === GALACTIC_STRIKE.room.host.id)
        {
            buttonBegin = game.add.button(game.world.centerX - 195, 400, 'buttonEnter', this.beginMatch, this, 0, 0, 0, 0);
        }
//        buttonDisband = game.add.button(game.world.centerX + 195, 400, 'buttonCreate', this.disbandRoom, this, 0, 0, 0, 0);



        buttonRed = game.add.button(game.world.centerX - 440, game.world.centerY - 300, 'redTeam', function(){GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[0])}, this, 0, 0, 0, 0);
        buttonRed.scale.set(0.3);

        buttonBlue = game.add.button(game.world.centerX + 200, game.world.centerY - 300, 'blueTeam', function(){GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[1])}, this, 0, 0, 0, 0);
        buttonBlue.scale.set(0.3);

	},
	update: function() {
        if(GALACTIC_STRIKE.player.team){
            bmpText.text = GALACTIC_STRIKE.player.team.name
        }
	},
	beginMatch: function(pointer) {
        socket.emit('beginMatch', {id : GALACTIC_STRIKE.player.id });
	},
    disbandRoom: function(pointer) {
        // El host decide eliminar la sala
		this.state.start('Play');
	},
	render: function() {
	}

};
