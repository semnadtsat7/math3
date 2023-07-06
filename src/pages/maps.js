import React, { createRef, useState, useEffect, useContext } from "react";
import classes from "./maps.module.css";

import styled from "styled-components";

import Firebase from "../utils/Firebase";
import GetMaps from "../services/getMaps.V1";
import GetMaps2 from "../services/getMaps.V2";

import { Button } from "antd";

import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  // Switch,
  // Button,
} from "@material-ui/core";

import { Switch } from "antd";
import { RootContext } from "../root";

import ScrollView from "./students.ts.v1/ScrollView";

import Parent from "../components/Parent";
import ActionBar from "../components/ActionBar";
import MenuButton from "../components/MenuButton";
import Flexbox from "../components/Flexbox";
import Progress from "../components/Progress";
// import SmallProgress from '../components/SmallProgress';

import TableColumnName from "../components/Table.Column.Name";

const Action = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

function Toggler({ map }) {
  const { spaceID } = useContext(RootContext);

  const [fetching, setFetching] = useState(true);
  const [action, setAction] = useState(null);
  const [active, setActive] = useState(false);

  function handleMount() {
    setFetching(true);

    const teacher = spaceID || Firebase.auth().currentUser.uid;
    const ref = Firebase.database().ref(`teachers/${teacher}/maps/${map}`);

    ref.on("value", handleUpdate);

    return function () {
      ref.off("value", handleUpdate);
    };
  }

  function handleUpdate(snapshot) {
    setActive(snapshot.exists() && !!snapshot.val());
    setFetching(false);
  }

  async function toggle(active) {
    setActive(active);

    if (!!active) {
      setAction("adding");
    } else {
      setAction("removing");
    }

    const teacher = spaceID || Firebase.auth().currentUser.uid;
    const data = { teacher, map, active };

    await Firebase.functions().httpsCallable("teacher-sheet-toggle")(data);

    setAction(null);
  }

  useEffect(handleMount, [spaceID]);

  if (!!fetching) {
    return <Typography align="center">กำลังดาวน์โหลด</Typography>;
  }

  return (
    <Action>
      <Switch
        checked={!!active}
        onChange={(e) => toggle(e)}
        disabled={action === "adding" || action === "removing"}
      />
      {
        // action === 'adding' ?
        // <SmallProgress color="primary" />
        // :
        // action === 'removing' ?
        // <SmallProgress color="secondary" />
        // :
        // !!active ?
        // <Button
        //     color="secondary"
        //     size="small"
        //     onClick={() => toggle (false)}
        // >
        //     ปิดการใช้งาน
        // </Button>
        // :
        // <Button
        //     color="primary"
        //     size="small"
        //     onClick={() => toggle (true)}
        // >
        //     เปิดใช้งาน
        // </Button>
      }
    </Action>
  );
}

function Comp({ history, match }) {
  const parent = createRef();
  const { spaceID } = useContext(RootContext);
  // const space = window.localStorage.getItem ('space')

  const [fetching, setFetching] = useState(true);
  const [maps, setMaps] = useState([]);
  const [filter, setFilter] = useState("มรภ.สวนสุนันทา");

  function handleMount() {
    const auth = Firebase.auth();

    return auth.onAuthStateChanged((user) => {
      if (user) {
        handleFetch();
      } else {
        history.replace(
          `/sign-in?redirect=${encodeURIComponent(
            history.location.pathname + history.location.search
          )}`
        );
      }
    });
  }

  async function handleFetch() {
    setMaps([]);
    setFetching(true);

    //const maps = await GetMaps.get()
    await GetMaps2.getMaps2(filter).then((res) => {
      if (res.error) {
        setMaps({
          ...maps,
          error: res.error,
        });
      } else {
        setMaps(res);
      }
    });

    //setMaps (maps)
    setFetching(false);
  }

  //active button color style
  const [active, setActive] = useState("มรภ.สวนสุนันทา");

  async function handleFilter(filter) {
    setMaps([]);
    setFetching(true);

    await GetMaps2.getMaps2(filter).then((res) => {
      if (res.error) {
        setMaps({
          ...maps,
          error: res.error,
        });
      } else {
        setMaps(res);

        //active button color style
        //setActive(event.target.id);
        setActive(filter);
      }
    });

    //setMaps (maps)
    setFetching(false);
  }

  useEffect(handleMount, [spaceID]);

  const empty = maps.length === 0;

  const onClick = () => {
    console.log(maps);
    console.log(filter);
    console.log(active);
  };

  return (
    <Parent ref={parent}>
      <ActionBar>
        <MenuButton onClick={(e) => parent.current.toggleMenu()} />
        <Typography
          variant="subtitle2"
          color="inherit"
          noWrap
          style={{ paddingBottom: 2, lineHeight: 2 }}
        >
          บทเรียนทั้งหมด
          {!fetching && (
            <span style={{ marginLeft: 4 }}>({maps.length} บท)</span>
          )}
        </Typography>
        {/* <div onClick={onClick}>test</div> */}
      </ActionBar>
      {fetching ? (
        <Progress />
      ) : empty ? (
        <Flexbox>
          <p style={{ opacity: 0.5 }}>ไม่มีบทเรียน</p>
        </Flexbox>
      ) : (
        <React.Fragment>
          <ScrollView fitParent={!empty}>
            <Paper elevation={0}>
              <Table className="custom-table">
                <TableHead>
                  <TableRow selected={true}>
                    <TableCell padding="default">
                      <span style={{ display: "flex", marginBottom: "15px" }}>
                        <p style={{ paddingTop: "15px" }}>หลักสูตร</p>
                        <Button
                          onClick={() => handleFilter("มรภ.สวนสุนันทา")}
                          className={active === "มรภ.สวนสุนันทา" ? classes.active : undefined}
                          style={{ marginLeft: "15px" }}
                        >
                          มรภ.สวนสุนันทา
                        </Button>
                        <Button
                          onClick={() => handleFilter("ONET")}
                          className={active === "ONET" ? classes.active : undefined}
                          style={{ marginLeft: "15px" }}
                        >
                          ONET
                        </Button>
                        <Button
                          onClick={() => handleFilter("สสวท.")}
                          className={active === "สสวท." ? classes.active : undefined}
                          style={{ marginLeft: "15px" }}
                        >
                          ต้นฉบับ
                        </Button>
                        <Button
                          onClick={() => handleFilter("CM@HOME")}
                          className={active === "CM@HOME" ? classes.active : undefined}
                          style={{ marginLeft: "15px" }}
                        >
                          CM@HOME
                        </Button>
                      </span>
                      <Divider variant="fullWidth" />
                      <br />
                      <TableColumnName label="ชื่อบทเรียน" />
                    </TableCell>

                    <TableCell
                      padding="checkbox"
                      width={100}
                      style={{ minWidth: 100 }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maps
                    .map((item, i) => {
                      const mId = item._docId;

                      return (
                        <TableRow
                          style={{
                            backgroundColor:
                              item.grade === 4
                                ? "#ffe5e8"
                                : item.grade === 5
                                ? "#f4ffe6"
                                : item.grade === 6
                                ? "#e6f4ff"
                                : "white",
                          }}
                          key={`${i}-${item.id}`}
                          hover={true}
                        >
                          <TableCell padding="default">
                            <Typography noWrap>{item.title}</Typography>
                          </TableCell>
                          <TableCell padding="none">
                            <Toggler map={mId} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                    .filter((item) => item)}
                </TableBody>
              </Table>
            </Paper>
          </ScrollView>
        </React.Fragment>
      )}
    </Parent>
  );
}

export default Comp;
