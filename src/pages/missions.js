import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { teal, red, blue, indigo, grey } from "@material-ui/core/colors";
import styled from "styled-components";
import moment from "moment";

import { DateTimePicker } from "material-ui-pickers";

import Firebase from "../utils/Firebase";
import DateTime from "../utils/DateTime";

import GetMaps from "../services/getMaps.V1";

import TextUtil from "../utils/Text";
import NumberUtil from "../utils/Number";

import
{
  Button,
} from 'antd';

import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  //Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  // TablePagination,
  Select,
  MenuItem,
  ListItem,
  ListItemText,
  // FormGroup,
  FormControlLabel,
  Checkbox,
  // TableSortLabel,
  Grid,
} from "@material-ui/core";

import { Modal, message } from "antd";
// import {
//     SwapVert as SwapVertIcon,
// } from "@material-ui/icons";

import orange from "@material-ui/core/colors/orange";

import Parent from "../components/Parent";
import ActionBar from "../components/ActionBar";
import MenuButton from "../components/MenuButton";
import Flexbox from "../components/Flexbox";
import Progress from "../components/Progress";
import TextField from "../components/TextField";

import ColumnLevel from "../components/Column.Level";
import ColumnLevelType from "../components/Column.LevelType";

import TableColumnName from "../components/Table.Column.Name";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

function sort(items, order, orderBy) {
  let result = [];

  if (orderBy === "title") {
    if (order === "asc") {
      result = items.sort((a, b) =>
        (a[orderBy] || "").localeCompare(b[orderBy] || "")
      );
    } else {
      result = items.sort((a, b) =>
        (b[orderBy] || "").localeCompare(a[orderBy] || "")
      );
    }
  } else {
    if (order === "asc") {
      result = items.sort(
        (a, b) =>
          (a[orderBy] ? a[orderBy].toDate() : 0) -
          (b[orderBy] ? b[orderBy].toDate() : 0)
      );
    } else {
      result = items.sort(
        (a, b) =>
          (b[orderBy] ? b[orderBy].toDate() : 0) -
          (a[orderBy] ? a[orderBy].toDate() : 0)
      );
    }
  }

  return result;
}

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      fetchingMaps: true,
      fetchingRewards: true,
      fetchingGroups: true,
      saving: false,
      missions: [],
      selectedMissionName: "",
      maps: [],
      rewards: [],
      groups: [],

      page: 0,
      rowsPerPage: 50,

      order: "asc",
      orderBy: "createdAt",

      createDialog: 0,
      editDialog: null,

      dialogTitle: "",
      dialogDescription: "",
      dialogMap: -1,
      dialogLevel: "none",
      dialogLevelType: "none",
      dialogCount: 1,
      dialogScore: 1,
      dialogStartAt: moment(),
      dialogEndAt: moment().add(1, "days"),
      dialogReward: 0,
      dialogStatus: "draft",
      dialogGroup: -1,
      dialogInfinite: false,

      deleteDialog: 0,
      deleteMissionId: "",

      map: "none",
      level: "none",
      levelType: "none",
      status: "none",
    };

    this.unsubscribes = [];

    this.fetch = this.fetch.bind(this);

    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.handleDelete = this.handleDelete.bind(this);

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);

    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const auth = Firebase.auth();

    this.unsubscribes[0] = auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetch();
      } else {
        history.replace(
          `/sign-in?redirect=${encodeURIComponent(
            history.location.pathname + history.location.search
          )}`
        );
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribes.filter((fn) => !!fn).forEach((fn) => fn());
  }

  async fetch() {
    this.setState({
      fetching: true,
      fetchingMaps: true,
      fetchingRewards: true,
      fetchingGroups: true,

      missions: [],

      maps: [],
      rewards: [],
      groups: [],
    });

    const space = window.localStorage.getItem("space");
    const teacher = space || Firebase.auth().currentUser.uid;

    this.unsubscribes.push(
      Firebase.firestore()
        .collection("teachers")
        .doc(teacher)
        .collection("missions")
        .onSnapshot((snapshot) => {
          const items = [];

          snapshot.forEach((doc) => {
            const item = {
              id: doc.id,
              ...doc.data(),

              startAt: moment(doc.get("startAt")),
              endAt: moment(doc.get("endAt")),
            };

            items.push(item);
          });

          this.setState({
            fetching: false,
            // missions: items.sort((a, b) => a.title.localeCompare(b.title)),
            missions: items,
          });
        })
    );

    this.unsubscribes.push(
      Firebase.firestore()
        .collection("teachers")
        .doc(teacher)
        .collection("rewards")
        .where("isActive", "==", true)
        .onSnapshot((snapshot) => {
          const rewards = [];

          snapshot.forEach((doc) => {
            const reward = {
              id: doc.id,
              ...doc.data(),

              createdAt: doc.get("createdAt").toMillis(),
            };

            rewards.push(reward);
          });

          this.setState({
            fetchingRewards: false,
            rewards: rewards.sort((a, b) => a.name.localeCompare(b.name)),
          });
        })
    );

    this.unsubscribes.push(
      Firebase.firestore()
        .collection("teachers")
        .doc(teacher)
        .collection("groups")
        .where("isActive", "==", true)
        .onSnapshot((snapshot) => {
          const groups = [];

          snapshot.forEach((doc) => {
            const reward = {
              id: doc.id,
              ...doc.data(),

              createdAt: doc.get("createdAt").toMillis(),
            };

            groups.push(reward);
          });

          this.setState({
            fetchingGroups: false,
            groups: groups.sort((a, b) => a.name.localeCompare(b.name)),
          });
        })
    );

    const maps = await GetMaps.get({ teacher });

    this.setState({
      fetchingMaps: false,
      maps,
    });
  }

  async handleCreate(type) {
    const {
      dialogTitle,
      dialogDescription,
      dialogMap,
      dialogLevel,
      dialogLevelType,
      dialogCount,
      dialogScore,
      dialogStartAt,
      dialogEndAt,
      dialogReward,
      dialogStatus,
      dialogGroup,
      dialogInfinite,
    } = this.state;

    if (!dialogTitle) {
      alert(`กรุณาระบุชื่อการบ้าน`);
      return;
    }

    if (!dialogCount) {
      alert(`กรุณาระบุจำนวนด่านขั้นต่ำอย่างน้อย 1 ด่าน`);
      return;
    }

    if (!dialogScore) {
      alert(`กรุณาระบุคะแนนขั้นต่ำอย่างน้อย 1 คะแนน`);
      return;
    }

    if (dialogReward < 0 || dialogReward >= this.state.rewards.length) {
      alert(`กรุณาระบุรางวัล`);
      return;
    }

    this.setState({ createDialog: 2 });

    const space = window.localStorage.getItem("space");
    const teacher = space || Firebase.auth().currentUser.uid;

    const title = dialogTitle;
    const description = dialogDescription;
    const map = dialogMap >= 0 ? this.state.maps[dialogMap]._docId : "none";
    const level = dialogLevel;
    const levelType = dialogLevelType;
    const count = parseInt(dialogCount, 10);
    const score = parseInt(dialogScore, 10);
    const startAt = dialogStartAt.valueOf();
    const endAt = dialogEndAt.valueOf();
    const reward = this.state.rewards[dialogReward];
    const status = dialogStatus ? dialogStatus : "published";
    const group = dialogGroup >= 0 ? this.state.groups[dialogGroup].id : null;
    const infinite = !!dialogInfinite;

    const fn =
      type === "update" ? `teacher-mission-update` : `teacher-mission-create`;
    const fnData = {
      teacher,
      title,
      description,
      map,
      level,
      levelType,
      count,
      score,
      startAt,
      endAt,
      reward,
      status,
      group,
      infinite,
    };

    if (type === "update") {
      fnData.id = this.state.editDialog;
    }

    await Firebase.functions().httpsCallable(fn)(fnData);

    this.setState({
      createDialog: 0,
      editDialog: null,

      dialogTitle: "",
      dialogDescription: "",
      dialogMap: -1,
      dialogLevel: "none",
      dialogLevelType: "none",
      dialogCount: 1,
      dialogScore: 1,
      dialogStartAt: moment(),
      dialogEndAt: moment().add(1, "days"),
      dialogReward: 0,
      dialogStatus: "published",
      dialogGroup: -1,
      dialogInfinite: false,
    });
  }

  async handleDelete() {
    const { deleteMissionId } = this.state;
    this.setState({ saving: true });
    if (!!deleteMissionId) {
      this.setState({ deleteDialog: 2 });

      const space = window.localStorage.getItem("space");
      const teacher = space || Firebase.auth().currentUser.uid;

      await Firebase.functions().httpsCallable("teacher-mission-delete")({
        teacher,
        mission: deleteMissionId,
      });
      message.success("ลบข้อมูลการบ้านเรียบร้อยแล้ว", 3);
      this.setState({
        deleteDialog: 0,
        deleteMissionId: "",
        saving: false,
        selectedMissionName: "",
      });
    }
  }

  handleUpdate = () => {
    this.handleCreate("update");
  };

  handleCancel() {
    this.setState({
      createDialog: 0,
      editDialog: null,

      dialogTitle: "",
      dialogDescription: "",
      dialogMap: -1,
      dialogLevel: "none",
      dialogLevelType: "none",
      dialogCount: 1,
      dialogScore: 1,
      dialogStartAt: moment(),
      dialogEndAt: moment().add(1, "days"),
      dialogReward: 0,
      dialogStatus: "draft",
      dialogGroup: -1,
      dialogInfinite: false,
    });
  }

  handleBindDialog = (mission) => {
    const map = this.state.maps
      .map((e, i) => (e._docId === mission.map ? i : -1))
      .filter((e) => e >= 0)[0];
    const rwd = this.state.rewards
      .map((e, i) => (e.id === mission.reward.id ? i : -1))
      .filter((e) => e >= 0)[0];
    const grp = this.state.groups
      .map((e, i) => (e.id === mission.group ? i : -1))
      .filter((e) => e >= 0)[0];

    this.setState({
      dialogTitle: mission.title,
      dialogDescription: mission.description,
      dialogMap: map >= 0 ? map : -1,
      dialogLevel: mission.level,
      dialogLevelType: mission.levelType,
      dialogCount: mission.count,
      dialogScore: mission.score,
      dialogStartAt: mission.startAt,
      dialogEndAt: mission.endAt,
      dialogReward: rwd >= 0 ? rwd : 0,
      dialogStatus: mission.status || "published",
      dialogGroup: grp >= 0 ? grp : -1,
      dialogInfinite: !!mission.infinite,
    });
  };

  handleSelect(e) {}

  handleChangePage(event, page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value });
  }

  handleSort(orderBy, order) {
    this.setState({ order, orderBy });
  }

  render() {
    const {
      fetching,
      fetchingMaps,
      fetchingRewards,
      fetchingGroups,
      missions,
      order,
      orderBy,
      deleteDialog,
      saving,
      map,
      selectedMissionName,
      level,
      levelType,
      status,
    } = this.state;
    const empty = missions.length === 0;
    const orderDirection = order === "asc" ? "desc" : "asc";
    const sorteds = sort(missions, order, orderBy);

    let items = sorteds;

    if (map !== "none") {
      items = items.filter((e) => e.map === map);
    }

    if (level !== "none") {
      items = items.filter((e) => e.level === level);
    }

    if (levelType !== "none") {
      if (levelType === "boss") {
        items = items.filter((e) => e.type === "boss");
      } else {
        items = items.filter((e) => e.type !== "boss");
      }
    }

    if (status === "published") {
      items = items.filter((e) => e.status === "published");
    } else if (status === "draft") {
      items = items.filter((e) => e.status === "draft");
    }

    const loading =
      fetching || fetchingMaps || fetchingRewards || fetchingGroups;

    const mapLevel = {
      easy: "ง่าย",
      medium: "ปานกลาง",
      hard: "ยาก",
    };
    const LEVELS = {
      ง่าย: {
        title: "ง่าย",
        color: blue[500],
      },

      ปานกลาง: {
        title: "ปานกลาง",
        color: teal[500],
      },

      ยาก: {
        title: "ยาก",
        color: red[500],
      },
    };

    return (
      <Parent ref="parent">
        <ActionBar>
          <MenuButton onClick={(e) => this.refs.parent.toggleMenu()} />
          <Typography
            variant="subtitle2"
            color="inherit"
            noWrap
            style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}
          >
            การบ้านทั้งหมด
          </Typography>
          <Link
            to={{
              pathname: "/missions/create",
              state: { mode: "create" },
            }}
          >
            {/* <Button color="primary" onClick={e => this.setState({ createDialog: 1 })} disabled={loading} >สร้างการบ้าน</Button> */}
            <Button type="primary" style={{ marginRight: 10 }}>สร้างการบ้าน</Button>
          </Link>
        </ActionBar>
        {loading ? (
          <Progress />
        ) : empty ? (
          <Flexbox>
            <p style={{ opacity: 0.5 }}>ไม่มีการบ้าน</p>
          </Flexbox>
        ) : (
          <React.Fragment>
            <ScrollView fitParent={!empty}>
              <Paper elevation={0}>
                <Table className="custom-table">
                  <TableHead>
                    <TableRow selected={true}>
                      <TableCell padding="default">
                        <TableColumnName
                          name="title"
                          label="การบ้าน"
                          orderBy={orderBy}
                          order={orderDirection}
                          onSort={this.handleSort}
                        />
                      </TableCell>

                      <TableCell padding="default">
                        <TableColumnName label="บทย่อย" />
                      </TableCell>

                      <TableCell padding="default">
                        <TableColumnName label="กลุ่ม" />
                      </TableCell>

                      {/* <TableCell padding="default">
                        <TableColumnName label="สถานะ" />
                      </TableCell> */}

                      {/* <TableCell padding="default">
                        <TableColumnName label="ขอบเขต" />
                      </TableCell> */}

                      <TableCell padding="default">
                        <TableColumnName label="รางวัล" />
                      </TableCell>

                      {/* <TableCell padding="default">
                        <TableColumnName label="แผนที่" />
                      </TableCell>
                      <TableCell align="right" padding="checkbox" width="100">
                        <TableColumnName label="ประเภท" />
                      </TableCell> */}

                      <TableCell align="right" padding="checkbox" width="100">
                        <TableColumnName label="ระดับ" />
                      </TableCell>

                      <TableCell align="right" padding="checkbox" width="80">
                        <TableColumnName
                          name="startAt"
                          label="วันที่เริ่ม"
                          orderBy={orderBy}
                          order={orderDirection}
                          onSort={this.handleSort}
                        />
                      </TableCell>
                      <TableCell align="right" padding="checkbox" width="80">
                        <TableColumnName
                          name="endAt"
                          label="วันที่สิ้นสุด"
                          orderBy={orderBy}
                          order={orderDirection}
                          onSort={this.handleSort}
                        />
                      </TableCell>
                      <TableCell align="right" padding="checkbox" width="80">
                        <TableColumnName
                          name="createdAt"
                          label="วันที่สร้าง"
                          orderBy={orderBy}
                          order={orderDirection}
                          onSort={this.handleSort}
                        />
                      </TableCell>
                      <TableCell padding="checkbox" width="60"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      // sorteds
                      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      items
                        .map((mission, i) => {
                          // let mapTitle = "ทุกบท";
                          // let groupTitle = "รายบุคคล";

                          // if (mission.map !== "none") {
                          //   mapTitle = maps.filter(
                          //     (m) => m._docId === mission.map
                          //   )[0].title;
                          // }

                          // if (!!mission.group) {
                          //   const gs = groups.filter(
                          //     (g) => g.id === mission.group
                          //   );

                          //   if (gs.length > 0) {
                          //     groupTitle = gs[0].name;
                          //   } else {
                          //     groupTitle = "ไม่สามารถระบุได้";
                          //   }
                          // }

                          return (
                            <TableRow key={mission.id}>
                              <TableCell padding="default">
                                <Typography noWrap>
                                  <Link to={`/missions/detail/${mission.id}`}>
                                    <Name>{mission.lesson}</Name>
                                  </Link>
                                </Typography>
                              </TableCell>

                              <TableCell padding="default">
                                {mission.subLesson.map((subLesson) => (
                                  <Typography noWrap>{subLesson}</Typography>
                                ))}
                              </TableCell>

                              <TableCell padding="default">
                                {mission.group ? (
                                  <Typography noWrap>
                                    {mission.group.name}
                                  </Typography>
                                ) : (
                                  ""
                                )}
                              </TableCell>

															{/* 6May2021 ทดลองเอาออกก่อน พี่บ๊อบให้เอาออก เผื่อจะเอากลับมาใช้ ถ้าเลย1เดือน ค่อยเอาออกถาวร
                              <TableCell padding="default">
                                <Typography
                                  style={{
                                    color:
                                      mission.status === "draft"
                                        ? orange[500]
                                        : teal[500],
                                  }}
                                  noWrap
                                >
                                  {mission.status === "enabled"
                                    ? `เผยแพร่`
                                    : `แบบร่าง`}
                                </Typography>
                              </TableCell>
															*/}

                              <TableCell padding="default">
                                {mission.reward ? (
                                  <Typography variant="caption" noWrap>
                                    <ListItem style={{ padding: 0 }}>
                                      <AvatarShadow>
                                        <Avatar
                                          src={
                                            mission.reward
                                              ? mission.reward.image
                                              : ""
                                          }
                                        />
                                      </AvatarShadow>
                                      <ListItemText
                                        primary={
                                          mission.reward
                                            ? mission.reward.name
                                            : ""
                                        }
                                        style={{ paddingRight: 0 }}
                                      />
                                    </ListItem>
                                  </Typography>
                                ) : (
                                  <Typography noWrap>ไม่มีรางวัล</Typography>
                                )}
                              </TableCell>

                              {/* <TableCell padding="default">
                                <Typography noWrap>{mapTitle}</Typography>
                              </TableCell> */}

                              {/* <TableCell align="right" padding="checkbox">
                                <Typography noWrap>
                                  <ColumnLevelType
                                    levelType={mission.levelType}
                                  />
                                </Typography>
                              </TableCell> */}

                              <TableCell align="right" padding="checkbox">
                                <Typography noWrap>
                                  {/* <ColumnLevel level={mission.level} /> */}
                                  {mission.level.map((level, idx) => (
                                    <span
                                      style={{
                                        color: LEVELS[level].color,
                                      }}
                                    >
                                      {LEVELS[level].title}
                                      {idx === mission.level.length - 1
                                        ? ""
                                        : ", "}
                                    </span>
                                  ))}
                                </Typography>
                              </TableCell>

                              <TableCell align="right" padding="checkbox">
                                {mission.startDate ? (
                                  <React.Fragment>
                                    <Typography variant="caption" noWrap>
                                      {DateTime.formatDate(mission.startDate, {
                                        monthType: "short",
                                      })}
                                      <Typography
                                        component="small"
                                        variant="caption"
                                        noWrap
                                      >
                                        {DateTime.formatTime(mission.startDate)}
                                      </Typography>
                                    </Typography>
                                  </React.Fragment>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell align="right" padding="checkbox">
                                {mission.endDate ? (
                                  <React.Fragment>
                                    <Typography variant="caption" noWrap>
                                      {DateTime.formatDate(mission.endDate, {
                                        monthType: "short",
                                      })}
                                      <Typography
                                        component="small"
                                        variant="caption"
                                        noWrap
                                      >
                                        {DateTime.formatTime(mission.endDate)}
                                      </Typography>
                                    </Typography>
                                  </React.Fragment>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell align="right" padding="checkbox">
                                {mission.createdAt ? (
                                  <React.Fragment>
                                    <Typography variant="caption" noWrap>
                                      {DateTime.formatDate(mission.createdAt, {
                                        monthType: "short",
                                      })}
                                      <Typography
                                        component="small"
                                        variant="caption"
                                        noWrap
                                      >
                                        {DateTime.formatTime(mission.createdAt)}
                                      </Typography>
                                    </Typography>
                                  </React.Fragment>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Link to={`/missions/edit/${mission.id}`}>
                                  <Button type="secondary">แก้ไข</Button>
                                </Link>
                                <Button
                                  type="secondary"
                                  onClick={(e) => {
                                    this.setState({
                                      deleteDialog: 1,
                                      deleteMissionId: mission.id,
                                      selectedMissionName: mission.lesson,
                                    });
                                  }}
                                >
                                  ลบ
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                        .filter((item) => item)
                    }
                  </TableBody>
                </Table>
              </Paper>
            </ScrollView>
          </React.Fragment>
        )}
        <Modal
          zIndex={10000}
          visible={deleteDialog > 0}
          title={`ต้องการลบการบ้าน ${selectedMissionName} ?`}
          onOk={this.handleDelete}
          onCancel={(e) => this.setState({ deleteDialog: 0 })}
          okText="ลบ"
          cancelText="ปิด"
          okButtonProps={{ type: "danger", loading: saving }}
          cancelButtonProps={{ disabled: saving }}
          closable={!saving}
        >
          <p>เมื่อลบไปแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก</p>
        </Modal>
      </Parent>
    );
  }
}

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

const TableToolbar = styled.div`
  overflow-x: auto;
  overflow-y: hidden;

  height: 48px;

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;

  align-items: center;
  justify-content: flex-end;

  border-bottom: 1px solid #eee;

  .flex {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .select {
    padding: 4px;
  }
`;

const HorizontalScrollView = styled.div`
  overflow-x: auto;

  table {
    overflow-x: auto;
  }
`;

const ModalRoot = styled(Modal)`
  display: flex;
`;

const ModalPanel = styled.div`
  margin: auto;

  display: flex;

  flex-direction: column;
  flex-grow: 1;

  background-color: white;
  border-radius: 8px;

  height: fit-content;

  max-height: calc(100% - 48px);
  max-width: calc(100% - 48px);

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.3);

  @media (min-width: 528px) {
    max-width: 480px;
  }
`;

const AvatarShadow = styled.div`
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.5));
`;

// const Description = styled.p`
//     margin: 2px 0 0 0;
//     padding: 0;

//     opacity: 0.75;
// `

const StyledTextField = styled.div`
  width: 100%;

  > div {
    margin: 0;
  }
`;

const Name = styled.span`
  outline: none;
  text-decoration: underline;

  color: cornflowerblue;
  cursor: pointer;
`;

export default Page;
