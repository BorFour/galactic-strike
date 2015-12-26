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

   var style4 = {
        font: "bold 26px Arial",
        fill: "#fff",
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
    this.turbos = game.add.text(game.camera.x + game.camera.width / 2 + 550, game.camera.y + game.camera.height / 2 + 350, "Turbos", style4);
    this.turbos.anchor.set(0.5);
    this.turbos.fixedToCamera = true;

    this.turboActivated = game.add.text(game.camera.x + game.camera.width / 2 + 550, game.camera.y + game.camera.height / 2 + 380, "Turbos", style4);
    this.turboActivated.anchor.set(0.5);
    this.turboActivated.fixedToCamera = true;


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


    if (GALACTIC_STRIKE.player.character)
    {
        this.turbos.text = "Turbos : " + GALACTIC_STRIKE.player.character.turbos;
        this.turboActivated.text = " Activated : " + GALACTIC_STRIKE.player.character.turboActivated;
    }

    if (GALACTIC_STRIKE.player.controller.mode === 2)
    {
        GALACTIC_STRIKE.player.controller = new Controller(2);
    }

}

/**
 * The HUD has to be scaled when the world scales (zooming)
 */

HUD.prototype.scaleSet = function (val)
{

    this.score.scale.set(val);
    this.teamRed.scale.set(val);
    this.teamBlue.scale.set(val);
    this.turbos.scale.set(val);
    this.turboActivated.scale.set(val);

}
