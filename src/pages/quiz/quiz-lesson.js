import React from 'react';
import styled from 'styled-components';
import Firebase from '../../utils/Firebase';
import GetSheets from '../../services/getQuizzes.V1'
import ColumnLevel from '../../components/Column.Level'
import ColumnLevelType from '../../components/Column.LevelType'
import Dropdown from '../../components/Table/Filter/Dropdown';
import TextField from '../../components/TextField';
import { Link } from 'react-router-dom';
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
    TableFooter,
    Divider,
    withMobileDialog,
    Drawer,
    ListItem,
    ListItemText,
    IconButton,
    List,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Modal as ModalWithInput
} from '@material-ui/core'
import {
    Button,
    Form,
    Input,
    message,
    Modal as ModalConfirm
} from 'antd'
import {
    Close as CloseIcon,
} from '@material-ui/icons'

import Parent from '../../components/Parent';
import ActionBar from '../../components/ActionBar';
import MenuButton from '../../components/MenuButton';
import Flexbox from '../../components/Flexbox';
import Progress from '../../components/Progress';
import TEXAnswer from '../../components/TEXAnswer'
import TEXDraw from '../../components/TEXDraw'
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
            item: null,
            saving: false,
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
            quizId: '',
            quizDesc: '',
            action: null,
            subQuizName: '',
            mapList: [
                {
                    id: 1,
                    active: true
                },
                {
                    id: 2,
                    active: false
                },
                {
                    id: 3,
                    active: false
                },
                {
                    id: 4,
                    active: false
                },
                {
                    id: 5,
                    active: false
                }
            ]
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
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    handleMapClick(_id) {
        const newDupMaps = this.state.mapList.map(ele => {
            if (ele.id === _id) {
                ele.active = true;
            } else {
                ele.active = false;
            }

            return ele;
        });

        this.setState({
            mapList: newDupMaps,
            mapIndex: _id
        })
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
                this.getQuizDetail();
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

    async getQuizDetail()
    {
        const { 
            match
        } = this.props
        
        const queryRef = Firebase
            .firestore()
            .collection(`quizzes`)
            .doc(match.params.quizId)

        const snapshot = await queryRef.get()
        
        if (snapshot.get('isActive'))
        {
            this.handleMapClick(snapshot.get('map'))
            this.setState({
                quizName: snapshot.get('quizName'),
                quizDesc: snapshot.get('description')
            });
        }
        else
        {
            this.props.history.push('/quizzes')
        }
    }

    async fetch()
    {
        const { match } = this.props
        this.setState({
            fetching: true, 
            maps: [],
            mapIndex: 0,
            sheets: [],
        });
        
        const cfs = Firebase.firestore()
        const ref = cfs.collection(`quizzes`)
            .doc(match.params.quizId)
            .collection(`lesson`)
            .where('isActive', '==', true)

        return ref.onSnapshot (
            snapshot =>
            {
                const items = snapshot.docs.map(doc => 
                {
                    const id = doc.id
                    const { title, level, order, type } = doc.data()
                    
                    return { id, title, level, order, type }
                })

                this.setState({
                    fetching: false,
                    maps: items
                });
            }
        )
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

    handleCancel()
    {
        this.setState({ 
            createDialog: 0,
            subQuizName: '',
        })
    }

    handleBack()
    {
        this.props.history.push('/quizzes')
    }

    async handleCreate()
    {
        const { subQuizName } = this.state
        const { match } = this.props
        
        try
        {
            const res = await Firebase.functions().httpsCallable('quizzes-lesson-create')({
                "id": match.params.quizId,
                "lessonName": subQuizName
            });

            message.success ('บันทึกข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quiz-lesson-detail/' + match.params.quizId + '/' + res.data);
        }
        catch (err)
        {
            console.log (err)
            message.error ('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    async handleDelete()
    {
        const { match } = this.props
        
        try
        {
            await Firebase.functions().httpsCallable('quizzes-quiz-delete')({
                "quizId": match.params.quizId
            });

            message.success('ลบข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quizzes');
        }
        catch (err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    async handleUpdate()
    {
        const { quizName, quizDesc, mapIndex } = this.state
        const { match } = this.props
        const owner = Firebase.auth().currentUser.uid
        
        try
        {
            await Firebase.functions().httpsCallable('quizzes-quiz-update')({
                "id": match.params.quizId,
                "quizName": quizName,
                "description": quizDesc,
                "map": mapIndex,
                "isActive": false,
                "createdBy": owner,
            });

            message.success('แก้ไขข้อมูลเรียบร้อยแล้ว', 3);
        }
        catch (err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    render()
    {
        const { 
            fetching, 
            createDialog, 
            maps, 
            mapIndex,
            order,
            questions, 
            indicator, 
            purpose, 
            scale,
            level,
            levelType,
            subLessons,
            subLesson,
            quizName,
            saving,
            mapList,
            action,
            quizDesc,
            subQuizName
        } = this.state;
        const { match } = this.props

        let items = maps
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

        const empty = maps.length === 0

        return (
            <Parent ref="parent">
                <ActionBar>
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}>
                        บทเรียนย่อยทั้งหมด
                    </Typography>
                    <Button
                        type="primary"
                        onClick={e => this.setState({ createDialog: 1 })}
                    >
                        เพิ่มบทเรียนย่อย
                    </Button>
                </ActionBar>
                <ScrollView>
                    <Card>
                    {
                        !!saving ?
                        <Progress />
                        :
                        <Form layout="vertical">
                            <Form.Item 
                                colon={false} 
                                label="ชื่อบทเรียน"
                            >
                                <Input 
                                    type="text"
                                    placeholder="Quiz title name"
                                    maxLength={50}
                                    value={quizName}
                                    onChange={e => this.setState({ quizName: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="คำอธิบาย"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="คำอธิบาย"
                                    value={quizDesc}
                                    onChange={e => this.setState({ quizDesc: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="แผนที่"
                            >
                                <View>
                                    {
                                        mapList.map((itm, i) => 
                                        {
                                            return (
                                                <ViewChild 
                                                    key={itm.id}
                                                    className={itm.active ? 'quiz-map quiz-map-active' : 'quiz-map'}
                                                    onClick={() => this.handleMapClick(itm.id)}
                                                >
                                                    <CardMedia
                                                        src={`/images/map-${i + 1}.jpg`}
                                                        title="Contemplative Reptile"
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom component="h5">
                                                            แผนที่ {i + 1}
                                                        </Typography>
                                                    </CardContent>
                                                </ViewChild>
                                            )
                                        })
                                    }
                                </View>
                            </Form.Item>
                            <ActionGroup>
                                <Button
                                    type="ghost"
                                    style={{ width: `100%` }}
                                    onClick={this.handleBack}
                                    className="ant-btn ant-btn-primary"
                                >
                                    กลับ
                                </Button>
                                <div style={{ minWidth: 12, maxWidth: 12 }} />
                                <Button
                                    type="primary"
                                    style={{ width: `100%` }}
                                    onClick={this.handleUpdate}
                                    className="ant-btn ant-btn-primary"
                                >
                                    แก้ไข
                                </Button>
                                <div style={{ minWidth: 12, maxWidth: 12 }} />
                                <Button
                                    type="danger"
                                    ghost={true}
                                    disabled={!!action}
                                    loading={action === 'deleting'}
                                    style={{ minWidth: 72, maxWidth: 72 }}
                                    onClick={() => 
                                    {
                                        ModalConfirm.confirm (
                                            {
                                                title: 'ต้องการลบบทเรียนนี้',
                                                content: `เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก`,
                                                zIndex: 10000,
                                                keyboard: false,
                                                cancelText: 'ยกเลิก',
                                                okText: 'ลบ',
                                                okType: 'danger',
                                                onOk:() => 
                                                {
                                                    this.handleDelete().catch (console.log)
                                                },
                                            }
                                        )
                                    }}
                                >
                                    ลบ
                                </Button>
                            </ActionGroup>
                        </Form>
                    }
                    </Card>
                    {
                        fetching ? <Progress /> :
                        empty ? <Flexbox><p style={{ opacity: 0.5 }}>ไม่มีบทเรียนย่อย</p></Flexbox> :
                        <React.Fragment>
                            <Paper elevation={0}>
                                <Table className="custom-table">
                                    <TableHead>
                                        <TableRow selected={true}>
                                            <TableCell align="right" padding="checkbox" width="80">
                                                <TableColumnName
                                                    label="ชุดที่"
                                                />
                                            </TableCell>
                                            <TableCell padding="default">
                                                <TableColumnName
                                                    label="บทเรียนย่อย"
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
                                            {/* <TableCell align="right" padding="checkbox" width="100"></TableCell> */}
                                            <TableCell align="right" padding="checkbox" width="100"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            items
                                            .map((item, i) =>
                                            {
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
                                                    <TableRow key={`${i}-${item.id}`}>
                                                        <TableCell align="right" padding="checkbox">{number}</TableCell>
                                                        <TableCell padding="default">
                                                            <Typography noWrap>
                                                                {item.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" padding="checkbox">
                                                            <Typography noWrap>
                                                            {
                                                                !!item.type ?
                                                                    <ColumnLevelType levelType={item.type} />
                                                                :
                                                                    '-'
                                                            }
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" padding="checkbox">
                                                            <Typography noWrap>
                                                            {
                                                                !!item.level ?
                                                                    <ColumnLevel level={item.level} />
                                                                :
                                                                    '-'
                                                            }
                                                            </Typography>
                                                        </TableCell>
                                                        {/* <TableCell align="center" padding="checkbox">
                                                            <Toggler onClick={() => this.toggle(item)}>
                                                                ดูคำถาม
                                                            </Toggler>
                                                        </TableCell> */}
                                                        <TableCell align="center" padding="checkbox">
                                                            <Clickable to={`/quiz-lesson-detail/${match.params.quizId}/${item.id}`}>
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
                            <Paper elevation={0} style={{ borderTop: '1px solid #ddd' }}>
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
                                                    <TableToolbar style={{ color: '#333' }}>
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
                                                    </TableToolbar>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </HorizontalScrollView>
                            </Paper>
                        </React.Fragment>
                    }
                </ScrollView>
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
                            <IconButton onClick={() => this.toggle (null)}>
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

                                    const {
                                        cellPerRow,
                                        cellType,
                                        hintText,
                                        hintImage,
                                    } = question

                                    return (
                                        <React.Fragment key={`sheet-question-${i}`}>
                                            <ExpansionPanel elevation={0} defaultExpanded={true}>
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
                                                        
                                                        <Typography gutterBottom={false}><b>คำตอบ</b></Typography>
                                                        <Typography 
                                                            gutterBottom={true}
                                                            component="div"
                                                        >
                                                            <TEXAnswer type={type} text={answer || choices} />
                                                        </Typography>
                                                        {
                                                            [
                                                                'drag-drop',
                                                                'placeholder'
                                                            ].indexOf (type) >= 0 &&
                                                            <React.Fragment>
                                                                <Typography gutterBottom={false}><b>ตัวเลือก</b></Typography>
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
                                                                    />
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                        
                                                        <Typography style={{ marginTop: 16 }} gutterBottom={false}><b>Hint</b></Typography>
                                                        <Typography gutterBottom={true}>{hintText || '-'}</Typography>
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
                <ModalRoot
                    open={createDialog > 0}
                >
                    <ModalPanel>
                        <DialogTitle>สร้างบทเรียนย่อย</DialogTitle>
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
                                        value={subQuizName}
                                        onChange={e => this.setState({ subQuizName: e.target.value })}
                                    />
                                </React.Fragment>
                                :
                                <Progress />
                            }
                        </DialogContent>
                        {
                            createDialog === 1 ?
                            <DialogActions>
                                <Button onClick={this.handleCancel}>ปิด</Button>
                                <Button color="primary" onClick={this.handleCreate} disabled={subQuizName === ''}>บันทึก</Button>
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

const Card = styled.div`
    margin: 16px;
`

const ActionGroup = styled.div`
    width: 100%;
    max-width: 240px;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    margin-left: auto;
    margin-right: 0;
`

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

const ModalRoot = styled(ModalWithInput)`
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

const HeadingData = styled.div`
    width: 100%;
    padding: 0 24px 16px 24px;
`

// const Toggler = styled.button`
//     background-color: transparent;
//     border: none;
//     outline: none;
//     text-decoration: underline;
//     color: cornflowerblue;
//     cursor: pointer;
//     padding: 5px 0 0 0;
//     transition: filter 0.15s;
//     &:hover
//     {
//         filter: brightness(0.8);
//     }
// `

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

const View = styled.div`
    width: 100%;
    flexDirection: row; 
    flexWrap: wrap;
    display: flex;
    justify-content: center;
`

const ViewChild = styled.div`
    width: 18%; 
    margin: 1%;
    padding: 5px;
`

const CardMedia = styled.img`
    width: 100%;
`

const CardContent = styled.div`
    margin-top: 8px;
    width: 100%;
    text-align: center;
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