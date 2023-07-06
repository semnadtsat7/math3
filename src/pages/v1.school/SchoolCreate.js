import React, { useRef, useState, useEffect, useCallback } from "react";
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

import { Form, Checkbox, Select, Spin, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import GoogleMapReact from "google-map-react";

import { AddressService } from "../../services/Address";
import { SchoolService } from "../../services/School";
import { AffiliateService } from "../../services/Affiliate";

import { ESAs } from "./ESAs"

export default function SchoolCreate() {
  const parent = useRef(Parent);
  const history = useHistory();

  const [affiliates, setAffiliates] = useState({
    loading: true,
    data: {},
  });

  const [regions, setRegions] = useState({
    loading: true,
    data: {},
  });

  const defaultCenter = [{
    lat: 13.736717,
    lng: 100.523186,
  }]

  const [apiReady, setApiReady] = useState(false)
  const [map, setMap] = useState()
  const [googlemaps, setGooglemaps] = useState()

  useEffect(() => {
    AffiliateService.getAllAffiliations().then(setAffiliates);
    AddressService.getAllRegionName().then(setRegions);
  }, []);

  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
    if (map && maps) {
      setApiReady(true)
      setMap(map)
      setGooglemaps(maps)
    }
  };

  const SearchBox = ({ maps, onPlacesChanged, placeholder }) => {
    const input = useRef(null);
    const searchBox = useRef(null);

    const handleOnPlacesChanged = useCallback(() => {
      if (onPlacesChanged) {
        onPlacesChanged(searchBox.current.getPlaces());
      }
    }, [onPlacesChanged, searchBox]);

    useEffect(() => {
      if (!searchBox.current && maps) {
        searchBox.current = new maps.places.SearchBox(input.current);
        searchBox.current.addListener('places_changed', handleOnPlacesChanged);
      }

      return () => {
        if (maps) {
          searchBox.current = null;
          maps.event.clearInstanceListeners(searchBox);
        }
      };
    }, [maps, handleOnPlacesChanged]);

    return <input ref={input} placeholder={placeholder} type="text" />;
  };

  // Return map bounds based on list of places
  const getMapBounds = (map, maps, places) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place) => {
      bounds.extend(new maps.LatLng(
        place.lat,
        place.lng,
      ));
    });
    return bounds;
  };

  // Re-center map when resizing the window
  const bindResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
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


  const CustomForm = ({ form }) => {
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
            schoolCode: values.schoolCode?.trim(),
            addresses: [
              {
                country: "ไทย",
                district: values.district?.trim(),
                geoPoint: {
                  latitude: values.latitude || null,
                  longitude: values.longitude || null,
                },
                number: values.addresse1?.trim(),
                province: values.province?.trim(),
                region: values.region?.trim(),
                subDistrict: values.subDistrict?.trim(),
                zipPost: values.zipPost?.trim(),
              },
            ],
            affiliation: values.affiliation,
            gradeLevelIsActive: {
              kindergarten1: isGradeActive(
                values.gradeLevelIsActives,
                "kinderGarten1"
              ),
              kindergarten2: isGradeActive(
                values.gradeLevelIsActives,
                "kinderGarten2"
              ),
              kindergarten3: isGradeActive(
                values.gradeLevelIsActives,
                "kinderGarten3"
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
              english: values.name.english?.trim(),
              thai: values.name.thai?.trim(),
            },
            schoolDirector: {
              name: values.schoolDirector.name?.trim(),
            },
            website: values.website?.trim(),
            email: values.email?.trim(),
            phone: values.phone?.trim(),
            educationServiceArea: values.educationServiceArea?.trim(),
          };

          SchoolService.createSchool(data)
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
          disabled={addresses?.loading || addresses?.length === 0}
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

    const kinderGartens = [
      {
        text: "อนุบาล 1",
        value: "kinderGarten1",
      },
      {
        text: "อนุบาล 2",
        value: "kinderGarten2",
      },
      {
        text: "อนุบาล 3",
        value: "kinderGarten3",
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
                  })(<Input />)}
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
                  })(<Input />)}
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
                  })(<Input />)}
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
                              value={affiliate.name.thai}
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
                  })(<Input />)}
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
                      {
                        pattern: /^(?:\d*)$/,
                        message: "เฉพาะตัวเลข",
                      },
                    ],
                  })(
                    <Input
                      maxLength={5}
                      disabled={addresses?.loading && addresses?.data == null}
                      onChange={(e) => {
                        const zipPost = e.target.value;
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
                      }}
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
                  })(
                    regions?.loading ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={(group) => { }}
                        placeholder="-- เลือก --"
                        disabled={addresses?.loading || addresses?.length === 0}
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
                  {getFieldDecorator("schoolDirector.name", {})(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  label="Website"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("website", {})(<Input />)}
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
                        message: "Email ไม่ถูกต้อง",
                      },
                    ],
                  })(<Input />)}
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
                  }
                  )(
                    <Input type="text" />
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
                  style={{ marginBottom: "-2px" }}
                  label="ระดับชั้นที่เปิดสอน"
                  tooltip="This is a required field"
                >
                  {getFieldDecorator("gradeLevelIsActives", {
                    initialValue: [],
                  })(
                    <Checkbox.Group onChange={(e) => { }}>
                      <Row>
                        {kinderGartens.map((item) => {
                          return (
                            <Col span={24} key={item.value}>
                              <Checkbox key={item.value} value={item.value}>
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
                  }
                  )(
                    <Input placeholder="กรุณากรอกตัวเลข" />
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
                  }
                  )(
                    <Input placeholder="กรุณากรอกตัวเลข" />
                  )}
                </Form.Item>
              </Col>
              {false &&
                <Col span={24}>
                  <div style={{ height: "240px", width: "100%" }}>

                    <GoogleMapReact
                      bootstrapURLKeys={{ key: "AIzaSyAb4djYb910xZWA3fBVe3tkG8z6VCM-4iY", libraries: 'places' }}
                      defaultCenter={defaultCenter[0]} // Bangkok Center
                      defaultZoom={15}
                      yesIWantToUseGoogleMapApiInternals
                    // onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, defaultCenter)}
                    // {...apiReady && (
                    //   <SearchBox
                    //     placeholder={"123 anywhere st."}
                    //     // onPlacesChanged={handleSearch}
                    //     map={map}
                    //     googlemaps={googlemaps} />
                    // )}
                    >
                    </GoogleMapReact>

                  </div>
                </Col>
              }
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
              สร้างโรงเรียน
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
        title="เพิ่มโรงเรียน"
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
