import React from "react";
import { Divider, Card } from "../../../core/components";
import styled from "styled-components";

const AntMeta = styled(Card.Meta)`
  .ant-card-meta-title {
    color: #1c4e91;
    padding: 5px;
  }

  .ant-card-meta-avatar {
    color: #1c4e91;
    font-size: 25px;
    padding: 5px;
  }
`;

Card.Meta = AntMeta;

export default function CardWithTitle(props) {
  const { title, icon, extra, height = "auto" } = props;

  function getCard() {
    if (extra) {
      return (
        <Card className="w-100" title={title} extra={extra}>
          {props.children}
        </Card>
      );
    }

    return (
      <Card className="w-100" style={{ height: height }}>
        <Card.Meta title={title} avatar={icon} />

        <Divider style={{ marginTop: 0, marginBottom: 10 }} />
        {props.children}
      </Card>
    );
  }

  return getCard();
}
