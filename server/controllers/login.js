const express = require('express')
const passport = require('passport')
const getApiData = require("../modules/graphqlModule")
require('../modules/passportModule.js')(passport)

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
  passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    const data = await getApiData(req.user._json.login)
    res.render('welcome', {
      user: req.user._json,
      projects: await data.user.repositories.nodes
    })
})


module.exports = router