const application = require("./application.js");
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017/mediaDB", { useNewUrlParser: true })

var server = application.listen(3001)

// Requires Socket.io module on server
const io = require('socket.io').listen(server);

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

module.exports = application