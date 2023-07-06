import React, {useState} from "react";

import { Box, Table } from "../../../../core/components";
import {} from "../../../../components/Statistics";

import {} from "@ant-design/icons";

export default function OverviewTable(props) {
  const { datasource, loading } = props;

const [page, setPage] = useState(1);

const columns = [
  {
    title: "อันดับ",
    dataIndex: "rowKey",
    key: "rowKey",
    render: (value, item, index) => {
      return <Box>{(page - 1) * 10 + index + 1}</Box>;
    },
  },
  {
    title: "ชื่อโรงเรียน",
    dataIndex: "schoolName",
    key: "schoolName",
  },
  {
    title: "เขตพื้นที่การศึกษา",
    dataIndex: "educationServiceArea",
    key: "educationServiceArea",
    render: (value, row, index) => {
      return <Box>{value}</Box>;
    },
  },
  {
    title: "จำนวนนักเรียน",
    dataIndex: "totalStudents",
    key: "totalStudents",
  },
  {
    title: "คะแนนเฉลี่ย",
    dataIndex: "percentage",
    key: "percentage",
    sorter: (a, b) => a.percentage - b.percentage,
    defaultSortOrder: 'descend',
    render: (value, row, index) => {
      return <Box>{value?.toFixed(2) || 0}%</Box>;
    },
  },
];

  return (
    <>
    <Box>
      <Table
        dataSource={datasource}
        loading={loading}
        columns={columns}
        rowKey="rowKey"
        pagination={{
          onChange(current) {
            setPage(current);
          },
        }}
      />
    </Box>
    </>
  );
}
