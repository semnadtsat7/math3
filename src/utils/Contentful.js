import querystring from 'querystring'
import axios from 'axios'

function getEntryMap (entryArray)
{
    const entries = {}
    
    entryArray
    .forEach(e =>
    {
        entries[e.sys.id] = { id: e.sys.id, ...e.fields }
    })

    return entries
}

function get (spaceId, accessToken, path, params)
{
    const baseUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/master`
    const url = `${baseUrl}${path}?${querystring.stringify({ access_token: accessToken, ...params })}`

    return new Promise ((resolve, reject) =>
    {
        axios
        .get(url)
        .then(res =>
        {
            resolve(res.data)
        })
        .catch(err =>
        {
            if (err)
            {
                if (err.response)
                {
                    if (err.response.data)
                    {
                        reject (err.response.data)
                    }
                    else
                    {
                        reject (err.response)
                    }
                }
                else
                {
                    reject (err)
                }
            }
            else
            {
                reject ('error: no detail...')
            }
        })
    })
}

export default
{
    get,
    getEntryMap,

    core:
    {
        spaceId: 'nd6eqeov22tr',
        accessToken: '647d1cea756c58bae0dfccc7c8730c415cb829f668680d4c53e1a4498b4b6991',

        rewards: '6iPliXUjTO4ksyus60EWG4'
    }
}