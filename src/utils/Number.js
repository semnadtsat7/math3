
function minify (number = 0)
{
    if (number >= 1000000)
    {
        return prettify(parseInt (number / 1000000 * 10, 10) / 10) + 'M'
    }

    if (number >= 10000)
    {
        return prettify(parseInt (number / 1000 * 10, 10) / 10) + 'K'
    }

    return prettify (number)
}

function prettify (number = 0)
{
    return number.toLocaleString('en', {maximumSignificantDigits : 21})
}

module.exports = {
    minify,
    prettify,
}