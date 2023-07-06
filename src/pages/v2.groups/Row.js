import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { 
    Typography,

    Button,

    TableCell,
    TableRow,
} from '@material-ui/core'

import NumberUtil from '../../utils/Number'

import useCount from './useCount'

const Clickable = styled(Link)`
    color: cornflowerblue;
    text-decoration: underline;
    
    cursor: pointer;

    padding: 14px 24px;

    display: flex;

    &:hover
    {
        text-decoration: underline;
        background: rgba(0,0,0, 0.05);
    }
`

function Comp (
    {
        space,
        group,

        onDelete,
    }
)
{
    const { fetching, count } = useCount (space, group)

    if (!group)
    {
        return null
    }

    return (
        <TableRow
            hover={true}
        >
            <TableCell 
                padding="none"
            >
                <Clickable
                    to={`/groups/${group.id}`}
                >
                    {group.name}
                </Clickable>
            </TableCell>
            {
                !!fetching ?
                <TableCell 
                    align="right" 
                    padding="checkbox"
                    className="updating"
                >
                    <Typography align="center">
                        กำลังดาวน์โหลด
                    </Typography>
                </TableCell>
                :
                <TableCell 
                    align="right" 
                    padding="checkbox"
                >
                    <Typography>
                        {NumberUtil.prettify(count || 0)}
                    </Typography>
                </TableCell>
            }
            <TableCell padding="checkbox">
                <Button
                    color="secondary"
                    size="small"
                    onClick={() => onDelete (group)}
                    style={{ minWidth: 40, maxWidth: 40 }}
                >
                    ลบ
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default Comp