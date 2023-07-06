
function excerpt (text, limit = 120)
{
    if (!text)
    {
        return ''
    }

    text = text.replace (' . . .', '')
    text = text.replace ('...', '')
    text = text.replace (/^\s+|\s+$|\s+(?=\s)/g, ' ')

    if (text.length > limit)
    {
        const arr = text.split (' ')

        if (arr.length > 0 && arr[0].length > limit)
        {
            return arr[0].slice (0, limit) + '...'
        }

        let result = ''

        for (let i = 0; i < arr.length; i++)
        {
            let joined = result + arr[i]

            if (joined.length > limit)
            {
                return result + '...'
            }

            result = joined + ' '
        }
    }

    return text.trim ()
}

export default
{
    excerpt,
}