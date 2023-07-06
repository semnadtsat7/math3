import React from 'react'
import { teal, red, blue, indigo, grey } from '@material-ui/core/colors'

const LEVELS =
{
    'none':
    {
        title: 'ทุกระดับ',
        color: grey[500],
    },

    'easy':
    {
        title: 'ง่าย',
        color: blue[500],
    },

    'normal':   
    {
        title: 'ปานกลาง',
        color: teal[500],
    },

    'hard': 
    {
        title: 'ยาก',
        color: red[500],
    },

    'tutorial': 
    {
        title: 'สอน',
        color: indigo[500],
    },
}

function Comp (
    {
        level = 'normal'
    }
)
{
    const { title, color } = LEVELS[level]

    return (
        <span style={{ color }} >
            {title}
        </span>
    )
}

export default Comp