import React from "react";
import { Typography } from "antd";

const Text = (props) => {
  return <Typography {...props}>{props.children}</Typography>;
};

export default Text;
