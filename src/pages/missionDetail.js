import React, { createRef, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { Row, Col, Radio, Table, Tag, Button } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

import { RootContext } from "../root";
import Firebase from "../utils/Firebase";

import Progress from "../components/Progress";
import MenuButton from "../components/MenuButton";
import ActionBar from "../components/ActionBar";
import Parent from "../components/Parent";

const ScrollView = styled.div`
  overflow: auto;

  ${(props) =>
    props.fitParent &&
    `
        height: 100%;
    `}

  table {
    background: white;
  }
`;

const Detail = styled.div`
  padding: 10px 0px;
  background-color: white;
`;

const MissionDetail = ({ match }) => {
  const { spaceID } = useContext(RootContext);
  const { missionId } = match.params;
  const parent = createRef();

  const [mission, setMission] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState(null);
  const [filterStudent, setFilterStudent] = useState("ทั้งหมด");
  const studentDoneCount = assignedStudents
    ? assignedStudents.filter((student) => student.done).length
    : 0;

  const plainOptions = ["ทั้งหมด", "เสร็จแล้ว", "ยังไม่เสร็จ"];
  const columns = [
    {
      title: "รหัสนักเรียน",
      dataIndex: "customId",
      key: "customId",
    },
    {
      title: "ชื่อ - สกุล",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ทำไปแล้ว",
      key: "done",
      render: (text, record) => {
        return (
          <p>
            {record.sheets.reduce(
              (acc, cur) => (cur.score >= 0 ? (acc += 1) : acc),
              0
            )}{" "}
            ด่าน
          </p>
        );
      },
    },
    {
      title: "คะแนนที่ทำได้",
      key: "pointed",
      render: (text, record) => {
        return (
          <>
            {record.sheets.reduce(
              (acc, cur) => (cur.score ? acc + cur.score : acc),
              0
            )}{" "}
            คะแนน
          </>
        );
      },
    },
    {
      title: "ผ่าน",
      key: "pass",
      render: (record) => {
        const text = record.pass ? "ผ่าน" : "ไม่ผ่าน";
        const color = record.pass ? "green" : "red";
        return <p style={{ color: color }}>{text}</p>;
      },
    },
  ];
  const getMissionFromId = async () => {
    const result = await Firebase.firestore()
      .collection("teachers")
      .doc(spaceID)
      .collection("missions")
      .doc(missionId)
      .get();
    if (result.exists) {
      const currentMission = result.data();
      setMission(currentMission);
      return currentMission;
    }
  };

  const getAssignedStudents = async (assignGroupId) => {
    let students = [];
    let result;
    result = await Firebase.firestore()
      .collection("teachers")
      .doc(spaceID)
      .collection("groups")
      .doc(assignGroupId)
      .collection("students")
      .get();

    if (result.empty) {
      return students;
    }
    const studentIds = [];
    result.forEach((doc) => studentIds.push(doc.id));
    for (let i = 0; i < studentIds.length; i += 10) {
      const studentIdsChunk = studentIds.slice(i, i + 10);
      result = await Firebase.firestore()
        .collection("teachers")
        .doc(spaceID)
        .collection("students")
        .where(Firebase.firestore.FieldPath.documentId(), "in", studentIdsChunk)
        .get();

      if (!result.empty) {
        result.forEach((doc) => students.push({ id: doc.id, ...doc.data() }));
      }
    }
    return students;
  };

  const prepareMissionDetailData = async () => {
    const currentMission = await getMissionFromId();
    const students = await getAssignedStudents(currentMission.group.id);
    const studentsWithMission = await Promise.all(
      students.map(async (student) => {
        const tempStudent = { ...student };
        tempStudent.sheets = [];
        const result = await Firebase.database()
          .ref(
            `teachers/${spaceID}/students/${student.id}/sheets/${currentMission.lessonId}`
          )
          .once("value");
        result.forEach((r) => {
          if (currentMission.mapIds.includes(r.key)) {
            tempStudent.sheets.push({ id: r.key, key: r.key, ...r.val() });
          }
        });

        tempStudent.do = tempStudent.sheets.length > 0;
        tempStudent.done = false;
        tempStudent.pass = false;
        if (tempStudent.sheets.length === currentMission.mapIds.length) {
          tempStudent.done = true;
          tempStudent.pass = tempStudent.sheets.every(
            (sheet) => sheet.score && sheet.score >= 3
          );
        }
        return tempStudent;
      })
    );
    setAssignedStudents(studentsWithMission);
  };

  const initialPage = () => {
    if (!missionId) return;
    prepareMissionDetailData();
  };

  useEffect(initialPage, []);

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
      <ActionBar>
        <MenuButton onClick={() => parent?.current?.toggleMenu()} />
        <Typography
          variant="subtitle2"
          color="inherit"
          noWrap
          style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}
        >
          รายละเอียดการบ้าน
        </Typography>
      </ActionBar>
      <ScrollView>
        {mission && assignedStudents ? (
          <Detail>
            <Row style={{ padding: "0px  20px" }}>
              <Col md={8} sm={12}>
                <h4>กลุ่ม/ห้องเรียน: {mission.group.name}</h4>
              </Col>
              <Col md={8} sm={12}>
                <h4>บทเรียน: {mission.lesson}</h4>
              </Col>
              <Col md={8} sm={12}>
                <h4>บทเรียนย่อย: {mission.subLesson.join(", ")}</h4>
              </Col>
              <Col md={8} sm={12}>
                <h4>ระดับ: {mission.level.join(", ")}</h4>
              </Col>
              <Col md={8} sm={12}>
                <div style={{ display: "flex" }}>
                  <h4>
                    รางวัล:
                    <img
                      src={mission.reward ? mission.reward.image : ""}
                      style={{ width: "25px" }}
                    />{" "}
                    {mission.reward ? mission.reward.name : ""}
                  </h4>
                </div>
              </Col>
              <Col md={8} sm={12}>
                <h4>
                  จำนวนนักเรียนที่เสร็จการบ้าน: {studentDoneCount}/
                  {assignedStudents.length}
                </h4>
              </Col>
            </Row>
            {/* <Row style={{ padding: "0px  20px" }}>
              <Col>
                <Radio.Group
                  options={plainOptions}
                  onChange={(e) => setFilterStudent(e.target.value)}
                  value={filterStudent}
                />
              </Col>
            </Row> */}
            <Row style={{ margin: "10px" }}>
              <Col md={12} style={{ padding: "5px" }}>
                <Table
                  bordered
                  dataSource={assignedStudents.filter((student) => {
                    return student.done;
                  })}
                  columns={columns}
                />
              </Col>
              <Col md={12} style={{ padding: "5px" }}>
                <Table
                  bordered
                  dataSource={assignedStudents.filter((student) => {
                    return !student.done;
                  })}
                  columns={columns}
                />
              </Col>
            </Row>
          </Detail>
        ) : (
          <Progress />
        )}
        {/* <AssignmentForm mode="edit" missionId={missionId} /> */}
      </ScrollView>
    </Parent>
  );
};

export default MissionDetail;
