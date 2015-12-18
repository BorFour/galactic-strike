// https://en.wikipedia.org/wiki/HUD_(video_gaming)

function HUD(game)
{

    var style = {
        font: "bold 32px Arial",
        fill: "#272",
    };

    var style2 = {
        font: "bold 26px Arial",
        fill: "#f03",
    };

    var style3 = {
        font: "bold 26px Arial",
        fill: "#44f",
    };

    this.score = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2 - 350, "Esto es la puntuación", style);
    this.score.anchor.set(0.5);
    this.score.fixedToCamera = true;
    this.teamRed = game.add.text(game.camera.x + game.camera.width / 2 - 500, game.camera.y + game.camera.height / 2 - 350, "Esto es el equipo rojo", style2);
    this.teamRed.anchor.set(0.5);
    this.teamRed.fixedToCamera = true;
    this.teamBlue = game.add.text(game.camera.x + game.camera.width / 2 + 500, game.camera.y + game.camera.height / 2 - 350, "Esto es el equipo azul", style3);
    this.teamBlue.anchor.set(0.5);
    this.teamBlue.fixedToCamera = true;

};

HUD.prototype.updateText = function ()
{

    this.score.text =
        GALACTIC_STRIKE.room.teams[0] + " : " +
        GALACTIC_STRIKE.room.gameMode.scores[GALACTIC_STRIKE.room.teams[0]] +
        " " + GALACTIC_STRIKE.room.teams[1] + " : " +
        GALACTIC_STRIKE.room.gameMode.scores[GALACTIC_STRIKE.room.teams[1]];

    var text = GALACTIC_STRIKE.room.teams[0].toString();

    for (var p in GALACTIC_STRIKE.room.teams[0].players)
    {
        text += "\n" + (GALACTIC_STRIKE.room.teams[0].players[p].character ?
            GALACTIC_STRIKE.room.teams[0].players[p].character :
            "Player : " + GALACTIC_STRIKE.room.teams[0].players[p] + "dead");
    }

    this.teamRed.text = text;


    var text = GALACTIC_STRIKE.room.teams[1].toString();

    for (var p in GALACTIC_STRIKE.room.teams[1].players)
    {
        text += "\n" + (GALACTIC_STRIKE.room.teams[1].players[p].character ?
            GALACTIC_STRIKE.room.teams[1].players[p].character :
            GALACTIC_STRIKE.room.teams[1].players[p] + "dead");
    }

    this.teamBlue.text = text;


}

/**
 * The HUD has to be scaled when the world scales (zooming)
 */

HUD.prototype.scaleSet = function (val)
{

    this.score.scale.set(val);
    this.teamRed.scale.set(val);
    this.teamBlue.scale.set(val);

}
