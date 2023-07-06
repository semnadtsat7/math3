import React from "react";
import {
  Menu,
  Spin,
  Col,
  Row,
  Button,
  Box,
  Dropdown,
} from "../../../core/components";

import { CaretDownFilled } from "@ant-design/icons";

const menu = (
  <Menu>
    <Menu.Item key="1"></Menu.Item>
  </Menu>
);

export default function DropdownFormNoTitle(props) {
  const { placeholder, dropdownspan = 5, loading, overlay = menu } = props;

  function getContent() {
    return (
      <Row gutter={[8, 8]} type="flex" justify="left" className="text-center">
        <Col xs={24} sm={dropdownspan}>
          <Dropdown overlay={overlay}>
            <Button
              style={{
                marginTop: "0px",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                }}
              >
                {placeholder}
              </span>{" "}
              <CaretDownFilled />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    );
  }

  function getLoading() {
    return (
      <Row gutter={[8, 8]} type="flex" justify="center" className="text-center">
        <Col xs={24} sm={dropdownspan}>
          {/* <Spin /> */}
        </Col>
      </Row>
    );
  }

  return <Box>{loading ? getLoading() : getContent()}</Box>;
}
