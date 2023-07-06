import http from "../../utils/FirebaseCloud";

async function getSchoolProfileBySchoolIdAsync(id = "s51l3CWqvjc65aNj3BSA") {
  // example id
  let res = await http.callAsia(`getSchoolProfileBySchoolId/${id}`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getSchoolRankingBySchoolIdAsync(id = "s51l3CWqvjc65aNj3BSA") {
  // example id
  let res = await http.callAsia(`getSchoolRankingBySchoolId/${id}`);

  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getSchoolsStatisticsBySchoolIdAsync(
  id = "s51l3CWqvjc65aNj3BSA"
) {
  let res = await http.callAsia(`getSchoolStatisticsBySchoolId/${id}`);

  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getSchoolsStatisticsByProvinceAsync(
  data = {
    schoolName: "",
    province: "10",
    affiliation: "",
    esa: "",
    district: "",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`getSchoolStatisticsByProvince`, body);

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

async function getSchoolsStatisticsAllDistrictByProvinceAsync(
  data = {
    data: {
      province: "กรุงเทพมหานคร",
    },
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(
    `getSchoolStatisticsByProvinceAllDistrict`,
    body
  );

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

async function getBarChartStatisticsBySchoolIdAsync(
  id = "s51l3CWqvjc65aNj3BSA",
  affiliationId,
  compareWith = "affiliation"
) {
  var body = {
    data: {
      compareWith: compareWith,
      affiliationId: affiliationId,
    },
  };
  // example id
  let res = await http.callAsia(`getBarChartStatisticsBySchoolId/${id}`, body);

  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getCountryOverviewAsync() {
  var body = {
    data: {
      option: "provincial",
    },
  };
  let res = await http.callAsia2(`getCountryOverview`, body);

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

async function getRegionOverviewAsync() {
  var body = {
    data: {
      option: "region",
    },
  };
  let res = await http.callAsia2(`getCountryOverview`, body);

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

async function getAffiliationOverviewAsync(
  data = {
    data: {},
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`getAffiliationOverview`, body);

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

async function getEsaOverviewAsync(
  data = {
    data: {},
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`getESAOverview`, body);

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

async function getUserPositionTeacherBySchoolIdAsync(schoolId) {
  var body = {
    data: {
      schoolId: schoolId,
    },
  };
  let res = await http.callAsia2(`getUserPositionTeacherBySchoolId`, body);

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

async function getTeachersByUserIdAsync(userId) {
  var body = {
    data: {
      userId: userId,
    },
  };
  let res = await http.callAsia2(`getTeachersByUserId`, body);

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
  getSchoolProfileBySchoolIdAsync,
  getSchoolRankingBySchoolIdAsync,
  getSchoolsStatisticsBySchoolIdAsync,
  getSchoolsStatisticsByProvinceAsync,
  getSchoolsStatisticsAllDistrictByProvinceAsync,
  getBarChartStatisticsBySchoolIdAsync,
  getCountryOverviewAsync,
  getRegionOverviewAsync,
  getAffiliationOverviewAsync,
  getEsaOverviewAsync,
  getUserPositionTeacherBySchoolIdAsync,
  getTeachersByUserIdAsync,
};
