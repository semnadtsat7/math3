import React from 'react';
import moment from 'moment';

import { Calendar } from 'antd';

import Header from './CalendarHeader';
import Footer from './CalendarFooter';
import Cell from './Cell';

interface Props
{
  index: number;
  value: number[];
  cursor: moment.Moment;

  onValueChange?(value: number[], next: boolean): void;
  onCursorChange?(value: moment.Moment): void;
}

function isEquals (a: number, b: number)
{
  const aa = moment(a);
  const bb = moment(b);

  return aa.date() === bb.date() && aa.month() === bb.month() && aa.year() === bb.year();
}

function isInner (value: number, startAt: number, endAt: number)
{
  return value >= startAt && value <= endAt;
}

function isDisabledDate (current: moment.Moment)
{
  const now = moment();
  return !current || current > now.endOf('day');// || current < now.subtract(1, 'year').startOf('day');
}

function getCellState (value: number, startAt: number, endAt: number)
{
  let state = 'none';

  if (isInner(value, startAt, endAt))
  {
    const isStartAt = isEquals(value, startAt);
    const isEndAt = isEquals(value, endAt);

    if (isStartAt)
    {
      if (isEndAt)
      {
        state = 'startAndEnd';
      }
      else
      {
        state = 'startAt';
      }
    }
    else if (isEndAt)
    {
      state = 'endAt';
    }
    else
    {
      state = 'inner';
    }
  }
  else
  {
    const now = moment().endOf('day').valueOf();
    
    if (value.valueOf() > now)
    {
      state = 'outer';
    }
  }

  return state;
}

const Comp: React.FC<Props> = (
  {
    index,
    value,
    cursor,

    onValueChange,
    onCursorChange,
  }
) =>
{
  // const [cursor, setCursor] = useState(moment(value[0]));

  function handleCursorChange (date?: moment.Moment)
  {
    // console.log('cursor', date);

    if (date && onCursorChange)
    {
      onCursorChange(date);
    }
  }

  function handleSelect (date?: moment.Moment)
  {
    // console.log('select', date);

    if (date && onValueChange)
    {
      const MAX_YEAR = 3;
      const m01 = 60000;

      const arr = [...value];

      arr[index] = date.valueOf();
      
      let startAt = arr[0] ? moment(arr[0]).startOf('day').valueOf() : moment().startOf('day').valueOf();
      let endAt = arr[1] ? moment(arr[1]).endOf('day').valueOf() : moment().endOf('day').valueOf();

      if (index === 0)
      {
        if (startAt > endAt)
        {
          endAt = moment(startAt).endOf('day').valueOf();
        }
        else
        {
          const max = moment(startAt).add(MAX_YEAR, 'year').endOf('day').valueOf();

          if (endAt > max)
          {
            endAt = max;
          }
        }
      }
      else 
      {
        if (endAt < startAt)
        {
          startAt = moment(endAt).startOf('day').valueOf();
        }
        else
        {
          const min = moment(endAt).subtract(MAX_YEAR, 'year').startOf('day').valueOf();

          if (startAt < min)
          {
            startAt = min;
          }
        }
      }

      if (startAt)
      {
        startAt = startAt - (startAt % m01);
      }

      if (endAt)
      {
        endAt = endAt - (endAt % m01);
      }

      // console.log(startAt, endAt);

      onValueChange([ startAt, endAt ], true);
    }

    // setIndex(index === 0 ? 1 : 0);
  }

  function handleSelectRange (value: number[])
  {
    if (onValueChange)
    {
      onValueChange(value, false);
    }

    if (onCursorChange)
    {
      onCursorChange(moment(value[0]));
    }
  }

  return (
    <>
      <Header 
        value={cursor}
        onChange={handleCursorChange}
      />
      <Calendar 
        mode="month"
        fullscreen={false}
        value={cursor}
        disabledDate={isDisabledDate}
        onChange={handleCursorChange}
        onSelect={handleSelect}
        headerRender={() => null}
        dateFullCellRender={date =>
        {
          const state = getCellState(date.valueOf(), value[0], value[1]);
          const text = date.date().toString(10);

          return (
            <Cell state={state} >
              {text}
            </Cell>
          );
        }}
      />
      <Footer onSelect={handleSelectRange} />
    </>
  );
}

export default Comp;