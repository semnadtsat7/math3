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

// import AppContext from '../../../AppContext'

import QueryUtil from '../../../utils/Query'

import Flexbox from '../../../components/Flexbox'
import Progress from '../../../components/Progress'

import TableColumnName from '../../../components/Table.Column.Name'
import TableSettings from '../../../components/Table/Settings';
import TableDownload from '../../../components/Table/Download';

import ScrollView from '../../students.ts.v1/ScrollView';

import Row from './Row';
import Filter from './Filter';

import QuizView from '../../student.ts.v1/tab.quizzes/Quiz';

import listenSummary from './listenSummary';
import { ListenGroupResult } from '../listenGroup';

// import DownloadButton from '../../student.ts.v1/DownloadButton';

import NumberUtil from '../../../utils/NumberTS';
import DateUtil from '../../../utils/DateTime';

import * as Column from './utils/Column';

interface Params
{
  groupId?: string;
}

interface Props
{
  group: ListenGroupResult;

  onTabChange (tab: string): void;
}

const TabSummaryByQuizzes: React.FC<Props> = (
  {
    group,
    onTabChange,
  }
) =>
{
  const history = useHistory();
  const match = useRouteMatch();

  const params = match.params as Params;

  const groupID = params.groupId || 'null';

  const query = QueryUtil.parse(history.location.search);
  const sheetID = (query.sheetID || 'null') as string;
  const quizTitle = (query.quizTitle || 'null') as string;

  // const group = match.params.groupId || 'null'
  // const sheet = query.map || 'null';

  const { view, filter, sort, setFilter, setSort } = listenSummary({ groupID, sheetID, title: quizTitle });
  const empty = view.quizzes.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

  const [columns, setColumns] = useState(Column.load());
  const [quizID, setQuizID] = useState('');

  function handleColumns (value: Column.Columns)
  {
    Column.set(value);
    setColumns(value);
  }

  function handleOpen (quizID: string)
  {
    setQuizID(quizID);
  }

  function handleClose ()
  {
    setQuizID('');
  }

  function handleDownload ()
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
            best: NumberUtil.truncate(metrics.best, 1),
            play: NumberUtil.truncate(metrics.play, 1),
            playDistinct: NumberUtil.truncate(metrics.playDistinct, 1),
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
            label: 'ชุดที่',
            value: 'order',
          },
          {
            label: 'บทเรียนย่อย',
            value: 'title',
          },
          {
            label: 'คะแนนโดยเฉลี่ย (คะแนน)',
            value: 'best',
          },
          {
            label: 'ทำข้อสอบแล้ว (คน)',
            value: 'playDistinct',
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

      const file = `สรุปคะแนนแต่ละชุดของ${view.sheet.title}_${group.name}.csv`;
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
                    const href = `${path}?${QueryUtil.stringify({ ...query, quizTitle: '' })}`

                    window.sessionStorage.removeItem('student.charts.map.selected')

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
                          align="right"
                          padding="checkbox"
                          style={{ width: 80 }}
                        // width="80" 
                        >
                          <TableColumnName
                            label="ชุดที่"
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
                          columns.level &&
                          <TableCell
                            align="right"
                            padding="checkbox"
                            style={{ width: 100 }}
                          // width="100" 
                          >
                            <TableColumnName
                              numeric={true}
                              label="ระดับ"
                              name="level"
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
                          columns.playDistinct &&
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
                                  <span>ทำข้อสอบแล้ว</span>
                                  <span>(คน)</span>
                                </>
                              }
                              name="playDistinct"
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
                            style={{ width: 80 }}
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
                                key={quiz._id + '-' + quiz.order}
                                row={i + 1}
                                columns={columns}
                                sort={sort}
                                quiz={quiz}
                                sheetID={sheetID}

                                total={view.total}

                                onOpen={handleOpen}
                                onTabChange={onTabChange}
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
            filter={filter}
            // titles={view.titles}
            levels={view.levels}
            onChange={setFilter}

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
      {
        view.fetching !== 'full' &&
        <QuizView 
          quizID={quizID}
          onClose={handleClose}
        />
      }
      {/* <DownloadButton
        disabled={view.fetching === 'full' || group.fetching === 'full'}
        onClick={handleDownload}
      /> */}
    </Fragment>
  )
}

export default TabSummaryByQuizzes