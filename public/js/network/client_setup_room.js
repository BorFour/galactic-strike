
clientSetupRoom = function (){


    socket.on('roomCreated', function (input) {

        console.log('@Client received | roomCreated');

        GALACTIC_STRIKE.room = new Room("Default room name", GALACTIC_STRIKE.player, 8);
        GALACTIC_STRIKE.room.addTeam("Red Team");
        GALACTIC_STRIKE.room.addTeam("Blue Team");

        console.log(GALACTIC_STRIKE.room);
        game.state.start('Lobby');

    });


    socket.on('userJoinedRoom', function (input) {

        console.log('@Client received | userJoinedRoom');
        if(input.id === GALACTIC_STRIKE.player.id)
        {
            GALACTIC_STRIKE.room = new Room("Default room name", input.id, 8);
            GALACTIC_STRIKE.room.addTeam("Red Team");
            GALACTIC_STRIKE.room.addTeam("Blue Team");
            game.state.start('Lobby');
        }
        else
        {
            GALACTIC_STRIKE.room.addPlayer(input.id, new Player(input.name));
        }

    });

 }
