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

    this.showingHelp = false;
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

    this.mines = game.add.text(game.camera.x + game.camera.width / 2 + 250, game.camera.y + game.camera.height / 2 + 350, "Mines", style4);
    this.mines.anchor.set(0.5);
    this.mines.fixedToCamera = true;
    this.minesActivated = game.add.text(game.camera.x + game.camera.width / 2 + 250, game.camera.y + game.camera.height / 2 + 380, "Mines", style4);
    this.minesActivated.anchor.set(0.5);
    this.minesActivated.fixedToCamera = true;


    this.controlsText =
            'Controls in planet : move [A D] + stop [S] + turbo [SHIFT] + jump [SPACEBAR] (Hold to use jetpack)\n' +
            'Controls in space : rotate [A D] + thrust [SPACEBAR / W] + turbo [SHIFT] + reverse [S]\n' +
            'Attacks : [Arrow Keys]\n' +
            'Controls while dead : move camera [W A S D]\n' +
            'Mute : on/off [M] + up [K] + down [J]\n';


    this.textBox = game.add.text(game.camera.width/2 , game.camera.height/2 - 30, this.controlsText,
        {
            font: '25px Arial',
            fill: '#ffffff'
        });
    this.textBox.anchor.set(0.5);
    this.textBox.fixedToCamera = true;
    this.textBox.alpha = 0.7;
    this.textBox.visible = false;

    this.controls = game.add.text(game.camera.width/2  - this.textBox.width / 2, game.camera.height/2 -  230, 'CONTROLS:',
        {
            font: '45px Arial',
            fill: '#ffffff'
        });
    this.controls.fixedToCamera = true;
    this.controls.alfa = 0.7;
    this.controls.visible = false;



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
        this.mines.text = "Mines : " + GALACTIC_STRIKE.player.character.numberOfMines;
        this.minesActivated.text = " Available : " + GALACTIC_STRIKE.player.character.minesCooldown;
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
    this.mines.scale.set(val);
    this.minesActivated.scale.set(val);

}

HUD.prototype.showHelp = function ()
{
    this.textBox.visible = true;
    this.controls.visible = true;
}

HUD.prototype.hideHelp = function ()
{
    this.textBox.visible = false;
    this.controls.visible = false;
}





