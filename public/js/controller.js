
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

var moveForce = 0.515;


function movePlayer(){

    if(!myCharacter) return;
  //myCharacter.body.setZeroVelocity();

  //  if(myCharacter.body.wasTouching.down){
  //      }

    if(myCharacter.isGrounded()) {

        myCharacter.motorEnabled = true;

        if(spaceKey.isDown){
            myCharacter.jump();
        }
        else if (downKey.isDown){
             myCharacter.motorSpeed = 0;
        }
        else if(leftKey.isDown){
//                myCharacter.moveGrounded('left');
            myCharacter.motorSpeed = -30;
        }
        else if (rightKey.isDown){
//                myCharacter.moveGrounded('right');
            myCharacter.motorSpeed = 30;
        }
        else{
//                myCharacter.moveGrounded('still');
            myCharacter.motorEnabled = false;
        }

        for (var i = 0; i < 2; i++) {
            myCharacter.driveJoints[i].EnableMotor(myCharacter.motorEnabled);
            myCharacter.driveJoints[i].SetMotorSpeed(myCharacter.motorSpeed);
        }
    } else if(myCharacter.inAtmosphere()){
            if (leftKey.isDown)
            {
                myCharacter.body.rotateLeft(150);
//                myCharacter.body.velocity.x -= 5.101;
                myCharacter.animations.play('left');
            }
            //else if (cursors.right.isDown)
            else if (rightKey.isDown)
            {
                myCharacter.body.rotateRight(150);
//                myCharacter.body.velocity.x += 5.101;
                myCharacter.animations.play('right');
            /*} else if(spaceKey.isDown){
                myCharacter.animations.play('jump');*/
            }
            if(spaceKey.isDown && myCharacter.jumpCooldown){
                myCharacter.body.thrust(700);
                myCharacter.animations.play('fly');
            }

        }
        else {
               //if (cursors.left.isDown)
            if (leftKey.isDown)
            {
                myCharacter.body.rotateLeft(100);
//                myCharacter.body.velocity.x -= 5.101;
                myCharacter.animations.play('left');
            }
            //else if (cursors.right.isDown)
            else if (rightKey.isDown)
            {
                myCharacter.body.rotateRight(100);
//                myCharacter.body.velocity.x += 5.101;
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
//                console.log(myCharacter.body.angle)
//                myCharacter.body.applyForce(moveForce*Math.cos(myCharacter.body.angle), -moveForce*Math.cos(myCharacter.body.angle));
//                myCharacter.body.velocity.y -= 5.101;
                myCharacter.body.thrust(200);
                myCharacter.animations.play('fly');

            }
            //else if (cursors.down.isDown)
            else if (downKey.isDown)
            {
                myCharacter.body.reverse(200);
//                myCharacter.body.velocity.y += 5.101;
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
