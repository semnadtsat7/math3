import React, { useContext, useState, useEffect } from "react";
import "./chat.scss";

import { format, parse, isBefore } from "date-fns";
import * as Api from "../../utils/QueryAPI";
import { RootContext } from "../../root";
import moment from "moment";
import ChatSidebar from "./ChatSidebar";
import ChatNav from "./ChatNav";
import MenuDrawer from "../../components/MenuDrawer";
import Chat from "./Chat";
import Firebase from "../../utils/Firebase";

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};

const ChatPage = () => {
  const [state, setState] = useState("initial");
  const [typingMessage, setTypingMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [chatIds, setChatIds] = useState([]);
  const [chatThreads, setChatThreads] = useState(null);
  const [expand, setExpand] = useState(true);
  const [mobile, setMobile] = useState(false);
  const { spaceID } = useContext(RootContext);
  const options = { accurate: false };
  const windowSize = useWindowSize();

  //Emoji Picker
  //const [typingMessage, setTypingMessage] = useState('');
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setTypingMessage(prevInput => prevInput + emojiObject.emoji);
    setEmojiPickerVisible((prev) => !prev);
  };
  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  }; 
  //

  const filter = {
    groupID: "none",
    sheetID: "none",
    title: "none",
    startAt: moment().endOf("day").valueOf(),
    endAt: moment(moment().endOf("day").valueOf())
      .subtract(1, "year")
      .startOf("day"),
  };

  useEffect(() => {
    Firebase.database()
      .ref(`userChats/${spaceID}`)
      .on("value", function (snapshot) {
        if (snapshot.val() !== null && chatIds.length !== snapshot.val()) {
          setChatIds(Object.values(snapshot.val()));
        }
      });
  }, [spaceID]);

  useEffect(() => {
    chatIds.forEach((chatId) => {
      Firebase.database()
        .ref(`chats/${chatId}`)
        .on("value", (snapshot) => {
          if (snapshot.val() !== null) {
            let tempChatThreads = chatThreads;
            const chat = snapshot.val();
            let existingIdx;
            // current chat cannot read
            if (chat.id === currentChat.id && chat.unReadCount !== 0) {
              Firebase.database()
                .ref("chats")
                .child(currentChat.id)
                .child("unReadCount")
                .set(0);
            }

            tempChatThreads.forEach((chatThread, idx) => {
              if (chatThread.id === chat.id) {
                existingIdx = idx;
              }
            });

            if (existingIdx !== undefined) {
              tempChatThreads.splice(existingIdx, 1);
            }

            tempChatThreads.push({ ...chat });
            setChatThreads([...tempChatThreads]);
          }
        });
    });
    if (chatIds.length === 0) setChatThreads([]);
  }, [chatIds]);

  const handleChangeChat = (chatDetail) => {
    if (chatDetail.lastSender !== spaceID) {
      Firebase.database()
        .ref("chats")
        .child(chatDetail.id)
        .child("unReadCount")
        .set(0);
    }
    setCurrentChat(chatDetail);
  };

  const getChatThreads = () => {};

  const createThreads = async (students) => {
    // create chat thread follow the own students from fireStore
    const chatThreads = await Promise.all(
      students.map(async (student) => {
        const chatID = `${spaceID}_${student._id}`;
        const eventRef = await Firebase.database().ref("chats").child(chatID);
        const snapshot = await eventRef.once("value");
        let chatDetail;
        if (snapshot.val() === null) {
          chatDetail = {
            id: chatID,
            teacherID: spaceID,
            student: {
              id: student._id,
              name: student.name,
            },
            unReadCount: 0,
          };
          await Firebase.database().ref("chats").child(chatID).set(chatDetail);
          Firebase.database().ref("userChats").child(student._id).push(chatID);
          Firebase.database()
            .ref()
            .child("userChats")
            .child(spaceID)
            .push(chatID);
        } else {
          chatDetail = snapshot.val();
        }
        return chatDetail;
      })
    );

    return chatThreads;
  };

  const getStudents = async () => {
    const payload = {
      name: "students",
      data: { spaceID, filter, options },
    };
    const data = await Api.exec("page_v2", payload);
    const { students } = data;
    setChats(await createThreads(students));
    setState("pending");
  };

  useEffect(() => {
    if (currentChat.id) {
      setCurrentChat(
        chatThreads.find((chatThread) => chatThread.id === currentChat.id)
      );
    }
  }, [chatThreads]);

  useEffect(() => {
    switch (state) {
      case "initial":
        getStudents();
        break;
      case "pending":
        getChatThreads();
        break;
      case "rendered":
        break;
      default:
        break;
    }
  }, [state]);

  useEffect(() => {
    const isMobile = windowSize.width <= 1024;
    setMobile(isMobile);

    if (expand) {
      if (windowSize.width < 1024) {
        setExpand(false);
      }
    } else {
      if (windowSize.width >= 1024) {
        setExpand(true);
      }
    }
  }, [windowSize]);

  const onSendMessage = async (e) => {
    if (typingMessage.trim() === "") {
      return;
    }
    const now = new Date();
    const dateTime = format(now, "yyyy-MM-dd HH:mm:ss");
    const sendBy = currentChat.teacherID;
    const messageID = `${sendBy}_${format(now, "ddMMyyyyHHmmss")}`;
    const fnName = "chat-send";
    const data = {
      sendBy: sendBy,
      chatId: currentChat.id,
      message: typingMessage,
    };
    Firebase.functions().httpsCallable("chat-send")({
      sendBy: sendBy,
      chatId: currentChat.id,
      message: typingMessage,
    });
    setTypingMessage("");
  };

  return (
    <div className="chat-page">
      <ChatSidebar
        spaceID={spaceID}
        realTimeDB={Firebase}
        chats={chatThreads}
        currentChat={currentChat}
        setCurrentChat={handleChangeChat}
        mobile={mobile}
        expand={expand}
        setExpand={setExpand}
      />

      <Chat
        spaceID={spaceID}
        realTimeDB={Firebase}
        currentChat={currentChat}
        onSendMessage={onSendMessage}
        typingMessage={typingMessage}
        onChangeTypingMessage={setTypingMessage}
        mobile={mobile}
        expand={expand}
        setExpand={setExpand}
        onEmojiClick={onEmojiClick}
        toggleEmojiPicker={toggleEmojiPicker}
        isEmojiPickerVisible={isEmojiPickerVisible}
      />
    </div>
  );
};

export default ChatPage;
