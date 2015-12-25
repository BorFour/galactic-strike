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
    this.itemRate = 7000; //ms
    //    game.world.setBounds(0, 0, conf.width, conf.height);

    //SPACE BACKGROUND
    //    var starfield = game.add.sprite(0, 0, conf.backgroundImage);
    //    starfield.height = game.world.height;
    //    starfield.width = game.world.width;
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    this.planets = [];

    for (var p in conf.planets)
    {
        console.log(conf.planets[p]);
        var s = new Star(conf.planets[p].x, conf.planets[p].y, conf.planets[p].gravityRadius,
            conf.planets[p].gravityForce, conf.planets[p].asset, conf.planets[p].collisionRadius, game);

        this.planets.push(s);
        s.body.setCollisionGroup(game.spacePhysics.CG_planets);
        for (var t in GALACTIC_STRIKE.room.teams)
        {
            s.body.collides(game.spacePhysics.CG_teams[t]);
        }

        s.body.collides(game.spacePhysics.CG_attacks);
    }

    this.wormholes = [];

    for (var w in conf.wormholes)
    {
        console.log(conf.wormholes[w]);

        var s = new Star(conf.wormholes[w].x, conf.wormholes[w].y, conf.wormholes[w].gravityRadius,
            conf.wormholes[w].gravityForce, conf.wormholes[w].asset, conf.wormholes[w].collisionRadius, game);

        this.wormholes.push(s);
        s.sound = game.add.audio('wormholeSound', 0.8, false);
        s.body.setCollisionGroup(game.spacePhysics.CG_wormholes);
        for (var t in GALACTIC_STRIKE.room.teams)
        {
            s.body.collides(game.spacePhysics.CG_teams[t], touchWormholeCallback2, this);
        }
        //this.wormholes[w] = game.add.sprite(139, 140, 'wormhole');
        // Add an animation
        this.wormholes[w].animations.add('rotate', [0, 1, 2, 3, 4, 5]);
        //Plays the animation at a constant rate of 20 frames per second and it loops because the last parameter is true
        this.wormholes[w].animations.play('rotate', 20, true);

    }

    for (var w in this.wormholes)
    {
        this.wormholes[w].nextWormholes = [];
        for (var w2 in this.wormholes)
        {
            if (w === w2)
            {
                continue;
            }
            this.wormholes[w].nextWormholes.push(this.wormholes[w2]);
        }
    }


    this.itemsAvailable = [];
    this.items = [];

    for (var i in conf.items)
    {
        this.itemsAvailable.push(conf.items[i]);
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



Stage.prototype.spawnPosition = function (mode, arg)
{

    var angle = Math.random() * 360 - 180;
    var result = {};
    var arg = arg || null;

    switch (mode)
    {
    case 'planet':

        var planet;

        if (!arg)
        {
            throw new Error("Mode 'planet' needs an argument");
        }
        else if (typeof arg == 'Star')
        {
            planet = arg;
        }
        else if (arg == 'any')
        {
            planet = this.planets[Math.floor(this.planets.length * Math.random())];
        }

        result.x = planet.x + planet.collisionRadius * Math.sin(angle);
        result.y = planet.y + planet.collisionRadius * Math.cos(angle);
        result.angle = angle;
        break;

    case 'team':

        if (!arg || isNaN(arg))
        {
            throw new Error("Mode 'team' needs a numeric argument");
        }
        result.x = this.planets[arg].x + (this.planets[arg].collisionRadius + 50) * Math.sin(angle);
        result.y = this.planets[arg].y + (this.planets[arg].collisionRadius + 50) * Math.cos(angle);
        result.angle = angle;

        break;

    case 'space':


        break;

    default:

    }

    return result;

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


Stage.prototype.spawnPositionPlanet = function (planet)
{

    //    var dataGen = new Phaser.RandomDataGenerator(Math.random());
    var angle = Math.random() * 360 - 180;

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

//Stage.prototype.createItems = function ()
//{
//    //        var elementoPrueba = new Element(game, game.world.randomX, game.world.randomY, 'deathstar');
//    //        game.physics.box2d.enable(elementoPrueba);
//
//
//    // Mira cómo instancio a la poción
//    // la variable 'items' se encuentra en 'items.json', donde estarán definidos todos los objetos del juego
//
//    //        var objetoPrueba = new Item(game, game.world.randomX, game.world.randomY, items['potion']);
//    //        game.physics.box2d.enable(objetoPrueba);
//    //        game.spacePhysics.addDynamic(objetoPrueba);
//
//    var time = this.itemRate * Math.random();
//    var pos = this.spawnPositionPlanet(this.planets[Math.floor(this.planets.length * Math.random())]);
//    var item = new Item(game, pos.x, pos.y, items[this.itemsAvailable[Math.floor(this.itemsAvailable.length * Math.random())]]);
//    game.physics.p2.enable(item);
//    item.body.rotation = pos.angle;
//    this.items.push(item);
//
//
//    game.time.events.add(time, this.createItems, this);
//
//}


Stage.prototype.addItem = function (index, key, pos)
{

    var item = new Item(game, pos.x, pos.y, items[key]);
    game.physics.p2.enable(item);
    item.key = key;
    item.index = index;
    item.body.rotation = pos.angle;
    this.items[index] = item;

    item.body.setCollisionGroup(game.spacePhysics.CG_stageItems);
    for (var t in game.spacePhysics.CG_teams)
    {
        item.body.collides(game.spacePhysics.CG_teams[t], touchItemCallback, this);
    }
    item.body.collides([game.spacePhysics.CG_planets, game.spacePhysics.CG_stageItems]);

}

Stage.prototype.updateItem = function (index, pos)
{

    this.items[index].x = pos.x;
    this.items[index].y = pos.y;

}

Stage.prototype.itemsData = function ()
{

    var result = [];

    for (var i in this.items)
    {
        result.push(
        {
            index: i,
            pos:
            {
                x: this.items[i].x,
                y: this.items[i].y
            }
        });
    }

    return result;
}


Stage.prototype.pickUpItem = function (index, character) {



}

Stage.prototype.deleteItem = function (index)
{

    this.items[index].destroy();

}
