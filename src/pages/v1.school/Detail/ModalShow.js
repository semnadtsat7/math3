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
} from "../../../core/components";


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
    title: "ชื่อนักเรียน",
    dataIndex: "name",
    key: "name",
  }
];

export default function ShowStudents(props) {
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
      title="รายชื่อนักเรียน"
      onCancel={handleCancel}
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
