// Requires express module
var express = require('express');
// Starts a new Express application
var app = express();

// Sets up the server
var server = app.listen(process.env.PORT || 3000, listen);

// Call back to notify us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Chat app listening at http://' + host + ':' + port);
}

// Serves static files to client from the public folder
app.use(express.static('public'));

// Requires Socket.io module on server
const  io = require('socket.io').listen(server);

// Array of users within chat
const users = {}

// Creates socket for each user that connects to website
io.on('connection', socket => {
  // Stores new users created 
  socket.on('new-user', name => {
    users[socket.id] = name
    // Broadcasts message that user connected to chat
    socket.broadcast.emit('user-connected', name)
  })
  // Stores chat messages
  socket.on('send-chat-message', message => {
    // Broadcasts chat messages
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  // Removes users from chat
  socket.on('disconnect', () => {
    // Broadcast message that a user connected from chat 
    socket.broadcast.emit('user-disconnected', users[socket.id])
    // Deletes user from array
    delete users[socket.id]
  })
})