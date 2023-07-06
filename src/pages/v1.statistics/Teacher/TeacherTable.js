import React, { useRef, useState, useEffect } from "react";

import { Row, Col } from "antd";
import { Box, Table } from "../../../core/components";
import {
  ProgressForClass,
  AvatarWithDescription,
} from "../../../components/Statistics";

import {} from "@ant-design/icons";

// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
const renderContent = (value, row, index) => {
  const items = Object.entries(value);
  return {
    children: (
      <Row gutter={[8, 8]}>
        {items.map((item, i) => {
          return (
            <Col key={i}>
              <ProgressForClass key={i} name={item[0]} value={item[1]} />
            </Col>
          );
        })}
      </Row>
    ),
    props: {},
  };
};

const userId = window.localStorage.getItem("local_id");

export default function TeacherTable(props) {
  const { datasource, loading } = props;

  useEffect(() => {}, [datasource, loading]);

  const columns = [
    {
      title: "ชื่อคุณครู",
      dataIndex: "userProfile",
      width: 220,
      render: (value, row, index) => {
        return (
          <AvatarWithDescription
            id={row.key}
            title={`${value.namePrefix} ${value.firstName} ${value.lastName}`}
            email={value.email}
            phone={value.phoneNumber}
            //to={`/statistics/teacher/${userId}?name=${value.namePrefix} ${value.firstName} ${value.lastName}`}
          />
        );
      },
    },
    {
      title: "บทเรียนล่าสุด",
      colSpan: 6,
      dataIndex: "classroom",
      render: renderContent,
    },
  ];

  return (
    <Box>
      <Table
        dataSource={datasource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </Box>
  );
}
