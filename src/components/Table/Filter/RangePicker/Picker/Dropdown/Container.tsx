import styled from 'styled-components';

export type ContainerProps =
{
  
}

const Container = styled.div<ContainerProps>`
  display: flex;

  flex-direction: column;
  flex-shrink: 1;
  flex-grow: 1;

  align-items: flex-start;
  justify-content: center;
`

export default Container;