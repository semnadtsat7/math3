import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import
{
  Typography,

  TableCell,
  TableRow,
} from '@material-ui/core'

import DateUtil from '../../../utils/DateTime'
import QueryUtil from '../../../utils/Query'
import NumberUtil from '../../../utils/NumberTS';

import ColumnLevel from '../../../components/Column.Level'

import CellProgress from '../../../components/Table/CellValue/Progress';

import { Quiz } from './listenSummary';
import { Sort } from './utils/Sorter';
import { Columns } from './utils/Column';

interface ClickableProps
{
  clickable?: any;
}

const Clickable = styled.div<ClickableProps>`
   
    padding: 16px 24px;

    ${props => props.clickable && `
        color: cornflowerblue;
        text-decoration: underline;
        
        cursor: pointer;

        &:hover
        {
            background: rgba(0,0,0, 0.05);
        }
    `}
`

interface Props
{
  row: number;

  columns: Columns;
  sort: Sort;

  sheetID: string;
  quiz: Quiz;
}

const Comp: React.FC<Props> = (
  {
    row,

    columns,
    sort,

    sheetID,
    quiz,
  }
) =>
{
  const history = useHistory();

  // const { _docId, title, order, level } = quiz
  // const { best, bestAt, play, hint, help, usageAvg, fetching } = summary
  const metrics = quiz.metrics || {};

  const clickable = metrics.play > 0;// && !!quiz.bestAt;

  // const [selected, setSelected] = useState('')
  const selected = useMemo(() => window.sessionStorage.getItem('student.charts.map.selected') || '', []);
  // const selectedStyle = { backgroundColor: selected === quiz._id ? `rgba(100, 149, 237, 0.08)` : undefined }

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
      // style={selectedStyle}
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
        // style={selectedStyle}
      >
        {quiz.order}
      </TableCell>
      <TableCell
        padding="none"
        className={sort.orderBy === 'order' ? `column-active-${sort.order}` : ''}
        // style={!!clickable ? { cursor: 'pointer', ...selectedStyle } : selectedStyle}
        style={clickable ? { cursor: 'pointer' } : undefined}
        onClick={e => 
        {
          const query = QueryUtil.parse(history.location.search)

          const path = history.location.pathname
          const href = `${path}?${QueryUtil.stringify({ ...query, sheetID, quizTitle: quiz.title, quizID: quiz._id })}`

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
      </TableCell>
      
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
            {NumberUtil.prettify(metrics.best || 0)} <small style={{ opacity: 0.8 }} >/ 3</small>
          </Typography>
          <CellProgress 
            value={NumberUtil.percentage(metrics.best, 3)}
          />
        </TableCell>
      }
      
      {
        columns.play &&
        <TableCell
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'play' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettify(metrics.play || 0)}
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
            {NumberUtil.prettify(metrics.hint || 0)}
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
            {NumberUtil.prettify(metrics.help || 0)}
          </Typography>
        </TableCell>
      }

      {
        columns.bestAt &&
        <TableCell
          align="right" 
          padding="checkbox"
        >
          {
            quiz.bestAt ?
              <Typography variant="caption" noWrap>
                {DateUtil.formatDate(quiz.bestAt, { monthType: 'short' })}
                <Typography component="small" variant="caption" noWrap>
                  {DateUtil.formatTime(quiz.bestAt)}
                </Typography>
              </Typography>
              :
              '-'
          }
        </TableCell>
      }
    </TableRow>
  )
}

export default Comp