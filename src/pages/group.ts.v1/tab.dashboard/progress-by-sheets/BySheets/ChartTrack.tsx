import styled from 'styled-components';
import { OFFSET } from './constants';

interface TrackProps
{
  label: string;
  scale: number;

  color?: string;

  level?: number;
}

const Track = styled.span<TrackProps>`
  position: absolute;

  top: 0;
  bottom: 16px;

  border-left: 1px solid ${props => props.color};

  &::after
  {
    position: absolute;

    bottom: -16px;
    left: -6px;

    font-size: 0.8em;

    content: '${props => props.label}';
    color: #333;
  }

  left: calc(${OFFSET.XS}px + ((100% - ${OFFSET.XS}px) * ${props => props.scale}));

  @media (min-width: 576px)
  {
    left: calc(${OFFSET.SM}px + ((100% - ${OFFSET.SM}px) * ${props => props.scale}));
  }

  @media (min-width: 768px)
  {
    left: calc(${OFFSET.MD}px + ((100% - ${OFFSET.MD}px) * ${props => props.scale}));
  }

  @media (min-width: 992px)
  {
    left: calc(${OFFSET.LG}px + ((100% - ${OFFSET.LG}px) * ${props => props.scale}));
  }

  @media (min-width: 1200px)
  {
    left: calc(${OFFSET.XL}px + ((100% - ${OFFSET.XL}px) * ${props => props.scale}));
  }

  ${props => props.level === 2 && `
    &::after
    {
      bottom: -12px;
      left: -6px;

      font-size: 0.6em;
      color: #999;
    }

    @media (max-width: 1199px)
    {
      display: none;
    }
  `}
`;

Track.defaultProps = 
{
  color: '#c5c5c5',
};

export default Track;