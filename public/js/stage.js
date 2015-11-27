

Stage = function (path) {

    var conf = path;
    // Stage viene en un .JSON
    // Aquí, en el constructor, se lee el fichero y se guardan individualmente las variables

    this.name = conf['name'];
    this.planets = conf['planets'];
    // etc.

};


Stage.prototype.preload = function(player) {

    // Aquí carga todos los assets importados en el constructor

}


Stage.prototype.create = function (){

    // Aquí carga todos sprites

}

