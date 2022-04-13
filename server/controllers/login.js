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
.get("/profile", ensureAuthenticated ,async (req, res) => {
  const data = await user(req.user._json.login)
    res.render('welcome', {
      user: req.user._json,
      projects: await data.user.repositories.nodes
    })
})

.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
)
.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  async (req, res) => {
    res.redirect('/profile')
})
.get('/logout', (req, res) => {
  req.logout()
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}


module.exports = router