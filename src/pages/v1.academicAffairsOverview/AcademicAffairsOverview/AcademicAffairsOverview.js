import React, { useRef, useEffect, useState } from "react";
import classes from "./AcademicAffairsOverview.module.css";
import {
  Dropdown,
  Menu,
  ScrollView,
  Divider,
  Progress,
  Col,
  Row,
  Card,
  Box,
  Marker,
} from "../../../core/components";
import {
  DropdownForm,
  ScoreTotal,
  CardWithTitle,
  HorizontalBarChart,
  StatisticWithIconStudentLarge,
  CardWithAvatar,
} from "../../../components/Statistics";

import {
  LineChartOutlined,
  AreaChartOutlined,
  ContainerFilled,
} from "@ant-design/icons";

import { message } from "antd";

import StatisticWithIconSchool from "../../../components/Statistics/StatisticWithIcon/StatisticWithIconSchool";
import StatisticWithIconClassroom from "../../../components/Statistics/StatisticWithIcon/StatisticWithIconClassroom";
import StatisticWithIconStudent from "../../../components/Statistics/StatisticWithIcon/StatisticWithIconStudent";
import StatisticWithIconTeacher from "../../../components/Statistics/StatisticWithIcon/StatisticWithIconTeacher";

import { IoLogoGameControllerB, IoIosPaper } from "react-icons/io";

import GoogleMapReact from "google-map-react";

import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import { SchoolService, TeacherService } from "../../../services/Statistics";

export default function AcademicAffairsOverview() {
  const parent = useRef(Parent);

  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });

  // Return map bounds based on list of places
  const getMapBounds = (map, maps, places) => {
    setTimeout(() => {
      const bounds = new maps.LatLngBounds();

      places.forEach((place) => {
        bounds.extend(
          new maps.LatLng(place.geoPoint._latitude, place.geoPoint._longitude)
        );

        console.log(
          "apiIsLoaded",
          place.geoPoint._latitude,
          place.geoPoint._longitude
        );
      });
      return bounds;
    }, 100);
  };

  // Re-center map when resizing the window
  const bindResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, "idle", () => {
      maps.event.addDomListener(window, "resize", () => {
        map.fitBounds(bounds);
      });
    });
  };

  // Fit map to its bounds after the api is loaded
  const apiIsLoaded = (map, maps, places) => {
    setTimeout(() => {
      // Get bounds by our places
      const bounds = getMapBounds(map, maps, places);
      // Fit map to bounds
      map.fitBounds(bounds);
      // Bind the resize listener
      bindResizeListener(map, maps, bounds);
    }, 100);
  };

  const [schoolProfile, setSchoolProfile] = useState({
    loading: true,
  });
  const [schoolStatistics, setSchoolStatistics] = useState({
    loading: true,
  });

  const schoolId = window.localStorage.getItem("schoolId");

  useEffect(() => {
    SchoolService.getSchoolProfileBySchoolIdAsync(schoolId).then((res) => {
      // setSchoolProfile(res)
      setStateAndValidate(schoolProfile, setSchoolProfile, res);
    });
    SchoolService.getSchoolsStatisticsBySchoolIdAsync(schoolId).then((res) => {
      // setSchoolStatistics
      setStateAndValidate(schoolStatistics, setSchoolStatistics, res);
    });
  }, [schoolId]);

  const setStateAndValidate = (state, setState, data) => {
    // console.log("setStateAndValidate");
    if (data?.error) {
      setState({
        ...state,
        error: data.error,
      });
    } else {
      setState(data);
    }
  };

  const renderGradeLevelIsActives = (school) => {
    const arrayGrades = [];
    Object.values(school?.gradeLevelIsActive).map((value) => {
      if (value.isActive) {
        arrayGrades.push(value.nameThai);
      }
    });
    arrayGrades.sort();
    const arrGroup = arrayGrades.reduce((acc, obj) => {
      const key = obj.slice(0, 2);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj.slice(2));
      return acc;
    }, {});
    // console.log(arrGroup);
    return arrayGrades.join(", ");
  };

  const renderGradeLevelIsActivesGroup = (school) => {
    const arrayGrades = [];
    Object.values(school?.gradeLevelIsActive).map((value) => {
      if (value.isActive) {
        arrayGrades.push(value.nameThai);
      }
    });
    arrayGrades.sort();
    const arrGroup = arrayGrades.reduce((acc, obj) => {
      const key = obj.slice(0, 2);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj.slice(2));
      return acc;
    }, {});

    let text = "";
    Object.keys(arrGroup).map((key) => {
      text +=
        key +
        arrGroup[key][0] +
        " - " +
        arrGroup[key][arrGroup[key].length - 1];
      text += " , ";
    });

    return text;
  };

  //หัวหน้าหมวด
  //ข้อมูล dropdown ชื่อคุณครูในโรงเรียน
  const [teachersInSchool, setTeachersInSchool] = useState({
    loading: true,
    data: {},
  });
  const [chosenTeacherName, setChosenTeacherName] = useState(null);
  const [chosenTeacherUid, setChosenTeacherUid] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setTimeout(() => {
      SchoolService.getUserPositionTeacherBySchoolIdAsync(schoolId).then(
        (res) => {
          if (res.error) {
            setTeachersInSchool({
              ...teachersInSchool,
              error: res.error,
            });
          } else {
            setTeachersInSchool(res);
          }
        }
      );
    }, 500);
  }, []);

  const onChosenTeacherClick = ({ key }) => {
    //filter object by key
    // const item = Object.entries(teachersInSchool).filter(
    //   (teacherData) => {
    //     // console.log(teacherData[0])
    //     if (teacherData?.[1]?.firstName === key) return teacherData?.[0];
    //   }
    // );

    let item = "";
    Object.entries(teachersInSchool).forEach((teacherData) => {
      if (teacherData?.[1]?.firstName === key) {
        item = teacherData?.[0];
      }
    });
    //console.log(item)
    setChosenTeacherUid(item);
    setChosenTeacherName(key);
    console.log(chosenTeacherUid);
  };

  //ข้อมูล dropdown ชื่อห้องเรียนของคุณครูในโรงเรียนที่เลือก
  const [classroomsOfChosenTeacher, setClassroomsOfChosenTeacher] = useState({
    loading: true,
    data: {},
  });
  const [chosenClassroomName, setChosenClassroomName] = useState(null);
  const [chosenClassroomUid, setChosenClassroomUid] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setTimeout(() => {
      if (chosenTeacherUid.loading !== true) {
        let userId = chosenTeacherUid;
        SchoolService.getTeachersByUserIdAsync(userId).then((res) => {
          if (res.error) {
            setClassroomsOfChosenTeacher({
              ...classroomsOfChosenTeacher,
              error: res.error,
            });
          } else {
            setClassroomsOfChosenTeacher(res);
          }
        });
      }
    }, 100);
  }, [chosenTeacherUid]);

  const onChosenClassroomClick = ({ key }) => {
    let item = "";
    Object.entries(classroomsOfChosenTeacher).forEach((classroomData) => {
      if (classroomData?.[1]?.name === key) {
        item = classroomData?.[0];
      }
    });
    //console.log(item)
    setChosenClassroomName(key);
    setChosenClassroomUid(item);
    console.log(chosenClassroomName);
    console.log(chosenClassroomUid);
  };

  //Student Overview (API)
  //ข้อมูลนักเรียนทั้งหมดของครู
  const [studentsOverview, setStudentsOverview] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    let spaceID = chosenClassroomUid;
    if (chosenClassroomUid.loading !== true) {
      TeacherService.getStudentsOverviewAsync(spaceID).then((res) => {
        if (res?.error || res === undefined || res === null) {
          setStudentsOverview({
            ...studentsOverview,
            error: res?.error,
          });
          message.error("ไม่มีข้อมูลนักเรียน... กรุณาเลือกครูและห้องเรียน", 3);
        } else {
          if (res !== undefined && res !== null) {
            setStudentsOverview(res);
          }
        }
      });
    }
  }, [chosenClassroomUid]);

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
  const onChosenClassroomClick2 = ({ key }) => {
    //filter object by key
    const item = Object.entries(studentsOverview?.classData?.lessons).filter(
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
    }, 100);
  };

  //set ความก้าวหน้าของบทเรียนเป็น item แรก (default)
  useEffect(() => {
    if (studentsOverview.loading !== true) {
      const item = Object.entries(studentsOverview?.classData?.lessons).filter(
        (classroomData) => {
          if (classroomData?.[0] !== null) return classroomData?.[0];
        }
      );
      setChosenHomeworkData(item);
      setChosenHomeworkName(item?.[0]?.[0]);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 100);
      //console.log(item);
    }
  }, [studentsOverview, chosenClassroomUid]);

  const onClickConsoleLog = () => {
    //console.log(Object.entries(classroomsOfChosenTeacher));
    console.log(studentsOverview);
    console.log(chosenHomeworkData);
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={
          <>
            <div className={classes.alignItems}>
              <div className={classes.alignTextItem}>
                <div className={classes.alignContent}>
                  <p
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ภาพรวมโรงเรียน{schoolProfile?.name?.thai ?? ""}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      width: "100px",
                      marginLeft: "50px",
                    }}
                  >
                    <DropdownForm
                      title=""
                      placeholder={chosenTeacherName ?? "เลือกคุณครู"}
                      titlespan={6}
                      dropdownspan={4}
                      md={8}
                      lg={7}
                      loading={teachersInSchool?.loading}
                      overlay={
                        teachersInSchool?.loading ? (
                          <></>
                        ) : (
                          <Menu onClick={onChosenTeacherClick}>
                            {Object.entries(teachersInSchool).map((key) => {
                              return (
                                <Menu.Item
                                  key={Object.values(key)[1].firstName}
                                >
                                  {Object.values(key)[1].firstName}
                                </Menu.Item>
                              );
                            })}
                          </Menu>
                        )
                      }
                    />
                    <div
                      style={{
                        marginLeft: "15px",
                      }}
                    >
                      <DropdownForm
                        title=""
                        placeholder={chosenClassroomName ?? "เลือกห้องเรียน"}
                        titlespan={6}
                        dropdownspan={4}
                        md={8}
                        lg={7}
                        loading={classroomsOfChosenTeacher?.loading}
                        overlay={
                          classroomsOfChosenTeacher?.loading ? (
                            <></>
                          ) : (
                            <Menu onClick={onChosenClassroomClick}>
                              {Object.entries(classroomsOfChosenTeacher).map(
                                (key) => {
                                  return (
                                    <Menu.Item key={Object.values(key)[1].name}>
                                      {Object.values(key)[1].name}
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
            </div>
            {/* <div onClick={onClickConsoleLog}>console log</div> */}
          </>
        }
      />

      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col span={24}>
                <Box>
                  <Card>
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} sm={6} md={5} lg={5}>
                        <Box onClick={onClickConsoleLog}>
                          <StatisticWithIconStudentLarge
                            className="Overview-StatisticWithIcon"
                            title="นักเรียนทั้งหมด"
                            value={
                              studentsOverview?.loading
                                ? ""
                                : Object.keys(studentsOverview?.students).length
                            }
                            suffix="คน"
                            iconSize="120px"
                            height="247px"
                          />
                        </Box>
                      </Col>
                      <Col xs={24} sm={18} md={9} lg={9}>
                        <Box>
                          <CardWithTitle
                            title={`จำนวนด่านที่ผ่านโดยเฉลี่ยจากทั้งหมด (${
                              studentsOverview?.loading
                                ? 0
                                : studentsOverview?.classData?.maxQuizzes
                            }
                                  ด่าน)`}
                            icon={<IoLogoGameControllerB />}
                          >
                            <Row gutter={[8, 8]} type="flex">
                              <Col span={12}>
                                <Box mt="3" mb="3">
                                  <Row justify="center" type="flex">
                                    <Col span={14}>
                                      <Progress
                                        type="circle"
                                        percent={
                                          studentsOverview?.classData?.passedPercentage?.toFixed(
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
                                : studentsOverview?.classData?.maxScore
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
                                            : +(
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
                                        chosenHomeworkData?.[0]?.[1]?.subLessons
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
                                            onClick={onChosenClassroomClick2}
                                          >
                                            {Object.entries(studentsOverview?.classData?.lessons).map(
                                              (key) => {
                                                return (
                                                  <Menu.Item
                                                    key={Object.values(key)[0]}
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
                                    return val.passedPercentage?.toFixed(2);
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
                              {chosenHomeworkData?.[0]?.[1]?.passedQuizzes ||
                                "0"}
                              /
                              {chosenHomeworkData?.[0]?.[1]?.maxQuizzes || "0"}
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

                <Col xs={24} md={24}>
                  <CardWithTitle
                    icon={<ContainerFilled />}
                    title="ข้อมูลพื้นฐานของโรงเรียน"
                  >
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} sm={9}>
                        <Box>
                          <CardWithAvatar
                            title="ผู้อำนวยการโรงเรียน"
                            description={schoolProfile?.schoolDirector?.name}
                          />
                        </Box>

                        <Box mt="2">
                          <Row gutter={[8, 8]}>
                            <Col xs={24} sm={12}>
                              <StatisticWithIconStudent
                                title="นักเรียนทั้งหมด"
                                value={
                                  schoolStatistics?.statistics?.total
                                    ?.totalStudents ?? 0
                                }
                                suffix="คน"
                                active={
                                  schoolProfile?.gradeLevelIsActive?.primary4
                                }
                              />
                            </Col>
                            <Col xs={24} sm={12}>
                              <StatisticWithIconTeacher
                                title="ครูทั้งหมด"
                                value={
                                  schoolStatistics?.statistics?.total
                                    ?.totalClassroom ?? 0
                                }
                                suffix="คน"
                                active={
                                  schoolProfile?.gradeLevelIsActive?.primary5
                                }
                              />
                            </Col>
                            <Col xs={24} sm={12}>
                              <StatisticWithIconSchool
                                title="ระดับชั้นที่เปิดสอน"
                                value={
                                  schoolProfile?.loading
                                    ? "Waiting"
                                    : renderGradeLevelIsActivesGroup(
                                        schoolProfile
                                      )
                                }
                                active={
                                  schoolProfile?.gradeLevelIsActive?.primary6
                                }
                              />
                            </Col>
                            <Col xs={24} sm={12}>
                              <StatisticWithIconClassroom
                                title="จำนวนห้องเรียน"
                                value={
                                  schoolStatistics?.statistics?.total
                                    ?.totalClassroom ?? 0
                                }
                                suffix="ห้อง"
                              />
                            </Col>
                          </Row>
                        </Box>
                      </Col>
                      <Col xs={24} sm={15}>
                        <Card
                          hoverable
                          className="w-100"
                          cover={
                            //Important! Always set the container height explicitly
                            <div style={{ height: "240px", width: "100%" }}>
                              <GoogleMapReact
                                bootstrapURLKeys={{
                                  key: "AIzaSyAb4djYb910xZWA3fBVe3tkG8z6VCM-4iY",
                                }}
                                defaultCenter={{
                                  lat: 13.736717,
                                  lng: 100.523186,
                                }} // Bangkok Center
                                defaultZoom={15}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({ map, maps }) => {
                                  return apiIsLoaded(
                                    map,
                                    maps,
                                    schoolProfile?.addresses
                                      ? schoolProfile?.addresses
                                      : []
                                  );
                                }}
                              >
                                {(schoolProfile?.addresses
                                  ? schoolProfile?.addresses
                                  : []
                                ).map((place) => (
                                  <Marker
                                    key={place.number}
                                    text={place.region}
                                    lat={place.geoPoint._latitude}
                                    lng={place.geoPoint._longitude}
                                  />
                                ))}
                                <Marker
                                  key={1}
                                  text={"Name"}
                                  lat={13.736717}
                                  lng={100.523186}
                                />
                              </GoogleMapReact>
                            </div>
                          }
                        ></Card>

                        <Box mt="3">
                          <h4 className="text-primary">
                            {`โรงเรียน${schoolProfile?.name?.thai}`}
                          </h4>
                          <p className="text-gray">
                            {`${
                              schoolProfile?.addresses
                                ? schoolProfile?.addresses[0]?.number ?? ""
                                : ""
                            } ${
                              schoolProfile?.addresses
                                ? schoolProfile?.addresses[0]?.district ?? ""
                                : ""
                            } ${
                              schoolProfile?.addresses
                                ? schoolProfile?.addresses[0]?.subDistrict ?? ""
                                : ""
                            } ${
                              schoolProfile?.addresses
                                ? schoolProfile?.addresses[0]?.province ?? ""
                                : ""
                            } ${
                              schoolProfile?.addresses
                                ? schoolProfile?.addresses[0]?.zipPost ?? ""
                                : ""
                            }`}
                          </p>

                          <Divider orientation="left"></Divider>
                          <h4 className="text-primary">สังกัด</h4>
                          <p className="text-gray">
                            {"-"}
                            {schoolProfile?.loading
                              ? ""
                              : schoolProfile?.affiliation.map((value) => {
                                  return <span>{value?.name?.thai}, </span>;
                                })}
                          </p>

                          <Divider orientation="left"></Divider>

                          <h4 className="text-primary">เขตพื้นที่การศึกษา</h4>
                          <p className="text-gray">
                            {"-"}
                            {schoolProfile?.loading
                              ? ""
                              : schoolProfile?.educationServiceArea}
                          </p>

                          <Divider orientation="left"></Divider>

                          <h4 className="text-primary">ระดับชั้นที่เปิดสอน</h4>
                          <p className="text-gray">
                            {schoolProfile?.loading
                              ? "Waiting"
                              : renderGradeLevelIsActives(schoolProfile)}
                          </p>

                          <Divider orientation="left"></Divider>
                        </Box>
                      </Col>
                    </Row>
                  </CardWithTitle>
                </Col>
              </Col>
            </Row>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
