import React from "react";
import { NavLink, withRouter } from "react-router-dom";

import styled from "styled-components";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import PeopleIcon from "@material-ui/icons/People";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarsIcon from "@material-ui/icons/Stars";
import CheckIcon from "@material-ui/icons/CheckCircle";
import MissionIcon from "@material-ui/icons/AssistantPhoto";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import DashboardIcon from "@material-ui/icons/DashboardIcon";
// import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
import HelpIcon from "@material-ui/icons/Help";

import primaryColor from "@material-ui/core/colors/lightBlue";

import Firebase from "./../utils/Firebase";
import Config from "../config";

import Spaces from "./menu.spaces";

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

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signOutPrompt: false,

      email: "-",
    };

    this.unsubscribes = [];

    this.handleSignOutPromptOpen = this.handleSignOutPromptOpen.bind(this);
    this.handleSignOutPromptClose = this.handleSignOutPromptClose.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    const auth = Firebase.auth();

    this.unsubscribes[0] = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ email: user.email });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribes.filter((fn) => !!fn).forEach((fn) => fn());
  }

  handleSignOutPromptOpen() {
    this.setState({ signOutPrompt: true });
  }

  handleSignOutPromptClose() {
    this.setState({ signOutPrompt: false });
  }

  handleSignOut() {
    localStorage.clear();
    this.setState({ signOutPrompt: false });
    Firebase.auth().signOut();
  }

  render() {
    const prefix = "";

    // const beginYear   = '1991';
    const currentYear = new Date().getFullYear();

    const title = "NextGen Education";
    // const href = 'https://google.co.th';
    const { email } = this.state;

    const textStyle = { fontSize: "0.8rem" };

    return (
      <MuiThemeProvider theme={theme}>
        <Header>
          Clever Math
          <small>{email}</small>
        </Header>
        <Spaces />
        <Content>
          <List component="nav">
            <MenuItem
              button
              component={NavLink}
              to={`${prefix}/dashboard`}
              exact
            >
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="Dashboard"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem button component={NavLink} to={`${prefix}/info`} exact>
              <ListItemIcon>
                <BusinessCenterIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="ระดับชั้น/ห้องเรียน"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem
              button
              component={NavLink}
              to={`${prefix}/students`}
              exact
            >
              <ListItemIcon>
                <AssignmentIndIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="นักเรียน"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem button component={NavLink} to={`${prefix}/groups`} exact>
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="กลุ่มเรียน"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            {/* <MenuItem button component={NavLink} to="/sheets" exact>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="ข้อสอบทั้งหมด" />
                        </MenuItem> */}

            <MenuItem button component={NavLink} to={`${prefix}/maps`} exact>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="บทเรียน"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem button component={NavLink} to={`${prefix}/sheets`} exact>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="ข้อสอบ"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem button component={NavLink} to={`${prefix}/quizzes`} exact>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="จัดการข้อสอบ"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem button component={NavLink} to={`${prefix}/rewards`} exact>
              <ListItemIcon>
                <StarsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="รางวัล"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            <MenuItem
              button
              component={NavLink}
              to={`${prefix}/approve-rewards`}
              exact
            >
              <ListItemIcon>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="อนุมัติรางวัล"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>

            {!!Config.mission && (
              <MenuItem
                button
                component={NavLink}
                to={`${prefix}/missions`}
                exact
              >
                <ListItemIcon>
                  <MissionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary="การบ้าน"
                  primaryTypographyProps={{ style: textStyle }}
                />
              </MenuItem>
            )}
          </List>
          <Divider />

          <List component="nav">
            <MenuItem button component={NavLink} to={`${prefix}/howto`} exact>
              <ListItemIcon>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                inset
                primary="วิธีการใช้งาน"
                primaryTypographyProps={{ style: textStyle }}
              />
            </MenuItem>
          </List>

          <Divider />

          {/* Admin */}
          {/* <List component="nav" >

                        <MenuItem button component={NavLink} to="/manage-quizzes" exact>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="จัดการข้อสอบ" />
                        </MenuItem>
                        
                    </List>
                    <Divider /> */}
          {/*  */}

          <List>
            <MenuItem button onClick={this.handleSignOutPromptOpen}>
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
            open={this.state.signOutPrompt}
            onClose={this.handleSignOutPromptClose}
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
              <Button onClick={this.handleSignOutPromptClose} color="default">
                ไม่ใช่
              </Button>
              <Button onClick={this.handleSignOut} color="primary" autoFocus>
                ใช่
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </MuiThemeProvider>
    );
  }
}

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

const MenuItem = styled(ListItem)`
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

export default withRouter(Menu);
