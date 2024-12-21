import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAhpcd0AoZlj3NREiN9lLZyjVvA_M3dN48",
  authDomain: "tutoring-school-1018.firebaseapp.com",
  projectId: "tutoring-school-1018",
  storageBucket: "tutoring-school-1018.appspot.com",
  messagingSenderId: "99308526453",
  appId: "1:99308526453:web:13916344224aebaa94d13c",
};

const app = firebase.initializeApp(FIREBASE_CONFIG);

export { firebase };
