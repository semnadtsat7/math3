import http from "../../utils/FirebaseCloud";

async function getAllUser() {
  // example id
  let res = await http.callAsia(`getAllUser`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getAllUserV2() {
  // example id
  let res = await http.callAsia2(`utils-getUsers`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getUserByUserId(uid) {
  var body = {
    data: {
      uid: uid,
    },
  };
  let res = await http.callAsia(`getUserByUserId`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function saveUserProfile(
  data = {
    permissionId: "BtLvKwxxYcEnIhNCYo16",
    permissions: {
      provinces: {
        edit: false,
        view: false,
        create: false,
      },
      schools: {
        edit: false,
        view: false,
        create: true,
      },
    },
    userId: "SJ6zXIv1SQsaXuPJC72XnULtzgNT",
    roleId: "wlsbMfWvUXjb9bQaasfY",
    positionId: "null",
    districtInspector: "null",
    educationServiceArea: "null",
    firstName: "null",
    lastName: "null",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`saveUserProfile`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function createUserProfile(uid) {
  var body = {
    data: {
      uid: uid,
    },
  };
  let res = await http.callAsia(`createUserProfile`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getUserData(uid) {
  var body = {
    data: {
      uid: uid,
    },
  };
  let res = await http.callAsia(`getUserData`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getUserInfo(userId) {
  var body = {
    data: {
      userId: userId,
    },
  };
  let res = await http.callAsia2(`getUserInfo`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}


async function updateUserProfile(
  data = {
    userId: "userId",
    namePrefix: "namePrefix",
    firstName: "firstName",
    lastName: "lastName",
    lineId: "lineId",
    email: "email",
    phoneNumber: "phoneNumber",
    section: "section",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`updateUserProfile`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function uploadProfileImageAsync(
  data = {
    binaryBuffer: "binaryBuffer",
    fileExtension: "png",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia2(`v3-utility-uploadProfileImage`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getAllUser,
  getAllUserV2,
  saveUserProfile,
  getUserByUserId,
  createUserProfile,
  getUserData,
  updateUserProfile,
  getUserInfo,
  uploadProfileImageAsync,
};
