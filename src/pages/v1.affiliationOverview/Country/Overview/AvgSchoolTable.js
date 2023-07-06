import React, { useState } from "react";

import { Box, Table } from "../../../../core/components";
import {} from "../../../../components/Statistics";

import {} from "@ant-design/icons";

import "antd/dist/antd.css";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function AvgSchoolTable(props) {
  const { datasource, loading, /*province*/ } = props;
/*
  datasource.map((e) => {
    e.province = province;
  });
*/
  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  const [page, setPage] = useState(1);

  const columns = [
    {
      title: "#",
      dataIndex: "rowKey",
      key: "rowKey",
      render: (value, item, index) => {
        return <Box>{(page - 1) * 10 + index + 1}</Box>;
      },
      width: '10%',
    },
    {
      title: "ชื่อโรงเรียน",
      dataIndex: "data.name.thai",
      key: "schoolName",
      sorter: (a, b) =>
        typeof a.data?.name?.thai === "string" &&
        typeof b.data?.name?.thai === "string" &&
        a.data?.name?.thai.toLowerCase().localeCompare(b.data?.name?.thai.toLowerCase()),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="ค้นหาตามชื่อโรงเรียน"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              ค้นหา
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              รีเซ็ต
            </Button>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.schoolName.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "เขตพื้นที่การศึกษา",
      dataIndex: "data.educationServiceArea",
      key: "esa",
      sorter: (a, b) => {
        if (a && a.data?.educationServiceArea && b && a.data?.educationServiceArea) {
          return a.data?.educationServiceArea.toLowerCase().localeCompare(b.data?.educationServiceArea.toLowerCase());
        } else if (a && a.data?.educationServiceArea) {
          // That means b has null abbreviationThai, so a will come first.
          return -1;
        } else if (b && b.data?.educationServiceArea) {
          // That means a has null abbreviationThai, so b will come first.
          return 1;
        }
        // Both roles have null abbreviationThai, so there will be no order change.
        return 0;
      },
    },
    {
      title: "จังหวัด",
      dataIndex: "data.addresses.[0].province",
      key: "province",
      sorter: (a, b) =>
      typeof a.data?.addresses?.[0]?.province === "string" &&
      typeof b.data?.addresses?.[0]?.province === "string" &&
      a.data?.addresses?.[0]?.province.toLowerCase().localeCompare(b.data?.addresses?.[0]?.province.toLowerCase()),
      render: (value, row, index) => {
        return <Box>{value ?? value}</Box>;
      },
    },
    // {
    //   title: "สังกัด",
    //   dataIndex: "affiliation",
    //   key: "affiliation",
    //   render: (value, row, index) => {
    //     return <Box>{value ?? value[0]}</Box>;
    //   },
    // },
    {
      title: "แบบฝึกหัดที่ทำ",
      dataIndex: "statistics.total.metrics.percentage",
      key: "percentage",
      sorter: (a, b) => a.statistics?.total?.metrics?.percentage - b.statistics?.total?.metrics?.percentage,
      render: (value, row, index) => {
        return <Box>{value?.toFixed(2) || 0}%</Box>;
      },
    },
    {
      title: "จำนวนนักเรียน",
      dataIndex: "statistics.total.totalStudents",
      key: "totalStudents",
      sorter: (a, b) => a.statistics?.total?.totalStudents - b.statistics?.total?.totalStudents,
      render: (value, row, index) => {
        return <Box>{value || 0}&nbsp;คน</Box>;
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
          sortDirections={["descend", "ascend"]}
          onChange={onChange}
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
