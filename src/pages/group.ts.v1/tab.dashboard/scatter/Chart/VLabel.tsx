import React from 'react';
import styled from 'styled-components';

import { LABEL_CHAR_WIDTH } from './constants';

interface XProps
{
  offset: number;
}

const X = styled.label<XProps>`
  margin-left: ${props => (props.offset * LABEL_CHAR_WIDTH) + 12}px;
  margin-top: 8px;
  margin-bottom: 16px;

  text-align: center;
`;

interface Props
{
  offset: number;
  label: string;
}

const Comp: React.FC<Props> = (
  {
    offset,
    label,
  }
) =>
{
  return (
    <X offset={offset} >{label}</X>
  );
}

export default Comp;