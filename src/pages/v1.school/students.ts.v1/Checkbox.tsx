import React from 'react';
import styled from 'styled-components';

import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const Action = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

interface Props
{
  value: boolean;
  onChange(value: boolean): void;
}

const Comp: React.FC<Props> = (
  {
    value,
    onChange,
  }
) =>
{
  function handleChange (e: CheckboxChangeEvent)
  {
    if (onChange)
    {
      onChange (e.target.checked);
    }
  }

  return (
    <Action>
      <Checkbox 
        checked={value}
        onChange={handleChange}
      />
    </Action>
  )
};

export default Comp;