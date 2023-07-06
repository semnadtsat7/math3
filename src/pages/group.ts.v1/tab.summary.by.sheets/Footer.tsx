import React from 'react'
import styled from 'styled-components'

import
{
  Typography,
} from '@material-ui/core'

import { Container as Footer, HorizontalScrollView } from '../../../components/Table/Footer';

import DateUtil from '../../../utils/DateTime';
import NumberUtil from '../../../utils/NumberTS';

import CellProgress from '../../../components/Table/CellValue/Progress';

import { Total } from './listenSummary';
import { Columns } from './utils/Column';

interface IColumn
{
  align?: string;
  width?: string | number;

  clickable?: any;
}

const Column = styled.div<IColumn>`
  display: flex;

  flex-direction: column;

  justify-content: center;
  align-items: flex-end;

  height: 48px;
  padding: 0 12px;

  &:not(:last-child)
  {
    border-right: 1px solid transparent;
  }

  b
  {
    font-weight: 600;
    color: #444;
  }

  ${props => props.align === 'left' && `
    align-items: flex-start;
    padding: 0 24px;
  `}

  ${props => props.align === 'center' && `
    align-items: center;
  `}

  ${props => props.align === 'action' && `
    align-items: center;
    padding: 0;
  `}

  ${props => props.width && `
    min-width: ${props.width}px;
  `}
  
  ${props => props.clickable && `
    pointer-events: auto;
  `}
`

interface Props
{
  columns: Columns;

  widths: number[];
  total: Total;

  extra?: any;
}

const Comp: React.FC<Props> = (
  {
    columns,

    widths,
    total,

    extra,
  }
) =>
{
  const metrics = total.metrics || {};

  return (
    <Footer
      style={{
        minHeight: 49,
        paddingRight: widths.length > 0 ? widths[0] : 0,
      }}
    >
      {
        widths.length >= 9 ?
          <HorizontalScrollView
            id="scroll-footer"
          >

            <Column 
              width={widths[1]}
              align="center"
              clickable={true}
            >
              {extra}
            </Column>
            <Column width={widths[2]} align="left" >
              <Typography>
                <b>รวม</b>
              </Typography>
            </Column>

            {
              columns.pass &&
              <Column width={widths[3]} >
                <Typography>
                  <b>
                    {NumberUtil.prettifyF(metrics.pass || 0, 1)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify(metrics.quiz || 0)}</small>
                  </b>
                </Typography>
                <CellProgress
                  value={NumberUtil.percentage(metrics?.pass, metrics?.quiz)}
                />
              </Column>
            }

            {
              columns.best &&
              <Column width={widths[4]} >
                <Typography>
                  <b>
                    {NumberUtil.prettifyF(metrics.best || 0, 1)} <small style={{ opacity: 0.8 }}>/ {NumberUtil.prettify((metrics.quiz || 0) * 3)}</small>
                  </b>
                </Typography>
                <CellProgress
                  value={NumberUtil.percentage(metrics?.best, (metrics?.quiz || 0) * 3)}
                />
              </Column>
            }

            {
              columns.play &&
              <Column width={widths[5]} >
                <Typography>
                  <b>{NumberUtil.prettifyF(metrics.play || 0, 1)}</b>
                </Typography>
              </Column>
            }
            
            {
              columns.usageAvg &&
              <Column width={widths[6]} >
                <Typography>
                  <b>{NumberUtil.prettifyF(metrics.usageAvg || 0, 1)}</b>
                </Typography>
              </Column>
            }

            {
              columns.hint &&
              <Column width={widths[7]} >
                <Typography>
                  <b>{NumberUtil.prettifyF(metrics.hint || 0, 1)}</b>
                </Typography>
              </Column>
            }
            
            {
              columns.help &&
              <Column width={widths[8]} >
                <Typography>
                  <b>{NumberUtil.prettifyF(metrics.help || 0, 1)}</b>
                </Typography>
              </Column>
            }

            {
              columns.updatedAt &&
              <Column width={widths[9]} >
                {
                  total.updatedAt ?
                  <Typography variant="caption" noWrap align="right" >
                    <b>{DateUtil.formatDate(total.updatedAt, { monthType: 'short' })}</b>
                    <Typography component="small" variant="caption" noWrap align="right">
                      <b>{DateUtil.formatTime(total.updatedAt)}</b>
                    </Typography>
                  </Typography>
                  :
                  '-'
                }
              </Column>
            }
          </HorizontalScrollView>
          :
          <Column>
            <Typography>
              <b>กำลังดาวน์โหลด</b>
            </Typography>
          </Column>
      }
    </Footer>
  );
}

Comp.defaultProps = 
{
  widths: [],
  // total: {},
}

export default Comp