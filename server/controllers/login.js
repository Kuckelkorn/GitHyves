const express = require('express')
const passport = require('passport')
const multer = require('multer')
const fs = require('fs')

require('../modules/passportModule.js')(passport)
const getApiProfileData = require('../modules/graphqlModule.js')
const { getGitEmoji } = require('../modules/emojiModule.js')
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

  //failed auth: route
.get("/login", (req, res) => {
  console.log("you are not authorized")
})

//successful auth: route
.get("/profile/:username", ensureAuthenticated, async (req, res) => {
  const username = req.params.username
  const loggedIn = () => {
    if (res.locals.user.username != undefined || res.locals.user.username != null){
      return res.locals.user.username
    } else {
      return " "
    }
  }
  const data = await getApiProfileData(username)
  const projectData = await data.user.repositories.nodes
  const status = await data.user.status
  const emoji = getGitEmoji(status)
  const profile = {
    user: data.user,
    userStatus: data.user.status,
    emoji: emoji,
    friends: data.user.following.totalCount,
    followers: data.user.following.nodes,
    projects: projectData,
    loggedIn: loggedIn()
  }
  const custom = await checkForProfile(username, profiles)
  res.render('welcome', {
    profile,
    custom
  })
})

.get('/profile/:username/edit', ensureAuthenticated, (req, res) =>{
  const user = res.locals.user
  res.render('pimpen', {user})
})

.post('/profile/:username/edit', ensureAuthenticated, upload.single('image'), (req, res) => {
  const user = res.locals.user
  const path = `${req.file.path}`
  if (path == undefined){
    path = ''
  }
  const profile = {
    username: `${user.username}`,
    textColor: req.body.tekstkleur,
    backgroundColor: req.body.achtergrondkleur,
    image: `${path}`
  }
  writeFile(profile, profiles)
  res.redirect(`/profile/${user.username}`)
})

// .get('/profile', (req, res) => {
//   res.render('profile')
// })

.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
)
.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  async (req, res) => {
    const profile = await checkForProfile(req.user.username, profiles)
    if (profile != undefined){
      res.redirect(`/profile/${req.user.username}`)
    } else {
      console.log(req.user.username)
      const newProfile = {
        username: req.user.username
      }
      writeFile(newProfile, profiles)
      res.redirect(`/profile/${req.user.username}`)
    }
})
.get('/logout', (req, res) => {
  req.logout()
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}
const readFile = async (path) => {
  let data = fs.readFileSync(path, 'utf8', (err, data) => {
    if (err){
      console.log(err)
    } else {
      return data
    }
  })
  data = JSON.parse(data)
  return data
}

const writeFile = async (obj, path) => {
  let data = await readFile(path)
  const existingProfile = await data.find(i => i.username === obj.username)

  for (let i = 0; i < data.length; i++){
    
    if (data[i] === existingProfile) {
      data.splice(i, 1)
    }
  }
  
  data.push(obj)
  const newData = JSON.stringify(data)
  fs.writeFileSync(path, newData)
}

const checkForProfile = async (username, path) => {
  const profiles = await readFile(path)
  const existingProfile = await profiles.find(i => i.username === username)
  return existingProfile
}

module.exports = router