import React, { useState } from 'react';
import styled from 'styled-components';

import NumberUtil from '../../../../../utils/NumberTS';

import { Filter } from '../utils/Filter';

import { LABEL_CHAR_WIDTH } from './constants';

import Modal from './Modal';

interface ContainerProps
{
  breakpoint: 'sm' | 'md' | 'lg';
  offset: number;
}

const Container = styled.div<ContainerProps>`
  /* background: rgba(0, 128, 255, 0.025); */

  position: absolute;

  right: 4px;
  left: ${props => (props.offset * LABEL_CHAR_WIDTH) + 12}px;

  top: 30px;
  bottom: 30px;

  ${props => props.breakpoint === 'sm' && `
    @media (min-width: 768px)
    {
      display: none;
    }
  `}

  ${props => props.breakpoint === 'md' && `
    @media (max-width: 767px)
    {
      display: none;
    }

    @media (min-width: 1200px)
    {
      display: none;
    }
  `}

  ${props => props.breakpoint === 'lg' && `
    @media (max-width: 1199px)
    {
      display: none;
    }
  `}
`;

const Item = styled.div`
  position: absolute;

  cursor: pointer;

  transition: background 0.2s;

  border: 1px solid transparent;

  &:hover
  {
    background: rgba(0, 128, 255, 0.125);
    border-color: rgba(0, 128, 255, 0.5);
  }
`;

interface Item
{
  _id: string;
  label: string;
  x: number;
  y: number;
}

interface Props
{
  type: 'sm' | 'md' | 'lg';

  filter: Filter;

  groupID: string;

  offset: number;
  items: Item[];

  x:
  {
    label: string;
    max: number;
  };

  y:
  {
    label: string;
    max: number;
  };
}

const steps = 
{
  sm: 
  {
    x: 20,
    y: 20,
  },

  md: 
  {
    x: 10,
    y: 20,
  },

  lg: 
  {
    x: 5,
    y: 10,
  },
}

const Comp: React.FC<Props> = (
  {
    type,
    groupID,

    filter,
    offset,
    items,

    x,
    y,
  }
) =>
{
  const [select, setSelect] = useState('');
  
  const step = steps[type];
  const max = 100;

  const elements = [];
  const groups: any = {};

  let i = 0;

  for (let xi = 0; xi < max; xi += step.x)
  {
    // for (let yi = 0; yi < max; yi += step.y)
    for (let yi = max - step.y; yi >= 0; yi -= step.y)
    {
      const group = [];

      for (const item of items) 
      {
        const px1 = NumberUtil.percentage(item.x, x.max);
        const py1 = NumberUtil.percentage(item.y, y.max);

        const px2 = Math.min(px1, 99.999);
        const py2 = Math.min(py1, 99.999);

        if (px2 >= xi && px2 < xi + step.x && py2 >= yi && py2 < yi + step.y)
        {
          group.push(item);
        }
      }

      if (group.length > 0)
      {
        const index = `${i++}`;

        groups[index] = group;

        elements.push(
          <Item 
            key={`${type}-item-${index}`}
            onClick={() => setSelect(index)}
            style={
              {
                left: `${xi}%`,
                bottom: `${yi}%`,
                width: `${step.x}%`,
                height: `${step.y}%`,
              }
            }
          />
        );
      }
    }
  }

  return (
    <Container 
      breakpoint={type}
      offset={offset} 
    >
      {elements}
      {
        select.length > 0 &&
        <Modal 
          isOpen={select.length > 0}
          groupID={groupID}
          filter={filter}
          label={`${y.label} vs ${x.label}`}
          items={groups[select]}
          onClose={() => setSelect('')}

          x={x}
          y={y}
        />
      }
    </Container>
  );
}

export default Comp;