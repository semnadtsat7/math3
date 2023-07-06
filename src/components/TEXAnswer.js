import React from 'react'
import TEXDraw from './TEXDraw'

function newLine (text = '')
{
    return text.replace(/;;/g, '<br />');
}

function spanner (text = '')
{
    return '<span>' + text + '</span>';
}

function parseDragDrop(text, isChoice)
{
    const arr = text.split ('|').filter(e => !!e)

    if (arr.length > 1)
    {
        return spanner(arr.map (e => spanner(newLine(e.trim()))).join(!!isChoice ? ", " : " หรือ "))
    }

    return spanner(newLine(arr[0]))
}

function parseDragSort(text = '')
{
    return spanner(text.split ('|').filter(e => !!e).map(e => spanner(newLine(e.trim()))).join(", "))
}

function parseNumberPicker(text = '')
{
    const arr = text.split ('|').filter(e => !!e)

    if (arr.length > 1)
    {
        return `<span>${arr.map (e => e.trim()).join(" หรือ ")}</span>`
    }

    return `<span>${arr[0]}</span>`
}

function parsePlaceholder(text, isChoice)
{
    if (text === 'num')
    {
        text = '0|1|2|3|4|5|6|7|8|9';
    }

    if (!!isChoice)
    {
        return spanner(text.split ('|').filter(e => !!e).map (e => spanner(newLine(e.trim()))).join(", "))
    }

    const groups = text.split ('||').filter(e => !!e)

    if (groups.length > 1)
    {
        return groups.map((group, i) => 
        {
            return spanner(`แบบที่ ${i + 1}) ${group.split('|').filter(e => !!e).map(e => spanner(newLine(e.trim()))).join(', ')}`)
        }).join("<br />")
    }
    else
    {
        return spanner(groups[0].split('|').filter(e => !!e).map(e => spanner(newLine(e.trim()))).join(', '))
    }
}

function parsePair(text = '')
{
    const groups = text.split ('||').filter(e => !!e)
    
    if (groups.length > 1)
    {
        return groups.map((group, i) => 
        {
            const items = newLine(group).split('|') || []

            const head = items[0] || ''
            const tail = items.slice(1).map(e => spanner(e)).join(", ") || ''

            return `<span>ชุดที่ ${i + 1}) ${head} จับคู่กับ ${tail}</span>`
        }).join("<br />")
    }
    else
    {
        const items = newLine(groups[0]).split('|') || []

        const head = items[0] || ''
        const tail = items.slice(1).map(e => spanner(e)).join(", ") || ''

        return `<span>${head} จับคู่กับ ${tail}</span>`
    }
}

function parseImage (text)
{
    const pattern = /(http|https):\/\/[^|\r\n\s]+/
    
    return text.replace(new RegExp(pattern, 'gi'), (match, i) => 
    {
        if (match.endsWith(','))
        {
            match = match.slice(0, match.length - 1)
        }

        return (
            `<img class="image" src="${match}" />`
        )
    })
}

export default (
    {
        type,
        text = '',

        isChoice = false,

        cellType = 'text',
        cellPerRow = 1,
    }
) =>
{
    if (Array.isArray(text))
    {
        text = text.join("|")
    }

    text = parseImage (text)

    if (type === 'drag-drop')
    {
        text = parseDragDrop (text || '', isChoice)
    }

    if (type === 'drag-sort')
    {
        text = parseDragSort (text)
    }

    if (type === 'number-picker')
    {
        text = parseNumberPicker (text)
    }

    if (type === 'placeholder')
    {
        text = parsePlaceholder (text || '', isChoice)
    }

    if (type === 'pair')
    {
        text = parsePair (text)
    }

    // text = text.replace(/;;/g, '<br />');

    return (
        <div>
            <TEXDraw 
                text={text} 
                cellType={cellType}
                cellPerRow={cellPerRow}
            />
        </div>
    )
}