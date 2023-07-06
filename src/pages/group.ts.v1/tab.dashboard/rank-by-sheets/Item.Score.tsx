import styled from 'styled-components';

interface Props
{
  
}

const Item = styled.div<Props>`
  padding: 2px 14px;

  line-height: 1.2;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;
  flex-shrink: 0;

  align-items: flex-end;
  justify-content: center;

  text-align: right;
`;

export default Item;