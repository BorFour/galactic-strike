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
            players : players
        };
        console.log('@Server received\t| login');
        socket.join('General');

        players[currId] = input;
        socket.id = currId;
        currId++;
        nPlayers++;


        socket.emit('IDPlayers', output);
        console.log('@Server sent    \t| IDPlayer');
        socket.broadcast.emit('userJoined', output);
        console.log('@Server sent    \t| userJoined');
        console.log('@Server log     \t| nPlayers = ' + nPlayers);

    });

    socket.on('update', function (input) {

        var output = input;
//        console.log('@Server received | update');
        players[socket.id] = input;
        output.id = socket.id;
        socket.broadcast.emit('update', input);
//        console.log('@Server sent | update');

    });

    socket.on('attack', function (input) {

        var output = {};
        output.id = input.id;
        socket.broadcast.emit('attack', output);
//        console.log('@Server sent | update');

    });

    socket.on('attack2', function (input) {

        var output = {};
        output.id = input.id;
        socket.broadcast.emit('attack2', output);
//        console.log('@Server sent | update');

    });

    socket.on('hit', function (input) {

        var output = {};
        output.id = input.id;
        socket.broadcast.emit('hit', output);

    });

    socket.on('createRoom', function (input) {

        var output = {};
        output.id = input.id;

        if(room.state === 'empty')
        {
            socket.join('Room1');
            room.state = 'lobby';
            room.players = {};
            room.players[input.id] = input.name;
            room.host = input.id;
        }


    });


    socket.on('joinRoom', function (input) {

        var output = {};
        output.id = input.id;

        if(room.state === 'lobby')
        {
            socket.join('Room1');
            room.players[input.id] = input.name;
        }

        socket.in('Room1').emit('userJoinedRoom', output);

    });

    socket.on('leaveRoom', function (input) {

        var output = {};
        output.id = input.id;

        socket.leave('Room1');
        delete room.players[input.id];
        socket.in('Room1').emit('userLeftRoom', output);

    });

    socket.on('beginMatch', function (input) {

        var output = {};
        output.id = input.id;

        if(input.id !== room.host){

        }
        else if  (room.state !== 'lobby'){

        }
        else{
            room.state = 'ingame';
            socket.in('Room1').emit('beginMatch', output);
        }


    });

    socket.on('disconnect', function () {

        var output = {};
        console.log('@Server received\t| disconnect');
        console.log('@Server log     \t| user ' + socket.id + ' left')
        output.id = socket.id;
        socket.broadcast.emit('userLeft', output);
        delete players[socket.id];
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


