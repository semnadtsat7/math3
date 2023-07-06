import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Popover } from 'antd';

const List = styled.div`
  /* display: flex;

  flex-direction: column;
  flex-wrap: nowrap; */
  max-width: 240px;

  margin: -12px -16px;
`;

const Item = styled.div`
  background: transparent;
  border: none;

  padding: 12px 14px;

  color: #333;
  cursor: pointer;

  line-height: 1.7;

  transition: color 0.2s;

  &:not(:last-child)
  {
    border-bottom: 1px solid #e8e8e8;
  }

  &:hover
  {
    background-color: rgba(64, 169, 255, 0.05);
    color: #40a9ff;
  }
`;

interface Props
{
  onSelect(action: string): void;
}

const Comp: React.FC<Props> = (
  {
    onSelect,
  }
) =>
{
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Popover
        trigger="click"
        placement="topLeft"
        visible={visible}
        onVisibleChange={setVisible}
        content={
          <List>
            <Item onClick={() => onSelect('add-to-group')} >
              เพิ่มนักเรียนเข้าใน กลุ่มเรียน
            </Item>
            <Item onClick={() => onSelect('remove-from-group')} >
              นำนักเรียนออกจาก กลุ่มเรียน
            </Item>
            <Item onClick={() => onSelect('teacher-student-move')} >
              ย้ายระดับชั้น
            </Item>
            <Item onClick={() => onSelect('delete')} >
              ลบนักเรียน
            </Item>
          </List>
        }
      >
        <Button
          type="primary"
          size="small"
          style={{ lineHeight: 1 }}
        >
          จัดการรายการที่เลือก
        </Button>
      </Popover>
    </div>
  );
}

export default Comp;