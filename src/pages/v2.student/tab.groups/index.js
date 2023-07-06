import React, { Fragment, useState, useReducer, useContext } from 'react'

import { 
    Paper,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core'

import AppContext from '../../../AppContext'

import Firebase from '../../../utils/Firebase'

import Flexbox from '../../../components/Flexbox'
import Progress from '../../../components/Progress'

import TableColumnName from '../../../components/Table.Column.Name'

import ScrollView from '../../students.ts.v1/ScrollView'

import Row from './Row'

import useGroups from '../../v2.students/useGroups'
import useActives from './useActives'

function reduceAction (state, action)
{
    if (action.type === 'add')
    {
        return { ...state, [action.group]: 'adding' }
    }
    else if (action.type === 'remove')
    {
        return { ...state, [action.group]: 'removing' }
    }
    else if (action.type === 'complete')
    {
        return { ...state, [action.group]: 'none' }
    }
    else
    {
        throw new Error ()
    }
}

function Comp (
    {
        history,
        match,
    }
)
{
    const { space } = useContext (AppContext)

    const [ actions, dispatchAction ] = useReducer (reduceAction, {})

    const student = match.params.studentId || 'null'
    
    const [ filters ] = useState ({ student })

    const groups = useGroups (space)
    const actives = useActives (space, filters)

    const empty = groups.items.length === 0
    const fetching = groups.fetching || actives.fetching

    async function handleAdd (group)
    {
        dispatchAction ({ type: 'add', group })

        const teacher = space

        const students = [ student ]
        const data = { teacher, group, students }

        await Firebase.functions().httpsCallable('teacher-group-student-add')(data)

        dispatchAction ({ type: 'complete', group })
    }

    async function handleRemove (group)
    {
        dispatchAction ({ type: 'remove', group })

        const teacher = space

        const students = [ student ]
        const data = { teacher, group, students }

        await Firebase.functions().httpsCallable('teacher-group-student-remove')(data)

        dispatchAction ({ type: 'complete', group })
    }

    return (
        <Fragment>
            {
                fetching ? <Progress />
                :
                empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อมูลกลุ่มเรียน</p></Flexbox>
                :
                <ScrollView fitParent={!empty} >
                    <Paper elevation={0}>
                        <Table className="custom-table" >
                            <TableHead>
                                <TableRow selected={true} >
                                    <TableCell padding="checkbox" width={64} style={{ minWidth: 64 }} >

                                    </TableCell>
                                    <TableCell 
                                        padding="default" 
                                        style={{ minWidth: 160 }} 
                                    >
                                        <TableColumnName
                                            label="ชื่อกลุ่มเรียน"
                                        /> 
                                    </TableCell>
                                    
                                    {/* <TableCell padding="checkbox" width={100} style={{ minWidth: 100 }} >

                                    </TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    groups
                                    .items
                                    .map((group) =>
                                    {
                                        return (
                                            <Row 
                                                key={group.id}
                                                history={history}
                                                space={space}

                                                group={group}
                                                student={student}

                                                active={!!actives.map[group.id]}
                                                action={actions[group.id]}

                                                onAdd={handleAdd}
                                                onRemove={handleRemove}
                                            />
                                        )
                                    })
                                    .filter(item => item)
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </ScrollView>
            }
        </Fragment>
    )
}

export default Comp