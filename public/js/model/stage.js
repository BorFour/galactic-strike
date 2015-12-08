

Stage = function (game, conf) {

    // Stage viene en un .JSON
    // Aquí, en el constructor, se lee el fichero y se guardan individualmente las variables

    //this.name = conf['name'];
    //this.planets = conf['planets'];

//    game.spacePhysics.addDynamic(this);

    //GREEN BACKGROUND
    //game.stage.backgroundColor = "#122112";

    game.world.setBounds(0, 0, conf.width, conf.height);
    //SPACE BACKGROUND
    var starfield = game.add.sprite(0, 0, conf.backgroundImage);
    starfield.height = game.world.height;
    starfield.width = game.world.width;
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    this.planets = [];

    for(var p in conf.planets){
        console.log(conf.planets[p]);
        this.planets.push(new Star(conf.planets[p].x, conf.planets[p].y, conf.planets[p].gravity, conf.planets[p].gravityForce, conf.planets[p].asset, conf.planets[p].collisionRadius,game));
    }
};


Stage.prototype.preload = function(player) {

    // Aquí carga todos los assets importados en el constructor

}


Stage.prototype.create = function (){

    // Aquí carga todos sprites

}

