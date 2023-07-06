import React, { createRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import styled from "styled-components";
import { Typography, createMuiTheme } from "@material-ui/core";

import MenuButton from "../components/MenuButton";
import AssignmentForm from "../components/FormMission";
import ActionBar from "../components/ActionBar";
import Parent from "../components/Parent";

const ScrollView = styled.div`
  overflow: auto;

  ${(props) =>
    props.fitParent &&
    `
        height: 100%;
    `}

  table {
    background: white;
  }
`;

const MissionCreate = () => {
  const parent = createRef();

  const history = useHistory();

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

      <ActionBar>
        <MenuButton onClick={() => parent?.current?.toggleMenu()} />
        <Typography
          variant="subtitle2"
          color="inherit"
          noWrap
          style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}
        >
          สร้างการบ้าน
        </Typography>
      </ActionBar>
      <ScrollView>
        <AssignmentForm mode="create" />
      </ScrollView>
    </Parent>
  );
};

export default MissionCreate;
