
clientSetupItems = function () {


    socket.on('createItem', function (input)
    {

        console.log('@Client <-      \t| createItem');

        GALACTIC_STRIKE.room.stage.addItem(input.index, input.key, input.pos);


    });

    socket.on('updateItem', function (input)
    {

        console.log('@Client <-      \t| updateItem');

        GALACTIC_STRIKE.room.stage.updateItem(input.index, input.pos);


    });

    socket.on('pickUpItem', function (input)
    {

        console.log('@Client <-      \t| updateItem');

        GALACTIC_STRIKE.room.stage.pickUpItem(input.index, GALACTIC_STRIKE.room.players[input.id].character);

    });

}
