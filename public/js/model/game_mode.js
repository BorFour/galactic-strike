
GameMode = function (room, data) {


    this.room = room;
    for (var d in data){
        this[d] = data[d];
    }

};
