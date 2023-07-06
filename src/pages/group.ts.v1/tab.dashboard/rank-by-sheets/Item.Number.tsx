import styled from 'styled-components';

interface Props
{
  
}

const Item = styled.div<Props>`
  padding: 12px 14px;

  border-right: 1px solid #e8e8e8;
  background-color: white;

  flex-shrink: 0;

  text-align: right;
`;

export default Item;