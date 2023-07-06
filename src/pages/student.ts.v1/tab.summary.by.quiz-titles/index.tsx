import React, { Fragment, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

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

  ListItem,
  ListItemText,

  IconButton,
} from '@material-ui/core'

import
{
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'

// import { RootContext } from '../../../root';
// import AppContext from '../../../AppContext'

import QueryUtil from '../../../utils/Query'

import Flexbox from '../../../components/Flexbox'
import Progress from '../../../components/Progress'

import TableColumnName from '../../../components/Table.Column.Name'
import TableSettings from '../../../components/Table/Settings';
import TableDownload from '../../../components/Table/Download';

import ScrollView from '../../students.ts.v1/ScrollView'

import Row from './Row'
import Filter from './Filter'

import listenSummary from './listenSummary';
import { ListenStudentResult } from '../listenStudent';

// import DownloadButton from '../DownloadButton';

import NumberUtil from '../../../utils/NumberTS';
import DateUtil from '../../../utils/DateTime';

import * as Column from './utils/Column';

interface Params
{
  studentId?: string;
}

interface Props
{
  student: ListenStudentResult;
}

const TabSummaryByQuizIDs: React.FC<Props> = (
  {
    student,
  }
) =>
{
  const history = useHistory();
  const match = useRouteMatch();

  const params = match.params as Params;

  // const { spaceID } = useContext(RootContext);
  const studentID = params.studentId || 'null';

  const query = QueryUtil.parse(history.location.search);
  const sheetID = (query.sheetID || 'null') as string;

  const { view, sort, setSort } = listenSummary({ studentID, sheetID });
  const empty = view.quizzes.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

  const [ columns, setColumns ] = useState (Column.load());

  function handleColumns (value: Column.Columns)
  {
    Column.set(value);
    setColumns(value);
  }

  async function handleDownload ()
  {
    try
    {
      const items = view.quizzes.map(
        quiz =>
        {
          const { title, order, metrics, updatedAt } = quiz;
          const played = metrics.play > 0 && updatedAt;
          
          return {
            title,
            order,
            best: metrics.best,
            play: metrics.play,
            pass: metrics.pass,
            hint: metrics.hint,
            help: metrics.help,
            quiz: metrics.quiz,
            usageAvg: NumberUtil.truncate(metrics.usageAvg, 1),
            updatedAt: played ? DateUtil.format(updatedAt, { monthType: 'short' }) : '-',
          };
        }
      );

      const fields =
        [
          {
            label: 'บทเรียนย่อย',
            value: 'title',
          },
          {
            label: 'ด่านทั้งหมด',
            value: 'quiz',
          },
          {
            label: 'ด่านที่ผ่าน (ด่าน)',
            value: 'pass',
          },
          {
            label: 'คะแนนรวม (คะแนน)',
            value: 'best',
          },
          {
            label: 'ทำข้อสอบ (ครั้ง)',
            value: 'play',
          },
          {
            label: 'เวลาเฉลี่ยต่อข้อ (วินาที)',
            value: 'usageAvg',
          },
          {
            label: 'ใช้คำใบ้ (ครั้ง)',
            value: 'hint',
          },
          {
            label: 'ใช้ตัวช่วย (ครั้ง)',
            value: 'help',
          },
          {
            label: 'ทำข้อสอบล่าสุด',
            value: 'updatedAt',
          },
        ];

      const file = `สรุปคะแนนแต่ละบทเรียนย่อยของ${view.sheet.title}_${student.name}.csv`;
      const csv = new J2C.Parser ({ withBOM: true, fields }).parse (items);

      JFile (csv, file, 'text/csv');

      message.success('ดาวน์โหลดสถิติของนักเรียนเรียบร้อยแล้ว', 3)
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
          empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อมูลการทำข้อสอบ</p></Flexbox>
            :
            <Fragment>
              <ListItem
                divider={true}
                disableGutters={true}
                style={{ padding: `0 12px` }}
              >
                <IconButton
                  onClick={e =>
                  {
                    const path = history.location.pathname
                    const href = `${path}?${QueryUtil.stringify({ ...query, sheetID: '' })}`

                    window.sessionStorage.removeItem('student-summary-quiz-title.selected')

                    history.push(href)
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <ListItemText
                  primary={view.sheet.title}
                  style={{ padding: 8 }}
                />
              </ListItem>
              <ScrollView fitParent={!empty} >
                <Paper elevation={0}>
                  <Table className={`custom-table ${view.fetching === 'partial' ? `updating` : ``}`.trim()} >
                    <TableHead>
                      <TableRow selected={true} >
                        <TableCell
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
                          padding="dense"
                          style={{ 
                            minWidth: 180,
                          }}
                        >
                          <TableColumnName
                            label="บทเรียนย่อย"
                            name="order"
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                        
                        {
                          columns.pass &&
                          <TableCell
                            align="right"
                            padding="checkbox"
                            style={{ width: 120 }}
                          >
                            <TableColumnName
                              numeric={true}
                              label={
                                <>
                                  <span>ด่านที่ผ่าน</span>
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
                            align="right" 
                            padding="checkbox" 
                            style={{ width: 80 }}
                            // width={80} 
                          >
                            <TableColumnName
                              numeric={true}
                              label={
                                <>
                                  <span>คะแนนรวม</span>
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
                            align="right" 
                            padding="checkbox" 
                            style={{ width: 100 }}
                            // width={80} 
                          >
                            <TableColumnName
                              numeric={true}
                              label={
                                <>
                                  <span>ทำข้อสอบ</span>
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
                                  <span>ใช้คำใบ้</span>
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
                            align="right" 
                            padding="checkbox" 
                            style={{ width: 80 }}
                            // width="80"
                          >
                            <TableColumnName
                              numeric={true}
                              name="help"
                              label={
                                <>
                                  <span>ใช้ตัวช่วย</span>
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
                          align="right" 
                          padding="checkbox" 
                          style={{ width: 140 }}
                          // width={140} 
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        view.quizzes
                          .map((quiz, i) =>
                          {
                            return (
                              <Row
                                key={quiz.title}
                                row={i + 1}
                                columns={columns}
                                sort={sort}
                                quiz={quiz}
                                sheetID={sheetID}
                              />
                            )
                          })
                      }
                    </TableBody>
                  </Table>
                </Paper>
              </ScrollView>
            </Fragment>
      }

      {
        view.fetching === 'full' ? null
          :
          <Filter
            extra={
              (
                <TableSettings 
                  items={Column.COLUMN_FILTERABLES}
                  value={columns}
                  onChange={handleColumns}
                  footer={
                    student.fetching !== 'full' &&
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
        disabled={view.fetching === 'full' || student.fetching === 'full'}
        onClick={handleDownload}
      /> */}
    </Fragment>
  )
}

export default TabSummaryByQuizIDs