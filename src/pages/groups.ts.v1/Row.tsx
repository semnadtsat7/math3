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

import NumberUtil from '../../utils/NumberTS';

import CellProgress from '../../components/Table/CellValue/Progress';

import { Group } from './listenGroups';
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

// const Star = styled.span`
//   font-size: 0.95em;
//   margin-top: 6px;
// `

type Props =
  {
    row: number;

    columns: Columns;
    sort: Sort;

    group: Group;
    metrics:
    {
      quiz: number;
    },


    onDelete(group: Group): void;
  }

const Comp: React.FC<Props> = (
  {
    row,

    columns,
    sort,

    group,
    metrics,

    onDelete,
  }
) =>
{
  // const metrics = student.metrics || {};

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

      <TableCell
        padding="none"
        className={sort.orderBy === 'name' ? `column-active-${sort.order}` : ''}
      >
        <Name>
          <Clickable
            to={`/groups/${group._id}`}
          >
            {group.name}
          </Clickable>
        </Name>
      </TableCell>

      {
        columns.student &&
        <TableCell
          align="right"
          padding="checkbox"
          className={sort.orderBy === 'student' ? `column-active-${sort.order}` : ''}
        >
          <Typography>
            {NumberUtil.prettify(group.metrics?.student || 0)}
          </Typography>
        </TableCell>
      }

      {
        columns.pass &&
        <TableCell
          align="right"
          padding="checkbox"
          className={sort.orderBy === 'pass' ? `column-active-${sort.order}` : ''}
        >
          <Typography noWrap={true} style={{ marginLeft: 8 }} >
            {NumberUtil.prettifyF(group.metrics?.pass || 0, 1)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(metrics?.quiz || 0)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(group.metrics?.best, metrics?.quiz || 0)}
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
            {NumberUtil.prettifyF(group.metrics?.best || 0, 1)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify((metrics?.quiz || 0) * 3)}</small>
          </Typography>
          <CellProgress
            value={NumberUtil.percentage(group.metrics?.best, (metrics?.quiz || 0) * 3)}
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
            {NumberUtil.prettifyF(group.metrics?.play || 0, 1)}
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
            {NumberUtil.prettifyF(group.metrics?.usageAvg || 0, 1)}
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
            {NumberUtil.prettifyF(group.metrics?.hint || 0, 1)}
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
            {NumberUtil.prettifyF(group.metrics?.help || 0, 1)}
          </Typography>
        </TableCell>
      }

      <TableCell padding="checkbox">
        <Button
          color="secondary"
          size="small"
          onClick={() => onDelete(group)}
          style={{ minWidth: 40, maxWidth: 40 }}
        >
          ลบ
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default Comp;