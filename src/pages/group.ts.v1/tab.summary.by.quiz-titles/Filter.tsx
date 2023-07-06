import React from 'react'
import styled from 'styled-components'

import Flexbox from '../../../components/Flexbox';
import Footer from '../../../components/Table/Footer';

interface IField
{
  align?: string;
}

const Field = styled.div<IField>`
    padding: 4px;
    flex-shrink: 0;

    display: flex;

    flex-direction: column;

    align-items: flex-start;
    justify-content: center;

    ${props => props.align === "right" && `
        align-items: flex-end;
    `}
`

interface Props
{
  extra?: any;
}

const Comp: React.FC<Props> = (
  {
    extra,
  }
) =>
{
  return (
    <Footer>

      {
        extra &&
        <Field>
          {extra}
        </Field>
      }
      
      <Flexbox />
    </Footer>
  )
}

export default Comp