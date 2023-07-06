import styled from 'styled-components';

interface Props
{
  
}

const Item = styled.div<Props>`
  padding: 12px 14px;
  
  flex-grow: 1;
  flex-shrink: 1;

  text-decoration: underline;
`;

export default Item;