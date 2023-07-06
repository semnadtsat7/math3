import React from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { Link } from "react-router-dom";

const ChatNav = ({ currentChat }) => (
  <div className="nav">
    <div className="sidebar-header">
      <div className="back-btn">
        <Link to="/">
          <ListItemIcon>
            <KeyboardBackspaceIcon style={{ color: "white" }} />
          </ListItemIcon>
        </Link>
      </div>

      <div className="header"></div>
    </div>
    <div className="chat-with">{currentChat.student?.name || ""}</div>
  </div>
);

export default ChatNav;
