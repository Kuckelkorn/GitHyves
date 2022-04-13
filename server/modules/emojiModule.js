const gemoji = require('gemoji')



function fetchEmoji (string) {
    const emoji = string
    const allEmojis = gemoji
    function isCherries(fruit) {
        // console.log(fruit)
        return fruit.names === emoji;
      }
    console.log(allEmojis.find(isCherries));
}

// console.log(fetchEmoji)

module.exports= {
    fetchEmoji
}