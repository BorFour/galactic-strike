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
