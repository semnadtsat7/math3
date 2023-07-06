
function parse (text = '')
{
    const regex = /(\\frac)[0-9❑{}.]*(})/g
    const matches = text.match(regex)

    let result = text

    if (!!matches)
    {
        matches.forEach (formula =>
        {
            let a = formula.replace (/(\\frac{)/g, '')

            a = a.replace (`}{`, '---')
            a = a.replace ('}', '')

            let ns = a.split ('---')

            let f = `
            <span class="frac" >
                ${ns[0]}
                <span class="divider"></span>
                ${ns[1]}
            </span>`

            result = result.replace (formula, f)
        })
    }

    // result = result.replace(/\*/g, '×')
    // result = result.replace(/\//g, '÷')

    return result

    // return KaTex.renderToString (text)
}   

export default
{
    parse,
}