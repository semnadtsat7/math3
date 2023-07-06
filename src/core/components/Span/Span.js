import React from "react";

import styled from "styled-components";
import { space, layout, typography, color } from "styled-system";

const TextComponent = styled.span`
  ${space}l
  ${layout};
  ${typography};
  ${color};
`;

const Span = (props) => {
  return <TextComponent {...props}>{props.children}</TextComponent>;
};

export default Span;
