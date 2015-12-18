var Team = {};
Team.RED = 1;
Team.BLUE = 2;
Team.YELLOW = 3;
Team.GREEN = 4;
Team.MAXTEAMS = 4

Team = function (name, color, anthem)
{

    this.name = name;
    this.color = color;
    this.players = [];
    this.anthem = anthem;

};


Team.prototype.addPlayer = function (player)
{

    player.team = this;
    this.players.push(player);

}

Team.prototype.playAnthem = function ()
{

    this.anthem.play();

}

Team.prototype.removePlayer = function (player)
{

    var i = this.players.indexOf(player);

    if (i != -1)
    {
        this.players.splice(i, 1);
    }

    player.team = null;

}

Team.prototype.alive = function ()
{


    for (var i = 0; i < this.players.length; i++)
    {

        if (!this.players[i].character || this.players[i].character.alive) return true;

    }

    return false;
}

Team.prototype.toString = function ()
{
    return this.name;
}
