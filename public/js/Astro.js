Astro = function (posX, posY, gravityRadius, gravityForce, asset) {
		planet = game.add.sprite(posX, posY, asset);
        planet.anchor.setTo(0.5, 0.5)
        planet.gravityRadius = gravityRadius;
        planet.gravityForce = gravityForce;
        this.planetGroup.add(planet);
        game.physics.box2d.enable(planet);
        planet.body.static = true;

        // look how I create a circular body
        planet.body.setCircle(planet.width / 2);
        gravityGraphics.drawCircle(planet.x, planet.y,                                          planet.width+planet.gravityRadius);
        if(this.debug) console.log("@Physics: " + "planet created ->" + planet);
        return planet;
}
