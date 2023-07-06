import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import Config from "../config";

// console.log(Config)

if (firebase.apps.length < 2) {

  if (Config.env == "prod") {
    firebase.initializeApp({
      projectId: "clevermath-official",
      appId: "1:2090541050:web:a1d42cfaebcd736d33ce43",
      databaseURL: "https://clevermath-official.firebaseio.com",
      storageBucket: "clevermath-official.appspot.com",
      locationId: "us-central",
      apiKey: "AIzaSyAb4djYb910xZWA3fBVe3tkG8z6VCM-4iY",
      authDomain: "clevermath-official.firebaseapp.com",
      messagingSenderId: "2090541050",
      measurementId: "G-P3VE40RNPZ",
    });
    firebase.initializeApp(
      {
        storageBucket: "clevermath-official-public",
      },
      "storage-public"
    );
  }
  
  if (Config.env == "dev") {
    console.log(Config);
    firebase.initializeApp({
      apiKey: "AIzaSyDLsfUgy-bh8OkY7xi0JN3fAo4mun2Q7-c",
      authDomain: "clever-math-dev-v2.firebaseapp.com",
      databaseURL: "https://clever-math-dev-v2.firebaseio.com",
      projectId: "clever-math-dev-v2",
      storageBucket: "clever-math-dev-v2.appspot.com",
      messagingSenderId: "718235691142",
      appId: "1:718235691142:web:075b26b1de47a8e26d4907",
      measurementId: "G-2WY6QZ0HBP",
    });
    firebase.initializeApp(
      {
        storageBucket: "clevermath-dev-public",
      },
      "storage-public"
    );
  }

  // Deprecated
  // Production Only

  /* @firebase/firestore: Firestore (7.24.0): The setting 'timestampsInSnapshots: true' is no longer required and should be removed. */
  // const firestore = firebase.firestore();
  // firestore.settings({ timestampsInSnapshots: true });

  if (Config.host == "localhost") {
    firebase.functions().useFunctionsEmulator("http://localhost:5001");
  }

  //HKG start
  //keep the old app around and initialize a new app with a different name:
  //How to use: firebase.app('hkg'). ...... instead of firebase.
  //Example: firebase.app('hkg').firestore ()
  var hkgConfig = {
    apiKey: "AIzaSyBUEOR-C3NAg1p4c4TcXMXzBbcVlN1C-nc",
    authDomain: "clever-math-hkg.firebaseapp.com",
    databaseURL: "https://clever-math-hkg.firebaseio.com",
    projectId: "clever-math-hkg",
    storageBucket: "clever-math-hkg.appspot.com",
    messagingSenderId: "454759756507",
    appId: "1:454759756507:web:d9596e512108a847",
  };

  firebase.initializeApp(hkgConfig, "hkg");
  //HKG ends
}

export default firebase;
