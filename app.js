import express from 'express'
import compression from 'compression'
import http from 'http'
import module from 'path'
import { Server } from "socket.io"
import ejs from 'ejs'

const app = express();
const server = http.createServer(app)
const io = new Server(server);

// const hostname = '127.0.0.1';
const port = process.env.PORT || 5500;

io.on('connection', socket => {
  console.log('a user connected')
})

app
  .use(compression())
  .use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable')
    next()
})

  .set('view engine', 'ejs')
  .use(express.static('static'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => {
  res.render('index');
});

server.listen(port, () => {
    console.log("App is running on port " + port);
});
