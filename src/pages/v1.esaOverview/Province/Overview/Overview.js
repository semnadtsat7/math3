import classes from "./Overview.module.css";

import React, { useRef, useEffect, useState } from "react";

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
  DropdownForm,
  StatisticWithText,
  ScoreTotal,
  CardWithTitle,
  ScoreRange,
  VerticalBarChartJsEsa,
  VerticalBarChartJsAffiliation,
  //StatisticWithIcon,
} from "../../../../components/Statistics";

import { Map } from "../../../v1.esaOverview";

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

const { TabPane } = Tabs;

export default function Overview() {
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

  //total number of game stages (ด่านทั้งหมด)
  const [gameStages, setGameStages] = useState(null);

  useEffect(() => {
    setGameStages(chosenEsa?.[0]?.total?.metrics?.play);
  }, [chosenEsa]);

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
                    ภาพรวมเขตพื้นที่การศึกษา
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
                      placeholder={chosenEsaName ?? "เลือกเขตพื้นที่การศึกษา"}
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
                                //handleMouseClick={handleMouseClick}
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
                                title="โรงเรียนทั้งหมดในเขต"
                                value={
                                  chosenEsa?.loading
                                    ? 0
                                    //: chosenEsa?.[0]?.total?.totalSchools || ""
                                    : chosenEsa?.[0]?.schools?.length || ""
                                }
                                suffix="แห่ง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconClassroom
                                title="ห้องเรียนทั้งหมดในเขต"
                                value={
                                  chosenEsa?.loading
                                    ? 0
                                    : chosenEsa?.[0]?.total?.totalClassrooms ||
                                      ""
                                }
                                suffix="ห้อง"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconStudent
                                title="นักเรียนทั้งหมดในเขต"
                                value={
                                  chosenEsa?.loading
                                    ? 0
                                    : chosenEsa?.[0]?.total?.totalStudents || ""
                                }
                                suffix="คน"
                              />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                              <StatisticWithIconTeacher
                                title="ครูทั้งหมดในเขต"
                                value={
                                  chosenEsa?.loading
                                    ? 0
                                    : chosenEsa?.[0]?.total?.totalTeachers || ""
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
                                    คะแนนเฉลี่ยจากนักเรียนทั้งหมดใน{" "}
                                    {chosenEsaName || "เขตพื้นที่การศึกษา"}
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
                                                chosenEsa?.[0]?.total?.metrics?.averagePass/*?.toFixed(1)*/
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
                                              chosenEsa?.[0]?.total?.metrics?.averagePass/*?.toFixed(1)*/ ?? 0
                                            }%`}
                                            color="#1c4e91"
                                          />
                                        </Col>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ยังไม่ผ่าน ${
                                              chosenEsa?.loading
                                                ? 0
                                                : 100 -
                                                chosenEsa?.[0]?.total?.metrics?.averagePass/*?.toFixed(1)*/ || 0
                                            }%`}
                                            color="#aeaeae"
                                          />
                                        </Col>
                                      </Row>

                                      <Box mt="3">
                                        <h3 className="text-italic text-gray">
                                          *จากนักเรียนทั้งหมด{" "}
                                          {chosenEsa?.loading
                                            ? 0
                                            : chosenEsa?.[0]?.total
                                                ?.totalStudents ?? 0}{" "}
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
                            title={
                              <p>
                                คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนใน{" "}
                                {chosenEsaName || "เขตพื้นที่การศึกษา"}
                              </p>
                            }
                          >
                            <Box mt="2">
                              <DropdownForm
                                title="แสดงสถิติของโรงเรียน"
                                placeholder={
                                  chosenSchoolInEsa?.data?.name?.thai ??
                                  "เลือกโรงเรียน"
                                }
                                titlespan={6}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={chosenEsa?.loading}
                                overlay={
                                  chosenEsa?.loading ? (
                                    <></>
                                  ) : (
                                    // <Menu onClick={onStatisticDistrictClick}>
                                    // <Menu.Item key="TOTAL">ทั้งหมด</Menu.Item>
                                    <Menu onClick={onChosenSchoolInEsaClick}>
                                      {chosenEsa?.[0]?.schools.map((key) => {
                                        //console.log(key)
                                        return (
                                          <Menu.Item
                                            key={key?.data?.name?.thai}
                                          >
                                            {key?.data?.name?.thai}
                                          </Menu.Item>
                                        );
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
                                      esaOverview?.loading
                                        ? ""
                                        : chosenSchoolInEsa?.statistics?.total?.metrics?.worstBest/*?.toFixed(2)*/ || ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนเฉลี่ย"
                                    value={
                                      esaOverview.loading
                                        ? "-"
                                        : chosenSchoolInEsa?.statistics?.total?.metrics?.averageScore/*?.toFixed(2)*/ || ""
                                    }
                                    suffix="คะแนน"
                                    precision={1}
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนที่สูงสุด"
                                    value={
                                      esaOverview?.loading
                                        ? ""
                                        : chosenSchoolInEsa?.statistics?.total
                                            ?.metrics?.mostBest || ""
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
                          title={
                            <p>
                              10 อันดับโรงเรียนคะแนนสูงสุดใน{" "}
                              {chosenEsaName || "เขตพื้นที่การศึกษา"}
                            </p>
                          }
                        >
                          <ScrollView>
                            <OverviewTable
                              datasource={chosenEsa?.[0]?.schools ?? []}
                              loading={chosenEsa?.loading}
                            />
                          </ScrollView>
                        </CardWithTitle>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="สถิติเปรียบเทียบ" key="2">
                    <h2>
                      ภาพรวมสถิติของโรงเรียนในเขตพื้นที่การศึกษา :{" "}
                      {chosenEsaName || ""}
                    </h2>
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} md={15}>
                        <CardWithTitle
                          icon={<LineChartOutlined />}
                          title="กราฟแสดงการเทียบคะแนนเฉลี่ยกับเขตอื่นๆ"
                          extra={
                            <Box>
                              <DropdownForm
                                title="เปรียบเทียบกับ"
                                //placeholder="สพป. เขตอื่น"
                                placeholder="เขตอื่น"
                                titlespan={12}
                                dropdownspan={12}
                              />
                            </Box>
                          }
                        >
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
                                    )[0]?.total?.metrics?.averagePass/*.toFixed(2)*/;
                                  })
                            }
                          />
                          <br />
                          <div style={{ marginLeft: "18px" }}>
                            <h3>กราฟแสดงการเทียบคะแนนเฉลี่ยกับโรงเรียนอื่นๆ</h3>
                          </div>
                          <VerticalBarChartJsAffiliation
                            height={250}
                            width={2500}
                            loading={barChartStatisticsBySchool?.loading}
                            labels={
                              chosenEsa.loading
                                ? []
                                : chosenEsa?.[0]?.schools.map(
                                    (e) => e.data?.name?.thai
                                  )
                            }
                            items={
                              chosenEsa?.loading
                                ? []
                                : chosenEsa?.[0]?.schools.map((e) =>
                                    e.statistics?.total?.metrics?.averagePass/*?.toFixed(2)*/
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
                                  placeholder="โรงเรียนในระบบ"
                                  titlespan={10}
                                  dropdownspan={14}
                                />
                              </Box>
                            }
                          >
                            <Row gutter={[8, 8]} type="flex">
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="จำนวนเขตพื้นที่การศึกษา :"
                                  value={
                                    esaOverview?.loading
                                      ? "0"
                                      : esaOverview?.length || "0"
                                  }
                                  suffix="เขตพื้นที่การศึกษา"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title={`ค่าเฉลี่ยของ${
                                    chosenEsaName || "เขตพื้นที่การศึกษา :"
                                  }`}
                                  titleSize="12px"
                                  value={
                                    chosenEsa?.[0]?.total?.metrics?.averagePass/*?.toFixed(2)*/ || "0"
                                  }
                                  suffix="%"
                                  color="#72cb7e"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <StatisticWithText
                                  title="ค่าเฉลี่ยของโรงเรียนทั้งหมดในระบบ : "
                                  titleSize="9px"
                                  value={
                                    countryOverview?.country?.[
                                      countryOverview?.country.length - 1
                                    ]?.data?.percentage?.toFixed(2) || 0
                                  }
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
                            <h4>
                              ค่าเฉลี่ยของโรงเรียนทั้งหมดใน{" "}
                              {chosenEsaName || "เขตพื้นที่การศึกษา"}
                            </h4>
                          </Box>

                          <Box mt="3">
                            <Row justify="center" type="flex">
                              <Col sm={10}>
                                <Progress
                                  type="circle"
                                  percent={Number(
                                    chosenEsa?.[0]?.total?.metrics?.averagePass || "0"
                                  )}
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
                                    chosenEsa.loading
                                      ? "-"
                                      : chosenEsa?.[0]?.total?.metrics?.pass || 0
                                  } ด่าน`}
                                  color="#1c4e91"
                                  size={20}
                                  fontSize={14}
                                />
                              </Col>
                              <Col xs={24} md={24}>
                                <ScoreTotal
                                  name={`ยังไม่ผ่าน ${
                                    chosenEsa.loading
                                      ? "-"
                                      : chosenEsa?.[0]?.total?.metrics?.play -
                                        chosenEsa?.[0]?.total?.metrics?.pass || 0
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
                                  value={chosenEsa?.[0]?.total?.metrics?.worstBest || 0}
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนเฉลี่ย"
                                  value={chosenEsa?.[0]?.total?.metrics?.averageScore || 0}
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนที่สูงที่สุด"
                                  value={chosenEsa?.[0]?.total?.metrics?.mostBest || 0}
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
                  <TabPane
                    tab="ข้อมูลเฉลี่ยของแต่ละโรงเรียนในเขตพื้นที่การศึกษา"
                    key="3"
                  >
                    <Box mt="3">
                      <ScrollView>
                        <AvgSchoolTable
                          datasource={chosenEsa?.[0]?.schools ?? []}
                          loading={chosenEsa?.loading}
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
