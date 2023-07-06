import React from "react";

import { Card, Statistic } from "../../../core/components";
import styled from "styled-components";

const AntStatistic = styled(Statistic)`
  .ant-statistic-title {
    font-size: 14px;
    color: black;
  }

  .ant-statistic-content-suffix {
    font-size: 18px;
    padding-left: 10px;
  }

  .ant-statistic-content-value-int {
    font-size: 38px;
    color: #1c4e91;
  }

  .ant-statistic-content-value-decimal {
    font-size: 38px;
    color: #1c4e91;
  }
`;

export default function StatisticWithTextLarge(props) {
  const {
    title,
    value,
    precision = 0,
    color = "#1c4e91",
    suffix,
    height = "auto",
    valueSize = "24px",
  } = props;

  return (
    <Card style={{ height: height }}>
      <AntStatistic
        title={title}
        value={value}
        precision={precision}
        valueStyle={{ color: color, fontSize: valueSize }}
        suffix={suffix}
      />
    </Card>
  );
}
