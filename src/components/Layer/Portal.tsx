import React from 'react';
import { createPortal } from 'react-dom';

interface Props
{
  isOpen: boolean;
}

const Comp: React.FC<Props> = (
  {
    isOpen,
    children,
  }
) =>
{
  if (!isOpen)
  {
    return null;
  }

  return createPortal(children, document.body);
}

export default Comp;