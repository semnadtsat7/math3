import React, { useState } from "react";

import { Box, Table } from "../../../core/components";
import {} from "../../../components/Statistics";

import {} from "@ant-design/icons";

import { Empty } from "antd";

export default function Top5BestTable(props) {
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
      title: "ชื่อนักเรียน",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "คะแนน",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) => a.score - b.score,
      defaultSortOrder: "descend",
      render: (value, row, index) => {
        return <Box>{value || 0}</Box>;
      },
    },
  ];

  function getLoading() {
    return (
      <>
        <div>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        </div>
      </>
    );
  }

  return (
    <>
      <Box>
        {loading ? (
          getLoading()
        ) : (
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
        )}
      </Box>
    </>
  );
}
