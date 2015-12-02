

/**
 *
 * @file spacePhysics.js
 * @date 07/11/2015
 */

function SpacePhysics(game){
    this.game = game;

    // groups containing crates and planets

    this.dynamicGroup = [];
    this.planetGroup = [];
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

/**
 * Adds an object to the space physics engine's planet group (bodies with a gravitational field)
 * @param {Element} sprite element with a body
 */

SpacePhysics.prototype.addPlanet = function (planet) {
        this.planetGroup.push(planet);
        return planet;
}

/**
 * Adds an object to the space physics engine's dynamic group
 * @param {Element} sprite element with a body
 */

SpacePhysics.prototype.addDynamic = function (sprite){
    this.dynamicGroup.push(sprite)
}

/**
 * This function is called in the game loop. It applies the gravitational field of each planet to each dynamic element
 */

SpacePhysics.prototype.update = function (){
        // Para cada elemento dinámico
		for(var i=0;i<this.dynamicGroup.length;i++){
			var c = this.dynamicGroup[i];
            var atmosphere = []; // Planetas en cuya atmósfera se encuentra c
			// Para cada planeta (generador de gravedad)
            if (c.body.static) continue;
			for(var j=0;j<this.planetGroup.length;j++){
				var p = this.planetGroup[j];
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










