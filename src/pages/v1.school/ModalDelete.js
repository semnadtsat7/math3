import React, { useRef, useState, useEffect } from "react";
import { Modal, message, Table, Button } from "antd";

import { SchoolService } from "../../services/School";

const columns = [
  {
    title: "ชื่อระดับชั้น/ห้องเรียน",
    dataIndex: "name",
    key: "name",
  }
];

export default function ShowModalDelete(props) {
  const { schoolId, loadingModal } = props;
  const [datasource, setDatasource] = useState({})
  const [loading, setLoading] = useState(true)

  function handleCancel() {
    if (props.handleCancel) {
      props.handleCancel();
    }
  }

  function handleDelete(confirmDeleteTeacher) {
    if (props.handleDelete) {
      props.handleDelete(confirmDeleteTeacher);
    }
  }

  useEffect(() => {
    setLoading(true)
    SchoolService.getAllTeacherBySchoolId(schoolId)
      .then((result) => {
        setLoading(false)
        setDatasource(result)
      });
  }, [schoolId])

  return (
    <Modal
      width={700}
      zIndex={10000}
      visible={props.onOpen}
      title="ต้องการลบ ระดับชั้น/ห้องเรียน ทั้งหมดของโรงเรียนนี้ด้วยหรือไม่?"
      onCancel={handleCancel}
      // okText="เพิ่ม"
      // cancelText="ปิด"
      // onOk={handleDelete}
      footer={[
        <Button type="primary" onClick={() => handleDelete(false)} disabled={loadingModal}>
          ลบเฉพาะโรงเรียน
        </Button>,
        <Button type="danger" onClick={() => handleDelete(true)} disabled={loadingModal}>
          ลบโรงเรียนและระดับชั้น/ห้องเรียน
        </Button>,
        <Button onClick={handleCancel} disabled={loadingModal}>
          ปิด
        </Button>
      ]}
    >
      เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก
      <Table
        dataSource={loading ? [] : datasource}
        loading={loading || loadingModal}
        columns={columns}
      />
    </Modal>
  );
}
