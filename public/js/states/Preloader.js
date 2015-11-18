GALACTIC_STRIKE.Preloader = function(game) {
    this.ready = false;
};

var distance = 300;
var speed = 2;
var stars;

var max = 200;
var xx = [];
var yy = [];
var zz = [];

GALACTIC_STRIKE.Preloader.prototype = {

preload: function () {
    game.load.image('starBackground', '../../assets/starBackground.jpg')
    game.load.image('star', '../../assets/estrella_kek.jpg');
},
create: function () {
    starfield = game.add.sprite(0, 0, 'starBackground');
    starfield.height = game.world.height;
    starfield.width = game.world.width;

    if (game.renderType === Phaser.WEBGL)
    {
        max = 200;
    }

    var sprites = game.add.spriteBatch();

    stars = [];

    for (var i = 0; i < max; i++)
    {
        xx[i] = Math.floor(Math.random() * 800) - 400;
        yy[i] = Math.floor(Math.random() * 600) - 300;
        zz[i] = Math.floor(Math.random() * 1700) - 100;

        var star = game.make.sprite(0, 0, 'star');
        star.anchor.set(0.5);

        sprites.addChild(star);

        stars.push(star);
    }
         var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        // When the 'upKey' is pressed, it will call the 'start' function once
        upKey.onDown.addOnce(this.startGame, this);

},
update: function () {

    for (var i = 0; i < max; i++)
    {
        stars[i].perspective = distance / (distance - zz[i]);
        stars[i].x = game.world.centerX + xx[i] * stars[i].perspective;
        stars[i].y = game.world.centerY + yy[i] * stars[i].perspective;

        zz[i] += speed;

        if (zz[i] > 290)
        {
            zz[i] -= 600;
        }

        stars[i].alpha = Math.min(stars[i].perspective / 2, 1);
        stars[i].scale.set(stars[i].perspective / 2);
        stars[i].rotation += 0.1;

    }

},
    startGame: function() {
        this.state.start('MainMenu');
    }
};
