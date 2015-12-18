/**
 * Room lobby
 * Players can choose a team for the match, and the lobby's host may begin the game when every player has a team assigned
 * @private
 */

GALACTIC_STRIKE.Lobby = function () {

};

GALACTIC_STRIKE.Lobby.prototype = {
    preload: function ()
    {
        var buttonBegin;
        var textStage;
        var buttonStage;
    },
    create: function ()
    {


        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var style2 = {
            font: "bold 16px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var style3 = {
            font: "bold 16px Arial",
            fill: "#000",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        this.bmpText = game.add.text(game.world.centerX - 250, 100, "Esto es el lobby", style);
        this.bmpText.anchor.set(0.5, 0.1);


        textStage = game.add.text(game.world.centerX - 250, game.world.centerY + 100, Object.keys(stages)[(GALACTIC_STRIKE.room.currentStage ? GALACTIC_STRIKE.room.currentStage : 0)], style);
        textStage.anchor.set(0.5);

        // Only the lobby's host can start the game

        if (GALACTIC_STRIKE.player.id === GALACTIC_STRIKE.room.host)
        {
            buttonBegin = game.add.button(game.world.centerX - 250, game.world.centerY + 250, 'buttonEnter', this.beginMatch, this, 0, 0, 0, 0);
            buttonBegin.anchor.set(0.5);
            GALACTIC_STRIKE.room.currentStage = 0;
            buttonStage = game.add.button(game.world.centerX - 250, game.world.centerY, 'changeMap', this.nextStage, this);
            buttonStage.anchor.set(0.5, 0.4);
        }

        // Everytime a user clicks the red button, the client requests to join the red team
        buttonRed = game.add.button(game.world.centerX - 690, game.world.centerY - 300, 'redTeam', function ()
        {
            console.log('@Client ->      \t| changeTeam');
            socket.emit('changeTeam',
            {
                id: GALACTIC_STRIKE.player.id,
                team: 0
            });

        }, this, 0, 0, 0, 0);
        buttonRed.scale.set(0.3);

        // Everytime a user clicks the blue button, the client requests to join the blue team
        buttonBlue = game.add.button(game.world.centerX - 50, game.world.centerY - 300, 'blueTeam', function ()
        {
            console.log('@Client ->      \t| changeTeam');
            socket.emit('changeTeam',
            {
                id: GALACTIC_STRIKE.player.id,
                team: 1
            });

        }, this, 0, 0, 0, 0);
        buttonBlue.scale.set(0.3);

        // These are the slots where the incoming players will be put
        GALACTIC_STRIKE.room.textRed = [];
        GALACTIC_STRIKE.room.textBlue = [];
        GALACTIC_STRIKE.room.textUnasigned = [];

        GALACTIC_STRIKE.room.chatText = [];

        // Initialization of the textBox for the slots (max 4 players per team)

        for (var i = 0; i < 4; i++)
        {
            GALACTIC_STRIKE.room.textRed[i] = game.add.text(game.world.centerX - 600, game.world.centerY + i * 50, "[     ]", style);
            GALACTIC_STRIKE.room.textRed[i].anchor.set(0.5);

        }

        for (var i = 0; i < 4; i++)
        {
            GALACTIC_STRIKE.room.textBlue[i] = game.add.text(game.world.centerX + 50, game.world.centerY + i * 50, "[     ]", style);
            GALACTIC_STRIKE.room.textBlue[i].anchor.set(0.5);
        }


        for (var i = 0; i < 4; i++)
        {
            GALACTIC_STRIKE.room.textUnasigned[i] = game.add.text(game.world.centerX - 250, game.world.centerY - 250 + i * 50, "[     ]", style);
            GALACTIC_STRIKE.room.textUnasigned[i].anchor.set(0.5);
        }


        for (var i = 0; i < 8; i++)
        {
            GALACTIC_STRIKE.room.chatText[i] = game.add.text(game.world.centerX + 275, game.world.centerY - 320 + i * 50, "____", style2);
        }

        GALACTIC_STRIKE.room.textBox = new TextField(game.world.centerX - 550, game.world.centerY + 8 * 50, 40, 'textBox'); //'textBox');

    },
    update: function ()
    {

        // Shows the player's team

        if (GALACTIC_STRIKE.player.team) this.bmpText.text = GALACTIC_STRIKE.player.team.name;

        // Updates the previously initialized slots with the team's players

        for (var i = 0; i < 4; i++)
        {
            GALACTIC_STRIKE.room.textRed[i].text = (GALACTIC_STRIKE.room.teams[0].players[i] ? (GALACTIC_STRIKE.room.teams[0].players[i] === GALACTIC_STRIKE.player ? '*' : '') + GALACTIC_STRIKE.room.teams[0].players[i].nickname : "[     ]");
        }

        for (var i = 0; i < 4; i++)
        {
            GALACTIC_STRIKE.room.textBlue[i].text = (GALACTIC_STRIKE.room.teams[1].players[i] ? (GALACTIC_STRIKE.room.teams[1].players[i] === GALACTIC_STRIKE.player ? '*' : '') + GALACTIC_STRIKE.room.teams[1].players[i].nickname : "[     ]");
        }

        for (var i = 0; i < 4; i++)
        {
            GALACTIC_STRIKE.room.textUnasigned[i].text = (GALACTIC_STRIKE.room.unasigned.players[i] ? (GALACTIC_STRIKE.room.unasigned.players[i] === GALACTIC_STRIKE.player ? '*' : '') + GALACTIC_STRIKE.room.unasigned.players[i].nickname : "[     ]");
        }


    },
    beginMatch: function ()
    {

        GALACTIC_STRIKE.kickedPlayers = 0;
        GALACTIC_STRIKE.playersToKick = GALACTIC_STRIKE.room.unasigned.players.length;

        for (var p in GALACTIC_STRIKE.room.unasigned.players)
        {
            console.log('@Client ->      \t| kickPlayer');
            socket.emit('kickPlayer',
            {
                id: GALACTIC_STRIKE.room.unasigned.players[p].id
            });
        }

        if (GALACTIC_STRIKE.room.unasigned.players.length == 0)
        {
            console.log('@Client ->      \t| beginMatch');
            socket.emit('beginMatch',
            {
                id: GALACTIC_STRIKE.player.id,
                stage: Object.keys(stages)[GALACTIC_STRIKE.room.currentStage]
            });
        }

    },
    nextStage: function ()
    {

        GALACTIC_STRIKE.room.currentStage = (GALACTIC_STRIKE.room.currentStage + 1) % (Object.keys(stages).length);
        textStage.text = Object.keys(stages)[GALACTIC_STRIKE.room.currentStage];
        console.log('@Client ->      \t| changeStage');
        socket.emit('changeStage',
        {
            id: GALACTIC_STRIKE.player.id,
            stage: GALACTIC_STRIKE.room.currentStage
        });

    }
};
