GALACTIC_STRIKE.Play = function(game) {

};

GALACTIC_STRIKE.Play.prototype = {
    preload: function(){
        game.load.image('starkek', '../../assets/estrella_kek.jpg');
    },
	create: function() {
        star = game.add.sprite(game.world.centerX, game.world.centerY, 'starkek');
        star.anchor.set(0.5);
	},
	update: function() {

	},
	quitGame: function(pointer) {
		this.state.start('MainMenu');
	},
	render: function() {

	}
};
