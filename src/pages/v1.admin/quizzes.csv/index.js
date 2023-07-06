import React from 'react';
import styled from 'styled-components';
import Firebase from '../../../utils/Firebase';
import firebase from 'firebase/app'
import {
    Typography,
    Button,
} from '@material-ui/core'
import Parent from '../../../components/Parent';
import ActionBar from '../../../components/ActionBar';
import MenuButton from '../../../components/MenuButton';
import CSVFileInput from '../../../components/CSVFileInput'

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state =
        {
            fetching: false,
            submitting: false,

            token: '',
            // type: '',
            type: 'quizzes',
            rem: false,
            csv: [],
        }

        this.unsubscribes1 = [];
        this.unsubscribes2 = [];

        this.fetch = this.fetch.bind(this)
    }

    componentDidMount() {
        const { history } = this.props;

        const auth = Firebase.auth();

        this.unsubscribes1[0] = auth.onAuthStateChanged(user => {
            if (user) {
                this.fetch();
            }
            else {
                history.replace(`/sign-in?redirect=${encodeURIComponent(history.location.pathname + history.location.search)}`);
            }
        });
    }

    componentWillUnmount() {
        const rdb = Firebase.database()

        this.unsubscribes1.filter(fn => !!fn).forEach(fn => fn());
        this.unsubscribes2.filter(path => !!path).forEach(path => rdb.ref(path).off('value'));
    }

    fetch = () => {

    }

    onChange = (name, value) => {
        this.setState({ [name]: value })
    }

    onSubmit = async () => {
        this.setState({ submitting: true })

        const {
            type,
            rem,
            csv,
        } = this.state

        // const fn = Firebase.functions().httpsCallable('admin-UploadCSV')
        const fn = firebase.app().functions('asia-southeast1').httpsCallable('v3-admin-uploadMap')

        try {
            const result = await fn({ type, rem, csv })

            if (type === 'reformat') {
                this.onDownload(JSON.stringify(result.data, null, 2))
            }
            else {

            }

            alert(`บันทึกข้อมูลสำเร็จ`)
        }
        catch (err) {
            alert(`พบข้อผิดพลาดกรุณาลองใหม่อีกครั้ง`)
        }

        this.setState({ submitting: false })
    }

    onDownload = (text) => {
        var filename = `${new Date().getTime()}.json`
        var element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    render() {
        const {
            fetching,
            submitting,

            type,
            // rem,
            csv,
        } = this.state

        return (
            <Parent ref="parent" >
                <ActionBar >
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle1" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }} >
                        จัดการข้อสอบ
                    </Typography>
                </ActionBar>
                <Layout>
                    <br />
                    <Row>
                        <CSVFileInput onChange={csv => this.onChange('csv', csv)} />
                    </Row>
                    <Row>
                        <Actions>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={this.onSubmit}
                                disabled={!!fetching || !!submitting || !type || csv.length === 0}
                            >
                                {submitting ? `กำลังบันทึก . . .` : `บันทึก`}
                            </Button>
                        </Actions>
                    </Row>
                </Layout>
            </Parent>
        )
    }
}

const Layout = styled.div`
    padding: 15px;
`

const Row = styled.div`
    display: flex;

    flex-direction: column;
    flex-wrap: nowrap;

    padding: 5px;
`

const Actions = styled.div`
    margin-top: 20px;
`

export default Page;