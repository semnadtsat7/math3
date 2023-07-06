import React from "react";
import { Spin as AntSpin } from "antd";

import styled from "styled-components";
import { space } from "styled-system";

import { LoadingOutlined } from "@ant-design/icons";

const SpinComponent = styled(AntSpin)`
  ${space};
`;

const Spin = (props) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <SpinComponent indicator={antIcon} {...props}>
      {props.children}
    </SpinComponent>
  );
};

export default Spin;
