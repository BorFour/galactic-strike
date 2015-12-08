

Stage = function (game, conf) {

    // Stage viene en un .JSON
    // Aquí, en el constructor, se lee el fichero y se guardan individualmente las variables

    //this.name = conf['name'];
    //this.planets = conf['planets'];

//    game.spacePhysics.addDynamic(this);
   for(var p in conf['planets']){
       new Star(p.x, p.y, p.gravity, p.gravityForce, p.asset, game);
   }

    // etc.

};


Stage.prototype.preload = function(player) {

    // Aquí carga todos los assets importados en el constructor

}


Stage.prototype.create = function (){

    // Aquí carga todos sprites

}

