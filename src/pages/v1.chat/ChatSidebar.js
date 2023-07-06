import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { parse, isBefore } from "date-fns";
import { Link } from "react-router-dom";

import ChatThread from "./ChatThread";
import Progress from "../../components/Progress";

const Sidebar = styled.div`
  /* margin-top: 60px;
  height: calc(100% - 60px); */
  height: 100%;
  width: 250px;
  z-index: 1900;
  /* position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden; */
  background-color: white;
  ${(props) =>
    !props.expand &&
    `
    display: none;
  `}
`;

const SidebarContent = styled.div`
  background-color: white;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  color: black;
  z-index: 1900;
  width: 250px;
  margin-top: 86px;
  height: calc(100% - 86px);
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
`;

const Search = styled.div`
  height: 30px;
  width: 250px;
  z-index: 1900;
  text-align: center;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
`;

const Header = styled.h1`
  z-index: 1900;
  font-family: "Sarabun", sans-serif;
  width: 250px;
  font-size: 14px;

  box-sizing: border-box;

  min-height: 56px;
  max-height: 56px;
  /* line-height: 48px; */

  margin: 0;
  padding: 0 16px;

  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.2);

  overflow: hidden;
  white-space: nowrap;

  color: black;
  font-weight: bold;
  display: flex;
  flex-direction: column;

  justify-content: center;

  small {
    margin-top: 2px;
    opacity: 0.5;
  }
`;

const ChatSidebar = ({
  spaceID,
  chats,
  currentChat,
  setCurrentChat,
  mobile,
  expand,
  setExpand,
}) => {
  const [search, setSearch] = useState("");
  const [chatDetails, setChatDetails] = useState(null);

  const handleSearch = (searchName) => {
    setSearch(searchName);
    if (searchName === "") {
      setChatDetails(chats);
    } else {
      const filteredChatDetails = chats.filter((chatDetail) => {
        return chatDetail.student.name.includes(searchName);
      });
      setChatDetails(filteredChatDetails);
    }
  };

  const sortChats = (a, b) => {
    // 2020-10-16 03:35:36
    const dateFormat = "yyyy-MM-dd HH:mm:ss";
    const now = new Date();
    if (a.lastMessageAt && b.lastMessageAt) {
      const aTime = parse(a.lastMessageAt, dateFormat, now);
      const bTime = parse(b.lastMessageAt, dateFormat, now);
      if (isBefore(aTime, bTime)) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (a.lastMessageAt) {
        return -1;
      } else if (b.lastMessageAt) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  useEffect(() => {
    setChatDetails(chats);
  }, [chats]);

  return (
    <Sidebar expand={expand}>
      <Header>
        <div style={{ display: "flex" }}>
          <Link to="/">
            <ListItemIcon>
              <KeyboardBackspaceIcon style={{ color: "black" }} />
            </ListItemIcon>
          </Link>
          Clever Math Messenger
          {/* <ChatIcon inbox={inbox} /> */}
        </div>
      </Header>
      <Search>
        <input
          className="input-search"
          style={{
            width: "95%",
            height: "70%",
            fontSize: "10px",
            backgroundColor: "#d1d1d1",
          }}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ค้นหา Messenger"
          type="text"
        />
      </Search>
      <SidebarContent>
        <div className="user-list">
          {chatDetails === null && (
            <div className="sidebar-loading">
              <Progress />
            </div>
          )}
          {chatDetails &&
            chatDetails.length !== 0 &&
            chatDetails.sort(sortChats).map((chatDetail, idx) => (
              <div
                className="user"
                key={chatDetail.id}
                onClick={() => {
                  setCurrentChat(chatDetail);
                  mobile && setExpand(false);
                }}
                style={{ /* to change hover link color, go to chat.scss -> .user -> background-color */
                  background: chatDetail.id === currentChat.id && "#e5e6ec", /* visited link color */
                  cursor: "pointer",
                  height: "60px",
                }}
              >
                <ChatThread
                  spaceID={spaceID}
                  chatDetail={chatDetail}
                  userImg="https://upload.wikimedia.org/wikipedia/commons/1/14/Gatto_europeo4.jpg"
                  userName={chatDetail.student.name}
                  lastSender={chatDetail.lastSender}
                  unread={chatDetail.unReadCount}
                />
              </div>
            ))}
          {chatDetails && chatDetails.length === 0 && (
            <div className="sidebar-loading">
              <p>ไม่พบข้อมูล</p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
