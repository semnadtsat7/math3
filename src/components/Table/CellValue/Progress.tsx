import React from 'react';
import styled from 'styled-components';

const BG = `#d2d3d4`;
const FG = `#0d8efb`;

const Container = styled.div`
  position: relative;

  background-color: ${BG};

  flex-shrink: 0;

  min-width: 48px;

  width: 48px;
  height: 4px;

  margin: 6px 0 6px auto;
  border-radius: 4px;

  overflow: hidden;
`;

const Bar = styled.div`
  position: absolute;

  left: 0;
  top: 0;
  bottom: 0;

  background-color: ${FG};

  height: 100%;
`;

interface Props
{
  // percentage: 0 to 100
  value?: number;
}

function trim (value: number | undefined)
{
  const v = value || 0;

  if (v < 0)
  {
    return 0;
  }

  if (v > 100)
  {
    return 100;
  }

  return v;
}

const Comp: React.FC<Props> = (
  {
    value,
  }
) =>
{
  return (
    <Container>
      <Bar style={{ right: `${100 - trim(value)}%` }} />
    </Container>
  );
}

Comp.defaultProps = 
{
  value: 0,
}

export default Comp;