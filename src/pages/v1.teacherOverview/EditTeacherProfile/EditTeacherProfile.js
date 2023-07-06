import React, { useRef, useState, useEffect } from "react";
import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";
import { Col, Row, Card, Box, Button, Input } from "../../../core/components";
import { Form, Select, Spin, message, Checkbox } from "antd";
import { Link, useHistory } from "react-router-dom";

import { ArrowLeftOutlined } from "@ant-design/icons";

import { UserService } from "../../../services/User";

import ProfilePicForm from "./ProfilePicForm";

export default function EditTeacherProfile() {
  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });
  
  const parent = useRef(Parent);
  const history = useHistory();
  const userId = window.localStorage.getItem("local_id");

  const [user, setUser] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    UserService.getUserInfo(userId).then(setUser);
  }, [userId]);

  const CustomForm = ({ form }) => {
    const { getFieldDecorator, validateFields } = form;
    const [loading, setLoading] = useState(false);
    const [_fields, setFields] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          setLoading(true);

          values.userId = userId;

          UserService.updateUserProfile(values)
            .then((res) => {
              message.success("บันทึกข้อมูลโปรไฟล์เรียบร้อย", 3);

              history.push("/");
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
          <Col xs={24} md={12}>
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="คำนำหน้า"
                  //required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("namePrefix", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    <Select placeholder="-- เลือก --">
                      <Select.Option value={"นาย"}>{"นาย"}</Select.Option>
                      <Select.Option value={"นาง"}>{"นาง"}</Select.Option>
                      <Select.Option value={"นางสาว"}>{"นางสาว"}</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ชื่อจริง"
                  //required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("firstName", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="นามสกุล"
                  //required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("lastName", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="Email"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        required: false,
                        message: "กรุณาระบุอีเมลให้ถูกต้อง!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="Line ID"
                  //required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("lineId", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="โทรศัพท์"
                  //required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("phoneNumber", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              {/* <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="หมวดเรียน"
                  // required
                  // tooltip="This is a required field"
                >
                  {getFieldDecorator("section", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col> */}
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "25px" }}>
                <ProfilePicForm />
              </Col>
            </Row>
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
            <Link to="/" style={{ margin: "0 5px", width: "100%" }}>
              <Button style={{ margin: "0 5px", width: "100%" }}>ยกเลิก</Button>
            </Link>

            <Button
              style={{ margin: "0 5px", width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              บันทึก
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const onFieldsChange = (_, changedFiels) => {
    const {} = changedFiels;
  };

  const CreateForm = Form.create({
    onFieldsChange,
    mapPropsToFields(_props) {
      const _namePrefix = Form.createFormField({
        ..._props.namePrefix,
        value: _props.namePrefix,
      });

      const _firstName = Form.createFormField({
        ..._props.firstName,
        value: _props.firstName,
      });

      const _lastName = Form.createFormField({
        ..._props.lastName,
        value: _props.lastName,
      });

      const _email = Form.createFormField({
        ..._props.email,
        value: _props.email,
      });

      const _lineId = Form.createFormField({
        ..._props.lineId,
        value: _props.lineId,
      });

      const _phoneNumber = Form.createFormField({
        ..._props.phoneNumber,
        value: _props.phoneNumber,
      });

      const _section = Form.createFormField({
        ..._props.section,
        value: _props.section,
      });

      let _fields = {
        loading: Form.createFormField({
          ..._props.loading,
          value: _props.loading,
        }),
      };

      if (_props.namePrefix) {
        _fields.namePrefix = _namePrefix;
      }

      if (_props.firstName) {
        _fields.firstName = _firstName;
      }

      if (_props.lastName) {
        _fields.lastName = _lastName;
      }

      if (_props.email) {
        _fields.email = _email;
      }

      if (_props.lineId) {
        _fields.lineId = _lineId;
      }

      if (_props.phoneNumber) {
        _fields.phoneNumber = _phoneNumber;
      }

      if (_props.section) {
        _fields.section = _section;
      }

      return _fields;
    },
  })(CustomForm);

  return (
    <Parent ref={parent}>
      <div
        style={{
          backgroundColor: "#1890ff",
          height: "40px",
        }}
      >
        <Button
          type="primary"
          onClick={history.goBack}
          style={{ height: "40px", fontSize: "13px", marginTop: "0px" }}
        >
          <ArrowLeftOutlined />
          <span style={{ marginLeft: "30px" }}>ย้อนกลับ</span>
        </Button>
      </div>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={
          user?.loading ? (
            <Spin />
          ) : (
            user?.namePrefix + " " + user?.firstName + " " + user?.lastName
          )
        }
      ></Header>
      <Box>
        <Card bordered={false} className="w-100 Container">
          <Box p="2">
            <CreateForm {...user} />
          </Box>
        </Card>
      </Box>
    </Parent>
  );
}
