
const socket = require('socket.io')
const http = require('http')
const path = require('path')
const router = require('./server/routes/router')
const session = require('express-session')
const express = require('express')
const ejs = require('ejs')
const compression = require('compression')
const passport = require('passport')
const GitHubStrategy = require("passport-github2").Strategy
require('dotenv').config();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5500/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile)
      return done(profile)
    }
  )
);


require('dotenv').config()



const app = express();
const server = http.createServer(app)

// const hostname = '127.0.0.1';
const port = process.env.PORT || 5500


app
  .use(compression())
  .use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable')
    next()
})
  .use(passport.initialize())
  .set('view engine', 'ejs')
  .set('views', 'server/views')
  .use(express.static('static'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(router)
  .get('/', (req, res) => {
    res.render('index')
  }
);

//failed auth: route
app.get("/login", (req, res) => {
  console.log("you are not authorized");
});

//successful auth: route
app.get("/success", (req, res) => {
  console.log(`Welcome`);
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    console.log('redirect')
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

server.listen(port, () => {
    console.log("App is running on port " + port);
})