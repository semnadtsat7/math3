import React, { useRef, useState, useEffect } from "react";
import { useHistory, useRouteMatch, Link } from 'react-router-dom'
import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";
import {
  Menu,
  Col,
  Row,
  Card,
  Box,
  Button,
  Dropdown,
} from "../../../core/components";
import { Upload, message, Spin } from "antd";
import SchoolDetailTable from "./SchoolDetailTable";
import CreateForm from "./ModalCreate";

import { SchoolService } from "../../../services/School";

import { useParams } from "react-router-dom";

import { ArrowLeftOutlined } from '@ant-design/icons';

export default function SchoolDetail() {
  const parent = useRef(Parent);
  const { id } = useParams();
  const { url } = useRouteMatch();

  const [modal, setModal] = useState("");

  const [teachers, setAllTeachers] = useState({
    loading: true,
    data: {},
  });

  const [schools, setAllSchools] = useState({
    loading: true,
    data: {},
  });

  const [school, setAllSchool] = useState({
    loading: true,
    data: {},
  });

  function getAllTeacherBySchoolId(_id) {
    SchoolService.getAllTeacherBySchoolId(_id).then(setAllTeachers);
  }

  function getAllTeacherByAllUserInSchool(_id) {
    setModal("create")
    SchoolService.getAllTeacherByAllUserInSchool(_id).then(setAllSchools);
  }

  useEffect(() => {
    getAllTeacherBySchoolId(id);
    SchoolService.getSchoolBySchoolId(id).then(setAllSchool);
  }, [id]);

  const history = useHistory();

  return (
    <Parent ref={parent}>
      <div 
        style={{  
          backgroundColor: "#1890ff",
          height: "40px"
        }}
      >        
        <Button
          type="primary"
          onClick={history.goBack}
          style={{ height: "40px", fontSize: "13px", marginTop: "0px" }}
        >
          <ArrowLeftOutlined/>
          <span style={{ marginLeft: "30px" }}>
            ย้อนกลับ
          </span>
        </Button>
      </div>

      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={school?.loading ? <Spin /> : school?.name?.thai}
        actions={[
          <Button style={{ margin: "0px" }} type="primary" onClick={() => getAllTeacherByAllUserInSchool(id)}>
            ตั้งค่ากลุ่มเรียน
          </Button>,
          <Link to={`${url}/students`} aria-disabled={teachers.length == 0}>
            <Button style={{ margin: "0px" }} type="primary" disabled={teachers.length == 0}>
              นักเรียนทั้งหมด
            </Button>
          </Link>,
          <Link to={`${url}/groups`} aria-disabled={teachers.length == 0}>
          <Button style={{ margin: "0px" }} type="primary" disabled={teachers.length == 0}>
            กลุ่มเรียนทั้งหมด
          </Button>
        </Link>,
        ]}
      />
      <Box>
        <div className="Schools">
          <Card bordered={false} className="w-100 Schools-Container">
            <Box>
              <SchoolDetailTable
                datasource={teachers?.loading ? [] : teachers}
                loading={teachers?.loading}
              />
            </Box>
          </Card>
        </div>
      </Box>

      <CreateForm
        onOpen={modal === "create"}
        id={id}
        handleCancel={() => setModal("")}
        handleSubmit={(items) => {
          getAllTeacherBySchoolId(id);
          setModal("");
        }}
        datasource={schools?.loading ? [] : schools
          // .filter(x => { return (!x.schoolId || x.schoolId == "-") })
        }
        loading={schools?.loading}
      ></CreateForm>
    </Parent>
  );
}
