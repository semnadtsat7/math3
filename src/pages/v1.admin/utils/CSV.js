import CSVToJSON from 'csvtojson'

function fromFile (file)
{
    return new Promise (res =>
    {
        const reader = new FileReader ()

        reader.onload = async e =>
        {
            const text = e.target.result

            CSVToJSON()
            .fromString (text)
            .then (csv => 
            {
                res (csv)
            })
        }

        reader.readAsText (file)
    })
}

export default
{
    fromFile,
}