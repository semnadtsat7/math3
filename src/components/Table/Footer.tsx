import React from 'react';
import styled from 'styled-components';

// import { Paper } from '@material-ui/core';

export const Container = styled.div`
  border-top: 1px solid #ddd;
  background: #f5f5f5;
  position: relative;

  &::before
  {
    content: '';

    position: absolute;

    left: 0;
    right: 0;

    top: 0;
    bottom: 0;

    width: 100%;
    height: 100%;

    box-shadow: 0 0 15px 8px rgba(0,0,0,0.05);
  }
`;

export const HorizontalScrollView = styled.div`
  position: relative;
  overflow: auto;
  
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;

  align-items: flex-end;

  padding: 0;

  ::-webkit-scrollbar
  {
    display: none;
  }
`

// Container.defaultProps = 
// {
//   elevation: 0,
// };

interface Props
{
  style?: React.CSSProperties;
}

const Comp: React.FC<Props> = (
  {
    style,
    children,
  }
) =>
{
  return (
    <Container style={style} >
      <HorizontalScrollView>
        {children}
      </HorizontalScrollView>
    </Container>
  )
}

export default Comp