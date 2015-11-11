

Room = function (name, host, maxUsers, ip, port) {


    this.name = name;
    this.host = host; // Player
    this.maxUsers = maxUsers;
    this.ip = ip;
    this.port = port;
    this.players = [].push(host);
    this.teams = [];

};


Room.prototype.addPlayer = function(player) {

    this.team = team;
    this.players.push(player);

}


Room.prototype.addTeam = function (){

    if(this.teams.length < Team.MAXTEAMS){
        this.teams.push(new Team ("", this.teams.length+1));
    }

}

Room.prototype.dropTeam = function(){

    this.teams.pop();

}
