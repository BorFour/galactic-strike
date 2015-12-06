
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


