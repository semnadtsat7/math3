import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { EnvironmentFilled as AntEnvironmentFilled } from "@ant-design/icons";

const EnvironmentFilled = styled(AntEnvironmentFilled)`
  font-size: 32px;
  color: #dc442c;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 1;
  }
`;

const Marker = ({ text, onClick }) => (
  <EnvironmentFilled alt={text} onClick={onClick} />
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;
