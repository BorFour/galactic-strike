GALACTIC_STRIKE.Loader = function (game)
{
    this.ready = false;
};

var distance = 300;
var speed = 2;
var stars;

var max = 200;
var xx = [];
var yy = [];
var zz = [];

play_songs = function ()
{
    GALACTIC_STRIKE.songs = [];
    //    GALACTIC_STRIKE.songs.push(game.add.audio('guiles', 0.45, true));
    //    GALACTIC_STRIKE.songs.push(game.add.audio('checker', 0.45, true));
    //    GALACTIC_STRIKE.songs.push(game.add.audio('muteCity', 0.45, true));
    //    GALACTIC_STRIKE.songs.push(game.add.audio('dreamLand', 0.45, true));
    //    GALACTIC_STRIKE.songs.push(game.add.audio('witch', 0.45, true));
    //    GALACTIC_STRIKE.songs.push(game.add.audio('dedede'));
    GALACTIC_STRIKE.songs.push(game.add.audio('pingasDreamLand', 0.30, true));
    GALACTIC_STRIKE.redTeamAnthem = game.add.audio('sovietAnthem', 0.80, true);
    GALACTIC_STRIKE.blueTeamAnthem = game.add.audio('starsAndStripes', 0.80, true);
    GALACTIC_STRIKE.currentSong = GALACTIC_STRIKE.songs[Math.floor(Math.random() * GALACTIC_STRIKE.songs.length)];
//    GALACTIC_STRIKE.currentSong.play();

    game.sound.volume = 0.2;
    game.sound.mute = true;
}

/**
 * Load all the assets (images and sound) for this game
 */

load_assets = function ()
{

    //MUSIC
    ///////////////////////

    game.load.audio('pingasDreamLand', '../assets/sound/songs/pingas_dreamland.mp3');
    game.load.audio('sovietAnthem', '../assets/sound/songs/soviet_anthem.mp3');
    game.load.audio('starsAndStripes', '../assets/sound/songs/stars_and_stripes.mp3');
    /*
     * http://downloads.khinsider.com/game-soundtracks/album/super-smash-bros.-melee-original-sound-version
     */
    //    game.load.audio('guiles', '../assets/sound/songs/guiles_theme.mp3');
    //    game.load.audio('checker', '../assets/sound/songs/checker_knights.mp3');
    //    game.load.audio('muteCity', '../assets/sound/songs/mute_city.mp3');
    //    game.load.audio('dreamLand', '../assets/sound/songs/dream_land.mp3');
    //    game.load.audio('witch', '../assets/sound/songs/witch_doctor.mp3');
    //    game.load.audio('dedede', '../assets/sound/king_dedede.mp3');

    //GAME SOUND
    ///////////////////////
    game.load.audio('pingas', '../assets/sound/pingas.mp3');
    game.load.audio('dieSound', '../assets/sound/pingas_death.mp3');
    game.load.audio('hitSound', '../assets/sound/pingas_hit.mp3');
    game.load.audio('jetpackSound', '../assets/sound/pingas_jetpack.mp3');

    //BACKGROUNDS
    ///////////////////////
    //game.load.image("spaceBackground", "../assets/backgrounds/spaceBackground.jpg");
    game.load.image('starBackground', '../assets/backgrounds/starBackground.jpg');
    game.load.image('background_map2', '../assets/backgrounds/background_map2.jpg');
    game.load.image('fondo_estrellas', '../assets/backgrounds/fondo_estrellas.jpg');

    //ITEMS
    ///////////////////////
    game.load.image("pokeball", "../assets/pokeball.png");
    game.load.image("potion", "../assets/potion.gif");
    game.load.image("moon", "../assets/planets/moon1.png");
    game.load.image("bullet", "../assets/blue-bullet.gif");
    game.load.image("laser_bullet", "../assets/laser_bullet.jpg");
    game.load.image("cucumber", "../assets/cucumber.png");
    game.load.image("red_mine", "../assets//attacks/red_mine.png");
    game.load.image("blue_mine", "../assets//attacks/blue_mine.png");
    game.load.image("misil", "../assets/misil.png");
    game.load.image("stick", "../assets/stick.gif");
    game.load.image("hammer", "../assets/attacks/hammer.png");
    game.load.image("spaceAttack1", "../assets/attacks/space_attack.png");
    game.load.image("punch", "../assets/attacks/punchglove.png");
    game.load.image("heart", "../assets/heart.png");

    //PLAYERS
    ///////////////////////
    game.load.spritesheet("playerRed", "../assets/spritesIndividuales/robotnik/robotnik_red_turbo.png", 48, 87); //rueda: 26_23  | robotnik: 49_43
    game.load.spritesheet("playerBlue", "../assets/spritesIndividuales/robotnik/robotnik_blue_turbo.png", 48, 87); //rueda: 26_23  | robotnik: 49_43
    game.load.image("wheel_red", "../assets/spritesIndividuales/robotnik/wheel_red.png");
    game.load.image("wheel_blue", "../assets/spritesIndividuales/robotnik/wheel_blue.png");

    //PLANETS
    ///////////////////////
    game.load.image("sun", "../assets/planets/sun.png");
    game.load.image("planet_blue", "../assets/planets/planet_blue.png");
    game.load.image("planet_red", "../assets/planets/planet_red.png");
    game.load.image("giantplanet", "../assets/planets/giantplanet.png");
    game.load.image("giant_moon", "../assets/planets/giantmoon.png");
    game.load.image("wormhole_1", "../assets/planets/wormhole_1.png");
    game.load.image("wormhole_2", "../assets/planets/wormhole_2.png");
    game.load.spritesheet("wormhole", "../assets/planets/wormhole_spritesheet1.png", 139, 140);

    //BUTTONS
    ///////////////////////
    game.load.image('buttonEnter', '../assets/buttons/enterRoom.png');
    game.load.image('buttonCreate', '../assets/buttons/createRoom.png');
    game.load.image("exitButton", "../assets/buttons/boton_exit.png");
    game.load.image("changeMap", "../assets/buttons/change_map.png");
    game.load.image("keyboard", "../assets/buttons/keyboard.png");
    game.load.image("gamepad", "../assets/buttons/gamepad.png");
    game.load.image("mute", "../assets/buttons/mute.png");
    game.load.image("unmute", "../assets/buttons/unmute.png");

    //PHYSICS
    ///////////////////////
    game.load.physics('robotnikShape', 'assets/physics/robotnik_shape.json');


    //OTHER
    ///////////////////////
    game.load.image('redTeam', '../assets/lobby/red_team.jpg');
    game.load.image('blueTeam', '../assets/lobby/blue_team.jpg');
    game.load.image('star', '../assets/estrella.png');
    game.load.image('textBox', '../assets/textbox.gif');
    game.load.image('galactic', '../assets/galactic.png');
    game.load.image('strike', '../assets/strike.png');

}

server_connection = function ()
{

    // Creates the connection with the server
    socket = io();
    console.log(io)
    if (socket)
    {
        console.log(socket)
        console.log("@Socket.io | Client connected");
    }

    // All the handlers for the network events are initialized in this function
    clientSetup();

    socket.emit('login',
    {});
    console.log('@Client ->      \t| login');

}

GALACTIC_STRIKE.Loader.prototype = {
    preload: function ()
    {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
        {
            font: '30px Arial',
            fill: '#ffffff'
        });
        loadingLabel.anchor.setTo(0.5, 0.5);

        // Display the progress bar
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        console.log("Preload Loader");

        // Loads images and music
        load_assets();

    },
    create: function ()
    {


        //        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.M);


        var currentLocation = window.location.search;
        var formName = currentLocation.replace("?name=", "");
        GALACTIC_STRIKE.player = new Player(formName ? decodeURIComponent(formName).substring(0, GALACTIC_STRIKE.maxCharactersName) : "Default");

        //plays some songs
        play_songs();

        server_connection();

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

        // TWEEN GALACTIC STRIKE + MENU OPTIONS
        /////////////////////

        // Add GALACTIC STRIKE title as two images.
        var nameLabel = [];
        nameLabel.push(game.add.sprite(game.world.centerX - 300, game.world.height, 'galactic'));
        nameLabel.push(game.add.sprite(game.world.centerX + 300, game.world.height, 'strike'));

        for (var i in nameLabel)
        {
            nameLabel[i].anchor.setTo(0.5, 0.5);
            game.add.tween(nameLabel[i]).to(
            {
                y: game.world.height / 3
            }, 2500).easing(Phaser.Easing.Bounce.Out).start();
            //game.add.tween(nameLabel).to({angle: -5}, 500).to({angle: 5}, 300).loop().start();
            game.add.tween(nameLabel[i]).to(
            {
                angle: 360
            }, 850, Phaser.Easing.Linear.None, true, 0, true);
        }
        // Explain how to start the game
        var startLabel = game.add.text(game.world.centerX, game.world.height - 100,
            'press SPACEBAR or touch/click anywhere to START',
            {
                font: '25px Arial',
                fill: '#ffffff'
            });
        startLabel.anchor.set(0.5);

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // When the 'upKey' is pressed, it will call the 'start' function once
        spaceKey.onDown.addOnce(this.startGame, this);

        game.input.onTap.add(this.startGame, this);
        game.input.addPointer();

        //        game.input.onDown.add(go_fullscreen, this);


    },
    update: function ()
    {

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
        if (game.input.pointer1.active) this.startGame();

    },
    render: function ()
    {
        //        game.debug.pointer(game.input.pointer1);
    },
    startGame: function ()
    {
        this.state.start('MainMenu');
    }
};

function go_fullscreen()
{
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.startFullScreen();
}
