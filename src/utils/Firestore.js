import Axios from 'axios'

const V = 'v1'
const ID = 'clever-math-hkg'
const URL = `https://firestore.googleapis.com/${V}/projects/${ID}/databases/(default)`

function parseValue (value = {})
{
    if (value.mapValue)
    {
        return parseObject (value.mapValue.fields)
    }
    else if (value.arrayValue)
    {
        return parseArray (value.arrayValue.values)
    }
    else if (value.stringValue)
    {
        return value.stringValue
    }
    else if (value.integerValue)
    {
        return parseInt (value.integerValue, 10)
    }
    else if (value.doubleValue)
    {
        return value.doubleValue
    }
    else if (value.booleanValue)
    {
        return value.booleanValue
    }
    else if (value.bytesValue)
    {
        return parseInt (value.bytesValue, 10)
    }
    else if (value.nullValue)
    {
        return null
    }

    return null
}

function parseArray (values = [])
{
    return values.map(parseValue)
}

function parseObject (fields = {})
{
    const result = {}

    for (let key in fields)
    {
        result[key] = parseValue (fields[key])
    }

    return result
}

function parseDocument ({ name = '', fields = {} })
{
    const pathes = name.split('/')
    const id = pathes[pathes.length - 1]

    return { id, data: parseObject (fields) }
}

async function doc (path)
{
    const url = `${URL}/documents/${path}`

    const result = await Axios.get(url)
    const fields = result.data.fields

    return parseObject (fields)
}

async function col (path)
{
    const url = `${URL}/documents/${path}`

    const result = await Axios.get(url)
    const docs = result.data.documents
    
    return docs.map(doc => parseObject(doc.fields))
}

async function query (path, query)
{
    const url = `${URL}/documents/${path}:runQuery?fields=document`

    try
    {
        const result = await Axios.post(url, query)
        const docs = result.data.filter (doc => !!doc.document)

        return docs.map(doc => parseDocument(doc.document))
    }
    catch (err)
    {
        // console.log(err)
        return []
    }
}

export default
{
    doc,
    col,
    query,
}