import React, { useRef, useState, useEffect } from "react";

import { Box, Table, Button } from "../../core/components";
import { Popconfirm, message } from "antd";
import { Link, useHistory } from "react-router-dom";

import {} from "@ant-design/icons";

import {
  PositionService,
  RoleService,
  UserService,
  PermissionService,
} from "../../services/User";

export default function SchoolTable(props) {
  const { datasource, loading, role } = props;
  const [localLoading, setLoading] = useState(false);

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  const columns = [
    {
      title: "#",
      dataIndex: "uid",
      key: "uid",
      render: (value, row, index) => {
        return <Box>{index + 1}</Box>;
      },
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        if (a && a.name && b && b.name) {
          return a.name?.toLowerCase().localeCompare(b.name.toLowerCase());
        } else if (a && a.name) {
          // That means b has null name, so a will come first.
          return -1;
        } else if (b && b.name) {
          // That means a has null name, so b will come first.
          return 1;
        }
        // Both roles have null name, so there will be no order change.
        return 0;
      },
      render: (value, row, index) => {
        return <Box>{value}</Box>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) =>
        typeof a.email === "string" &&
        typeof b.email === "string" &&
        a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
      render: (value, row, index) => {
        return <Box>{value}</Box>;
      },
    },
    {
      title: "บทบาท",
      dataIndex: "roles",
      key: "roles",
      sorter: (a, b) => {
        if (a && a.roles && b && b.roles) {
          return a.roles.toLowerCase().localeCompare(b.roles.toLowerCase());
        } else if (a && a.roles) {
          // That means b has null roles, so a will come first.
          return -1;
        } else if (b && b.roles) {
          // That means a has null roles, so b will come first.
          return 1;
        }
        // Both roles have null value, so there will be no order change.
        return 0;
      },
      render: (value, row, index) => {
        return <Box>{value}</Box>;
      },
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "positions",
      key: "positions",
      sorter: (a, b) => {
        if (a && a.positions?.name?.thai && b && b.positions?.name?.thai) {
          return a.positions?.name?.thai.toLowerCase().localeCompare(b.positions?.name?.thai.toLowerCase());
        } else if (a && a.positions?.name?.thai) {
          // That means b has null positions, so a will come first.
          return -1;
        } else if (b && b.positions?.name?.thai) {
          // That means a has null positions, so b will come first.
          return 1;
        }
        // Both roles have null positions, so there will be no order change.
        return 0;
      },
      render: (value, row, index) => {
        return <Box>{value?.name?.thai}</Box>;
      },
    },
    {
      // title: "ลบ / แก้ไข", Wait to finalize about Role for delete button! So we keep the delete button disappear for a while..
      title: "แก้ไข",
      dataIndex: "action",
      key: "action",
      width: "150px",
      render: (value, row, index) => {
        return (
          <Box>
            {row.permissions || row.isCreated === true ? (
              <Link to={`users/${row.uid}`}>
                <Button type="primary" size="small">
                  ตั้งค่าผู้ใช้งาน
                </Button>
              </Link>
            ) : (
              <Button
                key={row.uid}
                type="success"
                size="small"
                loading={localLoading}
                style={{ color: "#457cc4" }}
                onClick={() => {
                  setLoading(true);

                  UserService.createUserProfile(row.uid)
                    .then((response) => {
                      message.success("สร้างโปรไฟล์เรียบร้อยแล้ว", 3);
                      row.isCreated = true;
                    })
                    .catch((error) => {
                      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
                      row.isCreated = false;
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              >
                สร้างโปรไฟล์
              </Button>
            )}{" "}
            {role == "Super Admin" && (
              <Popconfirm
                title="ต้องการลบข้อมูลนี้หรือไม่?"
                onConfirm={(e) => {
                  message.success("success");
                }}
                onCancel={(e) => {
                  message.info("cancel");
                }}
                okText="Yes"
                cancelText="No"
                placement="left"
                disabled={true}
              >
                <Button type="danger" size="small" style={{ color: "white" }}>
                  ลบ
                </Button>
              </Popconfirm>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Table
        dataSource={datasource}
        sortDirections={["descend", "ascend"]}
        loading={loading}
        columns={columns}
        rowKey="uid"
        onChange={onChange}
      />
    </Box>
  );
}
