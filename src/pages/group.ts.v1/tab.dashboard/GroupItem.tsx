import styled from 'styled-components';

interface Breakpoints
{
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  xxl?: number | string;
}

interface ItemProps extends Breakpoints
{
  max?: Breakpoints;
}

const Item = styled.div<ItemProps>`
  ${props => props.xs && typeof props.xs === 'number' && `
    width: ${props.xs}px;
  `}

  ${props => props.xs && typeof props.xs === 'string' && `
    width: ${props.xs};
  `}

  ${props => props.max?.xs && typeof props.max?.xs === 'number' && `
    max-width: ${props.max?.xs}px;
  `}

  ${props => props.max?.xs && typeof props.max?.xs === 'string' && `
    max-width: ${props.max?.xs};
  `}
  /*  */

  ${props => props.sm && typeof props.sm === 'number' && `
    @media (min-width: 576px)
    {
      width: ${props.sm}px;
    }
  `}

  ${props => props.sm && typeof props.sm === 'string' && `
    @media (min-width: 576px)
    {
      width: ${props.sm};
    }
  `}

  ${props => props.max?.sm && typeof props.max?.sm === 'number' && `
    @media (min-width: 576px)
    {
      max-width: ${props.max?.sm}px;
    }
  `}

  ${props => props.max?.sm && typeof props.max?.sm === 'string' && `
    @media (min-width: 576px)
    {
      max-width: ${props.max?.sm};
    }
  `}
  /*  */

  ${props => props.md && typeof props.md === 'number' && `
    @media (min-width: 768px)
    {
      width: ${props.md}px;
    }
  `}

  ${props => props.md && typeof props.md === 'string' && `
    @media (min-width: 768px)
    {
      width: ${props.md};
    }
  `}

  ${props => props.max?.md && typeof props.max?.md === 'number' && `
    @media (min-width: 768px)
    {
      max-width: ${props.max?.md}px;
    }
  `}

  ${props => props.max?.md && typeof props.max?.md === 'string' && `
    @media (min-width: 768px)
    {
      max-width: ${props.max?.md};
    }
  `}
  /*  */

  ${props => props.lg && typeof props.lg === 'number' && `
    @media (min-width: 992px)
    {
      width: ${props.lg}px;
    }
  `}

  ${props => props.lg && typeof props.lg === 'string' && `
    @media (min-width: 992px)
    {
      width: ${props.lg};
    }
  `}

  ${props => props.max?.lg && typeof props.max?.lg === 'number' && `
    @media (min-width: 992px)
    {
      max-width: ${props.max?.lg}px;
    }
  `}

  ${props => props.max?.lg && typeof props.max?.lg === 'string' && `
    @media (min-width: 992px)
    {
      max-width: ${props.max?.lg};
    }
  `}
  /*  */

  ${props => props.xl && typeof props.xl === 'number' && `
    @media (min-width: 1200px)
    {
      width: ${props.xl}px;
    }
  `}

  ${props => props.xl && typeof props.xl === 'string' && `
    @media (min-width: 1200px)
    {
      width: ${props.xl};
    }
  `}

  ${props => props.max?.xl && typeof props.max?.xl === 'number' && `
    @media (min-width: 1200px)
    {
      max-width: ${props.max?.xl}px;
    }
  `}

  ${props => props.max?.xl && typeof props.max?.xl === 'string' && `
    @media (min-width: 1200px)
    {
      max-width: ${props.max?.xl};
    }
  `}
  /*  */

  ${props => props.xxl && typeof props.xxl === 'number' && `
    @media (min-width: 1600px)
    {
      width: ${props.xxl}px;
    }
  `}

  ${props => props.xxl && typeof props.xxl === 'string' && `
    @media (min-width: 1600px)
    {
      width: ${props.xxl};
    }
  `}

  ${props => props.max?.xxl && typeof props.max?.xxl === 'number' && `
    @media (min-width: 1600px)
    {
      max-width: ${props.max?.xxl}px;
    }
  `}

  ${props => props.max?.xxl && typeof props.max?.xxl === 'string' && `
    @media (min-width: 1600px)
    {
      max-width: ${props.max?.xxl};
    }
  `}
`;

Item.defaultProps = 
{
  xs: '100%',
};

export default Item;