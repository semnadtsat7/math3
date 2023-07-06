import classes from "./Overview.module.css";

import React, { useRef, useEffect, useState } from "react";

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
  VerticalBarChartJsAffiliation,
  StatisticWithText,
  ScoreTotal,
  CardWithTitle,
  ScoreRange,
} from "../../../../components/Statistics";

import { Map } from "../../../v1.affiliationOverview";

import { LineChartOutlined, FileDoneOutlined } from "@ant-design/icons";

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

  //handleMouseClick on map
  function handleMouseClick(event) {
    function getLocationName(event) {
      return event?.target?.attributes?.name?.value;
    }
    const pointedLocation = getLocationName(event);
    console.log(pointedLocation);
  }

  //affiliation
  //bar chart loading
  const [barChartStatisticsBySchool, setBarChartStatisticsBySchool] = useState({
    loading: true,
  });

  //ข้อมูลเครือโรงเรียนทั้งหมด
  const [affiliationOverview, setAffiliationOverview] = useState({
    loading: true,
    data: {},
  });
  useEffect(() => {
    SchoolService.getAffiliationOverviewAsync(affiliationOverview).then(
      (res) => {
        if (res.error) {
          setAffiliationOverview({
            ...affiliationOverview,
            error: res.error,
          });
        } else {
          setAffiliationOverview(res);
        }
      }
    );
  }, []);

  //เครือโรงเรียนที่เลือก
  const [chosenAffiliation, setChosenAffiliation] = useState({
    loading: true,
    data: {},
  });
  const [chosenAffiliationName, setChosenAffiliationName] = useState(null);
  const onChosenAffiliationClick = ({ key }) => {
    //filter object by key
    const item = affiliationOverview?.filter((affiliationData) => {
      if (Object.keys(affiliationData) == key) return affiliationData;
    });
    setChosenAffiliation(item?.length > 0 ? Object.values(item[0]) : null);
    setChosenAffiliationName(key);
    setChosenSchoolInAffiliation(null);
    setBarChartStatisticsBySchool({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsBySchool({ loading: false });
    }, 500);
    // console.log(chosenAffiliationName);
    // console.log(chosenAffiliation);
  };

  //คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนในเครือ
  const [chosenSchoolInAffiliation, setChosenSchoolInAffiliation] =
    useState(null);
  const onChosenSchoolInAffiliationClick = ({ key }) => {
    const item = chosenAffiliation?.[0].filter(
      (e) => e.data?.name?.thai === key
    );
    setChosenSchoolInAffiliation(item?.length > 0 ? item[0] : null);
    //console.log(item)
    console.log(chosenSchoolInAffiliation);
  };

  //total number of game stages (ด่านทั้งหมด)
  const [gameStages, setGameStages] = useState(null);

  useEffect(() => {
    setGameStages(
      chosenSchoolInAffiliation?.statistics?.total?.metrics?.sumPlay
    );
  }, [chosenSchoolInAffiliation]);

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
                      marginTop: "10px",
                    }}
                  >
                    <p>ภาพรวมโรงเรียนในเครือ :</p>
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      marginTop: "10px",
                      width: "100px",
                    }}
                  >
                    <DropdownForm
                      title=""
                      placeholder={chosenAffiliationName ?? "เลือกเครือ"}
                      titlespan={6}
                      dropdownspan={4}
                      md={8}
                      lg={7}
                      loading={affiliationOverview?.loading}
                      overlay={
                        affiliationOverview?.loading ? (
                          <></>
                        ) : (
                          <Menu onClick={onChosenAffiliationClick}>
                            {affiliationOverview.map((key) => {
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
                        <Box mt="2">
                          <Tabs type="card">
                            <TabPane tab="คะแนนเฉลี่ย" key="1" className="mb-0">
                              <Box p={3}>
                                <Box className="text-center">
                                  <span>
                                    คะแนนเฉลี่ยจากนักเรียนทั้งหมดในเครือ :
                                  </span>
                                  <h3 className="text-primary">
                                    {chosenAffiliationName || ""}
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
                                                //last index = ทั้งหมด
                                                chosenAffiliation?.[0]?.[
                                                  chosenAffiliation?.[0]
                                                    .length - 1
                                                ].percentage?.toFixed(1)
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
                                              chosenAffiliation?.loading
                                                ? 0
                                                : chosenAffiliation?.[0]?.[
                                                    chosenAffiliation?.[0]
                                                      .length - 1
                                                  ].percentage?.toFixed(0) ?? 0
                                            }%`}
                                            color="#1c4e91"
                                          />
                                        </Col>
                                        <Col span={24}>
                                          <ScoreTotal
                                            name={`ยังไม่ผ่าน ${
                                              chosenAffiliation?.loading
                                                ? 0
                                                : 100 -
                                                    chosenAffiliation?.[0]?.[
                                                      chosenAffiliation?.[0]
                                                        .length - 1
                                                    ].percentage?.toFixed(0) ||
                                                  0
                                            }%`}
                                            color="#aeaeae"
                                          />
                                        </Col>
                                      </Row>

                                      <Box mt="3">
                                        <h3 className="text-italic text-gray">
                                          *จากนักเรียนทั้งหมด{" "}
                                          {chosenAffiliation?.loading
                                            ? 0
                                            : chosenAffiliation?.[0]?.[
                                                chosenAffiliation?.[0].length -
                                                  1
                                              ].totalStudents ?? 0}{" "}
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
                            title="คะแนนรวมที่สูงที่สุดและต่ำที่สุดระหว่างโรงเรียนในเครือ"
                          >
                            <Box mt="2">
                              <DropdownForm
                                title="แสดงสถิติของโรงเรียน"
                                placeholder={
                                  chosenSchoolInAffiliation?.data?.name?.thai ??
                                  "เลือกโรงเรียน"
                                }
                                titlespan={6}
                                dropdownspan={4}
                                md={8}
                                lg={7}
                                loading={chosenAffiliation?.loading}
                                overlay={
                                  chosenAffiliation?.loading ? (
                                    <></>
                                  ) : (
                                    //<Menu onClick={onChosenSchoolInAffiliationClick}>
                                    //</Menu><Menu.Item key="TOTAL">ทั้งหมด</Menu.Item>
                                    <Menu
                                      onClick={onChosenSchoolInAffiliationClick}
                                    >
                                      {chosenAffiliation?.[0].map((key) => {
                                        //console.log(key);
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
                                      affiliationOverview?.loading
                                        ? ""
                                        : chosenSchoolInAffiliation?.statistics
                                            ?.total?.metrics?.leastBest || ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <StatisticWithText
                                    title="คะแนนเฉลี่ย"
                                    value={
                                      affiliationOverview.loading
                                        ? "-"
                                        : chosenSchoolInAffiliation?.statistics?.total?.metrics?.average?.toFixed(
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
                                      affiliationOverview?.loading
                                        ? ""
                                        : chosenSchoolInAffiliation?.statistics
                                            ?.total?.metrics?.mostBest || ""
                                    }
                                    suffix="คะแนน"
                                  />
                                </Col>
                              </Row>
                            </Box>
                          </CardWithTitle>
                        </Box>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="สถิติเปรียบเทียบ" key="2">
                    <h2>
                      ภาพรวมสถิติของเครือโรงเรียน : {chosenAffiliationName}{" "}
                    </h2>
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} md={15}>
                        <CardWithTitle
                          icon={<LineChartOutlined />}
                          title="กราฟแสดงการเทียบคะแนนเฉลี่ยนักเรียน"
                          extra={
                            <Box>
                              <DropdownForm
                                title="เปรียบเทียบกับ"
                                placeholder="แต่ละโรงเรียน"
                                titlespan={12}
                                dropdownspan={12}
                              />
                            </Box>
                          }
                        >
                          <VerticalBarChartJsAffiliation
                            height={250}
                            width={2500}
                            loading={barChartStatisticsBySchool?.loading}
                            labels={
                              chosenAffiliation?.loading
                                ? []
                                : chosenAffiliation?.[0].map(
                                    (e) => e.data?.name?.thai
                                  )
                            }
                            items={
                              chosenAffiliation?.loading
                                ? []
                                : chosenAffiliation?.[0].map((e) =>
                                    e.statistics?.total?.metrics?.percentage?.toFixed(
                                      2
                                    )
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
                                  placeholder="โรงเรียนในเครือ"
                                  titlespan={12}
                                  dropdownspan={12}
                                />
                              </Box>
                            }
                          >
                            <Row gutter={[8, 8]} type="flex">
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="โรงเรียนในเครือทั้งหมด : "
                                  value={
                                    chosenAffiliation?.loading
                                      ? "0"
                                      : chosenAffiliation?.[0].length - 1 || "0"
                                  }
                                  suffix="โรงเรียน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title={`ค่าเฉลี่ยของโรงเรียน: ${
                                    chosenSchoolInAffiliation?.data?.name
                                      ?.thai || ""
                                  }`}
                                  titleSize="12px"
                                  value={
                                    chosenSchoolInAffiliation?.statistics?.total?.metrics?.percentage?.toFixed(
                                      2
                                    ) || 0
                                  }
                                  suffix="%"
                                  color="#72cb7e"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title={`ค่าเฉลี่ยของโรงเรียนในเครือ: `}
                                  titleSize="12px"
                                  value={
                                    chosenAffiliation?.[0]?.[
                                      chosenAffiliation?.[0].length - 1
                                    ].percentage?.toFixed(2) || 0
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
                              {/* <Col xs={24} sm={12} md={8}>
                                <StatisticWithText
                                  title="อันดับของโรงเรียน : "
                                  titleSize="9px"
                                  value={schoolsStatisticsAllDistrictByProvince?.totalInCountry?.totalPercentage?.toFixed(
                                    2
                                  )}
                                  suffix=""
                                  color="#000000"
                                  height="110px"
                                />
                              </Col> */}
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
                          <Box mt="2">
                            <DropdownForm
                              title="แสดงสถิติของโรงเรียน:"
                              placeholder={
                                chosenSchoolInAffiliation?.data?.name?.thai ??
                                "เลือกโรงเรียน"
                              }
                              titlespan={6}
                              dropdownspan={4}
                              md={8}
                              lg={7}
                              loading={chosenAffiliation?.loading}
                              overlay={
                                chosenAffiliation?.loading ? (
                                  <></>
                                ) : (
                                  <Menu
                                    onClick={onChosenSchoolInAffiliationClick}
                                  >
                                    {chosenAffiliation?.[0].map((key) => {
                                      //console.log(key);
                                      return (
                                        <Menu.Item key={key?.data?.name?.thai}>
                                          {key?.data?.name?.thai}
                                        </Menu.Item>
                                      );
                                    })}
                                  </Menu>
                                )
                              }
                            />
                          </Box>

                          <Box mt="3">
                            <Row justify="center" type="flex">
                              <Col sm={10}>
                                <Progress
                                  type="circle"
                                  percent={Number(
                                    chosenSchoolInAffiliation?.statistics?.total
                                      ?.metrics?.percentage || 0
                                  ).toFixed(2)}
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
                                    chosenSchoolInAffiliation?.loading
                                      ? "-"
                                      : chosenSchoolInAffiliation?.statistics
                                          ?.total?.metrics?.sumPass || 0
                                  } ด่าน`}
                                  color="#1c4e91"
                                  size={20}
                                  fontSize={14}
                                />
                              </Col>
                              <Col xs={24} md={24}>
                                <ScoreTotal
                                  name={`ยังไม่ผ่าน ${
                                    chosenSchoolInAffiliation?.loading
                                      ? "-"
                                      : chosenSchoolInAffiliation?.statistics
                                          ?.total?.metrics?.sumPlay -
                                          chosenSchoolInAffiliation?.statistics
                                            ?.total?.metrics?.sumPass || 0
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
                                  title="คะแนนที่ต่ำสุด"
                                  value={
                                    affiliationOverview?.loading
                                      ? ""
                                      : chosenSchoolInAffiliation?.statistics
                                          ?.total?.metrics?.leastBest || 0
                                  }
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนเฉลี่ย"
                                  value={
                                    affiliationOverview.loading
                                      ? "-"
                                      : chosenSchoolInAffiliation?.statistics
                                          ?.total?.metrics?.average || 0
                                  }
                                  suffix="คะแนน"
                                  color="#000000"
                                  height="110px"
                                />
                              </Col>
                              <Col xs={12} sm={12} md={8}>
                                <StatisticWithText
                                  title="คะแนนที่สูงสุด"
                                  value={
                                    affiliationOverview?.loading
                                      ? ""
                                      : chosenSchoolInAffiliation?.statistics
                                          ?.total?.metrics?.mostBest || 0
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
                  <TabPane tab="ข้อมูลเฉลี่ยของแต่ละโรงเรียนในเครือ" key="3">
                    <Box mt="3">
                      <ScrollView>
                        <AvgSchoolTable
                          datasource={chosenAffiliation?.[0] ?? []}
                          loading={chosenAffiliation?.loading}
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
