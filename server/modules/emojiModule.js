const gemoji = require('gemoji')

function getGitEmoji (string) {
    const status = string
    console.log(status)
    if(status !== null && status.emojiHTML !== null){
        const emoji = status.emojiHTML.match(/[\p{Emoji}\u200d]+/gu)
        return emoji.slice(-1)[0]
    }
}

module.exports= {
    getGitEmoji
}