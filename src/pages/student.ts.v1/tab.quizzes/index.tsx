import React, { Fragment, useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

import styled from 'styled-components';

import
{
  Icon,
  Modal,

  Checkbox,
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

import TableColumnName from '../../../components/Table.Column.Name'

import ScrollView from '../../students.ts.v1/ScrollView'

import Row from './Row'
import Filter from './Filter'

import QuizView from './Quiz';

import listenSheet from './listenSheet';

const Action = styled.div`
    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`

interface Params
{
  studentId?: string;
}

const TabQuizzes: React.FC = () =>
{
  const match = useRouteMatch();

  const params = match.params as Params;

  const { spaceID } = useContext(RootContext);
  const studentID = params.studentId || 'null';

  const [quizID, setQuizID] = useState('');

  const { view, filter, sort, setFilter, setSort } = listenSheet({ studentID });
  const empty = view.quizzes.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === 'asc' ? 'desc' : 'asc';

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
    const student = studentID;

    const data = { teacher, map, sheet, student }

    await Firebase.functions().httpsCallable('teacher-student-sheet-add')(data)
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
    const student = studentID;

    const data = { teacher, map, sheet, student }

    await Firebase.functions().httpsCallable('teacher-student-sheet-remove')(data)
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
    const student = studentID;

    const data = { teacher, map, sheet, student };

    await Firebase.functions().httpsCallable('teacher-student-sheet-add')(data);
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
    const student = studentID;

    const data = { teacher, map, sheet, student };

    await Firebase.functions().httpsCallable('teacher-student-sheet-remove')(data);
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
                        // width="80" 
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        view.quizzes.map(
                          (quiz) =>
                          {
                            return (
                              <Row
                                key={quiz._id}
                                quiz={quiz}

                                onAdd={handleAdd}
                                onRemove={handleRemove}

                                onOpen={handleOpen}
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