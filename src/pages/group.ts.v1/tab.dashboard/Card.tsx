import styled from 'styled-components';

const Card = styled.div`
  margin: 6px;
  padding: 0;
  /* padding: 8px; */

  background: white;
  /* box-shadow: 1px 0px 5px rgba(0,0,0,0.125); */
  /* box-shadow: 0px 0px 4px rgba(0,0,0,0.2); */
  box-shadow: 0px 0px 4px rgba(0,0,0,0.05);

  border: 1px solid #d9d9d9;
  border-radius: 4px;

  min-height: 100px;

  > label
  {
    padding: 12px 14px;
    font-weight: bold;

    line-height: 1.7;

    display: flex;

    border-bottom: 1px solid #e8e8e8;
  }
`;

export default Card;