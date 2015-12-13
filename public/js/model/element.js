function Element(game, x, y, asset) {
    //    Phaser.Sprite.call(this,game,x,y,'drones');
    //    //sprite properties
    //    this.animations.add('fly',[0,1,2],10,true,true);
    //    this.animations.play('fly');
    //    this.anchor.setTo(0.5,0.5);
    //    this.rotation = Math.PI/2;
    //    this.speed = 0.2;
    Phaser.Sprite.call(this, game, x, y, asset);
    game.add.existing(this);
}
//Inheritance
Element.prototype = Object.create(Phaser.Sprite.prototype);
Element.prototype.constructor = Element;

Element.prototype.update = function () {

    var data = {
        x: this.x,
        y: this.y,
        angle: this.angle,
        velocityX: this.body.velocity.x,
        velocityY: this.body.velocity.y
    }

    socket.emit('updateElement', data);
}
