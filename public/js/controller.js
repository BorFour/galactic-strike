Controller = function (nickname) {

    this.nickname = nickname;
    this.team = null;
    this.isReady = false;
    this.character = null;
    this.controller = new Controller ();

};


Controller.prototype.joinTeam = function(team) {

    team.addPlayer(this);
    this.team = team;

}


Controller.prototype.leaveTeam = function (){

    this.team.removePlayer(Player);
    this.team = null;

}

// Función que se ejectuará cuando se presione la tecla 'left'
// del controlador del usuario

Controller.prototype.setLeftFunction (fn){
    this.controller.keyLeft.onDown.add(fn, this);
}


function movePlayer(){

        if(!sprite) return;
      //sprite.body.setZeroVelocity();

      //  if(sprite.body.wasTouching.down){
      //      }

        //if (cursors.left.isDown)
        if (leftKey.isDown)
        {
            sprite.body.velocity.x -= 5.101;
            sprite.animations.play('left');
        }
        //else if (cursors.right.isDown)
        else if (rightKey.isDown)
        {
            sprite.body.velocity.x += 5.101;
            sprite.animations.play('right');
        }

        else {
            sprite.animations.stop();
        }

        //if (cursors.up.isDown)
        if (upKey.isDown)
        {
            sprite.body.velocity.y -= 5.101;
        }
        //else if (cursors.down.isDown)
        else if (downKey.isDown)
        {
            sprite.body.velocity.y += 5.101;
        }

        if (rotateLKey.isDown)
        {
            sprite.body.angularVelocity -= 0.15;
        }
        //else if (cursors.down.isDown)
        else if (rotateRKey.isDown)
        {
            sprite.body.angularVelocity += 0.15;
        }

        // NO FUNCIONA
        // Parece que el navegador no le da permisos suficientes
        // a Phaser

        /*
        if (fullscreenKey.isDown)
        {
            gofull()
        }
        */

}
