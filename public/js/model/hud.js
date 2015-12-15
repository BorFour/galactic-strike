// https://en.wikipedia.org/wiki/HUD_(video_gaming)

function HUD (game) {

    var style = {
        font: "bold 32px Arial",
        fill: "#fff",
    };

    this.score = game.add.text(game.camera.x + game.camera.width/2, game.camera.y + game.camera.height/2 - 350, "Esto es la puntuación", style);
    this.score.anchor.set(0.5);
    this.score.scaleMin = 1;
    this.score.scaleMax = 1;
    this.score.fixedToCamera = true;

};



HUD.prototype.updateText = function () {

    this.score.text =
    GALACTIC_STRIKE.room.teams[0] + " : " +
    GALACTIC_STRIKE.room.gameMode.scores[GALACTIC_STRIKE.room.teams[0]] +
    " " + GALACTIC_STRIKE.room.teams[1] + " : " +
    GALACTIC_STRIKE.room.gameMode.scores[GALACTIC_STRIKE.room.teams[1]];

}

HUD.prototype.scaleSet = function (val) {

    this.score.scale.set(val);

}
