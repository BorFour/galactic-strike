
var networkDebug = true;

function clientSetup(player){

    socket.on('IDPlayers', function (data) {

        myId = data.id;
        console.log('@Client received | IDPlayers');

        for (var p in data.players){
            charactersList[p.id] = new Character(data.x, data.y, game, data.id, 'player');
        }

        myCharacter = charactersList[myId];

    });

    socket.on('updatePlayer', function (input) {

        console.log('@Client received | updatePlayers');

        if(charactersList[input.id]){
            charactersList[input.id].x = input.x;
            charactersList[input.id].y = input.y;
            charactersList[input.id].angle = input.angle;
            charactersList[input.id].velocityX = input.body.velocity.x;
            charactersList[input.id].velocityY = input.body.velocity.y;
            charactersList[input.id].orientation = input.orientation;
        }

    });

    socket.on('userJoined', function (input) {

        console.log('@Client received | userJoined');

        charactersList[input.id] = input.player;

    });

    socket.on('userLeft', function (data) {

        console.log('@Client received | userLeft');

        delete charactersList[input.id];
        charactersList[input.id] = null;

    });

}

function characterSetup(ch){

    // TODO

}

