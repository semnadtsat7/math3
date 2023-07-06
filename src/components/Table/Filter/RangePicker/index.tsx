import React, { useState, useMemo } from 'react';

import { Icon } from 'antd';

import { getDateString } from './utils';

import Container from '../Dropdown/Container';

import Label from '../Dropdown/Label';

import Field from './Field';
import Picker from './Picker';

type Props =
{
  align?: 'left' | 'right';

  label: string;
  value: number[];

  onChange?(value: number[]): void;
};

const Comp: React.FC<Props> = (
  {
    align,

    label,
    value,

    onChange,
  }
) =>
{
  const [isOpen, setOpen] = useState(false);
  // const [v, setV] = useState(value);

  const label1 = useMemo(() => getDateString(value[0]), [value]);
  const label2 = useMemo(() => getDateString(value[1]), [value]);

  function handleOpen ()
  {
    setOpen(true);
  }

  function handleClose ()
  {
    setOpen(false);
  }

  function handleSubmit (value: number[])
  {
    if (onChange)
    {
      onChange(value);
    }

    setOpen(false);
  }

  return (
    <Container
      align={align}
      width={300}
    >
      <Label>
        {label}
      </Label>
      <Field onClick={handleOpen} >
        <span>{label1}</span>
        <span> ~ </span>
        <span>{label2}</span>
        <Icon type="calendar" />
      </Field>
      <Picker 
        isOpen={isOpen}
        label={label}
        value={value}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}

export default Comp;