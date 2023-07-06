import styled from 'styled-components';

const Card = styled.div`
  margin: 0;
  padding: 0;

  max-height: 500px;
  max-width: 360px;

  width: 100%;
  
  overflow: hidden;

  background: white;
  box-shadow: 0px 0px 4px rgba(0,0,0,0.25);

  border: none;
  border-radius: 4px;

  min-height: 100px;
  min-width: 240px;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;
`;

export default Card;