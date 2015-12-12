
var networkDebug = true;


clientSetupMenu = function(){

    socket.on('ID', function (input) {

        GALACTIC_STRIKE.player.id = input.id;
        GALACTIC_STRIKE.player.nickname += input.id;
        GALACTIC_STRIKE.serverTimestamp = input.timestamp;
//        GALACTIC_STRIKE.player.character = GALACTIC_STRIKE.room.characters[GALACTIC_STRIKE.player.id];
//        myCharacterSetup(GALACTIC_STRIKE.player.character);

    });


    socket.on('userLeft', function (input) {

        console.log('@Client received | userLeft');
        if(GALACTIC_STRIKE.room.characters[input.id] && GALACTIC_STRIKE.room.characters[input.id].alive)
        {
            GALACTIC_STRIKE.room.characters[input.id].die();
            if(GALACTIC_STRIKE.room && GALACTIC_STRIKE.room.gameMode) { GALACTIC_STRIKE.room.gameMode.update(); }
            delete GALACTIC_STRIKE.room.characters[input.id];
        }

    });


    socket.on('roomIngame', function (input) {

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        if(!this.menuText)
        {
            this.menuText = game.add.text(game.world.centerX, game.world.centerY, "Partida en curso", style);
            this.menuText.anchor.set(0.5);
        }

    });

    socket.on('obsoletClient', function (input) {

        window.close();

    });

}

/**
 * Set up for the events that can be received from the server
 */

function clientSetup(){

    clientSetupMenu();
    clientSetupRoom();
    clientSetupGame();

}


