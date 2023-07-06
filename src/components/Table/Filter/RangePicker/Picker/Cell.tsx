import styled from 'styled-components';

interface CellProps
{
  state: string;
}

const Cell = styled.div<CellProps>`
  text-align: center;

  transition: color 0.2s, background-color 0.2s;
  
  cursor: pointer;

  line-height: 22px;

  height: 24px;
  margin: 0 -1px;

  &:hover
  {
    background-color: rgba(0, 128, 255, 0.25);
  }

  ${props => props.state === 'startAt' && `
    background-color: #1890ff;
    color: white;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  `}

  ${props => props.state === 'endAt' && `
    background-color: #1890ff;
    color: white;

    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  `}

  ${props => props.state === 'startAndEnd' && `
    background-color: #1890ff;
    color: white;

    border-radius: 10px;
  `}

  ${props => props.state === 'inner' && `
    background-color: rgba(24,144,255, 0.5);
    color: white;
  `}

  ${props => props.state === 'outer' && `
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.25;
  `}
`;

export default Cell;