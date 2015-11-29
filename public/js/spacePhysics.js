

/**
 *
 * @file spacePhysics.js
 * @date 07/11/2015
 */

function SpacePhysics(game){
    this.game = game;

    // groups containing crates and planets

    this.dynamicGroup = game.add.group();
    this.planetGroup = game.add.group();
    this.planet;

    //flag for gameover and limit of crates
    this.gameover = 0;
    this.numCrates = 0;
    this.numCollision = 0;
    this.x = -1;
    this.y = -1;

    this.grounded = false;

    // a force reducer to let the simulation run smoothly

    this.forceReducer = 0.015;

    // graphic object where to draw planet gravity area

    this.gravityGraphics;
    this.sprite;
    this.debug = false;


}

SpacePhysics.prototype.consoleLog = function() {
    console.log("@Physics: " + dynamicGroup);
};

SpacePhysics.prototype.addPlanet = function (planet) {
        this.planetGroup.add(planet);
        return planet;
}

/**
 * Adds an object to the space physics engine's dynamic group
 * @param {Element} sprite element with a body
 */

SpacePhysics.prototype.addDynamic = function (sprite){
    this.dynamicGroup.add(sprite)
}

SpacePhysics.prototype.update = function (){
        // Para cada elemento dinámico
		for(var i=0;i<this.dynamicGroup.total;i++){
			var c = this.dynamicGroup.getChildAt(i);
            var atmosphere = []; // Planetas en cuya atmósfera se encuentra c
			// Para cada planeta (generador de gravedad)
            if (c.body.static) continue;
			for(var j=0;j<this.planetGroup.total;j++){
				var p = this.planetGroup.getChildAt(j);
				// Distancia entre dos puntos
				var distance = Phaser.Math.distance(c.x,c.y,p.x,p.y);
				// Si la distancia es menor que el radio de acción del planeta
				x = c.x;
				y = c.y;
				if(distance<p.width/2+p.gravityRadius/2){
					// calculating angle between the planet and the crate
					var angle = Phaser.Math.angleBetween(c.x,c.y,p.x,p.y);
					// add gravity force to the crate in the direction of planet center
                    c.body.applyForce(p.gravityForce*Math.cos(angle)*this.forceReducer,
                              p.gravityForce*Math.sin(angle)*this.forceReducer);
                    atmosphere.push(p);
                }
            }
            c.atmosphere = atmosphere;
        }
}










