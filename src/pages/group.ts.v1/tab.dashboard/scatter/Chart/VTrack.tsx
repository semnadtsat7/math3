import React, { useMemo } from 'react';
import styled from 'styled-components';

import NumberUtil from '../../../../../utils/NumberTS';

import { LABEL_CHAR_WIDTH } from './constants';

interface LineProps
{
  level: number;
  label?: string;
}

interface VerticalProps
{
  offset: number;
}

const Vertical = styled.div<VerticalProps>`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  justify-content: space-between;

  position: absolute;

  right: 4px;
  left: ${props => (props.offset * LABEL_CHAR_WIDTH) + 12}px;

  top: 30px;
  bottom: 4px;
`;

const VerticalLine = styled.span<LineProps>`
  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  align-items: center;

  width: 1px;
  height: 100%;

  &::before
  {
    content: '';

    flex-shrink: 1;

    width: 1px;
    height: 100%;

    ${props => props.level === 1 && `
      background-color: #999;
    `}

    ${props => props.level === 2 && `
      background-color: #ccc;
    `}
  }

  &::after
  {
    content: '${props => props.label?.trim() || ''}';

    flex-shrink: 0;
    text-align: center;
  }
`;

interface Props
{
  offset: number;
  
  min: number;
  max: number;
}

function getLines (min: number, max: number)
{
  const diff = max - min;
  const lines = [];

  lines.push({ level: 1, value: NumberUtil.prettifyF(min, 1) });
  lines.push({ level: 2, value: NumberUtil.prettifyF(min + (diff * 0.25), 1) });
  lines.push({ level: 2, value: NumberUtil.prettifyF(min + (diff * 0.5), 1) });
  lines.push({ level: 2, value: NumberUtil.prettifyF(min + (diff * 0.75), 1) });
  lines.push({ level: 2, value: NumberUtil.prettifyF(max, 1) });

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
  const lines = useMemo(() => getLines(min, max), [min, max]);

  return (
    <Vertical
      offset={offset}
    >
      {
        lines.map(
          ({ value, level }) =>
          {
            return (
              <VerticalLine 
                key={`vertical-line-${value}`}
                level={level}
                label={value}
              />
            );
          }
        )
      }
    </Vertical>
  );
}

export default Comp;