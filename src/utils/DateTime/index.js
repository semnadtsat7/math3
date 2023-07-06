const months = {
    "en": require('./month.en'),
    "th": require('./month.th'),
}
const monthMins = {
    "en": require('./month.en.min'),
    "th": require('./month.th.min'),
}

const yearOffsets = {
    'en': 0,
    'th': 543,
}

function getDateTimeString(dateOrTime, options = {})
{
    const { delimiter = ' - ', monthType = 'normal', language = 'th', yearType = 'normal' } = options

    let temp = dateOrTime ? dateOrTime.toDate ? dateOrTime.toDate() : dateOrTime : new Date()
    let date = (typeof temp === 'number' || typeof temp === 'string') ? new Date (temp) : temp

    return getDateString(date, { monthType, language, yearType }) + delimiter + getTimeString(date, language);
}

function getDateString(dateOrTime, options = {})
{
    const { monthType = 'normal', language = 'th', yearType = 'normal' } = options
    
    let temp = dateOrTime ? dateOrTime.toDate ? dateOrTime.toDate() : dateOrTime : new Date()
    let date = (typeof temp === 'number' || typeof temp === 'string') ? new Date (temp) : temp

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear() + yearOffsets[language];

    let yyyy = yearType === 'none' ? '' : ' ' + year

    if (monthType === 'short')
    {
        return day + ' ' + monthMins[language][month] + yyyy;
    }
    else if (monthType === 'number')
    {
        return day + '/' + (month + 1) + '/' + yyyy.trim();
    }

    return day + ' ' + months[language][month] + ' ' + yyyy;
}

function getTimeString(dateOrTime, language)
{
    let temp = dateOrTime ? dateOrTime.toDate ? dateOrTime.toDate() : dateOrTime : new Date()
    let date = (typeof temp === 'number' || typeof temp === 'string') ? new Date (temp) : temp

    let h = date.getHours();
    let m = date.getMinutes();

    if(m < 10)
    {
        m = '0' + m;
    }
    
    if(language === 'en')
    {
        if(h < 12)
        {
            return h + ':' + m + ' AM';
        }

        return (h - 12) + ':' + m + ' PM';
    }

    return h + ':' + m + ' น';
}

function toYYYYMMDD(dateOrTime)
{
    let temp = dateOrTime ? dateOrTime.toDate ? dateOrTime.toDate() : dateOrTime : new Date()
    let date = (typeof temp === 'number' || typeof temp === 'string') ? new Date (temp) : temp

    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let day = date.getDate();

    if(month < 10)
    {
        month = '0' + month;
    }

    if(day < 10)
    {
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;
}

function today ()
{
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function tommorow ()
{
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

function previousMonth ()
{
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
}

function minify (dateOrTime)
{
    let temp = dateOrTime ? dateOrTime.toDate ? dateOrTime.toDate() : dateOrTime : new Date()
    let date = (typeof temp === 'number' || typeof temp === 'string') ? new Date (temp) : temp

    const cur = new Date()
    const time = cur - date

    const dd =  Math.floor(time / 86400000)

    if (dd > 0)
    {
        return `${dd} วันที่ผ่านมา`
    }
    
    const hh =  Math.floor(time % 86400000 / 3600000)

    if (hh > 0)
    {
        return `${hh} ชั่วโมงที่ผ่านมา`
    }

    const mm =  Math.floor(time % 86400000 % 3600000 / 60000)

    if (mm > 5)
    {
        return `${mm} นาทีที่ผ่านมา`
    }

    if (mm > 0)
    {
        return `${mm} นาทีที่แล้ว`
    }

    const ss =  Math.floor(time % 86400000 % 3600000 % 60000 / 1000)

    if (ss > 15)
    {
        return `${ss} วินาทีที่แล้ว`
    }

    return `ไม่กี่วินาทีที่แล้ว`
}

module.exports ={
    format: getDateTimeString,
    formatDate: getDateString,
    formatTime: getTimeString,
    toYYYYMMDD,

    today,
    tommorow,
    previousMonth,

    minify,

    ONE_DAY: 86400000,
}