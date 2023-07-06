import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Divider,
  Progress,
  Row,
  Col,
  Box,
  Button,
  PageHeader,
} from "../../../core/components";
import {
  VerticalBarChartJs,
  LineChartJs,
  AvatarWithProgress,
  DropdownForm,
  ScoreTotal,
  CardWithTitle,
  AvatarWithProfile,
} from "../../../components/Statistics";
import {
  BarChartOutlined,
  DotChartOutlined,
  UserOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

export default function TeacherDetail() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  //let { name } = useParams();
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let name = params.get("name");

  const parent = useRef(Parent);

  return (
    <Parent ref={parent}>
      <Header onMenuClick={() => parent.current?.toggleMenu()} title={name} />

      <Box>
        <Card>
          <Box>
            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title="ย้อนกลับ"
              extra={[
                <Button key="1" type="primary">
                  แก้ไขข้อมูลครู <UnorderedListOutlined />
                </Button>,
              ]}
            ></PageHeader>
          </Box>

          <Box mt="2">
            <AvatarWithProfile name={name} email="" phone="" line="" />
          </Box>

          <Box mt="2">
            <Row gutter={[8, 8]} type="flex">
              <Col xs={24} sm={24} md={16} lg={18}>
                <CardWithTitle
                  title="กราฟการใช้งานเฉลี่ยประจำสัปดาห์"
                  icon={<LineChartOutlined />}
                >
                  <Row gutter={[8, 8]} justify="end" type="flex">
                    <Col sm={24} md={12} lg={7}>
                      <ScoreTotal
                        name="ค่าเฉลี่ยการใช้งานของครูทั้งหมด"
                        color="#ff7875"
                        fontSize="14px"
                        size={15}
                      />
                    </Col>
                    <Col sm={24} md={12} lg={7}>
                      <ScoreTotal
                        name="ค่าเฉลี่ยการใช้งานของครูทั้งหมด"
                        color="#1c4e91"
                        fontSize="14px"
                        size={15}
                      />
                    </Col>
                  </Row>

                  <Box mt="3">
                    <Row gutter={[8, 8]} justify="end" type="flex">
                      <Col xs={24} sm={24} md={12} lg={7}>
                        <DropdownForm
                          title="แสดงโดย"
                          titlespan={7}
                          placeholder="ภายในสัปดาห์นี้"
                          dropdownspan={16}
                        />
                      </Col>
                    </Row>
                  </Box>

                  <Box mt="3">
                    <LineChartJs
                      datasets={[
                        {
                          label: "2. ค่าเฉลี่ยการใช้งานของครูทั้งหมด",
                          data: [1.2, 3.2, 1.8, 2.2, 4.7, 1.3, 3.6],
                          borderColor: "#1c4e91",
                          backgroundColor: "#1c4e91",
                        },
                        {
                          label: "1. ค่าเฉลี่ยการใช้งานของครูทั้งหมด",
                          data: [2.2, 1.2, 4.8, 3.2, 3.7, 2.3, 1.6],
                          borderColor: "#ff7875",
                          backgroundColor: "#ff7875",
                        },
                      ]}
                      height={100}
                    />
                  </Box>
                </CardWithTitle>
              </Col>
              <Col xs={24} sm={24} md={8} lg={6}>
                <CardWithTitle
                  title="สถิติและค่าเฉลี่ยในการใช้ระบบ"
                  icon={<AreaChartOutlined />}
                >
                  <Row gutter={[8, 8]} type="flex">
                    <Col span={24}>
                      <Box mt="3">
                        <AvatarWithProgress
                          color="#1c4e91"
                          icon={<UserOutlined />}
                          title="เวลาใช้งานมากที่สุด : 5.3 ชม."
                          value={89}
                        />
                      </Box>
                    </Col>
                    <Col span={24}>
                      <Box mt="3">
                        <AvatarWithProgress
                          color="#e29909"
                          icon={<UserOutlined />}
                          title="เวลาใช้งานน้อยที่สุด : 1.2 ชม."
                          value={45}
                        />
                      </Box>
                    </Col>
                    <Col span={24}>
                      <Box mt="3" mb="3">
                        <AvatarWithProgress
                          color="#5097d8"
                          icon={<UserOutlined />}
                          title="เวลาใช้งานเฉลี่ย : 4.2 ชม."
                          value={35}
                        />
                      </Box>
                    </Col>
                    <Col span={24}>
                      <Divider className="mt-0" />
                      <Box mb="3">
                        <AvatarWithProgress
                          color="#8a8686"
                          icon={<UserOutlined />}
                          title="ค่าเฉลี่ยจากครูทั้งหมด : 3.2 ชม."
                          value={67}
                        />
                      </Box>
                    </Col>
                  </Row>
                </CardWithTitle>
              </Col>
              <Col xs={24} sm={24} md={8} lg={6}>
                <CardWithTitle
                  title="คะแนนเฉลี่ยโดยรวมของแต่ละห้อง"
                  icon={<DotChartOutlined />}
                >
                  <Box>
                    <DropdownForm
                      title="ระดับชั้น"
                      titlespan={6}
                      placeholder="ป.6/6"
                      dropdownspan={7}
                    />
                  </Box>

                  <Box mt="4">
                    <Row justify="center" type="flex">
                      <Col
                        xs={24}
                        sm={24}
                        md={11}
                        lg={11}
                        className="text-center"
                      >
                        <Progress
                          type="circle"
                          percent={1.72}
                          format={(percent) => `${percent} ซม.`}
                          strokeColor="#1c4e91"
                          strokeWidth="15"
                        />
                      </Col>
                    </Row>
                  </Box>

                  <Box mt="4" mb="3">
                    <Row gutter={[8, 8]} justify="end" type="flex">
                      <Col span={24}>
                        <ScoreTotal
                          name="คะแนนเฉลี่ย 240.23"
                          color="#1c4e91"
                          fontSize="14px"
                          size={15}
                        />
                      </Col>
                      <Col span={24}>
                        <ScoreTotal
                          name="คะแนนเต็ม 300"
                          color="#908f8f"
                          fontSize="14px"
                          size={15}
                        />
                      </Col>
                    </Row>
                  </Box>
                </CardWithTitle>
              </Col>
              <Col xs={24} sm={24} md={16} lg={18}>
                <CardWithTitle
                  title="ภาพรวมการบ้านทั้งหมด"
                  icon={<BarChartOutlined />}
                >
                  <Row gutter={[8, 8]} type="flex">
                    <Col xs={24} sm={8}>
                      <Box>
                        <DropdownForm
                          title="ภาพรวมของนักเรียนระดับชั้น"
                          titlespan={17}
                          placeholder="ป.6/2"
                          dropdownspan={4}
                        />
                      </Box>
                    </Col>
                    <Col
                      xs={{ span: 24, offset: 0 }}
                      sm={{ span: 8, offset: 8 }}
                    >
                      <p className="text-center">
                        จำนวนนักเรียนทั้งหมด :<b className="text-primary">54</b>{" "}
                        คน
                      </p>
                    </Col>
                  </Row>

                  <Box mt="2">
                    <VerticalBarChartJs
                      height={50}
                      width={300}
                      labels={[
                        "แบบฝึกหัดที่ 1",
                        "แบบฝึกหัดที่ 2",
                        "แบบฝึกหัดที่ 3",
                        "แบบฝึกหัดที่ 4",
                        "แบบฝึกหัดที่ 5",
                      ]}
                      yMax={80}
                      yStepSize={10}
                      yText="-- จำนวนคนส่ง --"
                      xText="-- การบ้าน --"
                      suffix=""
                    />
                  </Box>
                </CardWithTitle>
              </Col>
            </Row>
          </Box>
        </Card>
      </Box>
    </Parent>
  );
}
