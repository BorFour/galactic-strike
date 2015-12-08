function Star (x, y, gravityRadius, gravityForce, asset, collisionRadius, game) {

        Element.call(this, game, x, y, asset);
        game.add.existing(this);

//      this.sprite = game.add.sprite(x, y, asset);
        this.anchor.setTo(0.5, 0.5)
        this.gravityRadius = gravityRadius;
        this.gravityForce = gravityForce;
        this.game = game;
//        this.planetGroup.add(planet);
        game.spacePhysics.addPlanet(this);
        this.game.physics.box2d.enable(this);
        this.body.static = true;

        // look how I create a circular body
        if(collisionRadius){ // Collision body correction
            this.body.setCircle(collisionRadius);
            gravityGraphics.drawCircle(this.x, this.y, collisionRadius+this.gravityRadius);
        } else {
            this.body.setCircle(this.width / 2);
            gravityGraphics.drawCircle(this.x, this.y, this.width+this.gravityRadius);
        }
        console.log("@Star: " + "planet created -> \n" + this);
}

// Herencia
Star.prototype = Object.create(Element.prototype);
Star.prototype.constructor = Element;


Star.prototype.toString = function(){
    return "Star " + this.key + " (" + this.x + "," + this.y + ")";
}
