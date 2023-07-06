import React, { useMemo } from 'react';
import styled from 'styled-components';

import NumberUtil from '../../../../../utils/NumberTS';

import { Filter } from '../utils/Filter';

import VTrack from './VTrack';
import VLabel from './VLabel';
import HTrack from './HTrack';
import HLabel from './HLabel';

import Spots from './Spots';
import Grid from './Grid';

const Col = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  justify-content: center;

  margin-right: 16px;
  margin-top: 8px;
`;

const Row = styled.div`
  width: 100%;

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  align-items: center;
`;

const Track = styled.div`
  width: 100%;

  position: relative;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;
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
  filter: Filter;
  groupID: string;

  items: Item[];

  x:
  {
    label: string;

    min: number;
    max: number;
  };

  y:
  {
    label: string;

    min: number;
    max: number;
  };
}

function getOffset (min: number, max: number)
{
  const diff = max - min;
  
  const values = [
    NumberUtil.prettifyF(max, 1),
    NumberUtil.prettifyF(min + (diff * 0.75), 1),
    NumberUtil.prettifyF(min + (diff * 0.5), 1),
    NumberUtil.prettifyF(min + (diff * 0.25), 1),
    NumberUtil.prettifyF(min, 1),
  ];

  return values.sort((a, b) => b.length - a.length)[0].length;
}

const Comp: React.FC<Props> = (
  {
    groupID,
    filter,
    items,
    x,
    y,
  }
) =>
{
  const offset = useMemo(() => getOffset(y.min, y.max), [y.min, y.max]);

  return (
    <Row>
      <HLabel 
        label={y.label}
      />
      <Col>
        <Track>
          <HTrack 
            offset={offset}
            min={y.min}
            max={y.max}
          />
          <VTrack 
            offset={offset}
            min={x.min} 
            max={x.max} 
          />
          <Spots 
            offset={offset}
            items={items}
            x={x}
            y={y}
          />
          <Grid 
            type="sm"
            groupID={groupID}
            filter={filter}
            offset={offset}
            items={items}
            x={x}
            y={y}
          />
          <Grid 
            type="md"
            groupID={groupID}
            filter={filter}
            offset={offset}
            items={items}
            x={x}
            y={y}
          />
          <Grid 
            type="lg"
            groupID={groupID}
            filter={filter}
            offset={offset}
            items={items}
            x={x}
            y={y}
          />
        </Track>
        <VLabel 
          offset={offset}
          label={x.label}
        />
      </Col>
    </Row>
  );
}

export default Comp;