import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import moment from 'moment';

import { Button } from 'antd';
import { getDateString } from '../utils';

import Layer from '../../../../Layer';

import Card from '../../Dropdown/Modal/Card';
import CardContent from '../../Dropdown/Modal/CardContent';

import Item from './Item';
import Calendar from './Calendar';
import Footer from './Footer';

const Header = styled.div`
  padding: 14px;

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  width: 100%;

  border-bottom: 1px solid #d9d9d9;

  line-height: 1.6;

  label
  {
    font-weight: bold;

    flex-grow: 1;
    flex-shrink: 1;
  }

  span
  {
    flex-shrink: 0;
  }
`;

interface Props
{
  isOpen: boolean;

  label: string | number | React.ReactNode;
  value: number[];

  onClose?(): void;
  onSubmit?(value: number[]): void;
}

const Comp: React.FC<Props> = (
  {
    isOpen,

    label,
    value,

    onClose,
    onSubmit,
  }
) =>
{
  const [temp, setTemp] = useState(value);
  const [cursor, setCursor] = useState(moment(temp[0]));

  const [index, setIndex] = useState(0);

  const label1 = useMemo(() => getDateString(temp[0]), [temp]);
  const label2 = useMemo(() => getDateString(temp[1]), [temp]);

  function handleIsOpenChange ()
  {
    // console.log('isOpen');
    setTemp(value);
    setCursor(moment(value[0]));
    setIndex(0);
  }

  function handleClick (newIndex: number)
  {
    if (newIndex === index)
    {
      setCursor(moment(temp[index]));
    }
    else
    {
      setIndex(newIndex);
    }
  }

  function handleChange (value: number[], next: boolean)
  {
    setTemp(value);
    
    if (next)
    {
      setIndex(index === 0 ? 1 : 0);
    }
  }

  function handleSubmit ()
  {
    if (onSubmit)
    {
      onSubmit(temp);
    }
  }

  useEffect(handleIsOpenChange, [ isOpen, value ]);

  return (
    <Layer 
      isOpen={isOpen} 
      layer={1}
      onClose={onClose}
    >
      <Card>
        <Header>
          <label>
            {label}
          </label>
          <Item
            title="วันที่เริ่มต้น"
            isFocus={index === 0}
            onClick={() => handleClick(0)}
          >
            {label1}
          </Item>
          <span>&nbsp;~&nbsp;</span>
          <Item
            title="วินที่สิ้นสุด"
            isFocus={index === 1}
            onClick={() => handleClick(1)}
          >
            {label2}
          </Item>
        </Header>
        <CardContent>
          <Calendar 
            index={index}
            value={temp}
            cursor={cursor}
            onValueChange={handleChange}
            onCursorChange={setCursor}
          />
        </CardContent>
      </Card>
      <Footer>
        <Button
          type="default"
          block={true}
          onClick={onClose}
        >
          ปิดหน้าต่าง
        </Button>
        <Button
          type="primary"
          block={true}
          onClick={handleSubmit}
        >
          ดำเนินการ
        </Button>
      </Footer>
    </Layer>
  );
}

export default Comp;