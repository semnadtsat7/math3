import React, {
  createRef,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Upload, Dropdown, Menu, Modal, message, Icon } from "antd";

import { ArrowLeftOutlined } from "@ant-design/icons";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

import CSV from "../../../utils/CSV";
import Firebase from "../../../utils/Firebase";
import { SchoolService } from "../../../services/School";

import { RootContext } from "../../../root";
import Parent from "../../../components/Parent";

import Header from "./Header";
import ScrollView from "./ScrollView";

import Flexbox from "../../../components/Flexbox";
import Progress from "../../../components/Progress";

import TableColumnName from "../../../components/Table.Column.Name";
import TableSettings from "../../../components/Table/Settings";

import Picker from "../../../components/Table/Filter/Dropdown/Modal";

import Row from "./Row";
import TableFilter from "./Filter";

import ModalCreate from "./Modal.Create";
import ModalCustomId from "./Modal.CustomId";
import ModalDelete from "./Modal.Delete";

import listenStudents, { Student } from "./listenStudents";

import * as Column from "./utils/Column";

import Checkbox from "./Checkbox";
import SelectionActions from "./SelectionActions";

import useSpaces from "../../../components/menu.spaces/useSpaces";

import JFile from "js-file-download";
import * as J2C from "json2csv";
import NumberUtil from "../../../utils/NumberTS";

interface SelectionKV {
  [studentID: string]: boolean;
}

async function recursiveDeleteStudents(
  teacher: string,
  studentIDs: string[],
  index: number
) {
  if (index >= studentIDs.length) {
    return;
  }

  const student = studentIDs[index];
  const data = { teacher, student };

  await Firebase.functions().httpsCallable("teacher-student-delete")(data);
  await recursiveDeleteStudents(teacher, studentIDs, index + 1);
}

function getSelectionCount(students: Student[], selection: SelectionKV) {
  return students.filter((e) => selection[e._id]).length;
}

const LIMIT = 200;

const Comp: React.FC = () => {
  const parent = createRef<Parent>();
  const { id } = useParams<any>();
  const { spaceID } = useContext(RootContext);
  const spaces = useSpaces();

  const [modal, setModal] = useState("");
  const [spaceIDs, setSpaceIDs] = useState<string[]>([]);
  const [student, setStudent] = useState({});
  const [schools, setSchools] = useState<any>({});
  const [columns, setColumns] = useState(Column.load());
  const [selection, setSelection] = useState<SelectionKV>({});

  const { view, filter, sort, setFilter, setSort } = listenStudents(spaceIDs);
  const empty = view.students.length === 0;

  const orderBy = sort.orderBy;
  const orderDirection = sort.order === "asc" ? "desc" : "asc";

  const selectedCount = useMemo(
    () => getSelectionCount(view.students, selection),
    [view.students, selection]
  );
  const selectedAll = useMemo(
    () => selectedCount >= view.students.length,
    [view.students, selectedCount]
  );

  useEffect(() => {
    SchoolService.getAllTeacherBySchoolId(id).then((result) => {
      setSpaceIDs(result.map((x: { id: any }) => x.id));
    });

    SchoolService.getSchoolBySchoolId(id).then(setSchools);
  }, [id]);

  async function handleImport(file: any) {
    const csv = await CSV.fromFile(file);
    const current = view.metrics.student;

    if (current + csv.length > LIMIT) {
      message.error(
        `พบข้อผิดพลาด จำนวนนักเรียนที่ต้องการเพิ่มรวมกับจำนวนปัจจุบันเกิน ${LIMIT} คน`,
        5
      );
      return;
    }

    const root = document.getElementById("root");

    if (root) {
      root?.classList.add("loading");
    }

    const m = Modal.info({
      title: "กำลังอัปโหลด",
      content: `0 / ${csv.length}`,
      zIndex: 10000,
      keyboard: false,
      okButtonProps: {
        style: { display: "none" },
      },
    });

    try {
      const teacher = spaceID;

      for (let i = 0; i < csv.length; i++) {
        m.update({ content: `${i + 1} / ${csv.length}` });

        const name = csv[i].name;
        const customId = csv[i].id;

        await Firebase.functions().httpsCallable("teacher-student-create")({
          teacher,
          name,
          customId,
        });
      }

      message.success("สร้างนักเรียนใหม่เรียบร้อยแล้ว", 3);
    } catch (err) {
      console.log(err);
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
    }

    if (root) {
      root?.classList.remove("loading");
    }

    m.destroy();
  }

  function handleImportRequest({ file, onSuccess }: any) {
    handleImport(file).then(() => {
      onSuccess([]);
    });
  }

  function handleColumns(value: Column.Columns) {
    Column.set(value);
    setColumns(value);
  }

  function handleSelectAll(value: boolean) {
    // const checkedCount = view.students.filter(e => selection[e._id]).length;
    // const checked = checkedCount > 0;

    const selection: SelectionKV = {};

    for (const student of view.students) {
      selection[student._id] = value;
    }

    setSelection(selection);
  }

  function handleSelect(student: Student, value: boolean) {
    setSelection({ ...selection, [student._id]: value });
  }

  function handleAction(action: string) {
    if (action === "add-to-group") {
      setModal("add-to-group");
    } else if (action === "remove-from-group") {
      setModal("remove-from-group");
    } else if (action === "teacher-student-move") {
      setModal("teacher-student-move");
    } else if (action === "delete") {
      handleActionDeletes();
    }
  }

  function handleActionDeletes() {
    const m = Modal.confirm({
      title: "ต้องการลบนักเรียนที่เลือก ?",
      content: `เมื่อลบไปแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก`,
      zIndex: 10000,
      keyboard: false,
      cancelText: "ยกเลิก",
      okText: "ลบ",
      okButtonProps: { type: "danger" },
      onOk: async () => {
        const root = document.getElementById("root");

        if (root) {
          root?.classList.add("loading");
        }

        m.update({ cancelButtonProps: { style: { display: "none" } } });

        const studentIDs = view.students
          .filter((e) => selection[e._id])
          .map((e) => e._id);

        await recursiveDeleteStudents(spaceID, studentIDs, 0);
        await new Promise((r) => setTimeout(r, 1000));

        setSelection({});

        if (root) {
          root?.classList.remove("loading");
        }

        message.success("ลบข้อมูลเรียบร้อยแล้ว", 3);
      },
    });
  }

  async function handleActionGroupSelectPrompt(groupID: string) {
    const add = modal === "add-to-group";
    const fn = add
      ? "teacher-group-student-add"
      : "teacher-group-student-remove";
    const title = add
      ? "ต้องการเพิ่มเข้ากลุ่มเรียน ?"
      : "ต้องการนำออกจากกลุ่มเรียน ?";
    const msg = add ? "เพิ่มเข้าเรียบร้อย" : "นำออกเรียบร้อย";

    setModal("");

    const m = Modal.confirm({
      title: title,
      // content,
      zIndex: 10000,
      keyboard: false,
      cancelText: "ยกเลิก",
      okText: "ใช่",
      okButtonProps: { type: "primary" },
      onOk: async () => {
        const root = document.getElementById("root");

        if (root) {
          root?.classList.add("loading");
        }

        m.update({ cancelButtonProps: { style: { display: "none" } } });

        const teacher = spaceID;
        const students = view.students
          .filter((e) => selection[e._id])
          .map((e) => e._id);
        const data = { teacher, group: groupID, students };

        await Firebase.functions().httpsCallable(fn)(data);

        await new Promise((r) => setTimeout(r, 1000));

        setSelection({});

        if (root) {
          root?.classList.remove("loading");
        }

        message.success(msg, 3);
      },
    });
  }

  async function handleActionMoveSelectPrompt(destTeacher: string) {
    const fn = "teacher-student-move";
    const name = spaces.items.filter((e: any) => e.id == destTeacher)[0].name;
    const title = `ต้องการย้ายนักเรียนไปยัง ${name} หรือไม่`;
    const msg = "ระบบกำลังดำเนินการ โปรดรอจนกว่าจะดำเนินการย้ายเรียบร้อย";
    const msgSuccess = "ดำเนินการย้ายนักเรียนเรียบร้อยแล้ว";

    setModal("");

    const m = Modal.confirm({
      title: title,
      // content,
      zIndex: 10000,
      keyboard: false,
      cancelText: "ยกเลิก",
      okText: "ใช่",
      okButtonProps: { type: "primary" },
      onOk: async () => {
        const root = document.getElementById("root");

        if (root) {
          root?.classList.add("loading");
        }

        m.update({ cancelButtonProps: { style: { display: "none" } } });

        const teacher = spaceID;
        const students = view.students
          .filter((e) => selection[e._id])
          .map((e) => e._id);
        const data = { teacher, destTeacher: destTeacher, students };

        Firebase.functions()
          .httpsCallable(fn)(data)
          .then(() => {
            message.destroy();
            message.success(msgSuccess, 3);
          });

        await new Promise((r) => setTimeout(r, 1000));

        setSelection({});

        if (root) {
          root?.classList.remove("loading");
        }

        message.warn(msg, 7);
      },
    });
  }

  function handleFilterChange() {
    setSelection({});
  }

  useEffect(handleFilterChange, [filter]);

  const history = useHistory();

  const consolelogdata = () => {
    console.log(view.students);
  };

  //Download File CSV
  function handleDownload() {
    try {
      const sheetID = filter.sheetID;
      const sheetTitle = view.sheets.filter((e) => e._id === sheetID)[0];

      const items = view.students.map((students) => {
        const { name, metrics } = students;

        return {
          student: name,
          play: NumberUtil.truncate(metrics.play, 1),
          pass: NumberUtil.truncate(metrics.pass, 1),
          hint: NumberUtil.truncate(metrics.hint, 1),
          help: NumberUtil.truncate(metrics.help, 1),
          best: NumberUtil.truncate(metrics.best, 1),
          usageAvg: NumberUtil.truncate(metrics.usageAvg, 1),
        };
      });

      const fields = [
        {
          label: "ชื่อนักเรียน",
          value: "student",
        },
        {
          label: "คะแนนรวม(คะแนน)",
          value: "best",
        },
        {
          label: "ทำข้อสอบ(ครั้ง)",
          value: "play",
        },
        {
          label: "ด่านที่ผ่าน(ด่าน)",
          value: "pass",
        },
        {
          label: "เวลาเฉลี่ยต่อข้อ (วินาที)",
          value: "usageAvg",
        },
        {
          label: "ใช้คำใบ้ (ครั้ง)",
          value: "hint",
        },
        {
          label: "ใช้ตัวช่วย (ครั้ง)",
          value: "help",
        },
      ];

      const file = `ตารางสถิติแต่ละชุดของ${sheetTitle?.title}_${schools?.name?.thai}.csv`;
      const csv = new J2C.Parser({ withBOM: true, fields }).parse(items);

      JFile(csv, file, "text/csv");

      message.success("ดาวน์โหลดข้อมูลสำเร็จ", 3);
    } catch (err) {
      console.log(err);
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
    }
  }

  return (
    <Parent ref={parent}>
      <div
        style={{
          backgroundColor: "#1890ff",
          height: "40px",
        }}
      >
        <Button
          type="primary"
          onClick={history.goBack}
          style={{ height: "40px", fontSize: "13px", marginTop: "0px" }}
        >
          <ArrowLeftOutlined />
          <span style={{ marginLeft: "30px" }}>ย้อนกลับ</span>
        </Button>
      </div>
      <Header
        onMenuClick={() => parent?.current?.toggleMenu()}
        title={
          <>
            โรงเรียน{schools?.name?.thai} - นักเรียนทั้งหมด
            {/* {view.fetching !== "full" && (
              <span style={{ marginLeft: 4 }}>({view.metrics.student} คน)</span>
            )}
            {view.fetching === "partial" && (
              <span style={{ marginLeft: 12 }}>
                <Icon type="loading" />
              </span>
            )} */}
          </>
        }
      />
      {view.fetching === "full" || (view.fetching === "partial" && empty) ? (
        <Progress />
      ) : empty ? (
        <Flexbox>
          <p style={{ opacity: 0.5 }}>ไม่มีนักเรียน</p>
        </Flexbox>
      ) : (
        <ScrollView fitParent={!empty}>
          <Paper elevation={0}>
            <Table
              className={`custom-table ${
                view.fetching === "partial" ? `updating` : ``
              }`.trim()}
              // className={'custom-table'}
            >
              <TableHead>
                <TableRow selected={true}>
                  <TableCell
                    align="right"
                    padding="checkbox"
                    style={{
                      minWidth: 52,
                      width: 52,
                    }}
                  >
                    <TableColumnName numeric={true} label="#" />
                  </TableCell>
                  {/* <TableCell
                        padding="checkbox"
                        style={{ minWidth: 64, width: 64 }}
                      >
                        <Checkbox
                          value={selectedAll}
                          onChange={handleSelectAll}
                        />
                      </TableCell> */}

                  <TableCell
                    align="right"
                    padding="checkbox"
                    style={{ minWidth: 50 }}
                  >
                    <TableColumnName
                      name="teacher"
                      label="ระดับชั้น"
                      orderBy={orderBy}
                      order={orderDirection}
                      onSort={setSort}
                    />
                  </TableCell>
                  {columns.customId && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{
                        width: 100,
                        // display: columns.customId ? undefined : 'none'
                      }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="customId"
                        label="รหัสนักเรียน"
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}
                  <TableCell
                    align="right"
                    padding="checkbox"
                    style={{ minWidth: 160 }}
                  >
                    <TableColumnName
                      name="name"
                      label="ชื่อ"
                      orderBy={orderBy}
                      order={orderDirection}
                      onSort={setSort}
                    />
                  </TableCell>

                  {columns.pass && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 120 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="pass"
                        label={
                          <>
                            <span>ด่านที่ผ่าน</span>
                            <span>(ด่าน)</span>
                          </>
                        }
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  {columns.best && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 100 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="best"
                        label={
                          <>
                            <span>คะแนนรวม</span>
                            <span>(คะแนน)</span>
                          </>
                        }
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  {columns.play && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 100 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="play"
                        label={
                          <>
                            <span>ทำข้อสอบ</span>
                            <span>(ครั้ง)</span>
                          </>
                        }
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  {columns.usageAvg && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 120 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="usageAvg"
                        label={
                          <>
                            <span>เวลาเฉลี่ยต่อข้อ</span>
                            <span>(วินาที)</span>
                          </>
                        }
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  {columns.hint && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 80 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="hint"
                        label={
                          <>
                            <span>ใช้คำใบ้</span>
                            <span>(ครั้ง)</span>
                          </>
                        }
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  {columns.help && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 80 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="help"
                        label={
                          <>
                            <span>ใช้ตัวช่วย</span>
                            <span>(ครั้ง)</span>
                          </>
                        }
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  {/* {
                        columns.hintHelp &&
                        <TableCell
                          align="right"
                          padding="checkbox"
                          style={{ width: 80 }}
                        >
                          <TableColumnName
                            numeric={true}
                            name="hintHelp"
                            label={
                              <>
                                <span>ตัวช่วยและคำใบ้</span>
                                <span>(ครั้ง)</span>
                              </>
                            }
                            orderBy={orderBy}
                            order={orderDirection}
                            onSort={setSort}
                          />
                        </TableCell>
                      } */}

                  {columns.lastSignedInAt && (
                    <TableCell
                      align="right"
                      padding="checkbox"
                      style={{ width: 40 }}
                    >
                      <TableColumnName
                        numeric={true}
                        name="lastSignedInAt"
                        label={<>เข้าสู่ระบบล่าสุด</>}
                        orderBy={orderBy}
                        order={orderDirection}
                        onSort={setSort}
                      />
                    </TableCell>
                  )}

                  <TableCell
                    padding="checkbox"
                    style={{ width: 48 }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  view.students.map((student, i) => {
                    // const sum = summary.map[student.id] || {}

                    return (
                      <Row
                        key={student._id}
                        row={i + 1}
                        columns={columns}
                        sort={sort}
                        student={student}
                        metrics={view.metrics}
                        selected={selection[student._id]}
                        onSelect={handleSelect}
                        onCustomId={(target) => {
                          setStudent(target);
                          setModal("customId");
                        }}
                        onDelete={(target) => {
                          setStudent(target);
                          setModal("delete");
                        }}
                      />
                    );
                  })
                  // .filter(item => item)
                }
              </TableBody>
            </Table>
          </Paper>
        </ScrollView>
      )}
      {view.fetching !== "full" && (
        <TableFilter
          filter={filter}
          groups={view.groups}
          sheets={view.sheets}
          titles={view.titles}
          onChange={setFilter}
          extra={
            <>
              <TableSettings
                items={Column.COLUMN_FILTERABLES}
                value={columns}
                onChange={handleColumns}
              />
              {selectedCount > 0 && (
                <>
                  <div style={{ minWidth: 8 }} />
                  <SelectionActions onSelect={handleAction} />
                </>
              )}
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={handleDownload}
                //onClick={consolelogdata}
              >
                ดาวน์โหลด CSV
              </Button>
            </>
          }
        />
      )}
      <ModalCreate
        spaceID={spaceID}
        open={modal === "create"}
        onClose={() => setModal("")}
      />
      <ModalCustomId
        spaceID={spaceID}
        student={student}
        open={modal === "customId"}
        onClose={() => {
          setModal("");
          setStudent({});
        }}
      />
      <ModalDelete
        spaceID={spaceID}
        student={student}
        open={modal === "delete"}
        onClose={() => {
          setModal("");
          setStudent({});
        }}
      />

      {view.fetching !== "full" && (
        <Picker
          isOpen={modal === "add-to-group" || modal === "remove-from-group"}
          label="เลือกกลุ่มเรียน"
          items={view.groups.map((e) => {
            return {
              label: e.name,
              value: e._id,
            };
          })}
          onClose={() => setModal("")}
          onSelect={handleActionGroupSelectPrompt}
        />
      )}

      {view.fetching !== "full" && (
        <Picker
          isOpen={modal === "teacher-student-move"}
          label="เลือกระดับชั้น/ห้องเรียน"
          items={[
            ...spaces.items
              .filter((e: any) => e.id !== spaceID)
              .map((e: any) => {
                return {
                  value: e.id,
                  label: e.name,
                };
              }),
          ]}
          onClose={() => setModal("")}
          onSelect={handleActionMoveSelectPrompt}
        />
      )}
    </Parent>
  );
};

export default Comp;
