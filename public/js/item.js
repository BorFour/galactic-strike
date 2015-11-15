

function Item (game,x,y, conf) {
    Element.call(this,game,x,y, conf['asset']);
    game.add.existing(this);
    game.spacePhysics.addDynamic(this);
    this.use = conf['use'];             // Función que se ejecuta cuando se 'usa' el objeto
    this.owner = null;
}
//Inheritance
    Item.prototype = Object.create(Element.prototype);
    Item.prototype.constructor = Element;

// ¿Hereda el método 'update' de 'Element'?
//    Item.prototype.update = function () {

// }

Item.prototype.use = function (){

}
