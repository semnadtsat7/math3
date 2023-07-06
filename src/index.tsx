import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import ReactGA from 'react-ga';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

import "./index.scss";

import { createGlobalStyle } from "styled-components";
import { CssBaseline } from "@material-ui/core";

import MomentUtils from "material-ui-pickers/utils/moment-utils";
import { MuiPickersUtilsProvider } from "material-ui-pickers";

import Config from "./config";
import { getPages } from "./pages";

import Home from "./pages/home";

import SignInPageV4 from "./pages/v4.sign-in";

import * as Api from "./utils/QueryAPI";
import { UserService } from "./services/User";


import Loader from "./Loader";

import moment from "moment";
import "moment/locale/th";

import Firebase from "./utils/Firebase";
import AppContext from "./AppContext";

import Root from "./root";

//Google Analytic
const TRACKING_ID = "G-P3VE40RNPZ";
//Initializing GA and Tracking Pageviews:
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);


const Global = createGlobalStyle`
    html, body, #root
    {
        width: 100%;
        height: 100%;
    }
`;

interface RoutesProps {
  spaceID: string;
}

const Routes: React.FC<RoutesProps> = ({ spaceID }) => {

  const local_id = window.localStorage.getItem("local_id");
  const [currentItems, setCurrentItems] = useState([...Config.items_3, ...Config.items_1, ...Config.items_2]);
  const [loading, setLoading] = useState(true);

  const refreshItem = (rawRoles: string, rawPositions: string) => {
    const _items = [...currentItems].filter(
      (x) => {
        if (x.positions[0] === "All" && x.roles[0] === "All") return true

        if (rawRoles === "User") {
          return x.positions.indexOf(rawPositions) !== -1
        } else {
          return x.roles.indexOf(rawRoles) !== -1
        }
      }

    );

    // if (_items.length > 0) {
    setCurrentItems(_items);
    // }
  }

  function renderRoute(routes: Array<any>) {
    return routes.map((page) => {
      // console.log(page.name, page.path, "getPages: " + !!getPages(page.name));
      return <Route exact path={page.path} component={getPages(page.name)} />
    })
  }

  function renderRouteRedirect(routes: Array<any>) {
    setTimeout(() => {
      for (let i = 0; i < routes.length; i++) {
        const item = routes[i];
        if (Object.keys(item).includes("icon")) {
          return <Redirect to={item.routes[0].path} />
        }
      }
    }, 500);
  }

  useEffect(() => {

    UserService.getUserData(local_id).then((x) => {
      if (x) {
        const { roles, positions, schoolId, provinceId, districtInspector, educationServiceArea, namePrefix, affiliationName  } = x;

        const _roles = roles?.name ?? "User"
        const _positions = positions?.id ?? "S-4"

        window.localStorage.setItem("roles", _roles);
        window.localStorage.setItem("positions", _positions);
        window.localStorage.setItem("schoolId", schoolId ?? "");
        window.localStorage.setItem("provinceId", provinceId ?? "");
        window.localStorage.setItem("state", "checked");
        window.localStorage.setItem("districtInspector", districtInspector ?? "");
        window.localStorage.setItem("educationServiceArea", educationServiceArea ?? "");
        window.localStorage.setItem("namePrefix", namePrefix ?? "");
        window.localStorage.setItem("affiliationName", affiliationName ?? "");

        refreshItem(_roles as string, _positions as string);
        setLoading(false)
      }
    })
  }, [local_id])

  // Function to clear complete cache data
  useEffect(() => {
    const clearCacheData = () => {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
      //alert('Complete Cache Cleared')
    };

    clearCacheData()
    return;
  }, [local_id])

  return (
    <Root spaceID={spaceID}>
      <Switch>
        {
          !loading &&
          currentItems.map((item) => {
            if (item.routes) {
              return renderRoute(item.routes)
            }
          })
        }

        {
          !loading &&
          renderRouteRedirect(currentItems)
        }

        {/* <Redirect to="/" /> */}

        {/* Home */}
        <Route exact path="/" component={Home} />

        {/* <Redirect to="/" /> */}
      </Switch>
    </Root>
  );
};

function App() {
  const [action, setAction] = useState("validate");
  const [space, setSpace] = useState("");
  const [uid, setUid] = useState("");

  const createThreads = async (students: any) => {
    // create chat thread follow the own students from fireStore
    const chatThreads = await Promise.all(
      students.map(async (student: any) => {
        const chatID = `${space}_${student._id}`;
        const eventRef = await Firebase.database().ref("chats").child(chatID);
        const snapshot = await eventRef.once("value");
        let chatDetail;
        if (snapshot.val() === null) {
          chatDetail = {
            id: chatID,
            teacherID: space,
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
            .child(space)
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
    const filter = {
      groupID: "none",
      sheetID: "none",
      title: "none",
      startAt: moment().endOf("day").valueOf(),
      endAt: moment(moment().endOf("day").valueOf())
        .subtract(1, "year")
        .startOf("day"),
    };
    const options = { accurate: false };
    const payload = {
      name: "students",
      data: { spaceID: space, filter, options },
    };
    const data = await Api.exec("page_v2", payload);
    const { students } = data;
    await createThreads(students);
  };

  useEffect(() => {
    if (space === "") {
      return;
    }
    getStudents();
  }, [space]);

  function handleMount() {
    const storage = window.localStorage;

    if (!!storage.getItem("space")) {
      setAction("validate");
    } else {
      setAction("sign-in");
    }

    return Firebase.auth().onAuthStateChanged(async (user) => {
      if (!!user) {
        const space = storage.getItem("space") || user.uid;

        storage.setItem("space", space);
        storage.setItem("local_id", user.uid);

        setSpace(space);
        setUid(user.uid);
        setAction("ready");
      } else {
        setAction("sign-in");
      }
    });
  }

  function handleSpaceChanged() {
    if (!!space) {
      window.localStorage.setItem("space", space);
      // window.localStorage.setItem("local_id", space);
    }
    if (!!uid) {
      window.localStorage.setItem("local_id", uid);
    }
    // else
    // {
    //     window.localStorage.removeItem ('space')
    // }
  }

  useEffect(handleMount, []);
  useEffect(handleSpaceChanged, [space, uid]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale={`th`}>
      <CssBaseline />
      <Global />
      {action === "validate" ? (
        <Loader />
      ) : // <div style={{ padding: `8px 12px` }} >กำลังโหลด . . .</div>
        action === "sign-in" ? (
          <SignInPageV4 />
        ) : (
          <AppContext.Provider value={{ space, setSpace }}>
            <Router>
              <Routes spaceID={space} />
            </Router>
          </AppContext.Provider>
        )}
    </MuiPickersUtilsProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
