import styled from 'styled-components';

interface ListProps
{
  isLoading: boolean;
}

const List = styled.div<ListProps>`
  width: 100%;

  ${props => props.isLoading && `
    pointer-events: none;
    opacity: 0.5;
  `}
`;

export default List;