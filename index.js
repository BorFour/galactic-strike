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

io.on('connection', function (socket) {

    socket.on('login', function (input) {

        var output = {
            id : currId,
        };
        console.log('@Server received\t| login');
        socket.join('General');

        players[currId] = input;
        socket.game_id = currId;
        currId++;
        nPlayers++;


//        socket.emit('IDPlayers', output);
        socket.emit('ID', output);
        console.log('@Server sent    \t| IDPlayer');
        console.log('@Server log     \t| nPlayers = ' + nPlayers);

    });

    socket.on('update', function (input) {

        var output = input;
//        console.log('@Server received | update');
        players[socket.game_id] = input;
        output.id = socket.game_id;
        socket.broadcast.to('Room1').emit('update', input);
//        console.log('@Server sent | update');

    });

    socket.on('attack', function (input) {

        var output = {};
        output.id = input.id;
        io.to('Room1').emit('attack', output);
//        console.log('@Server sent | update');

    });

    socket.on('attack2', function (input) {

        var output = {};
        output.id = input.id;
        io.to('Room1').emit('attack2', output);
//        console.log('@Server sent | update');

    });

    socket.on('hit', function (input) {

        console.log('@Server received\t| hit');
        console.log(input);
        var output = {};
        output.id = input.id;
        output.target = input.target;
        output.damage = input.damage;
        io.to('Room1').emit('hit', output);

    });

    //////////
    // ROOM
    //

    socket.on('createRoom', function (input) {

        var output = {};
        output.id = input.id;

         console.log('@Server received\t| createRoom');

        if(room.state === 'empty')
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

        console.log('@Server received\t| joinRoom');

        if (room.state === 'ingame')
        {
            socket.emit('roomIngame');
            return;
        }
        else if(room.state === 'lobby')
        {
            console.log('@Server join into lobby');
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

         console.log('@Server received\t| changeTeam');

        if(room.state === 'lobby')
        {
            io.to('Room1').emit('changeTeam', output);
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
//        output.name = room.players[input.id];

        if(room.state === 'ingame')
        {
            io.to('Room1').emit('userJoinedGame', output);
//            console.log('@Server sent    \t| userJoined');
        }


    });

    socket.on('leaveGame', function (input) {

        var output = {};
        output.id = socket.game_id;

        console.log('@Server received\t| leaveGame');
        console.log('@Server log     \t| user ' + socket.game_id + ' left')

        io.to('Room1').emit('userLeftGame', output);
        socket.leave('Room1');

        delete room.players[socket.game_id];

        var playersRoom = 0;
        for (var pr in room.players) playersRoom ++;

        if(playersRoom === 0) {
            console.log('@Server log     \t| empty room');
            room.state = 'empty';
        } else{
            console.log(room.players);
        }

        console.log('@Server sent    \t| userLeftGame');
    });

    socket.on('beginMatch', function (input) {

        var output = {};
        output.id = input.id;

        console.log('@Server received\t| beginMatch');

        if(input.id !== room.host){

        }
        else if  (room.state !== 'lobby'){

        }
        else{
            room.state = 'ingame';

            io.to('Room1').emit('beginMatch', output);

        }

//        socket.emit('beginMatch', output);

    });

    socket.on('disconnect', function () {

        var output = {};
        console.log('@Server received\t| disconnect');
        console.log('@Server log     \t| user ' + socket.game_id + ' left')
        if(!(socket.game_id instanceof Number)) return;
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
        console.log('@Server sent    \t| userLeft');

    });

});


var puerto = 3000;
var ip = 'localhost';

http.listen(puerto, function(){
  console.log('listening on ' + ip + ':' + puerto);
});

// Cloud 9
// https://galacticstrikesocketio-borfour-1.c9users.io/
//http.listen(process.env.PORT, process.env.IP, function(){
//  console.log('listening on ' + process.env.IP + ':' + process.env.PORT);
//});


