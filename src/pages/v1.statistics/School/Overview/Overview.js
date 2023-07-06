import React, { useRef, useState, useEffect } from "react";

import {
  Menu,
  Marker,
  Progress,
  Divider,
  Col,
  Row,
  Tabs,
  Card,
  Box,
} from "../../../../core/components";
import {
  VerticalBarChartJs,
  CardWithAvatar,
  ScoreTotal,
  StatisticWithText,
  StatisticWithIcon,
  DropdownForm,
  CardWithTitle,
} from "../../../../components/Statistics";

import StatisticWithIconSchool from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconSchool";
import StatisticWithIconClassroom from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconClassroom";
import StatisticWithIconStudent from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconStudent";
import StatisticWithIconTeacher from "../../../../components/Statistics/StatisticWithIcon/StatisticWithIconTeacher";

import {
  ContainerFilled,
  FileDoneOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import GoogleMapReact from "google-map-react";
import Parent from "../../../../components/Parent";
import Header from "../../../students.ts.v1/Header";

import { SchoolService } from "../../../../services/Statistics";

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

export default function Overview() {
  const parent = useRef(Parent);
  const [schoolProfile, setSchoolProfile] = useState({
    loading: true,
  });
  const [schoolStatistics, setSchoolStatistics] = useState({
    loading: true,
  });
  const [schoolRanking, setSchoolRanking] = useState({
    loading: true,
  });
  const [barChartStatisticsBySchool, setBarChartStatisticsBySchool] = useState({
    loading: true,
  });
  const [compareWith, setCompareWith] = useState("province");

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
    SchoolService.getSchoolRankingBySchoolIdAsync(schoolId).then((res) => {
      // setSchoolRanking
      setStateAndValidate(schoolRanking, setSchoolRanking, res);
    });
  }, [schoolId]);

  useEffect(() => {
    setSchoolStatistic(schoolStatistics?.statistics?.total);
  }, [schoolStatistics]);

  useEffect(() => {
    // console.log(schoolProfile);
    if (!schoolProfile?.loading) {
      SchoolService.getBarChartStatisticsBySchoolIdAsync(
        schoolId,
        schoolProfile?.affiliation[0]?.affiliationId,
        compareWith
      ).then((res) => {
        // setBarChartStatisticsBySchool
        setStateAndValidate(
          barChartStatisticsBySchool,
          setBarChartStatisticsBySchool,
          res
        );
      });
    }
  }, [schoolProfile, compareWith]);

  const [schoolStatistic, setSchoolStatistic] = useState(null);
  const onSchoolStatisticClick = ({ key }) => {
    if (key === "TOTAL") {
      setSchoolStatistic(schoolStatistics?.statistics?.total);
    } else {
      const item = schoolStatistics?.statistics?.classes.filter(
        (e) => e.name === key
      );

      setSchoolStatistic(item?.length > 0 ? item[0] : null);
    }
  };

  const onSchoolEsaSelect = ({ key }) => {
    setCompareWith(key);
    setBarChartStatisticsBySchool({
      loading: true,
    });
  };

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
        arrGroup[key][arrGroup[key].length - 1] +", ";
      text += "";
    });

    return text;
  };

  //total number of game stages (ด่านทั้งหมด)
  const [gameStages, setGameStages] = useState(null);

  useEffect(() => {
    setGameStages(schoolStatistic?.metrics?.sumPlay);
  }, [schoolStatistic]);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={`ภาพรวมโรงเรียน${schoolProfile?.name?.thai ?? ""}`}
      />
      <Box>
        <div className="Overview">
          <Card bordered={false} className="w-100 Overview-Container">
            <Row gutter={[8, 8]} type="flex">
              <Col xs={24} md={15}>
                <Tabs type="card">
                  <Tabs.TabPane tab="นักเรียน" key="1">
                    <CardWithTitle
                      title="กราฟแสดงการเทียบค่าเฉลี่ยจำนวนด่านที่ผ่าน"
                      icon={<LineChartOutlined />}
                      extra={
                        <DropdownForm
                          title="เปรียบเทียบกับ"
                          placeholder={
                            compareWith === "affiliation"
                              ? "โรงเรียนในเครือ"
                              : "โรงเรียนในจังหวัด"
                          }
                          titlespan={10}
                          dropdownspan={14}
                          overlay={
                            <Menu onClick={onSchoolEsaSelect}>
                              <Menu.Item key="province">
                                โรงเรียนในจังหวัด
                              </Menu.Item>
                              <Menu.Item key="affiliation">
                                โรงเรียนในเครือ
                              </Menu.Item>
                            </Menu>
                          }
                        />
                      }
                    >
                      {barChartStatisticsBySchool?.error && (
                        <h3>
                          ภาพรวมโรงเรียนของคุณ ยังไม่ถูกสร้างขึ้นในเวลานี้
                          โปรดกลับมาใหม่ในภายหลัง
                        </h3>
                      )}
                      <Box mt="3">
                        <VerticalBarChartJs
                          height={250}
                          width={650}
                          loading={barChartStatisticsBySchool?.loading}
                          labels={
                            barChartStatisticsBySchool?.loading
                              ? []
                              : barChartStatisticsBySchool?.grade4.map(
                                  (e) => e.schoolName
                                )
                          }
                          items={
                            barChartStatisticsBySchool?.loading
                              ? []
                              : barChartStatisticsBySchool?.grade4.map(
                                  (e) => e.percentage
                                )
                          }
                          xText="-- โรงเรียน --"
                          title="ประถมศึกษาปีที่ 4"
                          isTitleDisplay={true}
                          isLabelIcon={true}
                          labelIconIndex={2}
                        />
                      </Box>
                      <Box mt="4">
                        <VerticalBarChartJs
                          height={250}
                          width={650}
                          loading={barChartStatisticsBySchool?.loading}
                          labels={
                            barChartStatisticsBySchool?.loading
                              ? []
                              : barChartStatisticsBySchool?.grade5.map(
                                  (e) => e.schoolName
                                )
                          }
                          items={
                            barChartStatisticsBySchool?.loading
                              ? []
                              : barChartStatisticsBySchool?.grade5.map(
                                  (e) => e.percentage
                                )
                          }
                          xText="-- โรงเรียน --"
                          title="ประถมศึกษาปีที่ 5"
                          isTitleDisplay={true}
                          isLabelIcon={true}
                          labelIconIndex={2}
                        />
                      </Box>
                      <Box mt="4">
                        <VerticalBarChartJs
                          height={250}
                          width={650}
                          loading={barChartStatisticsBySchool?.loading}
                          labels={
                            barChartStatisticsBySchool?.loading
                              ? []
                              : barChartStatisticsBySchool?.grade6.map(
                                  (e) => e.schoolName
                                )
                          }
                          items={
                            barChartStatisticsBySchool?.loading
                              ? []
                              : barChartStatisticsBySchool?.grade6.map(
                                  (e) => e.percentage
                                )
                          }
                          xText="-- โรงเรียน --"
                          title="ประถมศึกษาปีที่ 6"
                          isTitleDisplay={true}
                          isLabelIcon={true}
                          labelIconIndex={2}
                        />
                      </Box>
                    </CardWithTitle>
                  </Tabs.TabPane>
                  {/* <Tabs.TabPane tab="คุณครู" key="2">
                    <p>Content of Tab Pane 3</p>
                  </Tabs.TabPane> */}
                </Tabs>
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
                      title="แสดงสถิติของห้อง"
                      placeholder={schoolStatistic?.name ?? "ทั้งหมด"}
                      titlespan={8}
                      dropdownspan={7}
                      loading={schoolStatistics?.loading}
                      overlay={
                        schoolStatistics?.loading ? (
                          <></>
                        ) : (
                          <Menu onClick={onSchoolStatisticClick}>
                            <Menu.Item key="TOTAL">ทั้งหมด</Menu.Item>
                            {Object.entries(
                              schoolStatistics?.statistics?.classes
                            ).map((key) => {
                              return (
                                <Menu.Item key={key[1]?.name}>
                                  {key[1]?.name}
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
                      <Col span={24} className="text-center">
                        <Progress
                          type="circle"
                          percent={
                            parseFloat(
                              schoolStatistic?.metrics?.percentage?.toFixed(2)
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
                      <Col span={24}>
                        <ScoreTotal
                          name={`ผ่านแล้ว ${
                            schoolStatistic?.metrics?.sumPass ?? 0
                          } ด่าน`}
                          color="#1c4e91"
                          size={20}
                          fontSize={14}
                        />
                      </Col>
                      <Col span={24}>
                        <ScoreTotal
                          name={`ยังไม่ผ่าน ${
                            (schoolStatistic?.metrics?.sumPlay ?? 0) -
                            (schoolStatistic?.metrics?.sumPass ?? 0)
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
                      <Col xs={24} sm={8}>
                        <StatisticWithText
                          title="คะแนนที่ต่ำที่สุด"
                          value={schoolStatistic?.metrics?.mostWorst ?? 0}
                          suffix="คะแนน"
                          color="#000000"
                          height="110px"
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <StatisticWithText
                          title="คะแนนเฉลี่ย"
                          value={schoolStatistic?.metrics?.average ?? 0}
                          suffix="คะแนน"
                          color="#000000"
                          height="110px"
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <StatisticWithText
                          title="คะแนนที่สูงที่สุด"
                          value={schoolStatistic?.metrics?.mostBest ?? 0}
                          suffix="คะแนน"
                          color="#000000"
                          height="110px"
                        />
                      </Col>
                    </Row>
                  </Box>
                </CardWithTitle>

                <Box mt="2">
                  <CardWithTitle
                    icon={<FileDoneOutlined />}
                    title="อันดับและผลการเปรียบเทียบ"
                  >
                    <Box mt="3">
                      <Row gutter={[8, 8]} type="flex">
                        <Col xs={24} sm={12}>
                          <StatisticWithText
                            title="อันดับของโรงเรียน"
                            value={
                              schoolRanking.loading
                                ? 0
                                : schoolRanking?.rankingAffiliation[0]
                                    .ranking ?? 0
                            }
                            suffix=""
                            color="#000000"
                            height="110px"
                          />
                        </Col>
                        <Col xs={24} sm={12}>
                          <StatisticWithText
                            title="ค่าเฉลี่ยของโรงเรียน"
                            value={`${
                              schoolRanking.loading
                                ? 0
                                : schoolRanking.statistics.total.metrics.percentage.toFixed(
                                    2
                                  ) ?? 0
                            }%`}
                            color="#72cb7e"
                            height="110px"
                          />
                        </Col>
                        <Col xs={24} sm={12}>
                          <StatisticWithText
                            title="โรงเรียนในเครือทั้งหมด"
                            value={
                              schoolRanking.loading
                                ? 0
                                : schoolRanking?.totalSchoolAffiliation[0]
                                    .totalSchool ?? 0
                            }
                            suffix="โรงเรียน"
                            color="#000000"
                            height="110px"
                          />
                        </Col>
                        <Col xs={24} sm={12}>
                          <StatisticWithText
                            title="ค่าเฉลี่ยของโรงเรียนทั้งหมดในระบบ"
                            value={`${
                              schoolRanking?.totalStat?.totalPercentage.toFixed(
                                2
                              ) ?? 0
                            }%`}
                            color="#000000"
                            height="110px"
                          />
                        </Col>
                      </Row>
                    </Box>
                  </CardWithTitle>
                </Box>
              </Col>
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
            </Row>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
