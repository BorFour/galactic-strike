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

io.on('connection', function (socket) {

    socket.on('login', function (input) {

        var output = {};
        console.log('@Server received | login');

        players[currId] = input;
        output.id = currId;
        socket.id = currId;
        currId++;
        output.players = players;

        socket.emit('IDPlayer', output);
        console.log('@Server sent | IDPlayer');
        socket.broadcast.emit('userJoined', output);
        console.log('@Server sent | userJoined');
        console.log('@Server log | nPlayers = ' + players.length);

    });

    socket.on('update', function (input) {

        console.log('@Server received | update');

        players[input.id] = input.player;
        socket.broadcast.emit('updatePlayer', input);
        console.log('@Server sent | updatePLayer');

    });

    socket.on('disconnect', function () {

        var output = {};
        console.log('@Server received | disconnect');
        console.log('@Server log | user ' + socket.id + ' left')
        output.id = socket.id;
        socket.broadcast.emit('userLeft', output);
//        delete players[socket.id];
        var playersAux = []
        for (var i in players){
            if(i !== socket.id){
                playersAux[i] = players[i];
            }
        }
        players = playersAux;
        console.log('@Server sent | userLeft');

    });

});


var puerto = 3000;
var ip = 'localhost';

http.listen(puerto, function(){
  console.log('listening on ' + ip + ':' + puerto);
});
