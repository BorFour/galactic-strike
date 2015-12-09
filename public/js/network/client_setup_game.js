

clientSetupGame = function (){


    socket.on('beginMatch', function (input) {

        console.log('@Client received | beginMatch');
        game.state.start('PlayGame');

    });


    socket.on('userJoinedGame', function (input) {

        console.log('@Client received | userJoinedGame');

        var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
        charactersList[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], asset);
        GALACTIC_STRIKE.room.players[input.id].character = charactersList[input.id];

        if(input.id === GALACTIC_STRIKE.player.id){
            GALACTIC_STRIKE.player.characterSetup();
        }


        var logMsg = "";
        for (var c in charactersList){
            logMsg += charactersList[c] + " ";
        }
        console.log("Clients: " + logMsg);

    });



    socket.on('userLeftGame', function (input) {

        console.log('@Client received | userLeftGame');
        charactersList[input.id].die();
        delete charactersList[input.id];
        delete GALACTIC_STRIKE.room.players[input.id];

    });



    socket.on('update', function (input) {

        if(input.game_id === GALACTIC_STRIKE.player.id) return;
//        console.log('@Client received | updatePlayers');

        if(charactersList[input.game_id]){
            charactersList[input.game_id].body.x = input.x;
            charactersList[input.game_id].body.y = input.y;
            charactersList[input.game_id].body.angle = input.angle;
            charactersList[input.game_id].body.velocity.x = input.velocityX;
            charactersList[input.game_id].body.velocity.y = input.velocityY;
//            charactersList[input.id].body.angularVelocity= input.angularVelocity;
            charactersList[input.game_id].orientation = input.orientation;
            charactersList[input.game_id].jumpAnimation = input.jumpAnimation;
        }
        else{
            return;
        }

        if(charactersList[input.game_id].jumpAnimation){
            if(charactersList[input.game_id].orientation === charactersList[input.game_id].LEFT)
            {
                charactersList[input.game_id].animations.play('jumpL');
            }
            else
            {
                charactersList[input.game_id].animations.play('jumpR');
            }
        }
        else
        {
            if(charactersList[input.game_id].orientation === charactersList[input.game_id].LEFT)
            {
                charactersList[input.game_id].animations.play('left');
            }
            else
            {
                charactersList[input.game_id].animations.play('right');
            }
        }

    });

    socket.on('attack', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | attack');

        if(charactersList[input.id]){
            console.log("Attack id: " + input.attack_id);
            charactersList[input.id].attacks(input.attack_id);
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
//          if(!GALACTIC_STRIKE.room.gameOver) GALACTIC_STRIKE.room.gameOver =
                GALACTIC_STRIKE.room.gameMode.update();

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

}
