import styled from 'styled-components';

interface Props
{
  
}

const Item = styled.a<Props>`
  padding: 16px 14px 10px;

  font-weight: bold;

  color: #333;

  line-height: 1.7;

  transition: color 0.2s;

  text-decoration: underline;

  display: flex;

  flex-shrink: 0;

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
      text-decoration: underline;

      background-color: rgba(64, 169, 255, 0.05);
      color: #40a9ff;
    }
  `}
`;

export default Item;