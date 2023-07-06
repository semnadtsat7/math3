import React from "react";
import { Divider, Card } from "../../../core/components";
import styled from "styled-components";

const AntMeta = styled(Card.Meta)`
  .ant-card-meta-title {
    color: #1c4e91;
    padding: 5px;
  }
`;

Card.Meta = AntMeta;

export default function CardWithTitleNoIcon(props) {
  const { title, extra, height = "auto" } = props;

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
        <Card.Meta title={title}/>

        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        {props.children}
      </Card>
    );
  }

  return getCard();
}
