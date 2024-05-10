import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbMDlmbTi4_dgDwRqb9KQgsfCK7EhV4tc",
  authDomain: "molatakipp.firebaseapp.com",
  projectId: "molatakipp",
  storageBucket: "molatakipp.appspot.com",
  messagingSenderId: "374560607072",
  appId: "1:374560607072:web:0595b9ae52c86c91b5ec05",
  measurementId: "G-38460P0F7Z",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
