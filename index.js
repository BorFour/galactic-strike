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
var usernames = {};
var numUsers = 0;

var clients = {};
var currId = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // Cuando el cliente emite
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });


    // Cuando un cliente emite 'updatePlayer', se redirige en broadcast al resto de clientes
    // , function(data) { ... ???
  socket.on('updatePlayer', function (data) {
    socket.broadcast.emit('updatePlayer', {
      id: socket.id,
      data: data
    });
  });

  // when the client emits 'add user', this listens and executes
  // Cuando se añade un usuario, el servidor le debería asignar
  // una ID única

  socket.on('add user', function (data) {
    // we store the username in the socket session for this client
    socket.id = currId;
    ++currId;
    clients[socket.id] = socket.id;
//    socket.username = username;
    // add the client's username to the global list
//    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      id: socket.id
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      id: socket.id,
    });
    console.log("@Socket.io server | \'add user\'")
  });


  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.id];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        id: socket.id
      });
    console.log("@Socket.io server | \'disconnect\'")
    }
  });
});


//io.on('connection', function(socket){
//  console.log('a user connected');
//  socket.on('disconnect', function(){
//    console.log('user disconnected');
//  });
//});

//io.on('connection', function(socket){
//  socket.on('chat message', function(msg){
//    console.log('message: ' + msg);
//  });
//});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
