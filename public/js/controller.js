
Controller.KEYBOARD = {
    'left' : game.input.keyboard.addKey(Phaser.Keyboard.A),
    'right' : game.input.keyboard.addKey(Phaser.Keyboard.D),
    'up' : game.input.keyboard.addKey(Phaser.Keyboard.W),
    'down' : game.input.keyboard.addKey(Phaser.Keyboard.S),
    'rotateL' : game.input.keyboard.addKey(Phaser.Keyboard.Q),
    'rorateR' : game.input.keyboard.addKey(Phaser.Keyboard.E)
}

Controller = function (cconf) {

    // Alternativa chula
    this.keys = []
    for (c in cconf){
        this.keys[c] = cconf[c];
    }
//    this.leftKey = cconf['left'];
//    this.rightKey = cconf['right'];
//    this.upKey = cconf['up'];
//    this.downKey = cconf['down'];
//    this.rotateLKey = cconf['rotateL'];
//    this.rotateRKey = cconf['rorateR'];
//    this.fullscreenKey = game.input.keyboard.addKey(Phaser.Keyboard.F);

};


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
            sprite.animations.play('stop');
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
