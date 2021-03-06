var networkDebug = true;


clientSetupMenu = function ()
{

    socket.on('ID', function (input)
    {

        GALACTIC_STRIKE.player.id = input.id;
        GALACTIC_STRIKE.player.nickname += input.id;
        GALACTIC_STRIKE.serverTimestamp = input.timestamp;
        //        GALACTIC_STRIKE.player.character = GALACTIC_STRIKE.room.characters[GALACTIC_STRIKE.player.id];
        //        myCharacterSetup(GALACTIC_STRIKE.player.character);

    });


    socket.on('userLeft', function (input)
    {

        console.log('@Client received | userLeft');


        if (GALACTIC_STRIKE.room && GALACTIC_STRIKE.room.characters[input.id] && GALACTIC_STRIKE.room.characters[input.id].alive)
        {
            GALACTIC_STRIKE.room.characters[input.id].die();

            delete GALACTIC_STRIKE.room.characters[input.id];
        }

        if (GALACTIC_STRIKE.room && GALACTIC_STRIKE.room.players[input.id])
        {

            GALACTIC_STRIKE.room.unasigned.removePlayer(GALACTIC_STRIKE.room.players[input.id]);

            for (var t in GALACTIC_STRIKE.room.teams)
            {
                console.log("T :" + t);
                GALACTIC_STRIKE.room.teams[t].removePlayer(GALACTIC_STRIKE.room.players[input.id]);
            }

            GALACTIC_STRIKE.room.players[input.id] = null;
            delete GALACTIC_STRIKE.room.players[input.id];
        }

        if (GALACTIC_STRIKE.room && GALACTIC_STRIKE.room.gameMode && !GALACTIC_STRIKE.room.gameOver)
        {
            GALACTIC_STRIKE.room.gameMode.update();
        }

    });


    socket.on('roomIngame', function (input)
    {

        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        if (!this.menuText)
        {
            this.menuText = game.add.text(game.world.centerX, game.world.centerY, "Partida en curso", style);
            this.menuText.anchor.set(0.5);
        }

    });

    socket.on('obsoletClient', function (input)
    {

        location.reload();

    });

}

/**
 * Set up for the events that can be received from the server
 */

function clientSetup()
{

    clientSetupMenu();
    clientSetupRoom();
    clientSetupGame();
    clientSetupItems();

}
