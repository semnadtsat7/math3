import React from 'react';

import styled from 'styled-components';

import Firebase from '../utils/Firebase';
// import FirebaseCloud from '../utils/FirebaseCloud'

import GetMaps from '../services/getMaps.V1'
import GetSheets from '../services/getQuizzes.V1'

import ColumnLevel from '../components/Column.Level'
import ColumnLevelType from '../components/Column.LevelType'

import Dropdown from '../components/Table/Filter/Dropdown';

import { 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    // FormControl,
    // Input, 
    // InputAdornment, 
    Typography,
    Paper,

    // Modal,
    Button,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    // TablePagination,

    // Select,
    // MenuItem,
    Divider,
    Dialog,
    withMobileDialog,
    Drawer,
    ListItem,
    ListItemText,
    IconButton,
    List,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core'

import {
    Close as CloseIcon,
} from '@material-ui/icons'

import Parent from '../components/Parent';
import ActionBar from '../components/ActionBar';
import MenuButton from '../components/MenuButton';
import Flexbox from '../components/Flexbox';
import Progress from '../components/Progress';

import TEXAnswer from '../components/TEXAnswer'
import TEXDraw from '../components/TEXDraw'

import TableColumnName from '../components/Table.Column.Name'

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

        this.fetch = this.fetch.bind(this)
        this.handleFilter = this.handleFilter.bind(this)

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        
        this.handleTimeOpen = this.handleTimeOpen.bind(this)
        this.handleTimeCancel = this.handleTimeCancel.bind(this)
        this.handleTimeSave = this.handleTimeSave.bind(this)
        
        this.handleImageModalOpen = this.handleImageModalOpen.bind(this)
        this.handleImageModalCancel = this.handleImageModalCancel.bind(this)
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

            maps: [],
            mapIndex: 0,

            sheets: [],
        });
        
        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const maps = await GetMaps.get({ teacher })
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
        // const newMapIndex = e.target.value;
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

    handleTimeOpen (index)
    {
        // download sheet from teacher id
        // const item = this.state.sheets[index]
        // const sheetId = this.state.sheets[index].id
        // const teacherId = Firebase.auth().currentUser.uid;

        // const mapId = this.state.maps[this.state.mapIndex].entryId

        // this.setState({ modal: 'กำลังโหลดข้อมูล . . .' })

        // Firebase
        // .firestore()
        // .doc(`teachers/${teacherId}/maps/${mapId}/sheets/${sheetId}`)
        // .get()
        // .then(doc =>
        // {
        //     let data = {}

        //     if (doc.exists)
        //     {
        //         data = {
        //             id: doc.id,
        //             ...doc.data(),
        //         }
        //     }
        //     else
        //     {
        //         data = 
        //         {
        //             id: doc.id,
        //             timePerQuestion: item.duration,
        //         }
        //     }

        //     if (!data.timePerQuestion)
        //     {
        //         data.timePerQuestion = 30
        //     }

        //     this.setState({ item: data, })
        // })
    }

    handleTimeCancel ()
    {
        this.setState({
            item: null,
            modal: false,
        })
    }

    handleTimeSave ()
    {
        this.setState({ saving: true })

        // const item = this.state.item
        // const teacherId = Firebase.auth().currentUser.uid
        
        // const mapId = this.state.maps[this.state.mapIndex].id
        // const sheetId = item.id

        // const timePerQuestion = Number(item.timePerQuestion || 30)
        // this.setState({ modal: 'กำลังบันทึกข้อมูล . . .', item: null })

        // FirebaseCloud
        // .post('/updateSheetTimePerQuestion', { teacherId, mapId, sheetId, timePerQuestion })
        // .then(() =>
        // {
        //     this.setState({ modal: false, saving: false })
        // })
        // .catch(err =>
        // {
        //     this.setState({ modal: false, saving: false })
        // })

        // Firebase
        // .firestore()
        // .doc(`teachers/${teacherId}/maps/${mapId}/sheets/${item.id}`)
        // .set({ timePerQuestion }, { merge: true })
        // .then(() =>
        // {
        //     this.setState({ modal: false, saving: false })
        // })
        // .catch(err =>
        // {
        //     this.setState({ modal: false, saving: false })
        // })
    }

    handleImageModalOpen (images)
    {
        this.setState({ imageModal: images })
    }

    handleImageModalCancel ()
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

    render ()
    {
        const { 
            fetching, 
            maps, 
            mapIndex, 
            sheets, 
            // page,
            // rowsPerPage, 

            order,
            questions, 
            indicator, 
            purpose, 
            scale,

            level,
            levelType,

            subLessons,
            subLesson,
        } = this.state;

        let items = sheets

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

        if (subLesson !== 'none')
        {
            items = items.filter (e => e.subLesson === subLesson)
        }

        const empty = sheets.length === 0

        return (
            <Parent ref="parent" >
                <ActionBar >
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ paddingBottom: 2, lineHeight: 2 }} >
                        ข้อสอบทั้งหมด
                    </Typography>
                </ActionBar>
                {
                    fetching ? <Progress /> :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อสอบ</p></Flexbox> :
                    <React.Fragment>
                        {/* <TableToolbar>
                            <div className="select">
                                <Select
                                    value={mapIndex}
                                    onChange={this.handleFilter}
                                    inputProps={{
                                        name: 'mapIndex',
                                        id: 'mapIndex',
                                    }}
                                >
                                    {
                                        maps
                                        .map((map, i) =>
                                        {
                                            return (
                                                <MenuItem key={'dropdown-'+map.id} value={i}>{map.title}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="flex" />
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
                        </TableToolbar> */}
                        <ScrollView fitParent={!empty} >
                            <Paper elevation={0}>
                                <Table className="custom-table" >
                                    <TableHead>
                                        <TableRow selected={true} >
                                            {/* <TableCell align="right" padding="checkbox" width="60" >ตอนที่</TableCell> */}
                                            <TableCell align="right" padding="checkbox" width="80" >
                                                <TableColumnName
                                                    label="ชุดที่"
                                                />
                                            </TableCell>
                                            <TableCell padding="default">
                                                <TableColumnName
                                                    label="บทเรียนย่อย"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100" >
                                                <TableColumnName
                                                    label="ประเภท"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100" >
                                                <TableColumnName
                                                    label="ระดับ"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100" ></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            items
                                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item, i) =>
                                            {
                                                // const boss = [ 'pre', 'post', 'fight' ].indexOf (item.id) >= 0
                                                let number = item.order

                                                if (item.id === 'pre')
                                                {
                                                    number = `ก่อนเรียน`
                                                }

                                                if (item.id === 'post')
                                                {
                                                    number = `หลังเรียน`
                                                }

                                                if (item.id === 'fight')
                                                {
                                                    number = `วัดระดับ`
                                                }

                                                return (
                                                    <TableRow key={`${i}-${item.id}`} >
                                                        {/* <TableCell align="right" padding="checkbox">{item.section}</TableCell> */}
                                                        <TableCell align="right" padding="checkbox">{number}</TableCell>
                                                        <TableCell padding="default">
                                                            <Typography noWrap >
                                                                {item.subLesson}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" padding="checkbox">
                                                            <Typography noWrap>
                                                                <ColumnLevelType levelType={item.type} />
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" padding="checkbox">
                                                            <Typography noWrap>
                                                                <ColumnLevel level={item.level} />
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" padding="checkbox">
                                                            {/* <TimeButton onClick={() => this.handleTimeOpen(i)} >
                                                                จัดการเวลา
                                                            </TimeButton> */}
                                                            {/* <ImageButton onClick={() => this.handleImageModalOpen(item.images)} >
                                                                ดูตัวอย่าง
                                                            </ImageButton> */}
                                                            <Toggler onClick={() => this.toggle(item)} >
                                                                ดูคำถาม
                                                            </Toggler>
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
                                <Table
                                    className="custom-table"
                                    style={{
                                        backgroundColor: `#f5f5f5`,
                                    }}
                                >
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell>
                                                <TableToolbar style={{ color: '#333' }} >
                                                    <Dropdown 
                                                        label="บทเรียน"
                                                        value={mapIndex.toString(10)}
                                                        onChange={this.handleFilter}
                                                        items={maps.map((map, i) => {
                                                            return {
                                                                label: map.title,
                                                                value: i.toString(10),
                                                            }
                                                        })}
                                                    />
                                                    <Dropdown 
                                                        label="บทเรียนย่อย"
                                                        value={subLesson}
                                                        onChange={value => this.setState({ subLesson: value })}
                                                        items={[
                                                            {
                                                                label: 'ทุกบทเรียนย่อย',
                                                                value: 'none',
                                                            },
                                                            ...subLessons.map((e) => {
                                                                return {
                                                                    label: e,
                                                                    value: e,
                                                                }
                                                            }),
                                                        ]}
                                                    />
                                                    {/* <div className="select">
                                                        <Select
                                                            value={mapIndex}
                                                            onChange={this.handleFilter}
                                                            inputProps={{
                                                                name: 'mapIndex',
                                                                id: 'mapIndex',
                                                            }}
                                                        >
                                                            {
                                                                maps
                                                                .map((map, i) =>
                                                                {
                                                                    return (
                                                                        <MenuItem key={'dropdown-'+map.id} value={i}>{map.title}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </div> */}
                                                    {/* <div className="select">
                                                        <Select
                                                            value={subLesson}
                                                            onChange={e => this.setState({ subLesson: e.target.value })}
                                                        >
                                                            <MenuItem value="none">ทุกบทเรียนย่อย</MenuItem>
                                                            {
                                                                subLessons
                                                                .map((e, i) =>
                                                                {
                                                                    return (
                                                                        <MenuItem key={'subLesson-'+i} value={e}>{e}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </div> */}
                                                    {/* <div className="flex" /> */}
                                                    <Dropdown 
                                                        label="ประเภท"
                                                        value={levelType}
                                                        onChange={value => this.setState({ levelType: value })}
                                                        items={[
                                                            {
                                                                label: 'ทุกประเภท',
                                                                value: 'none',
                                                            },
                                                            {
                                                                label: 'ทั่วไป',
                                                                value: 'normal',
                                                            },
                                                            {
                                                                label: 'บอส',
                                                                value: 'boss',
                                                            },
                                                        ]}
                                                    />
                                                    <Dropdown 
                                                        label="ระดับ"
                                                        value={level}
                                                        onChange={value => this.setState({ level: value })}
                                                        items={[
                                                            {
                                                                label: 'ทุกระดับ',
                                                                value: 'none',
                                                            },
                                                            {
                                                                label: 'สอนใช้งาน',
                                                                value: 'tutorial',
                                                            },
                                                            {
                                                                label: 'ระดับง่าย',
                                                                value: 'easy',
                                                            },
                                                            {
                                                                label: 'ระดับปานกลาง',
                                                                value: 'normal',
                                                            },
                                                            {
                                                                label: 'ระดับยาก',
                                                                value: 'hard',
                                                            },
                                                        ]}
                                                    />
                                                    <div className="flex" />

                                                    {/* <div className="select">
                                                        <Select
                                                            value={levelType}
                                                            onChange={e => this.setState({ levelType: e.target.value })}
                                                        >
                                                            <MenuItem value="none">ทุกประเภท</MenuItem>
                                                            <MenuItem value="normal">ทั่วไป</MenuItem>
                                                            <MenuItem value="boss">บอส</MenuItem>
                                                        </Select>
                                                    </div> */}
                                                    {/* <div className="select">
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
                                                    </div> */}
                                                </TableToolbar>
                                            </TableCell>
                                            {/* <TableCell style={{ paddingRight: 0 }} >
                                                <Select
                                                    value={mapIndex}
                                                    onChange={this.handleFilter}
                                                    inputProps={{
                                                        name: 'mapIndex',
                                                        id: 'mapIndex',
                                                    }}

                                                    style={{ marginRight: 24, marginBottom: 4, marginTop: 4 }}
                                                >
                                                    {
                                                        maps
                                                        .map((map, i) =>
                                                        {
                                                            return (
                                                                <MenuItem key={'dropdown-'+map.id} value={i}>{map.title}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </TableCell> */}
                                            {/* <TablePagination
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
                                            /> */}
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </HorizontalScrollView>
                        </Paper>
                        <Dialog
                            open={!!this.state.imageModal}
                            onClose={this.handleImageModalCancel}
                            fullScreen={this.props.fullScreen}
                            scroll="paper"
                            aria-labelledby="dialog-sheet-images"
                        >
                            <DialogTitle id="dialog-sheet-images">ตัวอย่างข้อสอบ</DialogTitle>
                            <Divider />
                            <DialogContent>
                                <div style={{ height: 24 }} />
                                {
                                    !this.state.imageModal ? null :
                                    this.state.imageModal
                                    .map((image, i) =>
                                    {
                                        return (
                                            <ModalImage
                                                key={image}
                                                src={image} 
                                            />
                                        )
                                    })
                                }
                            </DialogContent>
                            <Divider />
                            <DialogActions>
                                <Button onClick={this.handleImageModalCancel} >ปิด</Button>
                            </DialogActions>
                        </Dialog>
                        {/* <ModalRoot
                            open={!!this.state.modal}
                            onClose={this.handleTimeCancel}
                        >
                            <ModalPanel>
                                {
                                    !!this.state.item ?
                                    <React.Fragment>
                                        <DialogTitle>เวลาที่สามารถทำได้ในแต่ละข้อ</DialogTitle>
                                        <DialogContent>
                                            <FormControl fullWidth >
                                                <Input 
                                                    name="timePerQuestion"
                                                    type="number" 
                                                    placeholder="วินาที"
                                                    // defaultValue={30}
                                                    value={this.state.item.timePerQuestion || 30}
                                                    onChange={e => 
                                                    {
                                                        const item = this.state.item
                                                        item.timePerQuestion = e.target.value

                                                        this.setState({ item })
                                                    }}
                                                    endAdornment={<InputAdornment position="end">วินาที</InputAdornment>}
                                                />
                                            </FormControl>
                                        </DialogContent>
                                    </React.Fragment>
                                    :
                                    <DialogContent>
                                        {this.state.modal}
                                    </DialogContent>
                                }
                                {
                                    saving ? null :
                                    <ModalFooter>
                                        <DialogActions>
                                            <Button onClick={this.handleTimeCancel} >ปิด</Button>
                                            <Button color="primary" onClick={this.handleTimeSave} >บันทึก</Button>
                                        </DialogActions>
                                    </ModalFooter>
                                }
                            </ModalPanel>
                        </ModalRoot> */}
                    </React.Fragment>
                }
                
                <Drawer
                    variant="temporary"
                    open={!!questions && questions.length > 0}
                    anchor="right"
                    onClose={() => this.toggle (null)}
                    ModalProps={{ keepMounted: true }}
                >
                    <SideSheet>
                        <ListItem 
                            component="div" 
                            disableGutters={true}
                            style={{ paddingLeft: 24, paddingRight: 8 }}
                        >
                            <ListItemText 
                                primaryTypographyProps={{ variant: "h6", noWrap: true }}
                                primary={`คำถามชุดที่ ${order}`}
                            />
                            <IconButton onClick={() => this.toggle (null)} >
                                <CloseIcon />
                            </IconButton>
                        </ListItem>
                        
                        <List>
                            <HeadingData>
                            {
                                !!purpose && 
                                <React.Fragment>
                                    <Typography 
                                        gutterBottom={true}
                                    >
                                        <b>จุดประสงค์การเรียนรู้</b>
                                    </Typography>
                                    <Typography 
                                        gutterBottom={true}
                                    >
                                        {purpose}
                                    </Typography>
                                </React.Fragment>
                            }
                            </HeadingData>
                            <HeadingData>
                            {
                                !!indicator && 
                                <React.Fragment>
                                    <Typography 
                                        gutterBottom={true}
                                    >
                                        <b>ตัวชี้วัด</b>
                                    </Typography>
                                    <Typography 
                                        gutterBottom={true}
                                    >
                                        {indicator}
                                    </Typography>
                                </React.Fragment>
                            }
                            </HeadingData>
                            <HeadingData>
                            {
                                !!scale && 
                                <React.Fragment>
                                    <Typography 
                                        gutterBottom={true}
                                    >
                                        <b>มาตราฐาน</b>
                                    </Typography>
                                    <Typography 
                                        gutterBottom={true}
                                    >
                                        {scale}
                                    </Typography>
                                </React.Fragment>
                            }
                            </HeadingData>
                            <Divider />
                            {
                                !!questions &&
                                questions.map ((question, i) =>
                                {
                                    if (question.sys)
                                    {
                                        return null
                                    }

                                    const { 
                                        type,
                                        title, 
                                        description, 
                                        image, 
                                        answer,
                                        choices,
                                    } = question

                                    // let answerText = ''

                                    // if (typeof answer === 'string')
                                    // {
                                    //     answerText = answer
                                    // }
                                    // else
                                    // {
                                    //     answerText = answer.join("|")
                                    // }

                                    // let answerTexts = []
                                    // let answerImages = []

                                    // if (typeof answer === 'string')
                                    // {
                                    //     const answers = answer.split('|').map(e => e.trim())

                                    //     answerTexts = answers.filter(e => !e.startsWith (`http`)).join(', ')
                                    //     answerImages = answers.filter(e => e.startsWith (`http`))
                                    // }
                                    // else
                                    // {
                                    //     answerTexts = answer.filter(e => !e.startsWith (`http`)).join(', ')
                                    //     answerImages = answer.filter(e => e.startsWith (`http`))
                                    // }

                                    const {
                                        cellPerRow,
                                        cellType,
                                        // cellImageType,

                                        hintText,
                                        hintImage,
                                    } = question

                                    return (
                                        <React.Fragment key={`sheet-question-${i}`} >
                                            <ExpansionPanel elevation={0} defaultExpanded={true} >
                                                <ExpansionPanelSummary>
                                                    <PrimaryText>
                                                        <Typography>
                                                            ข้อที่ {i + 1}
                                                        </Typography>
                                                    </PrimaryText>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                    <ExpansionData>
                                                        {
                                                            !!title && 
                                                            <Typography 
                                                                gutterBottom={true}
                                                            >
                                                                <b>
                                                                    <TEXDraw text={title} />    
                                                                </b>
                                                            </Typography>
                                                        }
                                                        {
                                                            !!description && 
                                                            <Typography 
                                                                gutterBottom={true}
                                                            >
                                                                <TEXDraw text={description} />
                                                            </Typography>
                                                        }
                                                        {!!image && <img src={image} alt="quiz-description" />}
                                                        
                                                        <Typography gutterBottom={false} ><b>คำตอบ</b></Typography>
                                                        {/* {
                                                            answerImages.map ((image, j) =>
                                                                {
                                                                    return (
                                                                        <img 
                                                                            key={`sheet-question-${i}-image-${j}`}
                                                                            src={image} 
                                                                        />
                                                                    )
                                                                })
                                                        } */}
                                                        
                                                        <Typography 
                                                            gutterBottom={true}
                                                            component="div"
                                                        >
                                                            <TEXAnswer type={type} text={answer || choices} />
                                                            {/* <TEXDraw text={answerText} pipe={true} /> */}
                                                        </Typography>

                                                        {
                                                            [
                                                                'drag-drop',
                                                                'placeholder'
                                                            ].indexOf (type) >= 0 &&
                                                            <React.Fragment>
                                                                <Typography gutterBottom={false} ><b>ตัวเลือก</b></Typography>
                                                                <Typography 
                                                                    gutterBottom={true}
                                                                    component="div"
                                                                >
                                                                    <TEXAnswer 
                                                                        type={type} 
                                                                        text={choices} 
                                                                        isChoice={true} 
                                                                        cellType={cellType}
                                                                        cellPerRow={cellPerRow}
                                                                        // cellImageType={cellImageType}
                                                                    />
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                        
                                                        <Typography style={{ marginTop: 16 }} gutterBottom={false} ><b>Hint</b></Typography>
                                                        <Typography gutterBottom={true} >{hintText || '-'}</Typography>
                                                        {!!hintImage && <img src={hintImage} style={{ margin: `8px 0` }} alt="quiz-hint" />}
                                                    </ExpansionData>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                            <Divider />
                                        </React.Fragment>
                                    )
                                })
                            }
                        </List>
                    </SideSheet>
                </Drawer>
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

const HeadingData = styled.div`
    width: 100%;
    padding: 0 24px 16px 24px;
`

// const TimeButton = styled.button`
//     background: transparent;
//     text-decoration: underline;

//     outline: none;
//     border: none;

//     cursor: pointer;
//     color: blue;

//     margin-right: 16px;

//     &:hover
//     {
//         color: red;
//     }

//     &:active
//     {
//         color: navy;
//     }
// `

// const ImageButton = styled.button`
//     background: transparent;
//     text-decoration: underline;

//     outline: none;
//     border: none;

//     cursor: pointer;
//     color: blue;

//     margin: 0;

//     &:hover
//     {
//         color: red;
//     }

//     &:active
//     {
//         color: navy;
//     }
// `

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

// const ModalContent = styled.div`
//     flex-grow: 1;
//     overflow-y: auto;

//     box-sizing: border-box;
// `

// const ModalFooter = styled.div`

//     /* border-top: 1px solid #ccc; */
//     /* padding: 8px; */

//     display: flex;
//     flex-direction: row;
//     justify-content: flex-end;
// `

const ModalImage = styled.img`
    border: 1px solid #a7a7a7;
    margin: 2px 0;
    width: 100%;
`


const Toggler = styled.button`
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

const SideSheet = styled.div`
    min-width: 90vw;
    max-width: 90vw;

    @media (min-width: 600px)
    {
        min-width: 576px;
        max-width: 576px;
    }
`

const PrimaryText = styled.div`
    flex-grow: 1;
    display: flex;
`

const ExpansionData = styled.div`
    width: 100%;
    text-align: left;

    img
    {
        display: flex;

        max-width: 100%;
        margin: 24px 0;
    }
`

Page = withMobileDialog()(Page)

export default Page;