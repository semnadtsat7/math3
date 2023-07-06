import React from 'react'
import styled from 'styled-components'

// ${props => props.cellType === 'image' && `
//         > span
//         {
//             display: flex;

//             flex-direction: row;
//             flex-wrap: wrap;

//             align-items: center;

//             display: grid;
//             grid-template-columns: repeat( auto-fit, minmax(10px, auto) );
//         }
//     `}
            
//     ${props => props.cellType === 'image' && props.cellPerRow === 2 && `
//         @media (min-width: 576px)
//         {
//             img
//             {
//                 max-width: 49% !important;
//             }
//         }
//     `}

//     ${props => props.cellType === 'image' && props.cellPerRow === 3 && `
//         @media (min-width: 576px)
//         {
//             img
//             {
//                 max-width: 32% !important;
//             }
//         }
//     `}

//     ${props => props.cellType === 'image' && props.cellPerRow === 4 && `
//         @media (min-width: 576px)
//         {
//             img
//             {
//                 max-width: 24% !important;
//             }
//         }
//     `}

const Parent = styled.span`
    display: block;

    ${props => props.cellType === 'image' && `
    
        > span
        {
            display: grid;
            grid-template-columns: repeat( auto-fit, minmax(10px, auto) );
            gap: 8px;

            align-items: center;
            justify-items: left;
        }

    `}

    > span > span:nth-child(even)
    {
        color: darkmagenta;
    }

    > span > span:nth-child(odd)
    {
        color: teal;
    }
          
    .table
    {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        flex-direction: column;

        overflow-x: auto;
        
        margin: 8px 0;
        /* padding: 4px 0; */

        border: 1px solid #eee;

        .tr
        {
            width: 100%;

            display: flex;
            align-items: stretch;
            justify-content: flex-start;

            flex-direction: row;
            flex-wrap: nowrap;

            &:not(:last-child)
            {
                /* border-bottom: 1px solid #eee; */
            }

            .td
            {
                padding: 8px;

                &:not(:first-child)
                {
                    flex-shrink: 0;
                }

                &:not(:last-child)
                {
                    /* border-right: 1px solid #eee; */
                }

                &.left
                {
                    text-align: left;
                }

                &.right
                {
                    text-align: right;
                }
            }
        }
    }

    .fraction
    {
        display: inline-flex;
        flex-direction: column;
        vertical-align: middle;

        align-items: center;
    
        padding-left: 0;
        padding-right: 0;

        .divider
        {
            padding-left: 5px;
            padding-right: 5px;

            width: 90%;
            height: 1px;

            background-color: currentColor;
        }
    }

    .division
    {
        display: inline-flex;

        position: relative;

        /* padding-left: 6px; */
        /* padding-right: 3px; */
        padding: 0;

        overflow: hidden;

        &.long
        {
            border-top: 1px solid currentColor;

            .parenthese
            {
                border-top: 1px solid currentColor;
            }
        }

        &.short
        {
            border-bottom: 1px solid currentColor;

            .parenthese
            {
                border-bottom: 1px solid currentColor;
            }
        }
        
        .parenthese
        {
            border-right: 1px solid currentColor;
            border-radius: 50%;

            display: inline-flex;
            position: absolute;

            width: 8px;
            left: -4px;
              
            top: -1px;
            bottom: -1px;
        }
    }

    .straight
    {
        display: inline-flex;

        position: relative;
        margin: 0;

        .line
        {
            position: absolute;

            top: -1px;
            left: 1px;
            right: 1px;

            border-bottom: 1px solid currentColor;
        }

        .right-arrow
        {
            position: absolute;

            top: -1px;
            left: 1px;
            right: 1px;

            border-bottom: 1px solid currentColor;

            &::after
            {
                content: '';

                position: absolute;

                width: 5px;
                height: 5px;
                
                top: -2px;
                right: 0;

                border-top: 1px solid currentColor;
                border-right: 1px solid currentColor;
                
                transform: rotateZ(45deg);
            }
        }

        .left-right-arrow
        {
            position: absolute;

            top: -1px;
            left: 1px;
            right: 1px;

            border-bottom: 1px solid currentColor;

            &::before
            {
                content: '';

                position: absolute;

                width: 5px;
                height: 5px;
                
                top: -2px;
                left: 0;

                border-top: 1px solid currentColor;
                border-left: 1px solid currentColor;

                transform: rotateZ(-45deg);
            }

            &::after
            {
                content: '';

                position: absolute;

                width: 5px;
                height: 5px;
                
                top: -2px;
                right: 0;

                border-top: 1px solid currentColor;
                border-right: 1px solid currentColor;
                
                transform: rotateZ(45deg);
            }
        }
    }

    .angle
    {
        display: inline-flex;

        position: relative;
        margin: 0;

        .head
        {
            margin: 0 auto;
            position: absolute;

            width: 5px;
            height: 5px;
            
            top: -2px;
            left: 0;
            right: 0;

            border-top: 1px solid currentColor;
            border-right: 1px solid currentColor;
            
            transform: rotateZ(-45deg);
        }
    }
`

function parseFrac1 (text = '')
{
    return text.replace (/(\\frac)/gi, '')
}

function parseFrac2 (text = '')
{
    const pattern = /{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)
        
        return (
            `
            <span class="fraction" >
                ${re[1]}
                <span class="divider"></span>
                ${re[2]}
            </span>
            `
        )
    })
}

function parseFrac3 (text = '')
{
    const pattern = /{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)\/([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="fraction" >
                ${re[1]}
                <span class="divider"></span>
                ${re[2]}
            </span>
            `
        )
    })
}

function parseLongDivision1 (text = '')
{
    const pattern = /\\root\[\)\]{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{LD:${re[1]}}`
    })
}

function parseLongDivision2 (text = '')
{
    const pattern = /{⟌([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{LD:${re[1]}}`
    })
}

function parseLongDivision3 (text = '')
{
    const pattern = /{LD:([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="long division" >
                <span class="parenthese"></span>
                ${re[1]}
            </span>
            `
        )
    })
}

function parseShortDivision1 (text = '')
{
    const pattern = /\\border\[1100 black\]\s*{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{SD:${re[1]}}`
    })
}

function parseShortDivision2 (text = '')
{
    const pattern = /{∟([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{SD:${re[1]}}`
    })
}

function parseShortDivision3 (text = '')
{
    const pattern = /{SD:([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="short division" >
                <span class="parenthese"></span>
                ${re[1]}
            </span>
            `
        )
    })
}

function parseStraight1 (text = '')
{
    const pattern = /{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}\^\^{\\leftrightarrow}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{L:${re[1]}}`
    })
}

function parseStraight2 (text = '')
{
    const pattern = /{↔([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{L:${re[1]}}`
    })
}

function parseStraight3 (text = '')
{
    const pattern = /{L:([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="straight" >
                <span class="left-right-arrow"></span>
                ${re[1]}
            </span>
            `
        )
    })
}

function parseSubStraight1 (text = '')
{
    const pattern = /\\border\[0001 black\]\s*{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{SL:${re[1]}}`
    })
}

function parseSubStraight2 (text = '')
{
    const pattern = /{⇀([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{SL:${re[1]}}`
    })
}

function parseSubStraight3 (text = '')
{
    const pattern = /{SL:([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="straight" >
                <span class="line"></span>
                ${re[1]}
            </span>
            `
        )
    })
}

function parseRay1 (text = '')
{
    const pattern = /{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}\^\^{\\rightarrow}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{R:${re[1]}}`
    })
}

function parseRay2 (text = '')
{
    const pattern = /{→([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{R:${re[1]}}`
    })
}

function parseRay3 (text = '')
{
    const pattern = /{R:([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="straight" >
                <span class="right-arrow"></span>
                ${re[1]}
            </span>
            `
        )
    })
}

function parseHeadAngle1 (text = '')
{
    const pattern = /{([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}\^\^{\\land}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{A:${re[1]}}`
    })
}

function parseHeadAngle2 (text = '')
{
    const pattern = /{\^([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace (new RegExp(pattern, 'gmi'), (match, i) =>
    {
        const re = pattern.exec(match)

        return `{A:${re[1]}}`
    })
}

function parseHeadAngle3 (text = '')
{
    const pattern = /{A:([0-9A-zก-ฮ❑×#.–+÷,()\-\s]+)}/

    return text.replace(new RegExp(pattern, 'gmi'), (match, i) => 
    {
        const re = pattern.exec(match)

        return (
            `
            <span class="angle" >
                <span class="head"></span>
                ${re[1]}
            </span>
            `
        )
    })
}

function parsePlaceholder (text = '')
{
    // return text.replace ('#PLACEHOLDER', '❑')
    return text.replace (/({_*})/gi, '❑')
    // return text.replace ('{___}', '❑')
}

function parseTable (text = '')
{
    let arr1 = text.split ('#BEGIN-TABLE');

    if (arr1.length >= 2)
    {
        let result = arr1[0];

        for (let i = 1; i < arr1.length; i++)
        {
            let arr2 = arr1[i].split ('#END-TABLE');

            let rows = arr2[0].trim ().split (/\r|\n|\r\n/g);
            let table = '<span class="table" >';

            let opts1 = rows[0].split ('|');
            let opts2 = [];

            for (let j = 0; j < opts1.length; j++)
            {
                let opt = opts1[j].split (':');
                let width = (parseInt (opt[1], 10) / 16) * 100;

                if (opt[0] === 'TL')
                {
                    opts2.push ({ align: 'left', width });
                }
                else
                {
                    opts2.push ({ align: 'right', width });
                }
            }

            for (let j = 1; j < rows.length; j++)
            {
                let cols = rows[j].split ('|');
                let row = '<span class="tr">';

                for (let k = 0; k < cols.length; k++)
                {
                    let opt = opts2[k];

                    row += `
                    <span class="td ${opt.align}" style="width: calc(${opt.width}% - 16px)" >
                        ${cols[k]}
                    </span>
                    `
                }

                table += row + '</span>';
            }

            table += '</span>';
            result += table.trim ();

            if (arr2.length >= 2)
            {
                result += arr2[1];
            }
        }

        return result;
    }

    return text;
}

export default (
    {
        text = '',

        cellType = 'text',
        cellPerRow = 1,
    }
) =>
{
    // console.log ('ori', text)
    // text = text.replace (/\s/g, '&nbsp;');
    text = text.replace (/\r\n|\r|\n/g, '<br/>');

    // text = text.replace (/({{{_*}}})/gi, '{{___}}')
    text = parsePlaceholder (text)
    // text = text.replace (/({___})/gi, '#PLACEHOLDER')

    // console.log ('pla', text)
    text = parseTable (text)

    text = parseFrac1 (text)
    text = parseFrac2 (text)
    text = parseFrac3 (text)
    
    text = parseLongDivision1 (text)
    text = parseLongDivision2 (text)
    text = parseLongDivision3 (text)
    
    text = parseShortDivision1 (text)
    text = parseShortDivision2 (text)
    text = parseShortDivision3 (text)

    text = parseStraight1 (text)
    text = parseStraight2 (text)
    text = parseStraight3 (text)
    
    text = parseSubStraight1 (text)
    text = parseSubStraight2 (text)
    text = parseSubStraight3 (text)
    
    text = parseRay1 (text)
    text = parseRay2 (text)
    text = parseRay3 (text)

    text = parseHeadAngle1 (text)
    text = parseHeadAngle2 (text)
    text = parseHeadAngle3 (text)

    // text = parsePlaceholder (text)
    // console.log ('res', text)

    return (
        <Parent 
            dangerouslySetInnerHTML={{ __html: text }} 
            cellType={cellType}
            cellPerRow={cellPerRow}
        />
    )
}