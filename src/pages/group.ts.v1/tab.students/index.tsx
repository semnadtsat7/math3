import React, { Fragment, useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

import JFile from 'js-file-download';
import * as J2C from 'json2csv';

import
{
  Icon,
  Modal,

  message,

  // Checkbox,
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

import Firebase from '../../../utils/Firebase'

// import QueryUtil from '../../../utils/Query'

import Flexbox from '../../../components/Flexbox'
import Progress from '../../../components/Progress'

import TableColumnName from '../../../components/Table.Column.Name';
import TableSettings from '../../../components/Table/Settings';
import TableDownload from '../../../components/Table/Download';

// import ScrollView from '../../students.ts.v1/ScrollView'

import ScrollView from '../../students.ts.v1/ScrollView';

import Row from './Row'
import Filter from './Filter'

import listenStudents from './listenStudents';
import { ListenGroupResult } from '../listenGroup';

import NumberUtil from '../../../utils/NumberTS';
import DateUtil from '../../../utils/DateTime';

import * as Column from '../../students.ts.v1/utils/Column';

interface Params
{
  groupId?: string;
}

interface Props
{
  group: ListenGroupResult;
}

const Comp: React.FC<Props> = (
  {
    group,
  }
) =>
{
  const match = useRouteMatch();

  const params = match.params as Params;

  const { spaceID } = useContext(RootContext);
  const groupID = params.groupId || 'null';

  const [ columns, setColumns ] = useState (Column.load());
  
  const { view, filter, sort, setFilter, setSort } = listenStudents({ groupID });
  const empty = view.students.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

  async function handleAdd (student: string)
  {
    const root = document.getElementById('root');
    
    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังเพิ่มเข้ากลุ่มเรียน',
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

    const teacher = spaceID

    const students = [student]
    const data = { teacher, group: groupID, students }

    await Firebase.functions().httpsCallable('teacher-group-student-add')(data)
    await new Promise(r => setTimeout(r, 1000));

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
  }

  async function handleRemove (student: string)
  {
    const root = document.getElementById('root');
    
    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังนำออก',
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

    const students = [student]
    const data = { teacher, group: groupID, students }

    await Firebase.functions().httpsCallable('teacher-group-student-remove')(data)
    await new Promise(r => setTimeout(r, 1000));

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
  }

  function handleDownload ()
  {
    try
    {
      const items = view.students.map(
        student =>
        {
          const { customId, name, metrics, lastSignedInAt } = student;
          
          return {
            id: customId,
            name,
            best: NumberUtil.truncate(metrics.best, 1),
            play: NumberUtil.truncate(metrics.play, 1),
            pass: NumberUtil.truncate(metrics.pass, 1),
            hint: NumberUtil.truncate(metrics.hint, 1),
            help: NumberUtil.truncate(metrics.help, 1),
            quiz: NumberUtil.truncate(view.metrics.quiz, 1),
            usageAvg: NumberUtil.truncate(metrics.usageAvg, 1),
            lastSignedInAt: lastSignedInAt ? DateUtil.format(lastSignedInAt, { monthType: 'short' }) : '-',
          };
        }
      );

      const fields =
        [
          {
            label: 'รหัส',
            value: 'id',
          },
          {
            label: 'ชื่อ',
            value: 'name',
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
            label: 'เข้าสู่ระบบล่าสุด',
            value: 'lastSignedInAt',
          },
        ];

      const file = `สรุปคะแนนของนักเรียนแต่ละคน_${group.name}.csv`;
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

  function handleColumns (value: Column.Columns)
  {
    Column.set(value);
    setColumns(value);
  }

  return (
    <Fragment>
      {
        view.fetching === 'full' || (view.fetching === 'partial' && empty) ? <Progress />
          :
          empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีนักเรียน</p></Flexbox>
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
                          <TableColumnName
                            numeric={false}
                            label="เข้าร่วม"
                          />
                        </TableCell>
                        
                        {
                          columns.customId &&
                          <TableCell
                            align="right"
                            padding="checkbox"
                            style={{ width: 100 }}
                          >
                            <TableColumnName
                              numeric={true}
                              name="customId"
                              label="รหัสนักเรียน"
                              orderBy={orderBy}
                              order={orderDirection}
                              onSort={setSort}
                            />
                          </TableCell>
                        }

                        <TableCell
                          padding="default"
                          style={{ minWidth: 160 }}
                        >
                          <TableColumnName
                            name="name"
                            label="ชื่อ"
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
                            style={{ width: 80 }}
                          >
                            <TableColumnName
                              numeric={true}
                              name="pass"
                              label={
                                <>
                                  <span>ด่านที่ผ่าน</span>
                                  <span>(ด่าน)</span>
                                </>
                              }
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
                                  <span>คะแนนรวม</span>
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
                              label={
                                <>
                                  <span>ทำข้อสอบ</span>
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
                          columns.usageAvg &&
                          <TableCell
                            align="right"
                            padding="checkbox"
                            style={{ width: 120 }}
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

                        {
                          columns.lastSignedInAt &&
                          <TableCell
                            align="right"
                            padding="checkbox"
                            style={{ width: 40 }}
                          >
                            <TableColumnName
                              numeric={true}
                              name="lastSignedInAt"
                              label={<>เข้าสู่ระบบล่าสุด</>}
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
                        view.students
                          .map((student, i) =>
                          {
                            return (
                              <Row
                                key={student._id}
                                row={i + 1}

                                columns={columns}
                                sort={sort}

                                groupID={groupID}
                                student={student}
                                scope={filter.scope}
                                metrics={view.metrics}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
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

            sheets={view.sheets}
            titles={view.titles}
            scopes={view.scopes}
            orders={view.orders}

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
    </Fragment>
  )
}

export default Comp