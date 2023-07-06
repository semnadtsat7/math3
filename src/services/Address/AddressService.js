import http from "../../utils/FirebaseCloud";

async function getAddressByZipcode(zipcode) {
  var body = {
    data: {
      zipcode: zipcode,
    },
  };

  let res = await http.callAsia(`getAddressByZipcode`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getAllRegionName() {
  let res = await http.callAsia(`getAllRegionName`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getProvinceDetailByGeocode(geocode) {
  var body = {
    data: {
      geocode: geocode,
    },
  };

  let res = await http.callAsia(`getProvinceDetailByGeocode`, body);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

async function getAllProvince() {
  let res = await http.callAsia(`getAllProvince`);
  if (res?.data?.result) {
    return res?.data?.result;
  }

  return res.data;
}

export default {
  getAddressByZipcode,
  getAllRegionName,
  getProvinceDetailByGeocode,
  getAllProvince
};
