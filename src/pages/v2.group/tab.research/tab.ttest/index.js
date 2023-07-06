import React, { Fragment, useState, useEffect, useContext } from 'react'
import { useRouteMatch } from 'react-router-dom';

import
{
    Paper,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Grid,
} from '@material-ui/core'

import JFile from 'js-file-download';
import * as J2C from 'json2csv';

import { Button, Modal, message } from 'antd';

import AppContext from '../../../../AppContext'

import TableColumnName from '../../../../components/Table.Column.Name'
import TableSettings from '../../../../components/Table/Settings';
import TableDownload from '../../../../components/Table/Download';

import Flexbox from '../../../../components/Flexbox'
import Progress from '../../../../components/Progress'
import ScrollView from '../../../students.ts.v1/ScrollView'

import useSheets from '../../../v2.student/tab.summary.sheets/useSheets'
import useStudents from '../../../v2.students/useStudents'
import useActives from '../../tab.students/useActives'
import useTests from './useTests'

import Row from './Row'
import Filter from './Filter'

import filter from './util.filter'
import calc from './util.calc';

import TTestTable from './TTestTable';

import NumberUtil from '../../../../utils/NumberTS';

function loadFilters ()
{
    const ss = window.sessionStorage;
    const sheet = ss.getItem('quizzes.sheet') || 'none';

    return {
        sheet,
    }
}

function Comp (
    {
        group,
    }
)
{
    const match = useRouteMatch();
    const params = match.params;

    const groupID = params.groupId || 'null';

    const { space } = useContext(AppContext)

    const [modal, setModal] = useState(false);
    const [filters, setFilters] = useState(
        {
            ...loadFilters(),

            group: groupID,

            // sheet: 'none',
            status: 'active',
        }
    )

    const sheets = useSheets(space, { tutorial: false })
    const students = useStudents(space)
    const actives = useActives(space, filters)
    const pretests = useTests(space, 'pretest', filters)
    const posttests = useTests(space, 'posttest', filters)

    let items = filter(students.items, actives.map, filters)

    const empty = students.items.length === 0
    const fetching = students.fetching || sheets.fetching || actives.fetching
    const ttest = calc.ttest(items, pretests.map, posttests.map);

    function handleSheetLoaded ()
    {
        if (!sheets.fetching && sheets.items.length > 0)
        {
            if (filters.sheet === 'none')
            {
                setFilters({ ...filters, sheet: sheets.items[0]._docId })
            }
            else
            {
                const ids = sheets.items.map(item => item._docId)

                if (ids.indexOf(filters.sheet) < 0)
                {
                    setFilters({ ...filters, sheet: sheets.items[0]._docId })
                }
            }
        }
    }

    function handleFilterSave ()
    {
        const ss = window.sessionStorage;
        const sheet = filters.sheet || 'none';

        ss.setItem('quizzes.sheet', sheet);
    }

    function handleDownloadTable ()
    {
        try
        {
            const sheetID = filters.sheet;
            const sheetTitle = sheets.items.filter(e => e._docId === sheetID)[0];

            const rows = items.map((student, i) =>
            {
                const pretest = pretests.map[student.id] || {}
                const posttest = posttests.map[student.id] || {}

                return {
                    name: student.name,
                    pre: pretest.score,
                    post: posttest.score,
                };
            });

            const fields =
                [
                    {
                        label: 'ชื่อ',
                        value: 'name',
                    },
                    {
                        label: 'ก่อนเรียน (คะแนน)',
                        value: 'pre',
                    },
                    {
                        label: 'หลังเรียน (คะแนน)',
                        value: 'post',
                    },
                ];

            const file = `ตารางคะแนนก่อนและหลังเรียน${sheetTitle?.title}_${group.name}.csv`;
            const csv = new J2C.Parser({ withBOM: true, fields }).parse(rows);

            JFile(csv, file, 'text/csv');

            message.success('ดาวน์โหลดข้อมูลสำเร็จ', 3)
        }
        catch (err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    function handleDownloadSummary ()
    {
        try
        {
            function toFloat (value = 0)
            {
                return NumberUtil.prettifyF(value, 2);
            }

            function toInt (value = 0)
            {
                return NumberUtil.prettify (value);
            }

            const groupName = group.name;

            const sheetID = filters.sheet;
            const sheetTitle = sheets.items.filter(e => e._docId === sheetID)[0];

            let dir = '';
            let summary = '';

            const _ttest = ttest.ttest;

            if (_ttest.t > _ttest.tc1t)
            {
                dir = 'สูงกว่าก่อนเรียน';
            }
            else if (_ttest.t < -_ttest.tc1t)
            {
                dir = 'ต่ำกว่าหรือเท่ากับก่อนเรียน';
            }
            else
            {
                dir = 'ไม่แตกต่างกับก่อนเรียน';
            }

            if (typeof dir === 'string' && dir.length > 0)
            {
                summary = `จากตาราง พบว่า "${groupName}" มีผลสัมฤทธิ์ทางการเรียนคณิตศาสตร์ หลังเรียน ${dir} อย่างมีนัยสำคัญที่ระดับ .05 โดยมีค่า t = ${toFloat(_ttest.t)}`;
            }

            const items =
                [
                    {
                        name: 'Mean',
                        a: toFloat(_ttest.mean.y),
                        b: toFloat(_ttest.mean.x),
                    },
                    {
                        name: 'Variance',
                        a: toFloat(_ttest.variance.y),
                        b: toFloat(_ttest.variance.x),
                    },
                    {
                        name: 'Observations',
                        a: toFloat(_ttest.observations.y),
                        b: toFloat(_ttest.observations.x),
                    },
                    {
                        name: 'Pearson Correlation',
                        a: toFloat(_ttest.pearson),
                    },
                    {
                        name: 'Hypothesized Mean Difference',
                        a: '0.00',
                    },
                    {
                        name: 'df',
                        a: toFloat(_ttest.df),
                    },
                    {
                        name: 't Stat',
                        a: toFloat(_ttest.t),
                    },
                    {
                        name: 'P(T<=t) one-tail',
                        a: toFloat(_ttest.p1t),
                    },
                    {
                        name: 't Critical one-tail',
                        a: toFloat(_ttest.tc1t),
                    },
                    {
                        name: 'P(T<=t) two-tail',
                        a: toFloat(_ttest.p2t),
                    },
                    {
                        name: 't Critical two-tail',
                        a: toFloat(_ttest.tc2t),
                    },
                    {
                        name: '',
                    },
                    {
                        name: 'คะแนนทดสอบ',
                        a: 'ก่อนเรียน',
                        b: 'หลังเรียน',
                    },
                    {
                        name: 'n',
                        a: toInt(_ttest.n.x),
                        b: toInt(_ttest.n.y),
                    },
                    {
                        name: 'mean',
                        a: toFloat(_ttest.mean.x),
                        b: toFloat(_ttest.mean.y),
                    },
                    {
                        name: 'S.D.',
                        a: toFloat(_ttest.variance.x),
                        b: toFloat(_ttest.variance.y),
                    },
                    {
                        name: 't',
                        a: toFloat(_ttest.t),
                    },
                    {
                        name: 'df',
                        a: toFloat(_ttest.df),
                    },
                    {
                        name: 'sig',
                        a: toFloat(_ttest.sig),
                    },
                    {
                        name: '*ระดับนัยสำคัญที่ .05'
                    },
                    {
                        name: '',
                    },
                    {
                        name: summary,
                    },
                ]

            const fields =
                [
                    {
                        label: ' ',
                        value: 'name',
                    },
                    {
                        label: 'หลังเรียน',
                        value: 'a',
                    },
                    {
                        label: 'ก่อนเรียน',
                        value: 'b',
                    },
                ];

            const file = `ตารางสรุป${sheetTitle?.title}_${group.name}.csv`;
            const csv = new J2C.Parser({ withBOM: true, fields }).parse(items);

            JFile(csv, file, 'text/csv');

            message.success('ดาวน์โหลดข้อมูลสำเร็จ', 3)
        }
        catch (err)
        {
            console.log(err)
            message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    useEffect(handleSheetLoaded, [sheets.fetching, sheets.items])
    useEffect(handleFilterSave,
        [
            filters.sheet,
        ]);

    return (
        <Fragment>
            {
                fetching ? <Progress />
                    :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อมูลนักเรียน</p></Flexbox>
                        :
                        <Fragment>
                            <div
                                style={{
                                    padding: 16,
                                    background: 'white',
                                    borderBottom: '1px solid #d9d9d9',
                                    textAlign: 'right',
                                }}
                            >
                                <Button
                                    shape="round"
                                    type="primary"
                                    onClick={() => setModal(true)}
                                >
                                    ดูตารางสรุป
                        </Button>
                            </div>
                            <ScrollView fitParent={!empty} >
                                <Paper elevation={0}>
                                    <Table className="custom-table" >
                                        <TableHead>
                                            <TableRow selected={true} >
                                                <TableCell align="right" padding="checkbox" width="80" >
                                                    <TableColumnName
                                                        numeric={true}
                                                        label="ลำดับที่"
                                                    />
                                                </TableCell>

                                                <TableCell padding="default" style={{ minWidth: 160 }} >
                                                    <TableColumnName
                                                        label="ชื่อ"
                                                    />
                                                </TableCell>

                                                <TableCell align="right" padding="none" width="90">
                                                    <TableColumnName
                                                        numeric={true}
                                                        label={
                                                            <Grid container={true} >
                                                                <Grid item={true} xs={12} style={{ padding: `12px 12px 8px 12px`, borderBottom: `1px solid #d9d9d9` }} >
                                                                    <span>คะแนนสอบหลังเรียน</span>
                                                                </Grid>
                                                                <Grid item={true} xs={12} style={{ padding: `4px 12px` }} >
                                                                    <big>y</big>
                                                                </Grid>
                                                                {/* <Grid item={true} xs={6} style={{ padding: `4px 12px`, borderRight: `1px solid #d9d9d9` }} >
                                                            <big>y</big>
                                                        </Grid>
                                                        <Grid item={true} xs={6} style={{ padding: `4px 12px` }} >
                                                            <big>y<sup>2</sup></big>
                                                        </Grid> */}
                                                            </Grid>
                                                        }
                                                    />
                                                </TableCell>

                                                <TableCell align="right" padding="none" width="90">
                                                    <TableColumnName
                                                        numeric={true}
                                                        label={
                                                            <Grid container={true} >
                                                                <Grid item={true} xs={12} style={{ padding: `12px 12px 8px 12px`, borderBottom: `1px solid #d9d9d9` }} >
                                                                    <span>คะแนนสอบก่อนเรียน</span>
                                                                </Grid>
                                                                <Grid item={true} xs={12} style={{ padding: `4px 12px` }} >
                                                                    <big>x</big>
                                                                </Grid>
                                                                {/* <Grid item={true} xs={6} style={{ padding: `4px 12px`, borderRight: `1px solid #d9d9d9` }} >
                                                            <big>x</big>
                                                        </Grid>
                                                        <Grid item={true} xs={6} style={{ padding: `4px 12px` }} >
                                                            <big>x<sup>2</sup></big>
                                                        </Grid> */}
                                                            </Grid>
                                                        }
                                                    />
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                items
                                                    .map((student, i) =>
                                                    {
                                                        const pretest = pretests.map[student.id] || {}
                                                        const posttest = posttests.map[student.id] || {}

                                                        return (
                                                            <Row
                                                                key={student.id}
                                                                student={student}
                                                                n={i + 1}

                                                                pretest={{ ...pretest, fetching: pretests.fetching }}
                                                                posttest={{ ...posttest, fetching: posttests.fetching }}
                                                            />
                                                        )
                                                    })
                                                    .filter(item => item)
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </ScrollView>

                        </Fragment>
            }
            {
                !fetching &&
                <Filter
                    sheets={sheets.items}

                    filters={filters}
                    setFilters={setFilters}

                    extra={
                        (
                            <TableSettings
                                items={[]}
                                value={{}}
                                footer={
                                    group.fetching !== 'full' &&
                                    <>
                                        <TableDownload
                                            label="ดาวน์​โหลดข้อมูลตารางคะแนน"
                                            onClick={handleDownloadTable}
                                        />
                                        <div style={{ minHeight: 12 }} />
                                        <TableDownload
                                            label="ดาวน์​โหลดข้อมูตารางสรุป"
                                            onClick={handleDownloadSummary}
                                        />
                                    </>
                                }
                            />
                        )
                    }
                />
            }
            <Modal
                visible={!fetching && modal}
                closable={true}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                onCancel={() => setModal(false)}
                footer={null}
                zIndex={12000}
            >
                <div>
                    <b>t-Test: Paired Two Sample for Means</b>
                </div>
                <TTestTable {...ttest} />
            </Modal>
        </Fragment>
    )
}

export default Comp