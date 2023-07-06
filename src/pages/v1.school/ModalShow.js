import React, { useRef, useState, useEffect } from "react";
import { Modal, message, Table } from "antd";
import {
  Menu,
  Col,
  Row,
  Card,
  Box,
  Button,
  Dropdown
} from "../../core/components";


const columns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    render: (value, row, index) => {
      return <Box>{index + 1}</Box>;
    },
  },
  {
    title: "ชื่อโรงเรียน",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "สถานะ",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "อธิบาย",
    dataIndex: "message",
    key: "message",
  }
];

export default function ShowSchoolImport(props) {
  const { datasource, loading } = props;

  function handleCancel() {
    if (props.handleCancel) {
      props.handleCancel();
    }
  }

  return (
    <Modal
      width={700}
      zIndex={10000}
      visible={props.onOpen}
      title="สถานะการนำเข้าไฟล์ CSV"
      onCancel={handleCancel}
      okText="เพิ่ม"
      cancelText="ปิด"
      footer={[
        <Button key="back" onClick={handleCancel}>
          ปิด
        </Button>
      ]}
    >
      <Table
        dataSource={datasource}
        loading={loading}
        columns={columns}
      />
    </Modal>
  );
}
