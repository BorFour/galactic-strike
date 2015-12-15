// https://en.wikipedia.org/wiki/HUD_(video_gaming)

function HUD (game) {

    var style = {
        font: "bold 32px Arial",
        fill: "#fff",
    };

    this.score = game.add.text(game.world.centerX, game.world.centerY - 350, "Esto es la puntuación", style);
    this.score.anchor.set(0.5);
    this.score.scaleMin = 1;
    this.score.scaleMax = 1;

};
