function Element(game, x, y, asset)
{

    Phaser.Sprite.call(this, game, x, y, asset);
    game.add.existing(this);

}
//Inheritance
Element.prototype = Object.create(Phaser.Sprite.prototype);
Element.prototype.constructor = Phaser.Sprite;
