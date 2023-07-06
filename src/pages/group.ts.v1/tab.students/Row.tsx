import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Checkbox } from 'antd';

import
{
  Typography,

  TableCell,
  TableRow,
} from '@material-ui/core'

import DateUtil from '../../../utils/DateTime'
import NumberUtil from '../../../utils/NumberTS';

import CellProgress from '../../../components/Table/CellValue/Progress';

import { Student } from './listenStudents';
import { Columns } from '../../students.ts.v1/utils/Column';
import { Sort } from './utils/Sorter';

const Name = styled.div`
  /* padding: 8px 24px; */
  padding: 8px 0;

  display: flex;

  flex-direction: column;
`

const Clickable = styled(Link)`
  color: cornflowerblue;
  text-decoration: underline;
  
  cursor: pointer;

  /* padding: 14px 24px; */

  display: flex;

  &:hover
  {
    text-decoration: underline;
    /* background: rgba(0,0,0, 0.05); */
  }
`

const Star = styled.span`
  font-size: 0.95em;
  margin-top: 6px;
`

const Action = styled.div`
    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`

type Props =
  {
    row: number;

    columns: Columns;
    sort: Sort;

    groupID: string;
    
    student: Student;
    scope: string;

    metrics:
    {
      quiz: number;
    },

    onAdd(studentID: string): void;
    onRemove(studentID: string): void;
  }

const Comp: React.FC<Props> = (
  {
    row,

    columns,
    sort,

    groupID,

    student,
    scope,

    metrics,

    onAdd,
    onRemove,
  }
) =>
{
  const inActive = scope === 'none' && !student.active;

  const className = !!inActive ? 'inactive' : ''

  const aClassName = `link ${className}`.trim ()
  const tClassName = `text ${className}`.trim ()

  return (
    <TableRow
      selected={scope === 'none' && student.active}
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
            student.active ?
              <Checkbox
                checked={true}
                onChange={() => onRemove(student._id)}
              />
              :
              <Checkbox
                checked={false}
                onChange={() => onAdd(student._id)}
              />
          }
        </Action>
      </TableCell>
      {
        columns.customId &&
        <TableCell 
          align="right"
          padding="checkbox"
          className={sort.orderBy === 'customId' ? `column-active-${sort.order}` : ''}
        >
          <Typography variant="body2" noWrap className={tClassName} >
            {
              !!student.customId ?
                student.customId
                :
                '-'
            }
          </Typography>
        </TableCell>
      }
      <TableCell
        padding="dense"
        className={sort.orderBy === 'name' ? `column-active-${sort.order}` : ''}
      >
        <Name>
          <Clickable
            to={`/students/${student._id}?group=${groupID}`}
            className={aClassName}
          >
            {student.name}
          </Clickable>
          <Star>
            ดาวปัจจุบัน: {NumberUtil.prettify(student.coin)} ดวง
          </Star>
        </Name>
      </TableCell>

      {
        columns.pass &&
        <TableCell
          align="right"
          padding="checkbox"
          className={sort.orderBy === 'pass' ? `column-active-${sort.order}` : ''}
        >
          <Typography noWrap={true} style={{ marginLeft: 8 }} className={tClassName} >
            {NumberUtil.prettify(student.metrics?.pass || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(metrics?.quiz || 0)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(student.metrics?.pass, metrics?.quiz)}
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
          <Typography className={tClassName} >
            {NumberUtil.prettify(student.metrics?.best || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify((metrics?.quiz || 0) * 3)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(student.metrics?.best, (metrics?.quiz || 0) * 3)}
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
          <Typography className={tClassName} >
            {NumberUtil.prettify(student.metrics?.play || 0)}
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
            {NumberUtil.prettifyF(student.metrics?.usageAvg || 0, 1)}
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
          <Typography className={tClassName}>
            {NumberUtil.prettify(student.metrics?.hint || 0)}
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
          <Typography className={tClassName}>
            {NumberUtil.prettify(student.metrics?.help || 0)}
          </Typography>
        </TableCell>
      }

      {
        columns.lastSignedInAt &&
        <TableCell
          align="right"
          padding="checkbox"
          className={sort.orderBy === 'lastSignedInAt' ? `column-active-${sort.order}` : ''}
        >
          {
            student.lastSignedInAt ?
              <Typography variant="caption" noWrap className={tClassName}>
                {DateUtil.formatDate(student.lastSignedInAt, { monthType: 'short' })}
                <Typography component="small" variant="caption" noWrap className={tClassName}>
                  {DateUtil.formatTime(student.lastSignedInAt)}
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

export default Comp;