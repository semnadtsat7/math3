import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./HomeworkOverview.module.css";
import {
  Dropdown,
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

import {
  DropdownForm,
  ScoreTotal,
  CardWithTitle,
  VerticalBarChartJsEsa,
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

import HomeworkTable from "./HomeworkTable";

import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import { SchoolService } from "../../../services/Statistics";

export default function HomeworkOverview() {
  const parent = useRef(Parent);

  //ข้อมูลโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมดในประเทศ
  const [countryOverview, setCountryOverview] = useState({
    loading: true,
    data: {},
  });
  useEffect(() => {
    SchoolService.getCountryOverviewAsync().then((res) => {
      if (res.error) {
        setCountryOverview({
          ...countryOverview,
          error: res.error,
        });
      } else {
        setCountryOverview(res);
      }
    });
  }, []);

  //เขตพื้นที่การศึกษา
  //ข้อมูลเขตพื้นที่การศึกษาทั้งหมด
  const [esaOverview, setEsaOverview] = useState({
    loading: true,
    data: {},
  });
  useEffect(() => {
    SchoolService.getEsaOverviewAsync(esaOverview).then((res) => {
      if (res.error) {
        setEsaOverview({
          ...esaOverview,
          error: res.error,
        });
      } else {
        setEsaOverview(res);
      }
    });
  }, []);

  //bar chart loading
  const [barChartStatisticsBySchool, setBarChartStatisticsBySchool] = useState({
    loading: true,
  });

  //เขตพื้นที่การศึกษาที่เลือก
  const [chosenEsa, setChosenEsa] = useState({
    loading: true,
    data: {},
  });
  const [chosenEsaName, setChosenEsaName] = useState(null);
  const onChosenEsaClick = ({ key }) => {
    //filter object by key
    const item = esaOverview?.filter((esaData) => {
      if (Object.keys(esaData) == key) return esaData;
    });
    setChosenEsa(item?.length > 0 ? Object.values(item[0]) : null);
    setChosenEsaName(key);
    setChosenSchoolInEsa(null);
    setBarChartStatisticsBySchool({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsBySchool({ loading: false });
    }, 500);

    //console.log(chosenEsaName);
    console.log(chosenEsa);
    console.log(esaOverview);
  };

  //คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนในเครือ
  const [chosenSchoolInEsa, setChosenSchoolInEsa] = useState(null);
  const onChosenSchoolInEsaClick = ({ key }) => {
    const item = chosenEsa?.[0]?.schools.filter(
      (e) => e.data?.name?.thai === key
    );
    setChosenSchoolInEsa(item?.length > 0 ? item[0] : null);
    //console.log(item)
    //console.log(chosenSchoolInEsa);
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent?.current?.toggleMenu()}
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
                    ภาพรวมการบ้าน
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
                      placeholder={chosenEsaName ?? "เลือกห้องเรียน"}
                      titlespan={6}
                      dropdownspan={4}
                      md={8}
                      lg={7}
                      loading={esaOverview?.loading}
                      overlay={
                        esaOverview?.loading ? (
                          <></>
                        ) : (
                          <Menu onClick={onChosenEsaClick}>
                            {esaOverview.map((key) => {
                              //console.log(Object.keys(key))
                              //return object key
                              return (
                                <Menu.Item key={Object.keys(key)}>
                                  {Object.keys(key)}
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
      />

      <Box>
        <Card bordered={false} className="w-100 Overview-Container">
          <Row gutter={[8, 8]} type="flex">
            <Col span={24}>
              <CardWithTitle
                icon={<LineChartOutlined />}
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
                            การส่งแบบฝึกหัดในบทเรียนย่อยในบทเรียน :
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
                              placeholder="ONET จำนวนนับ"
                              titlespan={0}
                              dropdownspan={12}
                              style={{ alignContent: "start" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                }
              >
                <Row gutter={[8, 8]} type="flex">
                  <Col span={24}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        height: "90%",
                        width: "1428px",
                      }}
                    >
                      <div style={{ marginTop: "auto" }}>
                        <Row gutter={[8, 8]} type="flex">
                          <Col span={24}>
                            <ScoreTotal
                              name="ข้อง่าย"
                              color="#00FF7F"
                              size={20}
                              fontSize={14}
                            />
                          </Col>
                          <Col span={24}>
                            <ScoreTotal
                              name="ข้อปานกลาง"
                              color="#FFE4B5"
                              size={20}
                              fontSize={14}
                            />
                          </Col>
                          <Col span={24}>
                            <ScoreTotal
                              name="ข้อยาก"
                              color="#CD5C5C"
                              size={20}
                              fontSize={14}
                            />
                          </Col>
                          <Col span={24}>
                            <ScoreTotal
                              name="จำนวนนักเรียนที่ต้องทำโจทย์"
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
                <VerticalBarChartJsEsa
                  height={250}
                  width={2500}
                  loading={esaOverview?.loading}
                  labels={
                    esaOverview.loading
                      ? []
                      : esaOverview.map((esa) => {
                          return Object.keys(esa);
                        })
                  }
                  items={
                    esaOverview?.loading
                      ? []
                      : esaOverview.map((esa) => {
                          return Object.values(
                            esa
                          )[0]?.total?.percentage.toFixed(2);
                        })
                  }
                />
              </CardWithTitle>
            </Col>
          </Row>
        </Card>
      </Box>
      <Box>
        <Card bordered={false} className="w-100 Overview-Container">
          <Row gutter={[8, 8]} type="flex">
            <Col span={24}>
              <CardWithTitle
                icon={<IoIosPaper />}
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
                            การบ้านในแต่ละครั้ง :
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
                              placeholder="การบ้านครั้งที่ 1"
                              titlespan={0}
                              dropdownspan={12}
                              style={{ alignContent: "start" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                }
              >
                <HomeworkTable
                  datasource={chosenEsa?.[0]?.schools ?? []}
                  loading={chosenEsa?.loading}
                />
              </CardWithTitle>
            </Col>
          </Row>
        </Card>
      </Box>
    </Parent>
  );
}
