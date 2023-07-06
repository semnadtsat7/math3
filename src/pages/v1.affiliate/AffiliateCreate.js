import React, { useRef, useState, useEffect } from "react";
import Parent from "../../components/Parent";
import Header from "../students.ts.v1/Header";
import {
  Menu,
  Col,
  Row,
  Card,
  Box,
  Button,
  Input,
} from "../../core/components";

import { ArrowLeftOutlined } from '@ant-design/icons';

import { Form, message, Select } from "antd";
import { Link, useHistory } from "react-router-dom";

import { AffiliateService } from "../../services/Affiliate";

export default function SchoolCreate(props) {
  const parent = useRef(Parent);
  const history = useHistory();

  const {} = props;

  const CustomForm = ({ form }) => {
    const { getFieldDecorator, validateFields } = form;
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          setLoading(true);
          const {
            nameEnglish,
            nameAbbreviationEnglish,
            nameAbbreviationThai,
            nameThai,
            type,
          } = values;

          const data = {
            name: {
              english: nameEnglish?.trim() ?? "",
              abbreviationEnglish: nameAbbreviationEnglish?.trim() ?? "",
              abbreviationThai: nameAbbreviationThai?.trim() ?? "",
              thai: nameThai?.trim() ?? "",
            },
            type: type ?? "",
          };

          AffiliateService.createAffiliation(data)
            .then((res) => {
              message.success("บันทึกข้อมูลสังกัดเรียบร้อยแล้ว", 3);

              history.push("/affiliates");
            })
            .catch((err) => {
              message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
              console.error(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} style={{ paddingBottom: "0", paddingTop: "0" }}>
            <Form.Item
              style={{ marginBottom: "0" }}
              label="ชื่อสังกัด (ภาษาไทย)"
              required
              tooltip="This is a required field"
            >
              {getFieldDecorator("nameThai", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาระบุข้อมูล!",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} style={{ paddingBottom: "0", paddingTop: "0" }}>
            <Form.Item
              style={{ marginBottom: "0" }}
              label="ตัวย่อ (ภาษาไทย)"
              required
              tooltip="This is a required field"
            >
              {getFieldDecorator("nameAbbreviationThai", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาระบุข้อมูล!",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} style={{ paddingBottom: "0", paddingTop: "0" }}>
            <Form.Item
              style={{ marginBottom: "0" }}
              label="Affiliation name (English)"
              required
              tooltip="This is a required field"
            >
              {getFieldDecorator("nameEnglish", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาระบุข้อมูล!",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} style={{ paddingBottom: "0", paddingTop: "0" }}>
            <Form.Item
              style={{ marginBottom: "0" }}
              label="Affiliation initialism (English)"
              required
              tooltip="This is a required field"
            >
              {getFieldDecorator("nameAbbreviationEnglish", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาระบุข้อมูล!",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} style={{ paddingBottom: "0", paddingTop: "0" }}>
            <Form.Item
              style={{ marginBottom: "0" }}
              label="ประเภท"
              required
              tooltip="This is a required field"
            >
              {getFieldDecorator("type", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาระบุข้อมูล!",
                  },
                ],
              })(
                <Select onChange={(group) => {}} placeholder="-- เลือก --">
                  <Select.Option key={1} value="educational-service-area">
                    educational-service-area
                  </Select.Option>
                  <Select.Option key={1} value="affiliation">
                    affiliation
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            offset={6}
            style={{
              padding: "40px 0px",
              display: "flex",
            }}
          >
            <Link
              to="/affiliates"
              style={{ margin: "0 5px", width: "100%" }}
              disabled={loading}
            >
              <Button style={{ margin: "0 5px", width: "100%" }}>ยกเลิก</Button>
            </Link>

            <Button
              style={{ margin: "0 5px", width: "100%" }}
              onClick={() => {}}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              สร้างสังกัด
            </Button>
          </Col>
          ​
        </Row>
      </Form>
    );
  };

  const onFieldsChange = (_, changedFiels) => {};

  const CreateForm = Form.create({ onFieldsChange })(CustomForm);

  return (
    <Parent ref={parent}>
      <div 
        style={{  
          backgroundColor: "#1890ff",
          height: "40px"
        }}
      >        
        <Button
          type="primary"
          onClick={history.goBack}
          style={{ height: "40px", fontSize: "13px", marginTop: "0px" }}
        >
          <ArrowLeftOutlined/>
          <span style={{ marginLeft: "30px" }}>
            ย้อนกลับ
          </span>
        </Button>
      </div>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="เพิ่มสังกัด"
      ></Header>
      <Box>
        <Card bordered={false} className="w-100 Schools-Container">
          <Box p="2">
            <CreateForm />
          </Box>
        </Card>
      </Box>
    </Parent>
  );
}
