import React from 'react';
import styled from 'styled-components';
import Firebase from '../../utils/Firebase';
import TextField from '../../components/TextField';
import { 
    Typography,
    withMobileDialog,
} from '@material-ui/core'
import {
    Button,
    Form,
    message,
    Modal
} from 'antd'

import Parent from '../../components/Parent';
import ActionBar from '../../components/ActionBar';
import MenuButton from '../../components/MenuButton';
import Progress from '../../components/Progress';

class Page extends React.Component
{
    constructor (props)
    {
        super (props);
        
        this.state = 
        {
            maps: [],
            page: 0,
            rowsPerPage: 50,
            
            // Time Editor
            item: null,
            saving: false,

            action: null,
            quizName: '',
            answer: '',
            image: null,
            imageReview: '',
            defImageReview: ''
        }

        this.unsubscribes = [];
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
                this.getAnswer();
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

    async getAnswer() {
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
            .collection(`answer`)
            .doc(match.params.choiceId)

        const snapshot = await queryRef.get()
        
        if (snapshot.get('isActive'))
        {
            const _img = snapshot.get('image')
            let _imgUrl = '';

            if (_img)
            {
                _imgUrl = await this.getFullImageUrl(_img)
            }

            this.setState({
                answer: snapshot.get('answer'),
                imageReview: _imgUrl,
                defImageReview: _imgUrl ? _img : ''
            });
        }
        else
        {
            this.props.history.push('/quiz-question/' + match.params.quizId + '/' + match.params.lessonId + '/' + match.params.questionId)
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

    async handleDelete()
    {
        const { match } = this.props
        
        try
        {
            await Firebase.functions().httpsCallable('quizzes-choice-delete')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "questionId": match.params.questionId,
                "choiceId": match.params.choiceId
            });
            
            message.success ('ลบข้อมูลเรียบร้อยแล้ว', 3);
            this.props.history.push('/quiz-question/' + match.params.quizId + '/' + match.params.lessonId + '/' + match.params.questionId)
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
        this.props.history.push('/quiz-question/' + match.params.quizId + '/' + match.params.lessonId + '/' + match.params.questionId)
    }

    async handleSubmit()
    {
        const { answer, image } = this.state
        const { match } = this.props

        try
        {
            let imgUrl = '';

            if (image)
            {
                if ("image/jpeg"==image.type || "image/png"==image.type)
                {
                    imgUrl = await this.uploadImage();
                }
            }
            await Firebase.functions().httpsCallable('quizzes-choice-update')({
                "quizId": match.params.quizId,
                "lessonId": match.params.lessonId,
                "questionId": match.params.questionId, 
                "choiceId": match.params.choiceId,
                "answer": answer,
                "image": imgUrl
            });
            
            message.success ('แก้ไขข้อมูลเรียบร้อยแล้ว', 3);
        }
        catch (err)
        {
            console.log (err)
            message.error ('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    async uploadImage()
    {
        const { image } = this.state
        const { match } = this.props

        return new Promise(function(resolve, reject) {
            try
            {
                const storage = Firebase.storage();
                const nameArr = image.name.split('.');
                const id_rand = match.params.choiceId + '.' + nameArr[nameArr.length - 1];

                const uploadTask = storage.ref(`/quizzes/${id_rand}`).put(image)
                uploadTask.on('state_changed', (snapShot) => {
                    console.log(snapShot)
                }, (err) => {
                    console.log(err)
                    resolve('');
                }, () => {
                    resolve(id_rand);
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

    render()
    {
        const {
            saving,
            action,
            answer
        } = this.state;

        return (
            <Parent ref="parent" >
                <ActionBar>
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }} >
                        คำตอบ
                    </Typography>
                </ActionBar>
                <ScrollView>
                <Card>
                    {
                        !!saving ?
                        <Progress />
                        :
                        <Form layout="vertical" >
                            <Form.Item 
                                colon={false} 
                                label="คำตอบ"
                            >
                                <TextField
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    placeholder="คำตอบ"
                                    value={answer}
                                    onChange={e => this.setState({ answer: e.target.value })}
                                />
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
                                        Modal.confirm (
                                            {
                                                title: 'ต้องการลบคำตอบนี้',
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
                </ScrollView>
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

const BlankImageDiv = styled.div`
    display: block;
    width: 150px;
    height: 150px;
    background-color: #ccc;
    margin-bottom: 15px;
`

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

Page = withMobileDialog()(Page)

export default Page;