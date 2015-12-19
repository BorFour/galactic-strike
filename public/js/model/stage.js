Stage = function (game, conf)
{

    // Stage viene en un .JSON
    // Aquí, en el constructor, se lee el fichero y se guardan individualmente las variables

    //this.name = conf['name'];
    //this.planets = conf['planets'];

    //    game.spacePhysics.addDynamic(this);

    //GREEN BACKGROUND
    //game.stage.backgroundColor = "#122112";

    this.width = conf.width;
    this.height = conf.height;
    this.zoomedOut = false;

    game.world.setBounds(0, 0, conf.width, conf.height);
    //SPACE BACKGROUND
//    var starfield = game.add.sprite(0, 0, conf.backgroundImage);
//    starfield.height = game.world.height;
//    starfield.width = game.world.width;
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    this.planets = [];
    this.CG_planets = game.physics.p2.createCollisionGroup();
    this.CG_characters = game.physics.p2.createCollisionGroup();

    for (var p in conf.planets)
    {
        console.log(conf.planets[p]);
        var s = new Star(conf.planets[p].x, conf.planets[p].y, conf.planets[p].gravityRadius,
            conf.planets[p].gravityForce, conf.planets[p].asset, conf.planets[p].collisionRadius, game);

        this.planets.push(s);
        s.body.setCollisionGroup(this.CG_planets);
        s.body.collides([this.CG_planets, this.CG_characters]);
    }
};

Stage.prototype.zoomIn = function ()
{
    game.camera.bounds.setTo(0, 0, this.width, this.height);
    this.zoomedOut = false;
}

Stage.prototype.zoomOut = function ()
{
    game.camera.bounds.setTo(0, 0, this.width / 2, this.height / 2);
    this.zoomedOut = true;
}

Stage.prototype.inWorld = function (element)
{
    return game.getBounds().intersect(element);
}


Stage.prototype.spawnPositionTeam = function (team)
{

    var angle = Math.random() * 360 - 180;

    console.log(
    {
        angle: angle,
        x: this.planets[team].x,
        y: this.planets[team].y,
        collisionRadius: this.planets[team].collisionRadius
    });

    return {
        x: this.planets[team].x + (this.planets[team].collisionRadius + 50) * Math.sin(angle),
        y: this.planets[team].y + (this.planets[team].collisionRadius + 50) * Math.cos(angle),
        angle: angle
    };

}


Stage.prototype.spawnPositionRandomPlanet = function ()
{

    var dataGen = new Phaser.RandomDataGenerator(Math.random());
    var angle = Math.random() * 360 - 180;
    var planet = this.planets[Math.floor(Math.random * this.planets.length)];

    console.log(
    {
        angle: angle,
        x: planet.x,
        y: planet.y,
        collisionRadius: planet.collisionRadius
    });

    return {
        x: planet.x + planet.collisionRadius * Math.sin(angle),
        y: planet.y + planet.collisionRadius * Math.cos(angle),
        angle: angle
    };

}

Stage.prototype.createObjects = function ()
{
    //        var elementoPrueba = new Element(game, game.world.randomX, game.world.randomY, 'deathstar');
    //        game.physics.box2d.enable(elementoPrueba);


    // Mira cómo instancio a la poción
    // la variable 'items' se encuentra en 'items.json', donde estarán definidos todos los objetos del juego

    //        var objetoPrueba = new Item(game, game.world.randomX, game.world.randomY, items['potion']);
    //        game.physics.box2d.enable(objetoPrueba);
    //        game.spacePhysics.addDynamic(objetoPrueba);

}
