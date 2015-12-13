
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
            GALACTIC_STRIKE.room.addTeam("Red Team", 'sovietAnthem');
            GALACTIC_STRIKE.room.addTeam("Blue Team", 'sovietAnthem');

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

        GALACTIC_STRIKE.room.players[input.id].joinTeam(GALACTIC_STRIKE.room.teams[input.team]);
        console.log(GALACTIC_STRIKE.room.teams[input.team]);

    });


}
