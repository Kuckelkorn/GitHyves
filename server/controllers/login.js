const express = require('express')
const passport = require('passport')

require('../modules/passportModule.js')(passport)
const user = require('../modules/graphqlModule.js')

const router = express.Router()

router
.get('/', (req, res) => {
    res.render('login')
})

  //failed auth: route
.get("/login", (req, res) => {
  console.log("you are not authorized")
})

//successful auth: route
.get("/success", (req, res) => {
  res.render('welcome')
})

.get(
"/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
)
.get('/github/callback', 
<<<<<<< HEAD
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.user._json)
=======
  passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    const data = await user(req.user._json.login)
>>>>>>> development
    res.render('welcome', {
      user: req.user._json,
      projects: await data.user.repositories.nodes
    })
})
<<<<<<< HEAD

=======
>>>>>>> development


module.exports = router