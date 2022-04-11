
const socket = require('socket.io')
const http = require('http')
const path = require('path')
const router = require('./server/routes/router')
const express = require('express')
const ejs = require('ejs')
const compression = require('compression')

require('dotenv').config()

const app = express();
const server = http.createServer(app)
// const io = new Server(server);

// const hostname = '127.0.0.1';
const port = process.env.PORT || 5500

app
  .use(compression())
  .use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable')
    next()
})

  .set('view engine', 'ejs')
  .set('views', 'server/views')
  .use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(router)

server.listen(port, () => {
    console.log("App is running on port " + port);
})