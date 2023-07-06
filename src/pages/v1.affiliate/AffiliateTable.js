import React, { useRef, useState, useEffect, createRef } from "react";

import { Box, Table, Button } from "../../core/components";

import { } from "@ant-design/icons";
import { Popconfirm, message } from "antd";

import { AffiliateService } from "../../services/Affiliate";

export default function SchoolTable(props) {
  const { datasource, loading, role } = props;

  const [items, setItems] = useState([]);

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  useEffect(() => {
    setItems(datasource);
  }, [datasource]);

  const columns = [
    {
      title: "#",
      dataIndex: "affiliationsId",
      key: "affiliationsId",
      render: (value, row, index) => {
        return <Box>{index + 1}</Box>;
      },
    },
    {
      title: "สังกัด",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (typeof a.name?.thai === 'string' && typeof b.name?.thai === 'string'&& a.name?.thai.toLowerCase().localeCompare(b.name?.thai.toLowerCase())),
      render: (value, row, index) => {
        return <Box>{row?.name?.thai}</Box>;
      },
    },
    {
      title: "ตัวย่อ",
      dataIndex: "alias",
      key: "alias",
      sorter: (a, b) => {
        if (a && a.name?.abbreviationThai && b && b.name?.abbreviationThai) {
          return a.name?.abbreviationThai.toLowerCase().localeCompare(b.name?.abbreviationThai.toLowerCase());
        } else if (a && a.name?.abbreviationThai) {
          // That means b has null abbreviationThai, so a will come first.
          return -1;
        } else if (b && b.name?.abbreviationThai) {
          // That means a has null abbreviationThai, so b will come first.
          return 1;
        }
        // Both roles have null abbreviationThai, so there will be no order change.
        return 0;
      },
      render: (value, row, index) => {
        return <Box>{row?.name?.abbreviationThai}</Box>;
      },
    },
    {
      title: "ประเภท",
      dataIndex: "typeName",
      key: "typeName",
      sorter: (a, b) => (typeof a.typeOfAgency === 'string' && typeof b.typeOfAgency === 'string'&& a.typeOfAgency.toLowerCase().localeCompare(b.typeOfAgency.toLowerCase())),
      render: (value, row, index) => {
        return <Box>{row?.typeOfAgency}</Box>;
      },
    },
/* Wait to finalize about Role for delete button! So we keep the delete button disappear for a while..
    {
      title: "ลบ",
      dataIndex: "action",
      key: "action",
      width: "100px",
      render: (value, row, index) => {
        return (
          <Box>
            {
              role == "Super Admin" &&
              <Popconfirm
                title="ต้องการลบข้อมูลนี้หรือไม่?"
                onConfirm={(e) => {
                  handleDelete(e, row.affiliationsId);
                }}
                onCancel={(e) => { }}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <Button type="danger" size="small" style={{ color: "white" }}>
                  ลบ
                </Button>
              </Popconfirm>
            }
          </Box>
        );
      },
    },
*/
  ];

  function handleDelete(e, id) {
    message.info("กำลังดำเนินการ . . .");
    AffiliateService.deleteAffiliationById(id)
      .then((response) => {
        const source = [...items];

        const data = source.filter((item) => item.affiliationsId !== id);
        setItems(data);

        message.success("ลบข้อมูลเรียบร้อยแล้ว", 3);
      })
      .catch((error) => {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      });
  }

  return (
    <Box>
      <Table
        dataSource={items}
        sortDirections={["descend", "ascend"]}
        loading={loading}
        columns={columns}
        rowKey="affiliationsId"
        onChange={onChange}
      />
    </Box>
  );
}
