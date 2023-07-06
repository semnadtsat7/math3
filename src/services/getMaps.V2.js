import http from "../utils/FirebaseCloud";

//filter: ONET, สสวท., CM@HOME, มรภ.สวนสุนันทา
async function getMaps2(filter) {
  var body = {
    data: {
      filter: filter,
    },
  };
  let res = await http.callAsia2(`utils-getPublishedMaps`, body);

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
  getMaps2,
};
