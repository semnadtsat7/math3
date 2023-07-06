import http from "../../utils/FirebaseCloud";

async function getPermissionsName(uid) {
  var body = {
    data: {
      uid: uid,
    },
  };
  let res = await http.callAsia(`getPermissionsName`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getPermissionsName,
};
