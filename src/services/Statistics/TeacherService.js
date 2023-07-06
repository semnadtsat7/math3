import http from "../../utils/FirebaseCloud";

async function getSectionLessionsBySchoolId(
  schoolId = "LiY6b96VhhrY4cDft15m",
  sectionId = "2tAs6OONTAgw9pa18szT"
) {
  // example id
  var body = {
    data: {
      schoolId: schoolId,
      sectionId: sectionId,
    },
  };

  let res = await http.callAsia2(`getSectionLessons`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getTeacherOverviewAsync(
  userId = "s0OPDZhqAezdxgTdXtYKwd73Ra3B2"
) {
  var body = {
    data: {
      userId: userId,
    },
  };
  // example userId
  let res = await http.callAsia2(`getTeacherOverview`, body);

  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getStudentsOverviewAsync(teacherId = "0B3oeZi0W9cC0HxykKjn") {
  var body = {
    data: {
      teacherId: teacherId,
    },
  };
  // example userId
  //let res = await http.callAsia2(`getStudentsOverview`, body);
  let res = await http.callAsia2(`v3-teacher-getWebStudentsOverview`, body);

  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function createUserNotesAsync(
  data = {
    data: {},
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`user-notes-create`, body);

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

async function getUserNotesAsync(
  data = {
    data: {},
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`user-notes-get`, body);

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

async function deleteUserNotesAsync(noteId) {
  var body = {
    data: {
      noteId: noteId,
    },
  };
  let res = await http.callAsia2(`user-notes-delete`, body);

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

async function createMission(
  data = {
    startDate: "",
    endDate: "",
    teacherId: "",
    groupId: "",
    lessonId: "",
    reward: "",
    quizzesArray: "",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-teacher-missions-createMission`, body);

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

async function getLessonsChoices(
  data = {
    teacherId: "", //Hcp9aoxiluUZ6oVGoGbj
    groupId: "", //6yyUJrk1fsCF7iB2Ppgh
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-teacher-missions-getLessonsChoices`, body);

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

async function getSubLessonsChoices(
  data = {
    mapId: ""
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-teacher-missions-getSubLessonsChoices`, body);

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

async function getRewardsChoices(
  data = {
    teacherId: ""
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-teacher-mission-getRewardsChoices`, body);

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

async function updateMission(
  data = {
    startDate: "",
    endDate: "",
    teacherId: "",
    groupId: "",
    lessonId: "",
    reward: "",
    quizzesArray: "",
    missionId: "",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-teacher-mission-updateMission`, body);

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

async function getMissions(
  data = {
    teacherId: "",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-teacher-mission-getMissions`, body);

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

async function getProfileImage(
  data = {
    teacherId: "",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-utility-userSignIn`, body);

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
  getSectionLessionsBySchoolId,
  getTeacherOverviewAsync,
  getStudentsOverviewAsync,
  createUserNotesAsync,
  getUserNotesAsync,
  deleteUserNotesAsync,
  getMissions,
  createMission,
  updateMission,
  getLessonsChoices,
  getSubLessonsChoices,
  getRewardsChoices,
  getProfileImage,
};
