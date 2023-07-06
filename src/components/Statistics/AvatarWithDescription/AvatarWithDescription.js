import React from "react";
import { Link } from "react-router-dom";
import { Box, Avatar } from "../../../core/components";

export default function AvatarWithDescription(props) {
  const { title, email, phone, to } = props;

  return (
    <Link to={to}>
      <Box display="flex">
        <Box>
          <Avatar
            style={{ width: 60, height: 60 }}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          ></Avatar>
        </Box>
        <Box pl="3">
          <p className="mb-0" style={{ color: "#1890ff" }}>
            {title}
          </p>
          <p className="mb-0 text-gray">{email}</p>
          <p className="text-gray text-italic">{phone}</p>
        </Box>
      </Box>
    </Link>
  );
}
