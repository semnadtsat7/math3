import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NumberUtil from '../../../../utils/NumberTS';

import listenProgress, { ListenProgressResult } from './listenProgress';

import styled from 'styled-components';
import
{
  Select,
} from 'antd';

import GroupItem from '../GroupItem';

import Card from '../Card';
import Info from '../progress-by-sheets/BySheets/Info';
import Pagination from '../progress-by-sheets/BySheets/Pagination';

import Chart from './Chart';

const { Option } = Select;

interface ContainerProps
{
  isLoading: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  padding: 12px 14px;

  align-items: baseline;

  ${props => props.isLoading && `
    pointer-events: none;
    opacity: 0.5;
  `}
`;

const Selection = styled.div`
  border-bottom: 1px solid #e8e8e8;

  .ant-select-selection
  {
    border: none !important;
    border-radius: 0;
    
    padding-left: 3px;

    .ant-select-selection-selected-value
    {
      color: cornflowerblue;
      text-decoration: underline;
    }
  }
`;

export type Quiz = 
{
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

interface Params
{
  groupId?: string;
}

function parse (view: ListenProgressResult, page: number)
{
  if (view.fetching === 'full')
  {
    return {
      quizzes: [],
      pageCount: 1,
    };
  }

  const items = view.quizzes.filter(quiz => quiz.metrics.quiz > 0);
  const limit = 8;
  const offset = (page - 1) * limit;

  const pageCount = Math.ceil(items.length / limit);

  return {
    pageCount,
    quizzes: items.map(
      (item) =>
      {
        // const { pass, quiz } = item.metrics;

        //const pass = Math.floor(item.metrics.pass); // cause bug pretest not showing any score until all students complete pretest
        const pass = item.metrics.pass;
        const quiz = item.metrics.quiz;
        const not = quiz - pass;
  
        return {
          title: item.title,
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
    .slice(offset, offset + limit) as Quiz[],
  }
}

function percentage (value: number, max: number)
{
  return (value / max) * 100;
}

const Comp: React.FC = () =>
{
  const params = useParams() as Params;
  const groupID = params.groupId || 'null'

  const { view, filter, setFilter } = listenProgress({ groupID });

  const [page, setPage] = useState(1);
  const { quizzes, pageCount } = useMemo(() => parse(view, page), [view, page]);

  function handlePrev ()
  {
    setPage (page - 1);
  }

  function handleNext ()
  {
    setPage (page + 1);
  }

  function handleReset ()
  {
    setPage (1);
  }

  useEffect (handleReset, [filter]);

  return (
    <GroupItem
      // // md="calc(100% - 200px)"
      // max={
      //   {
      //     lg: '780px',
      //     xl: '940px',
      //     // xl: '1140px'
      //   }
      // }
    >
      <Card>
        <label>สรุปความก้าวหน้าแต่ละบทเรียน (แบ่งเป็น {NumberUtil.prettify(view.quizzes.length)} บทเรียนย่อย)</label>

        {
          view.fetching === 'full' ?
          <Container isLoading={false} >
            <p>
              กำลังโหลด ...
            </p>
          </Container>
          :
          <>
            <Selection>
              <Select
                dropdownMatchSelectWidth={false}
                size="default"
                value={filter.sheetID}
                onChange={(sheetID: string) => setFilter({ ...filter, sheetID })}
                style={{
                  width: `100%`,
                }}
                dropdownMenuStyle={{
                  border: 'none'
                }}
              >
                {
                  view.sheets
                    .map(sheet =>
                    {
                      return (
                        <Option
                          key={sheet._id}
                          value={sheet._id}
                        >
                          {sheet.title}
                        </Option>
                      )
                    })
                  }
              </Select>
            </Selection>
            <Container isLoading={view.fetching !== 'none'} >
              <Info />
              <Chart 
                sheetID={filter.sheetID}
                quizzes={quizzes} 
              />
            </Container>

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
          </>
        }
      </Card>
    </GroupItem>
  );
}

export default Comp;