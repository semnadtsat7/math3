import React from 'react'

import { Typography, TableSortLabel } from '@material-ui/core'
import { 
    // SwapVert, 
    UnfoldMore, 
    ArrowDownward 
} from "@material-ui/icons"

import styled from 'styled-components'

const ColumnName = styled.span`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;

    align-items: center;

    ${props => props.numeric && `
        padding-left: 4px;
    `}

    ${props => !props.numeric && `
        padding-right: 4px;
    `}
`

const Label = styled.span`
    display: flex;
    flex-direction: column;
`

function SwapIcon ()
{
    return (
        <UnfoldMore 
            style={{ opacity: 0.5, fontSize: '1rem', marginRight: 5, marginLeft: 3 }} 
        />
    )
}

function Comp (
    {
        numeric = false,

        name = '',
        label,

        orderBy = '',
        order = '',

        onSort = null,
    }
)
{
    if (!name)
    {
        return (
            <Typography 
                variant="caption" 
                color="textSecondary" 
                noWrap 
            >
                <Label>
                    {label}
                </Label>
            </Typography>
        )
    }

    const active = orderBy === name

    return (
        <TableSortLabel
            active={true}
            direction={order}
            onClick={() => onSort (name, order)}
            style={
                { 
                    // paddingLeft: !!numeric ? 12 : 0,
                    // paddingRight: !numeric ? 12 : 0,
                }
            }
            IconComponent={!!active ? ArrowDownward : SwapIcon}
        >
            <Typography 
                variant="caption" 
                color="textSecondary" 
                noWrap 
            >
                <ColumnName numeric={numeric} >
                    {/* {!active && !!numeric && <small ><UnfoldMore fontSize="small" /></small>} */}
                    <Label>{label}</Label>
                    {/* {!active && !numeric && <small style={{ marginLeft: 4 }} ><UnfoldMore fontSize="small" /></small>} */}
                </ColumnName>
            </Typography>
        </TableSortLabel> 
    )
}

export default Comp;