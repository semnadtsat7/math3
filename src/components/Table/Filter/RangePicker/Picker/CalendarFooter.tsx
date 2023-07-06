import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { Tag } from 'antd';

const Container = styled.div`
  width: 100%;

  display: flex;
  
  flex-direction: row;
  flex-wrap: wrap;

  padding: 12px 14px;

  border-top: 1px solid #d9d9d9;

  span
  {
    cursor: pointer;
    padding: 2px 8px;

    &:not(:last-child)
    {
      margin-right: 12px;
    }
  }
`;

interface Props
{
  onSelect?(value: number[]): void;
}

const Comp: React.FC<Props> = (
  {
    onSelect,
  }
) =>
{
  function handleTD ()
  {
    if (onSelect)
    {
      const a = moment().startOf('day').valueOf();
      const b = moment().startOf('day').valueOf();

      onSelect([a, b]);
    }
  }

  function handle7D ()
  {
    if (onSelect)
    {
      const a = moment().subtract('days', 7).startOf('day').valueOf();
      const b = moment().subtract('days', 1).endOf('day').valueOf();

      onSelect([a, b]);
    }
  }

  function handle30D ()
  {
    if (onSelect)
    {
      const a = moment().subtract('days', 30).startOf('day').valueOf();
      const b = moment().subtract('days', 1).endOf('day').valueOf();

      onSelect([a, b]);
    }
  }

  function handle1M ()
  {
    if (onSelect)
    {
      const a = moment().subtract('month', 1).startOf('month').valueOf();
      const b = moment().subtract('month', 1).endOf('month').valueOf();

      onSelect([a, b]);
    }
  }

  return (
    <Container>
      <Tag
        color="blue"
        onClick={handleTD}
      >
        วันนี้
      </Tag>
      <Tag
        color="blue"
        onClick={handle7D}
      >
        7 วันล่าสุด
      </Tag>
      <Tag
        color="blue"
        onClick={handle30D}
      >
        30 วันล่าสุด
      </Tag>
      <Tag
        color="blue"
        onClick={handle1M}
      >
        เดือนที่แล้ว
      </Tag>
    </Container>
  );
}

export default Comp;