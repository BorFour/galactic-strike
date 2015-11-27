
var networkDebug = true;

function clientSetup(){

    socket.on('IDPlayers', function (input) {

        myId = input.id;
        console.log('@Client received | IDPlayers');
        charactersList = [];
        for (var p in input.players){
            if(input.players[p]) {
                charactersList[p] = new Character(input.players[p].x, input.players[p].y, game, p, 'player');
            }
        }
        myCharacter = charactersList[myId];
        myCharacterSetup();

    });

    socket.on('update', function (input) {

        if(input.id === myId) return;
//        console.log('@Client received | updatePlayers');

        if(charactersList[input.id]){
            charactersList[input.id].body.x = input.x;
            charactersList[input.id].body.y = input.y;
            charactersList[input.id].body.angle = input.angle;
            charactersList[input.id].body.velocity.x = input.velocityX;
            charactersList[input.id].body.velocity.y = input.velocityY;
            charactersList[input.id].orientation = input.orientation;
        }

    });

    socket.on('userJoined', function (input) {

        if(input.id === myId) return;
        console.log('@Client received | userJoined');


        charactersList[input.id] = new Character(input.x, input.y, game, input.id, 'player');

        var logMsg = "";
        for (var c in charactersList){
            logMsg += charactersList[c] + " ";
        }
        console.log("Clients: " + logMsg);

    });

    socket.on('userLeft', function (input) {

        console.log('@Client received | userLeft');
        charactersList[input.id].die();
        delete charactersList[input.id];

    });

}

function myCharacterSetup(){


            myCharacter.jumpSound = game.add.audio('jump');

//            game.spacePhysics.addDynamic(sprite);

            // ESTO PROBABLEMENTE NO DEBA IR AQUÍ
            game.camera.follow(myCharacter);

            var fireKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
            fireKey.onDown.add(function(){myCharacter.fire()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NUMPAD_0);
            var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_3);
            attackKey.onDown.add(function(){myCharacter.attack()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NUMPAD_3);

            for (var i = 0; i < planets.length; i++){
//                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
                myCharacter.body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                myCharacter.wheels[0].body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                myCharacter.wheels[1].body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);

            }
}

