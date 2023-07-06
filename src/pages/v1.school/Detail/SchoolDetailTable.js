import React, { useEffect, useState } from "react";

import { Box, Table, Button } from "../../../core/components";
import { Popconfirm, message } from "antd";

import { } from "@ant-design/icons";
import { SchoolService } from "../../../services/School";
import ShowStudents from "./ModalShow";

export default function SchoolTable(props) {
  const { datasource, loading } = props;

  const [items, setItems] = useState([]);
  const [modal, setModal] = useState("");
  const [datasourceStudents, setDatasourceStudents] = useState("");
  const [studentsLoading, setStudentsLoading] = useState("");

  useEffect(() => {
    setItems(datasource);
  }, [datasource]);

  const handleShowStudent = (teacherId) => {
    setModal("show")
    setStudentsLoading(true)

    SchoolService.getStudentsByTeacherID(teacherId)
      .then((result) => {
        setStudentsLoading(false)
        setDatasourceStudents(result)
      })
  }

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
      title: "ชื่อผู้สร้าง",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => (typeof a.ownerName === 'string' && typeof b.ownerName === 'string' && a.ownerName.toLowerCase().localeCompare(b.ownerName.toLowerCase())),
    },
    {
      title: "ชื่อห้องเรียน",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (typeof a.name === 'string' && typeof b.name === 'string' && a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    },
    {
      title: "ระดับชั้น/ห้องเรียน",
      dataIndex: "grade",
      key: "grade",
      sorter: (a, b) => (a.grade - b.grade),
    },
    {
      title: "ห้องที่",
      dataIndex: "classroom",
      key: "classroom",
      sorter: (a, b) => (a.classroom - b.classroom),
    },
    // {
    //   title: "รายชื่อนักเรียน",
    //   dataIndex: "action",
    //   key: "action",
    //   width: "150px",
    //   render: (value, row, index) => {
    //     return (
    //       <Box>
    //         <Button type="primary" size="small" onClick={() => { handleShowStudent(row.id) }}>
    //           ดูรายชื่อ
    //         </Button>{" "}
    //         <Popconfirm
    //           title="ต้องการลบข้อมูลนี้หรือไม่?"
    //           onConfirm={(e) => {
    //             handleDelete(e, row.id);
    //           }}
    //           onCancel={(e) => { }}
    //           okText="Yes"
    //           cancelText="No"
    //           placement="left"
    //         >
    //           {/* Wait to finalize about Role for delete button! So we keep the delete button disappear for a while.. */}
    //           {/* <Button type="danger" size="small" style={{ color: "white" }}>
    //             ลบ
    //           </Button> */}
    //         </Popconfirm>
    //       </Box>
    //     );
    //   },
    // },

  ];

  function handleDelete(e, id) {
    message.info("กำลังดำเนินการ . . .");
    SchoolService.deleteTeacherBySchoolId(id)
      .then((response) => {
        const source = [...items];

        const data = source.filter((item) => item.id !== id);
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
        loading={loading}
        columns={columns}
        rowKey="id"
      />

      <ShowStudents
        onOpen={modal === "show"}
        handleCancel={() => { setModal(""); setDatasourceStudents("") }}
        datasource={datasourceStudents}
        loading={studentsLoading}
      ></ShowStudents>
    </Box>
  );
}
