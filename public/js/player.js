
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
    this.team = team;

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




