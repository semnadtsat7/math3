import React, { createRef } from "react";

import styled from "styled-components";
import { Typography } from "@material-ui/core";

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

const missionEdit = ({ match }) => {
  const { missionId } = match.params;
  const parent = createRef();
  return (
    <Parent ref={parent}>
      <ActionBar>
        <MenuButton onClick={() => parent?.current?.toggleMenu()} />
        <Typography
          variant="subtitle2"
          color="inherit"
          noWrap
          style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}
        >
          แก้ไขการบ้าน
        </Typography>
      </ActionBar>
      <ScrollView>
        <AssignmentForm mode="edit" missionId={missionId} />
      </ScrollView>
    </Parent>
  );
};

export default missionEdit;
