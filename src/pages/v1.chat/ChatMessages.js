import React, { useEffect, useState } from "react";
import { compareAsc, parse } from "date-fns";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatMessages = ({ spaceID, currentChat, messages }) => {
  const [sortedMessages, setSortedMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState();
  const scrollToBottom = () => {
    lastMessage.scrollIntoView();
  };

  useEffect(() => {
    setSortedMessages(
      messages.sort((a, b) =>
        compareAsc(
          parse(a.sendAt, "yyyy-MM-dd HH:mm:ss", new Date()),
          parse(b.sendAt, "yyyy-MM-dd HH:mm:ss", new Date())
        )
      )
    );
  }, [messages, currentChat]);

  const checkMessageRead = (fromIdx) => {
    if (currentChat.lastSender !== spaceID) return true;
    const unReadCount = currentChat.unReadCount || 0;
    return fromIdx < sortedMessages.length - unReadCount;
    let read = false;
    for (let i = fromIdx; i <= sortedMessages.length; i++) {
      if (!messages[i]) {
        break;
      }
      if (messages[i].sendBy !== spaceID) {
        read = true;
        break;
      }
    }
    if (!read) {
      read = currentChat.unReadCount === 0;
    }
    return read;
  };

  useEffect(() => {
    sortedMessages.length > 0 && scrollToBottom();
  }, [sortedMessages]);

  return (
    <div className="message-box">
      {sortedMessages.map((message, idx) => (
        <div key={idx} className="message">
          {message.sendBy === spaceID ? (
            <>
              <div className="own-message">
                <p className="chat-message">{message.message}</p>
                {!checkMessageRead(idx) ? (
                  <div style={{ height: "10px" }}>
                    <p className="message-read"></p>
                  </div>
                ) : (
                  <p className="message-read">Read</p>
                )}
              </div>
            </>
          ) : (
            <div className="another-message">
              <p className="chat-message">{message.message}</p>
            </div>
          )}
        </div>
      ))}
      <div
        style={{ float: "left", clear: "both" }}
        ref={(el) => {
          setLastMessage(el);
        }}
      ></div>
    </div>
  );
};

export default ChatMessages;
