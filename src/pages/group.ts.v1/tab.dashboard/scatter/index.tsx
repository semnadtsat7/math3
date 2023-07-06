import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import
{
  Select,
} from 'antd';

import GroupItem from '../GroupItem';
import Card from '../Card';

import Chart from './Chart';

import listenSummary, { ListenSummaryResult } from './listenSummary';

const { Option } = Select;

interface ContentProps
{
  isLoading: boolean;
}

const Container = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  padding: 12px 14px;

  align-items: baseline;
`;

const Content = styled.div<ContentProps>`
  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  width: 100%;

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

interface Params
{
  groupId?: string;
}

interface FieldNameKV
{
  [key: string]: string; 
}

const fieldNames: FieldNameKV = 
{
  'best': 'คะแนน',
  'playAvg': 'จำนวนครั้งต่อด่าน',
  'usageAvg': 'เวลาที่ใช้เฉลี่ยต่อข้อ (วินาที)',
};

function getItems (view: ListenSummaryResult)
{
  if (view.fetching === 'full')
  {
    return [];
  }

  const items = view.students.map(
    student =>
    {
      return {
        _id: student._id,
        label: student.name,
        x: student.metrics.value,
        y: student.metrics.best,
      };
    }
  );

  return items;
}

const Comp: React.FC = () =>
{
  const params = useParams() as Params;
  const groupID = params.groupId || 'null'

  const { view, filter, setFilter } = listenSummary({ groupID });
  const items = useMemo(() => getItems(view), [view]);

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
        <label>วิเคราะห์ภาพรวมนักเรียน</label>

        {
          view.fetching === 'full' ?
          <Container>
            <p>
              กำลังโหลด ...
            </p>
          </Container>
          :
          <Content isLoading={view.fetching === 'partial'} >
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
                <Option value="none" >ทุกบทเรียน</Option>
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

            {
              view.titles && view.titles.length > 0 &&
              <Selection>
                <Select
                  dropdownMatchSelectWidth={false}
                  size="default"
                  value={filter.title}
                  onChange={(title: string) => setFilter({ ...filter, title })}
                  style={{
                    width: `100%`,
                  }}
                  dropdownMenuStyle={{
                    border: 'none'
                  }}
                >
                  <Option value="none" >ทุกบทเรียนย่อย</Option>
                  {
                    view.titles
                      .map((title) =>
                      {
                        return (
                          <Option
                            key={title}
                            value={title}
                          >
                            {title}
                          </Option>
                        )
                      })
                  }
                </Select>
              </Selection>
            }

            <Selection>
              <Select
                dropdownMatchSelectWidth={false}
                size="default"
                value={filter.field}
                onChange={(field: string) => setFilter({ ...filter, field })}
                style={{
                  width: `100%`,
                }}
                dropdownMenuStyle={{
                  border: 'none'
                }}
              >
                <Option value="playAvg" >{fieldNames.best} vs {fieldNames.playAvg}</Option>
                <Option value="usageAvg" >{fieldNames.best} vs {fieldNames.usageAvg}</Option>
              </Select>
            </Selection>

            <Chart 
              groupID={groupID}
              filter={filter}
              items={items}
              x={{
                label: fieldNames[filter.field],
                min: Math.min(view.min.value, view.max.value),
                max: Math.max(view.max.value, 1),
              }}
              y={{
                label: fieldNames.best,
                min: Math.min(view.min.best, view.max.best),
                max: Math.max(view.max.best, 1),
              }}
            />
          </Content>
        }
      </Card>
    </GroupItem>
  );
}

export default Comp;