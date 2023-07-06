import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'

import styled from 'styled-components';

import Firebase from '../utils/Firebase';
import DateTime from '../utils/DateTime'

import { 
    Avatar,
    Checkbox,

    Paper,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    // TablePagination,
    Button,
    Typography,
    // TableSortLabel,

    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    LinearProgress,
    MenuItem,
    Select,

} from '@material-ui/core'

import Parent from './../components/Parent';
import ActionBar from './../components/ActionBar';
import MenuButton from './../components/MenuButton';
import Flexbox from '../components/Flexbox';
import Progress from '../components/Progress';

import TableColumnName from '../components/Table.Column.Name'

const Timestamp = Firebase.firestore.Timestamp

function sort (items, order, orderBy)
{
    let result = []

    if (orderBy === 'status' || orderBy === 'name')
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
            result = items.sort((a, b) => (a[orderBy] ? a[orderBy].toDate() : 0) - (b[orderBy] ? b[orderBy].toDate() : 0))
        }
        else
        {
            result = items.sort((a, b) => (b[orderBy] ? b[orderBy].toDate() : 0) - (a[orderBy] ? a[orderBy].toDate() : 0))
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
            fetchingStudents: true,
            fetchingRewards: true,
            fetchingUseds: true,

            students: {},
            rewards: [],

            selects: {},

            useds: [],
            
            page: 0,
            rowsPerPage: 50,
            
            order: 'desc',
            orderBy: 'requestedAt',

            saving: false,

            approvesDialog: 0,
            deletesDialog: 0,

            rewardName: 'none',
            rewardStatus: 'requested',
            studentName: 'none',
        }

        this.unsubscribes = []
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

    fetch = async () =>
    {
        this.setState(
            { 
                fetchingStudents: true,
                fetchingRewards: true,
                fetchingUseds: true,
    
                students: {},
                rewards: [],

                selects: {},
            }
        )

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const { order, orderBy } = this.state
        
        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('student_rewards')
            .where('status', '==', 'requested')
            .onSnapshot(snapshot =>
            {
                const excludes = {}

                this.state.rewards.forEach (r =>
                {
                    excludes[r.id] = true
                })
                
                const rewards = [];

                snapshot.forEach(doc => 
                {
                    if (doc.exists)
                    {
                        excludes[doc.id] = false

                        const reward = 
                        {
                            id: doc.id,
                            ...doc.data(),
                        };

                        rewards.push(reward)
                    }
                });

                let removes = Object.keys (excludes).filter (id => !!excludes[id])
                let selects = {}

                removes.forEach (id =>
                {
                    selects[id] = this.state.selects[id]
                })

                this.setState({ 
                    fetchingRewards: false,
                    rewards: sort(rewards, order, orderBy),
                    selects,
                });
            })
        )

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('student_rewards')
            .where('status', '==', 'used')
            .onSnapshot(snapshot =>
            {
                const useds = [];

                snapshot.forEach(doc => 
                {
                    if(doc.exists)
                    {
                        const reward = 
                        {
                            id: doc.id,
                            ...doc.data(),
                        };

                        useds.push(reward)
                    }
                });

                this.setState({ 
                    fetchingUseds: false,
                    useds: sort(useds, order, orderBy)
                });
            })
        )

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('students')
            .where('isActive', '==', true)
            .onSnapshot(snapshot =>
            {
                const students = {}

                snapshot.forEach(doc => 
                {
                    students[doc.id] = doc.data ()
                })

                this.setState({ 
                    fetchingStudents: false,
                    students,
                });
            })
        )
    }

    handleChangePage = (event, page) =>
    {
        this.setState({ page })
    }

    handleChangeRowsPerPage = (event) =>
    {
        this.setState({ rowsPerPage: event.target.value })
    }

    handleConfirm = async (student, reward) =>
    {
        if (!!student && !!reward)
        {
            const space = window.localStorage.getItem ('space')
            const teacher = space || Firebase.auth().currentUser.uid;

            const rewards = this.state.rewards.map (r =>
                {
                    const status = r.id === reward ? 'used' : r.status
                    const usedAt = r.id === reward ? Timestamp.now () : r.usedAt

                    return { ...r, status, usedAt }
                })

            this.setState({ rewards })

            await Firebase.functions().httpsCallable('teacher-student-reward-confirm')({ teacher, student, reward })
        }
    }

    handleConfirmAll = async () =>
    {
        if (!window.confirm ('ต้องการอนุมัติรางวัลทั้งหมด ?'))
        {
            return
        }

        this.setState ({ saving: true })

        const data = {}
        const rewards = this.state.rewards.map (r =>
            {
                if (r.status === 'requested')
                {
                    const student = r.student

                    if (!data[student])
                    {
                        data[student] = []
                    }

                    data[student].push (r.id)

                    // return { ...r, status: 'used', usedAt: Timestamp.now () }
                }

                return r
            })

        this.setState({ rewards })

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const promises = Object.keys (data).map (student =>
        {
            const reward = data[student]
            return Firebase.functions().httpsCallable('teacher-student-reward-confirm')({ teacher, student, reward })
        })

        await Promise.all (promises)

        this.setState ({ saving: false })
    }

    handleSort = (orderBy, order) =>
    {
        this.setState({ order, orderBy })
    }

    handleApproves = async () =>
    {
        this.setState ({ approvesDialog: 2 })

        const selects = this.state.selects
        
        const data = {}
        const arr = [ ...this.state.rewards, ...this.state.useds ]
        
        arr.forEach (r =>
            {
                if (!!selects[r.id] && r.status === 'requested')
                {
                    const student = r.student

                    if (!data[student])
                    {
                        data[student] = []
                    }

                    data[student].push (r.id)
                }
            })

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;
        
        const promises = Object.keys (data).map (student =>
        {
            const reward = data[student]
            return Firebase.functions().httpsCallable('teacher-student-reward-confirm')({ teacher, student, reward })
        })

        await Promise.all (promises)
    
        this.setState ({ approvesDialog: 0, selects: [] })
    }

    handleDeletes = async () =>
    {
        this.setState ({ deletesDialog: 2 })

        const selects = this.state.selects
        const data = {}

        const arr = [ ...this.state.rewards, ...this.state.useds ]
        
        arr.forEach (r =>
        {
            if (!!selects[r.id])
            {
                const student = r.student

                if (!data[student])
                {
                    data[student] = []
                }

                data[student].push (r.id)
            }
        })

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const promises = Object.keys (data).map (student =>
        {
            const reward = data[student]
            return Firebase.functions().httpsCallable('teacher-student-reward-remove')({ teacher, student, reward })
        })

        await Promise.all (promises)

        this.setState ({ deletesDialog: 0, selects: [] })
    }

    render ()
    {
        const { 
            fetchingStudents,
            fetchingRewards,
            fetchingUseds,

            students,
            rewards,
            useds,
            
            order,
            orderBy,

            saving,

            selects,
            
            approvesDialog,
            deletesDialog,

            rewardName,
            rewardStatus,
            studentName,
        } = this.state

        const items = [ ...rewards, ...useds ]

        let sorteds = sort (items, order, orderBy)

        let _students = []
        let _rewards = []

        sorteds.forEach (r =>
        {
            if (_rewards.indexOf (r.name) < 0)
            {
                _rewards.push (r.name)
            }
        })
    
        if (rewardName !== 'none')
        {
            sorteds = sorteds.filter (r => r.name === rewardName)
        }

        if (rewardStatus !== 'none')
        {
            if (rewardStatus === 'active')
            {
                sorteds = sorteds.filter (r => r.status === 'active' || r.status === 'purchased')
            }
            else
            {
                sorteds = sorteds.filter (r => r.status === rewardStatus)
            }
        }

        sorteds.forEach (r =>
        {
            const student = students[r.student]

            if (!!student && _students.indexOf (student.name) < 0)
            {
                _students.push (student.name)
            }
        })

        if (studentName !== 'none')
        {
            sorteds = sorteds.filter (r => !!students[r.student]).filter (r => students[r.student].name === studentName)
        }
        
        const selectCount = Object.keys (selects).filter (id => !!selects[id]).length

        const empty = items.length === 0;
        const orderDirection = order === 'asc' ? 'desc' : 'asc'

        return (
            <Parent ref="parent" >
                <ActionBar >
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle1" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }} >
                        อนุมัติรางวัล
                    </Typography>
                </ActionBar>
                {
                    selectCount > 0 &&
                    <ActionBar>
                        <Button 
                            variant="contained"
                            color="primary" 
                            size="small"
                            mini={true}
                            onClick={e => this.setState ({ approvesDialog: 1 })}
                        >
                            อนุมัติรายการ
                        </Button>

                        <div style={{ width: 8 }} />

                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            mini={true}
                            onClick={() => this.setState ({ deletesDialog: 1 })}
                        >
                            ลบรายการ
                        </Button>

                    </ActionBar>
                }
                {
                    fetchingStudents || fetchingRewards || fetchingUseds ? <Progress /> :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีรางวัลรออนุมัติ</p></Flexbox> :
                    <React.Fragment>
                        <ScrollView fitParent={!empty} withFab={!empty} >
                            <Paper elevation={0}>
                                <Table className="custom-table" >
                                    <TableHead>
                                        <TableRow selected={true} >
                                            <TableCell padding="checkbox" width="64" ></TableCell>
                                            <TableCell padding="dense" width="40" >รูป</TableCell>
                                            <TableCell padding="default">
                                                <TableColumnName
                                                    name="name"
                                                    label="รางวัล"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                />
                                            </TableCell>
                                            <TableCell padding="default" width="200" >
                                                <TableColumnName
                                                    label="นักเรียน"
                                                /> 
                                            </TableCell>
                                            <TableCell padding="default" width="80" >
                                                <TableColumnName
                                                    name="requestedAt"
                                                    label="วันที่ใช้งาน"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                /> 
                                            </TableCell>
                                            <TableCell padding="checkbox" width="120" >
                                                <TableColumnName
                                                    name="status"
                                                    label="สถานะ"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                />
                                            </TableCell>
                                            <TableCell padding="checkbox" width="100">
                                                <Button 
                                                    variant="text" 
                                                    color="primary" 
                                                    // disabled={reward.status !== 'requested'}
                                                    onClick={e => this.handleConfirmAll ()}
                                                >
                                                    <Typography color="primary" noWrap >
                                                        อนุมัติทั้งหมด
                                                    </Typography>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            sorteds
                                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((reward, i) =>
                                            {
                                                return (
                                                    <TableRow key={reward.id}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox 
                                                                name={reward.id}
                                                                checked={!!selects[reward.id]}
                                                                onChange={e => 
                                                                {
                                                                    this.setState({ selects: { ...selects, [reward.id]: e.target.checked } })
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell padding="checkbox">
                                                            <AvatarShadow>
                                                                <Avatar src={reward.image} />
                                                            </AvatarShadow>
                                                        </TableCell>
                                                        <TableCell padding="default" style={{ minWidth: 200 }} >
                                                            {reward.name}
                                                            <Description>
                                                            {reward.price === 'none' ? reward.description : `ราคา ${reward.price} ดาว`}
                                                            </Description>
                                                        </TableCell>
                                                        <TableCell padding="default" style={{ minWidth: 200 }} >
                                                            {
                                                                !!students[reward.student] && 
                                                                <StudentLink 
                                                                    to={`/students/${reward.student}?tab=2`} 
                                                                >
                                                                    {students[reward.student].name}
                                                                </StudentLink>
                                                            }
                                                            {
                                                                !!students[reward.student] && !!students[reward.student].customId &&
                                                                <Fragment>
                                                                    <br />
                                                                    <small style={{ opacity: 0.7 }} >รหัส: {students[reward.student].customId}</small>
                                                                </Fragment>
                                                            }
                                                        </TableCell>
                                                        {/* <TableCell padding="default">
                                                            {
                                                                reward.createdAt ? 
                                                                <React.Fragment>
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateTime.formatDate(reward.createdAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateTime.formatTime(reward.createdAt)}
                                                                        </Typography>
                                                                    </Typography>
                                                                </React.Fragment> 
                                                                : 
                                                                '-'
                                                            }
                                                        </TableCell> */}
                                                        <TableCell padding="default">
                                                            {
                                                                reward.requestedAt ? 
                                                                <React.Fragment>
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateTime.formatDate(reward.requestedAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateTime.formatTime(reward.requestedAt)}
                                                                        </Typography>
                                                                    </Typography>
                                                                </React.Fragment> 
                                                                :
                                                                '-'
                                                            }
                                                        </TableCell>
                                                        {/* <TableCell padding="default">
                                                            {
                                                                reward.usedAt ? 
                                                                <React.Fragment>
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateTime.formatDate(reward.usedAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateTime.formatTime(reward.usedAt)}
                                                                        </Typography>
                                                                    </Typography>
                                                                </React.Fragment> 
                                                                :
                                                                '-'
                                                            }
                                                        </TableCell> */}
                                                        <TableCell padding="checkbox" style={{ minWidth: 100 }} >
                                                            {reward.status === 'active' && 'พร้อมใช้งาน'}
                                                            {reward.status === 'purchased' && 'พร้อมใช้งาน'}
                                                            {reward.status === 'requested' && 'รออนุมติ'}
                                                            {reward.status === 'used' && 'ใช้งานแล้ว'}
                                                        </TableCell>
                                                        <TableCell padding="checkbox">
                                                            <Button 
                                                                variant="text" 
                                                                color="primary" 
                                                                disabled={reward.status !== 'requested'}
                                                                onClick={e => this.handleConfirm(reward.student, reward.id)}
                                                            >
                                                                อนุมัติ
                                                            </Button>
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
                                                            value={rewardName}
                                                            onChange={e => this.setState({ rewardName: e.target.value, studentName: 'none', selects: [] })}
                                                        >
                                                            <MenuItem value="none">ทุกรางวัล</MenuItem>
                                                            {
                                                                _rewards
                                                                .map((reward, i) =>
                                                                {
                                                                    return (
                                                                        <MenuItem key={'reward-' + i} value={reward}>{reward}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </div>
                                                    <div className="select">
                                                        <Select
                                                            value={rewardStatus}
                                                            onChange={e => this.setState({ rewardStatus: e.target.value, selects: [] })}
                                                        >
                                                            <MenuItem value="none">ทุกสถานะ</MenuItem>
                                                            <MenuItem value="active">พร้อมใช้งาน</MenuItem>
                                                            <MenuItem value="requested">รออนุมติ</MenuItem>
                                                            <MenuItem value="used">ใช้งานแล้ว</MenuItem>
                                                        </Select>
                                                    </div>
                                                    <div className="select">
                                                        <Select
                                                            value={studentName}
                                                            onChange={e => this.setState({ studentName: e.target.value, selects: [] })}
                                                        >
                                                            <MenuItem value="none">ทุกคน</MenuItem>
                                                            {
                                                                _students
                                                                .map((student, i) =>
                                                                {
                                                                    return (
                                                                        <MenuItem key={'student-' + i} value={student}>{student}</MenuItem>
                                                                    )
                                                                })
                                                            }
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
                        {/* <Paper elevation={0} style={{ borderTop: '1px solid #ddd' }} >
                            <HorizontalScrollView>
                                <Table className="custom-table" >
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                colSpan={4}
                                                count={items.length}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={[  ]}
                                                // rowsPerPageOptions={[ 5, 10, 25, 50 ]}
                                                page={page}
                                                backIconButtonProps={{
                                                    'aria-label': 'Previous Page',
                                                }}
                                                nextIconButtonProps={{
                                                    'aria-label': 'Next Page',
                                                }}
                                                onChangePage={this.handleChangePage}
                                                // onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </HorizontalScrollView>
                        </Paper> */}
                    </React.Fragment>
                }

                
                <Dialog
                    open={deletesDialog > 0}
                    // onClose={e => this.setState({ deletesDialog: 0 })} 
                    aria-labelledby="form-dialog-title"
                    fullWidth
                >
                    <DialogTitle id="form-dialog-title">ต้องการลบรางวัลที่เลือก ?</DialogTitle>
                    {
                        deletesDialog === 2 ? 
                        <DialogActions>
                            <Button color="secondary" disabled>
                            กำลังลบ . . .
                            </Button>
                        </DialogActions>
                        :
                        <DialogActions>
                            <Button onClick={e => this.setState({ deletesDialog: 0 })} color="default">
                            ยกเลิก
                            </Button>
                            <Button onClick={this.handleDeletes} color="secondary">
                            ลบ
                            </Button>
                        </DialogActions>
                    }
                </Dialog>

                <Dialog
                    open={approvesDialog > 0}
                    // onClose={e => this.setState({ approvesDialog: 0 })} 
                    aria-labelledby="form-dialog-title"
                    fullWidth
                >
                    <DialogTitle id="form-dialog-title">ต้องการอนุมัติรางวัลที่เลือก ?</DialogTitle>
                    {
                        approvesDialog === 2 ? 
                        <DialogActions>
                            <Button color="primary" disabled>
                            กำลังอนุมัติ . . .
                            </Button>
                        </DialogActions>
                        :
                        <DialogActions>
                            <Button onClick={e => this.setState({ approvesDialog: 0 })} color="default">
                            ยกเลิก
                            </Button>
                            <Button onClick={this.handleApproves} color="primary">
                            อนุมัติ
                            </Button>
                        </DialogActions>
                    }
                </Dialog>

                <Dialog open={saving} >
                    <DialogContent>
                        <span>กำลังดำเนินการ . . .</span>
                        <div style={{ height: 16 }} />
                        <LinearProgress variant="indeterminate" color="primary" style={{ width: 180 }} />
                    </DialogContent>
                </Dialog>
            </Parent>
        )
    }
}

const ScrollView = styled.div`
    overflow: auto;

    ${props => props.fitParent && `
        height: 100%;
    `}

    /* ${props =>props.withFab && `
        padding-bottom: 88px;
    `} */
    
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

const AvatarShadow = styled.div`
    filter: drop-shadow(0 0 1px rgba(0,0,0, 0.5));
`

const Description = styled.p`
    margin: 2px 0 0 0;
    padding: 0;

    opacity: 0.75;
`

const StudentLink = styled(Link)`
    background-color: transparent;
    border: none;

    outline: none;
    text-decoration: underline;

    color: cornflowerblue;
    cursor: pointer;

    padding: 5px 0 0 0;
    transition: filter 0.15s;

    &:hover
    {
        filter: brightness(0.8);
    }
`

export default Page