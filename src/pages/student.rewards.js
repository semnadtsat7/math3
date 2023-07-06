import React, { useContext } from 'react';

import AppContext from '../AppContext'
import styled from 'styled-components';

import Firebase from '../utils/Firebase';
import DateTime from '../utils/DateTime'

import { 
    Avatar,

    Paper,
    Checkbox,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    // TableFooter,
    // TablePagination,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    ListItem,
    ListItemText,
    MenuItem,
    DialogActions,
    Button,
    Typography,
    // TableSortLabel,

    LinearProgress,

} from '@material-ui/core'

import {
    Add as AddIcon,
} from '@material-ui/icons'

import Flexbox from '../components/Flexbox';
import Progress from '../components/Progress';
// import SmallProgress from '../components/SmallProgress';

import TableColumnName from '../components/Table.Column.Name'
import ActionBar from './../components/ActionBar';

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
            fetching: true,
            fetchingTemplates: true,

            savings: {},
            selects: {},

            templates: [],
            rewards: [],
            
            page: 0,
            rowsPerPage: 50,
            
            order: 'asc',
            orderBy: 'createdAt',

            createDialog: 0,
            
            dialogTemplateIndex: -1,

            deleteDialog: 0,
            deleteRewardId: '',

            approvesDialog: 0,
            deletesDialog: 0,

            saving: false,
        }

        this.unsubscribes = [];
        
        this.fetch = this.fetch.bind(this)

        this.handleChange = this.handleChange.bind(this);

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        
        this.handleCreate = this.handleCreate.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSelect = this.handleSelect.bind(this)

        this.handleDelete = this.handleDelete.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)

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
            fetchingTemplates: true,

            rewards: [],
            templates: [],

            selects: {},
        });
        
        // const teacherId = Firebase.auth().currentUser.uid;

        const teacherId = this.props.space;
        const studentId = this.props.match.params.studentId || 'null'

        const { order, orderBy } = this.state

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacherId)
            .collection('rewards')
            .where('isActive', '==', true)
            .onSnapshot(snapshot =>
            {
                const templates = [];

                snapshot.forEach(doc => 
                {
                    if(doc.exists)
                    {
                        const reward = 
                        {
                            id: doc.id,
                            ...doc.data(),
                        };

                        templates.push(reward);
                    }
                });

                this.setState({ 
                    fetchingTemplates: false,
                    templates: templates,
                });
            })
        )

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacherId)
            .collection('students')
            .doc(studentId)
            .collection('rewards')
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

                        rewards.push(reward);
                    }
                });

                let removes = Object.keys (excludes).filter (id => !!excludes[id])
                let selects = {}

                removes.forEach (id =>
                {
                    selects[id] = this.state.selects[id]
                })

                this.setState({ 
                    fetching: false,
                    rewards: sort(rewards, order, orderBy),
                    selects,
                });
            })
        )

        // this.unsubscribes.push(
        //     Firebase
        //     .firestore()
        //     .collection('teachers')
        //     .doc(teacherId)
        //     .collection('students')
        //     .doc(studentId)
        //     .collection('rewards')
        //     .onSnapshot(snapshot =>
        //     {
        //         const changes = snapshot.docChanges()

        //         if (changes.length > 0)
        //         {
        //             const actives = this.state.actives

        //             changes.forEach(change =>
        //             {
        //                 if (change.type === 'added')
        //                 {
        //                     actives[change.doc.id] = true
        //                 }  
        //                 else if (change.type === 'removed')
        //                 {
        //                     delete actives[change.doc.id]
        //                 }
        //             })

        //             this.setState({ 
        //                 fetchingActiveList: false,
        //                 actives,
        //             })
        //         }
        //         else
        //         {
        //             const actives = {};

        //             snapshot.forEach(doc => 
        //             {
        //                 actives[doc.id] = true
        //             })

        //             this.setState({ 
        //                 fetchingActiveList: false,
        //                 actives,
        //             })
        //         }
        //     })
        // )
    }

    async handleChange (rewardIndex, checked)
    {
        // const { rowsPerPage, page } = this.state

        // const studentId = this.props.match.params.studentId || 'null';
        // const reward = this.state.rewards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[rewardIndex]
        
        // const savings = this.state.savings
        // const actives = this.state.actives

        // savings[reward.id] = true
        // actives[reward.id] = checked

        // this.setState({ savings, actives })

        // const data = { reward: reward.id, student: studentId }

        // if (checked)
        // {
        //     await Firebase.functions().httpsCallable('teacherAddStudentToReward')(data)
        // }
        // else
        // {
        //     await Firebase.functions().httpsCallable('teacherRemoveStudentFromReward')(data)
        // }

        // savings[reward.id] = false
        // this.setState({ savings })
    }

    handleChangePage (event, page)
    {
        this.setState({ page });
    }
    
    handleChangeRowsPerPage (event)
    {
        this.setState({ rowsPerPage: event.target.value });
    }
        
    async handleCreate ()
    {
        const { templates, dialogTemplateIndex } = this.state

        if (dialogTemplateIndex >= 0)
        {
            this.setState({ createDialog: 2 });

            const student = this.props.match.params.studentId || 'null'
            const reward = templates[dialogTemplateIndex].id

            // const space = window.localStorage.getItem ('space')
            const teacher = this.props.space// space || Firebase.auth().currentUser.uid;

            // const name = template.name;
            // const image = template.image;
            // const description = template.description
            // const price = template.price

            await Firebase.functions().httpsCallable('teacher-student-reward-add')({ teacher, student, reward })

            this.setState({ createDialog: 0 });
        }
    }
    
    async handleDelete ()
    {
        const { deleteRewardId } = this.state

        if (!!deleteRewardId)
        {
            this.setState({ deleteDialog: 2 })

            const student = this.props.match.params.studentId || 'null'
            const reward = deleteRewardId

            // const space = window.localStorage.getItem ('space')
            const teacher = this.props.space// space || Firebase.auth().currentUser.uid;

            await Firebase.functions().httpsCallable('teacher-student-reward-remove')({ teacher, student, reward })

            this.setState({ deleteDialog: 0, deleteRewardId: '' })
        }
    }

    handleCancel ()
    {
        this.setState({ 
            createDialog: 0,
            dialogTemplateIndex: -1,
        })
    }
    
    handleSelect (e)
    {
        this.setState({ dialogTemplateIndex: e.target.value })
    }

    async handleConfirm (reward)
    {
        if (!!reward)
        {
            const student = this.props.match.params.studentId || 'null'
            const rewards = this.state.rewards.map (r =>
                {
                    const status = r.id === reward ? 'used' : r.status
                    const usedAt = r.id === reward ? Timestamp.now () : null

                    return { ...r, status, usedAt }
                })

            this.setState({ rewards })

            // const space = window.localStorage.getItem ('space')
            const teacher = this.props.space// space || Firebase.auth().currentUser.uid;

            await Firebase.functions().httpsCallable('teacher-student-reward-confirm')({ teacher, student, reward })
        }
    }

    async handleConfirmAll ()
    {
        if (!window.confirm ('ต้องการอนุมัติรางวัลทั้งหมด ?'))
        {
            return
        }

        this.setState ({ saving: true })

        const ids = []

        const student = this.props.match.params.studentId || 'null'
        const rewards = this.state.rewards.map (r =>
            {
                if (r.status === 'requested')
                {
                    ids.push (r.id)
                    return { ...r, status: 'used', usedAt: Timestamp.now () }
                }

                return r
            })

        this.setState({ rewards })

        // const space = window.localStorage.getItem ('space')
        const teacher = this.props.space// space || Firebase.auth().currentUser.uid;

        await Firebase.functions().httpsCallable('teacher-student-reward-confirm')({ teacher, student, reward: ids })
        
        this.setState ({ saving: false })
    }

    handleSort (orderBy, order)
    {
        // const rewards = sort (this.state.rewards, order, orderBy)
        this.setState({ order, orderBy })
    }

    handleApproves = async () =>
    {
        this.setState ({ approvesDialog: 2 })

        const selects = this.state.selects
        const ids = []

        const student = this.props.match.params.studentId || 'null'
        const rewards = this.state.rewards.map (r =>
            {
                if (!!selects[r.id] && r.status === 'requested')
                {
                    ids.push (r.id)
                    return { ...r, status: 'used', usedAt: Timestamp.now () }
                }

                return r
            })

        this.setState ({ rewards })

        // const space = window.localStorage.getItem ('space')
        const teacher = this.props.space// space || Firebase.auth().currentUser.uid;
            
        await Firebase.functions().httpsCallable('teacher-student-reward-confirm')({ teacher, student, reward: ids })
        
        this.setState ({ approvesDialog: 0, selects: [] })
    }

    handleDeletes = async () =>
    {
        this.setState ({ deletesDialog: 2 })

        const selects = this.state.selects
        const ids = Object.keys (selects).filter (id => !!selects[id])

        const student = this.props.match.params.studentId || 'null'

        // const space = window.localStorage.getItem ('space')
        const teacher = this.props.space// space || Firebase.auth().currentUser.uid;

        await Firebase.functions().httpsCallable('teacher-student-reward-remove')({ teacher, student, reward: ids })
        
        this.setState ({ deletesDialog: 0, selects: [] })
    }

    render ()
    {
        // const { student } = this.props;
        const { 
            fetching, 
            fetchingTemplates,
            // savings, 
            rewards, 
            templates,

            selects,
            // page, rowsPerPage,

            order,
            orderBy,

            createDialog,
            dialogTemplateIndex,

            deleteDialog, 
            // deleteRewardId,

            approvesDialog,
            deletesDialog,

            saving,
        } = this.state;

        const empty = rewards.length === 0;
        const orderDirection = order === 'asc' ? 'desc' : 'asc'
        const sorteds = sort (rewards, order, orderBy)

        const selectCount = Object.keys (selects).filter (id => !!selects[id]).length
        
        return (
            <React.Fragment >
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
                    fetching || fetchingTemplates ? <Progress /> :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีรางวัล</p></Flexbox> :
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
                                            <TableCell padding="default" width="80" >
                                                <TableColumnName
                                                    name="createdAt"
                                                    label="วันที่ได้รับ"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
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
                                            <TableCell padding="default" width="80" >
                                                <TableColumnName
                                                    name="usedAt"
                                                    label="วันที่อนุมัติ"
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
                                                    onClick={e => this.handleConfirmAll ()}
                                                >
                                                    <Typography color="primary" noWrap >
                                                        อนุมัติทั้งหมด
                                                    </Typography>
                                                </Button>
                                            </TableCell>
                                            {/* <TableCell padding="checkbox" width="100">
                                                    
                                            </TableCell> */}
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
                                                        <TableCell padding="default">
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
                                                        </TableCell>
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
                                                        <TableCell padding="default">
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
                                                        </TableCell>
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
                                                                onClick={e => this.handleConfirm(reward.id)}
                                                            >
                                                                อนุมัติ
                                                            </Button>
                                                            {
                                                                // !!savings[reward.id] ?
                                                                // <SmallProgress />
                                                                // :
                                                                // <Checkbox 
                                                                //     checked={!!actives[reward.id]} 
                                                                //     onChange={e => this.handleChange(i, e.target.checked)}
                                                                // />
                                                            }
                                                        </TableCell>
                                                        {/* <TableCell padding="checkbox">
                                                            <Button 
                                                                variant="text" 
                                                                color="secondary" 
                                                                onClick={e => this.setState({ deleteDialog: 1, deleteRewardId: reward.id })}
                                                            >
                                                                ลบ
                                                            </Button>
                                                        </TableCell> */}
                                                    </TableRow>
                                                )
                                            })
                                            .filter(item => item)
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </ScrollView>
                        {/* <Paper elevation={0} style={{ borderTop: '1px solid #ddd' }} >
                            <HorizontalScrollView>
                                <Table className="custom-table" >
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                colSpan={4}
                                                count={rewards.length}
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
                <ModalRoot
                    open={createDialog > 0}
                    onClose={this.handleCancel} 
                >
                    <ModalPanel>
                        <DialogTitle>เพิ่มรางวัล</DialogTitle>
                        <DialogContent>
                            {
                                createDialog === 1 ? 
                                <FormControl fullWidth >
                                    <InputLabel>รางวัล</InputLabel>
                                    <Select 
                                        autoFocus
                                        name="template"
                                        value={dialogTemplateIndex}
                                        onChange={this.handleSelect}
                                        renderValue={value => {
                                            return value >= 0 ?
                                            <ListItem>
                                                <AvatarShadow>
                                                    <Avatar src={templates[value].image} />
                                                </AvatarShadow>
                                                <ListItemText 
                                                    primary={templates[value].name} 
                                                    secondary={templates[value].price === 'none' ? templates[value].description : `ราคา ${templates[value].price} ดาว`} 
                                                />
                                            </ListItem>
                                            :
                                            'กรุณาเลือกรางวัล'
                                        }}
                                        fullWidth
                                    >
                                        {
                                            templates.map((template, i) =>
                                            {
                                                return (
                                                    <MenuItem
                                                        key={template.id}
                                                        value={i}
                                                    >
                                                        <AvatarShadow>
                                                            <Avatar src={template.image} />
                                                        </AvatarShadow>
                                                        <ListItemText 
                                                            primary={template.name} 
                                                            secondary={template.price === 'none' ? template.description : `ราคา ${template.price} ดาว`} 
                                                        />
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                :
                                <Progress />
                            }
                        </DialogContent>
                        {
                            createDialog === 1 ?
                            <DialogActions>
                                <Button onClick={this.handleCancel} >ปิด</Button>
                                <Button color="primary" onClick={this.handleCreate} disabled={dialogTemplateIndex < 0} >บันทึก</Button>
                            </DialogActions>
                            :
                            null
                        }
                    </ModalPanel>
                </ModalRoot>

                <Dialog
                    open={deleteDialog > 0}
                    onClose={e => this.setState({ deleteDialog: 0 })} 
                    aria-labelledby="form-dialog-title"
                    fullWidth
                >
                    <DialogTitle id="form-dialog-title">ต้องการลบรางวัล ?</DialogTitle>
                    {
                        deleteDialog === 2 ? 
                        <DialogActions>
                            <Button color="secondary" disabled>
                            กำลังลบ . . .
                            </Button>
                        </DialogActions>
                        :
                        <DialogActions>
                            <Button onClick={e => this.setState({ deleteDialog: 0 })} color="default">
                            ยกเลิก
                            </Button>
                            <Button onClick={this.handleDelete} color="secondary">
                            ลบ
                            </Button>
                        </DialogActions>
                    }
                </Dialog>

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

                {
                    // selectCount > 0 &&
                    // <FAB empty={true} >
                    //     <Button 
                    //         variant="extendedFab" 
                    //         color="primary"
                    //         size="small"
                    //         onClick={e => this.setState({ createDialog: 1 })} 
                    //     >
                    //         อนุมัติ
                    //     </Button>
                    //     <div style={{ minWidth: 8 }} />
                    //     <Button 
                    //         variant="extendedFab" 
                    //         color="secondary"
                    //         size="small"
                    //         onClick={e => this.setState({ createDialog: 1 })} 
                    //     >
                    //         ลบ
                    //     </Button>
                    // </FAB>
                }

                {
                    selectCount === 0 &&
                    <FAB empty={true} >
                        <Button 
                            variant="fab" 
                            color="primary"
                            onClick={e => this.setState({ createDialog: 1 })} 
                        >
                            <AddIcon />
                        </Button>
                    </FAB>
                }
                <Dialog open={saving} >
                    <DialogContent>
                        <span>กำลังดำเนินการ . . .</span>
                        <div style={{ height: 16 }} />
                        <LinearProgress variant="indeterminate" color="primary" style={{ width: 180 }} />
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}

const ScrollView = styled.div`
    overflow: auto;

    ${props => props.fitParent && `
        height: 100%;
    `}

    ${props =>props.withFab && `
        padding-bottom: 88px;
    `}
    
    table
    {
        background: white;
    }
`

// const HorizontalScrollView = styled.div`
//     overflow-x: auto;

//     table
//     {
//         overflow-x: auto;
//     }
// `

const AvatarShadow = styled.div`
    filter: drop-shadow(0 0 1px rgba(0,0,0, 0.5));
`

const Description = styled.p`
    margin: 2px 0 0 0;
    padding: 0;

    opacity: 0.75;
`

const ModalRoot = styled(Modal)`
    display: flex;
`

const ModalPanel = styled.div`
    margin: auto;

    display: flex;

    flex-direction: column;
    flex-grow: 1;

    background-color: white;
    border-radius: 8px;

    height: fit-content;

    max-height: calc(100% - 48px);
    max-width: calc(100% - 48px);

    box-shadow: 0 3px 6px rgba(0,0,0,0.2),   0 3px 6px rgba(0,0,0,0.3);

    @media (min-width: 528px)
    {
        max-width: 480px;
    }
`

const FAB = styled.div`
    position: absolute;

    right: 16px;
    bottom: 72px;

    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;

    align-items: flex-end;

    ${props => props.empty && `
        bottom: 16px;
    `}
`

function WrapperPage (props)
{
    const { space } = useContext (AppContext)

    return (
        <Page space={space} {...props} />
    )
}

export default WrapperPage;