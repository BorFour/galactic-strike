
Player = function (nickname) {

    this.nickname = nickname;
    this.team = null;
    this.isReady = false;
    this.character = null;
    this.controller = new Controller ();

};


Player.prototype.joinTeam = function(team) {

    team.addPlayer(this);
    this.team = team;

}


Player.prototype.leaveTeam = function (){

    this.team.removePlayer(Player);
    this.team = null;

}

// Función que se ejectuará cuando se presione la tecla 'left'
// del controlador del usuario
// Almacenamos la función en 'this' también por si queremos cambiar
// de controlador

Player.prototype.setLeftFunction (fn){

    this.leftFn = fn;
    this.controller.keyLeft.onDown.add(fn, this);

}




