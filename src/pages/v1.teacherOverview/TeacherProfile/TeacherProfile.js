import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Divider,
  Row,
  Col,
  Box,
  Button,
  Menu,
  Progress,
} from "../../../core/components";
import {
  AvatarWithProgress,
  DropdownForm,
  ScoreTotal,
  CardWithTitle,
  VerticalBarChartJsTeacherProfile,
} from "../../../components/Statistics";
import { AvatarWithProfile } from "./AvatarWithProfile/AvatarWithProfile";
import {
  UserOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";

import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import { TeacherService } from "../../../services/Statistics";

export default function TeacherProfile() {
  const parent = useRef(Parent);

  const userId = window.localStorage.getItem("local_id");

  //TeacherOverview
  const [teacherOverview, setTeacherOverview] = useState({
    loading: true,
    data: {},
  });
  const [profileImage, setProfileImage] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    if (userId) {
      TeacherService.getTeacherOverviewAsync(userId).then((result) => {
        setTeacherOverview(result);
      });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      TeacherService.getProfileImage(userId).then((result) => {
        setProfileImage(result.profileImage);
      });
    }
  }, []);

  function toDateTime(secs) {
    var t = new Date(Date.UTC(1970, 0, 1)); // Epoch
    t.setUTCSeconds(secs);
    return t;
}

  const onClick = () => {
    console.log(profileImage);
    //console.log(teacherOverview);
    // console.log(chosenClassroom);
    // console.log(chosenClassroomName);
     console.log(lastestHomework);
     console.log(toDateTime(lastestHomework?.startDate?._seconds));
  };

  //bar chart loading
  const [barChartStatisticsByClassroom, setBarChartStatisticsByClassroom] =
    useState({
      loading: true,
    });

  //ภาพรวมการบ้านทั้งหมดของห้องที่เลือก
  const [chosenClassroom, setChosenClassroom] = useState({
    loading: true,
    data: {},
  });
  const [chosenClassroomName, setChosenClassroomName] = useState(null);
  const onChosenClassroomClick = ({ key }) => {
    //filter object by key
    const item = teacherOverview?.classroom[key];
    setChosenClassroom(item);
    setChosenClassroomName(key);
    setBarChartStatisticsByClassroom({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsByClassroom({ loading: false });
    }, 500);
  };

  //set ภาพรวมการบ้านทั้งหมดของห้องที่เลือก item แรก (default)
  useEffect(() => {
    if (teacherOverview.loading !== true) {
      const key = Object.keys(teacherOverview?.classroom)?.[0]
      const item = teacherOverview?.classroom[key];
      setChosenClassroom(item);
      setChosenClassroomName(key);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 500);
      console.log(key);
    }
  }, [teacherOverview]);

  //การบ้านล่าสุดที่สั่ง = last mission object in array
  const [lastestHomework, setLastestHomework] = useState({
    loading: true,
    data: {},
  });
  useEffect(() => {
    if (chosenClassroom) {
      const lastestHomeworkData =
        chosenClassroom?.missions?.[chosenClassroom?.missions.length - 1];
      setLastestHomework(lastestHomeworkData);
    }
  }, [chosenClassroom]);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={
          <>
            <div
              style={{
                position: "relative",
                top: "10px",
              }}
              onClick={onClick}
            >
              ภาพรวมครู
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "1088px",
              }}
            >
              <Link to="/editProfile">
                <Button key="1" type="primary">
                  แก้ไขข้อมูลครู <UnorderedListOutlined />
                </Button>
              </Link>
            </div>
          </>
        }
      />

      <Box>
        <Card>
          <Box mt="2">
            <AvatarWithProfile
              image = {profileImage}
              name={
                teacherOverview?.loading
                  ? "Loading"
                  : (teacherOverview?.userData?.namePrefix || "") +
                    (teacherOverview?.userData?.firstName || "") +
                    " " +
                    (teacherOverview?.userData?.lastName || "")
              }
              email={
                teacherOverview?.loading
                  ? "Loading"
                  : teacherOverview?.userData?.email || "-"
              }
              phone={
                teacherOverview?.loading
                  ? "Loading"
                  : teacherOverview?.userData?.phoneNumber || "-"
              }
              line={
                teacherOverview?.loading
                  ? "Loading"
                  : teacherOverview?.userData?.lineId || "-"
              }
              classroom={
                teacherOverview?.loading
                  ? "Loading"
                  : "ป." + teacherOverview?.userData?.totalGrades || "-"
              }
              students={
                teacherOverview?.loading
                  ? "Loading"
                  : teacherOverview?.userData?.totalStudents || "-"
              }
            />
          </Box>

          <Box mt="2">
            <Row gutter={[8, 8]} type="flex">
              <Col xs={24} sm={24} md={14} lg={14}>
                <CardWithTitle
                  title="ภาพรวมการบ้านทั้งหมด"
                  icon={<LineChartOutlined />}
                >
                  <Box mt="3">
                    <Row gutter={[8, 8]} justify="start" type="flex">
                      <Col xs={24} sm={24} md={12} lg={7}>
                        <DropdownForm
                          title="ภาพรวมของนักเรียน"
                          titlespan={14}
                          placeholder={chosenClassroomName ?? "เลือกห้องเรียน"}
                          dropdownspan={9}
                          loading={teacherOverview?.loading}
                          overlay={
                            teacherOverview?.loading ? (
                              <></>
                            ) : (
                              <Menu onClick={onChosenClassroomClick}>
                                {Object.keys(teacherOverview?.classroom).map(
                                  (key) => {
                                    return (
                                      <Menu.Item key={key}>{key}</Menu.Item>
                                    );
                                  }
                                )}
                              </Menu>
                            )
                          }
                        />
                      </Col>
                      <Col
                        sm={24}
                        md={12}
                        lg={7}
                        style={{
                          position: "relative",
                          left: "200px",
                          top: "4px",
                        }}
                      >
                        <ScoreTotal
                          name={
                            "จำนวนนักเรียนทั้งหมด " +
                            (chosenClassroom?.classData?.totalStudents || "0") +
                            " คน"
                          }
                          color="#1c4e91"
                          fontSize="13px"
                          size={15}
                        />
                      </Col>
                    </Row>
                  </Box>

                  <Box mt="3">
                    <VerticalBarChartJsTeacherProfile
                      height={250}
                      width={2500}
                      loading={barChartStatisticsByClassroom?.loading}
                      labels={
                        chosenClassroom.loading
                          ? []
                          : Object.entries(chosenClassroom.missions).map(
                              ([missionId, missionValue]) => {
                                // console.log(missionId)
                                // console.log(missionValue)
                                return missionValue.lesson;
                              }
                            )
                      }
                      items={
                        chosenClassroom?.loading
                          ? []
                          : Object.entries(chosenClassroom.missions).map(
                              ([missionId, missionValue]) => {
                                return missionValue.studentsPassed;
                              }
                            )
                      }
                    />
                  </Box>
                </CardWithTitle>
              </Col>
              <Col xs={24} sm={24} md={10} lg={10}>
                <CardWithTitle
                  title="การบ้านล่าสุดที่สั่ง"
                  icon={<AreaChartOutlined />}
                >
                  <Row gutter={[8, 8]} type="flex">
                    <Col span={24}>
                      <Box mt="3">
                        <h4>{lastestHomework?.lesson || " "}</h4>
                      </Box>
                      <Box mt="3">
                        <Divider className="mt-0" />
                        <p>
                          {"วันที่เริ่ม: " +
                            (toDateTime(lastestHomework?.startDate?._seconds).toString().slice(0, 10) || " ")}
                        </p>
                        <p>
                          {"วันที่ส่ง: " +
                            (toDateTime(lastestHomework?.endDate?._seconds).toString().slice(0, 10) || " ")}
                        </p>
                      </Box>
                    </Col>
                    <Col
                      span={24}
                      style={{
                        marginLeft: "20px",
                      }}
                    >
                      <Progress
                        type="circle"
                        percent={
                          Number(((lastestHomework?.studentsPassed /
                            chosenClassroom?.classData?.totalStudents) *
                            100)?.toFixed(2)) || "0"
                        }
                        format={(percent) => `${percent} %`}
                        strokeColor="#1c4e91"
                        strokeWidth={15}
                      />
                      <Progress
                        style={{
                          marginLeft: "20px",
                        }}
                        type="circle"
                        percent={
                          Number((lastestHomework?.studentsDoing?.toFixed(2) /
                            chosenClassroom?.classData?.totalStudents *
                            100)?.toFixed(2)) || "0"
                        }
                        format={(percent) => `${percent} %`}
                        strokeColor="#349dd1"
                        strokeWidth={15}
                      />
                      <Progress
                        style={{
                          marginLeft: "20px",
                        }}
                        type="circle"
                        percent={
                          Number(((chosenClassroom?.classData?.totalStudents -
                            lastestHomework?.studentsDoing -
                            lastestHomework?.studentsPassed) /
                            chosenClassroom?.classData?.totalStudents *
                            100)?.toFixed(2)) || "0"
                        }
                        format={(percent) => `${percent} %`}
                        strokeColor="#8a8686"
                        strokeWidth={15}
                      />
                    </Col>
                    <Col
                      span={24}
                      style={{
                        marginLeft: "60px",
                        fontWeight: "900",
                      }}
                    >
                      <span>เสร็จแล้ว</span>{" "}
                      <span
                        style={{
                          marginLeft: "90px",
                          fontWeight: "900",
                        }}
                      >
                        กำลังทำ
                      </span>{" "}
                      <span
                        style={{
                          marginLeft: "90px",
                          fontWeight: "900",
                        }}
                      >
                        ยังไม่เริ่มทำ
                      </span>
                    </Col>
                  </Row>
                </CardWithTitle>
              </Col>
            </Row>
          </Box>
        </Card>
      </Box>
    </Parent>
  );
}
