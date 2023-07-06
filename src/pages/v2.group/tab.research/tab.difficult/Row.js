import React from 'react'
// import styled from 'styled-components'

import { 
    Typography,

    TableCell,
    TableRow,

} from '@material-ui/core'

import NumberUtil from '../../../../utils/Number'

function Comp (
    {
        n,
        bg,
        count,
        score,
        score2,
        items = [],
    }
)
{
    const cols = [];

    for (let i = 0; i < count; i++)
    {
        const value = items.length > i ? items[i] : 0;

        cols.push (
            <TableCell key={`student-${n}-${i}`} align="right" padding="checkbox">
                {
                    typeof value === 'number' ?
                    <Typography variant="body2" noWrap>
                        {NumberUtil.prettify (value)}
                    </Typography>
                    :
                    <Typography variant="caption" style={{ padding: `8px 0` }} >
                        {value}
                    </Typography>
                }
            </TableCell>
        )
    }

    const style = {};

    if (bg)
    {
        style.backgroundColor = bg;
    }

    return (
        <TableRow style={style} >
            <TableCell padding="checkbox">
                <Typography variant="body2" noWrap>
                    {
                        typeof n === 'number' ?
                        NumberUtil.prettify (n)
                        :
                        n
                    }
                </Typography>
            </TableCell>
            {cols}
            <TableCell align="right" padding="checkbox">
                {
                    typeof score === 'number' &&
                    <Typography variant="body2" noWrap>
                        <strong>{NumberUtil.prettify (score)}</strong>
                    </Typography>
                }
            </TableCell>
            <TableCell align="right" padding="checkbox">
                {
                    typeof score2 === 'number' ?
                    <Typography variant="body2" noWrap>
                        <strong>{NumberUtil.prettify (score2)}</strong>
                    </Typography>
                    :
                    typeof score === 'number' &&
                    <Typography variant="body2" noWrap>
                        <strong>{NumberUtil.prettify (score * score)}</strong>
                    </Typography>
                }
            </TableCell>
        </TableRow>
    )
}

export default Comp