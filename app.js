const { Server } = require('socket.io')
const http = require('http')
const router = require('./server/controllers/login')
const chatRoute = require('./server/controllers/chat')
const session = require('express-session')
const bodyParser = require('body-parser')
const fs = require('fs')
const express = require('express')
const compression = require('compression')
const passport = require('passport')
const dateFormat = require('dateformat')
require('dotenv').config();
require('./server/modules/passportModule.js')(passport);

const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 5500
const io = new Server(server)
require('dotenv').config()

app
  .use(compression())
  .use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable')
    next()
  })
  .use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use('*', saveLocal)
  .set('view engine', 'ejs')
  .set('views', 'server/views')
  .use(express.static('public'))
  .use(express.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.urlencoded({ extended: true }))
  .use(router)
  .use(chatRoute)

dateFormat.masks.chatFormat = 'HH:MM - dd/mm'

io.on('connection', socket => {
  socket.on('chat message', async (data) => {
    try {
      if (data.message == '') return
      const chats = JSON.parse(fs.readFileSync('./chat.json'))
      
      const body = {
        message: data.message,
        username: data.username,
        date: dateFormat(data.date, 'chatFormat')
      } 

      chats.chats.push(body)

      const stringData = JSON.stringify(chats, null, 2)
      fs.writeFileSync('chat.json', stringData) 

      io.sockets.emit('chat message', {
        message: data.message,
        username: data.username,
        date: dateFormat(data.date, 'chatFormat')
      })
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('typing', data => {
    socket.broadcast.emit('typing', { username: data.username})
  })
})

server.listen(port, () => {
    console.log("App is running on port " + port)
})

function logout(req, res ){
  req.logout();
  req.session.destroy(); 
  res.redirect('/');
}

// Setup session to use res.locals for the user
function saveLocal (req, res, next){
  res.locals.user = req.user || null;
  next();
}

// Check if user is logged in 
function loggedIn (req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}