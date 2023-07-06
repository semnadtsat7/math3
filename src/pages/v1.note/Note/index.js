import React, { useRef } from "react";
import "../Note/css/index.css";
import Notes from "../Note/NoteComponents/Notes";
import Parent from "../../../components/Parent";
import Header from '../../students.ts.v1/Header';
//import Header from "../Note/NoteComponents/Header";

function PageNote() {
  const parent = useRef(Parent);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent?.current?.toggleMenu()}
        title={"โน้ต"}
      />
      <br/>
      <div className="main">
        {/* <Header /> */}
        <Notes />
      </div>
    </Parent>
  );
}
export default PageNote;
