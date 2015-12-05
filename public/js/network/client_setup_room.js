
clientSetupRoom = function (){


    socket.on('roomCreated', function (input) {

        console.log('@Client received | roomCreated');

        GALACTIC_STRIKE.room = new Room("Default room name", GALACTIC_STRIKE.player, 8);
        GALACTIC_STRIKE.room.addTeam("Red Team");
        GALACTIC_STRIKE.room.addTeam("Blue Team");

        console.log(GALACTIC_STRIKE.room);
        game.state.start('Lobby');

    });


    socket.on('joinRoom', function (input) {

        var style = { font: "20px Arial", fill: "#ffffff", align: "center" };

        console.log('@Client received | joinRoom');
        if(input.id === GALACTIC_STRIKE.player.id)
        {
            GALACTIC_STRIKE.room = new Room("Default room name", GALACTIC_STRIKE.player, 8);
            GALACTIC_STRIKE.room.addTeam("Red Team");
            GALACTIC_STRIKE.room.addTeam("Blue Team");
            for (var k in input.players){
                GALACTIC_STRIKE.room.addPlayer(k, new Player(input.players[k]));
            }
            game.state.start('Lobby');

        }
        else
        {
            var p = GALACTIC_STRIKE.room.addPlayer(input.id, new Player(input.name));
        }

    });

    socket.on('changeTeam', function (input) {

        if(GALACTIC_STRIKE.player.id === input.id) return;

        GALACTIC_STRIKE.room.players[input.id].joinTeam(GALACTIC_STRIKE.room.teams[input.team_id]);
        console.log(GALACTIC_STRIKE.room.teams[input.team_id]);

    });


 }
