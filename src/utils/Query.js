import qs from 'querystring';

function parse (search = '?')
{
    if(search.length >= 4 && search.startsWith('?'))
    {
        return qs.parse(search.slice(1));
    }

    return {};
}

function stringify (obj)
{
    return qs.stringify (obj)
}

export default {
    parse,
    stringify,
}