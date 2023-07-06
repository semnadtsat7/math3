import React, { Fragment, useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

import styled from 'styled-components';

import JFile from 'js-file-download';
import * as J2C from 'json2csv';

import
{
  Icon,
  Modal,

  Checkbox,

  message,
} from 'antd';

import
{
  Paper,

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { RootContext } from '../../../root';
// import AppContext from '../../../AppContext'

import Firebase from '../../../utils/Firebase'

import Flexbox from '../../../components/Flexbox'
import Progress from '../../../components/Progress'

import TableColumnName from '../../../components/Table.Column.Name';
import TableSettings from '../../../components/Table/Settings';
import TableDownload from '../../../components/Table/Download';

import ScrollView from '../../students.ts.v1/ScrollView';

import Row from './Row'
import Filter from './Filter'

import QuizView from '../../student.ts.v1/tab.quizzes/Quiz';

import listenSheet from './listenSheet';
import { ListenGroupResult } from '../listenGroup';

import NumberUtil from '../../../utils/NumberTS';

import * as Column from './utils/Column';

const Action = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`

interface Params
{
  groupId?: string;
}

interface Props
{
  group: ListenGroupResult;
  onTabChange(tab: string): void;
}

const TabQuizzes: React.FC<Props> = (
  {
    group,
    onTabChange,
  }
) =>
{
  const match = useRouteMatch();

  const params = match.params as Params;

  const { spaceID } = useContext(RootContext);
  const groupID = params.groupId || 'null';

  const [columns, setColumns] = useState(Column.load());
  const [quizID, setQuizID] = useState('');

  const { view, filter, sort, setFilter, setSort } = listenSheet({ groupID });
  const empty = view.quizzes.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

  function handleColumns (value: Column.Columns)
  {
    Column.set(value);
    setColumns(value);
  }

  async function handleAdd (quiz: string)
  {
    const root = document.getElementById('root');

    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังปลดล็อค',
        content: 'กรุณารอสักครู่',
        icon: <Icon type="loading" />,
        zIndex: 10000,
        keyboard: false,
        okButtonProps:
        {
          style: { display: 'none' }
        },
      }
    );

    const teacher = spaceID;
    const map = filter.sheetID;
    const sheet = quiz;
    const group = groupID;

    const data = { teacher, map, sheet, group }

    await Firebase.functions().httpsCallable('teacher-group-sheet-quiz-add')(data)
    await new Promise(r => setTimeout(r, 1000));

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
  }

  async function handleRemove (quiz: string)
  {
    const root = document.getElementById('root');

    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังล็อค',
        content: 'กรุณารอสักครู่',
        icon: <Icon type="loading" />,
        zIndex: 10000,
        keyboard: false,
        okButtonProps:
        {
          style: { display: 'none' }
        },
      }
    );

    const teacher = spaceID;
    const map = filter.sheetID;
    const sheet = quiz;
    const group = groupID;

    const data = { teacher, map, sheet, group }

    await Firebase.functions().httpsCallable('teacher-group-sheet-quiz-remove')(data)
    await new Promise(r => setTimeout(r, 1000));

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
  }

  async function handleAddAll ()
  {
    const root = document.getElementById('root');

    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังปลดล็อคทั้งหมด',
        content: 'กรุณารอสักครู่',
        icon: <Icon type="loading" />,
        zIndex: 10000,
        keyboard: false,
        okButtonProps:
        {
          style: { display: 'none' }
        },
      }
    );

    const teacher = spaceID;
    const map = filter.sheetID;
    const sheet = view.quizzes.map(e => e._id);
    const group = groupID;

    const data = { teacher, map, sheet, group };

    await Firebase.functions().httpsCallable('teacher-group-sheet-quiz-add')(data);
    await new Promise(r => setTimeout(r, 1000));

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
  }

  async function handleRemoveAll ()
  {
    const root = document.getElementById('root');

    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังล็อคทั้งหมด',
        content: 'กรุณารอสักครู่',
        icon: <Icon type="loading" />,
        zIndex: 10000,
        keyboard: false,
        okButtonProps:
        {
          style: { display: 'none' }
        },
      }
    );

    const teacher = spaceID;
    const map = filter.sheetID;
    const sheet = view.quizzes.map(e => e._id);
    const group = groupID;

    const data = { teacher, map, sheet, group };

    await Firebase.functions().httpsCallable('teacher-group-sheet-quiz-remove')(data);
    await new Promise(r => setTimeout(r, 1000));

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
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
      const sheetID = filter.sheetID;
      const sheetTitle = view.sheets.filter(e => e._id === sheetID)[0];

      const items = view.quizzes.map(
        quiz =>
        {
          const { title, order, metrics } = quiz;

          return {
            title,
            order,
            play: NumberUtil.truncate(metrics.play, 1),
            pass: NumberUtil.truncate(metrics.pass, 1),
            hint: NumberUtil.truncate(metrics.hint, 1),
            help: NumberUtil.truncate(metrics.help, 1),
            best: NumberUtil.truncate(metrics.best, 1),
            student: NumberUtil.truncate(metrics.student, 1),
            // scoreAvg: NumberUtil.truncate(metrics.scoreAvg, 1),
            usageAvg: NumberUtil.truncate(metrics.usageAvg, 1),
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
            value: 'play',
          },
          {
            label: 'นักเรียนทั้งหมด (คน)',
            value: 'student',
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
        ];

      const file = `ตารางสถิติแต่ละชุดของ${sheetTitle?.title}_${group.name}.csv`;
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
          empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีข้อมูลบทเรียน</p></Flexbox>
            :
            <Fragment>
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
                          padding="checkbox"
                          style={{ minWidth: 64, width: 64 }}
                        >
                          <Action>
                            {
                              view.activeAll ?
                                <Checkbox
                                  checked={view.activeAll}
                                  onChange={() => handleRemoveAll()}
                                />
                                :
                                <Checkbox
                                  checked={view.activeAll}
                                  onChange={() => handleAddAll()}
                                />
                            }
                          </Action>
                        </TableCell>
                        <TableCell
                          align="right" 
                          padding="checkbox"
                          style={{ width: 80 }}
                        >
                          <TableColumnName
                            label="ชุดที่"
                          />
                        </TableCell>

                        <TableCell padding="dense">
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
                          >
                            <TableColumnName
                              numeric={true}
                              name="best"
                              label={
                                <>
                                  <span>คะแนนรวมโดยเฉลี่ย</span>
                                  <span>(คะแนน)</span>
                                </>
                              }
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
                          >
                            <TableColumnName
                              numeric={true}
                              name="play"
                              label={<>ทำข้อสอบแล้ว<span>(คน)</span></>}
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        view.quizzes.map(
                          (quiz, i) =>
                          {
                            return (
                              <Row
                                key={quiz._id}
                                row={i + 1}

                                columns={columns}
                                sort={sort}

                                sheetID={filter.sheetID}

                                quiz={quiz}

                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                onOpen={handleOpen}

                                onTabChange={onTabChange}
                              />
                            )
                          }
                        )
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
            sheets={view.sheets}
            titles={view.titles}
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
    </Fragment>
  )
}

export default TabQuizzes