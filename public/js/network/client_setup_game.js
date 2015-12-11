

clientSetupGame = function (){


    socket.on('beginMatch', function (input) {

        console.log('@Client received | beginMatch');

        game.state.start('PlayGame');
        GALACTIC_STRIKE.charactersBuffer = {};

    });


    socket.on('userJoinedGame', function (input) {

        console.log('@Client received | userJoinedGame');

        if(GALACTIC_STRIKE.createGameReady)
        {
            var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
            GALACTIC_STRIKE.room.characters[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], asset);
            GALACTIC_STRIKE.room.players[input.id].character = GALACTIC_STRIKE.room.characters[input.id];

            if(input.id === GALACTIC_STRIKE.player.id){
                GALACTIC_STRIKE.player.characterSetup();
            }


            var logMsg = "";
            for (var c in GALACTIC_STRIKE.room.characters){
                logMsg += GALACTIC_STRIKE.room.characters[c] + " ";
            }
            console.log("Clients: " + logMsg);
        }
        else
        {
            GALACTIC_STRIKE.charactersBuffer[input.id] = input;
        }


    });



    socket.on('userLeftGame', function (input) {

        console.log('@Client received | userLeftGame');
        GALACTIC_STRIKE.room.characters[input.id].die();
        delete GALACTIC_STRIKE.room.characters[input.id];
        delete GALACTIC_STRIKE.room.players[input.id];

    });



    socket.on('update', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
//        console.log('@Client received | updatePlayers');

        if(GALACTIC_STRIKE.room.characters[input.id]){
            GALACTIC_STRIKE.room.characters[input.id].body.x = input.x;
            GALACTIC_STRIKE.room.characters[input.id].body.y = input.y;
            GALACTIC_STRIKE.room.characters[input.id].body.angle = input.angle;
            GALACTIC_STRIKE.room.characters[input.id].body.velocity.x = input.velocityX;
            GALACTIC_STRIKE.room.characters[input.id].body.velocity.y = input.velocityY;
//            GALACTIC_STRIKE.room.characters[input.id].body.angularVelocity= input.angularVelocity;
            GALACTIC_STRIKE.room.characters[input.id].orientation = input.orientation;
            GALACTIC_STRIKE.room.characters[input.id].jumpAnimation = input.jumpAnimation;
        }
        else{
            return;
        }

        if(GALACTIC_STRIKE.room.characters[input.id].jumpAnimation){
            if(GALACTIC_STRIKE.room.characters[input.id].orientation === GALACTIC_STRIKE.room.characters[input.id].LEFT)
            {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('jumpL');
            }
            else
            {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('jumpR');
            }
        }
        else
        {
            if(GALACTIC_STRIKE.room.characters[input.id].orientation === GALACTIC_STRIKE.room.characters[input.id].LEFT)
            {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('left');
            }
            else
            {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('right');
            }
        }

    });

    socket.on('attack', function (input) {

        if(input.id === GALACTIC_STRIKE.player.id) return;
        console.log('@Client received | attack');

        if(GALACTIC_STRIKE.room.characters[input.id]){
            console.log("Attack id: " + input.attack_id);
            GALACTIC_STRIKE.room.characters[input.id].attacks(input.attack_id);
        }

    });


    socket.on('hit', function (input) {

//        if(input.target === GALACTIC_STRIKE.player.id) return;

        console.log('@Client received | hit');

        if(GALACTIC_STRIKE.room.characters[input.target]){

            GALACTIC_STRIKE.room.characters[input.target].health -= input.damage;
//            output.health = body2.mainSprite.health
            if(GALACTIC_STRIKE.room.characters[input.target].health <= 0)
            {
                GALACTIC_STRIKE.room.characters[input.target].die();
//          if(!GALACTIC_STRIKE.room.gameOver) GALACTIC_STRIKE.room.gameOver =
                GALACTIC_STRIKE.room.gameMode.update();

            } else
            {
                game.time.events.add(GALACTIC_STRIKE.room.characters[input.target].hitImmuneTime, function(){GALACTIC_STRIKE.room.characters[input.target].hitImmune = false;}, this);
            }

//            GALACTIC_STRIKE.room.characters[input.target].health = input.health;
//            if(input.die) GALACTIC_STRIKE.room.characters[input.target].die();
        }

    });

}
