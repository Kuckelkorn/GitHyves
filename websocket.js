const { Server } = require('socket.io')
const server = require('./app').server
const port = require('./app').port
const io = new Server(server)

io.on('connection', socket => {
    socket.on('chat message', msg => {
      io.emit('chat message', msg)
    })
  
    socket.on('typing', data => {
      socket.broadcast.emit('typing', { username: data.username})
    })
})

server.listen(port)