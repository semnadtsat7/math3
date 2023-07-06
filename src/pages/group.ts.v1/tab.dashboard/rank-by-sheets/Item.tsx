import styled from 'styled-components';

interface Props
{
  
}

const Item = styled.a<Props>`
  /* padding: 12px 14px 12px 24px; */

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  align-items: stretch;
  justify-content: stretch;

  color: #333;

  line-height: 1.7;

  transition: color 0.2s;

  background-color: #fcfcfc;

  &:not(:last-child)
  {
    border-bottom: 1px solid #d9d9d9;
  }

  ${props => !props.onClick && `
    pointer-events: none;
  `}

  ${props => props.onClick && `
    cursor: pointer;

    &:hover
    {
      background-color: rgba(64, 169, 255, 0.05);
      color: #40a9ff;
    }
  `}
`;

export default Item;