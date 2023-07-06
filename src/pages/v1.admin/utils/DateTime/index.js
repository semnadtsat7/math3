// const months = {
//     "en": require('./month.en'),
//     "th": require('./month.th'),
// }
const monthMins = {
    "en": require('./month.en.min'),
    "th": require('./month.th.min'),
}

const yearOffsets = {
    'en': 0,
    'th': 543,
}

function parse (value)
{
    let temp = value ? value.toDate ? value.toDate() : value : new Date()
    let date = (typeof temp === 'number' || typeof temp === 'string') ? new Date (temp) : temp

    return date
}

function getDate (value, options = {})
{
    const lang = options.lang || options.language || 'th'
    const date = parse(value)

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear() + yearOffsets[lang]

    let yyyy = ''

    if (date.getFullYear() !== new Date().getFullYear())
    {
        yyyy = ' ' + year
    }

    return day + ' ' + monthMins[lang][month] + ' ' + yyyy
}

function getTime (value, options = {})
{
    const lang = options.lang || options.language || 'th'
    const date = parse(value)

    let h = date.getHours()
    let m = date.getMinutes()

    if(m < 10)
    {
        m = '0' + m
    }

    if(lang === 'en')
    {
        if(h < 12)
        {
            return h + ':' + m + ' AM'
        }

        return (h - 12) + ':' + m + ' PM'
    }

    return h + ':' + m + ' น'
}

function compare (a, b)
{
    const d1 = parse(a).getTime()
    const d2 = parse(b).getTime()

    return d1 - d2
}

export default 
{
    getDate,
    getTime,

    compare,
}