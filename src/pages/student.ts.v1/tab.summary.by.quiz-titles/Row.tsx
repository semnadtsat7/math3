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

import CellProgress from '../../../components/Table/CellValue/Progress';

import { Quiz } from './listenSummary';
import { Sort } from './utils/Sorter';
import { Columns } from './utils/Column';

interface ClickableProps
{
  clickable?: any;
}

const Clickable = styled.div<ClickableProps>`
  padding: 8px 24px;

  display: grid;
  row-gap: 4px;

  span
  {
    display: block;
  }

  small
  {
    font-size: 0.9em;
    opacity: 0.84;
  }

  ${props => props.clickable && `
    
    span
    {
      display: block;

      color: cornflowerblue;
      text-decoration: underline;
      
      cursor: pointer;
    }

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
  const metrics = quiz.metrics || {};

  const clickable = metrics.play > 0 && !!quiz.updatedAt;

  const selected = useMemo(() => window.sessionStorage.getItem('student-summary-quiz-title.selected') || '', []);
  // const selectedStyle = { backgroundColor: selected === quiz.title ? `rgba(100, 149, 237, 0.08)` : `unset` }

  const orders = useMemo(() => quiz.orders?.map(e =>
    {
      if (e.length === 1)
      {
        return e[0];
      }

      return e[0] + ' - ' + e[e.length - 1];
    }).join(', '), [quiz.orders]);

  function handleMount ()
  {
    // setSelected(window.sessionStorage.getItem('student-summary-quiz-title.selected') || '')
    window.sessionStorage.removeItem('student-summary-quiz-title.selected');
  }

  useEffect(handleMount, [])

  return (
    <TableRow
      hover={true}
      selected={selected === quiz.title}
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
        padding="none"
        className={sort.orderBy === 'order' ? `column-active-${sort.order}` : ''}
        // style={!!clickable ? { cursor: 'pointer', ...selectedStyle } : selectedStyle}
        style={clickable ? { cursor: 'pointer' } : undefined}
        onClick={e => 
        {
          const query = QueryUtil.parse(history.location.search)

          const path = history.location.pathname
          const href = `${path}?${QueryUtil.stringify({ ...query, sheetID, quizTitle: quiz.title })}`

          if (!!clickable)
          {
            window.sessionStorage.setItem('student-summary-quiz-title.selected', quiz.title);
            history.push(href)
          }
        }}
      >
        <Clickable clickable={!!clickable} >
          <span>
            {quiz.title}
          </span>
          <small>
            ด่านที่ {orders}
          </small>
        </Clickable>
      </TableCell>
      
      {
        columns.pass &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'pass' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettify(metrics.pass || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(metrics.quiz || 0)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(metrics?.pass, metrics?.quiz)}
          />
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
            {NumberUtil.prettify(metrics.best || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify((metrics.quiz || 0) * 3)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(metrics?.best, (metrics?.quiz || 0) * 3)}
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
        columns.updatedAt &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'updatedAt' ? `column-active-${sort.order}` : ''}
        >
          {
            quiz.updatedAt ?
              <Typography variant="caption" noWrap>
                {DateUtil.formatDate(quiz.updatedAt, { monthType: 'short' })}
                <Typography component="small" variant="caption" noWrap>
                  {DateUtil.formatTime(quiz.updatedAt)}
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