

function Item (game,x,y, conf) {
    Element.call(this,game,x,y, conf['asset']);
    game.add.existing(this);
    game.physics.box2d.enable(this);
    game.spacePhysics.addDynamic(this);
    this.use = conf['use'];             // Función que se ejecuta cuando se 'usa' el objeto
    this.owner = null;
    this.collide = conf['collide'];
    if (conf['body']){
        conf['body'](this);
    }
}
//Inheritance
Item.prototype = Object.create(Element.prototype);
Item.prototype.constructor = Element;

// ¿Hereda el método 'update' de 'Element'?
//    Item.prototype.update = function () {

// }

Item.prototype.use = function (){

}

Item.prototype.destroy = function (){
    this.body.destroy();
    this.kill();
}

