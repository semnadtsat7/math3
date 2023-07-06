import React from "react";

import { Box, Card, Statistic } from "../../../core/components";
import { FaChalkboardTeacher } from "react-icons/fa";

import styled from "styled-components";
const AntStatistic = styled(Statistic)`
  .ant-statistic-title {
    font-size: 18px;
    color: #1c4e91;
  }

  .ant-statistic-content-suffix {
    font-size: 18px;
    padding-left: 10px;
  }

  .ant-statistic-content-value-int {
    font-size: 36px;
    color: #1C4E91;
  }
`;

export default function StatisticWithIconStudentLarge(props) {
  const {
    title,
    value,
    precision = 0,
    color = "#1c4e91",
    suffix,
    iconSize = "50px",
    height = "auto",
  } = props;

  return (
    <Card style={{ height: height }}>
      <FaChalkboardTeacher
        style={{ fontSize: iconSize, color: "#1c4e91", marginBottom: "5px" }}
      />
      <Box mt="2">
        <AntStatistic
          title={title}
          value={value}
          precision={precision}
          valueStyle={{ color: color, fontSize: '38px' }}
          suffix={suffix}
        />
      </Box>
    </Card>
  );
}
