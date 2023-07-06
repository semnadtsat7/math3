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

    Typography,
} from '@material-ui/core'

import JFile from 'js-file-download';
import * as J2C from 'json2csv';

import { message } from 'antd';

import AppContext from '../../../../AppContext'
import NumberUtil from '../../../../utils/NumberTS';

import TableColumnName from '../../../../components/Table.Column.Name'
import TableSettings from '../../../../components/Table/Settings';
import TableDownload from '../../../../components/Table/Download';

import Flexbox from '../../../../components/Flexbox'
import Progress from '../../../../components/Progress'
import ScrollView from '../../../students.ts.v1/ScrollView'

import useSheets from '../../../v2.student/tab.summary.sheets/useSheets'
import useActives from '../../tab.students/useActives'
import useTests from '../tab.ttest/useTests'

import Row from './Row'
import Filter from '../tab.ttest/Filter'

function filterAndSort (pre, tests, actives)
{
    let _items = [];

    for (let id in tests)
    {
        // console.log(id, pre[id], tests[id])

        if (actives[id] && pre[id])
        {
            _items.push({
                ...tests[id],
                score2: tests[id].score * tests[id].score,
            });
        }
    }

    return _items.sort((a, b) => b.score - a.score);
}

function findMax (tests, field)
{
    let max = 0;

    tests.forEach(e =>
    {
        if (e[field] > max)
        {
            max = e[field];
        }
    })

    return max;
}

function getSigma (tests)
{
    const count = findMax(tests, 'count');
    const sums = [];

    let totalSum = 0;
    let totalSum2 = 0;

    for (let i = 0; i < count; i++)
    {
        for (let j = 0; j < tests.length; j++)
        {
            const items = tests[j].items;
            const value = items.length > i ? items[i] : 0;

            sums[i] = (sums[i] || 0) + value;
        }
    }

    for (let j = 0; j < tests.length; j++)
    {
        totalSum += tests[j].score;
        totalSum2 += tests[j].score2;
    }

    return {
        label: '∑',
        n: <strong>∑</strong>,
        bg: '#f5f5f5',
        count: count,
        score: totalSum,
        score2: totalSum2,
        items: sums,
    }
}

function getH (tests)
{
    const count = findMax(tests, 'count');
    const sums = [];

    let length = Math.floor(tests.length / 2);

    for (let i = 0; i < count; i++)
    {
        for (let j = 0; j < length; j++)
        {
            const items = tests[j].items;
            const value = items.length > i ? items[i] : 0;

            sums[i] = (sums[i] || 0) + value;
        }
    }

    return {
        label: 'กลุ่มเก่งตอบถูก (H)',
        n: <strong>กลุ่มเก่งตอบถูก (H)</strong>,
        bg: '#ffffee',
        count: count,
        items: sums,
    }
}

function getL (tests)
{
    const count = findMax(tests, 'count');
    const sums = [];

    let center = Math.ceil(tests.length / 2);

    for (let i = 0; i < count; i++)
    {
        for (let j = center; j < tests.length; j++)
        {
            const items = tests[j].items;
            const value = items.length > i ? items[i] : 0;

            sums[i] = (sums[i] || 0) + value;
        }
    }

    return {
        label: 'กลุ่มอ่อนตอบถูก (L)',
        n: <strong>กลุ่มอ่อนตอบถูก (L)</strong>,
        bg: '#ffffee',
        count: count,
        items: sums,
    }
}

function getP (H, L, studentCount)
{
    const items = [];

    for (let i = 0; i < H.count; i++)
    {
        items[i] = NumberUtil.truncate((H.items[i] + L.items[i]) / studentCount, 2);
    }

    return {
        label: 'ค่าความยาก (P)',
        n: <strong>ค่าความยาก (P)</strong>,
        bg: '#f5f5ff',
        count: H.count,
        items,
    }
}

function getPText (P)
{
    function getLabel (p = 0)
    {
        if (p > 0.8)
        {
            return 'เข้าเกณฑ์ข้อสอบง่ายมาก 0.6-0.8';
        }
        else if (p > 0.6)
        {
            return 'เข้าเกณฑ์ข้อสอบง่าย 0.6-0.8';
        }
        else if (p >= 0.4)
        {
            return 'เข้าเกณฑ์ข้อสอบปานกลาง 0.4-0.6';
        }
        else if (p >= 0.2)
        {
            return 'เข้าเกณฑ์ข้อสอบยาก 0.2-0.4';
        }
        else
        {
            return 'เข้าเกณฑ์ข้อสอบยากมาก 0.0-0.2';
        }
    }

    const items = [];

    for (let i = 0; i < P.count; i++)
    {
        items[i] = getLabel(P.items[i]);
    }

    return {
        n: '',
        bg: '#f5f5ff',
        count: P.count,
        items,
    }
}

function getBindex (H, L, studentCount)
{
    const items = [];
    const half = studentCount / 2;

    for (let i = 0; i < H.count; i++)
    {
        items[i] = NumberUtil.truncate((H.items[i] - L.items[i]) / half, 2);
    }

    return {
        label: 'ค่าอำนาจจำแนก (B-index)',
        n: <strong>ค่าอำนาจจำแนก (B-index)</strong>,
        bg: '#f5fff5',
        count: H.count,
        items,
    }
}

function getBindexText (Bi)
{
    function getLabel (p = 0)
    {
        if (p >= 0.2)
        {
            return 'มีอำนาจจำแนกมากกว่าเกณฑ์ 0.2';
        }
        else
        {
            return 'มีอำนาจจำแนกน้อยกว่าเกณฑ์ 0.2';
        }
    }

    const items = [];

    for (let i = 0; i < Bi.count; i++)
    {
        items[i] = getLabel(Bi.items[i]);
    }

    return {
        n: '',
        bg: '#f5fff5',
        count: Bi.count,
        items,
    }
}

function getR (items, Z, K, N)
{
    let Z_X2 = 0;
    let ZX_2 = 0;

    let pq = 0;

    for (let i = 0; i < items.length; i++)
    {
        const x = items[i].score;

        Z_X2 += x * x;
        ZX_2 += x;
    }

    for (let i = 0; i < Z.count; i++)
    {
        const x = Z.items[i];

        let p = x / N;
        let q = 1 - p;

        pq += p * q;
    }

    ZX_2 = ZX_2 * ZX_2;

    const s2 = ((N * Z_X2) - ZX_2) / (N * N);
    const r = (K / (K - 1)) * (1 - (pq / s2));

    return NumberUtil.truncate(r, 2);
}

function getSumText (Bi)
{
    function getLabel (p = 0)
    {
        if (p >= 0.2)
        {
            return 'ใช้ได้';
        }
        else
        {
            return 'พอใช้ได้';
        }
    }

    const items = [];

    for (let i = 0; i < Bi.count; i++)
    {
        items[i] = getLabel(Bi.items[i]);
    }

    return {
        label: 'สรุปข้อสอบ',
        n: <strong>สรุปข้อสอบ</strong>,
        bg: '#f5ffff',
        count: Bi.count,
        items,
    }
}

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
    const { space } = useContext(AppContext);

    const [filters, setFilters] = useState(
        {
            ...loadFilters(),

            group: groupID,

            // sheet: 'none',
            status: 'active',
        }
    )

    const sheets = useSheets(space, { tutorial: false })
    // const students = useStudents (space)
    const actives = useActives(space, filters)
    const pretests = useTests(space, 'pretest', filters)
    const posttests = useTests(space, 'posttest', filters)

    let items = filterAndSort(pretests.map, posttests.map, actives.map, filters)

    const fetching = posttests.fetching || sheets.fetching || actives.fetching
    const empty = !fetching && items.length === 0
    // const ttest = calc.ttest (items, pretests.map, posttests.map);

    const count = findMax(items, 'count');
    const cols = [];

    const sigma = getSigma(items);
    const H = getH(items);
    const L = getL(items);
    const P = getP(H, L, items.length);
    const PText = getPText(P);
    const Bi = getBindex(H, L, items.length);
    const BiText = getBindexText(Bi);
    const SumText = getSumText(Bi);
    const r = getR(items, sigma, count, items.length);

    for (let i = 0; i < count; i++)
    {
        cols.push(
            <TableCell
                key={`col-${i}`}
                align="right"
                padding="checkbox"
                // width="80"
                style={{ width: 80 }}
            >
                <TableColumnName
                    numeric={true}
                    label={i + 1}
                />
            </TableCell>
        )
    }

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

            const _items = items.map((e, i) => 
                {
                    return { ...e, label: `${i + 1}` };
                })

            const raws = [ ..._items, sigma, H, L, P, PText, Bi, BiText, SumText ];
            const rows = [];

            for (const e of raws) 
            {
                const row = 
                {
                    name: e.label,
                    // x: NumberUtil.truncate(e.score, 1),
                    // xx: NumberUtil.truncate(e.score * e.score, 1),
                };

                if (typeof e.score === 'number')
                {
                    row.x = NumberUtil.truncate(e.score, 1);
                }

                if (typeof e.score2 === 'number')
                {
                    row.xx = NumberUtil.truncate(e.score2, 1);
                }
                else if (typeof e.score === 'number')
                {
                    row.xx = NumberUtil.truncate(e.score * e.score, 1);
                }

                for (let i = 0; i < count; i++)
                {
                    const value = e.items.length > i ? e.items[i] : 0;

                    if (typeof value === 'number')
                    {
                        row[`${i}`] = NumberUtil.truncate(value, 1);
                    }
                    else
                    {
                        row[`${i}`] = value;
                    }
                }

                rows.push(row);
            }

            rows.push(
                {
                    name: 'ค่าความเชื่อมั่นข้อสอบ (r)',
                    x: NumberUtil.truncate(r, 2),
                    xx: r >= 0.8 ? 'ข้อสอบมีค่าความเชื่อมั่นมากกว่าเกณฑ์ 0.80' : 'ข้อสอบมีค่าความเชื่อมั่นน้อยกว่าเกณฑ์ 0.80'
                }
            );

            // Labeling
            const _cols = [];

            for (let i = 0; i < count; i++)
            {
                _cols.push(
                    {
                        label: `${i + 1}`,
                        value: `${i}`,
                    }
                );
            }

            const fields =
                [
                    {
                        label: 'คน \\ ข้อ',
                        value: 'name',
                    },
                    ..._cols,
                    {
                        label: 'x',
                        value: 'x',
                    },
                    {
                        label: 'x^2',
                        value: 'xx',
                    },
                ];
            //////

            const file = `ตารางค่าความยากง่าย อำนาจจำแนก ค่าความเชื่อมั่น${sheetTitle?.title}_${group.name}.csv`;
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
                            <ScrollView fitParent={!empty} >
                                <Paper elevation={0}>
                                    <Table className="custom-table" >
                                        <TableHead>
                                            <TableRow selected={true} >
                                                <TableCell
                                                    padding="checkbox"
                                                    // width="80" 
                                                    style={{ width: 80 }}
                                                >
                                                    <TableColumnName
                                                        numeric={false}
                                                        label="คน \ ข้อ"
                                                    />
                                                </TableCell>

                                                {cols}

                                                <TableCell
                                                    align="right"
                                                    padding="checkbox"
                                                    // width="80"
                                                    style={{ minWidth: 65 }}
                                                >
                                                    <TableColumnName
                                                        numeric={true}
                                                        label={<strong>X</strong>}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                    padding="checkbox"
                                                    // width="80"
                                                    style={{ minWidth: 65 }}
                                                >
                                                    <TableColumnName
                                                        numeric={true}
                                                        label={<strong>X<sup>2</sup></strong>}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                items
                                                    .map((e, i) =>
                                                    {
                                                        const center = (i + 1) === Math.ceil(items.length / 2);

                                                        return (
                                                            <Row
                                                                key={`student-${i}`}
                                                                n={i + 1}
                                                                bg={center ? '#fafafa' : null}
                                                                count={count}
                                                                score={e.score}
                                                                items={e.items}
                                                            />
                                                        )
                                                    })
                                                    .filter(item => item)
                                            }
                                            <Row {...sigma} />
                                            <Row {...H} />
                                            <Row {...L} />
                                            <Row {...P} />
                                            <Row {...PText} />
                                            <Row {...Bi} />
                                            <Row {...BiText} />
                                            <Row {...SumText} />

                                            <TableRow style={{ backgroundColor: '#eefafa' }} >
                                                <TableCell colSpan={count + 1} padding="checkbox">
                                                    <Typography variant="body2" noWrap>
                                                        <strong>ค่าความเชื่อมั่นข้อสอบ (r)</strong>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" padding="checkbox">
                                                    <Typography variant="body2" noWrap>
                                                        <strong>{NumberUtil.prettify(parseInt(r * 100) / 100)}</strong>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" padding="checkbox">
                                                    <Typography variant="caption" style={{ padding: `8px 0` }}>
                                                        <strong>
                                                            {
                                                                r >= 0.8 ?
                                                                    'ข้อสอบมีค่าความเชื่อมั่นมากกว่าเกณฑ์ 0.80'
                                                                    :
                                                                    'ข้อสอบมีค่าความเชื่อมั่นน้อยกว่าเกณฑ์ 0.80'
                                                            }
                                                        </strong>
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
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
                                            label="ดาวน์​โหลดข้อมูลตาราง"
                                            onClick={handleDownloadTable}
                                        />
                                    </>
                                }
                            />
                        )
                    }
                />
            }
        </Fragment>
    )
}

export default Comp