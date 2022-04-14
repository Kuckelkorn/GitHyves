const express = require('express')
const passport = require('passport')
const multer = require('multer')
const fs = require('fs')

require('../modules/passportModule.js')(passport)
const getApiProfileData = require('../modules/graphqlModule.js')
const { writeFile } = require('../modules/databaseModule.js')
const { getGitEmoji } = require('../modules/emojiModule.js')
const Users = require('../model.js')
const profiles = 'server/data/profiles.json'
const storage = multer.diskStorage({
  destination: 'public/backgrounds/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


const router = express.Router()

router
.get('/', (req, res) => {
  res.render('login')
})

.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
)

.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  async (req, res) => {
      res.redirect(`/profile/${req.user.username}`)
})

  //failed auth: route
.get("/login", (req, res) => {
  console.log("you are not authorized")
})

//successful auth: route
.get("/profile/:username", async (req, res) => {
  const username = req.params.username
  const loggedIn = () => {
    if (res.locals.user.username != undefined){
      return res.locals.user.username
    } else {
      return ""
    }
  }
  const data = await getApiProfileData(username)
  const projectData = await data.user.repositories.nodes
  const status = await data.user.status
  const emoji = getGitEmoji(status)
  const styles = {
    textColor: "#ff8a0e",
    backgroundColor: "#ff8a0e",
    image: ""
  }



  const profile = {
    user: data.user,
    userStatus: data.user.status,
    emoji: emoji,
    friends: data.user.following.totalCount,
    followers: data.user.following.nodes,
    projects: projectData,
    loggedIn: res.locals.user.username,
    styles
  }
  const custom = await checkForProfile(username)
  if(custom) {
    res.render('welcome', {
      profile: custom
    })
  } else {
    Users.create(profile)
    res.render('welcome', {
      profile
    })
  }

})

.get('/profile/:username/edit', ensureAuthenticated, (req, res) =>{
  const user = res.locals.user
  res.render('pimpen', {user})
})

.post('/profile/:username/edit', ensureAuthenticated, upload.single('image'), async (req, res) => {
  const user = res.locals.user
  const path = `${req.file.path}`
  if (path == undefined){
    path = ''
  }
  const styles = {
    textColor: req.body.tekstkleur,
    backgroundColor: req.body.achtergrondkleur,
    image: `${path}`
  }

  await Users.findOneAndUpdate(user.username, { $set: { styles: styles } })
  
  res.redirect(`/profile/${user.username}`)
})


.get('/logout', (req, res) => {
  req.logout()
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}


const checkForProfile = async (username) => {
  const allProfiles = await Users.find({}).lean()
  const myProfile = allProfiles.find((profile) => profile.user.login.includes(username))
    return myProfile

}

module.exports = router