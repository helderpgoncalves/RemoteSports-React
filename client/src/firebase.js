import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

//dados da firebase
var firebaseConfig = {
  apiKey: "AIzaSyBQLHu_AYWJ8Jv5ZrnlGvhXFbSkN8VVHC0",
  authDomain: "remotesports.firebaseapp.com",
  databaseURL: "https://remotesports.firebaseio.com",
  projectId: "remotesports",
  storageBucket: "remotesports.appspot.com",
  messagingSenderId: "827133357695",
  appId: "1:827133357695:web:8a1937cd9f650ebc96d94a",
  measurementId: "G-9LM6ZBKF5Y",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const storage = firebase.storage();
