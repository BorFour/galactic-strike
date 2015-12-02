
var networkDebug = true;

/**
 * Set up for the events that can be received from the server
 */

function clientSetup(){


    socket.on('IDPlayers', function (input) {

        GALACTIC_STRIKE.player.id = input.id;
        console.log('@Client received | IDPlayers');
        charactersList = [];
        for (var p in input.players){
            if(input.players[p]) {
                charactersList[p] = new Character(input.players[p].x, input.players[p].y, game, p, 'player');
            }
        }
        GALACTIC_STRIKE.player.character = charactersList[GALACTIC_STRIKE.player.id];
        myCharacterSetup(GALACTIC_STRIKE.player.character);

    });

    socket.on('update', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
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

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | userJoined');


        charactersList[input.id] = new Character(input.x, input.y, game, input.id, 'player');

        var logMsg = "";
        for (var c in charactersList){
            logMsg += charactersList[c] + " ";
        }
        console.log("Clients: " + logMsg);

    });

    socket.on('attack', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | attack');

        if(charactersList[input.id]){
            charactersList[input.id].attack();
        }

    });


    socket.on('hit', function (input) {

        if(input.target === GALACTIC_STRIKE.player.id) return;

        console.log('@Client received | hit');

        if(charactersList[input.target]){
            charactersList[input.target].health = input.health;
            if(input.die) charactersList[input.target].die();
        }

    });

    socket.on('attack2', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | attack2');

        if(charactersList[input.id]){
            charactersList[input.id].attack2();
        }

    });

    socket.on('userLeft', function (input) {

        console.log('@Client received | userLeft');
        charactersList[input.id].die();
        delete charactersList[input.id];

    });

}

function myCharacterSetup(character){


            character.jumpSound = game.add.audio('jump');

//            game.spacePhysics.addDynamic(sprite);

            // ESTO PROBABLEMENTE NO DEBA IR AQUÍ
            game.camera.follow(character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

            var fireKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
            fireKey.onDown.add(function(){character.fire()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NUMPAD_0);



            var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            attackKey.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id};
                socket.emit('attack', output);
                character.attack()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);



            var attack2Key = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            attack2Key.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id};
                socket.emit('attack2', output);
                character.attack2()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);



            var zoomKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
            zoomKey.onDown.add(function(){
                if (!GALACTIC_STRIKE.zoomed){
                    game.camera.follow(null);
                    game.add.tween(game.world.scale).to( {x: 0.5, y:0.5}, 350, Phaser.Easing.Quadratic.InOut, true);
                    GALACTIC_STRIKE.zoomed = true;
                    game.camera.follow(GALACTIC_STRIKE.player.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

                }
                else{
                    game.camera.follow(null);
                    game.add.tween(game.world.scale).to( {x: 1, y:1}, 350, Phaser.Easing.Quadratic.InOut, true);
                    GALACTIC_STRIKE.zoomed = false;
                    game.camera.follow(GALACTIC_STRIKE.player.character,  Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
                }
            }, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Z);



            var muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
            muteKey.onDown.add(function(){
                if (!game.sound.mute){
                    game.sound.mute = true;
                }
                else{
                    game.sound.mute = false;
                }
            }, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.M);


            var respawnKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
            respawnKey.onDown.add(function(){
                console.log("DIE")
                GALACTIC_STRIKE.player.character.die();
            }, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.R);


            for (var i = 0; i < planets.length; i++){
//                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
                character.body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                character.wheels[0].body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);
                character.wheels[1].body.setBodyPresolveCallback(planets[i], touchPlanetCallback, this);

            }

//            character.body.setColissionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.PLAYER);
}

