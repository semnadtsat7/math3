import React, { useRef, useState, useEffect } from "react";
import Parent from "../../components/Parent";
import Header from "../students.ts.v1/Header";
import { Col, Row, Card, Box, Button, Input } from "../../core/components";
import { Form, Select, Spin, message, Checkbox } from "antd";
import { Link, useHistory, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import {
  PositionService,
  RoleService,
  UserService,
  PermissionService,
} from "../../services/User";

import { SchoolService } from "../../services/School";
import { AffiliateService } from "../../services/Affiliate";
import { AddressService } from "../../services/Address";

import * as districtInspectData from "./districtInspectData.json";
import * as esaData from "./esaData.json";

export default function UserEdit(props) {
  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });

  const parent = useRef(Parent);
  const history = useHistory();
  const { id } = useParams();
  const [permissionName, setPermissionName] = useState("");

  const {} = props;

  //data เขตตรวจ 1 - 18
  const [districtInspector, setDistrictInspector] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setDistrictInspector(districtInspectData.default.districtInspector);
  }, []);

  //data เขตพื้นที่
  const [esa, setESA] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setESA(esaData.default.esa);
  }, []);

  const [user, setUser] = useState({
    loading: true,
    data: {},
  });

  const [positions, setPositions] = useState({
    loading: true,
    data: {},
  });

  const [permissions, setPermissions] = useState({
    loading: true,
    data: {},
  });

  const [roles, setRoles] = useState({
    loading: true,
    data: {},
  });

  const [allSchools, setAllSchools] = useState({
    loading: true,
    data: {},
  });

  const [affiliates, setAffiliates] = useState({
    loading: true,
    data: {},
  });

  const [provinces, setProvinces] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    UserService.getUserByUserId(id).then(setUser);
  }, [id]);

  useEffect(() => {
    PositionService.getAllPositions().then(setPositions);
    RoleService.getAllRoles().then(setRoles);
    PermissionService.getPermissionsName(id).then(setPermissions);
    SchoolService.getAllSchools().then(setAllSchools);
    AffiliateService.getAllAffiliations().then(setAffiliates);
    AddressService.getAllProvince().then(setProvinces);
  }, [id]);

  const CustomForm = ({ form }) => {
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } =
      form;
    const [loading, setLoading] = useState(false);
    const [_fields, setFields] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          setLoading(true);

          const tmp_result = {};
          let tmp_name = "";
          Object.entries(values.permissions).forEach((value, i) => {
            value.forEach(function (obj1, index, items) {
              if (Array.isArray(obj1)) {
                items[index] = obj1.reduce(function (obj, v) {
                  obj[v] = true;
                  return obj;
                }, {});

                tmp_result[tmp_name] = items[index];
              } else {
                tmp_name = obj1;
              }
            });
          });

          Object.keys(tmp_result).forEach((value) => {
            if (!tmp_result[value].create) tmp_result[value].create = false;
            if (!tmp_result[value].edit) tmp_result[value].edit = false;
            if (!tmp_result[value].view) tmp_result[value].view = false;
          });

          values.permissionId = getFieldValue("rawPermissionId");
          values.permissions = tmp_result;

          values.userId = id;

          UserService.saveUserProfile(values)
            .then((res) => {
              message.success("บันทึกข้อมูลโปรไฟล์เรียบร้อย", 3);

              history.push("/users");
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

    const _initialValues = {
      options: [
        {
          label: "ดูข้อมูล",
          value: "view",
          checked: false,
        },
        {
          label: "เพิ่มข้อมูล",
          value: "create",
          checked: false,
        },
        {
          label: "แก้ไขข้อมูล",
          value: "edit",
          checked: false,
        },
      ],
      type: getFieldValue("permissionId") ?? "default",
    };

    //Search feature for โรงเรียน
    // function onChange(value) {
    //   console.log(`selected ${value}`);
    // }

    function onBlur() {
      console.log("blur");
    }

    function onFocus() {
      console.log("focus");
    }

    function onSearch(val) {
      console.log("search:", val);
    }

    const onClick = () => {
      console.log(user);
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                {/* <div onClick={onClick}>test</div> */}
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="คำนำหน้า"
                  tooltip="This is not a required field"
                >
                  {getFieldDecorator("prefix", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    <Select placeholder="-- เลือก --">
                      <Select.Option key={"1"} value={"นาย"}>
                        {"นาย"}
                      </Select.Option>
                      <Select.Option key={"2"} value={"นาง"}>
                        {"นาง"}
                      </Select.Option>
                      <Select.Option key={"2"} value={"นางสาว"}>
                        {"นางสาว"}
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

              {/* <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ชื่อ (ของ user ที่ใช้ในระบบเก่า)"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col> */}

              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ชื่อจริง"
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
                        required: true,
                        message: "กรุณาระบุอีเมลให้ถูกต้อง!",
                      },
                    ],
                  })(<Input disabled={true} />)}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="Role"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("roleId", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    roles?.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={(group) => {}}
                        placeholder="-- เลือก --"
                      >
                        {roles.map((role) => {
                          return (
                            <Select.Option key={role.id} value={role.id}>
                              {role.name ?? "N/A"}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <br />
                <hr />
                <br />
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ระดับ"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("permissionId", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    permissions?.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={(group) => {
                          _fields.permissionId = group;
                          setFields(_fields);
                        }}
                        placeholder="-- เลือก --"
                      >
                        {permissions.map((permission) => {
                          return (
                            <Select.Option
                              key={permission.type}
                              value={permission.type}
                            >
                              {permission?.name ?? "N/A"}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                {_fields.permissionId == "schools" && (
                  <Form.Item
                    style={{ marginBottom: "0" }}
                    label="โรงเรียน"
                    required
                    tooltip="This is a required field"
                  >
                    {getFieldDecorator("schoolId", {
                      rules: [
                        {
                          required: true,
                          message: "กรุณาระบุข้อมูล!",
                        },
                      ],
                    })(
                      allSchools?.loading ? (
                        <Spin />
                      ) : (
                        <Select
                          onChange={(group) => {}}
                          placeholder="-- เลือก --"
                          showSearch
                          optionFilterProp="children"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) === 0
                          }
                        >
                          {allSchools.map((school) => {
                            return (
                              <Select.Option
                                key={school.schoolId}
                                value={school.schoolId}
                              >
                                {school.name.thai ?? "N/A"}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )
                    )}
                  </Form.Item>
                )}
              </Col>
              {/* <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                {_fields.permissionId == "affiliations" && (
                  <Form.Item
                    style={{ marginBottom: "0" }}
                    label="เครือ"
                    required
                    tooltip="This is a required field"
                  >
                    {getFieldDecorator("affiliationId", {
                      rules: [
                        {
                          required: true,
                          message: "กรุณาระบุข้อมูล!",
                        },
                      ],
                    })(
                      affiliates?.loading ? (
                        <Spin />
                      ) : (
                        <Select
                          onChange={(group) => {}}
                          placeholder="-- เลือก --"
                        >
                          {affiliates.map((affiliate) => {
                            return (
                              <Select.Option
                                key={affiliate.affiliationsId}
                                value={affiliate.affiliationsId}
                              >
                                {affiliate.name.thai ?? "N/A"}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )
                    )}
                  </Form.Item>
                )}
              </Col> */}
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                {_fields.permissionId == "provinces" && (
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
                    })(
                      provinces?.loading ? (
                        <Spin />
                      ) : (
                        <Select
                          onChange={(group) => {}}
                          placeholder="-- เลือก --"
                          showSearch
                          optionFilterProp="children"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) === 0
                          }
                        >
                          {provinces.map((province) => {
                            return (
                              <Select.Option
                                key={province.code}
                                value={province.code}
                              >
                                {province.name ?? "N/A"}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )
                    )}
                  </Form.Item>
                )}
              </Col>
              <Col span={24} style={{ paddingBottom: "0px" }}>
                {user?.loading ? (
                  <Spin />
                ) : (
                  (
                    user.permissions ?? [
                      {
                        type: getFieldValue("permissionId") ?? "default",
                      },
                    ]
                  ).map((permission) => {
                    user.permissions.forEach((item) => {
                      for (const property in item) {
                        if (typeof item[property] == "boolean") {
                          _initialValues.options.forEach((rawItem) => {
                            item.options = item.options ?? [];

                            const _option = {
                              ...rawItem,
                            };

                            if (
                              item.options.filter(
                                (x) => x.value === _option.value
                              ).length === 0
                            ) {
                              item.options.push(_option);
                            }
                          });
                        }
                      }
                    });

                    user.permissions.forEach((item) => {
                      for (const property in item) {
                        if (
                          typeof item[property] == "boolean" &&
                          item[property] === true
                        ) {
                          item.options
                            .filter((x) => x.value === property)
                            .forEach((x, i, arr) => {
                              arr[i].checked = true;
                            });
                        }
                      }
                    });

                    const options = user.permissions
                      .filter((x) => x.type === permission.type)
                      .map((x) => x.options)[0];

                    const values =
                      options.length > 0
                        ? options.filter((x) => x.checked).map((x) => x.value)
                        : [];

                    return (
                      <Form.Item
                        label={`การอนุญาต (${permission.name})`}
                        required
                        key={permission.type}
                        style={{
                          display:
                            permission.type === getFieldValue("permissionId")
                              ? "block"
                              : "none",
                          marginBottom: "0px",
                        }}
                      >
                        {getFieldDecorator(`permissions.${permission.type}`, {
                          initialValue: values,
                        })(
                          <Checkbox.Group>
                            <Row>
                              {options.map((item) => (
                                <Col span={24} key={item.value}>
                                  <Checkbox key={item.value} value={item.value}>
                                    {item.label}
                                  </Checkbox>
                                </Col>
                              ))}
                            </Row>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                    );
                  })
                )}
              </Col>
              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="ตำแหน่ง"
                  required
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("positionId", {
                    rules: [
                      {
                        required: true,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    positions?.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={(group) => {}}
                        placeholder="-- เลือก --"
                      >
                        {positions.map((position) => {
                          return (
                            <Select.Option
                              key={position.id}
                              value={position.id}
                            >
                              {position?.name?.thai ?? "N/A"}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>

              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="สังกัด"
                  //required
                  //tooltip="This is a required field"
                >
                  {getFieldDecorator("affiliationName", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    affiliates?.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={(group) => {}}
                        placeholder="-- เลือก --"
                      >
                        {affiliates.map((affiliate) => {
                          return (
                            <Select.Option
                              key={affiliate.name.thai}
                              value={affiliate.name.thai}
                            >
                              {affiliate.name.thai ?? "N/A"}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>

              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                <Form.Item
                  style={{ marginBottom: "0" }}
                  label="เขตตรวจ (เฉพาะตำแหน่งเขตตรวจ)"
                  tooltip="This is not a required field"
                >
                  {getFieldDecorator("districtInspector", {
                    rules: [
                      {
                        required: false,
                        message: "กรุณาระบุข้อมูล!",
                      },
                    ],
                  })(
                    districtInspector?.loading ? (
                      <Spin />
                    ) : (
                      <Select placeholder="-- เลือก --">
                        {districtInspector.map((item) => {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item.name ?? "N/A"}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )
                  )}
                </Form.Item>
              </Col>

              <Col span={24} style={{ paddingBottom: "0", paddingTop: "0" }}>
                {
                  <Form.Item
                    style={{ marginBottom: "0" }}
                    label="เขตพื้นที่การศึกษา (เฉพาะตำแหน่งระดับเขตพื้นที่การศึกษา)"
                    tooltip="This is not a required field"
                  >
                    {getFieldDecorator("educationServiceArea", {
                      rules: [
                        {
                          required: false,
                          message: "กรุณาระบุข้อมูล!",
                        },
                      ],
                    })(
                      esa?.loading ? (
                        <Spin />
                      ) : (
                        <Select
                          placeholder="-- เลือก --"
                          showSearch
                          optionFilterProp="children"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) === 0
                          }
                        >
                          {esa.map((esa) => {
                            return (
                              <Select.Option key={esa.name} value={esa.name}>
                                {esa.name ?? "N/A"}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )
                    )}
                  </Form.Item>
                }
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
            <Link to="/users" style={{ margin: "0 5px", width: "100%" }}>
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
      // const _name = Form.createFormField({
      //   ..._props.name,
      //   value: _props.name?.trim(),
      // });

      const _firstName = Form.createFormField({
        ..._props.firstName,
        value: _props.firstName?.trim(),
      });

      const _lastName = Form.createFormField({
        ..._props.lastName,
        value: _props.lastName?.trim(),
      });

      const _email = Form.createFormField({
        ..._props.email,
        value: _props.email?.trim(),
      });

      const _permissions = Form.createFormField({
        ..._props.permissions,
        value: _props.permissions,
      });

      const _positions = Form.createFormField({
        ..._props.positions,
        value: _props.positions,
      });

      const _provinceId = Form.createFormField({
        ..._props.provinceId,
        value: _props.provinceId,
      });

      const _roles = Form.createFormField({
        ..._props.roles,
        value: _props.roles,
      });

      const _rolesId = Form.createFormField({
        ..._props.rolesId,
        value: _props.rolesId,
      });

      const _schoolId = Form.createFormField({
        ..._props.schoolId,
        value: _props.schoolId,
      });

      const _districtInspector = Form.createFormField({
        ..._props.districtInspector,
        value: _props.districtInspector,
      });

      const _educationServiceArea = Form.createFormField({
        ..._props.educationServiceArea,
        value: _props.educationServiceArea,
      });

      const _affiliationName = Form.createFormField({
        ..._props.affiliationName,
        value: _props.affiliationName,
      });

      const _uid = Form.createFormField({
        ..._props.schoolId,
        value: _props.schoolId,
      });

      let _fields = {
        loading: Form.createFormField({
          ..._props.loading,
          value: _props.loading,
        }),
        firstName: _firstName,
        lastName: _lastName,
        positions: _positions,
        provinceId: _provinceId,
        roles: _roles,
        schoolId: _schoolId,
        districtInspector: _districtInspector,
        educationServiceArea: _educationServiceArea,
        affiliationName: _affiliationName,
        uid: _uid,
        rawPermissionId: Form.createFormField({
          ..._props.permissionId,
          value: _props.permissionId,
        }),
      };

      if (_props.permissions) {
        _fields.permissions = _permissions;
      }

      // if (_props.name) {
      //   _fields.name = _name;
      // }

      if (_props.firstName) {
        _fields.firstName = _firstName;
      }

      if (_props.lastName) {
        _fields.lastName = _lastName;
      }

      if (_props.email) {
        _fields.email = _email;
      }

      if (_props.rolesId) {
        _fields.roleId = _rolesId;
      }

      if (_props.positionsId) {
        _fields.positionId = Form.createFormField({
          ..._props.positionsId,
          value: _props.positionsId,
        });
      }

      if (_props.districtInspector) {
        _fields.districtInspector = _districtInspector;
      }

      if (_props.educationServiceArea) {
        _fields.educationServiceArea = _educationServiceArea;
      }

      if (_props.affiliationName) {
        _fields.affiliationName = _affiliationName;
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
        title={user?.loading ? <Spin /> : user.name}
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
