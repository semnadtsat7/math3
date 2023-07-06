import React from "react";
import { Card, Avatar } from "../../../core/components";
import styled from "styled-components";

const AntMeta = styled(Card.Meta)`
  .ant-card-meta-title {
    color: #1c4e91;
    padding: 10px 0 0 0;
    margin-bottom: 0 !important;
  }

  .ant-card-meta-avatar {
    color: #1c4e91;
    font-size: 35px;
    padding: 5px;
  }
`;

Card.Meta = AntMeta;

export default function CardWithAvatar(props) {
  const { title, description } = props;

  return (
    <Card className="w-100">
      <Card.Meta
        avatar={
          <Avatar
            style={{ width: 60, height: 60 }}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        }
        title={title}
        description={description}
      />
    </Card>
  );
}
