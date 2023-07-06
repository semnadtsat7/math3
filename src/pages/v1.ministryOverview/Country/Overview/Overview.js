import classes from "./Overview.module.css";

import React, { useRef, useEffect, useState } from "react";

import { Col, Row, Card, Box } from "../../../../core/components";

import { CardWithTitle } from "../../../../components/Statistics";

import { InstagramFilled, FundOutlined, BankFilled, TeamOutlined } from "@ant-design/icons";

import RankingCard from "./RankingCard";
import EsaRankingCard from "./EsaRankingCard";
import SchoolRankingCard from "./SchoolRankingCard";
import TeacherRankingCard from "./TeacherRankingCard";

import Parent from "../../../../components/Parent";
import Header from "../../../students.ts.v1/Header";

import * as districtInspectData from "./districtInspectData.json";

import { SchoolService } from "../../../../services/Statistics";

export default function Overview() {
  const parent = useRef(Parent);

  //data เขตตรวจ 1 - 18
  const [districtInspector, setDistrictInspector] = useState({
    loading: true,
    data: {},
  });

  // useEffect(() => {
  //   SchoolService.getMinistryOverviewAsync(items).then((res) => {
  //     if (res.error) {
  //       setItem({
  //         ...esaOverview,
  //         error: res.error,
  //       });
  //     } else {
  //       setItem(res);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    setDistrictInspector(districtInspectData.default.districtInspector);
  }, []);

  const onClick = () => {
    console.log(districtInspector);
    console.log(chosenDistrictInspector);
    //console.log(chosenEsa);
    console.log(schoolsNameInEsa);
    console.log(teachersInChosenSchool);
  };

  //data เขตตรวจที่เลือก eg. เขต 1 - 18
  const [chosenDistrictInspector, setChosenDistrictInspector] = useState({
    loading: true,
    data: {},
  });

  const onClick2 = (item) => {
    setChosenDistrictInspector(item);
    setSchoolsNameInEsa({
      loading: true,
      data: {},
    });
  };

  //ชื่อเขตพื้นที่ที่เลือก eg. สพป.กรุงเทพมหานคร
  const [chosenEsa, setChosenEsa] = useState({
    loading: true,
    data: {},
  });

  //data รายชื่อโรงเรียนในเขตพื้นที่ที่เลือก
  const [schoolsNameInEsa, setSchoolsNameInEsa] = useState({
    loading: true,
    data: {},
  });

  const onClick3 = (item) => {
    setChosenEsa(item.name);
    setSchoolsNameInEsa(item?.school?.length > 0 ? item.school : null);
  };

  //เปลี่ยนสี background ของSchoolRankingCard ขึ้นกับ value range ของคะแนนโรงเรียน
  const getBackgroundColor = (item) => {
    let color;
    if (item.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 25) {
      color = "lightcoral";
    } else if (item.percentage >= 25 && item.percentage < 50) {
      color = "gold";
    } else if (item.percentage >= 50 && item.percentage < 70) {
      color = "moccasin";
    } else if (item.percentage >= 70) {
      color = "aquamarine";
    }
    return color;
  };

    //data คุณครูในโรงเรียนในเขตพื้นที่ที่เลือก
    const [teachersInChosenSchool, setTeachersInChosenSchool] = useState({
      loading: true,
      data: {},
    });

    const onClick4 = (item) => {
      setTeachersInChosenSchool(item?.teacher?.length > 0 ? item.teacher : null)
    };

  //เปลี่ยนสี background ของTeacherRankingCard ขึ้นกับ value range ของคะแนนคุณครู
  const getBackgroundColor2 = (item) => {
    let color2;
    if (item.avgStagePass === 0) {
      color2 = "grey";
    } else if (item.avgStagePass >= 1 && item.avgStagePass < 25) {
      color2 = "lightcoral";
    } else if (item.avgStagePass >= 25 && item.avgStagePass < 50) {
      color2 = "gold";
    } else if (item.avgStagePass >= 50 && item.avgStagePass < 70) {
      color2 = "moccasin";
    } else if (item.avgStagePass >= 70) {
      color2 = "aquamarine";
    }
    return color2;
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent?.current?.toggleMenu()}
        title="ภาพรวมกระทรวง"
      />

      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col span={24}>
                <Box mt="2">
                  <Row gutter={[8, 8]} type="flex">
                    <Col span={24} offset={0}>
                      <CardWithTitle title="เขตตรวจ" icon={<FundOutlined />}>
                        <br />
                        <div onClick={onClick}>test</div>
                        <ul>
                          {Object.values(districtInspector).map((item) => (
                            <RankingCard
                              districtInspect={item.name} //ชื่อเขตตรวจ eg. เขตตรวจ 1 - 18
                              handler={() => {
                                onClick2(item);
                              }}
                            />
                          ))}
                        </ul>
                      </CardWithTitle>
                    </Col>
                    <Col span={24} offset={0}>
                      <CardWithTitle
                        title="เขตพื้นที่ในเขตตรวจ"
                        icon={<InstagramFilled />}
                      >
                        <br />
                        <ul>
                          {chosenDistrictInspector?.loading ? (
                            <div>กรุณาเลือกเขตตรวจ...</div>
                          ) : (
                            chosenDistrictInspector?.esa?.map((item) => {
                              return (
                                <EsaRankingCard
                                  esaName={
                                    chosenDistrictInspector?.loading
                                      ? 0
                                      : item.name
                                  } //ชื่อเขตพื้นที่ eg. สพป.กรุงเทพมหานคร
                                  handler={() => {
                                    onClick3(item);
                                  }}
                                />
                              );
                            })
                          )}
                        </ul>
                      </CardWithTitle>
                    </Col>
                    <Col span={24} offset={0}>
                      <CardWithTitle
                        title="โรงเรียนในเขตพื้นที่"
                        icon={<BankFilled />}
                      >
                        <br />
                        <ul>
                          {schoolsNameInEsa?.loading ? (
                            <div>กรุณาเลือกเขตพื้นที่...</div>
                          ) : (
                            schoolsNameInEsa?.map((item) => {
                              return (
                                <SchoolRankingCard
                                  schoolName={
                                    schoolsNameInEsa?.loading
                                      ? 0
                                      : item.schoolName
                                  } //ชื่อโรงเรียนในเขตพื้นที่
                                  percentage={
                                    chosenDistrictInspector?.loading
                                      ? 0
                                      : item.percentage
                                  }
                                  color={getBackgroundColor(item)}
                                  handler={() => {
                                    onClick4(item);
                                  }}
                                />
                              );
                            })
                          )}
                        </ul>
                      </CardWithTitle>
                    </Col>
                    <Col span={24} offset={0}>
                      <CardWithTitle
                        title="รายชื่อครูในโรงเรียน  [ปุ่มดูภาพรวมครูในโรงเรียน]  [ปุ่มเลือกระยะเวลา 7วัน/14วัน/30วัน/ทั้งหมด]"
                        icon={<TeamOutlined />}
                      >
                        <br />
                        <ul>
                          {teachersInChosenSchool?.loading ? (
                            <div>กรุณาเลือกโรงเรียนในเขตพื้นที่...</div>
                          ) : (
                            teachersInChosenSchool?.map((item) => {
                              return (
                                <TeacherRankingCard
                                 teacherName={
                                    teachersInChosenSchool?.loading
                                      ? 0
                                      : item.name
                                  } //ชื่อคุณครูในโรงเรียน
                                  homework={
                                    teachersInChosenSchool?.loading
                                      ? 0
                                      : item.homework
                                  } //ชื่อการบ้านที่สั่ง
                                  avgStagePass={
                                    teachersInChosenSchool?.loading
                                      ? 0
                                      : item.avgStagePass
                                  } //จำนวนด่านที่ผ่านเฉลี่ย
                                  maxStage={
                                    teachersInChosenSchool?.loading
                                      ? 0
                                      : item.maxStage
                                  } //จำนวนด่านทั้งหมดในการบ้านที่สั่ง
                                  avgScore={
                                    teachersInChosenSchool?.loading
                                      ? 0
                                      : item.avgScore
                                  } //คะแนนเฉลี่ย
                                  maxScore={
                                    teachersInChosenSchool?.loading
                                      ? 0
                                      : item.maxScore
                                  } //คะแนนสูงสุดที่เป็นไปได้ในการบ้านที่สั่ง
                                  color2={getBackgroundColor2(item)}
                                  // handler={() => {
                                  //   onClick5(item);
                                  // }}
                                />
                              );
                            })
                          )}
                        </ul>
                      </CardWithTitle>
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
