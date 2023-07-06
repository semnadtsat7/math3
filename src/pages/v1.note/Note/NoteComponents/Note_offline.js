import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

function Note({ id, title, text, category, deleteNote }) {
  return (
    <div className="note">
      <div
        style={{
          paddingBottom: "0px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        {category && (
          <button
            style={{
              padding: "0",
              height: "20px",
              margin: "0",
            }}
          >
            {category}
          </button>
        )}
      </div>
      {title.length > 0 && (
        <hr
          style={{
            borderWidth: "0",
            height: "2px",
            backgroundColor: "grey",
            width: "290px",
          }}
        />
      )}
      <div className="note__body">{text}</div>
      <div className="note__footer" style={{ justifyContent: "flex-end" }}>
        <DeleteOutlined
          className="note__delete"
          onClick={() => deleteNote(id)}
          aria-hidden="true"
        ></DeleteOutlined>
      </div>
    </div>
  );
}

export default Note;
