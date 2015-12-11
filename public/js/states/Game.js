//	100% of the browser window - see Boot.js for additional configuration

var game;

begin_game = function () {

    var SAFE_ZONE_WIDTH = 1600;// * window.devicePixelRatio;
    var SAFE_ZONE_HEIGHT = 900;// * window.devicePixelRatio;
    game = new Phaser.Game(SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT, Phaser.AUTO, '');
    //	Add the States your game has.

    game.state.add('Boot', GALACTIC_STRIKE.Boot);
    game.state.add('Loader', GALACTIC_STRIKE.Loader);
    game.state.add('MainMenu', GALACTIC_STRIKE.MainMenu);
    game.state.add('Lobby', GALACTIC_STRIKE.Lobby);
    game.state.add('Play', GALACTIC_STRIKE.Play);
    game.state.add('PlayGame', GALACTIC_STRIKE.PlayGame);
    //	Now start the Boot state.
    game.state.start('Boot');

}

begin_game();
