import React from "react";
import { Avatar, Box, Span } from "../../../core/components";

export default function ScoreRange(props) {
  const { name, percentage, color } = props;

  return (
    <Box display="flex">
      <Box flex={1}>
        <Avatar shape="square" size={15} style={{ backgroundColor: color }} />
        <Span className="ml" style={{ fontSize: 12 }}>
          {name}
        </Span>
      </Box>
      <Box flex={1}>
        <Span style={{ fontSize: 12 }}>{percentage}</Span>
      </Box>
    </Box>
  );
}
