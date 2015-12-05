
Player = function (nickname) {

    this.nickname = nickname;
    this.team = null;
    this.isReady = false;
    this.character = null;
    this.controller = new Controller (Controller.KEYBOARD);
    this.keyFns = [] // Probablemente prescindible
};


Player.prototype.joinTeam = function(team) {

    this.leaveTeam();
    team.addPlayer(this);
}


Player.prototype.leaveTeam = function (){

    if (this.team){
        this.team.removePlayer(Player);
    }
    this.team = null;

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
        if (this.controller.upDown())
        {
            this.character.moveSpace('up');
        }
        else if (this.controller.downDown())
        {
            this.character.moveSpace('down');
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




