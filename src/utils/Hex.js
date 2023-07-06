
function fromArray (src = [])
{
    const md5 = require (`crypto`).createHash (`md5`)
    const ascii = src.map (e => e || 'null').join ('0')

    return md5.update (ascii).digest (`hex`)
}

module.exports = 
{
    fromArray,
}