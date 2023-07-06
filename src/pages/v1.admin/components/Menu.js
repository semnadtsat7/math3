import React from "react";
import { NavLink } from "react-router-dom";

import styled from "styled-components";

import { Button, Dropdown, Menu } from "antd";

import downloadSheetsProgress from "./downloads/sheets-progress";
import downloadQuizzesProgress from "./downloads/quizzes-progress";

const Container = styled.div`
  width: 48px;
`;

function Component({}) {
  const q = window.location.search;

  return (
    <Container>
      <Dropdown
        trigger={["click"]}
        overlay={() => {
          return (
            <Menu>
              <Menu.Item key="version">
                <NavLink to={`/version${q}`}>จัดการเวอร์ชั่น</NavLink>
              </Menu.Item>
              <Menu.Item key="maps">
                <NavLink to={`/maps${q}`}>จัดการสาระการเรียนรู้</NavLink>
              </Menu.Item>
              {/* <Menu.Item key="quizzes.csv" disabled={true}>
                                <span>จัดการข้อสอบ (CSV)</span>
                            </Menu.Item> */}
              <Menu.Item key="rewards">
                <NavLink to={`/rewards${q}`}>จัดการเทมเพลตรางวัล</NavLink>
              </Menu.Item>
              {/* <Menu.Item key="avatars" disabled={true} >
                                <span>จัดการตัวละคร</span>
                            </Menu.Item> */}

              <Menu.Divider />

              <Menu.Item
                key="sheets-progress-download"
                onClick={downloadSheetsProgress}
              >
                ดาวโหลดความก้าวหน้า
              </Menu.Item>

              <Menu.Item
                key="quizzes-progress-download"
                onClick={downloadQuizzesProgress}
              >
                ดาวโหลดความก้าวหน้าแบบละเอียด
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item>
                <a
                  href="https://alpha.clevermath.app/manage-csv?token=J88dCRPXaMDjc74RCSMvxZMuw4Yj5xTzWaT76"
                  target="_blank"
                >
                  อัพโหลดแบบฝึดหัด/ข้อสอบ
                </a>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item>
                <a href="https://bit.ly/ipst-format" target="_blank">
                  bit.ly/ipst-format
                </a>
              </Menu.Item>
            </Menu>
          );
        }}
      >
        <Button type="ghost" shape="circle" icon="menu" />
      </Dropdown>
    </Container>
  );
}

export default Component;
