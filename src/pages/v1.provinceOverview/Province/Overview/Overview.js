import "./Overview.css";

import React, { useRef, useEffect, useState, useParams } from "react";

import {
  Dropdown,
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
  Map,
  VerticalBarChartJs,
  DropdownForm,
  StatisticWithText,
  ScoreTotal,
  CardWithTitle,
  ScoreRange,
  //StatisticWithIcon,
} from "../../../../components/Statistics";

import StatisticWithIconSchool from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconSchool";
import StatisticWithIconClassroom from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconClassroom";
import StatisticWithIconStudent from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconStudent";
import StatisticWithIconTeacher from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconTeacher";

import {
  LineChartOutlined,
  GoldOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

import OverviewTable from "./OverviewTable";
import AvgSchoolTable from "./AvgSchoolTable";

import Parent from "../../../../components/Parent";
import Header from "../../../students.ts.v1/Header";

import { SchoolService } from "../../../../services/Statistics";

import http from "../../../../utils/FirebaseCloud";

const { TabPane } = Tabs;

export default function Overview() {
  const parent = useRef(Parent);

  const _provinceId = window.localStorage.getItem("provinceId");
  const _schoolId = window.localStorage.getItem("schoolId");

  const [province, setProvince] = useState(_provinceId);

  const [dataProvince, setDataProvince] = useState({
    schoolName: "",
    province: _provinceId,
    affiliation: "",
    esa: "",
    district: "",
  });
  const [dataDistrict, setDataDistrict] = useState({
    province: _provinceId,
  });

  const [schoolsStatisticsByProvince, setSchoolsStatisticsByProvince] =
    useState({
      loading: true,
      data: {},
    });

  const [
    schoolsStatisticsAllDistrictByProvince,
    setSchoolsStatisticsAllDistrictByProvince,
  ] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    if (_schoolId) {
      SchoolService.getSchoolProfileBySchoolIdAsync(_schoolId).then(
        (result) => {
          setProvince(result?.addresses[0]?.geoCode.slice(0, 2));
        }
      );
    }
  }, []);

  useEffect(() => {
    if (province || _provinceId) {
      setDataProvince({ ...dataProvince, province: province });
      setDataDistrict({ province: province });
    }
  }, [province]);

  useEffect(() => {
    if (dataProvince.province) {
      SchoolService.getSchoolsStatisticsByProvinceAsync(dataProvince).then(
        (res) => {
          if (res.error) {
            setSchoolsStatisticsByProvince({
              ...schoolsStatisticsByProvince,
              error: res.error,
            });
          } else {
            setSchoolsStatisticsByProvince(res);
          }
        }
      );
      SchoolService.getSchoolsStatisticsAllDistrictByProvinceAsync(
        dataDistrict
      ).then((res) => {
        if (res.error) {
          setSchoolsStatisticsAllDistrictByProvince({
            ...schoolsStatisticsAllDistrictByProvince,
            error: res.error,
          });
        } else {
          setSchoolsStatisticsAllDistrictByProvince(res);
        }
      });
    }
  }, [dataProvince, dataDistrict]);

  useEffect(() => {
    setSchoolStatisticProvince(schoolsStatisticsByProvince.totalStatInProvince);
  }, [schoolsStatisticsByProvince.loading]);

  const [schoolStatisticProvince, setSchoolStatisticProvince] = useState(null);
  const onSchoolStatisticProvinceClick = ({ key }) => {
    if (key === "TOTAL") {
      setSchoolStatisticProvince(
        schoolsStatisticsByProvince.totalStatInProvince
      );
    } else {
      const item = schoolsStatisticsByProvince?.schoolList.filter((e) => {
        return e.id == key;
      });

      setSchoolStatisticProvince(item?.length > 0 ? item[0] : null);
    }
  };

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

  //ข้อมูลโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมดในจังหวัด
  const [provinceCountryOverView, setProvinceCountryOverView] = useState(null);
  //ปรับ โรงเรียน/ห้องเรียน/นักเรียน/ครูทั้งหมดในจังหวัด เป็นจังหวัดของผู้บริหารส่วนจังหวัด
  useEffect(() => {
    const item = countryOverview?.country?.filter(
      (e) => e.name === schoolsStatisticsByProvince?.province?.name
    );
    setProvinceCountryOverView(item?.length > 0 ? item[0] : null);
    //console.log(provinceCountryOverView)
    //console.log(schoolsStatisticsByProvince.data)
  }, [schoolsStatisticsByProvince, countryOverview]);

  // cloud function ข้อมูลโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมดในจังหวัดในทุกอำเภอ
  async function getProvinceOverviewAsync() {
    var body = {
      data: {
        province: `${schoolsStatisticsByProvince?.province?.name}`,
      },
    };
    let res = await http.callAsia2(`getProvinceOverview`, body);

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
  //ข้อมูล(จำนวนโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมด) (และคะแนนรวม) ในจังหวัดในทุกอำเภอ
  const [provinceOverview, setProvinceOverview] = useState({
    loading: true,
    data: {},
  });
  useEffect(() => {
    getProvinceOverviewAsync(provinceOverview).then((res) => {
      if (res.error) {
        setProvinceOverview({
          ...provinceOverview,
          error: res.error,
        });
      } else {
        setProvinceOverview(res);
      }
    });
  }, [schoolsStatisticsByProvince]);

  //ข้อมูล(จำนวนโรงเรียน ห้องเรียน นักเรียน และครูทั้งหมด) (และคะแนนรวม) ในจังหวัดในทุกอำเภอใน dropdown
  const [statisticDistrict, setStatisticDistrict] = useState(null);
  const onStatisticDistrictClick = ({ key }) => {
    if (key === "TOTAL") {
      const item1 = provinceOverview.filter((e) => e.name === "ทั้งหมด");
      setStatisticDistrict(item1?.length > 0 ? item1[0] : null);
    } else {
      const item2 = provinceOverview.filter((e) => e.name === key);

      setStatisticDistrict(item2?.length > 0 ? item2[0] : null);
    }
  };

  //total number of game stages (ด่านทั้งหมด)
  const [gameStages, setGameStages] = useState(null);

  useEffect(() => {
    setGameStages(
      schoolsStatisticsAllDistrictByProvince?.totalInProvince?.totalSumPlay
    );
  }, [schoolsStatisticsAllDistrictByProvince]);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={
          schoolsStatisticsByProvince?.loading
            ? "Loading"
            : "ภาพรวมจังหวัดโรงเรียนในจังหวัด: " +
              schoolsStatisticsByProvince?.province?.name
        }
      />

      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col span={24}>
                <Tabs type="card" defaultActiveKey="1">
                  <TabPane tab="ภาพรวมคะแนน" key="1">
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} sm={24} md={10}>
                        <Card className="w-100">
                          <Box mt="2">
                            {schoolsStatisticsAllDistrictByProvince?.error ? (
                              <h4>
                                ข้อมูลสถิติระดับจังหวัดของคุณ
                                ยังไม่ถูกสร้างขึ้นในเวลานี้
                                โปรดกลับมาใหม่ในภายหลัง
                              </h4>
                            ) : (
                              <Map
                                province={province || 10}
                                loading={
                                  schoolsStatisticsAllDistrictByProvince.loading
                                }
                                datasource={
                                  schoolsStatisticsAllDistrictByProvince?.province
                                }
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
                                  schoolsStatisticsAllDistrictByProvince?.loading
                                    ? 0
                                    : schoolsStatisticsAllDistrictByProvince
                                        ?.totalInProvince.totalSchool
                                }
                                suffix="แห่ง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconClassroom
                                title="ห้องเรียนทั้งหมดในจังหวัด"
                                // value={
                                //   schoolsStatisticsAllDistrictByProvince?.loading
                                //     ? 0
                                //     : schoolsStatisticsAllDistrictByProvince
                                //         ?.totalInProvince.totalClassroom
                                // }
                                value={
                                  provinceCountryOverView?.loading
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
                                  schoolsStatisticsAllDistrictByProvince?.loading
                                    ? 0
                                    : schoolsStatisticsAllDistrictByProvince
                                        ?.totalInProvince.totalStudents
                                }
                                suffix="คน"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconTeacher
                                title="ครูทั้งหมดในจังหวัด"
                                value={
                                  provinceCountryOverView?.loading
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
                            <TabPane
                              tab="จำนวนด่านเฉลี่ย"
                              key="1"
                              className="mb-0"
                            >
                              <Box p={3}>
                                <Box className="text-center">
                                  <h3 className="text-primary">
                                    จำนวนด่านเฉลี่ยรวมจากนักเรียนทั้งหมดในจังหวัด
                                  </h3>
                                  <Box>
                                    <DropdownForm
                                      placeholder={
                                        schoolsStatisticsByProvince?.loading
                                          ? ""
                                          : schoolStatisticProvince?.schoolName ??
                                            "ทั้งหมด"
                                      }
                                      loading={
                                        schoolsStatisticsByProvince?.loading
                                      }
                                      overlay={
                                        schoolsStatisticsByProvince?.loading ? (
                                          <></>
                                        ) : (
                                          <Menu
                                            onClick={
                                              onSchoolStatisticProvinceClick
                                            }
                                          >
                                            <Menu.Item key="TOTAL">
                                              ทั้งหมด
                                            </Menu.Item>
                                            {Object.entries(
                                              schoolsStatisticsByProvince?.schoolList
                                            ).map((key) => {
                                              return (
                                                <Menu.Item key={key[1]?.id}>
                                                  {key[1]?.schoolName}
                                                </Menu.Item>
                                              );
                                            })}
                                          </Menu>
                                        )
                                      }
                                    />
                                  </Box>
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
                                                schoolStatisticProvince?.percentage?.toFixed(
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
                                              schoolsStatisticsByProvince?.loading
                                                ? 0
                                                : schoolStatisticProvince?.percentage?.toFixed(
                                                    0
                                                  ) ?? 0
                                            }%`}
                                            color="#1c4e91"
                                          />
                                        </Col>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ยังไม่ผ่าน ${
                                              schoolsStatisticsByProvince.loading
                                                ? "-"
                                                : (
                                                    100 -
                                                    schoolStatisticProvince?.percentage
                                                  )?.toFixed(0) ?? 0
                                            }%`}
                                            color="#aeaeae"
                                          />
                                        </Col>
                                      </Row>

                                      <Box mt="3">
                                        <h3 className="text-italic text-gray">
                                          *จากนักเรียนทั้งหมด{" "}
                                          {schoolsStatisticsByProvince?.loading
                                            ? 0
                                            : schoolStatisticProvince?.totalStudents ??
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
                            title="คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนในจังหวัด"
                          >
                            <Box mt="2">
                              <DropdownForm
                                title="แสดงสถิติของอำเภอ"
                                placeholder={
                                  statisticDistrict?.name ?? "ทั้งหมด"
                                }
                                titlespan={6}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={provinceOverview?.loading}
                                overlay={
                                  provinceOverview?.loading ? (
                                    <></>
                                  ) : (
                                    // <Menu onClick={onStatisticDistrictClick}>
                                    // <Menu.Item key="TOTAL">ทั้งหมด</Menu.Item>
                                    <Menu onClick={onStatisticDistrictClick}>
                                      {Object.entries(provinceOverview).map(
                                        (key) => {
                                          //console.log(key)
                                          //return only entries that data isn't null
                                          if (key[1].data) {
                                            return (
                                              <Menu.Item key={key[1]?.name}>
                                                {key[1]?.name}
                                              </Menu.Item>
                                            );
                                          }
                                        }
                                      )}
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
                                      provinceOverview?.loading
                                        ? 0
                                        : statisticDistrict?.data.leastBest
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนเฉลี่ย"
                                    value={
                                      provinceOverview?.loading
                                        ? 0
                                        : statisticDistrict?.data.average?.toFixed(
                                            1
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
                                      provinceOverview?.loading
                                        ? 0
                                        : statisticDistrict?.data.mostBest
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
                          title="10 อันดับโรงเรียนจำนวนด่านที่ผ่านสูงสุด"
                        >
                          <ScrollView>
                            <OverviewTable
                              datasource={
                                schoolsStatisticsByProvince?.schoolList ?? []
                              }
                              loading={schoolsStatisticsByProvince?.loading}
                            />
                          </ScrollView>
                        </CardWithTitle>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="สถิติเปรียบเทียบ" key="2">
                    <h2>ภาพรวมสถิติของแต่ละโรงเรียนในจังหวัด : </h2>
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} md={15}>
                        <CardWithTitle
                          icon={<LineChartOutlined />}
                          title="กราฟแสดงการเปรียบเทียบคะแนนเฉลี่ย"
                          extra={
                            <Box>
                              <DropdownForm
                                title="เปรียบเทียบกับ"
                                placeholder="แต่ละอำเภอ"
                                titlespan={12}
                                dropdownspan={12}
                              />
                            </Box>
                          }
                        >
                          <VerticalBarChartJs
                            height={250}
                            width={2500}
                            loading={
                              schoolsStatisticsAllDistrictByProvince.loading
                            }
                            labels={
                              schoolsStatisticsAllDistrictByProvince.loading
                                ? []
                                : schoolsStatisticsAllDistrictByProvince?.province?.map(
                                    (e) => e.name
                                  )
                            }
                            items={
                              schoolsStatisticsAllDistrictByProvince.loading
                                ? []
                                : schoolsStatisticsAllDistrictByProvince?.province?.map(
                                    (e) => e.totalPercentage
                                  )
                            }
                          />
                        </CardWithTitle>

                        <Box mt="2">
                          <CardWithTitle
                            icon={<FileDoneOutlined />}
                            title="อันดับและผลการเปรียบเทียบ"
                            extra={
                              <Box>
                                <DropdownForm
                                  title="เปรียบเทียบกับ"
                                  placeholder="แต่ละอำเภอ"
                                  titlespan={12}
                                  dropdownspan={12}
                                />
                              </Box>
                            }
                          >
                            <Row gutter={[8, 8]} type="flex">
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="จำนวนอำเภอ : "
                                  value={
                                    schoolsStatisticsAllDistrictByProvince.loading
                                      ? ""
                                      : Object.keys(
                                          schoolsStatisticsAllDistrictByProvince
                                        )?.length - 2
                                  }
                                  suffix="อำเภอ"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title={`ค่าเฉลี่ยของจังหวัด${schoolsStatisticsByProvince?.province?.name} : `}
                                  titleSize="12px"
                                  value={schoolsStatisticsAllDistrictByProvince?.totalInProvince?.totalPercentage?.toFixed(
                                    2
                                  )}
                                  suffix="%"
                                  color="#72cb7e"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <StatisticWithText
                                  title="ค่าเฉลี่ยของโรงเรียนทั้งหมดในระบบ : "
                                  titleSize="9px"
                                  value={schoolsStatisticsAllDistrictByProvince?.totalInCountry?.totalPercentage?.toFixed(
                                    2
                                  )}
                                  suffix="%"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                            </Row>
                          </CardWithTitle>
                        </Box>
                      </Col>
                      <Col xs={24} md={9}>
                        <CardWithTitle
                          icon={<FileDoneOutlined />}
                          title={
                            "จำนวนด่านที่ผ่านทั้งหมดจากทั้งหมด (" +
                            (gameStages || 0) +
                            " ด่าน)"
                          }
                        >
                          <Box mt="2" className="text-center">
                            <h4>ค่าเฉลี่ยของโรงเรียนทั้งหมดในจังหวัด</h4>
                          </Box>

                          <Box mt="3">
                            <Row justify="center" type="flex">
                              <Col sm={10}>
                                <Progress
                                  type="circle"
                                  percent={
                                    Number(
                                      schoolsStatisticsAllDistrictByProvince?.totalInProvince?.totalPercentage?.toFixed(
                                        2
                                      )
                                    ) ?? 0
                                  }
                                  strokeColor="#1c4e91"
                                  strokeWidth={15}
                                />
                              </Col>
                            </Row>
                          </Box>

                          <Box mt="3">
                            <Row gutter={[8, 8]} type="flex">
                              <Col xs={24} md={24}>
                                <ScoreTotal
                                  name={`ผ่านแล้ว ${
                                    schoolsStatisticsAllDistrictByProvince.loading
                                      ? "-"
                                      : schoolsStatisticsAllDistrictByProvince
                                          ?.totalInProvince?.totalSumPass
                                  } ด่าน`}
                                  color="#1c4e91"
                                  size={20}
                                  fontSize={14}
                                />
                              </Col>
                              <Col xs={24} md={24}>
                                <ScoreTotal
                                  name={`ยังไม่ผ่าน ${
                                    schoolsStatisticsAllDistrictByProvince.loading
                                      ? "-"
                                      : schoolsStatisticsAllDistrictByProvince
                                          ?.totalInProvince?.totalSumPlay -
                                        schoolsStatisticsAllDistrictByProvince
                                          ?.totalInProvince?.totalSumPass
                                  } ด่าน`}
                                  color="#aeaeae"
                                  size={20}
                                  fontSize={14}
                                />
                              </Col>
                            </Row>
                          </Box>

                          <Box mt="3">
                            <Row gutter={[8, 8]} type="flex">
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนที่ต่ำที่สุด"
                                  value={
                                    schoolsStatisticsAllDistrictByProvince
                                      ?.totalInProvince?.totalMostWorst
                                  }
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนเฉลี่ย"
                                  value={schoolsStatisticsAllDistrictByProvince?.totalInProvince?.totalPercentage?.toFixed(
                                    2
                                  )}
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนที่สูงที่สุด"
                                  value={
                                    schoolsStatisticsAllDistrictByProvince
                                      ?.totalInProvince?.totalMostBest
                                  }
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                            </Row>
                          </Box>
                        </CardWithTitle>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="ข้อมูลเฉลี่ยของแต่ละโรงเรียน" key="3">
                    <Box mt="3">
                      <ScrollView>
                        <AvgSchoolTable
                          datasource={
                            schoolsStatisticsByProvince?.schoolList ?? []
                          }
                          loading={schoolsStatisticsByProvince?.loading}
                          province={
                            schoolsStatisticsByProvince?.province?.name ?? []
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
