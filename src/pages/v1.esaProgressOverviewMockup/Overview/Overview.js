import classes from "./Overview.module.css";

import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Col, Row, Card, Box, Menu, Tabs } from "../../../core/components";

import {
  CardWithTitleNoIcon,
  DropdownFormNoTitle,
  VerticalBarChartJsInspectDistrictProgress,
  VerticalBarChartJsEsaProgress,
  VerticalBarChartJsSchoolProgress,
  VerticalBarChartJsClassroomProgress,
} from "../../../components/Statistics";

import { DatePicker } from "antd";

import { VscGraphLine } from "react-icons/vsc";

import ProgressCard from "./ProgressCard";
import TeacherCard from "./TeacherCard";

import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import * as districtInspectData from "./districtInspectData.json";

import { SchoolService } from "../../../services/Statistics";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function PageESAProgressOverviewMockup() {
  const parent = useRef(Parent);

  //positon ของ user ที่ login (eg. S-1)
  const [position, setPosition] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setPosition(window.localStorage.getItem("positions"));
  }, []);

  //data เขตตรวจ 1 - 18
  const [districtInspector, setDistrictInspector] = useState({
    loading: true,
    data: {},
  });
  const [chosenDistrictInspectorData, setChosenDistrictInspectorData] =
    useState({
      loading: true,
      data: {},
    });

  useEffect(() => {
    setDistrictInspector(districtInspectData.default.districtInspector);
  }, []);

  //data เขตพื้นที่
  const [chosenESAData, setChosenESAData] = useState({
    loading: true,
    data: {},
  });

  //data โรงเรียน
  const [chosenSchoolData, setChosenSchoolData] = useState({
    loading: true,
    data: {},
  });

  // data ห้องเรียน
  const [chosenClassroomData, setChosenClassroomData] = useState({
    loading: true,
    data: {},
  });

  const onClick = () => {
    //console.log(districtInspector);
    // console.log(Object.entries(chosenDistrictInspectorData));
    // console.log(chosenDistrictInspectorData);
    // console.log(chosenESAData);
    // console.log(chosenSchoolData);
    // console.log(chosenClassroomData);
    // console.log(position);
    console.log(userESAName);
    console.log(userSchoolName);
  };

  //เปลี่ยนสี background ของbutton ขึ้นกับ percentage ของคะแนนเขตพื้นที่ในเขตตรวจ
  const getDistrictInspectorButtonBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 20) {
      color = "#C22E1A";
    } else if (item.percentage >= 20 && item.percentage < 40) {
      color = "#D26C0D";
    } else if (item.percentage >= 40 && item.percentage < 60) {
      color = "#EFB622";
    } else if (item.percentage >= 60 && item.percentage < 80) {
      color = "#AEB024";
    } else if (item.percentage >= 80) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbutton ขึ้นกับ percentage ของคะแนนโรงเรียนในเขตพื้นที่
  const getESAButtonBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 20) {
      color = "#C22E1A";
    } else if (item.percentage >= 20 && item.percentage < 40) {
      color = "#D26C0D";
    } else if (item.percentage >= 40 && item.percentage < 60) {
      color = "#EFB622";
    } else if (item.percentage >= 60 && item.percentage < 80) {
      color = "#AEB024";
    } else if (item.percentage >= 80) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbutton ขึ้นกับ percentage ของคะแนนห้องเรียนในโรงเรียน
  const getSchoolButtonBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 20) {
      color = "#C22E1A";
    } else if (item.percentage >= 20 && item.percentage < 40) {
      color = "#D26C0D";
    } else if (item.percentage >= 40 && item.percentage < 60) {
      color = "#EFB622";
    } else if (item.percentage >= 60 && item.percentage < 80) {
      color = "#AEB024";
    } else if (item.percentage >= 80) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนโรงเรียนในเขตตรวจ
  const getDistrictInspectorBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.progress === 0) {
      color = "grey";
    } else if (item.progress >= 1 && item.progress < 50) {
      color = "#C22E1A";
    } else if (item.progress >= 50 && item.progress < 100) {
      color = "#D26C0D";
    } else if (item.progress >= 100 && item.progress < 150) {
      color = "#EFB622";
    } else if (item.progress >= 150 && item.progress < 200) {
      color = "#AEB024";
    } else if (item.progress >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนเขตพื้นที่
  const getESABarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.progress === 0) {
      color = "grey";
    } else if (item.progress >= 1 && item.progress < 50) {
      color = "#C22E1A";
    } else if (item.progress >= 50 && item.progress < 100) {
      color = "#D26C0D";
    } else if (item.progress >= 100 && item.progress < 150) {
      color = "#EFB622";
    } else if (item.progress >= 150 && item.progress < 200) {
      color = "#AEB024";
    } else if (item.progress >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนห้องเรียนในโรงเรียน
  const getSchoolBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.progress === 0) {
      color = "grey";
    } else if (item.progress >= 1 && item.progress < 50) {
      color = "#C22E1A";
    } else if (item.progress >= 50 && item.progress < 100) {
      color = "#D26C0D";
    } else if (item.progress >= 100 && item.progress < 150) {
      color = "#EFB622";
    } else if (item.progress >= 150 && item.progress < 200) {
      color = "#AEB024";
    } else if (item.progress >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนห้องเรียนในtabข้อมูลห้องเรียน
  const getClassroomBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.progress === 0) {
      color = "grey";
    } else if (item.progress >= 1 && item.progress < 50) {
      color = "#C22E1A";
    } else if (item.progress >= 50 && item.progress < 100) {
      color = "#D26C0D";
    } else if (item.progress >= 100 && item.progress < 150) {
      color = "#EFB622";
    } else if (item.progress >= 150 && item.progress < 200) {
      color = "#AEB024";
    } else if (item.progress >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //bar chart คะแนนเขตตรวจ loading
  const [
    barChartStatisticsByDistricInspector,
    setBarChartStatisticsByDistricInspector,
  ] = useState({
    loading: true,
  });

  //bar chart คะแนนเขตพื้นที่ loading
  const [barChartStatisticsByESA, setBarChartStatisticsByESA] = useState({
    loading: true,
  });

  //bar chart คะแนนโรงเรียนที่ loading
  const [barChartStatisticsBySchool, setBarChartStatisticsBySchool] = useState({
    loading: true,
  });

  //bar chart คะแนนห้องเรียนที่ loading
  const [barChartStatisticsByClassroom, setBarChartStatisticsByClassroom] =
    useState({
      loading: true,
    });

  //bar chart ข้อมูลห้องเรียน loading
  const [barChartStatisticsByClassroom2, setBarChartStatisticsByClassroom2] =
    useState({
      loading: true,
    });

  //ชื่อต่างๆที่เลือกใน dropdown 4 อัน
  const [chosenDistricInspectorName, setChosenDistricInspectorName] =
    useState(null);
  const [chosenESAName, setChosenESAName] = useState(null);
  const [chosenSchoolName, setChosenSchoolName] = useState(null);
  const [chosenClassroomName, setChosenClassroomName] = useState(null);

  const onChosenDistricInspectorName = ({ key }) => {
    let item = "";
    Object.entries(districtInspector).forEach((data) => {
      if (data?.[1]?.name === key) {
        item = data?.[1];
      }
    });
    setChosenDistricInspectorName(item?.name);
    setChosenDistrictInspectorData(item);
    setBarChartStatisticsByESA({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsByESA({ loading: false });
    }, 500);
  };

  //dropdownเลือกเขตตรวจ ระดับเขตตรวจที่เห็นแค่เขตตรวจตัวเอง
  const onChosenDistricInspectorName2 = ({ key }) => {
    let item = "";
    Object.entries(districtInspector).forEach((data) => {
      if (data?.[1]?.name === key) {
        item = data?.[1];
      }
    });
    setChosenDistricInspectorName(item?.name);
    setChosenDistrictInspectorData(item);
    setBarChartStatisticsByESA({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsByESA({ loading: false });
    }, 500);
  };

  const onChosenESAName = ({ key }) => {
    const item = chosenDistrictInspectorData?.educationServiceArea?.filter(
      (data) => {
        if (data?.name === key) return data;
      }
    );
    console.log(item);
    setChosenESAData({ loading: true });
    setChosenESAName(item?.[0]?.name);
    setChosenESAData(item?.[0]);
    setBarChartStatisticsBySchool({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsBySchool({ loading: false });
    }, 500);
  };

  //dropdownเลือกเขตพื้นที่ ระดับเขตพื้นที่เห็นแค่เขตพื้นที่ตัวเอง
  const onChosenESAName2 = ({ key }) => {
    const item = chosenDistrictInspectorData?.educationServiceArea?.filter(
      (data) => {
        if (data?.name === key) return data;
      }
    );
    console.log(item);
    setChosenESAData({ loading: true });
    setChosenESAData(item?.[0]);
    setBarChartStatisticsBySchool({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsBySchool({ loading: false });
    }, 500);
  };

  const onChosenSchoolName = ({ key }) => {
    if (chosenESAData.loading !== true) {
      const item = chosenESAData?.school?.filter((data) => {
        if (data?.name === key) return data;
      });
      console.log(item);
      setChosenSchoolName(item?.[0]?.name);
      setChosenSchoolData(item?.[0]);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 500);
    }
  };

  //dropdownเลือกโรงเรียน ครู รองผอ ผอ หัวหน้าหมวด ฝ่ายวิชาการเห็นแค่โรงเรียนตัวเอง
  const onChosenSchoolName2 = ({ key }) => {
    if (chosenESAData.loading !== true) {
      const item = chosenESAData?.school?.filter((data) => {
        if (data?.name === key) return data;
      });
      console.log(item);
      setChosenSchoolData(item?.[0]);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 500);
    }
  };

  const onChosenClassroomName = ({ key }) => {
    if (chosenSchoolData.loading !== true) {
      const item = chosenSchoolData?.classroom?.filter((data) => {
        if (data?.name === key) return data;
      });
      console.log(item);
      setChosenClassroomName(item?.[0]?.name);
      setChosenClassroomData(item?.[0]);
      setBarChartStatisticsByClassroom2({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom2({ loading: false });
      }, 500);
    }
  };

  //set รายงานความก้าวหน้าทั้งหมด/ เขตตรวจทั้งหมด/ เขตพื้นที่ทั้งหมด /โรงเรียน เป็น item แรก (default)
  useEffect(() => {
    if (districtInspector.loading !== true) {
      setBarChartStatisticsByDistricInspector(false);

      setChosenDistrictInspectorData(districtInspector?.[0]);
      setChosenDistricInspectorName(districtInspector?.[0]?.name);
      setBarChartStatisticsByESA(false);

      setChosenESAData(districtInspector?.[0]?.educationServiceArea?.[0]);
      setChosenESAName(districtInspector?.[0]?.educationServiceArea?.[0]?.name);
      setBarChartStatisticsBySchool(false);

      setChosenSchoolData(
        districtInspector?.[0]?.educationServiceArea?.[0]?.school?.[0]
      );
      setChosenSchoolName(
        districtInspector?.[0]?.educationServiceArea?.[0]?.school?.[0]?.name
      );
      setBarChartStatisticsByClassroom(false);
    }
  }, [districtInspector]);

  //ชื่อเขตตรวจของ user ที่ login (เขตตรวจ) เผื่อ filter dropdrop เหลือแค่เขตตรวจตัวเอง
  const [userDistrictInspectorName, setUserDistrictInspectorName] = useState({
    loading: true,
  });
  const district = window.localStorage.getItem("districtInspector");
  useEffect(() => {
    setUserDistrictInspectorName(district);
  }, [district]);

  //ชื่อเขตพื้นที่ของ user ที่ login (ระดับเขตพื้นที่) เผื่อ filter dropdrop เหลือแค่เขตตัวเอง
  const [userESAName, setUserESAName] = useState({
    loading: true,
  });
  const esa = window.localStorage.getItem("educationServiceArea");
  useEffect(() => {
    setUserESAName(esa);
  }, [esa]);

  //ชื่อโรงเรียนของ user ที่ login (ครู รอง ผอ หัวหน้าฝ่ายวิชาการ หัวหน้าหมวด) เผื่อ filter dropdrop เหลือแค่โรงเรียนตัวเอง
  const [userSchoolName, setUserSchoolName] = useState({
    loading: true,
  });

  const schoolId = window.localStorage.getItem("schoolId");

  useEffect(() => {
    SchoolService.getSchoolProfileBySchoolIdAsync(schoolId).then((res) => {
      setStateAndValidate(userSchoolName, setUserSchoolName, res);
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

  //data date on ระยะเวลาในการแสดงผล (ข้อมูลครู)
  const [teacherStartTime, setTeacherStartTime] = useState({
    loading: true,
    data: {},
  });
  const [teacherEndTime, setTeacherEndTime] = useState({
    loading: true,
    data: {},
  });

  //Sent time after picking a date on ระยะเวลาในการแสดงผล (ข้อมูลครู)
  const onClickTime = (value) => {
    console.log(value);
    setTeacherStartTime(value?.[0]?._d);
    setTeacherEndTime(value?.[1]?._d);
    console.log(teacherStartTime);
    console.log(teacherEndTime);
  };

  //data date on ระยะเวลาในการแสดงผล (ข้อมูลห้องเรียน)
  const [classroomStartTime, setClassroomStartTime] = useState({
    loading: true,
    data: {},
  });
  const [classroomEndTime, setClassroomEndTime] = useState({
    loading: true,
    data: {},
  });

  //Sent time after picking a date on ระยะเวลาในการแสดงผล (ข้อมูลครู)
  const onClickTime2 = (value) => {
    console.log(value);
    setClassroomStartTime(value?.[0]?._d);
    setClassroomEndTime(value?.[1]?._d);
    console.log(classroomStartTime);
    console.log(classroomEndTime);
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent?.current?.toggleMenu()}
        title="ความก้าวหน้าเขต"
      />

      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col span={24}>
                <Box mt="2">
                  <Row gutter={[8, 8]} type="flex">
                    <Col span={24} offset={0}>
                      <div>
                        <span
                          style={{
                            color: "#1c4e91",
                            fontSize: "0.9rem",
                          }}
                        >
                          ระยะเวลาในการแสดงผล
                        </span>{" "}
                        <RangePicker
                          format="DD-MM-YYYY"
                          placeholder={["เริ่มวันที่", "ถึงวันที่"]}
                          size={"default"}
                          style={{
                            marginLeft: "10px",
                            width: 220,
                          }}
                          onChange={onClickTime}
                          suffixIcon={
                            <div
                              style={{
                                pointerEvents: "none",
                              }}
                            ></div>
                          }
                        />
                      </div>
                      <CardWithTitleNoIcon title="รายงานความก้าวหน้าแบ่งตามเขตตรวจ">
                        {/* <div onClick={onClick}>test</div> */}
                        <VerticalBarChartJsInspectDistrictProgress
                          height={250}
                          width={2500}
                          loading={
                            barChartStatisticsByDistricInspector?.loading
                          }
                          labels={
                            districtInspector.loading
                              ? []
                              : districtInspector?.map((item) => {
                                  return item?.name;
                                })
                          }
                          items={
                            districtInspector?.loading
                              ? []
                              : districtInspector?.map((item) => {
                                  return item?.progress;
                                })
                          }
                          color={
                            districtInspector?.loading
                              ? []
                              : districtInspector?.map((item) => {
                                  return getDistrictInspectorBarChartBackgroundColor(
                                    item
                                  );
                                })
                          }
                        />
                      </CardWithTitleNoIcon>
                    </Col>
                    <Col span={24} offset={0}>
                      <CardWithTitleNoIcon title="ข้อมูลความก้าวหน้าทั้งหมด">
                        <div
                          style={{
                            marginBottom: "15px",
                          }}
                        >
                          <ProgressCard
                            title="เขตตรวจทั้งหมด"
                            numberOfItems={districtInspector?.length || 0}
                            unit="เขต"
                          />
                          <ProgressCard
                            title="เขตพื้นที่ทั้งหมด"
                            numberOfItems={
                              chosenDistrictInspectorData?.educationServiceArea
                                ?.length || 0
                            }
                            unit="เขต"
                          />
                          <ProgressCard
                            title="โรงเรียน"
                            numberOfItems={chosenESAData?.school?.length || 0}
                            unit="โรงเรียน"
                          />
                          <div
                            style={{
                              display: "flex",
                              alignContent: "left",
                              justifyContent: "left",
                              marginLeft: "0px",
                              marginTop: "0px",
                            }}
                          >
                            <span
                              style={{
                                marginLeft: "0px",
                                marginTop: "0px",
                              }}
                            >
                              <DropdownFormNoTitle
                                placeholder={
                                  (
                                    <>
                                      {chosenDistricInspectorName}{" "}
                                      <button
                                        style={{
                                          margin: "0px",
                                          padding: "2px",
                                          //backgroundColor: "#4CA309",
                                          backgroundColor:
                                            getDistrictInspectorButtonBackgroundColor(
                                              chosenDistrictInspectorData
                                            ) || "grey",
                                          border: "none",
                                          borderRadius: "4px",
                                          color: "white",
                                          fontSize: "0.8em",
                                          width: "60px",
                                        }}
                                      >
                                        {chosenDistrictInspectorData?.percentage ||
                                          0}
                                        %
                                      </button>
                                    </>
                                  ) ?? (
                                    <>
                                      กรุณาเลือกเขตตรวจ <button>0%</button>
                                    </>
                                  )
                                }
                                titlespan={0}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={districtInspector?.loading}
                                overlay={
                                  districtInspector?.loading ? (
                                    <></>
                                  ) : (
                                    <Menu
                                      onClick={onChosenDistricInspectorName}
                                    >
                                      {Object.entries(districtInspector).map(
                                        (key) => {
                                          return (
                                            <Menu.Item
                                              key={Object.values(key)[1].name}
                                            >
                                              {Object.values(key)[1].name}
                                            </Menu.Item>
                                          );
                                        }
                                      )}
                                    </Menu>
                                  )
                                }
                              />
                            </span>
                            <span
                              style={{
                                marginLeft: "30px",
                                marginTop: "0px",
                              }}
                            >
                              <DropdownFormNoTitle
                                placeholder={
                                  (
                                    <>
                                      {chosenESAName}{" "}
                                      <button
                                        style={{
                                          margin: "0px",
                                          padding: "2px",
                                          backgroundColor:
                                            getESAButtonBackgroundColor(
                                              chosenESAData
                                            ) || "grey",
                                          border: "none",
                                          borderRadius: "4px",
                                          color: "white",
                                          fontSize: "0.8em",
                                          width: "60px",
                                        }}
                                      >
                                        {chosenESAData?.percentage || 0}%
                                      </button>
                                    </>
                                  ) ?? (
                                    <>
                                      กรุณาเลือกเขตพื้นที่ <button>0%</button>
                                    </>
                                  )
                                }
                                titlespan={0}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={chosenDistrictInspectorData?.loading}
                                overlay={
                                  chosenDistrictInspectorData?.loading ? (
                                    <></>
                                  ) : (
                                    <Menu onClick={onChosenESAName}>
                                      {chosenDistrictInspectorData?.educationServiceArea?.map(
                                        (key) => {
                                          return (
                                            <Menu.Item key={key.name}>
                                              {key.name}
                                            </Menu.Item>
                                          );
                                        }
                                      )}
                                    </Menu>
                                  )
                                }
                              />
                            </span>
                            <span
                              style={{
                                marginLeft: "30px",
                                marginTop: "0px",
                              }}
                            >
                              <DropdownFormNoTitle
                                placeholder={
                                  (
                                    <>
                                      {chosenSchoolName}{" "}
                                      <button
                                        style={{
                                          margin: "0px",
                                          padding: "2px",
                                          backgroundColor:
                                            getSchoolButtonBackgroundColor(
                                              chosenSchoolData
                                            ) || "grey",
                                          border: "none",
                                          borderRadius: "4px",
                                          color: "white",
                                          fontSize: "0.8em",
                                          width: "60px",
                                        }}
                                      >
                                        {chosenSchoolData?.percentage || 0}%
                                      </button>
                                    </>
                                  ) ?? (
                                    <>
                                      กรุณาเลือกโรงเรียน <button>0%</button>
                                    </>
                                  )
                                }
                                titlespan={0}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={chosenESAData?.loading}
                                overlay={
                                  chosenESAData?.loading ? (
                                    <></>
                                  ) : (
                                    <Menu onClick={onChosenSchoolName}>
                                      {chosenESAData?.school?.map((key) => {
                                        return (
                                          <Menu.Item key={key.name}>
                                            {key.name}
                                          </Menu.Item>
                                        );
                                      })}
                                    </Menu>
                                  )
                                }
                              />
                            </span>
                          </div>
                        </div>
                        <CardWithTitleNoIcon
                          title={
                            "ภาพรวมข้อมูล" + (chosenDistricInspectorName || "")
                          }
                        >
                          <VerticalBarChartJsEsaProgress
                            height={250}
                            width={2500}
                            loading={barChartStatisticsByESA?.loading}
                            labels={
                              chosenDistrictInspectorData.loading
                                ? []
                                : chosenDistrictInspectorData?.educationServiceArea?.map(
                                    (item) => {
                                      return [
                                        item?.type || "",
                                        item?.name || "",
                                      ];
                                    }
                                  )
                            }
                            items={
                              chosenDistrictInspectorData?.loading
                                ? []
                                : chosenDistrictInspectorData?.educationServiceArea?.map(
                                    (item) => {
                                      return item?.progress;
                                    }
                                  )
                            }
                            color={
                              chosenDistrictInspectorData?.loading
                                ? []
                                : chosenDistrictInspectorData?.educationServiceArea?.map(
                                    (item) => {
                                      return getESABarChartBackgroundColor(
                                        item
                                      );
                                    }
                                  )
                            }
                          />
                        </CardWithTitleNoIcon>
                        <CardWithTitleNoIcon title={chosenESAName || ""}>
                          <VerticalBarChartJsSchoolProgress
                            height={250}
                            width={2500}
                            loading={barChartStatisticsBySchool?.loading}
                            labels={
                              chosenESAData.loading
                                ? []
                                : chosenESAData?.school?.map((item) => {
                                    return item?.name;
                                  })
                            }
                            items={
                              chosenESAData?.loading
                                ? []
                                : chosenESAData?.school?.map((item) => {
                                    return item?.progress;
                                  })
                            }
                            color={
                              chosenESAData?.loading
                                ? []
                                : chosenESAData?.school?.map((item) => {
                                    return getESABarChartBackgroundColor(item);
                                  })
                            }
                          />
                        </CardWithTitleNoIcon>
                        <CardWithTitleNoIcon
                          title={"โรงเรียน" + chosenSchoolName || ""}
                        >
                          <VerticalBarChartJsClassroomProgress
                            height={250}
                            width={2500}
                            loading={barChartStatisticsByClassroom?.loading}
                            labels={
                              chosenSchoolData.loading
                                ? []
                                : chosenSchoolData?.classroom?.map((item) => {
                                    return item?.name;
                                  })
                            }
                            items={
                              chosenSchoolData?.loading
                                ? []
                                : chosenSchoolData?.classroom?.map((item) => {
                                    return item?.progress;
                                  })
                            }
                            color={
                              chosenSchoolData?.loading
                                ? []
                                : chosenSchoolData?.classroom?.map((item) => {
                                    return getSchoolBarChartBackgroundColor(
                                      item
                                    );
                                  })
                            }
                          />
                        </CardWithTitleNoIcon>
                      </CardWithTitleNoIcon>
                    </Col>
                    <Col span={24} offset={0}>
                      <CardWithTitleNoIcon title="ข้อมูลโรงเรียน">
                        <div>
                          <ProgressCard
                            title="เขตตรวจทั้งหมด"
                            numberOfItems={districtInspector?.length || 0}
                            unit="เขต"
                          />
                          <ProgressCard
                            title="เขตพื้นที่ทั้งหมด"
                            numberOfItems={
                              chosenDistrictInspectorData?.educationServiceArea
                                ?.length || 0
                            }
                            unit="เขต"
                          />
                          <ProgressCard
                            title="โรงเรียน"
                            numberOfItems={chosenESAData?.school?.length || 0}
                            unit="โรงเรียน"
                          />
                          <div
                            style={{
                              display: "flex",
                              alignContent: "left",
                              justifyContent: "left",
                              marginLeft: "0px",
                              marginTop: "0px",
                            }}
                          >
                            <span
                              style={{
                                marginLeft: "0px",
                                marginTop: "0px",
                              }}
                            >
                              {(position === "T-1" ||
                                position === "P-1" ||
                                position === "R-5" ||
                                position === "R-1") && (
                                <DropdownFormNoTitle
                                  placeholder={
                                    (
                                      <>
                                        {chosenDistricInspectorName}{" "}
                                        <button
                                          style={{
                                            margin: "0px",
                                            padding: "2px",
                                            //backgroundColor: "#4CA309",
                                            backgroundColor:
                                              getDistrictInspectorButtonBackgroundColor(
                                                chosenDistrictInspectorData
                                              ) || "grey",
                                            border: "none",
                                            borderRadius: "4px",
                                            color: "white",
                                            fontSize: "0.8em",
                                            width: "60px",
                                          }}
                                        >
                                          {chosenDistrictInspectorData?.percentage ||
                                            0}
                                          %
                                        </button>
                                      </>
                                    ) ?? (
                                      <>
                                        กรุณาเลือกเขตตรวจ <button>0%</button>
                                      </>
                                    )
                                  }
                                  titlespan={0}
                                  dropdownspan={4}
                                  md={8}
                                  lg={7}
                                  loading={districtInspector?.loading}
                                  overlay={
                                    districtInspector?.loading ? (
                                      <></>
                                    ) : (
                                      <Menu
                                        onClick={onChosenDistricInspectorName}
                                      >
                                        {Object.entries(districtInspector).map(
                                          (key) => {
                                            return (
                                              <Menu.Item
                                                key={Object.values(key)[1].name}
                                              >
                                                {Object.values(key)[1].name}
                                              </Menu.Item>
                                            );
                                          }
                                        )}
                                      </Menu>
                                    )
                                  }
                                />
                              )}
                              {
                                // position === "R-5" ||
                                position === "R-4" && (
                                  <DropdownFormNoTitle
                                    placeholder={
                                      (
                                        <>
                                          {userDistrictInspectorName}{" "}
                                          <button
                                            style={{
                                              margin: "0px",
                                              padding: "2px",
                                              //backgroundColor: "#4CA309",
                                              backgroundColor:
                                                getDistrictInspectorButtonBackgroundColor(
                                                  chosenDistrictInspectorData
                                                ) || "grey",
                                              border: "none",
                                              borderRadius: "4px",
                                              color: "white",
                                              fontSize: "0.8em",
                                              width: "60px",
                                            }}
                                          >
                                            {chosenDistrictInspectorData?.percentage ||
                                              0}
                                            %
                                          </button>
                                        </>
                                      ) ?? (
                                        <>
                                          กรุณาเลือกเขตตรวจ <button>0%</button>
                                        </>
                                      )
                                    }
                                    titlespan={0}
                                    dropdownspan={4}
                                    md={8}
                                    lg={7}
                                    loading={userDistrictInspectorName?.loading}
                                    overlay={
                                      userDistrictInspectorName?.loading ? (
                                        <></>
                                      ) : (
                                        <Menu
                                          onClick={
                                            onChosenDistricInspectorName2
                                          }
                                        >
                                          <Menu.Item
                                            key={userDistrictInspectorName}
                                          >
                                            {userDistrictInspectorName}
                                          </Menu.Item>
                                        </Menu>
                                      )
                                    }
                                  />
                                )
                              }
                            </span>
                            <span
                              style={{
                                marginLeft: "30px",
                                marginTop: "0px",
                              }}
                            >
                              {(position === "T-1" ||
                                position === "P-1" ||
                                position === "R-1" ||
                                position === "R-5" ||
                                position === "R-4") && (
                                <DropdownFormNoTitle
                                  placeholder={
                                    (
                                      <>
                                        {chosenESAName}{" "}
                                        <button
                                          style={{
                                            margin: "0px",
                                            padding: "2px",
                                            backgroundColor:
                                              getESAButtonBackgroundColor(
                                                chosenESAData
                                              ) || "grey",
                                            border: "none",
                                            borderRadius: "4px",
                                            color: "white",
                                            fontSize: "0.8em",
                                            width: "60px",
                                          }}
                                        >
                                          {chosenESAData?.percentage || 0}%
                                        </button>
                                      </>
                                    ) ?? (
                                      <>
                                        กรุณาเลือกเขตพื้นที่ <button>0%</button>
                                      </>
                                    )
                                  }
                                  titlespan={0}
                                  dropdownspan={4}
                                  md={8}
                                  lg={7}
                                  loading={chosenDistrictInspectorData?.loading}
                                  overlay={
                                    chosenDistrictInspectorData?.loading ? (
                                      <></>
                                    ) : (
                                      <Menu onClick={onChosenESAName}>
                                        {chosenDistrictInspectorData?.educationServiceArea?.map(
                                          (key) => {
                                            return (
                                              <Menu.Item key={key.name}>
                                                {key.name}
                                              </Menu.Item>
                                            );
                                          }
                                        )}
                                      </Menu>
                                    )
                                  }
                                />
                              )}
                              {position === "R-2" && (
                                // || position === "R-5"
                                <DropdownFormNoTitle
                                  placeholder={
                                    (
                                      <>
                                        {userESAName}{" "}
                                        <button
                                          style={{
                                            margin: "0px",
                                            padding: "2px",
                                            backgroundColor:
                                              getESAButtonBackgroundColor(
                                                chosenESAData
                                              ) || "grey",
                                            border: "none",
                                            borderRadius: "4px",
                                            color: "white",
                                            fontSize: "0.8em",
                                            width: "60px",
                                          }}
                                        >
                                          {chosenESAData?.percentage || 0}%
                                        </button>
                                      </>
                                    ) ?? (
                                      <>
                                        กรุณาเลือกเขตพื้นที่ <button>0%</button>
                                      </>
                                    )
                                  }
                                  titlespan={0}
                                  dropdownspan={4}
                                  md={8}
                                  lg={7}
                                  loading={userESAName?.loading}
                                  overlay={
                                    userESAName?.loading ? (
                                      <></>
                                    ) : (
                                      <Menu onClick={onChosenESAName2}>
                                        <Menu.Item key={userESAName}>
                                          {userESAName}
                                        </Menu.Item>
                                      </Menu>
                                    )
                                  }
                                />
                              )}
                            </span>
                            <span
                              style={{
                                marginLeft: "30px",
                                marginTop: "0px",
                              }}
                            >
                              {(position === "R-5" ||
                                position === "P-1" ||
                                position === "R-1" ||
                                position === "R-2" ||
                                position === "R-4" ||
                                position === "T-1") && (
                                <DropdownFormNoTitle
                                  placeholder={
                                    (
                                      <>
                                        {chosenSchoolName}{" "}
                                        <button
                                          style={{
                                            margin: "0px",
                                            padding: "2px",
                                            backgroundColor:
                                              getSchoolButtonBackgroundColor(
                                                chosenSchoolData
                                              ) || "grey",
                                            border: "none",
                                            borderRadius: "4px",
                                            color: "white",
                                            fontSize: "0.8em",
                                            width: "60px",
                                          }}
                                        >
                                          {chosenSchoolData?.percentage || 0}%
                                        </button>
                                      </>
                                    ) ?? (
                                      <>
                                        กรุณาเลือกโรงเรียน <button>0%</button>
                                      </>
                                    )
                                  }
                                  titlespan={0}
                                  dropdownspan={4}
                                  md={8}
                                  lg={7}
                                  loading={chosenESAData?.loading}
                                  overlay={
                                    chosenESAData?.loading ? (
                                      <></>
                                    ) : (
                                      <Menu onClick={onChosenSchoolName}>
                                        {chosenESAData?.school?.map((key) => {
                                          return (
                                            <Menu.Item key={key.name}>
                                              {key.name}
                                            </Menu.Item>
                                          );
                                        })}
                                      </Menu>
                                    )
                                  }
                                />
                              )}
                              {(position === "S-1" ||
                                position === "S-2" ||
                                position === "S-4" ||
                                position === "S-3" ||
                                // position === "R-5" ||
                                position === "R-3") && (
                                <DropdownFormNoTitle
                                  placeholder={
                                    (
                                      <>
                                        {userSchoolName?.name?.thai}{" "}
                                        <button
                                          style={{
                                            margin: "0px",
                                            padding: "2px",
                                            backgroundColor:
                                              getSchoolButtonBackgroundColor(
                                                chosenSchoolData
                                              ) || "grey",
                                            border: "none",
                                            borderRadius: "4px",
                                            color: "white",
                                            fontSize: "0.8em",
                                            width: "60px",
                                          }}
                                        >
                                          {chosenSchoolData?.percentage || 0}%
                                        </button>
                                      </>
                                    ) ?? (
                                      <>
                                        กรุณาเลือกโรงเรียน <button>0%</button>
                                      </>
                                    )
                                  }
                                  titlespan={0}
                                  dropdownspan={4}
                                  md={8}
                                  lg={7}
                                  loading={userSchoolName?.loading}
                                  overlay={
                                    userSchoolName?.loading ? (
                                      <></>
                                    ) : (
                                      <Menu onClick={onChosenSchoolName2}>
                                        <Menu.Item
                                          key={userSchoolName?.name?.thai}
                                        >
                                          {userSchoolName?.name?.thai}
                                        </Menu.Item>
                                      </Menu>
                                    )
                                  }
                                />
                              )}
                            </span>
                          </div>
                        </div>
                        <br/>
                        <Tabs type="card" defaultActiveKey="1">
                          <TabPane tab="ข้อมูลครู" key="1">
                            <div>
                              {chosenSchoolData?.teacher?.map((item) => (
                                <TeacherCard
                                  prefix={item?.prefix || ""}
                                  firstName={item?.firstName || ""}
                                  lastName={item?.lastName || ""}
                                  classrooms={item?.classrooms || ""}
                                  progress={item?.progress || ""}
                                  homework={item?.homeworkIssued || ""}
                                  time={item?.loginTime || ""}
                                  classroom={item?.classroom || []}
                                />
                              ))}
                            </div>
                          </TabPane>
                          <TabPane tab="ข้อมูลห้องเรียน" key="2">
                            <div>
                              <div className={classes.alignItems}>
                                <div className={classes.alignTextItem}>
                                  <div className={classes.alignContent}>
                                    <span
                                      style={{
                                        color: "#1c4e91",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      ระดับชั้น
                                      <br />
                                      <span
                                        style={{
                                          marginLeft: "0px",
                                          marginTop: "0px",
                                        }}
                                      >
                                        <DropdownFormNoTitle
                                          placeholder={
                                            chosenClassroomName ??
                                            "กรุณาเลือกห้องเรียน"
                                          }
                                          titlespan={0}
                                          dropdownspan={4}
                                          md={8}
                                          lg={7}
                                          loading={chosenSchoolData?.loading}
                                          overlay={
                                            chosenSchoolData?.loading ? (
                                              <></>
                                            ) : (
                                              <Menu
                                                onClick={onChosenClassroomName}
                                              >
                                                {chosenSchoolData?.classroom?.map(
                                                  (key) => {
                                                    return (
                                                      <Menu.Item key={key.name}>
                                                        {key.name}
                                                      </Menu.Item>
                                                    );
                                                  }
                                                )}
                                              </Menu>
                                            )
                                          }
                                        />
                                      </span>
                                    </span>{" "}
                                    <span
                                      style={{
                                        width: "20px",
                                        height: "53.6px",
                                      }}
                                    />
                                    {/* <Link to="/statistics/teacherOverview/schoolID">
                                      <span
                                        style={{
                                          width: "200px",
                                          height: "30px",
                                          margin: "0 0 0 400px",
                                          padding: "0",
                                          border: "none",
                                        }}
                                      >
                                        <button
                                          //onClick={toggle}
                                          style={{
                                            border: "none",
                                            width: "200px",
                                            height: "30px",
                                            margin: "0",
                                            padding: "0",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <div
                                            className={classes.showHideButton}
                                            style={{
                                              width: "200px",
                                              height: "30px",
                                              margin: "0",
                                              padding: "0",
                                              border: "2px solid #B6CCF3",
                                              borderRadius: "4px",
                                            }}
                                          >
                                            <p
                                              className={
                                                classes.showHideButtonText
                                              }
                                            >
                                              ไปยังข้อมูลวิเคราะห์เชิงลึก
                                            </p>
                                          </div>
                                        </button>
                                      </span>
                                    </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CardWithTitleNoIcon title={""}>
                              {chosenClassroomData.loading !== true && (
                                <div className={classes.alignItems}>
                                  <div
                                    className={classes.alignTextItemNoCursor}
                                  >
                                    <div className={classes.alignContentRight}>
                                      <span>
                                        <VscGraphLine
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            color: "white",
                                            background: "#7D9C54",
                                            borderRadius: "4px",
                                            padding: "4px",
                                            marginTop: "10px",
                                            cursor: "default",
                                          }}
                                        />
                                      </span>
                                      <span
                                        style={{
                                          margin: "10px",
                                        }}
                                      >
                                        <p
                                          style={{
                                            fontSize: "15px",
                                          }}
                                        >
                                          ความก้าวหน้าเฉลี่ยของโรงเรียน
                                        </p>
                                        <p
                                          style={{
                                            color: "#7D9C54",
                                            fontSize: "15px",
                                          }}
                                        >
                                          {chosenSchoolData?.progress || 0}
                                        </p>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <VerticalBarChartJsClassroomProgress
                                height={250}
                                width={2500}
                                loading={
                                  barChartStatisticsByClassroom2?.loading
                                }
                                labels={
                                  chosenClassroomData.loading
                                    ? []
                                    : chosenClassroomData?.classroom?.map(
                                        (item) => {
                                          return [
                                            item?.name || "",
                                            "การบ้านทั้งหมด",
                                            item?.homeworkIssued + "ข้อ" || "",
                                          ];
                                        }
                                      )
                                }
                                items={
                                  chosenClassroomData?.loading
                                    ? []
                                    : chosenClassroomData?.classroom?.map(
                                        (item) => {
                                          return item?.progress;
                                        }
                                      )
                                }
                                //color={"#7D9C54"}
                                color={
                                  chosenClassroomData?.loading
                                    ? []
                                    : chosenClassroomData?.classroom?.map(
                                        (item) => {
                                          return getClassroomBarChartBackgroundColor(
                                            item
                                          );
                                        }
                                      )
                                }
                              />
                            </CardWithTitleNoIcon>
                          </TabPane>
                        </Tabs>
                      </CardWithTitleNoIcon>
                    </Col>
                  </Row>
                </Box>
              </Col>
            </Row>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
