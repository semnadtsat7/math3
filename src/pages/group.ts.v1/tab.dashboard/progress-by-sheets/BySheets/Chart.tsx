import React from 'react';
import styled from 'styled-components';

import { Sheet } from '.';

import Track from './ChartTrack';
import Row from './Row';

const Container = styled.div`
  width: 100%;

  position: relative;
  padding-bottom: 16px;
`;

interface Props
{
  sheets: Sheet[];
}

const Comp: React.FC<Props> = (
  {
    sheets,
  }
) =>
{
  return (
    <Container>
      <Track label="0%" scale={0} color="#999" />
      <Track label="12.5%" scale={0.125} color="#d9d9d9" level={2} />
      <Track label="25%" scale={0.25} />
      <Track label="37.5%" scale={0.375} color="#d9d9d9" level={2} />
      <Track label="50%" scale={0.5} />
      <Track label="62.5%" scale={0.625} color="#d9d9d9" level={2} />
      <Track label="75%" scale={0.75} />
      <Track label="87.5%" scale={0.875} color="#d9d9d9" level={2} />
      <Track label="" scale={1} />
      
      {
        sheets.map(
          (sheet) =>
          {
            return (
              <Row 
                key={sheet.title}
                sheet={sheet}
              />
            );
          }
        )
      }
    </Container>
  );
}

export default Comp;