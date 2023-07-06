import React from "react";
import {} from "react-router-dom";
import { Progress, Avatar, Box } from "../../../core/components";

export default function AvatarWithProgress(props) {
  const { color, icon, title, value } = props;

  return (
    <Box display="flex">
      <Box>
        <Avatar
          style={{ backgroundColor: color, verticalAlign: "middle" }}
          size="large"
        >
          {icon}
        </Avatar>
      </Box>
      <Box pl="2" flex="1">
        <p className="mb-0">{title}</p>
        <Progress percent={value} strokeColor={color} />
      </Box>
    </Box>
  );
}
