import styled from "styled-components";
import {
  space,
  border,
  color,
  typography,
  layout,
  position,
  flexbox,
} from "styled-system";

const Box = styled.div`
  ${border};
  ${space};
  ${color};
  ${typography};
  ${layout};
  ${position};
  ${flexbox};
`;
export default Box;
