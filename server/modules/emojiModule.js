const gemoji = require('gemoji')

function getGitEmoji (string) {
    const emoji = string
    const allEmojis = gemoji
    const result = allEmojis.find( ({ names }) => names == emoji );
    return result

}

module.exports= {
    getGitEmoji
}