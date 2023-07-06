import React, { useState } from "react";

import { Box, Table } from "../../../../core/components";
import {} from "../../../../components/Statistics";

import {} from "@ant-design/icons";

import "antd/dist/antd.css";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function AvgSchoolTable(props) {
  const { datasource, loading, province } = props;

  datasource.map((e) => {
    e.province = province;
  });

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
      dataIndex: "schoolName",
      key: "schoolName",
      sorter: (a, b) =>
        typeof a.schoolName === "string" &&
        typeof b.schoolName === "string" &&
        a.schoolName.toLowerCase().localeCompare(b.schoolName.toLowerCase()),
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
      dataIndex: "educationServiceArea",
      key: "educationServiceArea",
      sorter: (a, b) => {
        if (a && a.educationServiceArea && b && b.educationServiceArea) {
          return a.educationServiceArea.toLowerCase().localeCompare(b.educationServiceArea.toLowerCase());
        } else if (a && a.educationServiceArea) {
          // That means b has null abbreviationThai, so a will come first.
          return -1;
        } else if (b && b.educationServiceArea) {
          // That means a has null abbreviationThai, so b will come first.
          return 1;
        }
        // Both roles have null abbreviationThai, so there will be no order change.
        return 0;
      },
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "สังกัด",
      dataIndex: "affiliation",
      key: "affiliation",
      sorter: (a, b) => {
        if (a && a.affiliation[0] && b && b.affiliation[0]) {
          return a.affiliation[0]
            .toLowerCase()
            .localeCompare(b.affiliation[0].toLowerCase());
        } else if (a && a.affiliation[0]) {
          // That means b has null abbreviationThai, so a will come first.
          return -1;
        } else if (b && b.affiliation[0]) {
          // That means a has null abbreviationThai, so b will come first.
          return 1;
        }
        // Both roles have null abbreviationThai, so there will be no order change.
        return 0;
      },
    },
    {
      title: "แบบฝึกหัดที่ทำ",
      dataIndex: "percentage",
      key: "percentage",
      sorter: (a, b) => a.percentage - b.percentage,
      render: (value, row, index) => {
        return <Box>{value.toFixed(2)}</Box>;
      },
    },
    {
      title: "จำนวนนักเรียน",
      dataIndex: "totalStudents",
      key: "totalStudents",
      sorter: (a, b) => a.totalStudents - b.totalStudents,
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
