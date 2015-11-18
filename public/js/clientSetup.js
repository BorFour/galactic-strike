
var networkDebug = true;

function clientSetup(player){

  // Socket events

  // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        if(networkDebug) console.log(message, {
          prepend: true
        });
        myId = data.id;
        console.log("Your client ID is: " + myId);
//        addParticipantsMessage(data);
    });

  // Whenever the server emits 'updatePlayer', update the chat body
    socket.on('updatePlayer', function (input) {
        if(myId == input.id){
            return; // ¿Cómo hacemos esto?
//            console.log("Updating my character");
            myCharacter.x = input.data.x
            myCharacter.y = input.data.y
            myCharacter.angle = input.data.angle
        }
        else{
//            console.log("Updating character " + input.id)
//            console.log(charactersList[input.id])
            if(charactersList[input.id]){
                console.log("Updating character " + input.id)
                charactersList[input.id].body.x = input.data.x
                charactersList[input.id].body.y = input.data.y
                charactersList[input.id].body.angle = input.data.angle
                charactersList[input.id].body.velocity.x = input.data.velocityX
                charactersList[input.id].body.velocity.y = input.data.velocityY
            }
            else{
                charactersList[input.id] = new Character(input.data.x, input.data.y, game, input.id, 'player');
            }
        }
    });

  // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
        console.log("Client " + data.id + ' joined in (' + data.x + ',' + data.y + ')') ;

        charactersList[data.id] = new Character(data.x, data.y, game, data.id, 'player');

        if(data.id === myId){

            myCharacter = charactersList[data.id]
            myCharacter.jumpSound = game.add.audio('jump');
            console.log("He creado a mi personaje")

//            game.spacePhysics.addDynamic(sprite);

            // ESTO PROBABLEMENTE NO DEBA IR AQUÍ
            game.camera.follow(myCharacter);
            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(function(){myCharacter.jump()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);

            var fireKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
            fireKey.onDown.add(function(){myCharacter.fire()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);

            for (var i = 0; i < planets.length; i++){
//                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
                myCharacter.body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
            }
        }

        console.log("Clients: ")
        for (var c in charactersList){
            console.log(charactersList[c])
        }
//        addParticipantsMessage(data);
    });

  // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
        console.log(data.username + ' left');
        var c = charactersList[data.id];
        c.kill();
        delete charactersList[data.id];
//        addParticipantsMessage(data);
//        removeChatTyping(data);
    });

  // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function (data) {
        addChatTyping(data);
    });

  // Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', function (data) {
    removeChatTyping(data);
});

}

