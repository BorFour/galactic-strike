

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
        bmpText = game.add.text(game.world.centerX, game.world.centerY, "Esto es el lobby", style);
        bmpText.anchor.set(0.5);

        GALACTIC_STRIKE.room.addPlayer(GALACTIC_STRIKE.player.id, GALACTIC_STRIKE.player);

        if(GALACTIC_STRIKE.player.id === GALACTIC_STRIKE.room.host.id)
        {
            buttonBegin = game.add.button(game.world.centerX, game.world.centerY + 250, 'buttonEnter', this.beginMatch, this, 0, 0, 0, 0);
            buttonBegin.anchor.set(0.5);
        }
//        buttonDisband = game.add.button(game.world.centerX + 195, 400, 'buttonCreate', this.disbandRoom, this, 0, 0, 0, 0);



        buttonRed = game.add.button(game.world.centerX - 440, game.world.centerY - 300, 'redTeam', function(){

            socket.emit('changeTeam', {id : GALACTIC_STRIKE.player.id, team_id : 0});
            GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[0]);
            bmpText.text = GALACTIC_STRIKE.room.teams[0].name;
        }, this, 0, 0, 0, 0);
        buttonRed.scale.set(0.3);

        buttonBlue = game.add.button(game.world.centerX + 200, game.world.centerY - 300, 'blueTeam',function(){

            socket.emit('changeTeam', {id : GALACTIC_STRIKE.player.id, team_id : 1});
            GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.teams[1]);
            bmpText.text = GALACTIC_STRIKE.room.teams[1].name;

        }, this, 0,  0, 0, 0);
        buttonBlue.scale.set(0.3);

        GALACTIC_STRIKE.room.textRed = [];
        GALACTIC_STRIKE.room.textBlue = [];
        GALACTIC_STRIKE.room.textUnasigned = [];

        for (var i = 0; i < 4; i++){
            GALACTIC_STRIKE.room.textRed[i] = game.add.text(game.world.centerX - 350, game.world.centerY + i * 50, "Slot", style);
            GALACTIC_STRIKE.room.textRed[i].anchor.set(0.5);

        }

        for (var i = 0; i < 4; i++){
            GALACTIC_STRIKE.room.textBlue[i] = game.add.text(game.world.centerX + 300, game.world.centerY + i * 50, "Slot", style);
            GALACTIC_STRIKE.room.textBlue[i].anchor.set(0.5);
        }


        for (var i = 0; i < 4; i++){
            GALACTIC_STRIKE.room.textUnasigned[i] = game.add.text(game.world.centerX, game.world.centerY - 250 + i * 50, "Slot", style);
            GALACTIC_STRIKE.room.textUnasigned[i].anchor.set(0.5);
        }

	},
	update: function() {

        for (var i = 0; i < 4; i++){
            GALACTIC_STRIKE.room.textRed[i].text = (GALACTIC_STRIKE.room.teams[0].players[i] ? GALACTIC_STRIKE.room.teams[0].players[i].nickname : "[     ]");
        }

        for (var i = 0; i < 4; i++){
            GALACTIC_STRIKE.room.textBlue[i].text = (GALACTIC_STRIKE.room.teams[1].players[i] ? GALACTIC_STRIKE.room.teams[1].players[i].nickname : "[     ]");
        }

        for (var i = 0; i < 4; i++){
            GALACTIC_STRIKE.room.textUnasigned[i].text = (GALACTIC_STRIKE.room.unasigned.players[i] ? GALACTIC_STRIKE.room.unasigned.players[i].nickname : "[     ]");
        }


	},
	beginMatch: function(pointer) {
        socket.emit('beginMatch', {id : GALACTIC_STRIKE.player.id });
	},
	render: function() {

	}

};
