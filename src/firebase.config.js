// <!-- The core Firebase JS SDK is always required and must be listed first -->
{
  /* <script src="https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js"></script> */
}

// <!-- TODO: Add SDKs for Firebase products that you want to use
//firebase.google.com/docs/web/setup#available-libraries -->
https: {
  /* <script src="https://www.gstatic.com/firebasejs/7.23.0/firebase-analytics.js"></script> */
}

{
  /* <script> */
}
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import Config from "../config"

let config_credential
if (Config.env == "prod") {
  // For Production, Firebase Connection
  config_credential = {
    "projectId": "clevermath-official",
    "appId": "1:2090541050:web:a1d42cfaebcd736d33ce43",
    "databaseURL": "https://clevermath-official.firebaseio.com",
    "storageBucket": "clevermath-official.appspot.com",
    "apiKey": "AIzaSyAb4djYb910xZWA3fBVe3tkG8z6VCM-4iY",
    "authDomain": "clevermath-official.firebaseapp.com",
    "messagingSenderId": "2090541050",
    "measurementId": "G-P3VE40RNPZ"
  };
}

if (Config.env == "dev") {
  // For Development, Firebase Connection
  config_credential = {
    projectId: 'clever-math-dev-v2',
    appId: '1:718235691142:web:075b26b1de47a8e26d4907',
    databaseURL: 'https://clever-math-dev-v2.firebaseio.com',
    storageBucket: 'clever-math-dev-v2.appspot.com',
    apiKey: 'AIzaSyDLsfUgy-bh8OkY7xi0JN3fAo4mun2Q7-c',
    authDomain: 'clever-math-dev-v2.firebaseapp.com',
    messagingSenderId: '718235691142',
    measurementId: 'G-2WY6QZ0HBP'
  };
}
export const Config = config_credential

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// </script>