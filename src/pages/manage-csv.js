import React from 'react';
import Query from 'querystring'

import styled from 'styled-components';

import Firebase from '../utils/Firebase';
// import DateTime from '../utils/DateTime'

import { 
    // Dialog,
    // DialogTitle, 
    // DialogContent, 
    // DialogActions,

    Typography,
    // Paper,

    Button,

    // Table,
    // TableBody,
    // TableCell,
    // TableHead,
    // TableRow,
    // TableFooter,
    // TablePagination,

    TextField,
    // Select,
    // FormControl,
    // InputLabel,
    // MenuItem,
    // FormControlLabel,
    // Checkbox,
} from '@material-ui/core'

import Parent from '../components/Parent';
import ActionBar from '../components/ActionBar';
import MenuButton from '../components/MenuButton';
// import Flexbox from '../components/Flexbox';
// import Progress from '../components/Progress';
// import { teal } from '@material-ui/core/colors';

import CSVFileInput from '../components/CSVFileInput'

class Page extends React.Component
{
    constructor (props)
    {
        super (props);

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

    componentDidMount ()
    {
        const { history } = this.props;
        const q = Query.parse (window.location.search.slice (1))

        if (!!q.token)
        {
            this.setState (
                { 
                    token: q.token || '',
                }
            )
        }
        else
        {
            history.replace(`/students`)
            return
        }

        const auth = Firebase.auth();

        this.unsubscribes1[0] = auth.onAuthStateChanged(user =>
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
        const rdb = Firebase.database ()
        
        this.unsubscribes1.filter(fn => !!fn).forEach(fn => fn());
        this.unsubscribes2.filter(path => !!path).forEach(path => rdb.ref(path).off('value'));
    }

    fetch = () =>
    {
        
    }
    
    onChange = (name, value) =>
    {
        this.setState ({ [name]: value })
    }
    
    onSubmit = async () =>
    {
        this.setState ({ submitting: true })

        const { 
            token,
            type,
            rem,
            csv,
        } = this.state

        const fn = Firebase.functions ().httpsCallable ('admin-UploadCSV')

        try
        {
            const result = await fn ({ token, type, rem, csv })
            
            if (type === 'reformat')
            {
                this.onDownload (JSON.stringify(result.data, null, 2))
            }
            else
            {
                
            }

            alert (`บันทึกข้อมูลสำเร็จ`)
        }
        catch (err)
        {
            alert (`พบข้อผิดพลาดกรุณาลองใหม่อีกครั้ง`)
        }

        this.setState ({ submitting: false })
    }

    onDownload = (text) =>
    {
        var filename = `${new Date().getTime()}.json`
        var element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    render ()
    {
        const { 
            fetching,
            submitting,

            token,
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
                    {/* <Button color="primary" onClick={e => this.setState({ createDialog: 1 })} >อัปโหลดข้อสอบ</Button> */}
                </ActionBar>
                <Layout>
                    <Row>
                        <TextField 
                            label="โทเค็น"
                            type="text"
                            value={token}
                            onChange={e => this.onChange('token', e.target.value)}
                            disabled={true}
                        />
                    </Row>

                    <br />

                    {/* Deprecated */}
                    {/* <Row>
                        <FormControl>
                            <InputLabel htmlFor="select-type" >ประเภทไฟล์ CSV</InputLabel>
                            <Select
                                inputProps={{ id: "select-type" }}
                                onChange={e => this.onChange('type', e.target.value)}
                                value={type}
                            >
                                <MenuItem value="" disabled ><em>ประเภทไฟล์ CSV</em></MenuItem>
                                <MenuItem value="maps" >สาระ</MenuItem>
                                <MenuItem value="quizzes" >ชุดคำถาม</MenuItem>
                                <MenuItem value="reformat" >แปลงฟอร์แมตชุดคำถาม</MenuItem>
                            </Select>
                        </FormControl>
                    </Row> */}

                    {/* <br /> */}

                    {
                        // type !== 'reformat' &&
                        // <Row>
                        //     <FormControlLabel
                        //         control={
                        //             <Checkbox
                        //                 checked={rem}
                        //                 onChange={e => this.onChange('rem', e.target.checked)}
                        //                 value="rem"
                        //             />
                        //         }
                        //         label="ต้องการลบข้อมูลจากรายการ"
                        //     />
                        // </Row>
                    }

                    {/* <br /> */}
                    
                    <Row>
                        <CSVFileInput onChange={csv => this.onChange ('csv', csv)} />
                    </Row>

                    <Row>
                        <Actions>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={this.onSubmit}
                                disabled={!!fetching || !!submitting || !token || !type || csv.length === 0}
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

// const ScrollView = styled.div`
//     overflow: auto;

//     ${props => props.fitParent && `
//         height: 100%;
//     `}

//     table
//     {
//         background: white;
//     }
// `

// const HorizontalScrollView = styled.div`
//     overflow-x: auto;

//     table
//     {
//         overflow-x: auto;
//     }
// `

// const Clickable = styled.div`
//     color: cornflowerblue;
//     text-decoration: underline;
    
//     cursor: pointer;

//     padding: 16px 24px;

//     &:hover
//     {
//         background: rgba(0,0,0, 0.05);
//     }
// `

// const Code = styled.span`
//     color: ${teal[700]};
//     margin-left: 1px;
// `

export default Page;