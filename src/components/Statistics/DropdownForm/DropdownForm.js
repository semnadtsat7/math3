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

export default function DropdownForm(props) {
  const {
    title,
    placeholder,
    titlespan = 5,
    dropdownspan = 5,
    loading,
    overlay = menu,
  } = props;

  function getTitle() {
    if (!title) {
      return;
    }

    if (typeof title === "object") {
      return (
        <Col xs={24} sm={titlespan} {...props}>
          <Box pt="1">{title}</Box>
        </Col>
      );
    }

    return (
      <Col xs={24} sm={titlespan} {...props}>
        <Box pt="1">{title} : </Box>
      </Col>
    );
  }

  function getContent() {
    return (
      <Row gutter={[8, 8]} type="flex" justify="center" className="text-center">
        {getTitle()}
        <Col xs={24} sm={dropdownspan}>
          <Dropdown overlay={overlay}>
            <Button>
              {placeholder} <CaretDownFilled />
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
