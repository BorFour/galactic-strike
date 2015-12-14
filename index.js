var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Routing
app.use(express.static(__dirname + '/public'));

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});
// 'connection' y 'disconnect' palabras reservadas?

// usernames which are currently connected to the chat

var currId = 0;
var players = [];
var nPlayers = 0;
var room = {state : 'empty'};
var MAXPLAYERSROOM = 8;
var timestamp = Date.now();

io.on('connection', function (socket) {

    socket.on('login', function (input) {

        var output = {
            id : currId,
            timestamp : timestamp
        };
        console.log('@Server <-      \t| login');
        socket.join('General');

        players[currId] = input;
        socket.game_id = currId;
        currId++;
        nPlayers++;


//        socket.emit('IDPlayers', output);
        socket.emit('ID', output);
        console.log('@Server ->      \t| IDPlayer');
        console.log('@Server log     \t| nPlayers = ' + nPlayers);

    });

    socket.on('update', function (input) {

    //        console.log('@Server received | update');
        players[socket.game_id] = input;
        input.id = socket.game_id;
        socket.broadcast.to('Room1').emit('update', input);
    //        console.log('@Server sent | update');

    });

    socket.on('attack', function (input) {

        socket.broadcast.to('Room1').emit('attack', input);
    //        console.log('@Server sent | update');

    });

    socket.on('hit', function (input) {

        console.log('@Server <-      \t| hit');
        console.log(input);
        io.to('Room1').emit('hit', input);

    });

    //////////
    // ROOM
    //

    socket.on('createRoom', function (input) {

        var output = {};
        output.id = input.id;

         console.log('@Server <-      \t| createRoom');

        if (input.timestamp !== timestamp)
        {
            socket.emit('obsoletClient', output);
            console.log('@Server ->      \t| obsoletClient');
        }
        else if(room.state === 'empty')
        {
            socket.join('Room1');
            room.state = 'lobby';
            room.players = {};
            room.players[input.id] =
            {
                name : input.name,
                team : -1
            };
            room.host = input.id;
            socket.emit('roomCreated', output);

        }


    });


    socket.on('joinRoom', function (input) {

        var output = {};
        output.id = input.id;
        output.name = input.name;
        output.host = room.host;

        console.log('@Server <-      \t| joinRoom');

        if (input.timestamp !== timestamp)
        {
            socket.emit('obsoletClient', output);
            console.log('@Server ->      \t| obsoletClient');
        }
        else if (room.state === 'ingame')
        {
            socket.emit('roomIngame');
            return;
        }
        else if(room.state === 'lobby')
        {
            socket.room = 'Room1';
            socket.join('Room1');
    //            console.log(socket.rooms);
            room.players[input.id] =
            {
                name : input.name,
                team : -1
            };
            output.players = room.players;
            io.to('Room1').emit('joinRoom', output);
            console.log('@Server ->      \t| joinRoom');

        }
    //           socket.emit('userJoinedRoom', output);

    });

    socket.on('changeTeam', function (input) {

        var output = {};
        output.id = input.id;
        output.team = input.team;

        var playersInTeam = 0;

        for (var p in room.players){
            if(room.players[p].team === input.team) playersInTeam++;
        }

        if (playersInTeam >= 4) return;

        room.players[input.id].team = input.team;

         console.log('@Server <-      \t| changeTeam');

        if(room.state === 'lobby')
        {
            io.to('Room1').emit('changeTeam', output);
            console.log('@Server ->      \t| changeTeam');
        }


    });

    socket.on('leaveRoom', function (input) {

        var output = {};
        output.id = input.id;

        socket.leave('Room1');
        delete room.players[input.id];
        io.to('Room1').emit('userLeftRoom', output);

    });


    //////////
    // GAME
    //

    socket.on('joinGame', function (input) {

        var output = {};
        output.id = input.id;
        output.x = input.x;
        output.y = input.y;
        output.angle = input.angle;
    //        output.name = room.players[input.id];

        console.log('@Server <-      \t| joinGame');

        if(room.state === 'ingame')
        {
            io.to('Room1').emit('userJoinedGame', output);
            console.log('@Server ->      \t| joinGame');
        }


    });

    socket.on('leaveGame', function (input) {

        var output = {};
        output.id = socket.game_id;

        console.log('@Server <-      \t| leaveGame');
        console.log('@Server log     \t| user ' + socket.game_id + ' left')

        io.to('Room1').emit('userLeftGame', output);
        socket.leave('Room1');
        console.log('@Server ->      \t| userLeftGame');

        delete room.players[socket.game_id];

        var playersRoom = 0;
        for (var pr in room.players) playersRoom ++;

        if(playersRoom === 0)
        {
            console.log('@Server log     \t| empty room');
            room.state = 'empty';
        }
        else
        {
            console.log('@Server log     \t| players left in room:');
            console.log(room.players);
        }

    });

    socket.on('beginMatch', function (input) {

        var output = {};
        output.id = input.id;

        console.log('@Server <-      \t| beginMatch');

        if(input.id !== room.host)
        {

        }
        else if  (room.state !== 'lobby')
        {

        }
        else
        {
            room.state = 'ingame';
            io.to('Room1').emit('beginMatch', output);
            console.log('@Server ->      \t| beginMatch');
        }

    });

    socket.on('finishRound', function (input) {

        var output = {};
        output.id = input.id;

        console.log('@Server <-      \t| finishRound');

        if(input.id !== room.host)
        {

        }
        else if  (room.state !== 'ingame')
        {

        }
        else
        {
            io.to('Room1').emit('finishRound', output);
            console.log('@Server ->      \t| finishRound');
        }

    });

    socket.on('respawn', function (input) {

        var output = {};
        output.id = input.id;
        output.x = input.x;
        output.y = input.y;
        output.angle = input.angle;

        console.log('@Server <-      \t| respawn');

        if (room.state !== 'ingame')
        {

        }
        else
        {
            io.to('Room1').emit('respawn', output);
            console.log('@Server ->      \t| respawn');
        }

    });


    socket.on('disconnect', function () {

        var output = {};

        console.log('@Server <-      \t| disconnect');
        console.log('@Server log     \t| user ' + socket.game_id + ' left')

        if(isNaN(socket.game_id)) return;

        output.id = socket.game_id;
        socket.broadcast.emit('userLeft', output);

        delete players[socket.game_id];
        if(room.players && room.players[socket.game_id]) delete room.players[socket.game_id];

        var playersRoom = 0;
        for (var pr in room.players) playersRoom ++;
        if(playersRoom === 0) {
            console.log('@Server log     \t| empty room');
            room.state = 'empty';
        } else{
            console.log(room.players);
        }
        nPlayers--;

        console.log('@Server ->      \t| userLeft');

    });

    });


var puerto = 3000;
var ip = '150.244.67.21';

http.listen(puerto, function(){
  console.log('listening on ' + ip + ':' + puerto);
});

// Cloud 9
/*
https://galacticstrikesocketio-borfour-1.c9users.io/
*/

//http.listen(puerto, ip, function(){
//  console.log('listening on ' + ip + ':' + puerto);
//});


