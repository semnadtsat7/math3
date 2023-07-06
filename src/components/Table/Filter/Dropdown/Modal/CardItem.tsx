import React, { useEffect, createRef } from 'react';
import styled from 'styled-components';

interface Props
{
  isActive?: boolean;
  onClick?(): void;
}

const Item = styled.div<Props>`
  padding: 12px 14px;

  color: #333;
  cursor: pointer;

  line-height: 1.7;

  transition: color 0.2s;

  &:not(:last-child)
  {
    border-bottom: 1px solid #e8e8e8;
  }

  &:hover
  {
    background-color: rgba(64, 169, 255, 0.05);
    color: #40a9ff;
  }

  ${props => props.isActive && `
    pointer-events: none;

    background-color: rgba(64, 169, 255, 0.2);
    color: #40a9ff;
  `}
`;

const Comp: React.FC<Props> = (
  {
    isActive,
    onClick,

    children,
  }
) =>
{
  const ref = createRef<HTMLDivElement>();

  function handleMount ()
  {
    if (isActive)
    {
      const node = ref.current;
      const parent = node?.parentElement;
      
      if (node && parent)
      {
        const pb = parent.getBoundingClientRect();
        const pbc = pb.top + (pb.height / 2);

        const nb = node.getBoundingClientRect();
        const nbc = nb.top + (nb.height / 2);

        const diff = nbc - pbc;
        
        parent.scrollTop = diff;
      }
    }
  }

  useEffect(handleMount, [isActive]);

  return (
    <Item 
      ref={ref}
      isActive={isActive}
      onClick={onClick}
    >
      {children}
    </Item>
  );
}

export default Comp;