import http from "../../utils/FirebaseCloud";

async function getAllRoles() {
  let res = await http.callAsia(`getAllRoles`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getAllRoles,
};
