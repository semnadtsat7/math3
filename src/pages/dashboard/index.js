import React from 'react';
import styled from 'styled-components';
import Firebase from '../../utils/Firebase';
import GetMaps from '../../services/getMaps.V1'
import GetSheets from '../../services/getQuizzes.V1'
import { Link } from 'react-router-dom'
import TextField from '../../components/TextField';
import {
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    withMobileDialog,
    Modal
} from '@material-ui/core'
import {
    Button
} from 'antd'
// import { green } from '@material-ui/core/colors';
// import Avatar from '@material-ui/core/Avatar';
import Parent from '../../components/Parent';
import ActionBar from '../../components/ActionBar';
import MenuButton from '../../components/MenuButton';
import Flexbox from '../../components/Flexbox';
import Progress from '../../components/Progress';
import TableColumnName from '../../components/Table.Column.Name'

class Page extends React.Component
{
    constructor (props)
    {
        super (props);
        
        this.state = 
        {
            fetching: true,
            maps: [],
            mapIndex: 0,
            sheets: [],
            page: 0,
            rowsPerPage: 50,
            // Time Editor
            item: null,
            modal: false,
            saving: false,
            // Images
            imageModal: null,
            createDialog: 0,
            quizName: '',
            order: null,
            questions: null,
            indicator: null, 
            purpose: null, 
            scale: null,
            level: 'none',
            levelType: 'none',
            subLessons: [],
            subLesson: 'none',
        }

        this.unsubscribes = [];
        this.fetch = this.fetch.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleTimeCancel = this.handleTimeCancel.bind(this);
        this.handleImageModalOpen = this.handleImageModalOpen.bind(this);
        this.handleImageModalCancel = this.handleImageModalCancel.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    componentDidMount()
    {
        const { history } = this.props;
        const auth = Firebase.auth();
        this.unsubscribes[0] = auth.onAuthStateChanged(user =>
        {
            if(user)
            {
                this.fetch();
            }
            else
            {
                history.replace(`/sign-in?redirect=${encodeURIComponent(history.location.pathname + history.location.search)}`);
            }
        });
    }

    componentWillUnmount()
    {
        this.unsubscribes.filter(fn => !!fn).forEach(fn => fn());
    }

    async fetch()
    {
        this.setState({ 
            fetching: true, 
            maps: [],
            mapIndex: 0,
            sheets: [],
        });
        
        const maps = await GetMaps.get()
        const sheets = await GetSheets.get(maps[0], true, false, true)
        const subLessons = []
        sheets.forEach (e => 
        {
            if (subLessons.indexOf (e.subLesson) < 0)
            {
                subLessons.push (e.subLesson)
            }
        })
    
        this.setState({
            fetching: false,
            maps,
            sheets,
            subLessons,
            subLesson: 'none',
        })
    }

    async handleFilter (value)
    {
        const newMapIndex = parseInt(value, 10);
        const curMapIndex = this.state.mapIndex
        if (newMapIndex !== curMapIndex)
        {
            this.setState({ 
                fetching: true,
                mapIndex: newMapIndex,
            })

            const sheets = await GetSheets.get(this.state.maps[newMapIndex], true, false, true)
            const subLessons = []
            sheets.forEach (e => 
            {
                if (subLessons.indexOf (e.subLesson) < 0)
                {
                    subLessons.push (e.subLesson)
                }
            })
            this.setState({
                fetching: false,
                sheets,
                subLessons,
                subLesson: 'none',
            })
        }
    }

    handleChangePage (event, page)
    {
        this.setState({ page });
    }
    
    handleChangeRowsPerPage (event)
    {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleTimeCancel()
    {
        this.setState({
            item: null,
            modal: false,
        })
    }

    handleImageModalOpen (images)
    {
        this.setState({ imageModal: images })
    }

    handleImageModalCancel()
    {
        this.setState({ imageModal: null })
    }

    toggle = (item) =>
    {
        if (!!item)
        {
            const { questions, indicator, purpose, scale, order } = item
            this.setState({ questions, indicator, purpose, scale, order })
        }
        else
        {
            this.setState({ questions: null, indicator: null, purpose: null, scale: null })
        }
    }

    editQuiz = (item) =>
    {
        if (!!item)
        {

        }
        else
        {

        }
    }

    handleCancel()
    {
        this.setState({ 
            createDialog: 0,
            quizName: '',
        })
    }

    async handleCreate()
    {
        const { quizName } = this.props
        const owner = Firebase.auth ().currentUser.uid

        const cfs = Firebase.firestore()
        cfs.collection(`quizzes`).add({
            "quizName": quizName,
            "description": '',
            "map": 0,
            "active": false,
            "created_by": owner,
            "order": 0,
            "lesson": []
        }).then((res)=>{
            console.log('handleCreate - then', res)
        }).catch((catchRes) => {
            console.log('handleCreate - catch', catchRes)
        })
    }

    render()
    {
        const { 
            fetching, 
            createDialog, 
            maps,
            sheets,
            quizName,
        } = this.state;

        const empty = sheets.length === 0

        return (
            <Parent ref="parent" >
                <ActionBar>
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }} >
                        บทเรียนทั้งหมด
                    </Typography>
                    <Button 
                        type="primary"
                        onClick={e => this.setState({ createDialog: 1 })}
                    >
                        เพิ่มบทเรียน
                    </Button>
                </ActionBar>
                {
                    fetching ? <Progress /> :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีบทเรียน</p></Flexbox> :
                    <React.Fragment>
                        {/* <Avatar style={{ backgroundColor: green[400] }}>+</Avatar> */}
                        <ScrollView fitParent={!empty} >
                            <Paper elevation={0}>
                                <Table className="custom-table">
                                    <TableHead>
                                        <TableRow selected={true} >
                                            <TableCell align="right" padding="checkbox" width="80" >
                                                <TableColumnName
                                                    label="ชุดที่"
                                                />
                                            </TableCell>
                                            <TableCell padding="default">
                                                <TableColumnName
                                                    label="บทเรียน"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100" >
                                                <TableColumnName
                                                    label="แผนที่"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100" ></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            maps
                                            .map((item, i) =>
                                            {
                                                let number = i+1

                                                return (
                                                    <TableRow key={`${i}-${item.id}`} >
                                                        <TableCell align="right" padding="checkbox">{number}</TableCell>
                                                        <TableCell padding="default">
                                                            <Typography noWrap >
                                                                {item.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" padding="checkbox">
                                                            <Typography noWrap>
                                                                {/* <ColumnLevelType levelType={item.type} /> */}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" padding="checkbox">
                                                            <Clickable to={`/quiz-lesson/${item.id}`}>
                                                                แก้ไข
                                                            </Clickable>
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
                    </React.Fragment>
                }
                <ModalRoot
                    open={createDialog > 0}
                >
                    <ModalPanel>
                        <DialogTitle>สร้างบทเรียน</DialogTitle>
                        <DialogContent>
                            {
                                createDialog === 1 ? 
                                <React.Fragment>
                                    <TextField
                                        margin="normal"
                                        label="ชื่อบทเรียน"
                                        type="text"
                                        fullWidth
                                        inputProps={{ id: "dialog-reward-title" }}
                                        value={quizName}
                                        onChange={e => this.setState({ quizName: e.target.value })}
                                    />
                                </React.Fragment>
                                :
                                <Progress />
                            }
                        </DialogContent>
                        {
                            createDialog === 1 ?
                            <DialogActions>
                                <Button onClick={this.handleCancel} >ปิด</Button>
                                <Button color="primary" onClick={this.handleCreate} disabled={quizName === ''} >บันทึก</Button>
                            </DialogActions>
                            :
                            null
                        }
                    </ModalPanel>
                </ModalRoot>
            </Parent>
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

Page = withMobileDialog()(Page)

export default Page;