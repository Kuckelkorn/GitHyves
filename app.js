
import express from 'express'
import compression from 'compression'
import http from 'http'
import module from 'path'
import { graphql } from '@octokit/graphql'
import { Server } from "socket.io"
import ejs from 'ejs'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const server = http.createServer(app)
const io = new Server(server);
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' +  process.env.API_KEY},
})

// const hostname = '127.0.0.1';
const port = process.env.PORT || 5500

io.on('connection', socket => {
  console.log('a user connected')
  socket.emit("hello", "world")
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app
  .use(compression())
  .use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable')
    next()
})
  .set('view engine', 'ejs')
  .set('views', 'server/views')
  .use(express.static('static'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => {

  graphqlAuth(`{
      user(login: "jody29") {
        issues(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            node {
              bodyText
            }
          }
        }
      }
    }`).then(data => {

      console.log(data.user.issues.edges)
      res.render('index', {
        issues: data.user.issues.edges
      })
    })
  
});

server.listen(port, () => {
    console.log("App is running on port " + port);
})