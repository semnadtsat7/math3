import React from 'react';
import styled from 'styled-components';

import { Button } from 'antd';

const Container = styled.div`
  margin: 16px 0;

  width: 100%;
  max-width: 360px;

  overflow: hidden;

  box-shadow: 0px 0px 4px rgba(0,0,0,0.25);
  border-radius: 4px;

  flex-shrink: 0;

  background-color: white;
`;

interface Props
{
  onClick?(): void;
}

const Comp: React.FC<Props> = (
  {
    onClick,
  }
) =>
{
  return (
    <Container>
      <Button
        type="default"
        block={true}
        onClick={onClick}
        style={{marginTop: "0px"}}
      >
        ปิดหน้าต่าง
      </Button>
    </Container>
  )
}

export default Comp;