
var networkDebug = true;

function clientSetup(player){

    socket.on('login', function (data) {
        connected = true;
        myId = data.id;
        console.log("Your client ID is: " + myId);
    });

    socket.on('updatePlayer', function (input) {
        if(myId === input.id){
            return;

            myCharacter.x = input.data.x
            myCharacter.y = input.data.y
            myCharacter.angle = input.data.angle
        }
        else{

            if(charactersList[input.id]){
                console.log("Updating character " + input.id)
                charactersList[input.id].body.x = input.data.x
                charactersList[input.id].body.y = input.data.y
                charactersList[input.id].body.angle = input.data.angle
                charactersList[input.id].body.velocity.x = input.data.velocityX
                charactersList[input.id].body.velocity.y = input.data.velocityY
                charactersList[input.id].orientation = input.data.orientation
            }
            else{
                charactersList[input.id] = new Character(input.data.x, input.data.y, game, input.id, 'player');
            }
        }
    });

    socket.on('firePlayer', function (data){
        if(myId === data.id) return;
        if(charactersList[data.id]){
            console.log('Personaje disparó: ')
            console.log(charactersList[data.id])
            charactersList[data.id].fire();
        }

    });

    socket.on('user joined', function (data) {
        console.log("Client " + data.id + ' joined in (' + data.x + ',' + data.y + ')') ;

        if(!charactersList[data.id]) charactersList[data.id] = new Character(data.x, data.y, game, data.id, 'player');

        if(data.id === myId){

            myCharacter = charactersList[data.id]
            myCharacter.jumpSound = game.add.audio('jump');
            console.log("He creado a mi personaje")

//            game.spacePhysics.addDynamic(sprite);

            // ESTO PROBABLEMENTE NO DEBA IR AQUÍ
            game.camera.follow(myCharacter);

            var fireKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
            fireKey.onDown.add(function(){myCharacter.fire()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NUMPAD_0);

            for (var i = 0; i < planets.length; i++){
//                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
                myCharacter.body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                myCharacter.wheelBodies[0].setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                myCharacter.wheelBodies[1].setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
            }
        }

        console.log("Clients: ")
        for (var c in charactersList){
            console.log(charactersList[c])
        }

    });

    socket.on('user left', function (data) {
        console.log('User ' + data.id + ' left');
        charactersList[data.id].die();
        delete charactersList[data.id];

    });

}

