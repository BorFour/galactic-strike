
Team.RED = 1
Team.BLUE = 2
Team.YELLOW = 3
Team.GREEN = 4
Team.MAXTEAMS = Team.GREEN

Team = function (name, color) {

    this.name = name;
    this.color = color; // Colores predeterminados?
    this.players = [];

};


Team.prototype.addPlayer = function(player) {

    this.team = team;
    this.players.push(player);

}


Team.prototype.removePlayer = function (player){

    this.players.remove(player);
    // Warning!
    this.players = this.players.filter(function (el) {
                        return el === player;
                       });
    this.team = null;

}
