import React from 'react';
import Layer from '../../Layer';

import Card from '../Filter/Dropdown/Modal/Card';
import CardContent from '../Filter/Dropdown/Modal/CardContent';
import Close from '../Filter/Dropdown/Modal/Close';

interface Props
{
  isOpen: boolean;
  onClose?(): void;
}

const Comp: React.FC<Props> = (
  {
    isOpen,
    onClose,
    children,
  }
) =>
{
  return (
    <Layer 
      isOpen={isOpen} 
      layer={1}

      onClose={onClose}
    >
      <Card>
        <CardContent>
          {children}
        </CardContent>
        {/* <CardLabel>
          {label}
        </CardLabel>
        <CardContent>
          {children}
        </CardContent> */}
      </Card>
      <Close onClick={onClose} />
    </Layer>
  );
}

export default Comp;