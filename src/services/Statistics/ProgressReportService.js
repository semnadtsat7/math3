import http from "../../utils/FirebaseCloud";

//outdated because soda fixes problem with old and new homework datas in backend
// async function getClassKPIByTeacherIdAsync(teacherId, filter) {
//   var body = {
//     data: {
//       teacherId: teacherId,
//       filter: filter,
//     },
//   };
//   let res = await http.callAsia2(`progessReport-getClassKPIByTeacherId`, body);

//   if (res.status) {
//     return {
//       code: res.status,
//       error: "มีบางอย่างผิดพลาด",
//     };
//   }

//   if (res?.data?.result) {
//     return res?.data?.result;
//   }

//   return res?.data;
// }

// async function getTeacherKPIByUserIdAsync(userId, filter) {
//   var body = {
//     data: {
//       userId: userId,
//       filter: filter,
//     },
//   };
//   let res = await http.callAsia2(`progessReport-getTeacherKPIByUserId`, body);

//   if (res.status) {
//     return {
//       code: res.status,
//       error: "มีบางอย่างผิดพลาด",
//     };
//   }

//   if (res?.data?.result) {
//     return res?.data?.result;
//   }

//   return res?.data;
// }

async function getTeachersInfoBySchoolIdAsync(schoolId, filter) {
  var body = {
    data: {
      schoolId: schoolId,
      filter: filter,
    },
  };
  let res = await http.callAsia2(
    `v3-teacher-progessReport-getTeacherReport`,
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

async function getSchoolInfoBySchoolIdAsync(schoolId, filter) {
  var body = {
    data: {
      schoolId: schoolId,
      filter: filter,
    },
  };
  let res = await http.callAsia2(`v3-teacher-progessReport-getSchoolReport`, body);

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

async function getSchoolsInfoByESAAsync(esa, filter) {
  var body = {
    data: {
      esa: esa,
      filter: filter,
    },
  };
  //let res = await http.callAsia2(`progessReport-getSchoolsInfoByESA`, body);
  let res = await http.callAsia2(`v3-teacher-progessReport-getESAReport`, body);

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

async function getGIInfoByGIIdAsync(gi, filter) {
  var body = {
    data: {
      gi: gi,
      filter: filter,
    },
  };
  let res = await http.callAsia2(`v3-teacher-progessReport-getGIReport`, body);

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

async function getProgessReportAsync(filter) {
  var body = {
    data: {
      filter: filter,
    },
  };
  let res = await http.callAsia2(`v3-teacher-progessReport-getProgessReport`, body);

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
  // getClassKPIByTeacherIdAsync,
  // getTeacherKPIByUserIdAsync,
  getTeachersInfoBySchoolIdAsync,
  getSchoolInfoBySchoolIdAsync,
  getSchoolsInfoByESAAsync,
  getGIInfoByGIIdAsync,
  getProgessReportAsync,
};
