
Player = function (nickname) {

    this.nickname = nickname;
    this.team = null;
    this.isReady = false;
    this.character = null;
    this.controller = new Controller (Controller.KEYBOARD);
    this.keyFns = [] // Probablemente prescindible
};


Player.prototype.leaveTeam = function (){

    if (this.team){
        this.team.removePlayer(this);
    }
    this.team = null;

}

Player.prototype.joinTeam = function(team) {

    this.leaveTeam();
    team.addPlayer(this);
}



// Función que se ejectuará cuando se presione la tecla 'left'
// del controlador del usuario
// Almacenamos la función en 'this' también por si queremos cambiar
// de controlador

Player.prototype.setKeyFunction = function(key, fn){

    this.keyFns[key] = fn;
    this.controller.keys[key].onDown.add(fn, this);

}

Player.prototype.movePlayer = function(){
    var moveForce = 0.515;
    if(!this.character) return;

    if(this.character.isGrounded())
    {
        if(this.controller.jumpDown())
        {
            this.character.jump();
        }
        else if (this.controller.downDown())
        {
            this.character.moveGrounded('down');
        }
        else if(this.controller.leftDown())
        {
            this.character.moveGrounded('left');
        }
        else if (this.controller.rightDown())
        {
            this.character.moveGrounded('right');
        }
        else{
            this.character.moveGrounded('still');
        }
    }
    else if(this.character.inAtmosphere())
    {
        if (this.controller.leftDown())
        {
            this.character.moveInOrbit('left');
        }
        else if (this.controller.rightDown())
        {
            this.character.moveInOrbit('right');
        }
        if(this.controller.jumpDown() && this.character.jumpCooldown)
        {
            this.character.moveInOrbit('jetpack');
        }
        else
        {
            this.character.moveInOrbit('still');
        }
    }
    else
    {
        if (this.controller.leftDown())
        {
            this.character.moveSpace('left');
        }
        else if (this.controller.rightDown())
        {
            this.character.moveSpace('right');
        }
        else
        {
            this.character.moveSpace('still');
        }
        if (this.controller.upDown() || this.controller.jumpDown())
        {
            this.character.moveSpace('up');
        }
        else if (this.controller.downDown())
        {
            this.character.moveSpace('down');
        }
        else
        {
            this.character.moveSpace('still');
        }
        if (this.controller.rotateLDown())
        {
            this.character.moveSpace('rotateL');
        }
        else if (this.controller.rotateRDown())
        {
            this.character.moveSpace('rotateR');
        }
    }

}

Player.prototype.characterSetup = function () {


//            character.jumpSound = game.add.audio('jump');

//            game.spacePhysics.addDynamic(sprite);

            // ESTO PROBABLEMENTE NO DEBA IR AQUÍ
            game.camera.follow(this.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);


            var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            attackKey.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id, attack_id:0};
                socket.emit('attack', output);
                this.character.attack()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);



            var attack2Key = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            attack2Key.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id, attack_id:1};
                socket.emit('attack', output);
                this.character.attack2()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);


            var attack3Key = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            attack3Key.onDown.add(function(){
                var output = {id:GALACTIC_STRIKE.player.id, attack_id:2};
                socket.emit('attack', output);
                this.character.attack3()}, this);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);



            var zoomKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
            zoomKey.onDown.add(function(){
                if (!GALACTIC_STRIKE.zoomed){
                    game.camera.follow(null);
                    game.add.tween(game.world.scale).to( {x: 0.5, y:0.5}, 350, Phaser.Easing.Quadratic.InOut, true);
                    GALACTIC_STRIKE.zoomed = true;
                    game.camera.follow(this.character, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

                }
                else{
                    game.camera.follow(null);
                    game.add.tween(game.world.scale).to( {x: 1, y:1}, 350, Phaser.Easing.Quadratic.InOut, true);
                    GALACTIC_STRIKE.zoomed = false;
                    game.camera.follow(this.character,  Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
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


//            var respawnKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
//            respawnKey.onDown.add(function(){
//                console.log("DIE")
//                GALACTIC_STRIKE.player.character.die();
//                charactersList[GALACTIC_STRIKE.player.id] = new Character(game.world.randomX, game.world.randomY, game, GALACTIC_STRIKE.player.id, 'player');
//                GALACTIC_STRIKE.player.character = charactersList[GALACTIC_STRIKE.player.id];
//                GALACTIC_STRIKE.player.characterSetup();
//            }, this);
//            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.R);


            for (var i = 0; i < GALACTIC_STRIKE.room.map.planets.length; i++){
//                myCharacter.body.setBodyContactCallback(planets[i], touchPlanetCallback, this);
                this.character.body.setBodyPresolveCallback(GALACTIC_STRIKE.room.map.planets[i], touchPlanetCallback, this);
                this.character.wheels[0].body.setBodyPresolveCallback(GALACTIC_STRIKE.room.map.planets[i], touchPlanetCallback, this);
                this.character.wheels[1].body.setBodyPresolveCallback(GALACTIC_STRIKE.room.map.planets[i], touchPlanetCallback, this);

            }

//            character.body.setColissionCategory(GALACTIC_STRIKE.COLLISION_CATEGORY.PLAYER);
}





