import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { 
    Checkbox,

    TableCell,
    TableRow,
} from '@material-ui/core'

import Progress from '../../../components/SmallProgress'

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

const Action = styled.div`
    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`

function Comp (
    {
        history,
        space,

        group,
        student,

        active,

        action,

        onAdd,
        onRemove,
    }
)
{
    if (!group)
    {
        return null
    }

    const inActive = !active
    // const activeStyle = { background: !!active && !!hilight ? 'rgba(32,32,128, 0.02)' : null }

    const className = !!inActive ? 'inactive' : ''

    const aClassName = `link ${className}`.trim ()
    // const tClassName = `text ${className}`.trim ()

    return (
        <TableRow 
            selected={active}
            hover={true} 
        >
            <TableCell padding="none">
                <Action>
                    {
                        action === 'adding' ? 
                        <Progress color="primary" /> 
                        :
                        action === 'removing' ? 
                        <Progress color="secondary" /> 
                        :
                        !!active ?
                        // <Button
                        //     color="secondary"
                        //     size="small"
                        //     onClick={() => onRemove (group.id)}
                        // >
                        //     ออกจากห้องเรียน
                        // </Button>
                        <Checkbox 
                            checked={true} 
                            onChange={() => onRemove (group.id)} 
                        />
                        :
                        // <Button
                        //     color="primary"
                        //     size="small"
                        //     onClick={() => onAdd (group.id)}
                        // >
                        //     เพิ่มเข้าห้องเรียน
                        // </Button>
                        <Checkbox 
                            checked={false} 
                            onChange={() => onAdd (group.id)} 
                        />
                    }
                </Action>
            </TableCell>
            <TableCell padding="none" >
                <Clickable
                    to={`/groups/${group.id}?student=${student}`}
                    className={aClassName}
                >
                    {group.name}
                </Clickable>
            </TableCell>
            {/* <TableCell padding="none">
                <Action>
                    {
                        action === 'adding' ? 
                        <Progress color="primary" /> 
                        :
                        action === 'removing' ? 
                        <Progress color="secondary" /> 
                        :
                        !!active ?
                        <Button
                            color="secondary"
                            size="small"
                            onClick={() => onRemove (group.id)}
                        >
                            ออกจากห้องเรียน
                        </Button>
                        :
                        <Button
                            color="primary"
                            size="small"
                            onClick={() => onAdd (group.id)}
                        >
                            เพิ่มเข้าห้องเรียน
                        </Button>
                    }
                </Action>
            </TableCell> */}
        </TableRow>
    )
}

export default Comp