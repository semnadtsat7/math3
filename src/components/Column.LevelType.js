import React from 'react'
import { grey, orange } from '@material-ui/core/colors'

const LEVEL_TYPES =
{
    'none':
    {
        title: 'ทุกประเภท',
        color: grey[500],
    },

    'normal':   
    {
        title: 'ทั่วไป',
        color: grey[500],
    },

    'boss': 
    {
        title: 'บอส',
        color: orange[500],
    },
}

function Comp (
    {
        levelType = 'normal'
    }
)
{
    if (levelType !== 'boss')
    {
        levelType = 'normal'
    }

    const { title, color } = LEVEL_TYPES[levelType]

    return (
        <span style={{ color }} >
            {title}
        </span>
    )
}

export default Comp