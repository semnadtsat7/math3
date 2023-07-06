import http from "../../utils/FirebaseCloud";

async function getAllAffiliations() {
  let res = await http.callAsia(`getAllAffiliations`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function createAffiliation(
  data = {
    name: {
      english: "Bangkok Metropolitan Administration",
      abbreviationEnglish: "BMA",
      abbreviationThai: "กทม.",
      thai: "กรุงเทพมหานคร",
    },
    type: "educational-service-area",
  }
) {
  var body = {
    data: data,
  };
  let res = await http.callAsia(`createAffiliation`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function deleteAffiliationById(affiliationId) {
  var body = {
    data: {
      affiliationId: affiliationId,
    },
  };
  let res = await http.callAsia(`deleteAffiliationById`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getAllAffiliations,
  createAffiliation,
  deleteAffiliationById,
};
