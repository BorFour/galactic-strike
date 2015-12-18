var game;

/**
 * Function that initializes the Phaser.Game, adds the states and starts 'Boot'
 * @public
 * @property undefined
 */

begin_game = function ()
{

    game = new Phaser.Game(GALACTIC_STRIKE.RESOLUTION.WIDTH, GALACTIC_STRIKE.RESOLUTION.HEIGHT, Phaser.AUTO, '');

    //	Add the states your game has.
    game.state.add('Boot', GALACTIC_STRIKE.Boot);
    game.state.add('Loader', GALACTIC_STRIKE.Loader);
    game.state.add('MainMenu', GALACTIC_STRIKE.MainMenu);
    game.state.add('Lobby', GALACTIC_STRIKE.Lobby);
    game.state.add('Play', GALACTIC_STRIKE.Play);
    //	Now start the Boot state.
    game.state.start('Boot');

}

begin_game();
