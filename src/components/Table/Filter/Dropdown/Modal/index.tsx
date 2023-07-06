import React from 'react';
import Layer from '../../../../Layer';

import Card from './Card';
import CardLabel from './CardLabel';
import CardContent from './CardContent';
import CardItem from './CardItem';

import Close from './Close';

export type ItemProps =
{
  value: string;
  label: string | number | React.ReactNode;
};

interface Props
{
  isOpen: boolean;

  label: string | number | React.ReactNode;
  items: ItemProps[];

  value?: string;

  onSelect?(value: string): void;
  onClose?(): void;
}

const Comp: React.FC<Props> = (
  {
    isOpen,

    label,
    items,

    value,

    onSelect,
    onClose,
  }
) =>
{
  function handleSelect (value: string)
  {
    if (typeof onSelect === 'function')
    {
      onSelect(value);
    }
  }

  return (
    <Layer 
      isOpen={isOpen} 
      layer={2}

      onClose={onClose}
    >
      <Card>
        <CardLabel>
          {label}
        </CardLabel>
        <CardContent>
          {
            items.map(
              item =>
              {
                return (
                  <CardItem
                    key={item.value}
                    isActive={item.value === value}
                    onClick={() => handleSelect(item.value)}
                  >
                    {item.label}
                  </CardItem>
                );
              }
            )
          }
        </CardContent>
      </Card>
      <Close onClick={onClose} />
    </Layer>
  );
}

export default Comp;