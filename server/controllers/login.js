const express = require('express')
const passport = require('passport')
const multer = require('multer')
const fs = require('fs')

require('../modules/passportModule.js')(passport)
const user = require('../modules/graphqlModule.js')
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
.get("/profile/:username", async (req, res) => {
  const username = req.params.username
  const profile = await checkForProfile(username, profiles)
  if (profile != undefined){
    const data = await user(profile.username)
    const projectData = await data.user.repositories.nodes
    res.render('welcome', {
      profile,
      user: req.user._json,
      userStatus: data.user.status,
      followers: data.user.following.nodes,
      projects: projectData
    })
  } else {
    res.render('error')
  }
})

.get('/profile/:username/edit', ensureAuthenticated, (req, res) =>{
  const user = res.locals.user
  res.render('pimpen', {user})
})

.post('/profile/:username/edit', ensureAuthenticated, upload.single('image'), (req, res) => {
  const user = res.locals.user
  const path = `${req.file.path}`
  const profile = {
    username: `${user.username}`,
    textColor: req.body.tekstkleur,
    image: `${path}`
  }
  writeFile(profile, profiles)
  res.redirect(`/profile/${user.username}`)
})

.get('/profile', (req, res) => {
  res.render('profile')
})

.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
)
.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  async (req, res) => {
    const profile = checkForProfile(req.user.username, profiles)
    if (profile != undefined){
      res.redirect(`/profile/${req.user.username}`)
    } else {
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