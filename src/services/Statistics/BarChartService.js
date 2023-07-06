import http from "../../utils/FirebaseCloud";

async function getBarChartStatisticsBySchoolIdAsync(id = "dPYFRPM5T1lydeg2shir") { // example id
  return await http.callAsia(`getBarChartStatisticsBySchoolId/${id}`);
}

export default {
  getBarChartStatisticsBySchoolIdAsync,
};
