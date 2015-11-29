

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

    this.players.push(player);

}


Room.prototype.addTeam = function (name){

    console.log(this.teams.length)
    if(this.teams.length < 4){
        if(!name){
          name = "Team " + (this.teams.length+1);
        }
        console.log("Miau");
        this.teams.push(new Team (name, this.teams.length+1));
    }

}

Room.prototype.dropTeam = function(){

    if(this.teams.length > 0){
        this.teams.pop();
    }

}

Room.prototype.playersReady = function(){

    return this.players.reduce(function(prevValue, currValue, index, array){
        return prevValue && currValue.isReady;
    }, true);
}


