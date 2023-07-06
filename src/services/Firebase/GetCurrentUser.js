import Firebase from "firebase/app";

export default function currentUserId() {
  const space = window.localStorage.getItem("space");
  const currentUserId = space || Firebase.auth().currentUser.uid;

  return currentUserId;
}
