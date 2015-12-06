

clientSetupGame = function (){


    socket.on('beginMatch', function (input) {

        console.log('@Client received | beginMatch');
        game.state.start('PlayGame');
//        myCharacterSetup(GALACTIC_STRIKE.player.character);

    });


    socket.on('userJoinedGame', function (input) {

        console.log('@Client received | userJoinedGame');

        var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
        charactersList[input.id] = new Character(input.x, input.y, game, GALACTIC_STRIKE.room.players[input.id], asset);

        if(input.id === GALACTIC_STRIKE.player.id){
            GALACTIC_STRIKE.player.character = charactersList[input.id];
            myCharacterSetup(GALACTIC_STRIKE.player.character);
        }


        var logMsg = "";
        for (var c in charactersList){
            logMsg += charactersList[c] + " ";
        }
        console.log("Clients: " + logMsg);

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
            charactersList[input.id].jumpAnimation = input.jumpAnimation;
        }

        if(charactersList[input.id].jumpAnimation){
            if(charactersList[input.id].orientation === charactersList[input.id].LEFT)
            {
                charactersList[input.id].animations.play('jumpL');
            }
            else
            {
                charactersList[input.id].animations.play('jumpR');
            }
        }
        else
        {
            if(charactersList[input.id].orientation === charactersList[input.id].LEFT)
            {
                charactersList[input.id].animations.play('left');
            }
            else
            {
                charactersList[input.id].animations.play('right');
            }
        }

    });

    socket.on('attack', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | attack');

        if(charactersList[input.id]){
            charactersList[input.id].attack();
        }

    });


    socket.on('hit', function (input) {

//        if(input.target === GALACTIC_STRIKE.player.id) return;

        console.log('@Client received | hit');

        if(charactersList[input.target]){

            charactersList[input.target].health -= input.damage;
//            output.health = body2.mainSprite.health
            if(charactersList[input.target].health <= 0)
            {
                charactersList[input.target].die();
                delete body2.sprite;
//                output.die = true;
            } else
            {
//                output.die = false;
                charactersList[input.target].hitImmune = true;
                game.time.events.add(charactersList[input.target].hitImmuneTime, function(){charactersList[input.target].hitImmune = false;}, this);
            }

//            charactersList[input.target].health = input.health;
//            if(input.die) charactersList[input.target].die();
        }

    });

    socket.on('attack2', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | attack2');

        if(charactersList[input.id]){
            charactersList[input.id].attack2();
        }

    });

}
