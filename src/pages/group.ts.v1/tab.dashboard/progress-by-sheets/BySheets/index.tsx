import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import NumberUtil from '../../../../../utils/NumberTS';

import { ListenProgressResult } from '../listenProgress';

import Card from '../../Card';
import Info from './Info';
import Chart from './Chart';
import Pagination from './Pagination';

interface ContainerProps
{
  isLoading: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  align-items: flex-start;

  padding: 11px 14px 10px;

  ${props => props.isLoading && `
    pointer-events: none;
    opacity: 0.5;
  `}
`;

export type Sheet = 
{
  _id: string;
  title: string;

  metrics:
  {
    quiz: number;
    pass: number;
    not: number;
  };

  percentage:
  {
    pass: number;
    not: number;
  };
}

interface Props
{
  view: ListenProgressResult;
}

function parse (view: ListenProgressResult, page: number)
{
  if (view.fetching === 'full')
  {
    return {
      sheets: [],
      pageCount: 1,
    };
  }

  const items = view.sheets.filter(sheet => sheet.metrics.quiz > 0);
  const limit = 8;
  const offset = (page - 1) * limit;

  const pageCount = Math.ceil(items.length / limit);

  return {
    pageCount,
    sheets: items.map(
      (sheet) =>
      {
        // const { pass, quiz } = sheet.metrics;

        const pass = Math.floor(sheet.metrics.pass);
        const quiz = sheet.metrics.quiz;
        const not = quiz - pass;
  
        return {
          _id: sheet._id,
          title: sheet.title,
          metrics: {
            quiz,
            pass,
            not,
          },
          percentage: {
            pass: percentage(pass, quiz),
            not: percentage(not, quiz),
          },
        }
      }
    )
    .slice(offset, offset + limit),
  }
}

function percentage (value: number, max: number)
{
  return (value / max) * 100;
}

const Comp: React.FC<Props> = (
  {
    view,
  }
) =>
{
  const [page, setPage] = useState(1);
  const { sheets, pageCount } = useMemo(() => parse(view, page), [view, page]);

  function handlePrev ()
  {
    setPage (page - 1);
  }

  function handleNext ()
  {
    setPage (page + 1);
  }

  return (
    <Card>
      <label>สรุปความก้าวหน้าแต่ละบทเรียน ({NumberUtil.prettify(view.sheets.length)} บท)</label>

      {
        view.fetching === 'full' ?
        <Container isLoading={false}>
          <p>
            กำลังโหลด ...
          </p>
        </Container>
        :
        <Container isLoading={view.fetching !== 'none'} >
          <Info />
          <Chart sheets={sheets} />
        </Container>
      }

      {
        pageCount > 1 &&
        <Pagination 
          disabled={view.fetching !== 'none'}
          page={page}
          pageCount={pageCount}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      }
    </Card>
  );
}

export default Comp;