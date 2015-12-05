

Room = function (name, host, maxUsers) {


    this.name = name;
    this.host = host; // Player
    this.maxUsers = maxUsers;
    this.players = {};
    this.players[host.id] = host;
    this.teams = [];
    this.unasigned = []
    this.current_gamemode = 0;

};


Room.prototype.addPlayer = function(id, player) {

    this.players[id] = player;
    this.unasigned.push(player);
    player.id = id;
    return player;

}


Room.prototype.addTeam = function (name){

    console.log(this.teams.length)
    if(this.teams.length < 4){
        if(!name){
          name = "Team " + (this.teams.length+1);
        }
        this.teams.push(new Team (name, this.teams.length+1));
    }

}

Room.prototype.dropTeam = function(){

    if(this.teams.length > 0){
        this.teams.pop();
    }

}

/**
 * UNUSED
 * @returns {Bool} all the players are ready
 */

Room.prototype.playersReady = function(){

    return this.players.reduce(function(prevValue, currValue, index, array){
        return prevValue && currValue.isReady;
    }, true);
}


