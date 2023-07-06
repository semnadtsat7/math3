import styled from 'styled-components';

const Container = styled.div`
  margin: 16px 0;

  width: 100%;
  max-width: 360px;

  overflow: hidden;

  box-shadow: 0px 0px 4px rgba(0,0,0,0.25);
  border-radius: 4px;

  flex-shrink: 0;

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  > :first-child
  {
    margin-right: 12px;
  }
`;

export default Container;