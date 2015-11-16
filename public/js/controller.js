
/*
var KEYBOARD = {
    'left' : game.input.keyboard.addKey(Phaser.Keyboard.A),
    'right' : game.input.keyboard.addKey(Phaser.Keyboard.D),
    'up' : game.input.keyboard.addKey(Phaser.Keyboard.W),
    'down' : game.input.keyboard.addKey(Phaser.Keyboard.S),
    'rotateL' : game.input.keyboard.addKey(Phaser.Keyboard.Q),
    'rorateR' : game.input.keyboard.addKey(Phaser.Keyboard.E)
}
*/
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

var moveForce = 150;
function movePlayer(){

        if(!myCharacter) return;
      //myCharacter.body.setZeroVelocity();

      //  if(myCharacter.body.wasTouching.down){
      //      }

        if(!planetTouched){

            //if (cursors.left.isDown)
            if (leftKey.isDown)
            {
                myCharacter.body.velocity.x -= 5.101;
                myCharacter.animations.play('left');
            }
            //else if (cursors.right.isDown)
            else if (rightKey.isDown)
            {
                myCharacter.body.velocity.x += 5.101;
                myCharacter.animations.play('right');
            /*} else if(spaceKey.isDown){
                myCharacter.animations.play('jump');*/
            } else {
                myCharacter.animations.stop();
                myCharacter.animations.play('stop');
            }

            //if (cursors.up.isDown)
            if (upKey.isDown)
            {
                myCharacter.body.velocity.y -= 5.101;
                myCharacter.animations.play('fly');

            }
            //else if (cursors.down.isDown)
            else if (downKey.isDown)
            {
                myCharacter.body.velocity.y += 5.101;
            }

            if (rotateLKey.isDown)
            {
                myCharacter.body.angularVelocity -= 0.15;
            }
            //else if (cursors.down.isDown)
            else if (rotateRKey.isDown)
            {
                myCharacter.body.angularVelocity += 0.15;
            }
        }
        else {
            if(leftKey.isDown){
					// add gravity force to the crate in the direction of planet center
                var angle = Phaser.Math.angleBetween(myCharacter.x,myCharacter.y,planetTouched.x,planetTouched.y);
                myCharacter.body.velocity.x = -moveForce*Math.sin(angle);
                myCharacter.body.velocity.y = moveForce*Math.cos(angle);
                myCharacter.animations.play('left');
            }
            else if (rightKey.isDown){
                				// add gravity force to the crate in the direction of planet center
                var angle = Phaser.Math.angleBetween(myCharacter.x,myCharacter.y,planetTouched.x,planetTouched.y);
                myCharacter.body.velocity.x = moveForce*Math.sin(angle);
                myCharacter.body.velocity.y = -moveForce*Math.cos(angle);
                myCharacter.animations.play('right');

            }
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
