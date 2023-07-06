// import React from 'react';
// import { Link, LinkProps } from 'react-router-dom';

import styled from 'styled-components';

interface Props
{
}

const Item = styled.div<Props>`
  padding: 12px 14px;

  color: #333;

  line-height: 1.7;

  transition: color 0.2s;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;
  
  a
  {
    text-decoration: underline;
    cursor: pointer;
  }

  &:not(:last-child)
  {
    border-bottom: 1px solid #e8e8e8;
  }

  /* &:hover
  {
    background-color: rgba(64, 169, 255, 0.05);
    color: #40a9ff;
  } */
`;

export default Item;

// const Comp: React.FC<LinkProps> = (
//   {
//     children,
//   }
// ) =>
// {
//   return (
//     <Item>
//       {children}
//     </Item>
//   );
// }

// export default Comp;