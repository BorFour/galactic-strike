Star = function (posX, posY, gravityRadius, gravityForce, asset, game) {
		this.sprite = game.add.sprite(posX, posY, asset);
        this.sprite.anchor.setTo(0.5, 0.5)
        this.sprite.gravityRadius = gravityRadius;
        this.sprite.gravityForce = gravityForce;
        this.game = game;
//        this.planetGroup.add(planet);
        game.spacePhysics.addPlanet(this.sprite);
        this.game.physics.box2d.enable(this.sprite);
        this.sprite.body.static = true;

        // look how I create a circular body
        this.sprite.body.setCircle(this.sprite.width / 2);
        gravityGraphics.drawCircle(this.sprite.x, this.sprite.y,       this.sprite.width+this.sprite.gravityRadius);
        console.log("@Star: " + "planet created -> \n" + this);


}


Star.prototype.toString = function(){
    return "Star " + this.sprite.key + " (" + this.sprite.x + "," + this.sprite.y + ")";
}
