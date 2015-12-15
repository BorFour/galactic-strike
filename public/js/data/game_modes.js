
var quitGameGM = function () {
    window.close();
}

var gameModes =
{
    'deathmatch' : {
        'name' : 'deathmatch',
        'init' : function () {

             this.scores = [];
             for (var t in this.room.teams)
             {
                this.scores[this.room.teams[t]] = 0;
             }

        },
        'startRound' : function () {

                if (GALACTIC_STRIKE.room.host !== GALACTIC_STRIKE.player.id || GALACTIC_STRIKE.room.roundFinished) { return; }

                GALACTIC_STRIKE.room.roundFinished = true;

                console.log('@Client sent | finishRound');
                socket.emit('finishRound', { id : GALACTIC_STRIKE.player.id });

        },
        'winnerRound' : function (){

            var teams_alive = 0;
            var winner = null;
            for(var i = 0; i < this.room.teams.length; i++)
            {
                if(this.room.teams[i].alive())
                {
                    ++teams_alive;
                    winner = this.room.teams[i];
                }
                console.log(this.room.teams[i].name + ' ' + this.room.teams[i].alive())

            }

            return (teams_alive === 1 ? winner : null);

        },
        'winner' : function (){

            var maxScore = Number.MIN_VALUE;
            var maxTeams = null;
            for (var t in this.teams){
                if(this.scores[t] === maxScore){
                    maxTeams.push(this.teams[t]);
                }
                else if (this.scores[t] > maxScore){
                    maxScore = this.scores[t];
                    maxTeams = [].push(this.teams[t]);
                }
            }

            return maxTeams;

        },
        'isOverGame' : function (){

//                return true;
            for(var t in this.scores){
                if(this.scores[t] >= this.winScore) return true;
            }
            return false;
        },
        'winScore' : 2,
        'showWinnerRound' : function (winner) {

            var t = game.add.text(0, 0, winner + " won this round!", { font: "32px Arial", fill: "#ffffff", align: "center" });
            t.anchor.set(0.5);
            t.fixedToCamera = true;
            t.cameraOffset.setTo(game.camera.width/2, game.camera.height*3/4);
            var tw = game.add.tween(t).to( { alpha: 0 }, 5000, "Linear", true);
            tw.onComplete.add(function () { t.destroy(); });

        },
        'showWinner' : function (winner) {

            GALACTIC_STRIKE.room.gameOver = true;
            if (GALACTIC_STRIKE.zoomed)
            {
                game.world.scale.set(1);
                GALACTIC_STRIKE.zoomed = false;
            }

            var nameLabel = game.add.text(game.world.centerX, game.world.centerY/3, (winner + ' wins!'),{ font: '70px Geo   ', fill: '#ffffff' });
            nameLabel.anchor.setTo(0.5, 0.5);
            var buttonQuit = game.add.button(game.world.centerX, game.world.centerY , 'exitButton', quitGameGM, this, 0, 0, 0, 0);

            buttonQuit.anchor.set(0.5);
            buttonQuit.scale.set(0.25);

            game.camera.follow(null);
            var toButton = game.add.tween(game.camera).to({x : buttonQuit.x  - game.camera.width/2, y : buttonQuit.y - game.camera.height/2}, 350, Phaser.Easing.Quadratic.InOut, true);

            game.time.events.add(26000, quitGameGM, this);

            GALACTIC_STRIKE.currentSong.stop();
            GALACTIC_STRIKE.readTeamAnthem.play();
            //winner.playAnthem();

            game.add.tween(nameLabel).to({y: game.world.centerY - 200}, 1000).easing(Phaser.Easing.Bounce.Out).start();
            toButton.start();

        },
        'update' : function (){

            console.log("Deathmatch update");
            var wr = this.winnerRound();
            if(wr)
            {1
                this.scores[wr] += 1;
                console.log(wr.name + ' won this round.' + this.scores[wr] + ' points');
                if(this.isOverGame())
                {
                    console.log('Showing winner');
                    this.showWinner(wr);
                    return true;
                }
                else
                {
                    this.showWinnerRound(wr);
                    this.startRound();
                }
            }

            return false;

        }
    }

}
