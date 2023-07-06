import "./ModalCreate.css";

import React, { useRef, useState, useEffect } from "react";
import { Modal, message, InputNumber } from "antd";
import {
  Menu,
  Col,
  Row,
  Card,
  Box,
  Button,
  Dropdown,
  Table,
} from "../../../core/components";

import { SchoolService } from "../../../services/School";

export default function CreateForm(props) {
  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });

  const [classRoomsData, setClassRoomsData] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  //state to control the disabled attribute in the submit button
  const [disabled, setDisabled] = useState(true);

  const columns = [
    {
      title: "เลือก",
      dataIndex: "id",
      key: "id",
      render: (value, row, index) => {
        return <Box>{index + 1}</Box>;
      },
    },
    {
      title: "ชื่อผู้สร้าง",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "ชื่อห้องเรียน",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ระดับชั้น/ห้องเรียน",
      dataIndex: "grade",
      key: "grade",
      render: (value, row, index) => {
        return (
          <InputNumber
            defaultValue={value}
            onChange={(e) => handleChangeGrade(row.id, e)}
            min={1}
            max={6}
            className={classRoomsData[row.id]?.gError ? "error" : ""}
          />
        );
      },
      width: "10%",
    },
    {
      title: "ห้องที่",
      dataIndex: "classroom",
      key: "classroom",
      render: (value, row, index) => {
        return (
          <InputNumber
            defaultValue={value}
            onChange={(e) => handleChangeClassroom(row.id, e)}
            min={1}
            className={classRoomsData[row.id]?.cError ? "error" : ""}
          />
        );
      },
      width: "10%",
    },
  ];

  const { datasource, loading, id } = props;

  const [classRooms, setClassRooms] = useState([]);

  const [formLoading, setFormLoading] = useState(false);

  function handleChangeGrade(id, e) {
    setClassRoomsData({
      ...classRoomsData,
      [id]: {
        ...classRoomsData[id],
        grade: e,
        gError: false,
      },
    });
  }

  function handleChangeClassroom(id, e) {
    setClassRoomsData({
      ...classRoomsData,
      [id]: {
        ...classRoomsData[id],
        classroom: e,
        cError: false,
      },
    });
  }

  function handleSubmit() {
    if (props.handleSubmit) {
      setFormLoading(true);
      message.info("กำลังดำเนินการ . . .");

      let teachersData = Object.keys(classRoomsData).map((id) => {
        if (selectedRowKeys.includes(id)) {
          return {
            id: id,
            grade: classRoomsData[id].grade,
            classroom: classRoomsData[id].classroom,
          };
        }
      });
      teachersData = teachersData.filter((element) => {
        return element !== undefined;
      });
      SchoolService.saveTeacherBySchoolId(id, teachersData)
        .then((response) => {
          message.success("บันทึกข้อมูลเรียบร้อยแล้ว", 3);
          props.handleSubmit(classRooms);
        })
        .catch((error) => {
          message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
        })
        .finally(() => {
          setFormLoading(false);
          setDisabled(true);
        });
    }
  }

  function handleCancel() {
    if (props.handleCancel) {
      props.handleCancel();
    }
    setDisabled(true);
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // reset
      setClassRooms([]);
      // set new
      setClassRooms(selectedRows);

      setSelectedRowKeys(selectedRowKeys);

      //Allow submit button to work
      setDisabled(false);
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      // console.log(record, selected, selectedRows, nativeEvent);
      if (!classRoomsData[record.id]) {
        const error = {
          gError: false,
          cError: false,
        };

        if (!record.grade) {
          error.gError = true;
        }

        if (!record.classroom) {
          error.cError = true;
        }

        setClassRoomsData({
          ...classRoomsData,
          [record.id]: {
            ...classRoomsData[record.id],
            ...error,
          },
        });

        if (record.grade && record.classroom) {
          // console.log(selectedRows);

          setClassRoomsData({
            ...classRoomsData,
            [record.id]: {
              grade: record.grade,
              classroom: record.classroom,
              gError: false,
              cError: false,
            },
          });
        } else {
          const clone = selectedRowKeys.filter(function (f) {
            return f !== record.id;
          });
          setSelectedRowKeys(clone);
        }
      } else {
        if (
          !classRoomsData[record.id].grade ||
          !classRoomsData[record.id].classroom
        ) {
          const clone = selectedRowKeys.filter(function (f) {
            return f !== record.id;
          });
          setSelectedRowKeys(clone);
        }
      }
    },
    getCheckboxProps: (record) => ({
      // disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Modal
      zIndex={10000}
      visible={props.onOpen}
      title="ระดับชั้น/ห้องเรียนทั้งหมดที่ยังไม่ถูกกำหนดโรงเรียนที่สังกัด (Admin ต้องเป็นผู้กำหนด)"
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="เพิ่ม"
      cancelText="ปิด"
      width={"70%"}
      footer={[
        <Button key="back" onClick={handleCancel}>
          ปิด
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={formLoading}
          onClick={handleSubmit}
          disabled={disabled}
        >
          เพิ่ม
        </Button>,
      ]}
    >
      <Table
        dataSource={datasource}
        loading={loading}
        columns={columns}
        rowKey="id"
        rowSelection={rowSelection}
      />
    </Modal>
  );
}
