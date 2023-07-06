import React from 'react';
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

    if (orderBy === 'title')
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => (a[orderBy] || '').localeCompare(b[orderBy] || ''))
        }
        else
        {
            result = items.sort((a, b) => (b[orderBy] || '').localeCompare(a[orderBy] || ''))
        }
    }
    else
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => a[orderBy] - b[orderBy])
        }
        else
        {
            result = items.sort((a, b) => b[orderBy] - a[orderBy])
        }
    }

    return result
}

class Page extends React.Component
{

    constructor (props)
    {
        super (props);

        this.state = 
        {
            fetching: true,
            fetchingMaps: true,
            fetchingGroups: true,
            // fetchingActives: true,
            fetchingCounts: true,

            missions: [],
            maps: [],
            groups: [],
            
            // actives: {},
            stats: {},

            page: 0,
            rowsPerPage: 50,
            
            order: 'asc',
            orderBy: 'completedAt',

            map: 'none',            
            level: 'none',
            levelType: 'none',

            statusCom: 'none',
            statusPub: 'none',
        }

        this.unsubscribes = [];
        
        this.fetch = this.fetch.bind(this)

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        
        this.handleSort = this.handleSort.bind(this)
    }

    componentDidMount ()
    {
        const { history } = this.props;
        const auth = Firebase.auth();

        this.unsubscribes[0] = auth.onAuthStateChanged(user =>
        {
            if(user)
            {
                this.fetch ();
            }
            else
            {
                history.replace(`/sign-in?redirect=${encodeURIComponent(history.location.pathname + history.location.search)}`);
            }
        });
    }

    componentWillUnmount ()
    {
        this.unsubscribes.filter(fn => !!fn).forEach(fn => fn());
    }

    async fetch ()
    {
        this.setState({ 
            fetching: true, 
            fetchingMaps: true,
            fetchingGroups: true,
            // fetchingActives: true,
            fetchingStats: true,

            missions: [],
            maps: [],
            groups: [],

            stats: {},
        });

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const groupId = this.props.match.params.groupId || 'null'

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('groups')
            .doc(groupId)
            .collection('missions')
            .onSnapshot(snapshot =>
            {
                const stats = {}

                snapshot.forEach(doc => 
                {
                    stats[doc.id] = doc.data ()
                });

                this.setState({ 
                    fetchingStats: false,
                    stats,
                });
                // const items = [];

                // snapshot.forEach(doc => 
                // {
                //     const item = 
                //     {
                //         id: doc.id,
                //         ...doc.data(),

                //         group: groupId,
                //         startAt: moment(doc.get('startAt')),
                //         endAt: moment(doc.get('endAt')),
                //     };

                //     items.push(item)
                // });

                // this.setState({ 
                //     fetching: false,
                //     missions: items.sort((a, b) => a.title.localeCompare(b.title)),
                // });
            })
        )

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('missions')
            .onSnapshot(snapshot =>
            {
                const items = [];

                snapshot.forEach(doc => 
                {
                    const item = 
                    {
                        id: doc.id,
                        ...doc.data(),

                        startAt: moment(doc.get('startAt')),
                        endAt: moment(doc.get('endAt')),
                    };

                    if (item.group === groupId)
                    {
                        items.push(item)
                    }
                });

                this.setState({ 
                    fetching: false,
                    // fetchingActives: false,

                    missions: items.sort((a, b) => a.title.localeCompare(b.title)),
                });
                // const actives = {}

                // snapshot.forEach(doc => 
                // {
                //     actives[doc.id] = doc.get ('status') !== 'draft'
                // });

                // this.setState({ 
                //     fetchingActives: false,
                //     actives,
                // });
            })
        )

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('groups')
            .where('isActive', '==', true)
            .onSnapshot(snapshot =>
            {
                const groups = [];

                snapshot.forEach(doc => 
                {
                    const reward = 
                    {
                        id: doc.id,
                        ...doc.data(),

                        createdAt: doc.get('createdAt').toMillis(),
                    };

                    groups.push(reward)
                });

                this.setState({ 
                    fetchingGroups: false,
                    groups: groups.sort((a, b) => a.name.localeCompare(b.name)),
                });
            })
        )
        
        const maps = await GetMaps.get({ teacher })

        this.setState({ 
            fetchingMaps: false,
            maps,
        })
    }

    handleChangePage (event, page)
    {
        this.setState({ page });
    }
    
    handleChangeRowsPerPage (event)
    {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleSort (orderBy, order)
    {
        this.setState({ order, orderBy })
    }

    render ()
    {
        const { 
            fetching, 
            fetchingMaps,
            fetchingGroups,
            fetchingStats,
            
            missions, 
            stats,

            maps,
            // groups,

            // rowsPerPage, 
            // page,
            
            order,
            orderBy,

            map,
            level,
            levelType,

            statusCom,
            statusPub,
        } = this.state;

        const empty = missions.length === 0;
        const orderDirection = order === 'asc' ? 'desc' : 'asc'
        const sorteds = sort (missions, order, orderBy)
        
        let items = sorteds//.filter (e => !!actives[e.id])

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
            // items = items.filter (e => !!e.completedAt)
            items = items.filter (e => !!stats[e.id] && !!stats[e.id].completedAt)
        }
        else if (statusCom === 'incompleted')
        {
            items = items.filter (e => !stats[e.id] || !stats[e.id].completedAt)
        }

        if (statusPub === 'published')
        {
            items = items.filter (e => e.status === 'published')
        }
        else if (statusPub === 'draft')
        {
            items = items.filter (e => e.status === 'draft')
        }

        const loading = fetching || fetchingMaps || fetchingGroups || fetchingStats

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
                                                    name="title"
                                                    label="การบ้าน"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
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
                                                    onSort={this.handleSort}
                                                /> 
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="80" >
                                                <TableColumnName
                                                    name="endAt"
                                                    label="วันที่สิ้นสุด"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                /> 
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="80" >
                                                <TableColumnName
                                                    name="completedAt"
                                                    label="วันที่สำเร็จ"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
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

                                                const stat = stats[mission.id] || {}

                                                return (
                                                    <TableRow 
                                                        key={mission.id} 
                                                    >
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
                                                                !!stat.completedAt ?
                                                                <Typography style={{ color: teal[500] }} noWrap>
                                                                    {NumberUtil.prettify (mission.count)} / {NumberUtil.prettify (mission.count)}
                                                                </Typography>
                                                                :
                                                                <Typography noWrap>
                                                                    <strong>{NumberUtil.prettify (stat.currentCount || 0)}</strong> / {NumberUtil.prettify (mission.count)}
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
                                                                !!stat.completedAt ?
                                                                <React.Fragment>
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateTime.formatDate(stat.completedAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateTime.formatTime(stat.completedAt)}
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
                                                            value={map}
                                                            onChange={e => this.setState({ map: e.target.value })}
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
                                                            onChange={e => this.setState({ levelType: e.target.value })}
                                                        >
                                                            <MenuItem value="none">ทุกประเภท</MenuItem>
                                                            <MenuItem value="normal">ทั่วไป</MenuItem>
                                                            <MenuItem value="boss">บอส</MenuItem>
                                                        </Select>
                                                    </div>
                                                    <div className="select">
                                                        <Select
                                                            value={level}
                                                            onChange={e => this.setState({ level: e.target.value })}
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
                                                            onChange={e => this.setState ({ statusCom: e.target.value })}
                                                        >
                                                            <MenuItem value="none">ทุกสถานะความสำเร็จ</MenuItem>
                                                            <MenuItem value="incompleted">ยังไม่สำเร็จ</MenuItem>
                                                            <MenuItem value="completed">สำเร็จแล้ว</MenuItem>
                                                        </Select>
                                                    </div>
                                                    <div className="select">
                                                        <Select
                                                            value={statusPub}
                                                            onChange={e => this.setState ({ statusPub: e.target.value })}
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

export default Page