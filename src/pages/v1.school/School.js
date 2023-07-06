import React, { useRef, useState, useEffect } from "react";
import Parent from "../../components/Parent";
import Header from "../students.ts.v1/Header";
import { Menu, Card, Box, Button, Dropdown } from "../../core/components";
import { Upload, Icon, message } from "antd";
import { Link, useHistory } from "react-router-dom";

import ShowSchoolImport from "./ModalShow";
import SchoolTable from "./SchoolTable";
import { SchoolService } from "../../services/School";

export default function Schools() {
  const parent = useRef(Parent);
  const history = useHistory();

  const [schools, setAllSchools] = useState({
    loading: true,
    data: {},
  });

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState("");
  const [datasource, setDatasource] = useState([]);
  const [role, setRole] = useState();

  useEffect(() => {
    setLoading(true);
    SchoolService.getSchoolsStatisticsFile()
      .then(setAllSchools)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleImportRequest({ file, onSuccess }) {
    setLoading(true);
    message.loading("กำลังดำเนินการ", 3);

    SchoolService.createImportSchoolCSV(file)
      .then((result) => {
        message.destroy();
        if (result.status == 200) {
          message.success("นำเข้าไฟล์ CSV เรียบร้อยแล้ว", 3);

          setDatasource(result.data);
          setModal("show");
          SchoolService.getAllSchools().then(setAllSchools);
          onSuccess([]);
        } else {
          console.log(result);
          message.error(
            result?.data?.message || "พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
            3
          );
        }
      })
      .catch((err) => {
        message.destroy();
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);

        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onClick = () => {
    console.log(schools);
  };

  return (
    <Parent ref={parent}>
      <div
        style={{
          display: "absolute",
          zIndex: "1009",
        }}
      >
        <Header
          onMenuClick={() => parent.current?.toggleMenu()}
          title="โรงเรียน"
          actions={[
            <Button
              type="primary"
              onClick={() => history.push("/schools/create")}
            >
              เพิ่มโรงเรียน
            </Button>,
            <Upload
              accept=".csv"
              showUploadList={false}
              customRequest={handleImportRequest}
            >
              <Button loading={loading} type="primary">
                นำเข้าไฟล์ CSV
              </Button>
            </Upload>,
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu
                  onClick={(e) => {
                    if (e.key === "download-csv") {
                      window.open(
                        "https://docs.google.com/spreadsheets/d/1Ms5VxZom-2seTUMPpUqSnJcG4HGCUqc1lHpblJXNn7U/edit?usp=sharing",
                        "_blank"
                      );
                    }
                  }}
                >
                  <Menu.Item key="download-csv">
                    ดาวน์โหลดไฟล์ CSV ตัวอย่าง
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" style={{ padding: "0 6px" }}>
                <Icon type="more" />
              </Button>
            </Dropdown>,
          ]}
        />
      </div>
      <Box>
        <div className="Schools">
          <Card bordered={false} className="w-100 Schools-Container">
            <Box>
              {/* <div onClick={onClick}>test</div> */}
              <SchoolTable
                datasource={schools?.loading ? [] : schools}
                loading={loading}
                role={role}
              />
            </Box>
          </Card>
        </div>
      </Box>

      <ShowSchoolImport
        onOpen={modal === "show"}
        handleCancel={() => setModal("")}
        datasource={datasource}
        loading={loading}
      ></ShowSchoolImport>
    </Parent>
  );
}
