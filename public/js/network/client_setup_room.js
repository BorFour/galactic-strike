
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

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        console.log('@Client received | userJoinedRoom');
        if(input.id === GALACTIC_STRIKE.player.id)
        {
            GALACTIC_STRIKE.room = new Room("Default room name", input.id, 8);
            GALACTIC_STRIKE.room.addTeam("Red Team");
            GALACTIC_STRIKE.room.addTeam("Blue Team");
            game.state.start('Lobby');
            GALACTIC_STRIKE.player.text = game.add.text(game.world.centerX, game.world.centerY - 100 + GALACTIC_STRIKE.room.unasigned.length * 30, GALACTIC_STRIKE.player.nickname, style);
            GALACTIC_STRIKE.player.text.anchor.set(0.5);
        }
        else
        {

            var p = GALACTIC_STRIKE.room.addPlayer(input.id, new Player(input.name));
            p.text = game.add.text(game.world.centerX, 30 + GALACTIC_STRIKE.room.unasigned.length * 30, p.nickname, style);
//            p.text.anchor.set(0.5);
        }

    });

 }
