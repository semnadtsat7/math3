import React, { useState, useEffect } from "react";

import styled from "styled-components";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SendIcon from "@material-ui/icons/Send";
import { Typography } from "@material-ui/core";
import { compareAsc, parse } from "date-fns";
import MenuButton from "../../components/MenuButton";
import ActionBar from "../../components/ActionBar";
import initialChats from "../../images/comments.png";
import ChatMessages from "./ChatMessages";

import EmojiPicker from "emoji-picker-react";
import { SmileOutlined } from "@ant-design/icons";

const ChatBody = styled.div`
  position: fixed !important;
  margin-left: 250px;
  overflow-x: hidden;
  z-index: 1;
  top: 0;
  left: 0;

  height: calc(100% - 50px);
  width: calc(100% - 250px);

  ${(props) =>
    !props.expand &&
    `
    margin-left:0px;
    width: 100%;
  `}

  ${({ expand, mobile }) =>
    expand &&
    mobile &&
    `
    background-color: rgba(0,0,0,0.4);
    margin-left:250px;
    width: 100%
  `}
`;

const ChatInputMessage = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  text-align: left;
  display: flex;
  justify-content: center;
  width: calc(100% - 250px);
  align-items: center;
  background-color: white;
  border-top: 1px solid rgb(0, 0, 0, 0.1);

  ${(props) =>
    !props.expand &&
    `
    width: 100%;
  `}

  ${({ expand, mobile }) =>
    expand &&
    mobile &&
    `
    width: 100%
  `}
`;

const LIMITCHATMESSAGE = 150;

const Chat = ({
  spaceID,
  realTimeDB,
  currentChat,
  onSendMessage,
  typingMessage,
  onChangeTypingMessage,
  mobile,
  expand,
  setExpand,
  onEmojiClick,
  toggleEmojiPicker,
  isEmojiPickerVisible, 
}) => {
  const [messages, setMessages] = useState([]);
  const [ref, setRef] = useState();

  useEffect(() => {
    if (Object.keys(currentChat).length > 0 && ref) {
      ref.on("value", function (snapshot) {
        if (snapshot.val() !== null) {
          if (
            Object.keys(messages).length !== Object.keys(snapshot.val()).length
          ) {
            const allMessage = [];
            snapshot.forEach(function (childSnapshot) {
              const childData = childSnapshot.val();
              allMessage.push({ ...childData, key: childSnapshot.key });
            });
            if (allMessage.length > LIMITCHATMESSAGE) {
              const sortedAllMessage = allMessage.sort((a, b) =>
                compareAsc(
                  parse(a.sendAt, "yyyy-MM-dd HH:mm:ss", new Date()),
                  parse(b.sendAt, "yyyy-MM-dd HH:mm:ss", new Date())
                )
              );
              console.log("sortedAllMessage", sortedAllMessage);
              const deleteRef = realTimeDB
                .database()
                .ref(`messages/${currentChat.id}/${sortedAllMessage[0].key}`);
              deleteRef.remove();
              console.log("delete ref", sortedAllMessage[0]);
            }
            setMessages(allMessage);
          }
        }
      });
    }
  }, [ref]);

  useEffect(() => {
    setMessages([]);
    if (ref) ref.off("value");
    setRef(realTimeDB.database().ref(`messages/${currentChat.id}`));
  }, [currentChat.id]);

  return (
    <ChatBody
      expand={expand}
      mobile={mobile}
      onClick={() => mobile && expand && setExpand(false)}
    >
      <ActionBar>
        <MenuButton onClick={() => setExpand(!expand)} />
        <Typography
          variant="subtitle2"
          color="inherit"
          noWrap
          style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }}
        >
          {currentChat.student?.name
            ? currentChat.student.name
            : "เลือกคู่สนทนา"}
        </Typography>
      </ActionBar>
      {Object.keys(currentChat).length === 0 ? (
        <div>
          <img
            src={initialChats}
            style={{
              marginTop: "200px",
              opacity: "0.6",
              marginRight: "auto",
              marginLeft: "auto",
              display: "block",
              width: "100px ",
            }}
          />
          <h3 style={{ opacity: "0.6", textAlign: "center" }}>
            start new conversation
          </h3>
        </div>
      ) : (
        <>
          <ChatMessages
            spaceID={spaceID}
            currentChat={currentChat}
            messages={messages}
          />
          <ChatInputMessage expand={expand} mobile={mobile}>
            <input
              disabled={expand && mobile}
              onKeyDown={(e) => e.key === "Enter" && onSendMessage(e)}
              className="input-chat"
              placeholder="พิมพ์ข้อความ...."
              type="text"
              value={typingMessage}
              style={{
                height: "50%",
                fontSize: "12px",
                width: "85%",
                backgroundColor: "rgb(0,0,0,0.05)",
                color: "#2d2d2d",
              }}
              onChange={(e) => onChangeTypingMessage(e.target.value)}
            />

            <button
              onClick={toggleEmojiPicker}
              style={{
                backgroundColor: "#4E89FF",
                border: "none",
                borderRadius: "4px",
                width: "26px",
                height: "26px",
                cursor: "pointer",
              }}
            >
              <SmileOutlined style={{ color: "#FFFFFF" }} />
            </button>

            {isEmojiPickerVisible ? (
              <div
                style={{
                  position: "relative",
                  bottom: "150px",
                  marginLeft: "10px",
                }}
              >
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            ) : null}

            <ListItemIcon>
              <SendIcon
                disabled={currentChat.id === undefined}
                onClick={(e) => onSendMessage(e)}
                style={{
                  cursor: "pointer",
                  color: "#2D89FF",
                  fontSize: "30px",
                  marginLeft: "10px",
                }}
              />
            </ListItemIcon>
          </ChatInputMessage>
        </>
      )}
    </ChatBody>
  );
};

export default Chat;
