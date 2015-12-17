/**
 * Client handlers for the events that may happen during a match.
 * @private
 */


clientSetupGame = function () {


    /**
     * Starts the state 'PlayGame' and initializes a buffer for the character that join before.
     * this client has created and initialized all the resources needed for the match.
     * @event 'beginMatch'
     */

    socket.on('beginMatch', function (input) {

        console.log('@Client received | beginMatch');

        game.state.start('Play');
        GALACTIC_STRIKE.charactersBuffer = {};
        console.log(input.stage)
        GALACTIC_STRIKE.room.currentStageName = input.stage;

    });

    /**
     * A user joined the game, so his caracter must be created.
     * @event 'userJoinedGame'
     */

    socket.on('userJoinedGame', function (input) {

        console.log('@Client received | userJoinedGame');

        if (GALACTIC_STRIKE.createGameReady) {
            // Uses the red character asset if the player is the red team, blue in other case.
            var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
            // Creates the character according to the information received in input.
            GALACTIC_STRIKE.room.characters[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], asset);
            // Assigns the character to its player
            GALACTIC_STRIKE.room.players[input.id].character = GALACTIC_STRIKE.room.characters[input.id];

            // If the input's player is the current client's player, set controls and camera for this sprite.
            if (input.id === GALACTIC_STRIKE.player.id) {
                GALACTIC_STRIKE.player.characterSetup();
            }

            // Logs all the characters created at this moment.

            var logMsg = "";
            for (var c in GALACTIC_STRIKE.room.characters) {
                logMsg += GALACTIC_STRIKE.room.characters[c] + " ";
            }
            console.log("Clients: " + logMsg);
        } else {
            GALACTIC_STRIKE.charactersBuffer[input.id] = input;
        }


    });

    /**
     * The match's round has finished, so all the characters must be destroyed so this client can wait for their respawns.
     * @event 'finishRound'
     */

    socket.on('finishRound', function (input) {

        console.log('@Client received | finishRound');

        // For every character in the room, destroy him.
        for (var c in GALACTIC_STRIKE.room.characters) {
            if (GALACTIC_STRIKE.room.characters[c]) {
                GALACTIC_STRIKE.room.characters[c].simpleDie();
            }
        }

        // This client gets a position from the stage to spawn.

        var spawnPosition = GALACTIC_STRIKE.room.map.spawnPositionTeam(GALACTIC_STRIKE.player.team.color - 1);

        // And sends it to the server, so the other clients know where to spawn this player's character.

        var data = {
            id: GALACTIC_STRIKE.player.id,
            x: spawnPosition.x,
            y: spawnPosition.y,
            angle: toRad(spawnPosition.angle - 180),
            velocityX: 0,
            velocityY: 0,
            orientation: 0
        }

        socket.emit('respawn', data);
        console.log(data);

    });

    /**
     * A user has left the game, so all his references must be deleted.
     * @event 'userLeftGame'
     */

    socket.on('userLeftGame', function (input) {

        console.log('@Client received | userLeftGame');
        if (GALACTIC_STRIKE.room.characters[input.id] && GALACTIC_STRIKE.room.characters[input.id].alive) {
            GALACTIC_STRIKE.room.characters[input.id].die();
            // The game mode state might change after a user leaves
            GALACTIC_STRIKE.room.gameMode.update();
        }
        delete GALACTIC_STRIKE.room.characters[input.id];
        delete GALACTIC_STRIKE.room.players[input.id];

    });

    /**
     * After a round has finished, every client must sent back their character's respawn position
     * @event 'respawn'
     */

    socket.on('respawn', function (input) {

        console.log('@Client received | respawn');

        if (GALACTIC_STRIKE.createGameReady) {
            // Uses the red character asset if the player is the red team, blue in other case.
            var asset = (GALACTIC_STRIKE.room.players[input.id].team === GALACTIC_STRIKE.room.teams[0] ? 'playerRed' : 'playerBlue');
            // Creates the character according to the information received in input.
            GALACTIC_STRIKE.room.characters[input.id] = new Character(input.x, input.y, input.angle, game, GALACTIC_STRIKE.room.players[input.id], asset);
            // Assigns the character to its player
            GALACTIC_STRIKE.room.players[input.id].character = GALACTIC_STRIKE.room.characters[input.id];

            if (input.id === GALACTIC_STRIKE.player.id) {
                GALACTIC_STRIKE.player.characterSetup();
                game.time.events.add(2000, function () {
                    GALACTIC_STRIKE.room.roundFinished = false;
                }, this);
            }

            // Logs all the characters created at this moment.
            var logMsg = "";
            for (var c in GALACTIC_STRIKE.room.characters) {
                logMsg += GALACTIC_STRIKE.room.characters[c] + " ";
            }
            console.log("Clients: " + logMsg);
        } else {
            // This should never happen
            GALACTIC_STRIKE.charactersBuffer[input.id] = input;
        }

        var arePlayersReady = true;
        for (var p in GALACTIC_STRIKE.room.players){
            arePlayersReady = arePlayersReady && GALACTIC_STRIKE.room.players[p].character;
        }
        GALACTIC_STRIKE.room.roundReady = arePlayersReady;

    });


    /**
     * Each character's position is updated periodically
     * @event 'update'
     */

    socket.on('update', function (input) {

        if (!GALACTIC_STRIKE.room.roundReady) {return;}

        if (input.id == GALACTIC_STRIKE.player.id)
            return;

        // All the properties stored in input are copied into input.id's character
        if (GALACTIC_STRIKE.room.characters[input.id] && GALACTIC_STRIKE.room.characters[input.id].alive) {
            GALACTIC_STRIKE.room.characters[input.id].body.x = input.x;
            GALACTIC_STRIKE.room.characters[input.id].body.y = input.y;
            GALACTIC_STRIKE.room.characters[input.id].body.angle = input.angle;
            GALACTIC_STRIKE.room.characters[input.id].body.velocity.x = input.velocityX;
            GALACTIC_STRIKE.room.characters[input.id].body.velocity.y = input.velocityY;
            GALACTIC_STRIKE.room.characters[input.id].body.angularVelocity = input.angularVelocity;
            GALACTIC_STRIKE.room.characters[input.id].orientation = input.orientation;
            GALACTIC_STRIKE.room.characters[input.id].jumpAnimation = input.jumpAnimation;
        } else {
            // The character hasn't been created yet
            return;
        }

        if (input.attack) {
            console.log("Attack id: " + input.attack.id);
            GALACTIC_STRIKE.room.characters[input.id].attacks(input.attack.id, input.attack.space);
        }

        if (GALACTIC_STRIKE.room.characters[input.id].jumpAnimation) {
            if (GALACTIC_STRIKE.room.characters[input.id].orientation == GALACTIC_STRIKE.room.characters[input.id].LEFT) {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('jumpL');
            } else {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('jumpR');
            }
        } else {
            if (GALACTIC_STRIKE.room.characters[input.id].orientation == GALACTIC_STRIKE.room.characters[input.id].LEFT) {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('left');
            } else {
                GALACTIC_STRIKE.room.characters[input.id].animations.play('right');
            }
        }

    });

    /**
     * When a character has attacked, the corresponding attack method is called
     * @event 'attack'
     */

    // DEPRECATED

//    socket.on('attack', function (input) {
//
//        if (input.id === GALACTIC_STRIKE.player.id) {
//            return;
//        }
//        console.log('@Client received | attack');
//
//        if (GALACTIC_STRIKE.room.characters[input.id]) {
//            console.log("Attack id: " + input.attack_id);
//            GALACTIC_STRIKE.room.characters[input.id].attacks(input.attack_id, input.space);
//        }
//
//    });

    /**
     * When a character has been hit, his properties must be updated
     * @event 'hit'
     */

    socket.on('hit', function (input) {

        console.log('@Client received | hit');
        if (!GALACTIC_STRIKE.room.roundReady) {return;}

        if (GALACTIC_STRIKE.room.characters[input.target] &&
            GALACTIC_STRIKE.room.characters[input.target].alive) {

            // The hit's damage is applied to the character's health
            GALACTIC_STRIKE.room.characters[input.target].health -= input.damage;

            // When the character's health drops below zero, the character dies.
            if (GALACTIC_STRIKE.room.characters[input.target].health <= 0) {

                GALACTIC_STRIKE.room.characters[input.target].die();
                delete GALACTIC_STRIKE.room.characters[input.target];

                if(input.target == GALACTIC_STRIKE.player.id) {
                    game.camera.follow(null);
//                    game.camera.reset();
                    zoomOutGame();
                }

                GALACTIC_STRIKE.room.gameMode.update();

            } else {
                // This character is damage immune for a short period of time
                GALACTIC_STRIKE.room.characters[input.target].hitImmune = true;
                game.time.events.add(GALACTIC_STRIKE.room.characters[input.target].hitImmuneTime, function () {
                    GALACTIC_STRIKE.room.characters[input.target].hitImmune = false;
                }, this);
            }
        }

    });

}
