import styled from 'styled-components';

import
{
  TableCell,
} from '@material-ui/core';

const ClickableCell = styled(TableCell)`
  cursor: pointer;

  color: cornflowerblue;
  text-decoration: underline;

  &:hover
  {
    text-decoration: underline;
    background: rgba(0,0,0, 0.05);
  }
`;

export default ClickableCell;