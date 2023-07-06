import axios from 'axios';
import Config from "../../config"

// API page_v2
// const BASE_URL = 'http://localhost:5000/clever-math-dev-v2/us-central1/';
let BASE_URL = ''
let BASE_URL_official = ''
if (Config.env === 'prod') {
  BASE_URL = 'https://us-central1-clevermath-app.cloudfunctions.net/';
  BASE_URL_official = 'https://us-central1-clevermath-official.cloudfunctions.net/';
}
if (Config.env === 'dev') {
  BASE_URL = 'https://us-central1-clever-math-dev-v2.cloudfunctions.net/';
  BASE_URL_official = 'https://us-central1-clever-math-dev-v2.cloudfunctions.net/';
}

export async function exec(name: string, data: any) {
  const url = BASE_URL + name;
  const res = await axios.post(url, { data });

  return res.data?.result;
}

export default {
  BASE_URL: BASE_URL,
  BASE_URL_official: BASE_URL_official
}