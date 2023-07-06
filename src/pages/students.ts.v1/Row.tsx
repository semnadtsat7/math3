import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import
{
  Typography,

  Button,

  TableCell,
  TableRow,
} from '@material-ui/core'

import DateUtil from '../../utils/DateTime'
import NumberUtil from '../../utils/NumberTS';

import CellProgress from '../../components/Table/CellValue/Progress';

import Checkbox from './Checkbox';

import { Student } from './listenStudents';
import { Columns } from './utils/Column';
import { Sort } from './utils/Sorter';

const Name = styled.div`
  padding: 8px 24px;

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

type Props =
  {
    selected: boolean;

    row: number;

    columns: Columns;
    sort: Sort;

    student: Student;
    metrics:
    {
      quiz: number;
    },

    onCustomId(student: Student): void;
    onDelete(student: Student): void;
    onSelect(student: Student, value: boolean): void;
  }

const Comp: React.FC<Props> = (
  {
    selected,

    row,

    columns,
    sort,

    student,
    metrics,

    onCustomId,
    onDelete,
    onSelect,
  }
) =>
{
  // const metrics = student.metrics || {};

  function handleSelect (value: boolean)
  {
    onSelect (student, value);
  }

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
        <Checkbox
          value={selected}
          onChange={handleSelect}
        />
      </TableCell>

      {
        columns.customId &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'customId' ? `column-active-${sort.order}` : ''}
          // style={{ display: columns.customId ? undefined : 'none' }}
        >
          <Typography variant="body2" noWrap >
            {
              !!student.customId ?
                student.customId
                :
                <Button
                  variant="text"
                  color="primary"
                  mini={true}
                  size="small"
                  style={{ padding: 0, color: "#367c22", }}
                  onClick={() => onCustomId(student)}
                >
                  เพิ่มรหัสนักเรียน
                </Button>
            }
          </Typography>
        </TableCell>
      }
      <TableCell
        padding="none"
        className={sort.orderBy === 'name' ? `column-active-${sort.order}` : ''}
      >
        <Name>
          <Clickable
            to={`/students/${student._id}`}
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
          <Typography noWrap={true} style={{ marginLeft: 8 }} >
            {NumberUtil.prettify(student.metrics?.pass || 0)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(metrics?.quiz || 0)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(student.metrics?.pass, metrics?.quiz || 0)}
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
          <Typography>
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
          <Typography>
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
          <Typography>
            {NumberUtil.prettify(student.metrics?.help || 0)}
          </Typography>
        </TableCell>
      }

      {/* {
        columns.hintHelp &&
        <TableCell align="right" padding="checkbox">
          <Typography>
            {NumberUtil.prettify((student.metrics?.hint || 0) + student.metrics?.help || 0)}
          </Typography>
        </TableCell>
      } */}


      {
        columns.lastSignedInAt &&
        <TableCell 
          align="right" 
          padding="checkbox"
          className={sort.orderBy === 'lastSignedInAt' ? `column-active-${sort.order}` : ''}
        >
          {
            student.lastSignedInAt ?
              <Typography variant="caption" noWrap>
                {DateUtil.formatDate(student.lastSignedInAt, { monthType: 'short' })}
                <Typography component="small" variant="caption" noWrap>
                  {DateUtil.formatTime(student.lastSignedInAt)}
                </Typography>
              </Typography>
              :
              '-'
          }
        </TableCell>
      }

      <TableCell padding="checkbox">
        <Button
          color="secondary"
          size="small"
          onClick={() => onDelete(student)}
          style={{ minWidth: 40, maxWidth: 40 }}
        >
          ลบ
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default Comp;