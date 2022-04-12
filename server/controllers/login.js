const express = require('express')
const passport = require('passport')
const { graphql } = require('@octokit/graphql')

require('../modules/passportModule.js')(passport)

const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.GITHUB_TOKEN },
})

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
  passport.authenticate('github', { failureRedirect: '/login' }), async function (req, res) {
    // Get the repository information from my GitHub account
    await graphqlAuth(`{
      user(login: "${req.user._json.login}") {
        repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC, isFork: false) {
          totalCount
          nodes {
            name
            url
            description
          }
        }
      }
    }`).then((data) => {
      console.log(data.user.repositories.nodes)
      res.render('welcome', {
        user: req.user._json,
        projects: data.user.repositories.nodes
      })
    })
  })


module.exports = router