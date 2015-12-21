//Inheritance
Item.prototype = Object.create(Element.prototype);
Item.prototype.constructor = Element;

function Item(game, x, y, conf)
{
    if (conf.colors)
    {

    }
    else
    {
        Element.call(this, game, x, y, conf.asset);
    }
//    game.physics.box2d.enable(this);
    game.physics.p2.enable(this, false);
    //    game.spacePhysics.addDynamic(this);
    this.use = conf.use;
    this.owner = null;
    this.collide = conf.collide;
    if (conf.body)
    {
        conf.body(this);
    }
    if (conf.scale)
    {
        this.scale.set(conf.scale);
    }

}

Item.prototype.use = function () {

}

Item.prototype.die = function ()
{

//    this.body.destroy();
    this.destroy();

}
