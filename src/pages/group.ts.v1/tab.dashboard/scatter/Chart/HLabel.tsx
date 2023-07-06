import React from 'react';
import styled from 'styled-components';

const Y = styled.label`
  transform: rotate(-90deg);

  margin-right: 2px;
  margin-bottom: 30px;
`;

interface Props
{
  label: string;
}

const Comp: React.FC<Props> = (
  {
    label,
  }
) =>
{
  return (
    <Y>{label}</Y>
  );
}

export default Comp;