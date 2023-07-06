import http from "../../utils/FirebaseCloud";
import axios from "axios";

const filterDefault = {
  filter: {
    text: "",
    affiliation: [],
    geoCode: "",
  },
};
async function getAllSchools(data = filterDefault) {
  // example id
  var body = {
    data: {
      ...data,
    },
  };
  let res = await http.callAsia(`getAllSchools`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getAllTeacherBySchoolId(schoolId = "KyDD7Lx9n6Il1fI3wGBl") {
  // example id
  var body = {
    data: {
      schoolId: schoolId,
    },
  };
  let res = await http.callAsia(`getAllTeacherBySchoolId`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getAllTeacherByUser() {
  // example id
  let res = await http.callAsia(`getAllTeacherByUser`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getAllTeacherByAllUserInSchool(schoolId) {
  // example id
  var body = {
    data: {
      schoolId: schoolId,
    },
  };
  let res = await http.callAsia(`getAllTeacherByAllUserInSchool`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function createSchool(data) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`createSchool`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function deleteTeacherBySchoolId(teacherId) {
  var body = {
    data: {
      teacherId: teacherId,
    },
  };
  let res = await http.callAsia(`deleteTeacherBySchoolId`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function saveTeacherBySchoolId(schoolId, teachersData) {
  var body = {
    data: {
      schoolId: schoolId,
      teachersData: teachersData,
    },
  };
  let res = await http.callAsia(`saveTeacherBySchoolId`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getSchoolBySchoolId(schoolId) {
  var body = {
    data: {
      schoolId: schoolId,
    },
  };
  let res = await http.callAsia(`getSchoolBySchoolId`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function createImportSchoolCSV(file) {
  var formData = new FormData();

  formData.append("schoolCSV", file);

  const headers = {
    "content-type": "multipart/form-data",
    Accept: "*/*",
  };

  let res = await http.post("createImportSchoolCSV", formData, headers);
  return res;
}

async function deleteSchoolById(schoolId, confirmDeleteTeacher) {
  var body = {
    data: {
      schoolId: schoolId,
      confirmDeleteTeacher: confirmDeleteTeacher,
    },
  };
  let res = await http.callAsia(`deleteSchoolById`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getStudentsByTeacherID(data) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`getStudentsByTeacherID`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getStudentsByTeacherIDs(data) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`getStudentsByTeacherIDs`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}


async function getGroupsByTeacherID(data) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`getGroupsByTeacherID`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getSchoolProfileBySchoolId(schoolId) {
  var body = {
    data: {
      schoolId: schoolId,
    },
  };
  let res = await http.callAsia(`getSchoolProfileBySchoolId`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function saveSchool(data) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`saveSchool`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getSchoolsStatisticsFile(
  data = {
    data: {},
  }
) {
  var body = {
    data: data,
  };
  //let res = await http.callAsia2(`getSchoolsStatisticsFile`, body); api เก่า
  let res = await http.callAsia2(`admin-getPreProcessedData`, body); 
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function updateAdminSchoolTableData(data) {
  var body = {
    data: data
  };
  //let res = await http.callAsia2(`schoolsStatisticsSummary`, body); api เก่า
  let res = await http.callAsia2(`admin-preProcessingData`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getAllSchools,
  getAllTeacherBySchoolId,
  getAllTeacherByUser,
  createSchool,
  deleteTeacherBySchoolId,
  saveTeacherBySchoolId,
  getSchoolBySchoolId,
  createImportSchoolCSV,
  deleteSchoolById,
  getStudentsByTeacherID,
  getStudentsByTeacherIDs,
  getGroupsByTeacherID,
  getAllTeacherByAllUserInSchool,
  getSchoolProfileBySchoolId,
  saveSchool,
  getSchoolsStatisticsFile,
  updateAdminSchoolTableData
};
