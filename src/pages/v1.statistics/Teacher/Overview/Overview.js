import "./Overview.css";
import React, { useRef } from "react";
import { Card, Progress, Row, Col, Box } from "../../../../core/components";
import {
  LineChartJs,
  StatisticWithTextLarge,
  StatisticWithIconLarge,
  DropdownForm,
  StatisticWithText,
  ScoreTotal,
  CardWithTitle,
} from "../../../../components/Statistics";
import {
  FileProtectOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  DashboardFilled,
} from "@ant-design/icons";
import Parent from "../../../../components/Parent";
import Header from "../../../students.ts.v1/Header";

export default function Overview(props) {
  const parent = useRef(Parent);

  //gets chosen school id from param in url (passed by esaProgressOverview page)
  const chosenSchoolDataID = props.match.params.schoolId;
  const onClick = () => {
    console.log(chosenSchoolDataID);
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="ภาพรวมครู"
      />
      <Box>
        <Card>
          <Row gutter={[8, 8]} type="flex">
            <Col xs={24} sm={6} md={5} lg={5}>
              <Box>
                {/* <p onClick={onClick}>test</p> */}
                <StatisticWithIconLarge
                  className="Overview-StatisticWithIcon"
                  title="ครูในหมวดทั้งหมด"
                  value="9"
                  suffix="คน"
                  iconSize="120px"
                  height="247px"
                />
              </Box>
            </Col>
            <Col xs={24} sm={18} md={9} lg={9}>
              <Box>
                <CardWithTitle
                  title="เวลาเฉลี่ยการใช้งานของครูทั้งหมด"
                  icon={
                    <DashboardFilled
                      style={{ fontSize: "30px", color: "#1c4e91" }}
                    />
                  }
                >
                  <Row gutter={[8, 8]} type="flex">
                    <Col span={12}>
                      <Box mt="3" mb="3">
                        <Row justify="center" type="flex">
                          <Col span={14}>
                            <Progress
                              type="circle"
                              percent={1.72}
                              format={(percent) => `${percent} ซม.`}
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
                                name="เวลาใช้งานเฉลี่ย 1.75 ชม."
                                color="#1c4e91"
                                size={20}
                                fontSize={14}
                              />
                            </Col>
                            <Col span={24}>
                              <ScoreTotal
                                name="จากเวลาใช้งานสูงสุด 4.2 ชม."
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
                  title="เวลาเฉลี่ยการใช้งานของครูที่มากที่สุดและน้อยที่สุด"
                  icon={
                    <ClockCircleOutlined
                      style={{ fontSize: "30px", color: "#1c4e91" }}
                    />
                  }
                >
                  <Box>
                    <Row gutter={[8, 8]} type="flex">
                      <Col xs={24} sm={12}>
                        <StatisticWithTextLarge
                          title="เวลาที่ครูใช้ระบบน้อยที่สุด"
                          value="0.2"
                          precision={1}
                          suffix="ชม."
                          valueSize="48px"
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <StatisticWithTextLarge
                          title="เวลาที่ครูใช้ระบบมากที่สุด"
                          value="4.7"
                          precision={1}
                          suffix="ชม."
                          valueSize="48px"
                        />
                      </Col>
                    </Row>
                  </Box>
                </CardWithTitle>
              </Box>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14}>
              <Box>
                <CardWithTitle
                  title="กราฟใช้งานเฉลี่ยครูประจำสัปดาห์"
                  icon={
                    <LineChartOutlined
                      style={{ fontSize: "30px", color: "#1c4e91" }}
                    />
                  }
                  extra={
                    <DropdownForm
                      title="แสดงโดย"
                      placeholder="ภายในสัปดาห์นี้"
                      titlespan={8}
                      dropdownspan={16}
                    />
                  }
                >
                  <Box mt="2">
                    <LineChartJs />
                  </Box>
                </CardWithTitle>
              </Box>
            </Col>
            <Col xs={24} sm={24} md={10} lg={10}>
              <CardWithTitle
                title="คะแนนรวมที่สูงที่สุดที่ต่ำที่สุดระหว่างชั้นเรียน"
                icon={
                  <FileProtectOutlined
                    style={{ fontSize: "30px", color: "#1c4e91" }}
                  />
                }
              >
                <Box>
                  <DropdownForm
                    title="แสดงสถิติของห้อง"
                    placeholder="ป.6/6"
                    titlespan={7}
                    dropdownspan={4}
                  />
                </Box>
                <Box mt="3">
                  <Row gutter={[8, 8]} type="flex">
                    <Col xs={24} sm={12} lg={8}>
                      <StatisticWithText
                        title="คะแนนที่ต่ำที่สุด"
                        value="34"
                        suffix="คะแนน"
                      />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                      <StatisticWithText
                        title="คะแนนเฉลี่ย"
                        value="125.5"
                        suffix="คะแนน"
                      />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                      <StatisticWithText
                        title="คะแนนที่สูงที่สุด"
                        value="250"
                        suffix="คะแนน"
                      />
                    </Col>
                  </Row>
                </Box>
              </CardWithTitle>
            </Col>
          </Row>
        </Card>
      </Box>
    </Parent>
  );
}
