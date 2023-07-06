import React, { useRef, useEffect, useState, useContext } from "react";
import { RootContext } from "../../../root";
import classes from "./StudentOverview.module.css";

import StudentListPageTSV1 from "../../students.ts.v1";

import {
  Menu,
  ScrollView,
  Divider,
  Progress,
  Col,
  Row,
  Tabs,
  Card,
  Box,
  Button,
} from "../../../core/components";

import { Modal, message, notification } from "antd";

import {
  DropdownForm,
  ScoreTotal,
  CardWithTitle,
  HorizontalBarChart,
  StatisticWithIconStudentLarge,
} from "../../../components/Statistics";

import {
  LineChartOutlined,
  AreaChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { IoLogoGameControllerB, IoIosPaper } from "react-icons/io";
import { RiEqualizerLine } from "react-icons/ri";

import BestTable from "./BestTable";
import WorstTable from "./WorstTable";
import AvgAcademicTable from "./AvgAcademicTable";

import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import { SchoolService, TeacherService } from "../../../services/Statistics";

const { TabPane } = Tabs;

export default function StudentOverview() {
  const parent = useRef(Parent);

  //AntD's modal ปรับสัดส่วนคะแนน
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //AntD's modal การคิดคะแแนนของบทเรียนที่ #
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const showModal2 = () => {
    setIsModalVisible2(true);
    setIsModalVisible(false);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
    setIsModalVisible(true);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
    setIsModalVisible(true);
  };

  const { spaceID } = useContext(RootContext);
  const teacherId = spaceID;

  //ข้อมูลนักเรียนทั้งหมดของครู
  const [studentsOverview, setStudentsOverview] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    TeacherService.getStudentsOverviewAsync(spaceID).then((res) => {
      if (res?.error || res === undefined || res === null) {
        setStudentsOverview({
          ...studentsOverview,
          error: res?.error,
        });
        message.error("ไม่มีข้อมูลนักเรียน... กรุณาเพิ่มนักเรียน", 3);
      } else {
        if (res !== undefined && res !== null) {
          setStudentsOverview(res);
        }
      }
    });
    console.log(spaceID);
  }, [spaceID]);

  //bar chart loading
  const [barChartStatisticsByClassroom, setBarChartStatisticsByClassroom] =
    useState({
      loading: true,
    });

  //ข้อมูลการบ้านบทเรียนของห้องเรียนที่เลือก
  const [chosenHomeworkData, setChosenHomeworkData] = useState({
    loading: true,
    data: {},
  });
  const [chosenHomeworkName, setChosenHomeworkName] = useState(null);
  const onChosenClassroomClick = ({ key }) => {
    //filter object by key
    const item = Object.entries(studentsOverview?.classData?.lessons)?.filter(
      (classroomData) => {
        if (classroomData?.[0] === key) return classroomData;
      }
    );
    //console.log(item)
    setChosenHomeworkData(item?.length > 0 ? item : null);
    setChosenHomeworkName(key);
    setBarChartStatisticsByClassroom({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsByClassroom({ loading: false });
    }, 500);
  };

  //set ความก้าวหน้าของบทเรียนเป็น item แรก (default)
  useEffect(() => {
    if (studentsOverview.loading !== true) {
      const item = Object.entries(studentsOverview?.classData?.lessons)?.filter(
        (classroomData) => {
          if (classroomData?.[0] !== null) return classroomData?.[0];
        }
      );
      setChosenHomeworkData(item);
      setChosenHomeworkName(item?.[0]?.[0]);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 500);
      //console.log(item);
    }
  }, [studentsOverview]);

  //ข้อมูล อันดับคะแนนที่เยอะที่สุดในแต่ละบท
  const [chosenHomeworkBestRankingData, setChosenHomeworkBestRankingData] =
    useState({
      loading: true,
      data: {},
    });
  const [chosenHomeworkBestRankingName, setChosenHomeworkBestRankingName] =
    useState(null);
  const onChosenStudentBestRankingClick = ({ key }) => {
    setChosenHomeworkBestRankingName(key);

    const item = Object.values(studentsOverview?.students).map((value) => {
      return {
        name: value.name,
        score: (value.lessons[key] && value.lessons[key].score) || "0",
      };
    });
    //console.log(item)
    setChosenHomeworkBestRankingData(item?.length > 0 ? item : null);
  };

  //ข้อมูล อันดับคะแนนที่น้อยที่สุดในแต่ละบท
  const [chosenHomeworkWorstRankingData, setChosenHomeworkWorstRankingData] =
    useState({
      loading: true,
      data: {},
    });
  const [chosenHomeworkWorstRankingName, setChosenHomeworkWorstRankingName] =
    useState(null);
  const onChosenStudentWorstRankingClick = ({ key }) => {
    setChosenHomeworkWorstRankingName(key);

    const item = Object.values(studentsOverview?.students).map((value) => {
      return {
        name: value.name,
        score: (value.lessons[key] && value.lessons[key].score) || "0",
      };
    });
    console.log(key);
    console.log(item);
    setChosenHomeworkWorstRankingData(item?.length > 0 ? item : null);
  };

  //set อันดับคะแนนที่เยอะที่น้อยในแต่ละบท item แรก (default)
  useEffect(() => {
    if (studentsOverview.loading !== true) {
      const key = Object.entries(studentsOverview?.classData?.lessons)?.[0]?.[0];
      const item = Object.values(studentsOverview?.students).map((value) => {
        return {
          name: value.name,
          score: (value.lessons[key] && value.lessons[key].score) || "0",
        };
      });
      setChosenHomeworkWorstRankingData(item);
      setChosenHomeworkWorstRankingName(key);
      //console.log(key);
    }
  }, [studentsOverview]);

  //set อันดับคะแนนที่เยอะที่มากในแต่ละบท item แรก (default)
  useEffect(() => {
    if (studentsOverview.loading !== true) {
      const key = Object.entries(studentsOverview?.classData?.lessons)?.[0]?.[0];
      const item = Object.values(studentsOverview?.students).map((value) => {
        return {
          name: value.name,
          score: (value.lessons[key] && value.lessons[key].score) || "0",
        };
      });
      setChosenHomeworkBestRankingData(item);
      setChosenHomeworkBestRankingName(key);
      //console.log(key);
    }
  }, [studentsOverview]);

  const onClickConsoleLog = () => {
    console.log(studentsOverview);
    console.log(Object.entries(studentsOverview?.classData?.lessons));
    // console.log(chosenHomeworkName);
    console.log(chosenHomeworkData);
    // console.log(chosenHomeworkBestRankingData);
    // console.log(chosenHomeworkWorstRankingData);
  };

  return (
    <Parent ref={parent}>
      <div
        style={{
          display: "absolute",
          zIndex: "1009",
        }}
      >
        <Header
          onMenuClick={() => parent?.current?.toggleMenu()}
          title={"ภาพรวมนักเรียน"}
        />
      </div>

      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col span={24}>
                <Tabs type="card" defaultActiveKey="1">
                  <TabPane tab="ภาพรวม" key="1">
                    <Box>
                      <Card>
                        <Row gutter={[8, 8]} type="flex">
                          <Col xs={24} sm={5} md={4} lg={4}>
                            <Box onClick={onClickConsoleLog}>
                              <StatisticWithIconStudentLarge
                                className="Overview-StatisticWithIcon"
                                title="นักเรียนทั้งหมด"
                                value={
                                  studentsOverview?.loading
                                    ? ""
                                    : Object.keys(studentsOverview?.students)
                                        .length
                                }
                                suffix="คน"
                                iconSize="120px"
                                height="247px"
                              />
                            </Box>
                          </Col>
                          <Col xs={24} sm={19} md={10} lg={10}>
                            <Box>
                              <CardWithTitle
                                title={`จำนวนด่านที่ผ่านโดยเฉลี่ยจากทั้งหมด (${
                                  studentsOverview?.loading
                                    ? 0
                                    : studentsOverview?.classData?.maxQuizzes.toLocaleString()
                                } ด่าน)`}
                                icon={<IoLogoGameControllerB />}
                              >
                                <Row gutter={[8, 8]} type="flex">
                                  <Col span={12}>
                                    <Box mt="3" mb="3">
                                      <Row justify="center" type="flex">
                                        <Col span={14}>
                                          <Progress
                                            type="circle"
                                            //percent={60.72}
                                            percent={
                                              studentsOverview?.classData?.passedPercentage.toFixed(
                                                2
                                              ) || 0
                                            }
                                            format={(percent) => `${percent} %`}
                                            strokeColor="#1c4e91"
                                            strokeWidth={15}
                                          />
                                        </Col>
                                      </Row>
                                    </Box>
                                  </Col>
                                  <Col span={12}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "90%",
                                      }}
                                    >
                                      <div style={{ marginTop: "auto" }}>
                                        <Row gutter={[8, 8]} type="flex">
                                          <Col span={24}>
                                            <ScoreTotal
                                              name={`ผ่านแล้ว ${
                                                studentsOverview?.loading
                                                  ? 0
                                                  : studentsOverview?.classData?.passedPercentage?.toFixed(
                                                      2
                                                    ) || 0
                                              }%`}
                                              color="#1c4e91"
                                              size={20}
                                              fontSize={14}
                                            />
                                          </Col>
                                          <Col span={24}>
                                            <ScoreTotal
                                              name={`ยังไม่ส่ง ${
                                                studentsOverview?.loading
                                                  ? 0
                                                  : 100 -
                                                      studentsOverview?.classData?.passedPercentage?.toFixed(
                                                        2
                                                      ) || 0
                                              }%`}
                                              color="#aeaeae"
                                              size={20}
                                              fontSize={14}
                                            />
                                          </Col>
                                        </Row>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </CardWithTitle>
                            </Box>
                          </Col>
                          <Col xs={24} sm={24} md={10} lg={10}>
                            <Box>
                              <CardWithTitle
                                title={`คะแนนเฉลี่ยจากคะแนนทั้งหมด (${
                                  studentsOverview?.loading
                                    ? 0
                                    : studentsOverview?.classData?.maxScore.toLocaleString()
                                } 
                                  คะแนน)`}
                                icon={<IoIosPaper />}
                              >
                                <Row gutter={[8, 8]} type="flex">
                                  <Col span={12}>
                                    <Box mt="3" mb="3">
                                      <Row justify="center" type="flex">
                                        <Col span={14}>
                                          <Progress
                                            type="circle"
                                            percent={`${
                                              studentsOverview?.loading
                                                ? 0
                                                : Number(
                                                    (studentsOverview?.classData
                                                      ?.averageScore /
                                                    studentsOverview?.classData
                                                      ?.maxScore) * 100
                                                  ).toFixed(2) || 0
                                            }`}
                                            format={(percent) =>
                                              `${percent} %`
                                            }
                                            strokeColor="#349dd1"
                                            strokeWidth={15}
                                          />
                                        </Col>
                                      </Row>
                                    </Box>
                                  </Col>
                                  <Col span={12}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "90%",
                                      }}
                                    >
                                      <div style={{ marginTop: "auto" }}>
                                        <Row gutter={[8, 8]} type="flex">
                                          <Col span={24}>
                                            <ScoreTotal
                                              name={`คะแนนเฉลี่ย ${
                                                studentsOverview?.loading
                                                  ? 0
                                                  : studentsOverview?.classData?.averageScore?.toFixed(
                                                      1
                                                    ) || 0
                                              }`}
                                              color="#349dd1"
                                              size={20}
                                              fontSize={14}
                                            />
                                          </Col>
                                          <Col span={24}>
                                            <ScoreTotal
                                              name={`คะแนนทั้งหมด ${
                                                studentsOverview?.loading
                                                  ? 0
                                                  : studentsOverview?.classData
                                                      ?.maxScore
                                              }`}
                                              color="#aeaeae"
                                              size={20}
                                              fontSize={14}
                                            />
                                          </Col>
                                        </Row>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </CardWithTitle>
                            </Box>
                          </Col>
                        </Row>
                      </Card>
                    </Box>

                    <Box mt="2">
                      <Row gutter={[8, 8]} type="flex">
                        <Col xs={24} sm={24} md={16} lg={18}>
                          <CardWithTitle
                            title={
                              <>
                                <div className={classes.alignItems}>
                                  <div className={classes.alignTextItem}>
                                    <div className={classes.alignContent}>
                                      <span>
                                        ความก้าวหน้าของแต่ละบทเรียน (
                                        {chosenHomeworkData?.loading ? (
                                          <></>
                                        ) : (
                                          Object.entries(
                                            chosenHomeworkData?.[0]?.[1]
                                              ?.subLessons
                                          )?.length || 0
                                        )}{" "}
                                        บทเรียน)
                                      </span>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignContent: "center",
                                          justifyContent: "center",
                                          width: "100px",
                                        }}
                                      >
                                        <DropdownForm
                                          title=""
                                          placeholder={
                                            chosenHomeworkName ?? "เลือกบทเรียน"
                                          }
                                          titlespan={6}
                                          dropdownspan={4}
                                          md={8}
                                          lg={7}
                                          loading={studentsOverview?.loading}
                                          overlay={
                                            studentsOverview?.loading ? (
                                              <></>
                                            ) : (
                                              <Menu
                                                onClick={onChosenClassroomClick}
                                              >
                                                {Object.entries(studentsOverview?.classData?.lessons)?.map(
                                                  (key) => {
                                                    //console.log((key))
                                                    //return object key
                                                    return (
                                                      <Menu.Item
                                                        key={
                                                          Object.values(key)[0]
                                                        }
                                                      >
                                                        {Object.values(key)[0]}
                                                      </Menu.Item>
                                                    );
                                                  }
                                                )}
                                              </Menu>
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            }
                            icon={<LineChartOutlined />}
                          >
                            <Row gutter={[8, 8]} justify="end" type="flex">
                              <Col sm={24} md={12} lg={7}>
                                <ScoreTotal
                                  name="ยังไม่ส่ง"
                                  color="grey"
                                  fontSize="14px"
                                  size={15}
                                />
                              </Col>
                              <Col sm={24} md={12} lg={7}>
                                <ScoreTotal
                                  name="ส่งแล้ว"
                                  color="#4da6c9"
                                  fontSize="14px"
                                  size={15}
                                />
                              </Col>
                            </Row>

                            <Box mt="3">
                              <HorizontalBarChart
                                height={340}
                                width={2500}
                                loading={barChartStatisticsByClassroom?.loading}
                                labels={
                                  chosenHomeworkData?.loading
                                    ? []
                                    : Object.keys(
                                        chosenHomeworkData?.[0]?.[1]?.subLessons
                                      ).map((key) => {
                                        return key;
                                      })
                                }
                                items={
                                  chosenHomeworkData?.loading
                                    ? []
                                    : Object.values(
                                        chosenHomeworkData?.[0]?.[1]?.subLessons
                                      ).map((val) => {
                                        return val?.passedPercentage;
                                      })
                                }
                              />
                            </Box>
                          </CardWithTitle>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={6}>
                          <CardWithTitle
                            title={
                              <>
                                <p>เปอร์เซนต์การส่งแบบฝึกหัด</p>
                                <p>
                                  (
                                  {chosenHomeworkData?.[0]?.[1]
                                    ?.passedQuizzes || "0"}{" "}
                                  /{" "}
                                  {chosenHomeworkData?.[0]?.[1]?.maxQuizzes ||
                                    "0"}{" "}
                                  ข้อ)
                                </p>
                              </>
                            }
                            icon={<AreaChartOutlined />}
                          >
                            <Row justify="center" type="flex">
                              <Col span={24} className="text-center">
                                <Progress
                                  type="circle"
                                  percent={
                                    chosenHomeworkData?.[0]?.[1]?.passedPercentage?.toFixed(
                                      1
                                    ) || "0"
                                  }
                                  format={(percent) => `${percent} %`}
                                  strokeColor="#349dd1"
                                  strokeWidth={15}
                                />
                              </Col>
                            </Row>
                            <Row gutter={[8, 8]} type="flex">
                              <Col span={24} className="text-center">
                                <br />
                                <ScoreTotal
                                  name={`ส่งแล้ว ${
                                    chosenHomeworkData?.[0]?.[1]?.passedPercentage?.toFixed(
                                      1
                                    ) || "0"
                                  }%`}
                                  color="#349dd1"
                                  size={20}
                                  fontSize={14}
                                />
                              </Col>
                              <Col span={24} className="text-center">
                                <ScoreTotal
                                  name={`ยังไม่ส่ง ${
                                    100 -
                                      chosenHomeworkData?.[0]?.[1]?.passedPercentage?.toFixed(
                                        1
                                      ) || "0"
                                  }%`}
                                  color="#aeaeae"
                                  size={20}
                                  fontSize={14}
                                />
                              </Col>
                            </Row>
                          </CardWithTitle>
                        </Col>
                      </Row>
                    </Box>

                    <Box mt="2">
                      <Row gutter={[8, 8]} type="flex">
                        <Col span={12}>
                          <CardWithTitle
                            icon={<IoIosPaper />}
                            title={
                              <>
                                <div className={classes.alignItems}>
                                  <div className={classes.alignTextItem}>
                                    <div className={classes.alignContent}>
                                      <p
                                        style={{
                                          marginTop: "5px",
                                        }}
                                      >
                                        อันดับคะแนนที่เยอะที่สุดในแต่ละบท
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignContent: "center",
                                          justifyContent: "center",
                                          width: "100px",
                                        }}
                                      >
                                        <DropdownForm
                                          title=""
                                          placeholder={
                                            chosenHomeworkBestRankingName ??
                                            "เลือกบทเรียน"
                                          }
                                          titlespan={6}
                                          dropdownspan={4}
                                          md={8}
                                          lg={7}
                                          loading={studentsOverview?.loading}
                                          overlay={
                                            studentsOverview?.loading ? (
                                              <></>
                                            ) : (
                                              <Menu
                                                onClick={
                                                  onChosenStudentBestRankingClick
                                                }
                                              >
                                                {Object.entries(
                                                  studentsOverview?.classData
                                                    ?.lessons
                                                )?.map((key) => {
                                                  //console.log((key))
                                                  //return object key
                                                  return (
                                                    <Menu.Item
                                                      key={
                                                        Object.values(key)[0]
                                                      }
                                                    >
                                                      {Object.values(key)[0]}
                                                    </Menu.Item>
                                                  );
                                                })}
                                              </Menu>
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            }
                          >
                            <ScrollView>
                              <BestTable
                                //datasource={chosenHomeworkBestRankingData ?? []}
                                datasource={
                                  chosenHomeworkBestRankingData?.loading
                                    ? []
                                    : chosenHomeworkBestRankingData
                                }
                                loading={chosenHomeworkBestRankingData?.loading}
                              />
                            </ScrollView>
                          </CardWithTitle>
                        </Col>
                        <Col span={12}>
                          <CardWithTitle
                            icon={<IoIosPaper />}
                            title={
                              <>
                                <div className={classes.alignItems}>
                                  <div className={classes.alignTextItem}>
                                    <div className={classes.alignContent}>
                                      <p
                                        style={{
                                          marginTop: "5px",
                                        }}
                                      >
                                        อันดับคะแนนที่น้อยที่สุดในแต่ละบท
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignContent: "center",
                                          justifyContent: "center",
                                          width: "100px",
                                        }}
                                      >
                                        <DropdownForm
                                          title=""
                                          placeholder={
                                            chosenHomeworkWorstRankingName ??
                                            "เลือกบทเรียน"
                                          }
                                          titlespan={6}
                                          dropdownspan={4}
                                          md={8}
                                          lg={7}
                                          loading={studentsOverview?.loading}
                                          overlay={
                                            studentsOverview?.loading ? (
                                              <></>
                                            ) : (
                                              <Menu
                                                onClick={
                                                  onChosenStudentWorstRankingClick
                                                }
                                              >
                                                {Object.entries(
                                                  studentsOverview?.classData
                                                    ?.lessons
                                                )?.map((key) => {
                                                  //console.log((key))
                                                  //return object key
                                                  return (
                                                    <Menu.Item
                                                      key={
                                                        Object.values(key)[0]
                                                      }
                                                    >
                                                      {Object.values(key)[0]}
                                                    </Menu.Item>
                                                  );
                                                })}
                                              </Menu>
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            }
                          >
                            <ScrollView>
                              <WorstTable
                                // datasource={chosenHomeworkWorstRankingData ?? []}
                                datasource={
                                  chosenHomeworkWorstRankingData?.loading
                                    ? []
                                    : chosenHomeworkWorstRankingData
                                }
                                loading={
                                  chosenHomeworkWorstRankingData?.loading
                                }
                              />
                            </ScrollView>
                          </CardWithTitle>
                        </Col>
                      </Row>
                    </Box>
                  </TabPane>

                  {/* <TabPane tab="รายขื่อ" key="2">
                    <StudentListPageTSV1 />
                  </TabPane> */}

                  {/* <TabPane tab="คะแนน" key="2">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button key="1" type="primary" onClick={showModal}>
                        แก้ไขสัดส่วนคะแนน <UnorderedListOutlined />
                      </Button>
                    </div>
                    <Box mt="3">
                      <ScrollView>
                        <AvgAcademicTable
                          datasource={chosenHomeworkWorstRankingData?.[0]?.schools ?? []}
                          loading={chosenHomeworkWorstRankingData?.loading}
                        />
                      </ScrollView>
                    </Box>
                    <Modal
                      className="modalStyle"
                      title="ปรับสัดส่วนคะแนน"
                      maskStyle={{
                        backgroundColor: "rgba(200, 200, 200, 0.50)",
                      }}
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={[
                        <span className={classes.modalFooter}>
                          กรุณาปรับสัดส่วนให้ครบ 100% (ขาดอีก 10%)
                        </span>,
                        <button
                          onClick={handleCancel}
                          className={classes.modalCancelButton}
                        >
                          ยกเลิก
                        </button>,
                        <button
                          onClick={handleOk}
                          className={classes.modalSubmitButton}
                        >
                          บันทึก
                        </button>,
                      ]}
                    >
                      <div className={classes.modalContainer}>
                        <Row>
                          <Col span={9} offset={3}>
                            <span className={classes.modalHeader}>บทเรียน</span>
                          </Col>
                          <Col span={12}>
                            <span className={classes.modalHeader}>
                              สัดส่วนโดยรวม
                            </span>
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 1</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>10%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 2</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>20%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 3</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>10%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 4</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>10%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 5</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>10%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 6</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>20%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 7</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>10%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={9} offset={3}>
                            <p>บทเรียนที่ 8</p>
                          </Col>
                          <Col span={4} offset={2}>
                            <button className={classes.modalButton}>0%</button>
                          </Col>
                          <Col span={4} offset={2}>
                            <RiEqualizerLine
                              className={classes.Icon1}
                              onClick={showModal2}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Modal>
                    <Modal
                      className="modalStyle"
                      title=""
                      maskStyle={{
                        backgroundColor: "rgba(200, 200, 200, 0.50)",
                      }}
                      visible={isModalVisible2}
                      onOk={handleOk2}
                      onCancel={handleCancel}
                      footer={[
                        <button
                          onClick={handleCancel2}
                          className={classes.modalCancelButton}
                        >
                          ยกเลิก
                        </button>,
                        <button
                          onClick={handleOk2}
                          className={classes.modalSubmitButton}
                        >
                          บันทึก
                        </button>,
                      ]}
                    >
                      <div className={classes.modalContainer}>
                        <Row>
                          <Col span={8}>
                            <span className={classes.modalHeaderB}>
                              การคิดคะแนนของ
                            </span>
                          </Col>
                          <Col span={16}>
                            <span className={classes.modalHeader}>
                              บทเรียนที่ 1
                            </span>
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={10} offset={2}>
                            <span className={classes.modalHeader}>คะแนน</span>
                          </Col>
                          <Col span={8} offset={4}>
                            <span className={classes.modalHeader}>
                              สัดส่วนคะแนน
                            </span>
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={10} offset={2}>
                            <p className={classes.modalHeaderB}>คะแนนสะสม</p>
                          </Col>
                          <Col span={6} offset={6}>
                            <button className={classes.modalButton}>70%</button>
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={10} offset={2}>
                            <p className={classes.modalHeaderB}>
                              คะแนนจากบอสย่อย
                            </p>
                          </Col>
                          <Col span={6} offset={6}>
                            <button className={classes.modalButton}>20%</button>
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>

                          <Col span={10} offset={2}>
                            <p className={classes.modalHeaderB}>
                              คะแนนจากบอสใหญ่
                            </p>
                          </Col>
                          <Col span={6} offset={6}>
                            <button className={classes.modalButton}>20%</button>
                          </Col>
                          <Col span={24}>
                            <hr />
                          </Col>
                        </Row>
                      </div>
                    </Modal>
                  </TabPane> */}
                </Tabs>
              </Col>
            </Row>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
