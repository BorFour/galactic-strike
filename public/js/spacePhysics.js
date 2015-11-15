

/**
 *
 * @
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

SpacePhysics.prototype.isGrounded = function isGrounded(body){
    var vs = 25
    return (Math.abs(body.velocity.x) < vs) && (Math.abs(body.velocity.y) < vs)
}


/**
 * @
 * Añade un objeto al grupo de elementos dinámicos del motor
 */

SpacePhysics.prototype.addDynamic = function (body){
    this.dynamicGroup.add(body)
}

SpacePhysics.prototype.update = function (){
        // Para cada elemento dinámico
		for(var i=0;i<this.dynamicGroup.total;i++){
			var c = this.dynamicGroup.getChildAt(i);
			// Para cada planeta (generador de gravedad)
            if (c.body.static) continue;
			for(var j=0;j<this.planetGroup.total;j++){
				var p = this.planetGroup.getChildAt(j);
				// Distancia entre dos puntos
				var distance = Phaser.Math.distance(c.body.x,c.body.y,p.x,p.y);
				// Si la distancia es menor que el radio de acción del planeta
				x = c.body.x;
				y = c.body.y;
				if(distance<p.width/2+p.gravityRadius/2){
					// calculating angle between the planet and the crate
					var angle = Phaser.Math.angleBetween(c.body.x,c.body.y,p.x,p.y);
					// add gravity force to the crate in the direction of planet center
					c.body.applyForce(p.gravityForce*Math.cos(angle)*this.forceReducer,p.gravityForce*Math.sin(angle)*this.forceReducer);
                }
            }
        }
}













