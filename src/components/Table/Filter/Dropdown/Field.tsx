import styled from 'styled-components';

interface Props
{
  isOpen: boolean;
}

const Field = styled.div<Props>`
  padding-left: 7px;

  width: 100%;
  
  height: 24px;
  line-height: 22px;

  cursor: pointer;

  background-color: #fff;

  border-radius: 4px;
  border: 1px solid #d9d9d9;

  user-select: none;

  outline: none;

  display: flex;
  
  flex-direction: row;
  flex-wrap: nowrap;

  > span
  {
    flex-grow: 1;
    flex-shrink: 1;

    overflow: hidden;

    text-overflow: ellipsis;
    
    white-space: nowrap;
    word-break: keep-all;
  }

  > i
  {
    flex-shrink: 0;

    width: 24px;
    font-size: 12px;

    color: rgba(0,0,0,0.25);

    display: flex;

    align-items: center;
    justify-content: center;
    flex-direction: row;

    > svg
    {
      transition: transform 0.2s;
      transform: rotateZ(0deg);
    }
  }

  &:hover
  {
    border-color: #40a9ff;
  }

  ${props => props.isOpen && `
    > i > svg
    {
      transform: rotateZ(180deg);
    }
  `}
`

export default Field;