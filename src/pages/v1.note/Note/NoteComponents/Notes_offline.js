import React, { useState, useEffect } from "react";
import "../css/Note.css";
import Note from "./Note";
import CreateNote from "./CreateNote";
import { v4 as uuid } from "uuid";

function Notes() {
  //states
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  //get the saved notes and add them to the array
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("Notes"));
    if (data) {
      setNotes(data);
    }
  }, []);

  //saving data to local storage
  useEffect(() => {
    localStorage.setItem("Notes", JSON.stringify(notes));
  }, [notes]);

  // get title and store in state
  const titleHandler = (e) => {
    setInputTitle(e.target.value);
  };

  // get text and store in state
  const textHandler = (e) => {
    setInputText(e.target.value);
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

  // add new note to the state array
  const saveHandler = () => {
    setNotes((prevState) => [
      ...prevState,
      {
        id: uuid(),
        title: inputTitle,
        text: inputText,
        category: inputCategory,
      },
    ]);
    //clear the textarea for title and text
    setInputTitle("");
    setInputText("");
    setInputCategory("");
  };

  //delete note function
  const deleteNote = (id) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
  };

  

  return (
    <div className="notes">
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          text={note.text}
          category={note.category}
          deleteNote={deleteNote}
        />
      ))}
      <CreateNote
        titleHandler={titleHandler}
        textHandler={textHandler}
        categoryHandler1={categoryHandler1}
        categoryHandler2={categoryHandler2}
        categoryHandler3={categoryHandler3}
        categoryHandler4={categoryHandler4}
        categoryHandler5={categoryHandler5}
        categoryHandler6={categoryHandler6}
        saveHandler={saveHandler}
        inputTitle={inputTitle}
        inputText={inputText}
        inputCategory={inputCategory}
      />
    </div>
  );
}
export default Notes;
