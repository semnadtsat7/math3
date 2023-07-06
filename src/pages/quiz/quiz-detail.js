import React from 'react';
import styled from 'styled-components';
import Firebase from '../../utils/Firebase';
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
    constructor(props)
    {
        super(props);
        
        this.state = 
        {
            fetching: true,
            maps: [],
            sheets: [],
            page: 0,
            rowsPerPage: 50,
            
            // Time Editor
            item: null,
            saving: false,

            // Images
            imageModal: null,

            createDialog: 0,
            questionName: '',
            order: null,
            questions: null,
            indicator: null, 
            purpose: null, 
            scale: null,
            level: 'none',
            levelType: 'none',
            subLessons: [],
            subLesson: 'none',
            action: null,
            lessonName: '',
            lessonDesc: '',
            lessonIndicator: '',
            lessonPurpose: '',
            subLessonTitle: '',
            lessonScale: '',
            lessonType: '',
            lessonLimit: ''
        }

        this.unsubscribes = [];
        this.fetch = this.fetch.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleLevel = this.handleLevel.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleTimeCancel = this.handleTimeCancel.bind(this);
        this.handleImageModalOpen = this.handleImageModalOpen.bind(this);
        this.handleImageModalCancel = this.handleImageModalCancel.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
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
                this.getLessonDetail();
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

    async getLessonDetail() {
        const { 
            match
        } = this.props

        const queryRef = Firebase
            .firestore()
            .collection(`quizzes`)
            .doc(match.params.quizId)
            .collection(`lesson`)
            .doc(match.params.lessonId)

        const snapshot = await queryRef.get()

        if (snapshot.get('isActive'))
        {
            this.setState({
                lessonName: snapshot.get('title'),
                lessonDesc: snapshot.get('description'),
                lessonLimit: snapshot.get('limit'),
                lessonIndicator: snapshot.get('indicator'),
                lessonPurpose: snapshot.get('purpose'),
                subLessonTitle: snapshot.get('subLesson'),
                lessonScale: snapshot.get('scale'),
                lessonType: snapshot.get('type'),
                lessonLevel: snapshot.get('level'),
            });
        }
        else
        {
            this.props.history.push('/quiz-lesson/' + match.params.quizId)
        }
    }

    async fetch()
    {
        const { match } = this.props

        this.setState({ 
            fetching: true, 
            maps: [],
            sheets: [],
        });

        const cfs = Firebase.firestore()
        const ref = cfs.collection(`quizzes`)
            .doc(match.params.quizId)
            .collection(`lesson`)
            .doc(match.params.lessonId)
            .collection(`choices`)
            .where('isActive', '==', true)

        return ref.onSnapshot (
            snapshot =>
            {
                const items = snapshot.docs.map(doc => 
                {
                    const id = doc.id
                    const { title } = doc.data()
                    
                    return { id, title }
                })

                this.setState({
                    fetching: false,
                    maps: items
                });
            }
        )
    }

    async handleLevel(value)
    {
        console.log('value: ', value)
        this.setState({
            lessonLevel: value
        });
    }

    async handleType(value)
    {
        console.log('value: ', value)
        this.setState({
            lessonType: value
        });
    }

    handleChangePage(event, page)
    {
        this.setState({ page });
    }
    
    handleChangeRowsPerPage(event)
    {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleTimeCancel()
    {
        this.setState({
            item: null,
        })
    }

    handleImageModalOpen(images)
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
            questionName: '',
        })
    }

    async handleCreate()
    {
        const { questionName } = this.state
        const { match } = this.props
        
        try
        {
            const res = await Firebase.functions().httpsCallable('quizzes-question-create')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "title": questionName
            });
            
            message.success ('เพิ่มข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quiz-question/' + match.params.quizId + '/' + match.params.lessonId + '/' + res.data)
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
            await Firebase.functions().httpsCallable('quizzes-lesson-delete')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId
            });
            
            message.success ('ลบข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quiz-lesson/' + match.params.quizId)
        }
        catch (err)
        {
            console.log (err)
            message.error ('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    async handleSubmit()
    {
        const { 
            lessonName, 
            lessonDesc, 
            lessonIndicator,
            lessonPurpose,
            subLessonTitle,
            lessonScale,
            lessonType,
            lessonLimit,
            lessonLevel
        } = this.state
        const { match } = this.props

        try
        {
            await Firebase.functions().httpsCallable('quizzes-lesson-update')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "title": lessonName, 
                "description": lessonDesc, 
                "indicator": lessonIndicator,
                "purpose": lessonPurpose,
                "subLesson": subLessonTitle,
                "scale": lessonScale,
                "type": lessonType,
                "limit": lessonLimit,
                "level": lessonLevel,
                "order": 0
            });
            
            message.success ('แก้ไขข้อมูลเรียบร้อยแล้ว', 3);
        }
        catch (err)
        {
            console.log (err)
            message.error ('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    handleBack()
    {
        const { match } = this.props
        this.props.history.push('/quiz-lesson/' + match.params.quizId)
    }

    render()
    {
        const { 
            fetching, 
            createDialog,
            maps, 
            order,
            questions, 
            indicator, 
            purpose, 
            scale,
            level,
            levelType,
            subLesson,
            questionName,
            saving,
            lessonName,
            lessonDesc,
            lessonLimit,
            lessonIndicator,
            lessonPurpose,
            subLessonTitle,
            lessonScale,
            action,
            lessonType,
            lessonLevel
        } = this.state;
        const { match } = this.props

        let items = maps
        if (level !== 'none')
        {
            items = items.filter(e => e.level === level)
        }

        if (levelType !== 'none')
        {
            if (levelType === 'boss')
            {
                items = items.filter(e => e.type === 'boss')
            }
            else
            {
                items = items.filter(e => e.type !== 'boss')
            }
        }

        if (subLesson !== 'none')
        {
            items = items.filter(e => e.subLesson === subLesson)
        }

        const empty = maps.length === 0

        return (
            <Parent ref="parent">
                <ActionBar>
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}>
                        โจทย์ในบทเรียนทั้งหมด
                    </Typography>
                    <Button
                        type="primary"
                        onClick={e => this.setState({ createDialog: 1 })}
                    >
                        เพิ่มคำถาม
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
                                label="ชื่อบทเรียนย่อย"
                            >
                                <Input 
                                    type="text"
                                    placeholder="Quiz title name"
                                    maxLength={50}
                                    value={lessonName}
                                    onChange={e => this.setState({ lessonName: e.target.value })}
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
                                    value={lessonDesc}
                                    onChange={e => this.setState({ lessonDesc: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="จำนวนโจทย์ในด่านนี้"
                            >
                                <Input 
                                    type="number"
                                    placeholder="จำนวนโจทย์ในด่านนี้"
                                    value={lessonLimit}
                                    onChange={e => this.setState({ lessonLimit: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="มาตรฐาน"
                            >
                                <Input 
                                    type="text"
                                    placeholder="มาตรฐาน"
                                    value={lessonScale}
                                    onChange={e => this.setState({ lessonScale: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="ตัวชี้วัด"
                            >
                                <Input 
                                    type="text"
                                    placeholder="ตัวชี้วัด"
                                    value={lessonIndicator}
                                    onChange={e => this.setState({ lessonIndicator: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="จุดประสงค์การเรียนรู้"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="จุดประสงค์การเรียนรู้"
                                    value={lessonPurpose}
                                    onChange={e => this.setState({ lessonPurpose: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="ชื่อบทเรียนย่อย"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="ชื่อบทเรียนย่อย"
                                    value={subLessonTitle}
                                    onChange={e => this.setState({ subLessonTitle: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="ระดับความยาก"
                            >
                                <Dropdown 
                                    label="ระดับความยาก"
                                    value={lessonLevel}
                                    onChange={this.handleLevel}
                                    items={
                                        [
                                            {
                                                label: 'ง่าย',
                                                value: 'easy',
                                            },
                                            {
                                                label: 'ปานกลาง',
                                                value: 'normal',
                                            },
                                            {
                                                label: 'ยาก',
                                                value: 'hard',
                                            },
                                            {
                                                label: 'บอส',
                                                value: 'boss',
                                            },
                                        ]
                                    }
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="รูปแบบการตอบ"
                            >
                                <Dropdown 
                                    label="รูปแบบการตอบ"
                                    value={lessonType}
                                    onChange={this.handleType}
                                    items={
                                        [
                                            {
                                                label: 'ลากวาง',
                                                value: 'drag-drop',
                                            },
                                            {
                                                label: 'จับคู่',
                                                value: 'pair',
                                            },
                                            {
                                                label: 'ตัวยึด',
                                                value: 'placeholder',
                                            },
                                            {
                                                label: 'เรียงลำดับ',
                                                value: 'drag-sort',
                                            },
                                            {
                                                label: 'เลือกตัวเลข',
                                                value: 'number-picker',
                                            },
                                        ]
                                    }
                                />
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
                                    onClick={this.handleSubmit}
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
                                        ModalConfirm.confirm(
                                            {
                                                title: 'ต้องการลบบทเรียนย่อยนี้',
                                                content: `เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก`,
                                                zIndex: 10000,
                                                keyboard: false,
                                                cancelText: 'ยกเลิก',
                                                okText: 'ลบ',
                                                okType: 'danger',
                                                onOk:() => 
                                                {
                                                    this.handleDelete().catch(console.log)
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
                                                    label="โจทก์"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            items
                                            .map((item, i) =>
                                            {
                                                // let number = item.order
                                                return (
                                                    <TableRow key={`${i}-${item.id}`}>
                                                        <TableCell align="right" padding="checkbox">{i + 1}</TableCell>
                                                        <TableCell padding="default">
                                                            <Typography noWrap>
                                                                {item.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" padding="checkbox">
                                                            <Clickable to={`/quiz-question/${match.params.quizId}/${match.params.lessonId}/${item.id}`}>
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
                        </React.Fragment>
                    }
                </ScrollView>
                <Drawer
                    variant="temporary"
                    open={!!questions && questions.length > 0}
                    anchor="right"
                    onClose={() => this.toggle(null)}
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
                            <IconButton onClick={() => this.toggle(null)} >
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
                                questions.map((question, i) =>
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
                                                            ].indexOf(type) >= 0 &&
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
                <ModalRoot
                    open={createDialog > 0}
                >
                    <ModalPanel>
                        <DialogTitle>สร้างคำถาม</DialogTitle>
                        <DialogContent>
                            {
                                createDialog === 1 ? 
                                <React.Fragment>
                                    <TextField
                                        margin="normal"
                                        label="คำถาม"
                                        type="text"
                                        fullWidth
                                        inputProps={{ id: "dialog-reward-title" }}
                                        value={questionName}
                                        onChange={e => this.setState({ questionName: e.target.value })}
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
                                <Button color="primary" onClick={this.handleCreate} disabled={questionName === ''} >บันทึก</Button>
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

const ModalImage = styled.img`
    border: 1px solid #a7a7a7;
    margin: 2px 0;
    width: 100%;
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