import React from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import
{
  Select,
} from 'antd';

import NumberUtil from '../../../../utils/NumberTS';

import listenActives from './listenActives';

import GroupItem from '../GroupItem';
import Card from '../Card';

const { Option } = Select;

const Container = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  padding: 12px 14px;

  align-items: baseline;
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

const Text = styled.span`
  font-size: 1em;
  line-height: 1;

  margin-bottom: 5px;
`;

const Value = styled.span`
  font-size: 2em;
  line-height: 1;

  margin-bottom: 5px;
`;

interface Params
{
  groupId?: string;
}

const Comp: React.FC = () =>
{
  const params = useParams() as Params;
  const groupID = params.groupId || 'null'

  const { view, filter, setFilter } = listenActives({ groupID });
  const total = view.total;

  return (
    <GroupItem 
      // sm="200px"
      // xxl="100%"
    >
      <Card>
        <label>จำนวนนักเรียนที่ใช้งาน</label>

        <Selection>
          <Select
            dropdownMatchSelectWidth={false}
            size="default"
            value={filter.range}
            onChange={(value: string) => setFilter({ ...filter, range: value })}
            style={{
              width: `100%`,
            }}
            dropdownMenuStyle={{
              border: 'none'
            }}
          >
            <Option value="1D" >ปัจจุบัน</Option>
            <Option value="7D" >7 วันล่าสุด</Option>
            <Option value="30D" >30 วันล่าสุด</Option>
          </Select>
        </Selection>

        <Container>
          {
            view.fetching !== 'none' ?
            <Text>กำลังโหลด ...</Text>
            :
            <>
              <Value>{NumberUtil.prettify(total.active)} / {NumberUtil.prettify(total.student)}</Value>
              <span style={{ minWidth: 8 }} />
              <Text>คน</Text>
            </>
          }
        </Container>
      </Card>
    </GroupItem>
  );
}

export default Comp;