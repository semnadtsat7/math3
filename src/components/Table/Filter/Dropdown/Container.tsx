import styled from 'styled-components';

export type ContainerProps =
{
  width: number | string;
  align?: 'left' | 'right';
}

const Container = styled.div<ContainerProps>`
  /* width: 160px; */

  padding: 4px;
  flex-shrink: 0;

  display: flex;

  flex-direction: column;
  flex-shrink: 0;

  align-items: flex-start;
  justify-content: center;

  ${props => typeof props.width === 'number' && `
    width: ${props.width}px;
  `}

  ${props => typeof props.width === 'string' && `
    width: ${props.width};
  `}

  ${props => props.align === "right" && `
    align-items: flex-end;
  `}
`

export default Container;