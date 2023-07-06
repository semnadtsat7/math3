import React, { useMemo } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import Dropdown from './Dropdown';

import monthNames from '../../../../../utils/DateTime/month.th';

const YEAR_OFFSET = 543;

const Container = styled.div`
  width: 100%;

  display: flex;
  
  flex-direction: row;
  flex-wrap: nowrap;
`;

interface Props
{
  value: moment.Moment;
  onChange?(value: moment.Moment): void;
}

function getYears ()
{
  const year = moment().year();
  const items = [];

  for (let i = 0; i < 10; i++)
  {
    const value = (year + YEAR_OFFSET - i).toString(10);

    items.push(
      {
        value: value,
        label: value,
      }
    );
  }

  return items;
}

function getMonths ()
{
  const items = [];

  for (let i = 0; i < 12; i++)
  {
    const label = monthNames[i];
    const value = i.toString(10);

    items.push({ value, label });
  }

  return items;
}

const Comp: React.FC<Props> = (
  {
    value,
    onChange,
  }
) =>
{
  const years = useMemo(() => getYears(), []);
  const months = useMemo(() => getMonths(), []);

  const year = useMemo(() => (value.year() + YEAR_OFFSET).toString(10), [value]);
  const month = useMemo(() => value.month().toString(10), [value]);

  function handleYearChange (v: string)
  {
    if (onChange)
    {
      const yyyy = parseInt(v, 10) - YEAR_OFFSET;
      onChange(moment(value).year(yyyy));
    }
  }

  function handleMonthChange (v: string)
  {
    if (onChange)
    {
      const mm = parseInt(v, 10);
      onChange(moment(value).month(mm));
    }
  }

  return (
    <Container>
      <Dropdown 
        label="เลือกปี"
        value={year}
        items={years}
        onChange={handleYearChange}
      />
      <Dropdown 
        label="เลือกเดือน"
        value={month}
        items={months}
        onChange={handleMonthChange}
      />
    </Container>
  );
}

export default Comp;