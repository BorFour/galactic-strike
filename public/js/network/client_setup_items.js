clientSetupItems = function ()
{


    socket.on('createItem', function (input)
    {

        console.log('@Client <-      \t| createItem');

        GALACTIC_STRIKE.room.stage.addItem(input.index, input.key, input.pos);


    });

    socket.on('updateStage', function (input)
    {

        console.log('@Client <-      \t| updateStage');

        for (var i in input.items)
        {
            GALACTIC_STRIKE.room.stage.updateItem(input.items[i].index, input.items[i].pos);
        }


    });

    socket.on('pickUpItem', function (input)
    {

        console.log('@Client <-      \t| pickUpItem');

        var item = GALACTIC_STRIKE.room.stage.items[input.index];
        var character = GALACTIC_STRIKE.room.players[input.id].character;

        if (item && item.alive && character && character.alive)
        {
            GALACTIC_STRIKE.room.gameMode.items[GALACTIC_STRIKE.room.stage.items[input.index].key].pickUp(item, character, GALACTIC_STRIKE.room.stage);
        }


    });

}
