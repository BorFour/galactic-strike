
var networkDebug = true;


clientSetupMenu = function(){

    socket.on('ID', function (input) {

        GALACTIC_STRIKE.player.id = input.id;
        GALACTIC_STRIKE.player.nickname += input.id;
//        GALACTIC_STRIKE.player.character = charactersList[GALACTIC_STRIKE.player.id];
//        myCharacterSetup(GALACTIC_STRIKE.player.character);

    });


    socket.on('userLeft', function (input) {

        console.log('@Client received | userLeft');
        charactersList[input.id].die();
        delete charactersList[input.id];
        if(input.id === GALACTIC_STRIKE.player.id)
        {
            this.state.start('MainMenu');
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

}

/**
 * Set up for the events that can be received from the server
 */

function clientSetup(){

    clientSetupMenu();
    clientSetupRoom();
    clientSetupGame();

}


