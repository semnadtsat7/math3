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
    dataIndex: "data.name.thai",
    key: "schoolName",
  },
  {
    title: "เขตพื้นที่การศึกษา",
    dataIndex: "data.educationServiceArea",
    key: "esa",
    render: (value, row, index) => {
      return <Box>{value}</Box>;
    },
  },
  {
    title: "จำนวนนักเรียน",
    dataIndex: "statistics.total.totalStudents",
    key: "totalStudents",
  },
  {
    title: "คะแนนเฉลี่ย",
    dataIndex: "statistics.total.metrics.averagePass",
    key: "percentage",
    sorter: (a, b) => a.statistics.total.metrics.averagePass - b.statistics.total.metrics.averagePass,
    defaultSortOrder: 'descend',
    render: (value, row, index) => {
      return <Box>{value/*?.toFixed(1)*/ || 0}%</Box>;
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
