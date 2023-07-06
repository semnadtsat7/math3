import React, { useEffect, useState } from "react";

import { Box, Button, Table } from "../../core/components";
import { Link, useHistory } from "react-router-dom";
import { Popconfirm, message, Checkbox, Modal, Col, Row } from "antd";

import ShowModalDelete from "./ModalDelete";
import NumberUtil from "../../utils/NumberTS";

import { SchoolService } from "../../services/School";

import "antd/dist/antd.css";
import { Button as Button2, Input } from "antd";
import { SearchOutlined, SettingOutlined, SyncOutlined } from "@ant-design/icons";

export default function SchoolTable(props) {
  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });

  const { datasource, loading, role } = props;

  const [items, setItems] = useState([]);
  const [modal, setModal] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  //Pagination index
  const [page, setPage] = useState(1);

  //AntD's modal แสดง filter collumn
  const [isModalVisible, setModalVisible] = useState(false);
  const [collumn1, setHideCollumn1] = useState(false);
  const [collumn2, setHideCollumn2] = useState(false);
  const [collumn3, setHideCollumn3] = useState(false);
  const [collumn4, setHideCollumn4] = useState(false);
  const [collumn5, setHideCollumn5] = useState(false);
  const [collumn6, setHideCollumn6] = useState(false);
  const [collumn7, setHideCollumn7] = useState(false);
  const [collumn8, setHideCollumn8] = useState(false);
  const [collumn9, setHideCollumn9] = useState(false);
  const [collumn10, setHideCollumn10] = useState(false);
  const [collumn11, setHideCollumn11] = useState(false);
  const [collumn12, setHideCollumn12] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };
  const hideCollumn1 = () => {
    setHideCollumn1((prev) => !prev);
  };
  const hideCollumn2 = () => {
    setHideCollumn2((prev) => !prev);
  };
  const hideCollumn3 = () => {
    setHideCollumn3((prev) => !prev);
  };
  const hideCollumn4 = () => {
    setHideCollumn4((prev) => !prev);
  };
  const hideCollumn5 = () => {
    setHideCollumn5((prev) => !prev);
  };
  const hideCollumn6 = () => {
    setHideCollumn6((prev) => !prev);
  };
  const hideCollumn7 = () => {
    setHideCollumn7((prev) => !prev);
  };
  const hideCollumn8 = () => {
    setHideCollumn8((prev) => !prev);
  };
  const hideCollumn9 = () => {
    setHideCollumn9((prev) => !prev);
  };
  const hideCollumn10 = () => {
    setHideCollumn10((prev) => !prev);
  };
  const hideCollumn11 = () => {
    setHideCollumn11((prev) => !prev);
  };
  const hideCollumn12 = () => {
    setHideCollumn12((prev) => !prev);
  };
  //

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  useEffect(() => {
    setItems(datasource);
  }, [datasource]);

  const columns = [
    {
      title: "#",
      dataIndex: "rowKey",
      key: "rowKey",
      fixed: "left",
      render: (value, row, index) => {
        return <Box>{(page - 1) * 10 + index + 1}</Box>;
      },
    },
    {
      title: "รหัสโรงเรียน",
      hidden: collumn1,
      dataIndex: "data.schoolCode",
      key: "schoolCode",
      fixed: "left",
      //defaultSortOrder: 'descend',
      sorter: (a, b) => {
        if (a && a.data?.schoolCode && b && b.data?.schoolCode) {
          return a.data?.schoolCode - b.data?.schoolCode;
        } else if (a && a.data?.schoolCode) {
          // That means b has null schoolCode, so a will come first.
          return -1;
        } else if (b && b.data?.schoolCode) {
          // That means a has null schoolCode, so b will come first.
          return 1;
        }
        // Both roles have null schoolCode, so there will be no order change.
        return 0;
      },
      render: (value, row, index) => {
        return <Box>{value}</Box>;
      },
    },
    {
      title: "ชื่อโรงเรียน",
      hidden: collumn2,
      dataIndex: "data.name.thai",
      key: "schoolName",
      fixed: "left",
      sorter: (a, b) => {
        if (a && a.data?.name?.thai && b && b.data?.name?.thai) {
          return a.data?.name?.thai
            .toLowerCase()
            .localeCompare(b.data?.name?.thai.toLowerCase());
        } else if (a && a.data?.name?.thai) {
          // That means b has null schoolName, so a will come first.
          return -1;
        } else if (b && b.data?.name?.thai) {
          // That means a has null schoolName, so b will come first.
          return 1;
        }
        // Both roles have null schoolName, so there will be no order change.
        return 0;
      },
      render: (value, row, index) => {
        return (
          <Link to={`schools/edit/${row.schoolId}`}>
            <Box style={{ color: "#457cc4" }}>{row?.data.name.thai}</Box>
          </Link>
        );
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="ค้นหาตามชื่อโรงเรียน"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button2
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              ค้นหา
            </Button2>
            <Button2
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              รีเซ็ต
            </Button2>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.data?.name?.thai
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    {
      title: "เขตพื้นที่",
      hidden: collumn3,
      dataIndex: "data.educationServiceArea",
      key: "educationServiceArea",
      sorter: (a, b) =>
        typeof a.data?.educationServiceArea === "string" &&
        typeof b.data?.educationServiceArea === "string" &&
        a.data?.educationServiceArea
          .toLowerCase()
          .localeCompare(b.data?.educationServiceArea?.toLowerCase()),
    },
    {
      title: "สังกัด",
      hidden: collumn3,
      dataIndex: "data.affiliation",
      key: "affiliation",
      sorter: (a, b) =>
        typeof a.data?.affiliation === "string" &&
        typeof b.data?.affiliation === "string" &&
        a.data?.affiliation?.toLowerCase().localeCompare(b.data?.affiliation?.toLowerCase()),
      render: (value, row, index) => {
        return <Box>{row?.data?.affiliation?.sort().join(", ")}</Box>;
      },
    },
    {
      title: "ห้องเรียน",
      hidden: collumn4,
      dataIndex: "action",
      key: "action",
      render: (value, row, index) => {
        return (
          <Box>
            <Link to={`schools/${row.schoolId}`}>
              <Button type="primary" size="small">
                ดูห้องเรียน
              </Button>
            </Link>
            {/* Wait to finalize about Role for delete button! So we keep the delete button disappear for a while.. */}
            {role === "Super Admin" && false && (
              <Button
                type="danger"
                size="small"
                style={{ color: "white" }}
                onClick={() => {
                  setModal("delete");
                  setSchoolId(row.schoolId);
                }}
              >
                ลบ
              </Button>
            )}
          </Box>
        );
      },
    },
    {
      title: "จำนวนห้องเรียน",
      hidden: collumn5,
      dataIndex: "statistics.total.totalClassrooms",
      key: "totalClassrooms",
      sorter: (a, b) =>
        a.statistics?.total?.totalClassrooms -
        b.statistics?.total?.totalClassrooms,
      render: (value, row, index) => {
        return (
          <Box>
            {NumberUtil.prettify(
              row?.statistics?.total?.totalClassrooms || 0
            )}
          </Box>
        );
      },
    },
    {
      title: "จำนวนนักเรียน",
      hidden: collumn6,
      dataIndex: "statistics.total.totalStudents",
      key: "totalStudents",
      sorter: (a, b) =>
        a.statistics?.total?.totalStudents -
        b.statistics?.total?.totalStudents,
      render: (value, row, index) => {
        return (
          <Box>
            {NumberUtil.prettify(row?.statistics?.total?.totalStudents || 0)}
          </Box>
        );
      },
    },
    {
      title: "ด่านที่ผ่านโดยเฉลี่ย",
      hidden: collumn7,
      dataIndex: "statistics.total.metrics.averagePass",
      key: "pass",
      sorter: (a, b) =>
        a.statistics?.total?.metrics?.averagePass -
        b.statistics?.total?.metrics?.averagePass,
      render: (value, row, index) => {
        return (
          <Box>
            {NumberUtil.prettify(
              row?.statistics?.total?.metrics?.averagePass?.toFixed(2) || 0
            )}
          </Box>
        );
      },
    },
    {
      title: "คะแนนรวมโดยเฉลี่ย",
      hidden: collumn8,
      dataIndex: "statistics.total.metrics.averageBest",
      key: "best",
      sorter: (a, b) =>
        a.statistics?.total?.metrics?.averageBest -
        b.statistics?.total?.metrics?.averageBest,
      render: (value, row, index) => {
        return (
          <Box>
            {NumberUtil.prettify(
              row?.statistics?.total?.metrics?.averageBest?.toFixed(2) || 0
            )}
          </Box>
        );
      },
    },
    {
      title: "ทำข้อสอบโดยเฉลี่ย",
      hidden: collumn9,
      dataIndex: "statistics.total.metrics.averagePlay",
      key: "play",
      sorter: (a, b) =>
        a.statistics?.total?.metrics?.averagePlay -
        b.statistics?.total?.metrics?.averagePlay,
      render: (value, row, index) => {
        return (
          <Box>
            {NumberUtil.prettify(
              row?.statistics?.total?.metrics?.averagePlay?.toFixed(2) || 0
            )}
          </Box>
        );
      },
    },
    // {
    //   title: "ที่อยู่",
    //   dataIndex: "address",
    //   key: "address",
    //   sorter: (a, b) => (typeof a.addresses[0]?.province === 'string' && typeof b.addresses[0]?.province === 'string'&& a.addresses[0]?.province.toLowerCase().localeCompare(b.addresses[0]?.province.toLowerCase())),
    //   render: (value, row, index) => {
    //     let address = row?.addresses ? row?.addresses[0] : null;

    //     if (address === null) {
    //       return <Box>-</Box>;
    //     }

    //     return (
    //       <Box>
    //         {address?.address} {address?.subDistrict} {address?.district}{" "}
    //         {address?.province}
    //       </Box>
    //     );
    //   },
    // },
  ].filter((item) => !item.hidden);

  function handleDelete(schoolId, confirmDeleteTeacher) {
    message.info("กำลังดำเนินการ . . . ");
    setLoadingModal(true);
    SchoolService.deleteSchoolById(schoolId, confirmDeleteTeacher)
      .then((response) => {
        const source = [...items];

        const data = source.filter((item) => item.schoolId !== schoolId);
        setItems(data);

        message.success("ลบข้อมูลเรียบร้อยแล้ว", 3);
      })
      .catch((error) => {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      })
      .finally(() => {
        setLoadingModal(false);
        setModal("");
      });
  }

  //Admin update table data OnRequest
  function updateTableData(e) {
    message.info(
      "กำลังดำเนินการอัพเดทข้อมูลโรงเรียน . . . กรุณารอประมาณ 1 นาที"
    );
    setLoadingModal(true);
    SchoolService.updateAdminSchoolTableData()
      .then((response) => {
        message.success("อัพเดทข้อมูลเรียบร้อยแล้ว", 3);
      })
      .catch((error) => {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      })
      .finally(() => {
        setLoadingModal(false);
        setModal("");
      });
  }

  return (
    <Box>
      <Table
        dataSource={items}
        sortDirections={["descend", "ascend"]}
        loading={loading}
        columns={columns}
        rowKey="schoolCode"
        onChange={onChange}
        scroll={{ x: "max-content" }}
        pagination={{
          onChange(current) {
            setPage(current);
          },
        }}
      />
      <ShowModalDelete
        onOpen={modal === "delete"}
        handleCancel={() => setModal("")}
        handleDelete={(confirmDeleteTeacher) =>
          handleDelete(schoolId, confirmDeleteTeacher)
        }
        schoolId={schoolId}
        loadingModal={loadingModal}
      ></ShowModalDelete>

      <button
        onClick={showModal}
        style={{
          backgroundColor: "#4E89FF",
          border: "none",
          borderRadius: "4px",
          width: "26px",
          height: "26px",
          cursor: "pointer",
        }}
      >
        <SettingOutlined style={{ color: "#FFFFFF" }} />
      </button>

      <button
        onClick={updateTableData}
        style={{
          marginLeft: "10px",
          backgroundColor: "#666b73",
          border: "none",
          borderRadius: "4px",
          width: "26px",
          height: "26px",
          cursor: "pointer",
        }}
      >
        <SyncOutlined style={{ color: "#FFFFFF" }} />
      </button>

      <Modal
        className="modalStyle"
        title="ตั้งค่าคอลัมน์"
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
        visible={isModalVisible}
        onCancel={hideModal}
        footer={[
          <Button onClick={hideModal} type="primary">
            ปิดหน้าต่าง
          </Button>,
        ]}
      >
        <div>
          <Row>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn1} defaultChecked="true">
                รหัสโรงเรียน
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn2} defaultChecked="true">
                ชื่อโรงเรียน
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn3} defaultChecked="true">
                สังกัด
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn4} defaultChecked="true">
                ห้องเรียน
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn5} defaultChecked="true">
                จำนวนห้องเรียน
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn6} defaultChecked="true">
                จำนวนนักเรียน
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn7} defaultChecked="true">
                ด่านที่ผ่านโดยเฉลี่ย
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn8} defaultChecked="true">
                คะแนนรวมโดยเฉลี่ย
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn9} defaultChecked="true">
                ทำข้อสอบโดยเฉลี่ย
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn10} defaultChecked="true">
                เวลาเฉลี่ยต่อข้อ
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn11} defaultChecked="true">
                ใช้คำใบ้โดยเฉลี่ย
              </Checkbox>
            </Col>
            <Col span={24} offset={0}>
              <Checkbox onChange={hideCollumn12} defaultChecked="true">
                ใช้ตัวช่วยโดยเฉลี่ย
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Modal>
    </Box>
  );
}
