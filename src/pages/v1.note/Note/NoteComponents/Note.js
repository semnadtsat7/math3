import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

function Note({ title, text, category, handleDelete, noteId, hexcode }) {
  return (
    <div
      className="note"
      style={{
        backgroundColor: hexcode,
      }}
    >
      <div
        style={{
          paddingBottom: "0px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}

        {title && category && <button className="category">{category}</button>}

        {!title && category && (
          <div style={{ marginLeft: "auto" }}>
            <button className="category">{category}</button>
          </div>
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

      {!title && <div style={{ marginTop: "10px" }} />}

      <div className="note__body">{text}</div>
      <div className="note__footer" style={{ justifyContent: "flex-end" }}>
        <DeleteOutlined
          className="note__delete"
          onClick={() => handleDelete(noteId)}
          aria-hidden="true"
        ></DeleteOutlined>
      </div>
    </div>
  );
}

export default Note;
