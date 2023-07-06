import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import moment from 'moment'

// import { DateTimePicker } from 'material-ui-pickers'

import Firebase from '../utils/Firebase';
import DateTime from '../utils/DateTime'

import GetMaps from '../services/getMaps.V1'

import { 
    Avatar,

    // Dialog,
    // DialogTitle, 
    // DialogContent, 
    // DialogActions,

    // FormControl,
    // InputLabel,

    Typography,
    Paper,

    // Modal,
    // Button,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    // TablePagination,

    Select,
    MenuItem,

    ListItem,
    ListItemText,
    // FormGroup,
    // FormControlLabel,
    // Checkbox,
    // TableSortLabel,

    // Grid,
} from '@material-ui/core'

import { teal, orange } from '@material-ui/core/colors'

// import Parent from '../components/Parent';
// import ActionBar from '../components/ActionBar';
// import MenuButton from '../components/MenuButton';
import Flexbox from '../components/Flexbox';
import Progress from '../components/Progress';
// import TextField from '../components/TextField';

import TableColumnName from '../components/Table.Column.Name'

import ColumnLevel from '../components/Column.Level'
import ColumnLevelType from '../components/Column.LevelType'

import NumberUtil from '../utils/Number'

function TabContainer({ children, dir }) {
    return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};


function sort (items, order, orderBy)
{
    let result = []

    if (orderBy === 'student')
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => 
            {
                const an = a.student.name || ''
                const bn = b.student.name || ''

                if (an === bn)
                {
                    const am = a.title || ''
                    const bm = b.title || ''

                    return am.localeCompare (bm)
                }

                return an.localeCompare (bn)
            })
        }
        else
        {
            result = items.sort((a, b) => 
            {
                const an = a.student.name || ''
                const bn = b.student.name || ''

                if (an === bn)
                {
                    const am = a.title || ''
                    const bm = b.title || ''

                    return am.localeCompare (bm)
                }

                return bn.localeCompare (an)
            })
        }
    }
    else if (orderBy === 'title')
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => 
            {
                const am = a.title || ''
                const bm = b.title || ''

                if (am === bm)
                {
                    const an = a.student.name || ''
                    const bn = b.student.name || ''

                    return an.localeCompare (bn)
                }

                return am.localeCompare (bm)
            })
            // result = items.sort((a, b) => (a[orderBy] || '').localeCompare(b[orderBy] || ''))
        }
        else
        {
            result = items.sort((a, b) => 
            {
                const am = a.title || ''
                const bm = b.title || ''

                if (am === bm)
                {
                    const an = a.student.name || ''
                    const bn = b.student.name || ''

                    return an.localeCompare (bn)
                }

                return bm.localeCompare (am)
            })
            // result = items.sort((a, b) => (b[orderBy] || '').localeCompare(a[orderBy] || ''))
        }
    }
    else
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => (a[orderBy] || Number.MAX_SAFE_INTEGER) - (b[orderBy] || Number.MAX_SAFE_INTEGER))
        }
        else
        {
            result = items.sort((a, b) => (b[orderBy] || 0) - (a[orderBy] || 0))
        }
    }

    return result
}

function useMissions (match)
{
    const [ fetchingStudents, setFetchingStudents ] = useState (true)
    const [ fetchingMissions, setFetchingMissions ] = useState (true)
    const [ fetchingActives, setFetchingActives ] = useState (true)

    const [ students, setStudents ] = useState ([])
    const [ missions, setMissions ] = useState ([])
    const [ actives, setActives ] = useState ({})

    const fetching = fetchingStudents || fetchingMissions || fetchingActives
    // const items = missions.filter (e => !!actives[e.id])

    function handleFetchStudents ()
    {
        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const studentIds = Object.keys (actives).filter (key => !!actives[key])

        const unsubscribes = []

        const ss = {}
        // const ms = {}

        const cfs = Firebase.firestore ()
        const col = cfs.collection (`teachers/${teacher}/students`)

        // function validate ()
        // {
        //     const ids1 = Object.keys (ss)
        //     const ids2 = Object.keys (ms)

        //     if (ids1.length >= studentIds.length && ids2.length >= studentIds.length)
        //     {
        //         let arr0 = []
        //         let arr1 = []

        //         for (let i = 0; i < studentIds.length; i++)
        //         {
        //             const studentId = studentIds[i]

        //             const student = ss[studentId]
        //             const missions = ms[studentId]

        //             missions.forEach (m =>
        //             {
        //                 m.student = student
        //             })

        //             if (missions.length > 0)
        //             {
        //                 arr0.push (student)
        //             }

        //             arr1 = arr1.concat (missions)
        //         }

        //         setStudents (arr0)
        //         setMissions (arr1)
        //         setFetchingMissions (false)
        //     }
        // }

        function validate ()
        {
            setStudents (Object.keys (ss).map (id => ss[id]))
            setFetchingStudents (false)
        }

        for (let i = 0; i < studentIds.length; i++)
        {
            const studentId = studentIds[i]

            unsubscribes.push (
                col
                .doc (studentId)
                .onSnapshot (doc =>
                {
                    const raw = ss[studentId] || {}
                    ss[studentId] = { ...raw, id: doc.id, ...doc.data () }
                })
            )

            unsubscribes.push (
                col
                .doc (studentId)
                .collection ('missions')
                // .where ('group', '==', null)
                .onSnapshot (snapshot =>
                {
                    const stats = {}

                    snapshot.forEach (doc =>
                    {
                        if (!doc.get ('group'))
                        {
                            stats[doc.id] = { id: doc.id, ...doc.data () }
                            // missions.push ({ id: doc.id, ...doc.data () })
                        }
                    })
                    
                    const raw = ss[studentId] || {}
                    ss[studentId] = { ...raw, stats }
                    // ms[studentId] = missions

                    validate ()
                })
            )
        }

        return function ()
        {
            unsubscribes.filter (fn => !!fn).forEach (fn => fn ())
        }
    }

    function handleFetchActives ()
    {
        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const groupId = match.params.groupId || 'null'

        const cfs = Firebase.firestore ()
        const ref = cfs.collection (`teachers/${teacher}/groups/${groupId}/students`).where ('isActive', '==', true)

        const fn = ref.onSnapshot(snapshot =>
        {
            const actives = {}

            snapshot.forEach(doc => 
            {
                actives[doc.id] = true
            })

            setActives (actives)
            setFetchingActives (false)
        })

        return function ()
        {
            fn ()
        }
    }

    function handleFetchMissions ()
    {
        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const cfs = Firebase.firestore ()
        const ref = cfs.collection (`teachers/${teacher}/missions`)

        const fn = ref.onSnapshot(snapshot =>
        {
            const items = []

            snapshot.forEach(doc => 
            {
                const item = 
                {
                    id: doc.id,
                    ...doc.data(),

                    startAt: moment(doc.get('startAt')),
                    endAt: moment(doc.get('endAt')),
                }

                if (!item.group || item.group === 'none')
                {
                    items.push (item)
                }
            })

            setMissions (items)
            setFetchingMissions (false)
        })

        return function ()
        {
            fn ()
        }
    }

    useEffect (handleFetchActives, [])
    useEffect (handleFetchMissions, [])
    useEffect (handleFetchStudents, [ actives ])

    const _missions = []

    if (!fetching)
    {
        missions.forEach (m =>
        {
            students.forEach (({ stats = {}, ...s }) =>
            {
                const stat = stats[m.id] || {}
                const item = 
                {
                    ...m,
    
                    currentCount: stat.currentCount || 0,
                    completedAt:  stat.completedAt,
    
                    student: s,
                }
    
                _missions.push (item)
            })
        })
    }

    return [ fetching, _missions, students ]
}

function Page (
    {
        match,
    }
) 
{
    const space = window.localStorage.getItem ('space')

    const [ fetchingMissions, missions, students ] = useMissions (match)
    const [ fetchingMaps, setFetchingMaps ] = useState (true)
    // const [ fetchingActives, setFetchingActives ] = useState (true)

    const [ maps, setMaps ] = useState ([])
    // const [ actives, setActives ] = useState ({})

    const [ order, setOrder ] = useState ('asc')
    const [ orderBy, setOrderBy ] = useState ('completedAt')
    const [ mission, setMission ] = useState ('none')
    const [ student, setStudent ] = useState ('none')
    const [ map, setMap ] = useState ('none')
    const [ level, setLevel ] = useState ('none')
    const [ levelType, setLevelType ] = useState ('none')
    const [ statusCom, setStatusCom ] = useState ('none')
    const [ statusPub, setStatusPub ] = useState ('none')

    // const loading = fetching || fetchingMaps || fetchingStudents
    const loading = fetchingMissions || fetchingMaps;// || fetchingActives

    const empty = missions.length === 0;
    const orderDirection = order === 'asc' ? 'desc' : 'asc'
    const sorteds = sort (missions, order, orderBy)

    let items = sorteds//.filter (e => !!actives[e.id])

    const missionIds = []
    const missionOptions = []

    items.forEach (({ id, title }) =>
    {
        if (missionIds.indexOf (id) < 0)
        {
            missionIds.push (id)
            missionOptions.push ({ id, title })
        }
    })

    if (mission !== 'none')
    {
        items = items.filter (e => e.id === mission)
    }

    if (student !== 'none')
    {
        items = items.filter (e => e.student.id === student)
    }

    if (map !== 'none')
    {
        items = items.filter (e => e.map === map)
    }

    if (level !== 'none')
    {
        items = items.filter (e => e.level === level)
    }

    if (levelType !== 'none')
    {
        if (levelType === 'boss')
        {
            items = items.filter (e => e.type === 'boss')
        }
        else
        {
            items = items.filter (e => e.type !== 'boss')
        }
    }

    if (statusCom === 'completed')
    {
        items = items.filter (e => !!e.completedAt)
    }
    else if (statusCom === 'incompleted')
    {
        items = items.filter (e => !e.completedAt)
    }
    
    if (statusPub === 'published')
    {
        items = items.filter (e => e.status === 'published')
    }
    else if (statusPub === 'draft')
    {
        items = items.filter (e => e.status === 'draft')
    }

    function handleMount ()
    {
        const teacher = space || Firebase.auth().currentUser.uid;

        GetMaps
        .get({ teacher })
        .then (maps =>
        {
            setMaps (maps)
            setFetchingMaps (false)
        })
    }

    function handleSort (orderBy, order)
    {
        setOrderBy (orderBy)
        setOrder (order)
    }

    // function handleFetchActives ()
    // {
    //     const teacher = space || Firebase.auth().currentUser.uid;

    //     const cfs = Firebase.firestore ()
    //     const ref = cfs.collection (`teachers/${teacher}/missions`)

    //     const fn = ref.onSnapshot(snapshot =>
    //     {
    //         const actives = {}

    //         snapshot.forEach(doc => 
    //         {
    //             actives[doc.id] = doc.get ('status') !== 'draft'
    //         })

    //         setActives (actives)
    //         setFetchingActives (false)
    //     })

    //     return function ()
    //     {
    //         fn ()
    //     }
    // }

    // useEffect (handleFetchActives, [])
    useEffect (handleMount, [])

    return (
        <React.Fragment>
            {
                loading ? <Progress /> :
                empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีการบ้าน</p></Flexbox> :
                <React.Fragment>
                    <ScrollView fitParent={!empty} >
                        <Paper elevation={0}>
                            <Table className="custom-table" >
                                <TableHead>
                                    <TableRow selected={true} >
                                        <TableCell padding="default">
                                            <TableColumnName
                                                name={student === 'none' ? "student" : null}
                                                label="นักเรียน"
                                                orderBy={orderBy}
                                                order={orderDirection}
                                                onSort={handleSort}
                                            /> 
                                        </TableCell>

                                        
                                        <TableCell padding="default">
                                            <TableColumnName
                                                name="title"
                                                label="การบ้าน"
                                                orderBy={orderBy}
                                                order={orderDirection}
                                                onSort={handleSort}
                                            /> 
                                        </TableCell>
                                        
                                        <TableCell padding="default">
                                            <TableColumnName
                                                label="สถานะ"
                                            />
                                        </TableCell>

                                        <TableCell padding="default">
                                            <TableColumnName
                                                label="รางวัล"
                                            />
                                        </TableCell>
    
                                        <TableCell padding="default">
                                            <TableColumnName
                                                label="แผนที่"
                                            /> 
                                        </TableCell>
                                        <TableCell align="right" padding="checkbox" width="100">
                                            <TableColumnName
                                                label="ประเภท"
                                            />
                                        </TableCell>
                                        
                                        <TableCell align="right" padding="checkbox" width="100">
                                            <TableColumnName
                                                label="ระดับ"
                                            /> 
                                        </TableCell>
    
                                        <TableCell align="right" padding="checkbox" width="120">
                                            <TableColumnName
                                                label="จำนวนด่าน"
                                            /> 
                                        </TableCell>
    
                                        <TableCell align="right" padding="checkbox" width="80" >
                                            <TableColumnName
                                                name="startAt"
                                                label="วันที่เริ่ม"
                                                orderBy={orderBy}
                                                order={orderDirection}
                                                onSort={handleSort}
                                            />
                                        </TableCell>
                                        <TableCell align="right" padding="checkbox" width="80" >
                                            <TableColumnName
                                                name="endAt"
                                                label="วันที่สิ้นสุด"
                                                orderBy={orderBy}
                                                order={orderDirection}
                                                onSort={handleSort}
                                            /> 
                                        </TableCell>
                                        <TableCell align="right" padding="checkbox" width="80" >
                                            <TableColumnName
                                                name="completedAt"
                                                label="วันที่สำเร็จ"
                                                orderBy={orderBy}
                                                order={orderDirection}
                                                onSort={handleSort}
                                            /> 
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        // sorteds
                                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        items
                                        .map((mission, i) =>
                                        {
                                            let mapTitle = 'ทุกบท'
                                            // let groupTitle = 'รายบุคคล'
    
                                            if (mission.map !== 'none')
                                            {
                                                mapTitle = maps.filter (m => m._docId === mission.map)[0].title
                                            }
    
                                            // if (!!mission.group)
                                            // {
                                            //     groupTitle = 'ห้องเรียน ' + groups.filter (g => g.id === mission.group)[0].name
                                            // }

                                            return (
                                                <TableRow 
                                                    key={`${mission.id}-${mission.student.id}`} 
                                                >
                                                    <TableCell padding="default">
                                                        <Typography noWrap>
                                                            {mission.student.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell padding="default">
                                                        <Typography noWrap>
                                                            {mission.title}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell padding="default">
                                                        <Typography
                                                            style={{ color: mission.status === 'draft' ? orange[500] : teal[500] }}
                                                            noWrap
                                                        >
                                                            {
                                                                mission.status === 'draft' ?
                                                                `แบบร่าง`: `เผยแพร่`
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    {/* <TableCell padding="default">
                                                        <Typography noWrap>
                                                            {groupTitle}
                                                        </Typography>
                                                    </TableCell> */}

                                                    <TableCell padding="default">
                                                        {/* <AvatarShadow>
                                                            <Avatar src={mission.reward.image} />
                                                        </AvatarShadow> */}
                                                        <Typography noWrap>
                                                            {/* {mission.reward.name} */}
                                                            <ListItem style={{ padding: 0 }} >
                                                                <AvatarShadow>
                                                                    <Avatar src={mission.reward.image} />
                                                                </AvatarShadow>
                                                                <ListItemText 
                                                                    primary={mission.reward.name} 
                                                                    style={{ paddingRight: 0 }}
                                                                />
                                                            </ListItem>
                                                        </Typography>
                                                    </TableCell>
    
                                                    <TableCell padding="default">
                                                        <Typography noWrap>
                                                            {mapTitle}
                                                        </Typography>
                                                    </TableCell>
                                                    
                                                    <TableCell align="right" padding="checkbox">
                                                        <Typography noWrap>
                                                            <ColumnLevelType levelType={mission.levelType} />
                                                        </Typography>
                                                    </TableCell>
                                                    
                                                    <TableCell align="right" padding="checkbox">
                                                        <Typography noWrap>
                                                            <ColumnLevel level={mission.level} />
                                                        </Typography>
                                                    </TableCell>
                                                    
                                                    <TableCell align="right" padding="checkbox">
                                                        {
                                                            !!mission.completedAt ?
                                                            <Typography style={{ color: teal[500] }} noWrap>
                                                                {NumberUtil.prettify (mission.count)} / {NumberUtil.prettify (mission.count)}
                                                            </Typography>
                                                            :
                                                            <Typography noWrap>
                                                                <strong>{NumberUtil.prettify (mission.currentCount || 0)}</strong> / {NumberUtil.prettify (mission.count)}
                                                            </Typography>
                                                        }
                                                    </TableCell>
                                                    
                                                    <TableCell align="right" padding="checkbox">
                                                        {
                                                            mission.startAt ? 
                                                            <React.Fragment>
                                                                <Typography variant="caption" noWrap>
                                                                    {DateTime.formatDate(mission.startAt, { monthType: 'short' })}
                                                                    <Typography component="small" variant="caption" noWrap>
                                                                        {DateTime.formatTime(mission.startAt)}
                                                                    </Typography>
                                                                </Typography>
                                                            </React.Fragment> 
                                                            : 
                                                            '-'
                                                        }
                                                    </TableCell>
                                                    <TableCell align="right" padding="checkbox">
                                                        {
                                                            mission.endAt ? 
                                                            <React.Fragment>
                                                                {
                                                                    mission.endAt.valueOf && mission.endAt.valueOf () >= new Date (2100, 0).getTime () ?
                                                                    <Typography variant="caption" noWrap>
                                                                        ไม่จำกัดเวลา
                                                                    </Typography>
                                                                    :
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateTime.formatDate(mission.endAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateTime.formatTime(mission.endAt)}
                                                                        </Typography>
                                                                    </Typography>
                                                                }
                                                            </React.Fragment> 
                                                            : 
                                                            '-'
                                                        }
                                                    </TableCell>
                                                    <TableCell align="right" padding="checkbox">
                                                        {
                                                            mission.completedAt ? 
                                                            <React.Fragment>
                                                                <Typography variant="caption" noWrap>
                                                                    {DateTime.formatDate(mission.completedAt, { monthType: 'short' })}
                                                                    <Typography component="small" variant="caption" noWrap>
                                                                        {DateTime.formatTime(mission.completedAt)}
                                                                    </Typography>
                                                                </Typography>
                                                            </React.Fragment> 
                                                            : 
                                                            '-'
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                        .filter(item => item)
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </ScrollView>
                    <Paper elevation={0} style={{ borderTop: '1px solid #ddd' }} >
                        <HorizontalScrollView>
                            <Table className="custom-table" >
                                <TableFooter>
                                    <TableRow>
                                    <TableCell>
                                            <TableToolbar>
                                                <div className="select">
                                                    <Select
                                                        value={mission}
                                                        onChange={e => setMission (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกการบ้าน</MenuItem>
                                                        {
                                                            missionOptions
                                                            .sort ((a, b) => a.title.localeCompare (b.title))
                                                            .map((m, i) =>
                                                            {
                                                                return (
                                                                    <MenuItem key={'mission-'+m.id} value={m.id}>{m.title}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </div>
                                                <div className="select">
                                                    <Select
                                                        value={student}
                                                        onChange={e => setStudent (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกคน</MenuItem>
                                                        {
                                                            students
                                                            .map((student, i) =>
                                                            {
                                                                return (
                                                                    <MenuItem key={'student-'+student.id} value={student.id}>{student.name}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </div>
                                                <div className="select">
                                                    <Select
                                                        value={map}
                                                        onChange={e => setMap (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกบท</MenuItem>
                                                        {
                                                            maps
                                                            .map((map, i) =>
                                                            {
                                                                return (
                                                                    <MenuItem key={'map-'+map._docId} value={map._docId}>{map.title}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </div>
                                                <div className="select">
                                                    <Select
                                                        value={levelType}
                                                        onChange={e => setLevelType (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกประเภท</MenuItem>
                                                        <MenuItem value="normal">ทั่วไป</MenuItem>
                                                        <MenuItem value="boss">บอส</MenuItem>
                                                    </Select>
                                                </div>
                                                <div className="select">
                                                    <Select
                                                        value={level}
                                                        onChange={e => setLevel (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกระดับ</MenuItem>
                                                        <MenuItem value="tutorial">สอนใช้งาน</MenuItem>
                                                        <MenuItem value="easy">ระดับง่าย</MenuItem>
                                                        <MenuItem value="normal">ระดับปานกลาง</MenuItem>
                                                        <MenuItem value="hard">ระดับยาก</MenuItem>
                                                    </Select>
                                                </div>
                                                <div className="select">
                                                    <Select
                                                        value={statusCom}
                                                        onChange={e => setStatusCom (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกสถานะความสำเร็จ</MenuItem>
                                                        <MenuItem value="incompleted">ยังไม่สำเร็จ</MenuItem>
                                                        <MenuItem value="completed">สำเร็จแล้ว</MenuItem>
                                                    </Select>
                                                </div>
                                                <div className="select">
                                                    <Select
                                                        value={statusPub}
                                                        onChange={e => setStatusPub (e.target.value)}
                                                    >
                                                        <MenuItem value="none">ทุกสถานะการเผยแพร่</MenuItem>
                                                        <MenuItem value="draft">แบบร่าง</MenuItem>
                                                        <MenuItem value="published">เผยแพร่</MenuItem>
                                                    </Select>
                                                </div>
                                                <div className="flex" />
                                            </TableToolbar>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </HorizontalScrollView>
                    </Paper>
                </React.Fragment>
            }
        </React.Fragment>
    )
}


const ScrollView = styled.div`
    overflow: auto;

    ${props => props.fitParent && `
        height: 100%;
    `}
    
    table
    {
        background: white;
    }
`

const TableToolbar = styled.div`
    overflow-x: auto;
    overflow-y: hidden;

    height: 48px;

    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;
    flex-shrink: 0;

    align-items: center;
    justify-content: flex-end;

    border-bottom: 1px solid #eee;

    .flex
    {
        flex-grow: 1;
        flex-shrink: 1;
    }

    .select
    {
        padding: 4px;
    }
`

const HorizontalScrollView = styled.div`
    overflow-x: auto;

    table
    {
        overflow-x: auto;
    }
`

// const ModalRoot = styled(Modal)`
//     display: flex;
// `

// const ModalPanel = styled.div`
//     margin: auto;

//     display: flex;

//     flex-direction: column;
//     flex-grow: 1;

//     background-color: white;
//     border-radius: 8px;

//     height: fit-content;

//     max-height: calc(100% - 48px);
//     max-width: calc(100% - 48px);

//     box-shadow: 0 3px 6px rgba(0,0,0,0.2),   0 3px 6px rgba(0,0,0,0.3);

//     @media (min-width: 528px)
//     {
//         max-width: 480px;
//     }
// `

const AvatarShadow = styled.div`
    filter: drop-shadow(0 0 1px rgba(0,0,0, 0.5));
`

// const Description = styled.p`
//     margin: 2px 0 0 0;
//     padding: 0;

//     opacity: 0.75;
// `

// const StyledTextField = styled.div`
//     width: 100%;
    
//     > div
//     {
//         margin: 0;
//     }
// `

function PageWrapped (
    {
        match,
        history,
    }
)
{
    const [ visible, setVisible ] = useState (false)

    function handleMount ()
    {
        const auth = Firebase.auth()
        const un = auth.onAuthStateChanged(user =>
        {
            if (user)
            {
                setVisible (true)
            }
            else
            {
                history.replace(`/sign-in?redirect=${encodeURIComponent(history.location.pathname + history.location.search)}`);
            }
        })

        return function ()
        {
            un ()
        }
    }

    useEffect (handleMount, [])

    if (!visible)
    {
        return null
    }

    return <Page match={match} history={history} />
}

export default PageWrapped