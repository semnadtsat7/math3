import React from 'react'
import { useHistory } from 'react-router-dom';

import styled from 'styled-components'

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

import { Sheet } from './listenSummary';
import { Columns } from './utils/Column';
import { Sort } from './utils/Sorter';

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

  sheet: Sheet;
}

const Comp: React.FC<Props> = (
  {
    row,

    columns,
    sort,

    sheet,
  }
) =>
{
  const history = useHistory();
  // const time = summary.latestAt
  const metrics = sheet.metrics || {};
  const played = metrics.play > 0 && sheet.updatedAt;

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
        className={sort.orderBy === 'order' ? `column-active-${sort.order}` : ''}
        style={played ? { cursor: 'pointer' } : undefined}
        onClick={e => 
        {
          const query = QueryUtil.parse(history.location.search)

          const path = history.location.pathname
          const href = `${path}?${QueryUtil.stringify({ ...query, sheetID: sheet._id })}`

          if (played)
          {
            history.push(href)
          }
        }}
      >
        <Clickable clickable={played} >
          {sheet.title}
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
            {NumberUtil.prettifyF(metrics.pass || 0, 1)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(metrics.quiz || 0)}</small>
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
            {NumberUtil.prettifyF(metrics.best || 0, 1)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify((metrics.quiz || 0) * 3)}</small>
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
          className={sort.orderBy === 'updatedAt' ? `column-active-${sort.order}` : ''}
        >
          {
            played ?
              <React.Fragment>
                <Typography variant="caption" noWrap>
                  {DateUtil.formatDate(sheet.updatedAt, { monthType: 'short' })}
                  <Typography component="small" variant="caption" noWrap>
                    {DateUtil.formatTime(sheet.updatedAt)}
                  </Typography>
                </Typography>
              </React.Fragment>
              :
              '-'
          }
        </TableCell>
      }
      
      {/* <TableCell 
        padding="checkbox"
      >
        
      </TableCell> */}
    </TableRow>
  )
}

export default Comp