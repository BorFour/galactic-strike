
Player = function (nickname ) {

    this.nickname = nickname;
    this.team = null;

};


Player.prototype.joinTeam = function(team) {

    team.addPlayer(this);
    this.team = team;

}


Player.prototype.leaveTeam = function (){

    this.team.removePlayer(Player);
    this.team = null;

}