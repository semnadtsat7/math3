import axios from "axios";
import BASE_URL from "./QueryAPI/index";
import Firebase from "../utils/Firebase";

// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const res = await getRefreshToken();

          const { id_token, refresh_token, user_id, expires_in } = res.data;

          window.localStorage.setItem("access_token", id_token);
          window.localStorage.setItem("refresh_token", refresh_token);
          window.localStorage.setItem("local_id", user_id);
          window.localStorage.setItem("expires_in", expires_in);

          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${id_token}`;

          return instance(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);

async function getLocalAccessToken() {
  const auth = Firebase.auth();
  const token =
    await auth.currentUser.getIdToken().then((token) => {
      return token
    });
  return token
}

function getLocalRefreshToken() {
  return window.localStorage.getItem("refresh_token");
}

function getRefreshToken() {
  var token = getLocalRefreshToken();

  return axios.post(
    "https://securetoken.googleapis.com/v1/token?key=AIzaSyDgRL0EHNmrV4jBCAfd0lIDSXQar6hcOPk",
    {
      grant_type: "refresh_token",
      refresh_token: token,
    }
  );
}

async function signInAsync(username, password) {
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("local_id");
  window.localStorage.removeItem("expires_in");

  try {
    let res = await instance.post(
      "/accounts:signInWithPassword?key=AIzaSyDLsfUgy-bh8OkY7xi0JN3fAo4mun2Q7-c",
      {
        email: username,
        password: password,
        returnSecureToken: true,
      }
    );

    if (res?.data) {
      const { idToken, refreshToken, localId, expiresIn } = res.data;
      window.localStorage.setItem("access_token", idToken);
      window.localStorage.setItem("refresh_token", refreshToken);
      window.localStorage.setItem("local_id", localId);
      window.localStorage.setItem("expires_in", expiresIn);
    }

    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function post(
  path,
  body = { data: "" },
  headers = {
    "Content-Type": "application/json",
  }
) {
  let response = await instance.post(`${BASE_URL.BASE_URL_official}${path}`, body, {
    headers: headers,
  }).then((res) => {
    return res
  }).catch(e => {
    // console.log(e);
    return e.response
  })
  return response
}

async function call(
  path,
  body = { data: "" },
  headers = {
    "Content-Type": "application/json",
  }
) {
  let response = await
    Firebase.functions().httpsCallable(path)({ ...body.data })
      .then((res) => {
        return res
      }).catch(e => {

        return {
          status: e.code,
          message: e.message,
          details: e.details
        }
      })
  // console.log(response);
  return response
}

async function callAsia(
  path,
  body = { data: "" },
  headers = {
    "Content-Type": "application/json",
  }
) {
  const app = Firebase.app();
  const functions = app.functions("asia-southeast1");
  let response = await
    functions.httpsCallable("v2-"+path)({ ...body.data })
      .then((res) => {
        return res
      }).catch(e => {

        return {
          status: e.code,
          message: e.message,
          details: e.details
        }
      })
  // console.log(response);
  return response
}

async function callAsia2(
  path,
  body = { data: "" },
  headers = {
    "Content-Type": "application/json",
  }
) {
  const app = Firebase.app();
  const functions = app.functions("asia-southeast1");
  let response = await
    functions.httpsCallable(path)({ ...body.data })
      .then((res) => {
        return res
      }).catch(e => {

        return {
          status: e.code,
          message: e.message,
          details: e.details
        }
      })
  // console.log(response);
  return response
}

async function callUS(
  path,
  body = { data: "" },
  headers = {
    "Content-Type": "application/json",
  }
) {
  const app = Firebase.app();
  const functions = app.functions("us-central1");
  let response = await
    functions.httpsCallable(path)({ ...body.data })
      .then((res) => {
        return res
      }).catch(e => {

        return {
          status: e.code,
          message: e.message,
          details: e.details
        }
      })
  // console.log(response);
  return response
}

export default {
  post,
  call,
  callAsia,
  callAsia2,
  callUS,
  signInAsync,
};
