import React, { useState, useEffect, useRef } from "react";
import Parent from "../../../components/Parent";

import { Input, Button, message } from "antd";
import styled from "styled-components";

import { StudentService } from "../../../services/Statistics";

const Container = styled.div`
  padding: 16px;
`;

function PageStudentPin() {
  const parent = useRef(Parent);

  const [action, setAction] = useState("");
  const [slug, setSlug] = useState([]);
  const [customId, setCustomId] = useState([]);

  const [className, setClassName] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [pin, setPin] = useState([]);

  const disabled = !!action;

  function handleChangeSlug(e) {
    setSlug(e.target.value);
    //console.log(slug);
  }

  function handleChangeCustomId(e) {
    setCustomId(e.target.value.replace(/[^0-9.]/gi, ""));
    //console.log(customId);
  }

  const clear = () => {
    setSlug("");
    setCustomId("");
    setClassName("");
    setStudentName("");
    setPin("");
  };

  const getStudentPin = () => {
    try {
      setAction("query");
      StudentService.getStudentPinAsync({
        slug: slug,
        customId: customId,
      }).then((res) => {
        console.log(res);
        setClassName(res.className);
        setStudentName(res.studentName);
        setPin(res.pin);
        res?.pin?.length > 3 &&
          message.success("เรียกรหัสPINนักเรียนเรียบร้อย", 3);
        !res?.pin && message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      });
    } catch (err) {
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      console.error(err);
      console.log(err);
    } finally {
      setAction("");
    }
  };

  return (
    <Parent ref={parent}>
      <div>
        <Container>
          {action === "loading" ? (
            `กำลังโหลด...`
          ) : (
            <>
              <form onSubmit={getStudentPin}>
                <Input
                  required
                  key="slug"
                  type="text"
                  value={slug}
                  disabled={disabled}
                  //onChange={(e) => setSlug(e.target.value)}
                  onChange={handleChangeSlug}
                  placeholder="รหัสระดับชั้น"
                  maxLength={50}
                />
                <div style={{ height: 16 }} />
                <Input
                  required
                  key="customId"
                  type="text"
                  value={customId}
                  disabled={disabled}
                  //onChange={(e) => setCustomId(e.target.value)}
                  onChange={handleChangeCustomId}
                  placeholder="รหัสนักเรียน"
                  maxLength={10}
                />
                <Button
                  type="primary"
                  disabled={disabled}
                  onClick={getStudentPin}
                >
                  {action === "query" ? "กำลังค้นหาPIN" : "ค้นหาPIN"}
                </Button>
                <Button
                  type="secondary"
                  disabled={disabled}
                  onClick={clear}
                  style={{ marginLeft: "10px" }}
                >
                  {action === "query" ? "กำลังค้นหาPIN" : "รีเซ็ต"}
                </Button>
              </form>
              <br />
              <Container>
                <p>ห้องเรียน: {className}</p>
                <p>ชื่อนักเรียน: {studentName}</p>
                <p>รหัสPINนักเรียน: {pin}</p>
              </Container>
            </>
          )}
        </Container>
      </div>
    </Parent>
  );
}

export default PageStudentPin;
