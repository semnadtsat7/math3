import http from "../../utils/FirebaseCloud";

async function getStudentRankingByStudentIdAsync(id = "vujOFxaS8hDMg0fTes1z") {
  let res = await http.callAsia(`getStudentRankingByStudentId/${id}`);
  if (res?.data?.result) {
    return res?.data?.result[id];
  }

  return res.data;
}

async function getStudentsStatisticsByStudentIdAsync(
  id = "vujOFxaS8hDMg0fTes1z"
) {
  let res = await http.callAsia(`getStudentStatisticsByStudentId/${id}`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getStudentPinAsync(
  data = {
    slug: "", //kb1402
    customId: "", //1020
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-admin-checkStudentPin`, body);

  if (res.status) {
    return {
      code: res.status,
      error: "มีบางอย่างผิดพลาด",
    };
  }
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res?.data;
}

export default {
  getStudentRankingByStudentIdAsync,
  getStudentsStatisticsByStudentIdAsync,
  getStudentPinAsync,
};
