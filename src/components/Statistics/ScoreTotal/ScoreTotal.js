import React from "react";
import { Avatar, Box, Span } from "../../../core/components";

export default function ScoreTotal(props) {
  const { name, color, fontSize = 16, size = 30 } = props;

  return (
    <Box display="flex">
      <Box flex={1}>
        <Avatar shape="square" size={size} style={{ backgroundColor: color }} />
        <Span className="ml" style={{ fontSize: fontSize, color: color }}>
          {name}
        </Span>
      </Box>
    </Box>
  );
}
