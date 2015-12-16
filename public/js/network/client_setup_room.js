
clientSetupRoom = function () {


    socket.on('roomCreated', function (input) {

        console.log('@Client received | roomCreated');

        GALACTIC_STRIKE.room = new Room("Default room name", GALACTIC_STRIKE.player.id, 8);
        GALACTIC_STRIKE.room.addTeam("Red Team");
        GALACTIC_STRIKE.room.addTeam("Blue Team");
        GALACTIC_STRIKE.room.addPlayer(GALACTIC_STRIKE.player.id, GALACTIC_STRIKE.player);
        GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.unasigned);

        console.log(GALACTIC_STRIKE.room);
        game.state.start('Lobby');

    });

    socket.on('joinRoom', function (input) {

        var style = {font: "20px Arial", fill: "#ffffff", align: "center"};

        console.log('@Client received | joinRoom');
        if (input.id === GALACTIC_STRIKE.player.id)
        {
            GALACTIC_STRIKE.room = new Room("Default room name", input.host, 8);
            GALACTIC_STRIKE.room.addTeam("Red Team", GALACTIC_STRIKE.redTeamAnthem);
            GALACTIC_STRIKE.room.addTeam("Blue Team", GALACTIC_STRIKE.blueTeamAnthem);

            for (var k in input.players)
            {
                if (k == GALACTIC_STRIKE.player.id)
                {
                    GALACTIC_STRIKE.room.addPlayer(k, GALACTIC_STRIKE.player);
                    GALACTIC_STRIKE.player.joinTeam(GALACTIC_STRIKE.room.unasigned);
                }
                else
                {
                    GALACTIC_STRIKE.room.addPlayer(k, new Player(input.players[k].name)).joinTeam(
                            (input.players[k].team === -1 ? GALACTIC_STRIKE.room.unasigned : GALACTIC_STRIKE.room.teams[input.players[k].team]));
                }
            }

            GALACTIC_STRIKE.room.currentStage = input.stage;
            game.state.start('Lobby');

        }
        else
        {
            var p = GALACTIC_STRIKE.room.addPlayer(input.id, new Player(input.name)).joinTeam(
                    GALACTIC_STRIKE.room.unasigned);
        }

    });

    socket.on('changeTeam', function (input) {

//        if(GALACTIC_STRIKE.player.id === input.id) return;
        console.log('@Client received | changeTeam');
        GALACTIC_STRIKE.room.players[input.id].joinTeam(GALACTIC_STRIKE.room.teams[input.team]);
        console.log(GALACTIC_STRIKE.room.teams[input.team]);

    });

   socket.on('changeStage', function (input) {

       if(GALACTIC_STRIKE.player.id === input.id) return;

        console.log('@Client received | changeStage');
        console.log(input.stage)
        GALACTIC_STRIKE.room.currentStage = input.stage;
        textStage.text = Object.keys(stages)[GALACTIC_STRIKE.room.currentStage];

    });



    socket.on('kickPlayer', function (input) {

        console.log('@Client received | kickPlayer');
        console.log(input);
        console.log(GALACTIC_STRIKE.player.id);
        if(input.id == GALACTIC_STRIKE.player.id) {

            console.log('@Client sent | kickedPlayer');
            socket.emit('kickedPlayer', {id : input.id});
            window.close();
        }

    });

    socket.on('kickedPlayer', function (input) {

       if(GALACTIC_STRIKE.room.host === GALACTIC_STRIKE.player.id) {
           GALACTIC_STRIKE.kickedPlayers++;
           if (GALACTIC_STRIKE.kickedPlayers < GALACTIC_STRIKE.playersToKick) {
                socket.emit('beginMatch', {
                    id: GALACTIC_STRIKE.player.id,
                    stage: Object.keys(stages)[GALACTIC_STRIKE.room.currentStage]
                });
            }
       }

    });

    socket.on('lobbyMessage', function (input) {

        console.log('Nuevo mensaje');
        console.log(input);
        for(var i = 0; i < GALACTIC_STRIKE.room.chatText.length - 1; i++) {
            GALACTIC_STRIKE.room.chatText[i].text = GALACTIC_STRIKE.room.chatText[i+1].text;
        }
        GALACTIC_STRIKE.room.chatText[GALACTIC_STRIKE.room.chatText.length - 1].text = "[" + input.nick + "]: " + input.msg;

    });


}
