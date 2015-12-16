/**
 * Room lobby
 * Players can choose a team for the match, and the lobby's host may begin the game when every player has a team assigned
 * @private
 */

var bmpText;
GALACTIC_STRIKE.Lobby = function () {

};

GALACTIC_STRIKE.Lobby.prototype = {
    preload: function () {
        var buttonBegin;
        var textStage;
        var buttonStage;
    },
    create: function () {


        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        bmpText = game.add.text(game.world.centerX, game.world.centerY, "Esto es el lobby", style);
        bmpText.anchor.set(0.5);

       buttonStage = game.add.button(game.world.centerX, game.world.centerY, 'changeMap', this.nextStage, this);
        textStage = game.add.text(game.world.centerX, game.world.centerY + 100, Object.keys(stages)[(GALACTIC_STRIKE.room.currentStage ? GALACTIC_STRIKE.room.currentStage : 0)], style);
        buttonStage.anchor.set(0.5, 0.4);
        textStage.anchor.set(0.5);

        // Only the lobby's host can start the game

        if (GALACTIC_STRIKE.player.id === GALACTIC_STRIKE.room.host) {
            buttonBegin = game.add.button(game.world.centerX, game.world.centerY + 250, 'buttonEnter', this.beginMatch, this, 0, 0, 0, 0);
            buttonBegin.anchor.set(0.5);
            GALACTIC_STRIKE.room.currentStage = 0;
            //textStage.inputEnabled = true;
            //textStage.events.onInputDown.add(this.nextStage, this);
        }

        // Everytime a user clicks the red button, the client requests to join the red team


        buttonRed = game.add.button(game.world.centerX - 440, game.world.centerY - 300, 'redTeam', function () {

            socket.emit('changeTeam', {
                id: GALACTIC_STRIKE.player.id,
                team: 0
            });

        }, this, 0, 0, 0, 0);
        buttonRed.scale.set(0.3);

        // Everytime a user clicks the blue button, the client requests to join the blue team

        buttonBlue = game.add.button(game.world.centerX + 200, game.world.centerY - 300, 'blueTeam', function () {

            socket.emit('changeTeam', {
                id: GALACTIC_STRIKE.player.id,
                team: 1
            });

        }, this, 0, 0, 0, 0);
        buttonBlue.scale.set(0.3);

        // These are the slots where the incoming players will be put

        GALACTIC_STRIKE.room.textRed = [];
        GALACTIC_STRIKE.room.textBlue = [];
        GALACTIC_STRIKE.room.textUnasigned = [];

        // Initialization of the textBox for the slots (max 4 players per team)

        for (var i = 0; i < 4; i++) {
            GALACTIC_STRIKE.room.textRed[i] = game.add.text(game.world.centerX - 350, game.world.centerY + i * 50, "[     ]", style);
            GALACTIC_STRIKE.room.textRed[i].anchor.set(0.5);

        }

        for (var i = 0; i < 4; i++) {
            GALACTIC_STRIKE.room.textBlue[i] = game.add.text(game.world.centerX + 300, game.world.centerY + i * 50, "[     ]", style);
            GALACTIC_STRIKE.room.textBlue[i].anchor.set(0.5);
        }


        for (var i = 0; i < 4; i++) {
            GALACTIC_STRIKE.room.textUnasigned[i] = game.add.text(game.world.centerX, game.world.centerY - 250 + i * 50, "[     ]", style);
            GALACTIC_STRIKE.room.textUnasigned[i].anchor.set(0.5);
        }

    },
    update: function () {

        // Shows the player's team

        if (GALACTIC_STRIKE.player.team) bmpText.text = GALACTIC_STRIKE.player.team.name;

        // Updates the previously initialized slots with the team's players

        for (var i = 0; i < 4; i++) {
            GALACTIC_STRIKE.room.textRed[i].text = (GALACTIC_STRIKE.room.teams[0].players[i] ? (GALACTIC_STRIKE.room.teams[0].players[i] === GALACTIC_STRIKE.player ? '*' : '') + GALACTIC_STRIKE.room.teams[0].players[i].nickname : "[     ]");
        }

        for (var i = 0; i < 4; i++) {
            GALACTIC_STRIKE.room.textBlue[i].text = (GALACTIC_STRIKE.room.teams[1].players[i] ? (GALACTIC_STRIKE.room.teams[1].players[i] === GALACTIC_STRIKE.player ? '*' : '') + GALACTIC_STRIKE.room.teams[1].players[i].nickname : "[     ]");
        }

        for (var i = 0; i < 4; i++) {
            GALACTIC_STRIKE.room.textUnasigned[i].text = (GALACTIC_STRIKE.room.unasigned.players[i] ? (GALACTIC_STRIKE.room.unasigned.players[i] === GALACTIC_STRIKE.player ? '*' : '') + GALACTIC_STRIKE.room.unasigned.players[i].nickname : "[     ]");
        }


    },
    beginMatch: function (pointer) {

        // Begins the match if every player has a team assigned

//        if (GALACTIC_STRIKE.room.unasigned.players.length === 0
            /*&& GALACTIC_STRIKE.room.teams[0].players.length > 0
            && GALACTIC_STRIKE.room.teams[1].players.length > 0*/
//        )
        GALACTIC_STRIKE.kickedPlayers = 0;
        GALACTIC_STRIKE.playersToKick = GALACTIC_STRIKE.room.unasigned.players.length;
        for(var p in GALACTIC_STRIKE.room.unasigned.players) {
            socket.emit('kickPlayer', {
                id: GALACTIC_STRIKE.room.unasigned.players[p].id
            });
        }

        if (GALACTIC_STRIKE.kickedPlayers < GALACTIC_STRIKE.playersToKick) {
            socket.emit('beginMatch', {
                id: GALACTIC_STRIKE.player.id,
                stage: Object.keys(stages)[GALACTIC_STRIKE.room.currentStage]
            });
        }
//        else console.log(GALACTIC_STRIKE.room.unasigned);
    },
    nextStage: function () {


        GALACTIC_STRIKE.room.currentStage = (GALACTIC_STRIKE.room.currentStage + 1) % (Object.keys(stages).length);
        textStage.text = Object.keys(stages)[GALACTIC_STRIKE.room.currentStage];
        socket.emit('changeStage', {
            id: GALACTIC_STRIKE.player.id,
            stage: GALACTIC_STRIKE.room.currentStage
        });

    },
    render: function () {

    }

};
