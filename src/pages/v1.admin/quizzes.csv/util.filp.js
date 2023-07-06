
function flip_recursive (arr = [])
{
    if (arr.length > 2)
    {
        const result = []

        for (let i = 0; i < arr.length; i++)
        {
            const a = arr[i]
            const clone1 = arr.filter((e, index) => i !== index)
            
            const flippeds = flip_recursive (clone1)

            flippeds.forEach(e => result.push([ a, ...e ]))
        }

        return result
    }
    else if (arr.length === 2)
    {
        return [ [ arr[0], arr[1] ], [ arr[1], arr[0] ] ]
    }
    
    return arr
}

function flip (text = '')
{
    // console.log ('flip', text)
    const l1s = text.split('||')
    const groups = []
    
    for (let i = 0; i < l1s.length; i++)
    {
        const l1 = l1s[i].trim()
        const l2s = l1.split('|').map(e => e.trim())

        if (l2s.length > 1)
        {
            const arr = flip_recursive (l2s).map(e => e.join('|'))

            arr.forEach(group =>
                {
                    if (groups.indexOf(group) < 0)
                    {
                        groups.push(group)
                    }
                })
        }
        else if (l2s.length === 1)
        {
            groups.push(l2s[0])
        }        
    }

    return groups.join('||')
}

export default flip