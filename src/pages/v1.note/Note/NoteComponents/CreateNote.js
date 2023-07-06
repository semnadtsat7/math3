import React, { useState } from "react";
import { SwatchesPicker } from "react-color";
import { Modal } from "antd";
//import LinearProgress from "@mui/material/LinearProgress";

function CreateNote({
  textHandler,
  inputText,
  saveHandler,
  inputTitle,
  titleHandler,
  categoryHandler1,
  categoryHandler2,
  categoryHandler3,
  categoryHandler4,
  categoryHandler5,
  categoryHandler6,
  inputCategory,
  colorHandler,
  inputColor,
  colorCancelHandler,
}) {
  //character limit
  const charLimit = 500;
  const charLeft = charLimit - inputText.length;

  //modal for color picker
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    colorCancelHandler();
  };

  return (
    <div className="note" style={{ background: "rgba(255, 255, 255, 0)" }}>
      <textarea
        style={{
          padding: "0",
        }}
        cols="10"
        rows="1"
        value={inputTitle}
        placeholder="หัวข้อ..."
        onChange={titleHandler}
        maxLength="50"
      ></textarea>
      <hr
        style={{
          borderWidth: "0",
          height: "2px",
          backgroundColor: "grey",
          width: "290px",
        }}
      />
      <textarea
        cols="10"
        rows="5"
        value={inputText}
        placeholder="พิม..."
        onChange={textHandler}
        maxLength="500"
      ></textarea>
      <span className="label">เหลือ {charLeft} อักษร</span>
      <p className="category">ประเภท</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          className={inputCategory === "ทั่วไป" ? "categoryActive" : "category"}
          onClick={categoryHandler1}
        >
          ทั่วไป
        </button>
        <button
          className={inputCategory === "กลุ่ม" ? "categoryActive" : "category"}
          onClick={categoryHandler2}
        >
          กลุ่ม
        </button>
        <button
          className={inputCategory === "นร." ? "categoryActive" : "category"}
          onClick={categoryHandler3}
        >
          นร.
        </button>
        <button
          className={
            inputCategory === "บทเรียน" ? "categoryActive" : "category"
          }
          onClick={categoryHandler4}
        >
          บทเรียน
        </button>
        <button
          className={inputCategory === "ข้อสอบ" ? "categoryActive" : "category"}
          onClick={categoryHandler5}
        >
          ข้อสอบ
        </button>
        <button
          className={
            inputCategory === "การบ้าน" ? "categoryActive" : "category"
          }
          onClick={categoryHandler6}
        >
          การบ้าน
        </button>
      </div>

      <div className="note__footer">
        <button className="note__save" onClick={saveHandler}>
          บันทึก
        </button>
        <div
          style={{
            height: "38px",
            width: "100px",
          }}
        >
          <button className="note__inputColor" onClick={showModal}>
            เลือกสี
          </button>
          <span
            style={{
              // height: "24px",
              // width: "24px",
              padding: "4px 24px 4px 1px",
              marginLeft: "10px",
              marginTop: "12px",
              border: "1px solid black",
              borderRadius: "4px",
              backgroundColor: inputColor,
              cursor: "default",
            }}
          />
        </div>
        <Modal
          title="เลือกสีพื้นหลังของโน้ต"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText={"ยกเลิก"}
          okText={"ตกลง"}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SwatchesPicker
              color={inputColor}
              onChangeComplete={(e) => colorHandler(e)}
            />
          </div>
        </Modal>
      </div>
      {/* <LinearProgress
        className="char__progress"
        variant="determinate"
        value={charLeft}
      /> */}
    </div>
  );
}
export default CreateNote;
