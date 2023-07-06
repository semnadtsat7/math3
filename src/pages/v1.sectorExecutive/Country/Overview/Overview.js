import "./Overview.css";

import React, { useRef, useEffect, useState} from "react";

import http from "../../../../utils/FirebaseCloud";

import {
  Menu,
  ScrollView,
  Progress,
  Col,
  Row,
  Tabs,
  Card,
  Box,
} from "../../../../core/components";
import {
  DropdownForm,
  StatisticWithText,
  ScoreTotal,
  CardWithTitle,
  ScoreRange,
} from "../../../../components/Statistics";

import { Map } from "../../../v1.sectorExecutive";
import { RegionalMap } from "../../../v1.sectorExecutive";

import StatisticWithIconSchool from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconSchool";
import StatisticWithIconClassroom from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconClassroom";
import StatisticWithIconStudent from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconStudent";
import StatisticWithIconTeacher from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconTeacher";

import { GoldOutlined, FileDoneOutlined } from "@ant-design/icons";

import OverviewTable from "./OverviewTable";
import AvgSchoolTable from "./AvgSchoolTable";

import Parent from "../../../../components/Parent";
import Header from "../../../students.ts.v1/Header";

import { SchoolService } from "../../../../services/Statistics";

const { TabPane } = Tabs;

export default function Overview() {
  const parent = useRef(Parent);

  //ข้อมูลโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมดในประเทศ
  const [countryOverview, setCountryOverview] = useState({
    loading: true,
    data: {},
  });
  useEffect(() => {
    SchoolService.getCountryOverviewAsync(countryOverview).then((res) => {
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

  //ข้อมูลโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมดในจังหวัดที่คลิ๊ก
  const [provinceCountryOverView, setProvinceCountryOverView] = useState(null);

  //คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนในประเทศ
  const [statisticProvince, setStatisticProvince] = useState(null);
  const onStatisticProvinceClick = ({ key }) => {
    const item = countryOverview?.country.filter((e) => e.name === key);
    setStatisticProvince(item?.length > 0 ? item[0] : null);
    //console.log(item)
    console.log(statisticProvince);
  };

  //handleMouseClick on map
  function handleMouseClick(event) {
    function getLocationName(event) {
      return event?.target?.attributes?.name?.value;
    }
    const pointedLocation = getLocationName(event);
    console.log(pointedLocation);

    //ปรับ dropdown ให้ชื่อจังหวัดเป็นจังหวัดที่คลิ๊ก
    const item = countryOverview?.country.filter(
      (e) => e.name === pointedLocation
    );
    setStatisticProvince(item?.length > 0 ? item[0] : null);

    //ปรับ โรงเรียน/ห้องเรียน/นักเรียน/ครูทั้งหมดในจังหวัด ให้ชื่อจังหวัดเป็นจังหวัดที่คลิ๊ก
    const item2 = countryOverview?.country.filter(
      (e) => e.name === pointedLocation
    );
    setProvinceCountryOverView(item2?.length > 0 ? item2[0] : null);
    //console.log(provinceCountryOverView)
  }

  //table cloud function (default=Bangkok)
  async function schoolsStatisticsByProvinceOnMapClick(
    data = {
      schoolName: "",
      province: `${statisticProvince?.geocode || "10"}`,
      affiliation: "",
      esa: "",
      district: "",
    }
  ) {
    var body = {
      data: data,
    };
    let res = await http.callAsia(`getSchoolStatisticsByProvince`, body);

    if (res.status) {
      return {
        code: res.status,
        error: "มีบางอย่างผิดพลาด",
      };
    }
    if (res?.data?.result) {
      return res?.data?.result;
    }

    return res?.data;
  }

  //table
  const [
    schoolsStatisticsByProvinceOnMap,
    setSchoolsStatisticsByProvinceOnMap,
  ] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    if (statisticProvince || countryOverview) {
      schoolsStatisticsByProvinceOnMapClick().then((res) => {
        if (res.error) {
          setSchoolsStatisticsByProvinceOnMap({
            ...schoolsStatisticsByProvinceOnMap,
            error: res.error,
          });
          //console.log(statisticProvince.geocode)
        } else {
          setSchoolsStatisticsByProvinceOnMap(res);
          //console.log(schoolsStatisticsByProvinceOnMap)
          //console.log(statisticProvince.geocode)
        }
      });
    }
  }, [statisticProvince, countryOverview]);

  //regional map
  const [regionOverview, setRegionOverview] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setTimeout(() => {
    SchoolService.getRegionOverviewAsync(regionOverview).then(
      (res) => {
        if (res.error) {
          setRegionOverview({
            ...regionOverview,
            error: res.error,
          });
        } else {
          setRegionOverview(res);
          // console.log(regionOverview);
        }
      }
    );
  }, 1200);
  }, []);

  //ข้อมูลโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมดในภาคที่คลิ๊ก
  const [regionCountryOverView, setRegionCountryOverView] = useState(null);

  //คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างของแต่ละภาค
  const [statisticRegion, setStatisticRegion] = useState(null);
  const onStatisticRegionClick = ({ key }) => {
    const item = regionOverview?.country.filter((e) => e.name === key);
    setStatisticRegion(item?.length > 0 ? item[0] : null);
    //console.log(item)
    console.log(statisticRegion);
  };

  //handleMouseClick on regional map
  function handleMouseClickRegion(event) {
    function getLocationName(event) {
      return event?.target?.attributes?.name?.value;
    }
    const pointedLocation = getLocationName(event);
    console.log(pointedLocation);

    //ปรับ dropdown ให้ชื่อจังหวัดเป็นภาคที่คลิ๊ก
    const item = regionOverview?.country.filter(
      (e) => e.name === pointedLocation
    );
    setStatisticRegion(item?.length > 0 ? item[0] : null);

    //ปรับ โรงเรียน/ห้องเรียน/นักเรียน/ครูทั้งหมดในจังหวัด ให้ชื่อภาคเป็นภาคที่คลิ๊ก
    const item2 = regionOverview?.country.filter(
      (e) => e.name === pointedLocation
    );
    setRegionCountryOverView(item2?.length > 0 ? item2[0] : null);
    //console.log(regionCountryOverView)    
  }

  //table cloud function (default=ภาคกลาง)
  async function schoolsStatisticsByRegionOnMapClick(
    data = {
      schoolName: "",
      region: `${statisticRegion?.name || "ภาคกลาง"}`,
      affiliation: "",
      esa: "",
      district: "",
      province: "",
    }
  ) {
    var body = {
      data: data,
    };
    let res = await http.callAsia2(`getSchoolStatisticsByRegion`, body);

    if (res.status) {
      return {
        code: res.status,
        error: "มีบางอย่างผิดพลาด",
      };
    }
    if (res?.data?.result) {
      return res?.data?.result;
    }

    return res?.data;
  }

  // region table
  const [schoolsStatisticsByRegionOnMap, setSchoolsStatisticsByRegionOnMap] =
    useState({
      loading: true,
      data: {},
    });

  useEffect(() => {
    if (statisticRegion || regionOverview) {
      schoolsStatisticsByRegionOnMapClick().then((res) => {
        if (res.error) {
          setSchoolsStatisticsByRegionOnMap({
            ...schoolsStatisticsByRegionOnMap,
            error: res.error,
          });
          //console.log(statisticRegion.name)
        } else {
          setSchoolsStatisticsByRegionOnMap(res);
          //console.log(schoolsStatisticsByRegionOnMap)
          //console.log(statisticRegion.name)
        }
      });
    }
  }, [statisticRegion, regionOverview]);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="ภาพรวมโรงเรียนทั้งหมดในระบบ"
      />

      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col span={24}>
                <Tabs type="card" defaultActiveKey="1">
                  <TabPane tab="ภาพรวมเขตพื้นที่จังหวัด" key="1">
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} sm={24} md={10}>
                        <Card className="w-100">
                          <Box mt="2">
                            {countryOverview?.error ? (
                              <h4>
                                ข้อมูลสถิติระดับจังหวัดของคุณ
                                ยังไม่ถูกสร้างขึ้นในเวลานี้
                                โปรดกลับมาใหม่ในภายหลัง
                              </h4>
                            ) : (
                              <Map
                                country={1 || 1} //Thailand id = 1
                                loading={countryOverview.loading}
                                datasource={countryOverview.country}
                                handleMouseClick={handleMouseClick}
                              />
                            )}
                          </Box>

                          <Box mt="4">
                            <Row justify="end" type="flex">
                              <Col xs={24} sm={24} md={14}>
                                <h4>ลำดับคะแนนเฉลี่ย</h4>
                                <Box>
                                  <ScoreRange
                                    name="ดีมาก"
                                    percentage="80% - 100%"
                                    color="#39b54a"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="ดี"
                                    percentage="60% - 79%"
                                    color="#72cb7e"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="ปานกลาง"
                                    percentage="40% - 59%"
                                    color="#8cc63f"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="พอใช้"
                                    percentage="20% - 39%"
                                    color="#fbb03b"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="ควรปรับปรุง"
                                    percentage="0% - 19%"
                                    color="#ee5721"
                                  ></ScoreRange>
                                </Box>
                              </Col>
                            </Row>
                          </Box>
                        </Card>
                      </Col>
                      <Col xs={24} sm={24} md={14}>
                        <Box>
                          <Row gutter={[8, 8]} type="flex">
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconSchool
                                title="โรงเรียนทั้งหมดในจังหวัด"
                                value={
                                  countryOverview?.loading
                                    ? 0
                                    : provinceCountryOverView?.data
                                        ?.totalSchools || ""
                                }
                                suffix="แห่ง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconClassroom
                                title="ห้องเรียนทั้งหมดในจังหวัด"
                                value={
                                  countryOverview?.loading
                                    ? 0
                                    : provinceCountryOverView?.data
                                        ?.totalClassrooms || ""
                                }
                                suffix="ห้อง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconStudent
                                title="นักเรียนทั้งหมดในจังหวัด"
                                value={
                                  countryOverview?.loading
                                    ? 0
                                    : provinceCountryOverView?.data
                                        ?.totalStudents || ""
                                }
                                suffix="คน"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconTeacher
                                title="ครูทั้งหมดในจังหวัด"
                                value={
                                  countryOverview?.loading
                                    ? 0
                                    : provinceCountryOverView?.data
                                        ?.totalTeachers || ""
                                }
                                suffix="คน"
                              />
                            </Col>
                          </Row>
                        </Box>

                        <Box mt="2">
                          <Tabs type="card">
                            <TabPane tab="คะแนนเฉลี่ย" key="1" className="mb-0">
                              <Box p={3}>
                                <Box className="text-center">
                                  <h3 className="text-primary">
                                    คะแนนเฉลี่ยรวมจากนักเรียนทั้งหมดในประเทศ
                                  </h3>
                                </Box>

                                <Box mt="4" mb="4">
                                  <Row gutter={[16, 16]} type="flex">
                                    <Col xs={24} md={12}>
                                      <Row justify="center" type="flex">
                                        <Col md={10}>
                                          <Progress
                                            type="circle"
                                            percent={
                                              Number(
                                                countryOverview.country?.[77]?.data.percentage?.toFixed(
                                                  1
                                                )
                                              ) ?? 0
                                            }
                                            strokeColor="#1c4e91"
                                            strokeWidth={15}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col xs={24} md={12}>
                                      <Row gutter={[8, 8]}>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ผ่านแล้ว ${
                                              countryOverview.loading
                                                ? 0
                                                : countryOverview.country?.[77]?.data?.percentage?.toFixed(
                                                    0
                                                  ) ?? 0
                                            }%`}
                                            color="#1c4e91"
                                          />
                                        </Col>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ยังไม่ผ่าน ${
                                              countryOverview.loading
                                                ? "-"
                                                : (
                                                    100 -
                                                    countryOverview
                                                      .country?.[77]?.data
                                                      ?.percentage
                                                  )?.toFixed(0) ?? 0
                                            }%`}
                                            color="#aeaeae"
                                          />
                                        </Col>
                                      </Row>

                                      <Box mt="3">
                                        <h3 className="text-italic text-gray">
                                          *จากนักเรียนทั้งหมด{" "}
                                          {countryOverview?.loading
                                            ? 0
                                            : countryOverview?.country?.[77]
                                                ?.data?.totalStudents ?? 0}{" "}
                                          คน
                                        </h3>
                                      </Box>
                                    </Col>
                                  </Row>
                                </Box>
                              </Box>
                            </TabPane>
                            {/* <TabPane tab="เวลาเฉลี่ย" key="2">
                              <p>Content of Tab Pane 2</p>
                            </TabPane> */}
                          </Tabs>
                        </Box>

                        <Box mt="2">
                          <CardWithTitle
                            icon={<FileDoneOutlined />}
                            title="คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนในประเทศ"
                          >
                            <Box mt="2">
                              <DropdownForm
                                title="แสดงสถิติของจังหวัด"
                                placeholder={
                                  statisticProvince?.name ?? "ทั้งหมด"
                                }
                                titlespan={6}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={countryOverview?.loading}
                                overlay={
                                  countryOverview?.loading ? (
                                    <></>
                                  ) : (
                                    <Menu onClick={onStatisticProvinceClick}>
                                      {Object.entries(
                                        countryOverview?.country
                                      ).map((key) => {
                                        //console.log(key)
                                        //return only entries that data isn't null
                                        if (key[1].data) {
                                          return (
                                            <Menu.Item key={key[1]?.name}>
                                              {key[1]?.name}
                                            </Menu.Item>
                                          );
                                        }
                                      })}
                                    </Menu>
                                  )
                                }
                              />
                            </Box>

                            <Box mt="2">
                              <Row gutter={[8, 8]} type="flex">
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนที่ต่ำสุด"
                                    value={
                                      countryOverview?.loading
                                        ? ""
                                        : statisticProvince?.data?.leastBest ||
                                          ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนเฉลี่ย"
                                    value={
                                      countryOverview?.loading
                                        ? "-"
                                        : statisticProvince?.data?.average?.toFixed(
                                            2
                                          ) || ""
                                    }
                                    suffix="คะแนน"
                                    precision={1}
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนที่สูงสุด"
                                    value={
                                      countryOverview?.loading
                                        ? ""
                                        : statisticProvince?.data?.mostBest ||
                                          ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                              </Row>
                            </Box>
                          </CardWithTitle>
                        </Box>
                      </Col>
                      <Col span={24}>
                        <CardWithTitle
                          icon={<GoldOutlined />}
                          title="10 อันดับโรงเรียนคะแนนสูงสุดในจังหวัด"
                          //title={"10 อันดับโรงเรียนคะแนนสูงสุดในจังหวัด" + statisticProvince?.name} //undefined on first load
                        >
                          <ScrollView>
                            <OverviewTable
                              datasource={
                                schoolsStatisticsByProvinceOnMap?.schoolList ??
                                []
                              }
                              loading={
                                schoolsStatisticsByProvinceOnMap?.loading
                              }
                            />
                          </ScrollView>
                        </CardWithTitle>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="แบ่งเขตพื้นที่ภาค" key="2">
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} sm={24} md={10}>
                        <Card className="w-100">
                          <Box mt="2">
                            {regionOverview?.error ? (
                              <h4>
                                ข้อมูลสถิติระดับจังหวัดของคุณ
                                ยังไม่ถูกสร้างขึ้นในเวลานี้
                                โปรดกลับมาใหม่ในภายหลัง
                              </h4>
                            ) : (
                              <RegionalMap
                                country={1 || 1} //Thailand id = 1
                                loading={regionOverview.loading}
                                datasource={regionOverview.country}
                                handleMouseClickRegion={handleMouseClickRegion}
                              />
                            )}
                          </Box>

                          <Box mt="4">
                            <Row justify="end" type="flex">
                              <Col xs={24} sm={24} md={14}>
                                <h4>ลำดับคะแนนเฉลี่ย</h4>
                                <Box>
                                  <ScoreRange
                                    name="ดีมาก"
                                    percentage="80% - 100%"
                                    color="#39b54a"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="ดี"
                                    percentage="60% - 79%"
                                    color="#72cb7e"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="ปานกลาง"
                                    percentage="40% - 59%"
                                    color="#8cc63f"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="พอใช้"
                                    percentage="20% - 39%"
                                    color="#fbb03b"
                                  ></ScoreRange>
                                  <ScoreRange
                                    name="ควรปรับปรุง"
                                    percentage="0% - 19%"
                                    color="#ee5721"
                                  ></ScoreRange>
                                </Box>
                              </Col>
                            </Row>
                          </Box>
                        </Card>
                      </Col>
                      <Col xs={24} sm={24} md={14}>
                        <Box>
                          <Row gutter={[8, 8]} type="flex">
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconSchool
                                title="โรงเรียนทั้งหมดในภาค"
                                value={
                                  regionOverview?.loading
                                    ? 0
                                    : regionCountryOverView?.data
                                        ?.totalSchools || ""
                                }
                                suffix="แห่ง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconClassroom
                                title="ห้องเรียนทั้งหมดในภาค"
                                value={
                                  regionOverview?.loading
                                    ? 0
                                    : regionCountryOverView?.data
                                        ?.totalClassrooms || ""
                                }
                                suffix="ห้อง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconStudent
                                title="นักเรียนทั้งหมดในภาค"
                                value={
                                  regionOverview?.loading
                                    ? 0
                                    : regionCountryOverView?.data
                                        ?.totalStudents || ""
                                }
                                suffix="คน"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconTeacher
                                title="ครูทั้งหมดในภาค"
                                value={
                                  regionOverview?.loading
                                    ? 0
                                    : regionCountryOverView?.data
                                        ?.totalTeachers || ""
                                }
                                suffix="คน"
                              />
                            </Col>
                          </Row>
                        </Box>

                        <Box mt="2">
                          <Tabs type="card">
                            <TabPane tab="คะแนนเฉลี่ย" key="1" className="mb-0">
                              <Box p={3}>
                                <Box className="text-center">
                                  <h3 className="text-primary">
                                    คะแนนเฉลี่ยรวมจากนักเรียนทั้งหมดในประเทศ
                                  </h3>
                                </Box>

                                <Box mt="4" mb="4">
                                  <Row gutter={[16, 16]} type="flex">
                                    <Col xs={24} md={12}>
                                      <Row justify="center" type="flex">
                                        <Col md={10}>
                                          <Progress
                                            type="circle"
                                            percent={
                                              Number(
                                                countryOverview.country?.[77]?.data?.percentage?.toFixed(
                                                  1
                                                )
                                              ) ?? 0
                                            }
                                            strokeColor="#1c4e91"
                                            strokeWidth={15}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col xs={24} md={12}>
                                      <Row gutter={[8, 8]}>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ผ่านแล้ว ${
                                              countryOverview.loading
                                                ? 0
                                                : countryOverview.country?.[77]?.data?.percentage?.toFixed(
                                                    0
                                                  ) ?? 0
                                            }%`}
                                            color="#1c4e91"
                                          />
                                        </Col>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ยังไม่ผ่าน ${
                                              countryOverview.loading
                                                ? "-"
                                                : (
                                                    100 -
                                                    countryOverview.country?.[77]?.data?.percentage
                                                  )?.toFixed(0) ?? 0
                                            }%`}
                                            color="#aeaeae"
                                          />
                                        </Col>
                                      </Row>

                                      <Box mt="3">
                                        <h3 className="text-italic text-gray">
                                          *จากนักเรียนทั้งหมด{" "}
                                          {countryOverview?.loading
                                            ? 0
                                            : countryOverview.country?.[77]?.data.totalStudents ??
                                              0}{" "}
                                          คน
                                        </h3>
                                      </Box>
                                    </Col>
                                  </Row>
                                </Box>
                              </Box>
                            </TabPane>
                            {/* <TabPane tab="เวลาเฉลี่ย" key="2">
                              <p>Content of Tab Pane 2</p>
                            </TabPane> */}
                          </Tabs>
                        </Box>

                        <Box mt="2">
                          <CardWithTitle
                            icon={<FileDoneOutlined />}
                            title="คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างของแต่ละภาค"
                          >
                            <Box mt="2">
                              <DropdownForm
                                title="แสดงสถิติของภาค"
                                placeholder={statisticRegion?.name ?? "ทั้งหมด"}
                                titlespan={6}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={regionOverview?.loading}
                                overlay={
                                  regionOverview?.loading ? (
                                    <></>
                                  ) : (
                                    <Menu onClick={onStatisticRegionClick}>
                                      {Object.entries(
                                        regionOverview?.country
                                      ).map((key) => {
                                        //console.log(key)
                                        //return only entries that name isn't null
                                        if (key[1].name) {
                                          return (
                                            <Menu.Item key={key[1]?.name}>
                                              {key[1]?.name}
                                            </Menu.Item>
                                          );
                                        }
                                      })}
                                    </Menu>
                                  )
                                }
                              />
                            </Box>

                            <Box mt="2">
                              <Row gutter={[8, 8]} type="flex">
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนที่ต่ำสุด"
                                    value={
                                      regionOverview?.loading
                                        ? ""
                                        : statisticRegion?.data?.leastBest ||
                                          ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนเฉลี่ย"
                                    value={
                                      regionOverview?.loading
                                        ? "-"
                                        : statisticRegion?.data?.percentage?.toFixed(
                                            2
                                          ) || ""
                                    }
                                    suffix="คะแนน"
                                    precision={1}
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนที่สูงสุด"
                                    value={
                                      regionOverview?.loading
                                        ? ""
                                        : statisticRegion?.data?.mostBest ||
                                          ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                              </Row>
                            </Box>
                          </CardWithTitle>
                        </Box>
                      </Col>
                      <Col span={24}>
                        <CardWithTitle
                          icon={<GoldOutlined />}
                          title="10 อันดับโรงเรียนคะแนนสูงสุดในภาค"
                        >
                          <ScrollView>
                            <OverviewTable
                              datasource={
                                schoolsStatisticsByRegionOnMap?.schoolList ?? []
                              }
                              loading={schoolsStatisticsByRegionOnMap?.loading}
                            />
                          </ScrollView>
                        </CardWithTitle>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="ข้อมูลเฉลี่ยของแต่ละโรงเรียนในจังหวัด" key="3">
                    <Box mt="3">
                      <ScrollView>
                        <AvgSchoolTable
                          datasource={
                            schoolsStatisticsByProvinceOnMap?.schoolList ?? []
                          }
                          loading={schoolsStatisticsByProvinceOnMap?.loading}
                          province={
                            schoolsStatisticsByProvinceOnMap?.province?.name ??
                            []
                          }
                        />
                      </ScrollView>
                    </Box>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
