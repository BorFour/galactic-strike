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
    console.log("Preload preloader")
    game.load.image('starBackground', '../assets/starBackground.jpg')
    game.load.image('star', '../assets/estrella.png');
    game.load.audio('guiles', '../assets/sound/guiles_theme.mp3');
    game.load.audio('checker', '../assets/sound/checker_knights.mp3');
    /*
     * http://downloads.khinsider.com/game-soundtracks/album/super-smash-bros.-melee-original-sound-version
     */
    game.load.audio('muteCity', '../assets/sound/mute_city.mp3');
//    game.load.audio('dedede', '../assets/sound/king_dedede.mp3');

},
create: function () {

    GALACTIC_STRIKE.player = new Player("Default");
    GALACTIC_STRIKE.songs = [];
    GALACTIC_STRIKE.songs.push(game.add.audio('guiles'));
    GALACTIC_STRIKE.songs.push(game.add.audio('checker'));
    GALACTIC_STRIKE.songs.push(game.add.audio('muteCity'));
//    GALACTIC_STRIKE.songs.push(game.add.audio('dedede'));
    GALACTIC_STRIKE.songs[Math.floor(Math.random()*GALACTIC_STRIKE.songs.length)].play();




    /////////////////////
    // FONDO DE ESTRELLAS
    /////////////////////



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
    /////////////////////
    // TWEEN GALACTIC STRIKE + MENU OPTIONS
    /////////////////////
    var nameLabel = game.add.text(game.world.centerX, -50, 'GALACTIC STRIKE!',{ font: '70px Geo   ', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

    game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
    //game.add.tween(nameLabel).to({angle: -5}, 500).to({angle: 5}, 300).loop().start();

     // Explain how to start the game
        var startLabel = game.add.text(game.world.centerX, game.world.height-80,
                                       'press SPACEBAR to START',{ font: '25px Arial', fill: '#ffffff' });

         var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // When the 'upKey' is pressed, it will call the 'start' function once
        spaceKey.onDown.addOnce(this.startGame, this);



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
