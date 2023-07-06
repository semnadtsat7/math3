import React from "react";

import "./AvatarWithProfile.css";
import {} from "react-router-dom";
import {
  Menu,
  Button,
  Dropdown,
  Divider,
  Progress,
  Col,
  Row,
  Avatar,
  Box,
  Card,
} from "../../../../core/components";
import { CaretDownFilled } from "@ant-design/icons";

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

export function AvatarWithProfile(props) {
  const { name, email, phone, line, classroom, students, image } = props;

  return (
    <Card>
      <Row>
        <Col xs={24} sm={24} md={8} lg={5} className="text-center">
          <Avatar
            style={{ width: 180, height: 180 }}
            src= {image ||"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" }
          />

          {/* <Box mt="1" p="3">
            <p className="mb-0">ความสนใจในการใช้งานโปรแกรม</p>
            <Row gutter={[8, 8]} justify="center">
              <Col xs={24} sm={12} md={24}>
                <Progress
                  percent={85}
                  strokeColor={{
                    "0%": "#dd6768",
                    "50%": "#f9b87d",
                    "100%": "#97e145",
                  }}
                />
              </Col>
            </Row>
            <div className="AvatarWithProfile-Text-Secondary">
              <p className="mb-0">(เทียบจากค่าเฉลี่ย 5.2 ชั่วโมง)</p>
            </div>
          </Box> */}
        </Col>
        <Col
          xs={24}
          sm={24}
          md={16}
          lg={19}
          className="AvatarWithProfile-Information"
        >
          <Box pt="3">
            <h1>{name}</h1>
            <Row gutter={[0, 0]}>
              <Col md={10} lg={7}>
                <p>Email: {email}</p>
              </Col>
              <Col md={14} lg={17}>
                <p>Phone: {phone}</p>
              </Col>
              <Col xs={24}>
                <p>Line: {line}</p>
              </Col>
            </Row>
          </Box>

          <Divider />

          <Box mt="3">
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card className="AvatarWithProfile-Statistic-Card">
                  <h4>ระดับชั้นที่รับผิดชอบ</h4>
                  <p>{classroom}</p>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={13} lg={7}>
                <Card className="AvatarWithProfile-Statistic-Card">
                  <h4>นักเรียนที่ต้องดูแล</h4>
                  <p>{students} คน</p>
                </Card>
              </Col>
              {/* <Col xs={24} sm={12} md={13} lg={7}>
                <Card className="AvatarWithProfile-Statistic-Card">
                  <Row gutter={[8, 8]} justify="center" className="text-center">
                    <Col xs={24} sm={13}>
                      <Box pt="1">นักเรียนที่ต้องดูแล</Box>
                    </Col>
                    <Col xs={24} sm={11}>
                      <Dropdown overlay={menu}>
                        <Button>
                          ทั้งหมด <CaretDownFilled />
                        </Button>
                      </Dropdown>
                    </Col>
                  </Row>
                  <p>121 คน</p>
                </Card>
              </Col> */}
            </Row>
          </Box>
        </Col>
      </Row>
    </Card>
  );
}
