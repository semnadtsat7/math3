import React, { useState, useEffect } from "react";
import "../css/Note.css";
import Note from "./Note";
import CreateNote from "./CreateNote";

import { TeacherService } from "../../../../services/Statistics";
import { message } from "antd";

function Notes() {
  //states
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputColor, setInputColor] = useState("#fff7d6");

  // get title and store in state
  const titleHandler = (e) => {
    setInputTitle(e.target.value);
  };

  // get text and store in state
  const textHandler = (e) => {
    setInputText(e.target.value);
  };

  // get color and store in state
  const colorHandler = (e) => {
    setInputColor(e.hex);
  };
  //reset color to default on cancel button
  const colorCancelHandler = (e) => {
    setInputColor("#fff7d6");
  };


  // set category and store in state
  const categoryHandler1 = () => {
    setInputCategory("ทั่วไป");
  };
  const categoryHandler2 = () => {
    setInputCategory("กลุ่ม");
  };
  const categoryHandler3 = () => {
    setInputCategory("นร.");
  };
  const categoryHandler4 = () => {
    setInputCategory("บทเรียน");
  };
  const categoryHandler5 = () => {
    setInputCategory("ข้อสอบ");
  };
  const categoryHandler6 = () => {
    setInputCategory("การบ้าน");
  };

  const [userNotesData, setUserNotesData] = useState([]);

  //get
  useEffect(() => {
    TeacherService.getUserNotesAsync().then((res) => {
      if (res.error) {
        setUserNotesData({
          ...userNotesData,
          error: res.error,
        });
      } else {
        setUserNotesData(res);
      }
    });
  }, []);

  //delete
  const handleDelete = async (noteId) => {
    message.info("กำลังดำเนินการ . . .");

    TeacherService.deleteUserNotesAsync(noteId)
      .then((response) => {
        message.success("ลบโน้ตเรียบร้อยแล้ว", 3);
      })
      .catch((error) => {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      })
      .finally(() => {
        TeacherService.getUserNotesAsync().then((res) => {
          if (res.error) {
            setUserNotesData({
              ...userNotesData,
              error: res.error,
            });
          } else {
            setUserNotesData(res);
          }
        });
      });
  };

  //create
  function handleSubmit() {
    message.info("กำลังดำเนินการ . . .");

    TeacherService.createUserNotesAsync({
      category: inputCategory,
      title: inputTitle,
      text: inputText,
      hexcode: inputColor,
    })
      .then((response) => {
        message.success("บันทึกข้อมูลเรียบร้อยแล้ว", 3);
      })
      .catch((error) => {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      })
      .finally(() => {
        //clear the textarea for title and text
        setInputTitle("");
        setInputText("");
        setInputCategory("");
        setInputColor("#fff7d6");

        TeacherService.getUserNotesAsync().then((res) => {
          if (res.error) {
            setUserNotesData({
              ...userNotesData,
              error: res.error,
            });
          } else {
            setUserNotesData(res);
          }
        });
      });
  }

  const onClick = () => {
    //console.log(userNotesData);
    console.log(inputColor);
  };

  return (
    <div className="notes">
      {/* <div onClick={onClick}>test</div> */}

      {userNotesData.map((note) => (
        <Note
          key={note.noteId}
          title={note.title}
          text={note.text}
          category={note.category}
          handleDelete={handleDelete}
          noteId={note.noteId}
          hexcode={note.hexcode} //inputColor for note background
        />
      ))}

      <CreateNote
        titleHandler={titleHandler}
        textHandler={textHandler}
        colorHandler={colorHandler}
        categoryHandler1={categoryHandler1}
        categoryHandler2={categoryHandler2}
        categoryHandler3={categoryHandler3}
        categoryHandler4={categoryHandler4}
        categoryHandler5={categoryHandler5}
        categoryHandler6={categoryHandler6}
        saveHandler={handleSubmit}
        inputTitle={inputTitle}
        inputText={inputText}
        inputCategory={inputCategory}
        inputColor={inputColor}
        colorCancelHandler={colorCancelHandler}
      />
    </div>
  );
}
export default Notes;
