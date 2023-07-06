import React, { useRef, useState, useEffect, createRef } from "react";
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
import { Form, Checkbox, Select, Spin, message } from "antd";
import { Link, useHistory, useParams } from "react-router-dom";

import { ArrowLeftOutlined } from '@ant-design/icons';

import { AddressService } from "../../services/Address";
import { SchoolService } from "../../services/School";
import { AffiliateService } from "../../services/Affiliate";

import { ESAs } from "./ESAs"

export default function SchoolEdit() {
  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });
  
  const parent = useRef(Parent);
  const history = useHistory();
  const { id } = useParams();

  const [affiliates, setAffiliates] = useState({
    loading: true,
    data: {},
  });

  const [regions, setRegions] = useState({
    loading: true,
    data: {},
  });

  const [school, setSchool] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    AffiliateService.getAllAffiliations().then(setAffiliates);
    AddressService.getAllRegionName().then(setRegions);
  }, [id]);

  useEffect(() => {
    if (!affiliates.data && !regions.data) {
      SchoolService.getSchoolProfileBySchoolId(id).then(setSchool);
    }
  }, [affiliates, regions])

  const CustomForm = ({ form }) => {
    useEffect(() => {
      if (school?.addresses?.[0].zipPost) {
        handleZipPost(school?.addresses?.[0].zipPost)
      }
    }, [school])
    function groupBy(arr) {
      return arr.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
    }

    const [addresses, setAddresses] = useState({
      loading: true,
      data: {},
    });

    const { getFieldDecorator, validateFields, resetFields } = form;

    function isGradeActive(arr, value) {
      return arr.indexOf(value) !== -1;
    }

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          setLoading(true);

          var data = {
            schoolId: id,
            schoolCode: values.schoolCode,
            addresses: [
              {
                country: "ไทย",
                district: values.district,
                geoPoint: {
                  latitude: values.latitude || null,
                  longitude: values.longitude || null,
                },
                number: values.addresse1,
                province: values.province,
                region: values.region,
                subDistrict: values.subDistrict,
                zipPost: values.zipPost,
              },
            ],
            affiliation: values.affiliation,
            gradeLevelIsActive: {
              kindergarten1: isGradeActive(
                values.gradeLevelIsActives,
                "kindergarten1"
              ),
              kindergarten2: isGradeActive(
                values.gradeLevelIsActives,
                "kindergarten2"
              ),
              kindergarten3: isGradeActive(
                values.gradeLevelIsActives,
                "kindergarten3"
              ),
              grade1: isGradeActive(values.gradeLevelIsActives, "grade1"),
              grade2: isGradeActive(values.gradeLevelIsActives, "grade2"),
              grade3: isGradeActive(values.gradeLevelIsActives, "grade3"),
              grade4: isGradeActive(values.gradeLevelIsActives, "grade4"),
              grade5: isGradeActive(values.gradeLevelIsActives, "grade5"),
              grade6: isGradeActive(values.gradeLevelIsActives, "grade6"),
              grade7: isGradeActive(values.gradeLevelIsActives, "grade7"),
              grade8: isGradeActive(values.gradeLevelIsActives, "grade8"),
              grade9: isGradeActive(values.gradeLevelIsActives, "grade9"),
              grade10: isGradeActive(values.gradeLevelIsActives, "grade10"),
              grade11: isGradeActive(values.gradeLevelIsActives, "grade11"),
              grade12: isGradeActive(values.gradeLevelIsActives, "grade12"),
            },
            name: {
              english: values.name.english,
              thai: values.name.thai,
            },
            schoolDirector: {
              name: values.schoolDirector.name,
            },
            website: values.website,
            email: values.email,
            phone: values.phone,
            educationServiceArea: values.educationServiceArea,
          };
          // console.log(data);

          SchoolService.saveSchool(data)
            .then((res) => {
              message.success("บันทึกข้อมูลโรงเรียนเรียบร้อยแล้ว", 3);

              history.push("/schools");
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

    const handleReset = () => {
      resetFields("province", "region", "district", "subDistrict");
    };

    const addressInfo = (items) => {
      return addresses?.loading && addresses?.data == null ? (
        <Spin />
      ) : (
        <Select
          onChange={(group) => { }}
          placeholder="-- เลือก --"
        >
          {addresses?.loading
            ? ""
            : groupBy(items).map((x) => {
              return (
                <Select.Option key={x} value={x}>
                  {x}
                </Select.Option>
              );
            })}
        </Select>
      );
    };

    const handleZipPost = (zipPost) => {
      const throwError = (e) => {
        message.error(
          `ไม่พบข้อมูลที่อยู่ตามรหัสไปรษณีย์ ${zipPost}`
        );
        setAddresses({
          loading: true,
          data: {},
        });

        handleReset();
      };
      if (zipPost && zipPost.length === 5) {
        setAddresses({
          loading: true,
          data: null,
        });
        AddressService.getAddressByZipcode(zipPost)
          .then((response) => {
            if (response.length === 0) {
              throwError(response);

              return [];
            }

            return response;
          })
          .then(setAddresses)
          .catch((err) => {
            throwError(err);
          });
      }
    }

    const grades = [
      {
        text: "ประถมศึกษาปีที่ 1",
        value: "grade1",
      },
      {
        text: "มัธยมศึกษาปีที่ 1",
        value: "grade7",
      },
      {
        text: "ประถมศึกษาปีที่ 2",
        value: "grade2",
      },
      {
        text: "มัธยมศึกษาปีที่ 2",
        value: "grade8",
      },
      {
        text: "ประถมศึกษาปีที่ 3",
        value: "grade3",
      },
      {
        text: "มัธยมศึกษาปีที่ 3",
        value: "grade9",
      },
      {
        text: "ประถมศึกษาปีที่ 4",
        value: "grade4",
      },
      {
        text: "มัธยมศึกษาปีที่ 4",
        value: "grade10",
      },
      {
        text: "ประถมศึกษาปีที่ 5",
        value: "grade5",
      },
      {
        text: "มัธยมศึกษาปีที่ 5",
        value: "grade11",
      },
      {
        text: "ประถมศึกษาปีที่ 6",
        value: "grade6",
      },
      {
        text: "มัธยมศึกษาปีที่ 6",
        value: "grade12",
      },
    ];

    const kindergartens = [
      {
        text: "อนุบาล 1",
        value: "kindergarten1",
      },
      {
        text: "อนุบาล 2",
        value: "kindergarten2",
      },
      {
        text: "อนุบาล 3",
        value: "kindergarten3",
      },
    ];

    //Search feature for เขตพื้นที่การศึกษา
    function onChange(value) {
      console.log(`selected ${value}`);
    }
    
    function onBlur() {
      console.log("blur");
    }
    
    function onFocus() {
      console.log("focus");
    }
    
    function onSearch(val) {
      console.log("search:", val);
    }

    return (
      <Form onSubmit={handleSubmit}>
        <Row gutter={[24, 24]} type="flex">
          <Col xs={24} md={12}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="รหัสโรงเรียน"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("schoolCode", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                      {
                        pattern: /^(?:\d*)$/,
                        message: "เฉพาะตัวเลข",
                      },
                    ],
                    initialValue: school?.schoolCode
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ชื่อโรงเรียน (ภาษาไทย)"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("name.thai", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.name?.thai
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="School Name (English)"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("name.english", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.name?.english
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="สังกัด"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("affiliation", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.affiliation?.map(a => a?.name?.thai)
                  })(
                    affiliates.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="-- เลือก --"
                      >
                        {affiliates.map((affiliate) => {
                          return (
                            <Select.Option
                              key={affiliate.affiliationsId}
                              value={affiliate.affiliationsId}
                            >
                              {affiliate.name.thai}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ที่อยู่"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("addresse1", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.addresses?.[0].number
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="รหัสไปรษณีย์"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("zipPost", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.addresses?.[0].zipPost
                  })(
                    <Input
                      maxLength={5}
                      disabled={addresses?.loading && addresses?.data == null}
                      onChange={(e) => handleZipPost(e.target.value)}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ภาค"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("region", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.addresses?.[0].region
                  })(
                    regions?.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={(group) => { }}
                        placeholder="-- เลือก --"
                      >
                        {regions.map((region) => {
                          return (
                            <Select.Option
                              key={region.name.thai}
                              value={region.name.thai}
                            >
                              {region.name.thai}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="จังหวัด"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("province", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.addresses?.[0].province
                  })(
                    addressInfo(
                      addresses?.loading
                        ? null
                        : addresses?.map((g) => g.address.province.name)
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="อำเภอ / เขต"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("district", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.addresses?.[0].district
                  })(
                    addressInfo(
                      addresses?.loading
                        ? null
                        : addresses?.map((g) => g.address.district.name)
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ตำบล / แขวง"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("subDistrict", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.addresses?.[0].subDistrict
                  })(
                    addressInfo(
                      addresses?.loading
                        ? null
                        : addresses?.map((g) => g.address.subDistrict.name)
                    )
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  label="ผู้อำนวยการ"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("schoolDirector.name", {
                    initialValue: school?.schoolDirector?.name
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  label="Website"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("website", {
                    initialValue: school?.website
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  label="Email"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                      },
                    ],
                    initialValue: school?.email
                  })(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item style={{ marginBottom: "0" }} label="โทรศัพท์">
                  {getFieldDecorator("phone", {
                    rules: [
                      {
                        pattern: /^[0-9]*$/,
                        message: "เฉพาะตัวเลข",
                      },
                    ],
                    initialValue: school?.phone
                  }
                  )(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="เขตพื้นที่การศึกษา"
                  tooltip="This is not a required field"
                >
                  {getFieldDecorator("educationServiceArea", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                    initialValue: school?.educationServiceArea
                  })(
                    <Select
                    mode="single"
                    style={{ width: "100%" }}
                    placeholder="-- เลือก --"
                    showSearch
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0
                    }
                  >
                    {ESAs.map((esa) => {
                      return (
                        <Select.Option
                          key={esa.key}
                          value={esa.value}
                        >
                          {esa.value}
                        </Select.Option>
                      );
                    })}
                  </Select>
                    )
                   }
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ระดับชั้นที่เปิดสอน"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("gradeLevelIsActives", {
                    initialValue: Object.keys(school?.gradeLevelIsActive || {})
                      .filter(g => {
                        if (school.gradeLevelIsActive[g].isActive) {
                          return g
                        }
                      }),
                  })(
                    <Checkbox.Group onChange={(e) => { }} >
                      <Row>
                        {kindergartens.map((item) => {
                          return (
                            <Col span={24} key={item.value}>
                              <Checkbox key={item.value} value={item.value} >
                                {item.text}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                      <Box mt="3">
                        <Row>
                          {grades.map((grade) => {
                            return (
                              <Col span={12} key={grade.value}>
                                <Checkbox key={grade.value} value={grade.value}>
                                  {grade.text}
                                </Checkbox>
                              </Col>
                            );
                          })}
                        </Row>
                      </Box>
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item style={{ marginBottom: "0" }} label="Latitude">
                  {getFieldDecorator("latitude", {
                    rules: [
                      {
                        pattern: /^[0-9]*\.?[0-9]*$/,
                        message: "เฉพาะตัวเลข",
                      },
                    ],
                    initialValue: school?.addresses?.[0].geoPoint._latitude
                  }
                  )(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item style={{ marginBottom: "0" }} label="Longitude">
                  {getFieldDecorator("longitude", {
                    rules: [
                      {
                        pattern: /^[0-9]*\.?[0-9]*$/,
                        message: "เฉพาะตัวเลข",
                      },
                    ],
                    initialValue: school?.addresses?.[0].geoPoint._longitude
                  }
                  )(
                    school.loading ? (
                      <Spin />
                    ) : (
                      <Input />
                    )
                  )}
                </Form.Item>
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
            <Link
              to="/schools"
              style={{ margin: "0 5px", width: "100%" }}
              disabled={loading}
            >
              <Button style={{ margin: "0 5px", width: "100%" }}>ยกเลิก</Button>
            </Link>

            <Button
              style={{ margin: "0 5px", width: "100%" }}
              onClick={() => { }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              บันทึกโรงเรียน
            </Button>
          </Col>

        </Row>
        <Form.Item></Form.Item>
      </Form>
    );
  };

  const onFieldsChange = (_, changedFiels) => {
    const { } = changedFiels;
  };

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
        title="แก้ไขข้อมูลโรงเรียน"
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
