import React from 'react';
import ChipInput from "material-ui-chip-input";
import styled from 'styled-components';
import Firebase from '../../utils/Firebase';
import TextField from '../../components/TextField';
import { green, grey } from '@material-ui/core/colors';
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
    withMobileDialog,
    Modal as ModalWithInput,
} from '@material-ui/core'
import {
    Button,
    Form,
    Checkbox,
    message,
    Modal as ModalConfirm
} from 'antd'

import Parent from '../../components/Parent';
import ActionBar from '../../components/ActionBar';
import MenuButton from '../../components/MenuButton';
import Flexbox from '../../components/Flexbox';
import Progress from '../../components/Progress';
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
            tags: [],
            page: 0,
            rowsPerPage: 50,
            
            // Time Editor
            item: null,
            saving: false,

            // Images
            image: null,
            imageReview: null,
            defImageReview: null,
            imageHint: null,
            imageHintReview: null,
            defImageHintReview: null,

            action: null,
            createDialog: 0,
            subLesson: 'none',
            descriptionText: '',
            questionDesc: '',
            questionTitle: '',
            random: false,
            order: 0,
            answerName: '',
            answerLimit: 0,
            hint: '',
            why: '',
            answer: ''
        }

        this.unsubscribes = [];
        this.fetch = this.fetch.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleRandom = this.toggleRandom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.resetImage = React.createRef();
        this.resetImageHint = React.createRef();
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
                this.getQuestionDetail();
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

    async getQuestionDetail() {
        const { 
            match
        } = this.props

        const queryRef = Firebase
            .firestore()
            .collection(`quizzes`)
            .doc(match.params.quizId)
            .collection(`lesson`)
            .doc(match.params.lessonId)
            .collection(`choices`)
            .doc(match.params.questionId)

        const snapshot = await queryRef.get()

        if(snapshot.get('isActive'))
        {
            const _desc = snapshot.get('description')
            const _img = snapshot.get('image')
            const _imgHint = snapshot.get('hintImage')
            let { _imgUrl, _imgHintUrl } = '';

            if (_desc)
            {
                this.splitTextToChipInput(_desc)
            }

            if (_img)
            {
                _imgUrl = await this.getFullImageUrl(_img)
            }

            if (_imgHint)
            {
                _imgHintUrl = await this.getFullImageUrl(_imgHint)
            }
            
            this.setState({
                questionTitle: snapshot.get('title'),
                answerLimit: snapshot.get('limit'),
                hint: snapshot.get('hint'),
                why: snapshot.get('why'),
                answer: snapshot.get('answer'),
                random: 'Random' === snapshot.get('order') ? true : false,
                imageReview: _imgUrl,
                imageHintReview: _imgHintUrl,
                defImageReview: _imgUrl ? _img : '',
                defImageHintReview: _imgHintUrl ? _imgHint : '',
            });
        }
        else
        {
            this.props.history.push('/quiz-lesson-detail/' + match.params.quizId + '/' + match.params.lessonId)
        }
    }

    async getFullImageUrl(_img)
    {
        const storage = Firebase.storage();

        return new Promise(function(resolve, reject)
        {
            storage.ref('quizzes')
                .child(_img)
                .getDownloadURL()
                .then(fireBaseUrl => {
                    resolve(fireBaseUrl)
                }).catch(error => {
                    resolve('')
                })
        })
    }

    async splitTextToChipInput(_text) {
        const _arr = _text.split('`|`');
        this.updateDescriptionDemo(_arr);
        this.setState({
            tags: _arr
        });
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
            .doc(match.params.questionId)
            .collection(`answer`)
            .where('isActive', '==', true)

        return ref.onSnapshot(
            snapshot =>
            {
                const items = snapshot.docs.map(doc => 
                {
                    const id = doc.id
                    const { answer } = doc.data()
                    
                    return { id, answer }
                })

                this.setState({
                    fetching: false,
                    maps: items
                });
            }
        )
    }

    updateDescriptionDemo(_arr)
    {
        const _questionDesc = _arr.join('').split('\\n').join('\n');
        this.setState({
            questionDesc: _questionDesc
        });
    }

    // Add Chips
    handleAddChip =(_txt) => {
        const _tags = [...this.state.tags, _txt];
        this.updateDescriptionDemo(_tags);
        this.setState({
            tags: _tags,
            descriptionText: ''
        });
    }

    // Delete Chips
    handleDeleteChip =(chip, index) => {
        const dupArr = [...this.state.tags];
        dupArr.splice(index, 1);
        this.updateDescriptionDemo(dupArr);
        this.setState({
            tags: dupArr
        });
    }

    handleCancel()
    {
        this.setState({ 
            createDialog: 0,
            answerName: '',
        })
    }

    async handleCreate()
    {
        const { answerName } = this.state
        const { match } = this.props
        
        try
        {
            const res = await Firebase.functions().httpsCallable('quizzes-choice-create')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "questionId": match.params.questionId,
                "answer": answerName
            });
            
            message.success('เพิ่มข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quiz-choice/' + match.params.quizId + '/' + match.params.lessonId + '/' + match.params.questionId + '/' + res.data)
        }
        catch(err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    async handleDelete()
    {
        const { match } = this.props

        try
        {
            await Firebase.functions().httpsCallable('quizzes-question-delete')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "questionId": match.params.questionId
            });
            
            message.success('ลบข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quiz-lesson-detail/' + match.params.quizId + '/' + match.params.lessonId)
        }
        catch(err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    async toggleRandom()
    {
        const {
            random
        } = this.state;

        this.setState({
            random: !random
        });
    }

    async uploadQuestionImage()
    {
        const { image } = this.state
        const { match } = this.props

        return new Promise(function(resolve, reject) {
            try
            {
                const storage = Firebase.storage();
                const nameArr = image.name.split('.');
                const id_rand = match.params.questionId + '.' + nameArr[nameArr.length - 1];

                const uploadTask = storage.ref(`/quizzes/${id_rand}`).put(image)
                uploadTask.on('state_changed', (snapShot) => {
                    console.log(snapShot)
                }, (err) => {
                    console.log(err)
                    resolve('');
                }, () => {
                    resolve(id_rand);
                    // storage.ref('quizzes').child(id_rand).getDownloadURL()
                    // .then(fireBaseUrl => {
                    //     console.log('fireBaseUrl', fireBaseUrl);
                    //     resolve(fireBaseUrl);
                    // });
                });
            }
            catch(err)
            {
                console.log(err)
                message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3);
                resolve('');
            }
        });
    }

    async uploadHintImage()
    {
        const { imageHint } = this.state
        const { match } = this.props

        return new Promise(function(resolve, reject) {
            try
            {
                const storage = Firebase.storage();
                const nameArr = imageHint.name.split('.');
                const id_rand = 'hint_' + match.params.questionId + '.' + nameArr[nameArr.length - 1];

                const uploadTask = storage.ref(`/quizzes/${id_rand}`).put(imageHint)
                uploadTask.on('state_changed', (snapShot) => {
                    console.log(snapShot)
                }, (err) => {
                    console.log(err)
                    resolve('');
                }, () => {
                    resolve(id_rand);
                    // storage.ref('quizzes').child(id_rand).getDownloadURL()
                    // .then(fireBaseUrl => {
                    //     console.log('fireBaseUrl', fireBaseUrl);
                    //     resolve(fireBaseUrl);
                    // });
                });
            }
            catch(err)
            {
                console.log(err)
                message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3);
                resolve('');
            }
        });
    }

    async handleSubmit()
    {
        const {
            questionTitle,
            answerLimit,
            tags,
            random,
            answer,
            why,
            hint,
            image,
            imageHint,
            defImageReview,
            defImageHintReview
        } = this.state
        const { match } = this.props

        try
        {
            let {imgUrl, imgHintUrl} = '';

            if (image)
            {
                if ("image/jpeg"==image.type || "image/png"==image.type)
                {
                    imgUrl = await this.uploadQuestionImage();
                }
            }
            else
            {
                if (defImageReview)
                {
                    imgUrl = defImageReview
                }
            }

            if (imageHint)
            {
                if ("image/jpeg"==imageHint.type || "image/png"==imageHint.type)
                {
                    imgHintUrl = await this.uploadHintImage();
                }
            }
            else
            {
                if (defImageHintReview)
                {
                    imgHintUrl = defImageHintReview
                }
            }

            await Firebase.functions().httpsCallable('quizzes-question-update')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "questionId": match.params.questionId, 
                "title": questionTitle, 
                "description": tags.join('`|`'),
                "order": random ? "Random" : 0,
                "answerLimit": 0,
                "limit": answerLimit,
                "hint": hint,
                "hintImage": imgHintUrl,
                "why": why,
                "image": imgUrl,
                "answer": answer,
                "cellPerRow": 1,
                "cellHeight": 0.5,
                "cellType": "text",
                "cellImageType": "a",
            });
            
            message.success('แก้ไขข้อมูลเรียบร้อยแล้ว', 3);
        }
        catch(err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    handleBack()
    {
        const { match } = this.props
        this.props.history.push('/quiz-lesson-detail/' + match.params.quizId + '/' + match.params.lessonId)
    }

    render()
    {
        const { 
            fetching, 
            createDialog,
            maps,
            subLesson,
            saving,
            action,
            descriptionText,
            questionDesc,
            questionTitle,
            random,
            answerName,
            answerLimit,
            hint,
            why,
            answer
        } = this.state;
        const { match } = this.props

        let items = maps
        if(subLesson !== 'none')
        {
            items = items.filter(e => e.subLesson === subLesson)
        }

        const empty = maps.length === 0

        return(
            <Parent ref="parent" >
                <ActionBar>
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }} >
                        คำตอบทั้งหมด
                    </Typography>
                    <Button
                        type="primary"
                        onClick={e => this.setState({ createDialog: 1 })}
                    >
                        เพิ่มคำตอบ
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
                                label="โจทย์"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="กรุณากรอกข้อความ ..."
                                    value={questionTitle}
                                    onChange={e => this.setState({ questionTitle: e.target.value })}
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
                                    placeholder=""
                                    disabled={true}
                                    value={questionDesc}
                                />
                                <ChipInput
                                    value={this.state.tags}
                                    style={{ width: `100%`, marginTop: `5px` }}
                                    onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="เพิ่มคำอธิบาย"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="กรุณากรอกข้อความ ..."
                                    value={descriptionText}
                                    onChange={e => this.setState({ descriptionText: e.target.value })}
                                />
                                <Button
                                    type="primary"
                                    shape="round"
                                    disabled={!descriptionText}
                                    style={{ minWidth: 72, mixWidth: 72, backgroundColor: descriptionText ? green[400] : grey[300], border: 0, marginTop: 5 }}
                                    onClick={() => 
                                    {
                                        this.handleAddChip(descriptionText)
                                    }}
                                >
                                    เพิ่มข้อความ
                                </Button>
                                <Button
                                    type="primary"
                                    shape="round"
                                    style={{ minWidth: 72, mixWidth: 72, backgroundColor: green[400], border: 0, marginTop: 5, marginLeft: 10 }}
                                    onClick={() => 
                                    {
                                        this.handleAddChip('{___}')
                                    }}
                                >
                                    เพิ่มกล่องวางคำตอบ
                                </Button>
                                <Button
                                    type="primary"
                                    shape="round"
                                    style={{ minWidth: 72, mixWidth: 72, backgroundColor: green[400], border: 0, marginTop: 5, marginLeft: 10 }}
                                    onClick={() => 
                                    {
                                        this.handleAddChip('\\n')
                                    }}
                                >
                                    ขึ้นบรรทัดใหม่
                                </Button>
                            </Form.Item>
                            <Form.Item
                                colon={false} 
                                label="รูปประกอบ"
                            >
                                { this.state.imageReview || this.state.defImageReview ? 
                                    <DivImage>
                                        <img style={{maxHeight: '150px', display: 'block', marginBottom: '15px'}} src={this.state.imageReview} alt="" />
                                        <CloseIcon onClick={ e => {
                                            this.resetImage = '';
                                            this.setState({
                                                image: '',
                                                imageReview: '',
                                                defImageReview: ''
                                            })
                                        }}>x</CloseIcon>
                                    </DivImage>
                                        : 
                                    <BlankImageDiv /> 
                                }
                                <input
                                    type="file"
                                    key={this.resetImage}
                                    accept="image/*"
                                    onChange={ e => this.setState({
                                        image: e.target.files[0],
                                        imageReview: URL.createObjectURL(e.target.files[0])
                                    })}
                                />
                            </Form.Item>
                            <Form.Item
                                colon={false} 
                                label="คำตอบสูงสุด"
                            >
                                <TextField
                                    type="number"
                                    fullWidth
                                    placeholder="..."
                                    value={answerLimit}
                                    onChange={e => this.setState({ answerLimit: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item
                                colon={false} 
                                label="คำใบ้"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="..."
                                    value={hint}
                                    onChange={e => this.setState({ hint: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item
                                colon={false} 
                                label="รูปคำใบ้"
                            >
                                { this.state.imageHintReview || this.state.defImageHintReview ? 
                                    <DivImage>
                                        <img style={{maxHeight: '150px', display: 'block', marginBottom: '15px'}} src={this.state.imageHintReview} alt="" />
                                        <CloseIcon onClick={ e => {
                                            this.resetImageHint = '';
                                            this.setState({
                                                imageHint: '',
                                                imageHintReview: '',
                                                defImageHintReview: ''
                                            })
                                        }}>x</CloseIcon>
                                    </DivImage>
                                        : 
                                    <BlankImageDiv /> }
                                <input
                                    type="file"
                                    key={this.resetImageHint}
                                    accept="image/*"
                                    onChange={ e => this.setState({
                                        imageHint: e.target.files[0],
                                        imageHintReview: URL.createObjectURL(e.target.files[0])
                                    })}
                                />
                            </Form.Item>
                            <Form.Item
                                colon={false} 
                                label="ทำไม?"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="..."
                                    value={why}
                                    onChange={e => this.setState({ why: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item
                                colon={false} 
                                label="คำตอบ"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder=""
                                    value={answer}
                                    onChange={e => this.setState({ answer: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item 
                                colon={false} 
                                label="สุ่มตัวเลือก"
                            >
                                <Checkbox
                                    checked={random}
                                    onChange={this.toggleRandom}  
                                >
                                    ใช่
                                </Checkbox>
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
                                                title: 'ต้องการลบคำถามนี้',
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
                        empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีบทเรียนย่อย</p></Flexbox> :
                        <React.Fragment>
                            <Paper elevation={0}>
                                <Table className="custom-table" >
                                    <TableHead>
                                        <TableRow selected={true} >
                                            <TableCell align="right" padding="checkbox" width="80" >
                                                <TableColumnName
                                                    label="ข้อที่"
                                                />
                                            </TableCell>
                                            <TableCell padding="default">
                                                <TableColumnName
                                                    label="คำตอบ"
                                                />
                                            </TableCell>
                                            <TableCell align="right" padding="checkbox" width="100" ></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            items
                                            .map((item, i) =>
                                            {
                                                // let number = item.order
                                                return(
                                                    <TableRow key={`${i}-${item.id}`} >
                                                        <TableCell align="right" padding="checkbox">{i + 1}</TableCell>
                                                        <TableCell padding="default">
                                                            <Typography noWrap >
                                                                {item.answer}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" padding="checkbox">
                                                            <Clickable to={`/quiz-choice/${match.params.quizId}/${match.params.lessonId}/${match.params.questionId}/${item.id}`}>
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
                        </React.Fragment>
                    }
                </ScrollView>
                <ModalRoot
                    open={createDialog > 0}
                >
                    <ModalPanel>
                        <DialogTitle>สร้างคำตอบ</DialogTitle>
                        <DialogContent>
                            {
                                createDialog === 1 ? 
                                <React.Fragment>
                                    <TextField
                                        margin="normal"
                                        label="คำตอบ"
                                        type="text"
                                        fullWidth
                                        inputProps={{ id: "dialog-reward-title" }}
                                        value={answerName}
                                        onChange={e => this.setState({ answerName: e.target.value })}
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
                                <Button color="primary" onClick={this.handleCreate} disabled={answerName === ''} >บันทึก</Button>
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

const DivImage = styled.div`
    position: relative;
    display: inline-block;
`

const CloseIcon = styled.span`
    background-color: #ff4d4f;
    color: #fff;
    position: absolute;
    top: -13px;
    right: -13px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    text-align: center;
    line-height: 23px;
`

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
    @media(min-width: 528px)
    {
        max-width: 480px;
    }
`

const BlankImageDiv = styled.div`
    display: block;
    width: 150px;
    height: 150px;
    background-color: #ccc;
    margin-bottom: 15px;
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