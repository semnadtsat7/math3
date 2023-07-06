import React, { useMemo } from 'react';
import Portal from './Portal';

import styled from 'styled-components';

interface LayerProps
{
  zIndex: number;
}

const Layer = styled.div<LayerProps>`
  position: fixed;

  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background: rgba(0,0,0, 0.5);

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  align-items: center;
  justify-content: center;

  padding: 16px;

  ${props => props.zIndex > 0 && `
    z-index: ${props.zIndex};
  `}

  @media (min-width: 768px)
  {
    padding: 48px;
  }
`;

interface Props
{
  isOpen: boolean;
  layer?: number;

  onClose?(): void;
}

const Comp: React.FC<Props> = (
  {
    isOpen,
    layer,

    children,

    onClose,
  }
) =>
{
  const zIndex = useMemo(() => 12000 * (layer || 1), [layer]);

  function handleClose (e: React.MouseEvent<HTMLDivElement, MouseEvent>)
  {
    if (typeof onClose === 'function' && e.target === e.currentTarget)
    {
      onClose();
    }
  }

  return (
    <Portal isOpen={isOpen} >
      <Layer 
        zIndex={zIndex} 
        onClick={handleClose} 
      >
        {children}
      </Layer>
    </Portal>
  );
}

Comp.defaultProps = 
{
  layer: 1,
}

export default Comp;