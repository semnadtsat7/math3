import React, { createRef, useState, useContext } from 'react';

import
{
  Button,
  Upload,

  Dropdown,
  Menu,
  Modal,
  message,

  Icon,
} from 'antd';

import
{
  Paper,

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import CSV from '../../utils/CSV';
import Firebase from '../../utils/Firebase'

import { RootContext } from '../../root';
import Parent from '../../components/Parent';

import Header from '../students.ts.v1/Header';
import ScrollView from '../students.ts.v1/ScrollView';

import Flexbox from '../../components/Flexbox';
import Progress from '../../components/Progress';

import TableColumnName from '../../components/Table.Column.Name';
import TableSettings from '../../components/Table/Settings';

import Row from './Row';
import TableFilter from './Filter';

import ModalCreate from './Modal.Create'
import ModalDelete from './Modal.Delete'

import listenGroups from './listenGroups';

import * as Column from './utils/Column';

const LIMIT = 30;
const Comp: React.FC = () =>
{
  const parent = createRef<Parent>();
  const { spaceID } = useContext(RootContext);

  const [modal, setModal] = useState('');
  const [group, setGroup] = useState({});
  const [columns, setColumns] = useState(Column.load());

  const { view, filter, sort, setFilter, setSort } = listenGroups();
  const empty = view.groups.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

  async function handleImport (file: any)
  {
    const csv = await CSV.fromFile(file)
    const current = view.metrics.group;

    if (current + csv.length > LIMIT)
    {
      message.error(`พบข้อผิดพลาด จำนวนกลุ่มเรียนที่ต้องการเพิ่มรวมกับจำนวนปัจจุบันเกิน ${LIMIT} ห้อง`, 5)
      return;
    }

    const root = document.getElementById('root');

    if (root)
    {
      root?.classList.add('loading');
    }

    const m = Modal.info(
      {
        title: 'กำลังอัปโหลด',
        content: `0 / ${csv.length}`,
        zIndex: 10000,
        keyboard: false,
        okButtonProps:
        {
          style: { display: 'none' }
        },
      }
    )

    try
    {
      const teacher = spaceID;

      for (let i = 0; i < csv.length; i++)
      {
        m.update({ content: `${i + 1} / ${csv.length}` })

        const name = csv[i].name

        await Firebase.functions().httpsCallable('teacher-group-create')({ teacher, name })
      }

      message.success('สร้างกลุ่มเรียนใหม่เรียบร้อยแล้ว', 3)
    }
    catch (err)
    {
      console.log(err)
      message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
    }

    if (root)
    {
      root?.classList.remove('loading');
    }

    m.destroy()
  }

  function handleImportRequest ({ file, onSuccess }: any)
  {
    handleImport(file).then(() =>
    {
      onSuccess([]);
    })
  }

  function handleColumns (value: Column.Columns)
  {
    Column.set(value);
    setColumns(value);
  }

  return (
    <Parent ref={parent} >
      <Header
        onMenuClick={() => parent?.current?.toggleMenu()}
        title={
          <>
            กลุ่มเรียนทั้งหมด
            {
              view.fetching !== 'full' &&
              <span style={{ marginLeft: 4 }} >
                ({view.metrics.group} / {LIMIT} ห้อง)
              </span>
            }
            {
              view.fetching === 'partial' &&
              <span style={{ marginLeft: 12 }} >
                <Icon type="loading" />
              </span>
            }
          </>
        }
        actions={
          view.fetching === 'full' ? []
            :
            [
              (
                <Button
                  type="primary"
                  disabled={view.metrics.group >= LIMIT}
                  onClick={() => setModal('create')}
                >
                  เพิ่มกลุ่มเรียน
                </Button>
              ),
              (
                <Upload
                  accept=".csv"
                  showUploadList={false}
                  // action={handleImport}
                  // action={null}
                  customRequest={handleImportRequest}
                  disabled={view.metrics.group >= LIMIT}
                >
                  <Button
                    type="primary"
                    disabled={view.metrics.group >= LIMIT}
                  >
                    นำเข้าไฟล์ CSV
                  </Button>
                </Upload>
              ),
              (
                <Dropdown
                  trigger={['click']}
                  overlay={(
                    <Menu
                      onClick={e =>
                      {
                        if (e.key === 'download-csv')
                        {
                          window.open('https://bit.ly/cm-csv-room', '_blank');
                        }
                      }}
                    >
                      <Menu.Item key="download-csv" >
                        ดาวน์โหลดไฟล์ CSV ตัวอย่าง
                      </Menu.Item>
                    </Menu>
                  )}
                >
                  <Button
                    type="primary"
                    style={{ padding: '0 6px' }}
                  >
                    <Icon
                      type="more"
                    />
                  </Button>
                </Dropdown>
              )
            ]
        }
      />
      {
        view.fetching !== 'full' &&
        <TableFilter
          filter={filter}

          sheets={view.sheets}
          titles={view.titles}

          onChange={setFilter}
          
          extra={
            (
              <TableSettings 
                items={Column.COLUMN_FILTERABLES}
                value={columns}
                onChange={handleColumns}
              />
            )
          }
        />
      }
      {
        view.fetching === 'full' || (view.fetching === 'partial' && empty) ? <Progress />
          :
          empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีกลุ่มเรียน</p></Flexbox>
            :
            <ScrollView fitParent={!empty} >
              <Paper elevation={0}>
                <Table
                  className={`custom-table ${view.fetching === 'partial' ? `updating` : ``}`.trim()}
                // className={'custom-table'}
                >
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
                        padding="default"
                        style={{ minWidth: 160 }}
                      >
                        <TableColumnName
                          name="name"
                          label="ชื่อกลุ่มเรียน"
                          orderBy={orderBy}
                          order={orderDirection}
                          onSort={setSort}
                        />
                      </TableCell>

                      {
                        columns.student &&
                        <TableCell
                          align="right"
                          padding="checkbox"
                          style={{ width: 120 }}
                        >
                          <TableColumnName
                            numeric={true}
                            name="student"
                            label={
                              <>
                                <span>จำนวนนักเรียน</span>
                                <span>(คน)</span>
                              </>
                            }
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      }

                      {
                        columns.pass &&
                        <TableCell
                          // className={summary.updating ? `updating` : ``}
                          align="right"
                          padding="checkbox"
                          style={{ width: 80 }}
                        >
                          <TableColumnName
                            numeric={true}
                            name="pass"
                            label={
                              <>
                                <span>ด่านที่ผ่านโดยเฉลี่ย</span>
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
                          // className={summary.updating ? `updating` : ``}
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
                            label={
                              <>
                                <span>ทำข้อสอบโดยเฉลี่ย</span>
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

                      <TableCell
                        padding="checkbox"
                        style={{ width: 48 }}
                      >

                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      view.groups
                        .map((group, i) =>
                        {
                          // const sum = summary.map[group.id] || {}

                          return (
                            <Row
                              key={group._id}
                              row={i + 1}

                              columns={columns}
                              sort={sort}

                              group={group}
                              metrics={view.metrics}

                              onDelete={target =>
                              {
                                setGroup(target)
                                setModal('delete')
                              }}
                            />
                          )
                        })
                      // .filter(item => item)
                    }
                  </TableBody>
                </Table>
              </Paper>
            </ScrollView>
      }

      <ModalCreate
        spaceID={spaceID}

        open={modal === 'create'}
        onClose={() => setModal('')}
      />
      <ModalDelete
        spaceID={spaceID}
        group={group}

        open={modal === 'delete'}
        onClose={() => 
        {
          setModal('')
          setGroup({})
        }}
      />
    </Parent>
  );
}

export default Comp;