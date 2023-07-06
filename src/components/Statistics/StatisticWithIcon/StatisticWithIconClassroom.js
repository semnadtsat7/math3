import React from "react";
import { Card, Statistic } from "../../../core/components";
import { SiGoogleclassroom } from "react-icons/si";

import styled from "styled-components";
const AntStatistic = styled(Statistic)`
  .ant-statistic-title {
    font-size: 12px;
    color: #1c4e91;
  }

  .ant-statistic-content-suffix {
    font-size: 14px;
    padding-left: 10px;
  }
`;

export default function StatisticWithIconClassroom(props) {
  const {
    title,
    value,
    precision = 0,
    color = "#1c4e91",
    suffix,
    iconSize = "50px",
    height = "auto",
    active = false,
  } = props;

  return (
    <Card style={{ height: height, border: active ? "1.5px solid #1c4e91" : "1.5px solid #e8e8e8" }}>
      <SiGoogleclassroom
        style={{ fontSize: iconSize, color: "#1c4e91", marginBottom: "5px" }}
      />
      <AntStatistic
        title={title}
        value={value}
        precision={precision}
        valueStyle={{ color: color }}
        suffix={suffix}
      />
    </Card>
  );
}
