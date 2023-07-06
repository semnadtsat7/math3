import React, { useEffect, useMemo } from 'react';
// import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import
{
  Typography,

  TableCell,
  TableRow,
} from '@material-ui/core'

import DateUtil from '../../../utils/DateTime'
import NumberUtil from '../../../utils/NumberTS';

import ColumnLevel from '../../../components/Column.Level';
import ClickableCell from '../../../components/Table/Cell/Clickable';

import CellProgress from '../../../components/Table/CellValue/Progress';

import * as StudentFilter from '../tab.students/utils/Filter';
import * as StudentSorter from '../tab.students/utils/Sorter';

import { Quiz } from './listenSummary';
import { Sort } from './utils/Sorter';
import { Columns } from './utils/Column';

const PlayCell = styled(TableCell)`
  cursor: pointer;

  [data-clickable = true]
  {
    color: cornflowerblue;
    text-decoration: underline;
  }
  
  &:hover
  {
    text-decoration: underline;
    background: rgba(0,0,0, 0.05);
  }
`;

interface Props
{
  row: number;

  columns: Columns;
  sort: Sort;

  sheetID: string;
  quiz: Quiz;

  total:
  {
    student: number;
  };

  onOpen (quizID: string): void;

  onTabChange (tab: string): void;
}

const Comp: React.FC<Props> = (
  {
    row,

    columns,
    sort,

    sheetID,
    quiz,

    total,

    onOpen,
    onTabChange,
  }
) =>
{
  // const history = useHistory();

  // const { _docId, title, order, level } = quiz
  // const { best, bestAt, play, hint, help, usageAvg, fetching } = summary
  const metrics = quiz.metrics || {};

  // const clickable = metrics.play > 0 && !!quiz.bestAt;

  const selected = useMemo(() => window.sessionStorage.getItem('student.charts.map.selected'), []);
  // const [selected, setSelected] = useState('')
  // const selectedStyle = { backgroundColor: selected === quiz._id ? `rgba(100, 149, 237, 0.08)` : `unset` }

  function handleMount ()
  {
    // setSelected(window.sessionStorage.getItem('student.charts.map.selected') || '')
    window.sessionStorage.removeItem('student.charts.map.selected')
  }

  useEffect(handleMount, [])

  return (
    <TableRow
      hover={true}
      selected={selected === quiz._id}
    >
      <TableCell
        align="right"
        padding="checkbox"
        className="column-row-number"
      >
        <Typography>
          {NumberUtil.prettify(row)}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        padding="checkbox"
      >
        {quiz.order}
      </TableCell>
      {/* <TableCell
        padding="dense"
        className={sort.orderBy === 'order' ? `column-active-${sort.order}` : ''}
      >
        {quiz.title}
      </TableCell> */}
      <ClickableCell
        padding="dense"
        className={sort.orderBy === 'order' ? `column-active-${sort.order}` : ''}
        onClick={() => onOpen(quiz._id)}
      >
        {quiz.title}
      </ClickableCell>
      {/* <TableCell
        padding="none"

        style={!!clickable ? { cursor: 'pointer', ...selectedStyle } : selectedStyle}
        onClick={e => 
        {
          const query = QueryUtil.parse(history.location.search)

          const path = history.location.pathname
          const href = `${path}?${QueryUtil.stringify({ ...query, map: sheetID, sheet: quiz._id })}`

          if (!!clickable)
          {
            window.sessionStorage.setItem('student.charts.map.selected', quiz._id);
            history.push(href)
          }
        }}
      >
        <Clickable clickable={!!clickable} >
          {quiz.title}
        </Clickable>
      </TableCell> */}
      
      {
        columns.level &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'level' ? `column-active-${sort.order}` : ''}
        >
          <ColumnLevel level={quiz.level} />
        </TableCell>
      }

      {
        columns.best &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'best' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettifyF(metrics.best || 0, 1)} <small style={{ opacity: 0.8 }} >/ 3</small>
          </Typography>
          <CellProgress 
            value={NumberUtil.percentage(metrics.best, 3)}
          />
        </TableCell>
      }

      {
        columns.playDistinct ?
          metrics?.play > 0 ?
            <PlayCell
              padding="checkbox"
              align="right"
              className={sort.orderBy === 'play' ? `column-active-${sort.order}` : ''}
              style={{ color: 'unset', textDecoration: 'none' }}
              onClick={() => 
              {
                const filter = StudentFilter.load();
                
                filter.sheetID = sheetID;
                filter.quizID = quiz._id;
                filter.title = quiz.title;

                StudentFilter.set(filter);
                StudentSorter.set('best', 'desc');
  
                onTabChange('students');
              }}
            >
              <Typography>
                <span data-clickable="true" >{NumberUtil.prettify(metrics.playDistinct || 0)}</span> <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(total.student || 0)}</small>
              </Typography>
              <CellProgress
                value={NumberUtil.percentage(metrics.playDistinct, total.student)}
              />
            </PlayCell>
          :
          <TableCell 
            align="right" 
            padding="checkbox"
            className={sort.orderBy === 'play' ? `column-active-${sort.order}` : ''}
          >
            <Typography>
              {NumberUtil.prettify(metrics.playDistinct || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(total.student || 0)}</small>
            </Typography>
            <CellProgress
              value={NumberUtil.percentage(metrics.playDistinct, total.student)}
            />
          </TableCell>
        :
        null
        // <TableCell 
        //   align="right" 
        //   padding="checkbox"
        //   className={sort.orderBy === 'playDistinct' ? `column-active-${sort.order}` : ''}
        // >
        //   <Typography>
        //     {NumberUtil.prettifyF(metrics.playDistinct || 0, 1)} <small style={{ opacity: 0.8 }} >/ {NumberUtil.prettify(total.student)}</small>
        //   </Typography>
        //   <CellProgress 
        //     value={NumberUtil.percentage(metrics.playDistinct, total.student)}
        //   />
        // </TableCell>
      }


      {
        columns.play &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'play' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettifyF(metrics.play || 0, 1)}
          </Typography>
        </TableCell>
      }


      {
        columns.usageAvg &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'usageAvg' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettifyF(metrics.usageAvg || 0, 1)}
          </Typography>
        </TableCell>
      }

      {
        columns.hint &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'hint' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettifyF(metrics.hint || 0, 1)}
          </Typography>
        </TableCell>
      }
      
      {
        columns.help &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'help' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettifyF(metrics.help || 0, 1)}
          </Typography>
        </TableCell>
      }

      {
        columns.updatedAt &&
        <TableCell
          align="right" 
          padding="checkbox"
        >
          {
            quiz.updatedAt ?
              <React.Fragment>
                <Typography variant="caption" noWrap>
                  {DateUtil.formatDate(quiz.updatedAt, { monthType: 'short' })}
                  <Typography component="small" variant="caption" noWrap>
                    {DateUtil.formatTime(quiz.updatedAt)}
                  </Typography>
                </Typography>
              </React.Fragment>
              :
              '-'
          }
        </TableCell>
      }
    </TableRow>
  )
}

export default Comp