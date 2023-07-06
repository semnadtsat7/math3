import http from "../../utils/FirebaseCloud";

async function getAllPositions() {
  let res = await http.callAsia(`getAllPositions`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getAllPositions,
};
