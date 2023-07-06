import React, { Fragment } from 'react';

import styled from 'styled-components';

import ApexChart from 'apexcharts'

import JFile from 'js-file-download'
import J2C from 'json2csv'

import Firebase from '../utils/Firebase';

import DateUtil from '../utils/DateTime'
import QueryUtil from '../utils/Query'
import NumberUtil from '../utils/Number'

import GetMaps from '../services/getMaps.V1'
import GetSheets from '../services/getQuizzes.V1'
import GetReport from '../services/getReport.V1'

import { 
    Paper,
    // Checkbox,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    // TableFooter,
    // TablePagination,

    // Select,
    // MenuItem,
    // Card,
    // CardContent,
    Typography,
    ListItem,
    ListItemText,
    // ListItemIcon,
    IconButton,
    // TableSortLabel,
    Drawer,
    List,
    Divider,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core'

import {
    ArrowBack as ArrowBackIcon,

    BarChart as BarChartIcon,
    ViewList as ViewListIcon,

    EventNote as StatIcon,

    Close as CloseIcon,
    // Check as CheckIcon,

    // SaveAlt as SaveIcon,

    KeyboardArrowDown as ArrowDown,
    KeyboardArrowRight as ArrowRight,

} from '@material-ui/icons'

import {
    teal,
    red,
} from '@material-ui/core/colors'

import Flexbox from '../components/Flexbox';
import Progress from '../components/Progress';
// import SmallProgress from '../components/SmallProgress';

import TEXAnswer from '../components/TEXAnswer'
import TEXDraw from '../components/TEXDraw'

import TableColumnName from '../components/Table.Column.Name'

const Chart = styled.div`
    width: 100%;

    ${props => !props.visible && `
        display: none;
    `}
`

const SideSheet = styled.div`
    min-width: 90vw;
    max-width: 90vw;

    /* @media (min-width: 375px)
    {
        min-width: 360px;
        max-width: 360px;
    } */

    @media (min-width: 600px)
    {
        min-width: 576px;
        max-width: 576px;
    }
`

const PreIcon = styled.div`
    padding-right: 16px;
    padding-left: 0 !important;

    flex-shrink: 0;
    display: flex;
`

const PrimaryText = styled.div`
    flex-grow: 1;
    display: flex;
`

const SecondaryText = styled.div`
    padding-right: 0 !important;

    flex-grow: 1;
    /* flex-shrink: 0; */

    display: flex;
`

const ThirdText = styled.div`
    padding-left: 16px;
    padding-right: 0 !important;

    flex-shrink: 0;
    display: flex;
`

const ExpansionData = styled.div`
    width: 100%;
    text-align: left;

    img
    {
        display: flex;

        max-width: 100%;
        margin: 24px auto;
    }
`

class Page extends React.Component
{

    constructor (props)
    {
        super (props);

        this.state = 
        {
            fetching: true,
            fetchingData: true,

            stats: [],
            sheet: {},
            
            questions: [],
            expandeds: {},
        }

        this.unsubscribes = [];
        this.fetch = this.fetch.bind(this)
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

        if (!!this.chart)
        {
            this.chart.destroy ()
            this.chart = null
        }
    }

    // componentDidUpdate (prevProps)
    // {
    //     if (prevProps.history.location.search !== this.props.history.location.search)
    //     {
    //         this.fetch ()
    //     }
    // }

    async fetch ()
    {
        this.setState({ 
            fetching: true, 
            fetchingData: true,

            stats: [],
            sheet: {},
        })

        const { history } = this.props
        const { sheetID, quizID } = QueryUtil.parse(history.location.search)

        const { id, order } = (await GetMaps.get({ lastBoss: true })).filter (m => m._docId === sheetID)[0]
        const { _docId, title, subLesson } = (await GetSheets.get ({ id, order }, true, true)).filter(s => s._docId === quizID)[0]

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const studentId = this.props.match.params.studentId || 'null'

        let redrawPath = true

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacher)
            .collection('students')
            .doc(studentId)
            .collection('maps')
            .doc(sheetID)
            .collection('sheets')
            .doc(quizID)
            .collection('statistics')
            .orderBy('createdAt', 'asc')
            .onSnapshot(snapshot =>
            {
                const stats = []
                let i = 0

                snapshot.forEach(doc => 
                {
                    stats.push({
                        id: doc.id,
                        number: ++i,

                        ...doc.data (),
                    })
                });

                this.setState({ 
                    fetchingData: false,

                    stats,
                });

                this.renderChart (redrawPath)
                redrawPath = false
            })
        )
        
        this.setState({ 
            fetching: false, 
            sheet: { _docId, title, subLesson },
        })
    }

    renderChart = async (redrawPath) =>
    {
        await new Promise (r => setTimeout(r, 100))

        const data = []
        const categories = []
        const times = []

        this.state.stats
        .sort ((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
        .forEach ((stat, i) =>
        {
            categories.push (i + 1)

            times.push (DateUtil.format(stat.createdAt, { monthType: 'short' }))
            data.push (stat.score)
        })

        const series = [
            {
                data,
            }
        ]

        const el = document.querySelector("#student-sheet-chart")

        const options = {
            chart: {
                type: 'bar',
                height: 380,
                // width: '100%',
                zoom: false,

                scroller: {
                    enabled: false
                },
                toolbar: {
                    show: false,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: false,
                        reset: true,
                    },
                },
            },
            
            dataLabels: {
                enabled: false
            },
                
            markers: {
                size: 2,
                hover: {
                    size: 6
                }
            },
            grid: {
                
                padding: {
                    top: 0,
                    left: 0,
                    right: 0,
                }
            },
            yaxis: {
                min: 0,
                max: 3,
                tickAmount: 3,
                // floating: false,
            },
            xaxis: {
                categories,
            },

            legend: {
                // containerMargin: {
                //     top: 20,//isHour || isDay ? 20 : 10,
                // },
            },

            tooltip: {
                y: {
                    title: {
                        formatter: () => `คะแนน`
                    },
                },
                x: {
                    show: true,
                    formatter: function(value)
                    {
                        if (!value)
                        {
                            return ''
                        }
                        
                        return times[value - 1]

                        // const t = moment(new Date(value))

                        // if (isHour)
                        // {
                        //     return t.format("HH:00 น")
                        // }

                        // return DateTimeUtil.formatDate(t.toDate(), { monthType: 'short' })
                    }
                }
            },

            responsive: [{
                breakpoint: 576,
                options: {
                    chart: {
                        height: 240,
                    }
                },
            }],

            colors: [ '#95d38e', '#fed075', '#ff2727' ],
            series,
        }

        if (!!this.chart)
        {
            await this.chart.updateOptions (options, redrawPath, true)
        }
        else if (!!el)
        {
            this.chart = new ApexChart(el, options)
            this.chart.render()
        }

        // if (!!this.chart)
        // {
        //     this.chart.destroy ()
        // }

        // this.chart = new ApexChart(el, options)
        // this.chart.render()
    }

    toggle = (questions) =>
    {
        this.setState ({ questions, expandeds: { 0: true } })
    }

    download = async () =>
    {
        const { _docId } = this.state.sheet

        const { history } = this.props
        const { sheetID, quizID } = QueryUtil.parse(history.location.search)

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const studentId = this.props.match.params.studentId || 'null'

        const report = await GetReport.statistics (teacher, studentId, sheetID, quizID)
        
        const fileName = `${_docId}.csv`
        const file = new J2C.Parser({ fields: GetReport.fields.statistic }).parse(report)

        JFile(file, fileName)
    }

    render ()
    {
        const { fetching, fetchingData, stats, sheet, questions, expandeds } = this.state;
        const empty = stats.length === 0;

        const { history } = this.props

        const query = QueryUtil.parse(history.location.search)
        const path = history.location.pathname

        const { title, subLesson } = sheet
        
        const orderDirection = query.order === 'asc' ? 'desc' : 'asc'

        return (
            <React.Fragment >
                {
                    fetching || fetchingData ? <Progress /> :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อสอบ</p></Flexbox> :
                    <Fragment>
                        <Paper elevation={0} >
                            <ListItem divider={true} disableGutters={true} style={{ padding: `0 12px` }} >
                                <IconButton 
                                    onClick={e =>
                                    {
                                        const href = `${path}?${QueryUtil.stringify({ ...query, quizID: '' })}`
                                        this.props.history.push(href)
                                    }}
                                >
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                                <ListItemText 
                                    primary={subLesson || title}
                                    style={{ padding: 8 }}
                                />
                                {
                                    query.view === 'chart' ?
                                    <IconButton
                                        title="แสดงผลแบบตาราง"
                                        disabled={fetching || fetchingData}
                                        onClick={e =>
                                        {
                                            const href = `${path}?${QueryUtil.stringify({ ...query, view: '' })}`
                                            this.props.history.push(href)
                                        }}
                                    >
                                        <ViewListIcon />
                                    </IconButton>
                                    :
                                    <IconButton
                                        title="แสดงผลแบบกราฟ"
                                        disabled={fetching || fetchingData}
                                        onClick={e =>
                                        {
                                            const href = `${path}?${QueryUtil.stringify({ ...query, view: 'chart' })}`

                                            this.renderChart (true)
                                            this.props.history.push(href)
                                        }}
                                    >
                                        <BarChartIcon />
                                    </IconButton>
                                }

                                {/* <IconButton
                                    title="ดาวน์โหลด"
                                    disabled={fetching || fetchingData}
                                    onClick={this.download}
                                >
                                    <SaveIcon />
                                </IconButton> */}
                            </ListItem>
                        </Paper>
                        <ScrollView fitParent={!empty}>
                            <Paper elevation={0}>
                                
                                <Chart visible={query.view === 'chart'} >
                                    <div id="student-sheet-chart" className="chart" />
                                </Chart>
                                {
                                    query.view !== 'chart' &&
                                    <Fragment>
                                        <Table className="custom-table" >
                                            <TableHead>
                                                <TableRow selected={true} >
                                                    <TableCell padding="dense">
                                                        <TableColumnName
                                                            label="ครั้งที่"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" padding="checkbox" width={140} >
                                                        <TableColumnName
                                                            label="คะแนน"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" padding="checkbox" width={180} >
                                                        <TableColumnName
                                                            label="เวลาที่ใช้ (วินาที)"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" padding="checkbox" width={140} >
                                                        <TableColumnName
                                                            numeric={true}
                                                            name="submittedAt"
                                                            label="วัน/เวลาที่ส่งข้อสอบ"
                                                            orderBy="submittedAt"
                                                            order={orderDirection}
                                                            onSort={() =>
                                                            {
                                                                const href = `${path}?${QueryUtil.stringify({ ...query, order: orderDirection })}`
                                                                this.props.history.push(href)
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell padding="none" width={48} >
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    stats
                                                    .sort ((a, b) =>
                                                    {
                                                        const ad = a.createdAt.toMillis ()
                                                        const bd = b.createdAt.toMillis ()

                                                        if (query.order === 'asc')
                                                        {
                                                            return ad - bd
                                                        }

                                                        return bd - ad
                                                    })
                                                    .map((stat, i) =>
                                                    {
                                                        const { id, number, score, usage, createdAt, questions } = stat
                                                        const sec = Math.round (usage / 1000)

                                                        return (
                                                            <TableRow 
                                                                key={id} 
                                                            >
                                                                <TableCell padding="dense">
                                                                    <Typography >
                                                                        {number}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right" padding="checkbox">
                                                                    {NumberUtil.prettify(score)}
                                                                </TableCell>
                                                                <TableCell align="right" padding="checkbox">
                                                                    {NumberUtil.prettify(sec)}
                                                                </TableCell>
                                                                <TableCell align="right" padding="checkbox">
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateUtil.formatDate(createdAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateUtil.formatTime(createdAt)}
                                                                        </Typography>
                                                                    </Typography>
                                                                    {/* <Typography noWrap >
                                                                        {DateUtil.format (createdAt, { delimiter: ' ', monthType: 'short' })}
                                                                    </Typography> */}
                                                                </TableCell>
                                                                <TableCell padding="none" >
                                                                    <IconButton
                                                                        onClick={() => this.toggle (questions)}
                                                                    >
                                                                        <StatIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                    .filter(item => item)
                                                }
                                            </TableBody>
                                        </Table>
                                    </Fragment>
                                }
                            </Paper>
                        </ScrollView>
                    </Fragment>
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
                                primary="ข้อมูลการตอบ"
                            />
                            <IconButton onClick={() => this.toggle (null)} >
                                <CloseIcon />
                            </IconButton>
                        </ListItem>
                        
                        <List>
                            <Divider />
                            {
                                !!questions &&
                                questions.map ((question, i) =>
                                {
                                    const { 
                                        type,
                                        title, 
                                        description, 
                                        image, 
                                        correct, 
                                        answer, 
                                        value, 
                                        usage,
                                        why,
                                    } = question

                                    const sec = Math.round (usage / 1000)

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

                                    return (
                                        <Fragment key={`student-chart-sheet-question-${i}`} >
                                            <ExpansionPanel 
                                                elevation={0} 
                                                expanded={!!expandeds[i]} 
                                                onChange={e => 
                                                {
                                                    const _expandeds = this.state.expandeds
                                                    _expandeds[i] = !_expandeds[i]

                                                    this.setState ({ expandeds: _expandeds })
                                                }}
                                            >
                                                <ExpansionPanelSummary >
                                                    <PreIcon>
                                                        {
                                                            !!expandeds[i] ?
                                                            <ArrowDown fontSize="small" style={{ color: 'cornflowerblue' }} />
                                                            :
                                                            <ArrowRight fontSize="small" style={{ color: 'cornflowerblue' }} />
                                                        }
                                                    </PreIcon>
                                                    <PrimaryText>
                                                        <Typography >
                                                            ข้อที่ {i + 1}
                                                        </Typography>
                                                    </PrimaryText>
                                                    <SecondaryText>
                                                        <Typography 
                                                            color="textSecondary" 
                                                        >
                                                            {NumberUtil.prettify(sec)} วินาที
                                                        </Typography>
                                                    </SecondaryText>
                                                    <ThirdText>
                                                        {
                                                            correct ?
                                                            <Typography style={{ color: teal[500] }} >
                                                                ถูก
                                                            </Typography>
                                                            // <CheckIcon fontSize="small" style={{ color: teal[500] }} />
                                                            :
                                                            <Typography style={{ color: red[500] }} >
                                                                ผิด
                                                            </Typography>
                                                            // <CloseIcon fontSize="small" style={{ color: red[500] }} />
                                                        }
                                                    </ThirdText>
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
                                                        
                                                        <Typography gutterBottom={false} ><b>คำตอบที่ถูกต้อง</b></Typography>
                                                 
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
                                                            <TEXAnswer type={type} text={answer} />
                                                            {/* <TEXDraw text={answerText} pipe={true} /> */}
                                                        </Typography>

                                                        <Typography gutterBottom={false} >
                                                            <b>คำตอบของนักเรียน</b>
                                                            {
                                                                !correct && !!why &&
                                                                <Anchor
                                                                    href={why}
                                                                    target="_blank"
                                                                >
                                                                    (ทำไมจึงตอบผิด ?)
                                                                </Anchor>
                                                            }
                                                        </Typography>
                                                        {
                                                            // value.startsWith (`http`) ?
                                                            // <img src={value} />
                                                            // :
                                                            // <Typography
                                                            //     gutterBottom={true} 
                                                            //     style={
                                                            //         {
                                                            //             color: correct ? teal[500] : red[500],
                                                            //         }
                                                            //     }
                                                            // >
                                                            //     <TEXDraw text={value} pipe={true} />
                                                            // </Typography>
                                                        }
                                                        <Typography
                                                            gutterBottom={true} 
                                                            component="div"
                                                            style={
                                                                {
                                                                    color: correct ? teal[500] : red[500],
                                                                }
                                                            }
                                                        >
                                                            <TEXAnswer type={type} text={value} />
                                                        </Typography>
                                                    </ExpansionData>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                            <Divider />
                                            {/* {i + 1 < questions.length && <Divider />} */}
                                        </Fragment>
                                    )
                                })
                            }
                        </List>
                    </SideSheet>
                </Drawer>
            </React.Fragment>
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

const Anchor = styled.a`
    padding: 0 2px;

    color: cornflowerblue;
    cursor: pointer;

    &:hover
    {
        background: rgba(0,0,0, 0.05);
    }
`

// const HorizontalScrollView = styled.div`
//     overflow-x: auto;

//     table
//     {
//         overflow-x: auto;
//     }
// `

// const Clickable = styled.div`
//     padding: 16px 24px;

//     &:hover
//     {
//         background: rgba(0,0,0, 0.05);
//     }
// `

export default Page;