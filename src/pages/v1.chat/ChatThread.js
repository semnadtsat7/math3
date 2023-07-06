import React, { useState } from "react";
import Truncate from "react-truncate";
import { format, parse, subDays, compareAsc } from "date-fns";

import { FaRegUserCircle } from "react-icons/fa";

const ChatThread = ({
  spaceID,
  chatDetail,
  //userImg,
  userName,
  lastSender,
  // latestTime,
  // latestMessage,
  unread,
}) => {
  let showTime;
  const now = new Date();
  const subDay = subDays(now, 1);
  const { lastMessageAt } = chatDetail;
  const lastMessageTime = parse(
    lastMessageAt,
    "yyyy-MM-dd HH:mm:ss",
    new Date()
  );
  if (lastMessageAt) {
    showTime =
      compareAsc(subDay, lastMessageTime) < 1
        ? format(lastMessageTime, "HH:mm")
        : format(lastMessageTime, "d MMM");
  }
  // const lastMessageAt = parse();
  // console.log("sub on day", subDay);

  return (
    <>
      <div
        style={{
          marginRight: "10px",
        }}
      > 
       <FaRegUserCircle
       alt="image"
       style={{
         height: "35px",
         width: "35px",
         borderRadius: "50%",
         display: "inline-block",
       }}
       />
        {/*<img
          src={userImg}
          alt="image"
          style={{
            height: "35px",
            width: "35px",
            borderRadius: "50%",
            display: "inline-block",
          }}
        />
        */}
      </div>
      <div className="user-activity">
        <div
          className="user-name"
          style={{
            fontWeight: "600",
          }}
        >
          {userName}
        </div>
        <div className="latest-time">{showTime ? showTime : ""}</div>
        <div className="break-flex" />
        <br />
        <div className="latest-message" style={{
            color: "#696969",
          }}>
          <Truncate lines={1}>{chatDetail.lastMessage}</Truncate>
        </div>
        <div className="indicator-message">
          {unread > 0 && lastSender !== spaceID ? (
            <status-indicator negative></status-indicator>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ChatThread;
