// Gets socket from local host
const socket = io('http://localhost:3000')
// Gets message container
const messageContainer = document.getElementById('message-container')
// Gets message form
const messageForm = document.getElementById('send-container')
// Gets message input
const messageInput = document.getElementById('message-input')

// Prompts users to enter their chat name
const name = prompt('What is your name?')
// Displays message that the user successfully joined the chat
appendMessage('You have successfully joined the chat room!')
// Creates new user with the name provided in the prompt
socket.emit('new-user', name)

// Appends chat messages to chat
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

// Appends message that a user connected to chat
socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

// Appends message that a user disconnected from chat
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

// Event listener for submit button
messageForm.addEventListener('submit', e => {
  // Stops page from refreshing when messages are sent
  e.preventDefault()
  // Gets value of message input
  const message = messageInput.value
  // -----
  appendMessage(`${name} (You): ${message}`)
  // Sends messages from client to server
  socket.emit('send-chat-message', message)
  // Empties out text box after sending chat messages
  messageInput.value = ''
})

// Appends messages to the browser
function appendMessage(message) {
  // Creates a message element
  const messageElement = document.createElement('div')
  // Sets value of the message element to the text
  messageElement.innerText = message
  // Appends message to the message container
  messageContainer.append(messageElement)
}