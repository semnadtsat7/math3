import React, { useState, useMemo } from 'react';

import { Icon } from 'antd';

import Container from './Container';

import Field from './Field';

import Modal, { ItemProps } from '../../../Dropdown/Modal';

type Props =
{
  label: string;
  value: string;

  items: ItemProps[];

  onChange?(value: string): void;
};

function getLabel (value: string | undefined, items: ItemProps[])
{
  for (const item of items) 
  {
    if (item.value === value)
    {
      return item.label;
    }  
  }

  return items[0].label;
}

const Comp: React.FC<Props> = (
  {
    label,
    value,

    items,

    onChange,
  }
) =>
{
  const [isOpen, setOpen] = useState(false);
  const fieldLabel = useMemo(() => getLabel(value, items), [value, items]);

  function handleOpen ()
  {
    setOpen(true);
  }

  function handleClose ()
  {
    setOpen(false);
  }

  function handleSelect (value: string)
  {
    setOpen(false);
    
    if (typeof onChange === 'function')
    {
      onChange(value);
    }
  }

  return (
    <Container>
      <Field 
        isOpen={isOpen}
        onClick={handleOpen}
      >
        <span>{fieldLabel}</span>
        <Icon type="down" />
      </Field>
      <Modal
        value={value}
        
        label={label}
        items={items}

        isOpen={isOpen}

        onSelect={handleSelect}
        onClose={handleClose}
      />
    </Container>
  );
}

export default Comp;