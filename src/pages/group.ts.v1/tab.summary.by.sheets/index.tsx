import React, { Fragment, useState, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom';

import JFile from 'js-file-download';
import * as J2C from 'json2csv';

import { message } from 'antd';

import
{
  Paper,

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

// import { RootContext } from '../../../root';
// import AppContext from '../../../AppContext'

import Flexbox from '../../../components/Flexbox'
import Progress from '../../../components/Progress'

import TableColumnName from '../../../components/Table.Column.Name'
import TableSettings from '../../../components/Table/Settings';
import TableDownload from '../../../components/Table/Download';

// import ScrollView from '../../students.ts.v1/ScrollView'
import ScrollView from '../../students.ts.v1/ScrollView';

import Row from './Row'
import Footer from './Footer'

import listenSummary from './listenSummary';
import { ListenGroupResult } from '../listenGroup';

// import DownloadButton from '../../student.ts.v1/DownloadButton';

import NumberUtil from '../../../utils/NumberTS';
import DateUtil from '../../../utils/DateTime';

import ObjectUtil from '../../../utils/Object';

import * as Column from './utils/Column';

interface Params
{
  groupId?: string;
}

interface ColumnsAction
{
  columns: number[];
}

function reduceColumns (prev: number[], payload: ColumnsAction)
{
  if (ObjectUtil.changeds(prev, payload.columns).length > 0)
  {
    // console.log(ObjectUtil.changeds(prev, payload.columns));
    return payload.columns;
  }

  return prev;
}

const DEFAULT_COLUMNS: number[] = [];

function useColumns ()
{
  // const [columns, setColumns] = useState<number[]>([]);
  // const [result, setResult] = useState<number[]>([]);
  const [columns, dispatch] = useReducer(reduceColumns, DEFAULT_COLUMNS);

  function handleResize ()
  {
    const scroll = document.getElementById('scroll-table')

    if (!!scroll)
    {
      const col00 = (document.getElementById('column-row-number')?.clientWidth ?? 0) + 1;
      const col01 = (document.getElementById('column-name')?.clientWidth ?? 0) + 1;

      const nColumns: number[] =
        [
          scroll.offsetWidth - scroll.scrollWidth,

          // col00 + col01,
          col00,
          col01,

          (document.getElementById('column-pass')?.clientWidth ?? 0) + 1,
          (document.getElementById('column-score')?.clientWidth ?? 0) + 1,
          (document.getElementById('column-play')?.clientWidth ?? 0) + 1,
          (document.getElementById('column-usageAvg')?.clientWidth ?? 0) + 1,
          (document.getElementById('column-hint')?.clientWidth ?? 0) + 1,
          (document.getElementById('column-help')?.clientWidth ?? 0) + 1,
          // document.getElementById ('column-open').clientWidth + 1,
          (document.getElementById('column-time')?.clientWidth ?? 0)// + 1,
          // (document.getElementById('column-action')?.clientWidth ?? 0),
        ]

      dispatch({ columns: nColumns });
      // setColumns(nColumns);
    }
  }

  function handleMount ()
  {
    const i = setInterval(handleResize, 1000, 0)

    window.addEventListener('resize', handleResize, { capture: false, passive: true })

    return function ()
    {
      window.removeEventListener('resize', handleResize, { capture: false })
      clearInterval(i)
    }
  }

  useEffect(handleMount, []);
 
  return columns;
}

interface Props
{
  group: ListenGroupResult;
}

const TabSummaryBySheets: React.FC<Props> = (
  {
    group,
  }
) =>
{
  const params = useParams() as Params;
  const groupID = params.groupId || 'null'

  const { view, sort, setSort } = listenSummary({ groupID });
  const empty = view.sheets.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

  const widths = useColumns();

  const [ columns, setColumns ] = useState (Column.load());

  function handleScroll (e: any)
  {
    const footer = document.getElementById('scroll-footer')

    if (!!footer)
    {
      footer.scrollLeft = e.target.scrollLeft
    }
  }

  function handleColumns (value: Column.Columns)
  {
    Column.set(value);
    setColumns(value);
  }

  function handleDownload ()
  {
    try
    {
      const items = view.sheets.map(
        sheet =>
        {
          const { title, metrics, updatedAt } = sheet;
          const played = metrics.play > 0 && updatedAt;
          
          return {
            title,
            best: NumberUtil.truncate(metrics.best, 1),
            play: NumberUtil.truncate(metrics.play, 1),
            pass: NumberUtil.truncate(metrics.pass, 1),
            quiz: NumberUtil.truncate(metrics.quiz, 1),
            hint: NumberUtil.truncate(metrics.hint, 1),
            help: NumberUtil.truncate(metrics.help, 1),
            usageAvg: NumberUtil.truncate(metrics.usageAvg, 1),
            updatedAt: played ? DateUtil.format(updatedAt, { monthType: 'short' }) : '-',
          };
        }
      );

      const fields =
        [
          {
            label: 'บทเรียน',
            value: 'title',
          },
          {
            label: 'ด่านทั้งหมด',
            value: 'quiz',
          },
          {
            label: 'ด่านที่ผ่านโดยเฉลี่ย (ด่าน)',
            value: 'pass',
          },
          {
            label: 'คะแนนรวมโดยเฉลี่ย (คะแนน)',
            value: 'best',
          },
          {
            label: 'ทำข้อสอบโดยเฉลี่ย (ครั้ง)',
            value: 'play',
          },
          {
            label: 'เวลาเฉลี่ยต่อข้อ (วินาที)',
            value: 'usageAvg',
          },
          {
            label: 'ใช้คำใบ้โดยเฉลี่ย (ครั้ง)',
            value: 'hint',
          },
          {
            label: 'ใช้ตัวช่วยโดยเฉลี่ย (ครั้ง)',
            value: 'help',
          },
          {
            label: 'ทำข้อสอบล่าสุด',
            value: 'updatedAt',
          },
        ];

      const file = `สรุปคะแนนแต่ละบทเรียน_${group.name}.csv`;
      const csv = new J2C.Parser ({ withBOM: true, fields }).parse (items);

      JFile (csv, file, 'text/csv');

      message.success('ดาวน์โหลดข้อมูลสำเร็จ', 3)
    }
    catch (err)
    {
      console.log(err)
      message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
    }
  }

  return (
    <Fragment>
      {
        view.fetching === 'full' || (view.fetching === 'partial' && empty) ? <Progress />
          :
          empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อมูลบทเรียน</p></Flexbox>
            :
            <ScrollView
              // ref={ref}
              id="scroll-table"
              fitParent={!empty}
              onScroll={handleScroll}
            >
              <Paper elevation={0}>
                <Table className={`custom-table ${view.fetching === 'partial' ? `updating` : ``}`.trim()} >
                  <TableHead>
                    <TableRow selected={true} >
                      <TableCell
                        id="column-row-number"
                        align="right"
                        padding="checkbox"
                        style={{ 
                          minWidth: 52,
                          width: 52,
                        }}
                      >
                        <TableColumnName
                          numeric={true}
                          label="#"
                        />
                      </TableCell>

                      <TableCell
                        id="column-name"
                        padding="dense"
                        style={{ 
                          minWidth: 180,
                        }}
                      >
                        <TableColumnName
                          label="บทเรียน"
                          name="order"
                          orderBy={orderBy}
                          order={orderDirection}
                          onSort={setSort}
                        />
                      </TableCell>
                      
                      {
                        columns.pass &&
                        <TableCell
                          id="column-pass"
                          align="right"
                          padding="checkbox"
                          style={{ width: 120 }}
                          // width={80}
                        >
                          <TableColumnName
                            numeric={true}
                            label={
                              <>
                                <span>ด่านที่ผ่านโดยเฉลี่ย</span>
                                <span>(ด่าน)</span>
                              </>
                            }
                            name="pass"
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.best &&
                        <TableCell
                          id="column-score"
                          align="right"
                          padding="checkbox"
                          style={{ width: 80 }}
                          // width={80}
                        >
                          <TableColumnName
                            numeric={true}
                            label={
                              <>
                                <span>คะแนนรวมโดยเฉลี่ย</span>
                                <span>(คะแนน)</span>
                              </>
                            }
                            name="best"
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.play &&
                        <TableCell
                          id="column-play"
                          align="right"
                          padding="checkbox"
                          style={{ width: 100 }}
                          // width={80}
                        >
                          <TableColumnName
                            numeric={true}
                            label={
                              <>
                                <span>ทำข้อสอบโดยเฉลี่ย</span>
                                <span>(ครั้ง)</span>
                              </>
                            }
                            name="play"
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.usageAvg &&
                        <TableCell 
                          id="column-usageAvg" 
                          align="right" 
                          padding="checkbox"
                          style={{ width: 80 }}
                          // width="80"
                        >
                          <TableColumnName
                            numeric={true}
                            name="usageAvg"
                            label={
                              <>
                                <span>เวลาเฉลี่ยต่อข้อ</span>
                                <span>(วินาที)</span>
                              </>
                            }
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.hint &&
                        <TableCell 
                          id="column-hint" 
                          align="right" 
                          padding="checkbox" 
                          style={{ width: 80 }}
                          // width="80"
                        >
                          <TableColumnName
                            numeric={true}
                            name="hint"
                            label={
                              <>
                                <span>ใช้คำใบ้โดยเฉลี่ย</span>
                                <span>(ครั้ง)</span>
                              </>
                            }
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.help &&
                        <TableCell 
                          id="column-help" 
                          align="right" 
                          padding="checkbox" 
                          style={{ width: 100 }}
                          // width="80"
                        >
                          <TableColumnName
                            numeric={true}
                            name="help"
                            label={
                              <>
                                <span>ใช้ตัวช่วยโดยเฉลี่ย</span>
                                <span>(ครั้ง)</span>
                              </>
                            }
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.updatedAt &&
                        <TableCell
                          id="column-time"
                          align="right"
                          padding="checkbox"
                          style={{ width: 80 }}
                          // width={80}
                        >
                          <TableColumnName
                            numeric={true}
                            label={<>ทำข้อสอบล่าสุด</>}
                            name="updatedAt"
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {/* <TableCell
                        id="column-action"
                        padding="checkbox"
                        style={{ 
                          minWidth: 48,
                          width: 48 
                        }}
                      >

                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      view.sheets
                        .map((sheet, i) =>
                        {
                          return (
                            <Row
                              key={sheet._id}
                              row={i + 1}
                              columns={columns}
                              sort={sort}
                              sheet={sheet}
                            />
                          )
                        })
                    }
                  </TableBody>
                </Table>
              </Paper>
            </ScrollView>
      }
      {
        view.fetching === 'full' ? null
          :
          <Footer
            columns={columns}
            widths={widths}
            total={view.total}

            extra={
              (
                <TableSettings 
                  items={Column.COLUMN_FILTERABLES}
                  value={columns}
                  onChange={handleColumns}
                  footer={
                    group.fetching !== 'full' &&
                    <TableDownload 
                      onClick={handleDownload}
                    />
                  }
                />
              )
            }
          />
      }
      {/* <DownloadButton
        disabled={view.fetching === 'full' || group.fetching === 'full'}
        onClick={handleDownload}
      /> */}
    </Fragment>
  )
}

export default TabSummaryBySheets