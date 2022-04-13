const express = require('express')
const passport = require('passport')
const fs = require('fs')

require('../modules/passportModule.js')(passport)
const user = require('../modules/graphqlModule.js')

const router = express.Router()

router
.get('/chat', ensureAuthenticated, (req, res) => {
    const data = JSON.parse(fs.readFileSync('./chat.json'))
    const chats = data.chats

    res.render('chat', {
        username: req.user._json,
        chats
    })
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/')
}


module.exports = router