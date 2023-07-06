import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const Container = styled.div`
  width: 100%;

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 1;

  align-items: center;
  justify-content: center;

  line-height: 1;

  margin-top: 4px;
  margin-bottom: 12px;

  p
  {
    margin: 10px auto;
  }

  ul
  {
    font-size: 0.9em;

    padding-inline-start: 40px;
    padding-right: 20px;
    margin: 0;
  }

  li
  {
    margin: 0;
  }
`;

const Comp: React.FC = () =>
{
  return (
    <Container>
      <ul>
        <li style={{ color: COLORS[0] }} >
          ผ่านแล้ว
        </li>
      </ul>
      <ul>
        <li style={{ color: COLORS[1] }} >
          ยังไม่ผ่าน
        </li>
      </ul>
    </Container>
  );
}

export default Comp;