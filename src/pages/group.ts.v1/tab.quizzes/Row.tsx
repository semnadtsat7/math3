import React from 'react';
import styled from 'styled-components';

import { Checkbox } from 'antd';

import
{
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';

import NumberUtil from '../../../utils/NumberTS';

import ColumnLevel from '../../../components/Column.Level';
import ClickableCell from '../../../components/Table/Cell/Clickable';

import CellProgress from '../../../components/Table/CellValue/Progress';

import * as StudentFilter from '../tab.students/utils/Filter';
import * as StudentSorter from '../tab.students/utils/Sorter';

import { Quiz } from './listenSheet';
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

const Action = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`

interface Props
{
  row: number;

  columns: Columns;
  sort: Sort;

  sheetID: string;

  quiz: Quiz;

  onAdd (quizID: string): void;
  onRemove (quizID: string): void;
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

    onAdd,
    onRemove,
    onOpen,

    onTabChange,
  }
) =>
{
  return (
    <TableRow
      hover={true}
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
      <TableCell padding="none">
        <Action>
          {
            quiz.active ?
              <Checkbox
                checked={quiz.active}
                onChange={() => onRemove(quiz._id)}
              />
              :
              <Checkbox
                checked={quiz.active}
                onChange={() => onAdd(quiz._id)}
              />
          }
        </Action>
      </TableCell>
      <TableCell
        align="right"
        padding="checkbox"
      >
        {quiz.order}
      </TableCell>

      <ClickableCell 
        padding="dense" 
        className={sort.orderBy === 'order' ? `column-active-${sort.order}` : ''}
        onClick={() => onOpen(quiz._id)}
      >
        <div style={{ padding: `8px 0` }} >
          {quiz.title}
        </div>
      </ClickableCell>
      
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
          {/* <Typography>
            {NumberUtil.prettifyF(quiz.metrics?.best || 0, 1)}
          </Typography> */}
          <Typography>
            {NumberUtil.prettifyF(quiz.metrics.best || 0, 1)} <small style={{ opacity: 0.8 }}>/ 3</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(quiz.metrics?.best, 3)}
          />
        </TableCell>
      }
      
      {
        columns.play ?
          quiz.metrics?.play > 0 ?
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
                <span data-clickable="true" >{NumberUtil.prettify(quiz.metrics?.play || 0)}</span> <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(quiz.metrics?.student || 0)}</small>
              </Typography>
              <CellProgress
                value={NumberUtil.percentage(quiz.metrics?.play, quiz.metrics?.student)}
              />
            </PlayCell>
          :
          <TableCell 
            align="right" 
            padding="checkbox"
            className={sort.orderBy === 'play' ? `column-active-${sort.order}` : ''}
          >
            <Typography>
              {NumberUtil.prettify(quiz.metrics?.play || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(quiz.metrics?.student || 0)}</small>
            </Typography>
            <CellProgress
              value={NumberUtil.percentage(quiz.metrics?.play, quiz.metrics?.student)}
            />
          </TableCell>
        :
        null
      }
      
      {
        columns.usageAvg &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'usageAvg' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettifyF(quiz.metrics?.usageAvg || 0, 1)}
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
            {NumberUtil.prettify(quiz.metrics?.hint || 0)}
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
            {NumberUtil.prettify(quiz.metrics?.help || 0)}
          </Typography>
        </TableCell>
      }
    </TableRow>
  );
}

export default Comp