import React, { useMemo } from 'react';
import styled from 'styled-components';

import NumberUtil from '../../../../../utils/NumberTS';

import { LABEL_CHAR_WIDTH, ROW_HEIGHT } from './constants';

interface LineProps
{
  level: number;
  label?: string;
}

const HorizontalLine = styled.span<LineProps>`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  align-items: center;

  width: 100%;
  height: ${ROW_HEIGHT}px;

  &::before
  {
    content: '${props => props.label?.trim() || ''}';

    flex-shrink: 0;

    width: ${props => (props.label?.length || 1) * LABEL_CHAR_WIDTH}px;
    margin-right: 8px;

    text-align: right;
  }

  &::after
  {
    content: '';

    flex-shrink: 1;

    width: 100%;
    height: 1px;

    ${props => props.level === 1 && `
      background-color: #999;
    `}

    ${props => props.level === 2 && `
      background-color: #ccc;
    `}
  }
`;

interface Props
{
  offset: number;
  min: number;
  max: number;
}

function getLines (offset: number, min: number, max: number)
{
  const diff = max - min;
  const lines = [];

  lines.push({ level: 2, value: NumberUtil.prettifyF(max, 1).padStart(offset, ' ') });
  lines.push({ level: 2, value: NumberUtil.prettifyF(min + (diff * 0.75), 1).padStart(offset, ' ') });
  lines.push({ level: 2, value: NumberUtil.prettifyF(min + (diff * 0.5), 1).padStart(offset, ' ') });
  lines.push({ level: 2, value: NumberUtil.prettifyF(min + (diff * 0.25), 1).padStart(offset, ' ') });
  lines.push({ level: 1, value: NumberUtil.prettifyF(min, 1).padStart(offset, ' ') });

  return lines;
}

const Comp: React.FC<Props> = (
  {
    offset,
    min,
    max,
  }
) =>
{
  const lines = useMemo(() => getLines(offset, min, max), [offset, min, max]);

  return (
    <>
      {
        lines.map (
          ({ value, level }) =>
          {
            return (
              <HorizontalLine 
                key={`horizontal-line-${value}`}
                level={level}
                label={value}
              />
            );
          }
        )
      }
    </>
  );
}

export default Comp;