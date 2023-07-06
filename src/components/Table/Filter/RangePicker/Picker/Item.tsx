import React from 'react';
import styled from 'styled-components';

interface ItemProps
{
  title?: string;
  isFocus: boolean;
  
  onClick?(): void;
}

const Item = styled.span<ItemProps>`
  transition: color 0.2s;
  text-decoration: underline;

  cursor: pointer;

  ${props => props.isFocus && `
    color: #40a9ff;
  `}
`;

const Comp: React.FC<ItemProps> = (
  {
    title,
    isFocus,
    onClick,
    children,
  }
) =>
{
  return (
    <Item 
      title={title}
      isFocus={isFocus} 
      onClick={onClick}
    >
      {children}
    </Item>
  );
}

export default Comp;