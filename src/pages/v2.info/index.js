import React, { createRef, useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Button, Form, Input, Modal, message, InputNumber } from "antd";
import AppContext from "../../AppContext";
import Firebase from "../../utils/Firebase";
import Progress from "../../components/Progress";
import Parent from "../../components/Parent";
import Header from "../students.ts.v1/Header";
import useSpace from "./useSpace";

const Card = styled.div`
  margin: 16px;
`;
const ActionGroup = styled.div`
  width: 100%;
  max-width: 240px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  margin-left: auto;
  margin-right: 0;
`;
function Comp() {
  const parent = createRef();
  const context = useContext(AppContext);
  const space = useSpace(context.space);
  const [action, setAction] = useState(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [classroom, setClassroom] = useState("");
  const [slug, setSlug] = useState("");
  const [slugMessage, setSlugMessage] = useState(false);
  const invalid = [];

  const formatedName = `${grade ? `ป.${grade}` : ""}${
    classroom ? `/${classroom}` : ""
  }${grade ? " " : ""}${name ? name : ""}`;

  // if (!name || name.length > 50) {
  //   invalid.push("name");
  // }

  if (!formatedName || formatedName.length > 50) {
    invalid.push("name");
  }

  if (!slug || slug.length > 25 || !!slugMessage) {
    invalid.push("slug");
  }

  const canSave = invalid.length === 0;

  function handleInit() {
    if (!!space) {
      const { name, slug, grade, classroom } = space;

      const classPrefix = grade ? `${grade?`ป.${grade}`:""}${classroom?`/${classroom}`:""}`:null;
      const unformatedName = classPrefix ? name?.includes(classPrefix) ? name?.replace(`${classPrefix}`,""): name : name;
      const unformatedName2 = unformatedName?.trim(); //fix bug spacebar in front of name
      //const unformatedName = name?.split(" ").slice(1,8).join(' '); //bug not check grade exist

      //setName(name);
      setName(unformatedName2);
      setSlug(slug);
      setGrade(grade);
      setClassroom(classroom);
    }
  }

  async function handleSubmit() {
    setAction("saving");

    try {
      const teacher = space.id;
      const result = await Firebase.functions().httpsCallable(
        "teacher-space-update"
      )({
        teacher,
        grade,
        classroom,
        name: formatedName,
        //name,
        slug,
      });

      if (!!result.data.message) {
        setSlugMessage(result.data.message);
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      } else {
        message.success("บันทึกข้อมูลระดับชั้นเรียบร้อยแล้ว", 3);
      }
    } catch (err) {
      console.log(err);
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
    }

    setAction(null);
  }

  async function handleDelete() {
    setAction("deleting");

    try {
      const teacher = space.id;
      const result = await Firebase.functions().httpsCallable(
        "teacher-space-delete"
      )({ teacher });

      if (result.data.message) {
        message.error(result.data.message, 3);
      } else {
        message.success("ลบระดับชั้นเรียบร้อยแล้ว", 3);
      }
    } catch (err) {
      console.log(err);
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
    }

    setAction(null);
  }

  useEffect(handleInit, [space.name, space.slug, space.classroom, space.grade]);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current.toggleMenu()}
        title="ระดับชั้น"
      />
      <Card>
        {!!space.fetching ? (
          <Progress />
        ) : (
          <Form layout="vertical">
            <Form.Item colon={false} label="ชื่อระดับชั้น/ห้องเรียน">
                    <span>
                      ป.{" "}
                      <InputNumber
                        defaultValue={space.grade}
                        onChange={(e) => setGrade(e)}
                        min={4}
                        max={6}
                        style={{ width: "50px", marginRight: "15px" }}
                      />
                      /
                      <InputNumber
                        defaultValue={space.classroom}
                        onChange={(e) => setClassroom(e)}
                        min={1}
                        style={{
                          width: "50px",
                          marginRight: "15px",
                          marginLeft: "15px",
                        }}
                      />
                      ชื่อเพิ่มเติม (ถ้ามี)
                      <Input
                        type="text"
                        //placeholder="ระดับชั้น/ห้องเรียน"
                        maxLength={50}
                        disabled={!!action}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: "500px",
                          marginRight: "50px",
                          marginLeft: "15px",
                        }}
                      />
                      แสดงชื่อที่จะใช้จริงในระบบ &nbsp;&nbsp;&nbsp;
                      {/* formatedName, use by backend parameter: name */}
                      {/* {grade ? `ป.${grade}` : ""}
                      {classroom ? `/${classroom}` : ""}
                      {grade ? " " : ""}
                      {name ? name: ""} */}
                      {formatedName}
                    </span>
                    {/* <div>{unformatedName}</div> */}
            </Form.Item>
            {/* <Form.Item colon={false} label="ชื่อระดับชั้น/ห้องเรียน">
              <Input
                type="text"
                placeholder="ระดับชั้น/ห้องเรียน"
                maxLength={50}
                disabled={!!action}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "500px",
                  marginRight: "15px",
                  marginLeft: "15px",
                }}
              />
            </Form.Item> */}
            <Form.Item
              colon={false}
              label={
                <>
                  รหัสระดับชั้น/ห้องเรียน{" "}
                  <small>
                    (ตัวอักษรภาษาอังกฤษพิมพ์เล็ก และ ตัวเลข 0 ถึง 9 ไม่เกิน 25
                    ตัวอักษร)
                  </small>
                </>
              }
              validateStatus={!!slugMessage ? "error" : undefined}
              help={slugMessage}
            >
              <Input
                type="text"
                size="large"
                placeholder="awesomeclass123"
                maxLength={25}
                disabled={!!action}
                value={slug}
                onChange={(e) => {
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                  );
                  setSlugMessage(false);
                }}
              />
            </Form.Item>
            <ActionGroup>
              <Button
                type="primary"
                disabled={!!action || !canSave}
                loading={action === "saving"}
                style={{ width: `100%` }}
                onClick={handleSubmit}
              >
                บันทึก
              </Button>
              <div style={{ minWidth: 12, maxWidth: 12 }} />
              <Button
                type="danger"
                ghost={true}
                disabled={!!action}
                loading={action === "deleting"}
                style={{ minWidth: 72, maxWidth: 72 }}
                onClick={() => {
                  Modal.confirm({
                    title: "ต้องการลบระดับชั้น",
                    content: `เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก`,
                    zIndex: 10000,
                    keyboard: false,
                    cancelText: "ยกเลิก",
                    okText: "ลบ",
                    okType: "danger",
                    onOk: () => {
                      handleDelete().catch(console.log);
                    },
                  });
                }}
              >
                ลบ
              </Button>
            </ActionGroup>
          </Form>
        )}
      </Card>
    </Parent>
  );
}

export default Comp;
