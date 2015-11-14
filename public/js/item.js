

function Item (game,x,y) {
    Element.call(this,game,x,y);
    game.add.existing(this);
}
//Inheritance
    Item.prototype = Object.create(Phaser.Sprite.prototype);
    Item.prototype.constructor = Element;

// ¿Hereda el método 'update' de 'Element'?
//    Item.prototype.update = function () {

// }
