import React, { useState, useEffect, useContext } from "react";

import { NavLink, useLocation, Link } from "react-router-dom";

import styled from "styled-components";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import { RootContext } from "../root";
import commentIcon from "../images/comment.png";
import StatusIndicator from "./StatusIndicator";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { SvgIconProps } from "@material-ui/core/SvgIcon";

import PeopleIcon from "@material-ui/icons/People";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarsIcon from "@material-ui/icons/Stars";
import CheckIcon from "@material-ui/icons/CheckCircle";
import MissionIcon from "@material-ui/icons/AssistantPhoto";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
// import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
import HelpIcon from "@material-ui/icons/Help";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import primaryColor from "@material-ui/core/colors/lightBlue";

import Firebase from "./../utils/Firebase";
import Config from "../config";

import Spaces from "./menu.spaces";
import { Spin } from "antd";
import { Box } from "../core/components";

import {
  DashboardOutlined,
  Person,
  School,
  GroupWork,
} from "@material-ui/icons/";
import { UserService } from "../services/User";
//import { setTimeout } from "timers";
const theme = createMuiTheme({
  typography: {
    // Use the system font over Roboto.
    fontFamily: "Sarabun, sans-serif",
    htmlFontSize: 18,
    useNextVariants: true,
  },

  palette: {
    type: "dark",
  },
});

const dialogTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: primaryColor,
  },

  typography: {
    fontFamily: "Sarabun, sans-serif",
    useNextVariants: true,
  },
});

const Header = styled.h1`
  font-family: "Sarabun", sans-serif;

  font-size: 14px;

  box-sizing: border-box;

  min-height: 56px;
  max-height: 56px;
  /* line-height: 48px; */

  margin: 0;
  padding: 0 16px;

  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  overflow: hidden;
  white-space: nowrap;

  color: white;
  font-weight: bold;

  display: flex;
  flex-direction: column;

  justify-content: center;

  small {
    margin-top: 2px;
    opacity: 0.5;
  }
`;

const Content = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const Footer = styled.div`
  font-family: "Sarabun", sans-serif;

  font-size: 10px;
  line-height: 14px;

  color: rgba(235, 255, 255, 0.5);

  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.2);

  /* min-width: 200px; */

  min-height: 40px;
  max-height: 40px;

  padding: 0 16px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  white-space: nowrap;
`;

interface MenuItemProps {
  nested?: boolean;
  hilight?: boolean;
  hover?: boolean;
}

// const Indicator = createClass({
//   render: function () {
//     return ;
//   },
// });
// const Indicator = React.createClass({
//   render: function () {
//     return <status-indicator negative></status-indicator>;
//   },
// });

const ChatIcon = (props: any) => {
  const inbox = props.inbox;

  return (
    <Link to="/chat">
      <div style={{ float: "right", position: "relative" }}>
        <img src={commentIcon} style={{ filter: "brightness(0) invert(1)" }} />
        {inbox && <StatusIndicator />}
      </div>
    </Link>
  );
};

const MenuItem = styled(ListItem) <MenuItemProps>`
  && {
    padding-left: 12px;
    padding-right: 12px;

    > :nth-child(2) {
      padding-left: 0px;
      padding-right: 2px;
    }

    ${(props) =>
    props.nested &&
    `
      background: rgba(0,0,0, 0.1);
    `}

    ${(props) =>
    props.hover &&
    `
      background: ${primaryColor[800]};
    `}

    &:hover {
      background: ${primaryColor[500]};
    }

    &:active {
      background: ${primaryColor[700]};
    }

    ${(props) =>
    !props.hilight &&
    `
      &.active
      {
        background: ${primaryColor[400]};
        pointer-events: none;
      }
    `}

    ${(props) =>
    props.hilight &&
    `
      &.active
      {
        background: ${primaryColor[400]};
      }
    `}
  }
`;

interface ItemProps {
  icon: React.ComponentType<SvgIconProps>;
  text: React.ReactNode | string | number;
  path: string;
}

const prefix = "";
const textStyle = { fontSize: "0.8rem" };
const Item: React.FC<ItemProps> = ({ icon, text, path }) => {
  const location = useLocation();

  return (
    <MenuItem
      button
      hover={location.pathname.startsWith(`${prefix}${path}`)}
      component={({ className, children }) => {
        return (
          <NavLink className={className} to={`${prefix}${path}`} exact>
            {children}
          </NavLink>
        );
      }}
    >
      <ListItemIcon>
        {React.createElement(icon, { fontSize: "small" })}
      </ListItemIcon>
      <ListItemText
        inset
        primary={text}
        primaryTypographyProps={{ style: textStyle }}
      />
    </MenuItem>
  );
};

const Comp: React.FC = () => {
  const [signOutPrompt, setSignOutPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [inbox, setInbox] = useState(false);
  const { spaceID } = useContext(RootContext);
  const [chatThreads, setChatThreads] = useState([] as any);
  const [chatIds, setChatIds] = useState([]);

  const currentYear = new Date().getFullYear();

  const title = "NextGen Education";
  const [loading, setLoading] = useState(true);
  const [currentItems, setCurrentItems] = useState([...Config.items_1]);
  const [showSpace, setShowSpace] = useState(false);
  const [retryToggle, setRetryToggle] = useState(0);

  function handleSignOutPromptOpen() {
    setSignOutPrompt(true);
  }

  function handleSignOutPromptClose() {
    setSignOutPrompt(false);
  }

  function handleSignOut() {
    handleRemove();
    setSignOutPrompt(false);
    Firebase.auth().signOut();
    window.history.replaceState(null, "New Page Title", "/")
  }

  function handleRemove() {
    localStorage.clear();
    window.localStorage.clear();
  }

  function handleMount() {
    const auth = Firebase.auth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user?.email || "");
      }
    });

    return function () {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }

  const local_id = window.localStorage.getItem("local_id");
  const _roles = window.localStorage.getItem("roles");
  const _positions = window.localStorage.getItem("positions");
  const _schoolId = window.localStorage.getItem("schoolId");
  const _provinceId = window.localStorage.getItem("provinceId");
  useEffect(() => {

    if (!_roles && !_positions) {
      setLoading(true);
      setTimeout(() => {
        if (retryToggle < 5) {
          console.log("retryToggle");
          setRetryToggle(retryToggle + 1)
        }
      }, 1000);
    } else {
      setLoading(true);
      refreshItem(_roles as string, _positions as string);
      setLoading(false);
    }
  }, [local_id, _roles, _positions, _schoolId, _provinceId, retryToggle]);

  function refreshItem(rawRoles: string, rawPositions: string) {
    const _items = [...Config.items_1].filter(
      (x) => {

        if (x.positions[0] === "All" && x.roles[0] === "All") return true

        if (rawRoles === "User") {
          return x.positions.indexOf(rawPositions) !== -1
        } else {
          return x.roles.indexOf(rawRoles) !== -1
        }
      }
    );

    if (_items.find(e => e.path === '/info')) { setShowSpace(true) }
    if (_positions == 'S-4' && _roles == 'User') { setShowSpace(true) }
    if (_positions == 'S-2' && _roles == 'User') { setShowSpace(true) }

    // if (_items.length > 0) {
    setCurrentItems(_items);
    // }
  }

  useEffect(handleMount, []);

  useEffect(() => {
    chatIds.forEach((chatId) => {
      Firebase.database()
        .ref(`chats/${chatId}`)
        .on("value", (snapshot: any) => {
          if (snapshot.val() !== null) {
            let tempChatThreads: any = chatThreads;
            const chat = snapshot.val();
            let existingIdx;
            tempChatThreads.forEach((chatThread: any, idx: any) => {
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
  }, [chatIds]);

  useEffect(() => {
    setInbox(
      chatThreads.some(
        (chatThread: any) =>
          chatThread.unReadCount > 0 && chatThread.lastSender !== spaceID
      )
    );
  }, [chatThreads]);

  useEffect(() => {
    let chatIds: any[] = [];
    Firebase.database()
      .ref(`userChats/${spaceID}`)
      .on("value", function (snapshot) {
        if (snapshot.val() !== null && chatIds.length !== snapshot.val()) {
          setChatIds(Object.values(snapshot.val()));
        }
      });
  }, [spaceID]);

  return (
    <MuiThemeProvider theme={theme}>
      <Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          Clever Math {Config?.env != "prod" ? Config.env : ""}
          <ChatIcon inbox={inbox} />
        </div>
        <small>{email}</small>
        {Config?.env != "prod" ? <small>{_roles + " " + _positions}</small> : ""}
      </Header>
      {showSpace && <Spaces />}
      <Content>
        {loading ? (
          <div className="text-center mt-xxl mb-xxl">
            <Spin />
          </div>
        ) : (
          <div>
            {
              currentItems.filter(x => x.type !== "Management").length > 0 &&
              <>
                <List component="nav">
                  {currentItems.filter(x => x.type !== "Management").map((item) => {
                    return (
                      <Item
                        key={item.path}
                        icon={item.icon}
                        text={item.text}
                        path={item.path}
                      />
                    );
                  })}
                </List>
                <Divider />
              </>
            }
            {
              currentItems.filter(x => x.type === "Management").length > 0 &&
              <>
                <List component="nav">
                  {currentItems.filter(x => x.type === "Management").map((item) => {
                    return (
                      <Item
                        key={item.path}
                        icon={item.icon}
                        text={item.text}
                        path={item.path + ((item.text == "โรงเรียน" && _schoolId && _roles == "User") ? `/${_schoolId}` : "")}
                      />
                    );
                  })}
                </List>
                <Divider />
              </>
            }
          </div>
        )}
        <List component="nav">
          {Config.items_2.map((item) => {
            return (
              <Item
                key={item.path}
                icon={item.icon}
                text={item.text}
                path={item.path}
              />
            );
          })}
        </List>

        <Divider />

        <List>
          <MenuItem button onClick={handleSignOutPromptOpen}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              inset
              primary="ออกจากระบบ"
              primaryTypographyProps={{ style: textStyle }}
            />
          </MenuItem>
        </List>

      </Content>
      <Footer>
        Copyright © {currentYear}
        <br />
        <b>{title}</b>
      </Footer>
      <MuiThemeProvider theme={dialogTheme}>
        <Dialog
          open={signOutPrompt}
          onClose={handleSignOutPromptClose}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ต้องการออกจากระบบ ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSignOutPromptClose} color="default">
              ไม่ใช่
            </Button>
            <Button onClick={handleSignOut} color="primary" autoFocus>
              ใช่
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    </MuiThemeProvider>
  );
};

export default Comp;
