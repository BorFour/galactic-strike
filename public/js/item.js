

function Item (game,x,y, asset) {
    Element.call(this,game,x,y, asset);
    game.add.existing(this);
}
//Inheritance
    Item.prototype = Object.create(Element.prototype);
    Item.prototype.constructor = Element;

// ¿Hereda el método 'update' de 'Element'?
//    Item.prototype.update = function () {

// }

Item.prototype.use = function (){

}
