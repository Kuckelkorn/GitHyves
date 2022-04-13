const http = require('http')
const path = require('path')
const router = require('./server/controllers/login')
const session = require('express-session')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const compression = require('compression')
const passport = require('passport')
require('dotenv').config();
require('./server/modules/passportModule.js')(passport);


const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 5500
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
  .use(bodyParser.urlencoded({ extended: true }))
  .use(passport.initialize())
  .use(passport.session())
  .use('*', saveLocal)
  .set('view engine', 'ejs')
  .set('views', 'server/views')
  .use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(router)

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