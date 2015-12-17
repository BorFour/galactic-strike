var bgSprite;
var textData;
var myText;

var selected;

var length;

var style3 = {
    font: "bold 16px Arial",
    fill: "#000",
    boundsAlignH: "center",
    boundsAlignV: "middle"
};

function TextField(x, y, length, sprite) {
    this.length = length;
    this.bgSprite = game.add.sprite(x, y, sprite);
    this.bgSprite.scale.setTo(2.5, 1);
    this.bgSprite.inputEnabled = true;
    this.textData = "";
    this.myText = game.add.text(x + 25, y + 15, '', style3);
    this.myText.fontSize = 16;
    this.myText.fill = '#000';
    this.selected = true;
    game.input.keyboard.addCallbacks(this, null, this.keyPress, null);

//    this.bgSprite.events.onInputDown.add(this.selector, this);
}

TextField.prototype.keyPress = function(data) {

    if(this.selected) {
        switch(data.keyCode) {
            case Phaser.Keyboard.ENTER:
//                this.textData = this.textData.substring(0, this.textData.length - 1);
//                this.myText.text = this.textData;
                socket.emit('lobbyMessage', {nick : GALACTIC_STRIKE.player.nickname, msg : this.myText.text});
                this.textData = "";
                this.myText.text = "";
                break;
            case 8 :
                this.textData = this.textData.substring(0, this.textData.length - 1);
                this.myText.text = this.textData;
                break;
            default:
                if ((this.textData.length + 1) <= this.length) {
                    var char = String.fromCharCode(data.keyCode).toString();
                    if (char.length > 0) {
                        this.textData += char;
                        this.myText.text = this.textData;
                    }
                }
                break;
        }
    }
};

TextField.prototype.selector = function() {
    this.selected = !this.selected;
};
